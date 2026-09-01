import type { NewsBannerProps } from "../components/NewsBanner";

const RSS_URL = "https://news.ltn.com.tw/rss/sports.xml";
const REVALIDATE_SECONDS = 1800; // 30 minutes
const PER_CATEGORY = 5;
const IMAGE_FETCH_TIMEOUT_MS = 4000;

// Fallback photos already in the project (the same ones the original
// static mock content used) -- shown when a real article's og:image can't
// be resolved in time, so a slow/blocking source never breaks the row.
const FALLBACK_IMAGES = [
  "/assets/sports-news/argentina-1.jpg",
  "/assets/sports-news/messi.jpg",
  "/assets/sports-news/mlb-lee.jpg",
  "/assets/sports-news/mlb-rankings.jpg",
  "/assets/sports-news/argentina-2.jpg",
];

export type NewsCategory = "all" | "football" | "basketball" | "baseball";

type RawItem = {
  title: string;
  link: string;
  category: NewsCategory | "other";
};

// 自由時報 (LTN) publishes one general sports RSS feed, not a separate
// feed per sport -- category tabs are produced by keyword-matching each
// headline instead of hitting 4 different feed URLs. "all" isn't just
// "no filter": it's every item regardless of category, in feed order.
const CATEGORY_KEYWORDS: Record<Exclude<NewsCategory, "all">, string[]> = {
  football: ["足球", "世足", "英超", "西甲", "歐冠", "世界盃", "中華隊足球", "FIFA"],
  basketball: ["籃球", "NBA", "SBL", "PLG", "TPBL", "女籃", "中華籃"],
  baseball: ["棒球", "MLB", "中職", "大聯盟", "日職", "統一獅", "中信兄弟", "樂天桃猿", "富邦悍將", "味全龍", "台鋼雄鷹"],
};

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function classify(title: string): NewsCategory | "other" {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => title.includes(kw))) return category as NewsCategory;
  }
  return "other";
}

async function fetchRawItems(): Promise<RawItem[]> {
  const res = await fetch(RSS_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { "User-Agent": "Mozilla/5.0 (compatible; wu88-sports-news/1.0)" },
  });
  if (!res.ok) return [];
  const xml = await res.text();

  const items: RawItem[] = [];
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  for (const block of itemBlocks) {
    const titleMatch = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/);
    if (!titleMatch || !linkMatch) continue;
    const title = decodeXmlEntities(titleMatch[1].trim());
    const link = decodeXmlEntities(linkMatch[1].trim());
    items.push({ title, link, category: classify(title) });
  }
  return items;
}

// LTN's own RSS carries no image/enclosure -- only a direct (non-redirect)
// article URL, so a plain fetch + og:image regex on the real page works
// reliably (unlike Google News' JS-only redirect links, which can't be
// resolved server-side at all). Aborted after a short timeout so one slow
// article never holds up the whole row.
async function resolveImage(link: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(link, {
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; wu88-sports-news/1.0)" },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    return match ? match[1] : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getSportsNewsByCategory(): Promise<Record<NewsCategory, NewsBannerProps[]>> {
  const items = await fetchRawItems();

  const selected: Record<NewsCategory, RawItem[]> = {
    all: items.slice(0, PER_CATEGORY),
    football: items.filter((i) => i.category === "football").slice(0, PER_CATEGORY),
    basketball: items.filter((i) => i.category === "basketball").slice(0, PER_CATEGORY),
    baseball: items.filter((i) => i.category === "baseball").slice(0, PER_CATEGORY),
  };

  // Resolve each distinct article's image once, even if it shows up in
  // both "all" and its own category, instead of re-fetching it twice.
  const uniqueLinks = Array.from(new Set(Object.values(selected).flat().map((i) => i.link)));
  const resolvedEntries = await Promise.all(uniqueLinks.map(async (link) => [link, await resolveImage(link)] as const));
  const imageByLink = new Map(resolvedEntries);

  let fallbackIndex = 0;
  const toBanners = (list: RawItem[]): NewsBannerProps[] =>
    list.map((item) => {
      const image = imageByLink.get(item.link) ?? FALLBACK_IMAGES[fallbackIndex++ % FALLBACK_IMAGES.length];
      return { image, caption: item.title };
    });

  return {
    all: toBanners(selected.all),
    football: toBanners(selected.football),
    basketball: toBanners(selected.basketball),
    baseball: toBanners(selected.baseball),
  };
}
