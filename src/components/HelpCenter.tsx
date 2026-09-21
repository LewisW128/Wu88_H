"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import { topBarAnnouncements } from "../lib/chatMockData";
import MinPanelHeight from "./MinPanelHeight";
import ProfileSidebar from "./ProfileSidebar";
import ScaleToFit from "./ScaleToFit";
import TopBar from "./TopBar";

const ASSET = "/assets/help";

// Figma "MacBook Pro 16' - Help Center" (05_WU88-H-PC-Profile-Page node
// 211:23224): the help center reached from the profile rail's "?" icon. Every
// question below is copied from that frame, grouped exactly as Figma groups
// them; the four category cards on top mirror those same four groups.
type FaqGroup = { id: string; title: string; description: string; icon: () => React.ReactNode; questions: string[] };

// Figma's own composite "註冊與帳號" glyph: a document with a person badge, drawn
// from six separately exported vector layers positioned on a 27.5px box (the
// other three category icons are single flat exports).
function AccountIcon() {
  return (
    <div className="relative size-[27.5px] shrink-0 overflow-clip">
      <img alt="" src={withBasePath(`${ASSET}/cat-account-ellipse-27.svg`)} className="absolute bottom-[1.1px] right-0 size-[11px] max-w-none" />
      <div className="absolute inset-[8%_20%_12%_12%]">
        <div className="absolute inset-[-5%_-5.88%]">
          <img alt="" src={withBasePath(`${ASSET}/cat-account-vector-1.svg`)} className="block size-full max-w-none" />
        </div>
      </div>
      <div className="absolute left-[8.47px] top-[7.26px] h-0 w-[9.9px]">
        <div className="absolute inset-[-1.1px_-11.11%]">
          <img alt="" src={withBasePath(`${ASSET}/cat-account-vector-2.svg`)} className="block size-full max-w-none" />
        </div>
      </div>
      <div className="absolute left-[8.47px] top-[12.1px] h-0 w-[3.3px]">
        <div className="absolute inset-[-1.1px_-33.33%]">
          <img alt="" src={withBasePath(`${ASSET}/cat-account-vector-3.svg`)} className="block size-full max-w-none" />
        </div>
      </div>
      <div className="absolute left-[8.47px] top-[16.94px] h-0 w-[3.3px]">
        <div className="absolute inset-[-1.1px_-33.33%]">
          <img alt="" src={withBasePath(`${ASSET}/cat-account-vector-3.svg`)} className="block size-full max-w-none" />
        </div>
      </div>
      <div className="absolute left-[17.6px] top-[13.2px] size-[5.5px]">
        <div className="absolute inset-[-20%]">
          <img alt="" src={withBasePath(`${ASSET}/cat-account-ellipse-3.svg`)} className="block size-full max-w-none" />
        </div>
      </div>
      <div className="absolute left-[calc(50%+1.65px)] top-[19.8px] h-[4.4px] w-[9.9px]">
        <div className="absolute inset-[-25%_-11.11%]">
          <img alt="" src={withBasePath(`${ASSET}/cat-account-ellipse-2.svg`)} className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  );
}

function FlatIcon({ file }: { file: string }) {
  return <img alt="" src={withBasePath(`${ASSET}/${file}`)} className="size-[27.5px] shrink-0" />;
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "account",
    title: "註冊與帳號",
    description: "帳號註冊、會員資料、姓名一致與登入相關問題。",
    icon: () => <AccountIcon />,
    questions: ["如果我要玩體育博彩以外的其他遊戲，還需要註冊新的帳號嗎？", "在 WU88 儲值與提領，我的註冊姓名是否需要與身分證上面的姓名一致？"],
  },
  {
    id: "wallet",
    title: "儲值與提領",
    description: "儲值方式、提領限制、交易筆數與金額上限。",
    icon: () => <FlatIcon file="cat-wallet.svg" />,
    questions: ["我每天可以提交多少筆儲值交易？", "如果我不投注可以提領嗎？", "每天最高提領金額是多少？", "為什麼提領狀態顯示「成功」，而我的提領卡卻沒有收到錢？", "什麼是「未完成流水」？"],
  },
  {
    id: "games",
    title: "遊戲與投注",
    description: "跨遊戲帳號、投注、盤口、滾球與投注單狀態。",
    icon: () => <FlatIcon file="cat-games.svg" />,
    questions: ["什麼是滾球？", "我如何確認賽事是否將會開出滾球盤口？", "「未確認」顯示在投注單是什麼意思？", "盤口及滾球賽事相關資訊一直都是正確的嗎？"],
  },
  {
    id: "system",
    title: "系統與安全",
    description: "瀏覽器支援、流程說明、關於我們與操作安全。",
    icon: () => <FlatIcon file="cat-system.svg" />,
    questions: ["支援存取 WU88 服務網站的瀏覽器是什麼？"],
  },
];

const POPULAR_TOPICS = ["USDT 儲值流程", "超商儲值流程", "雲支付儲值流程", "支付寶綁定流程", "關於我們"];

// The white rounded cards every section here sits in (Figma's search-panel /
// category-card / faq-card share one style: white, 1px #f4f4f4 border, 28px
// radius, a soft 0 8 12 4%-black shadow).
function Card({ children, gap }: { children: React.ReactNode; gap: number }) {
  return (
    <div
      className="flex w-full shrink-0 flex-col items-start rounded-[28px] border border-solid border-[#f4f4f4] bg-white p-[24px] shadow-[0_8px_12px_rgba(0,0,0,0.04)]"
      style={{ gap }}
    >
      {children}
    </div>
  );
}

function CardHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex w-full flex-col items-start gap-[6px] text-[#3e4140]">
      <p className="whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px]">{title}</p>
      <p className="w-full text-[14px] font-medium leading-[22px] opacity-[0.72]">{description}</p>
    </div>
  );
}

// Figma "QA_Selection" (Components Library node 428:22291): a frosted white
// row with a purple outline, the question at 20px black, and a dark round
// arrow button pinned right.
function QaSelection({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="group flex h-[113px] w-full shrink-0 items-center justify-between gap-[20px] overflow-hidden rounded-[20px] border border-solid border-[#8d54d8] bg-white/80 px-[40px] py-[33px] text-left backdrop-blur-[10px] transition-shadow duration-200 hover:shadow-[0_8px_16px_rgba(141,84,216,0.16)]"
    >
      <span className="text-[20px] font-black leading-[32px] tracking-[0.35px] text-[#3e4140]">{text}</span>
      <span className="flex h-[45px] shrink-0 items-center justify-center rounded-[50px] bg-[#3e4140] px-[10px] py-[9px] backdrop-blur-[10px] transition-transform duration-200 group-hover:translate-x-[3px]">
        <img alt="" src={withBasePath(`${ASSET}/arrow-general.svg`)} className="size-[25px]" />
      </span>
    </button>
  );
}

export default function HelpCenter() {
  // What's typed in the search box vs. what's applied: the FAQ only filters on
  // submit (Enter or the 搜尋 button), and again as soon as the box is emptied.
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");

  const keyword = query.trim().toLowerCase();
  const visibleGroups = FAQ_GROUPS.map((group) => ({
    ...group,
    questions: keyword ? group.questions.filter((q) => q.toLowerCase().includes(keyword)) : group.questions,
  })).filter((group) => group.questions.length > 0);
  const visibleCount = visibleGroups.reduce((sum, group) => sum + group.questions.length, 0);

  function submit(value: string) {
    setQuery(value);
  }

  function scrollToGroup(id: string) {
    setQuery("");
    setDraft("");
    // After the unfiltered list has rendered again.
    requestAnimationFrame(() => document.getElementById(`help-group-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f4]">
      <ScaleToFit>
        <div className="sticky top-0 z-20">
          <TopBar onlineCount="900" totalReward="10,000,000" announcements={topBarAnnouncements} />
        </div>

        {/* No right-hand chat column here (Figma's help center has none): the
            main column runs to the page's 40px right margin instead. */}
        <MinPanelHeight className="relative z-10 grid" style={{ gridTemplateColumns: "166px minmax(0, 1fr) 40px" }}>
          <div className="sticky top-[58px] z-10 self-start justify-self-start pl-[30px]">
            <ProfileSidebar />
          </div>

          <main className="flex flex-col items-start gap-[24px] pb-[56px] pt-[40px]">
            <Card gap={18}>
              <CardHeading title="搜尋與熱門主題" description="先輸入關鍵字，或直接進入熱門流程與分類。" />

              <form
                className="flex h-[72px] w-full shrink-0 items-center gap-[16px] rounded-[24px] border border-solid border-[#f4f4f4] bg-white px-[10px] py-[8px]"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit(draft);
                }}
              >
                <span className="relative size-[56px] shrink-0 rounded-[50px] bg-[#f4f4f4]">
                  <img
                    alt=""
                    src={withBasePath(`${ASSET}/icon-search.svg`)}
                    className="absolute left-[calc(50%+0.5px)] top-[calc(50%+0.5px)] size-[25px] -translate-x-1/2 -translate-y-1/2"
                  />
                </span>
                <input
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    if (event.target.value === "") setQuery("");
                  }}
                  placeholder="搜尋關鍵字，例如：儲值、提領、註冊、流水、盤口、綁定"
                  aria-label="搜尋"
                  className="min-w-px flex-1 bg-transparent text-[18px] font-medium leading-[28px] text-[#3e4140] outline-none placeholder:text-[#3e4140] placeholder:opacity-55"
                />
                <button type="submit" className="flex shrink-0 items-center rounded-[18px] bg-[#8d54d8] px-[18px] py-[12px]">
                  <span className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-white">搜尋</span>
                </button>
              </form>

              <div className="flex w-full flex-wrap content-start items-start gap-[12px]">
                {POPULAR_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    // Just drops the topic into the search box (the FAQ below has no
                    // text for these flows yet, so applying it would only filter
                    // everything away) -- the 搜尋 button still applies it.
                    onClick={() => setDraft(topic)}
                    className="shrink-0 overflow-hidden rounded-[50px] bg-[#3e4140] px-[20px] py-[10px] transition-opacity duration-200 hover:opacity-80"
                  >
                    <span className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-white">{topic}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card gap={18}>
              <CardHeading title="依主題快速瀏覽" description="將協助內容重新整理為四大主題，讓使用者更容易理解該看哪裡。" />

              <div className="flex w-full items-start gap-[16px]">
                {FAQ_GROUPS.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => scrollToGroup(group.id)}
                    className="flex min-w-px flex-1 flex-col items-start gap-[12px] rounded-[22px] border border-solid border-[#f4f4f4] bg-[#f8fbff] p-[20px] text-left transition-shadow duration-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
                  >
                    <span className="flex size-[44px] shrink-0 flex-col items-center justify-center rounded-[14px] bg-[#f4fff9]">{group.icon()}</span>
                    <span className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">{group.title}</span>
                    <span className="w-full text-[14px] font-medium leading-[22px] text-[#3e4140] opacity-[0.72]">{group.description}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card gap={20}>
              <div className="flex w-full items-center justify-between">
                <div className="flex min-w-px flex-1 flex-col items-start gap-[6px] text-[#3e4140]">
                  <p className="whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px]">常見問題</p>
                  <p className="w-full text-[14px] font-medium leading-[22px] opacity-[0.72]">保留原有內容的核心意義，並依主題整理成更易閱讀的分組。</p>
                </div>
                <div className="flex shrink-0 items-center">
                  <div className="flex items-start rounded-[999px] bg-[#f4fff9] px-[12px] py-[8px]">
                    <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#8d54d8]">{visibleCount} 題</p>
                  </div>
                </div>
              </div>

              {visibleGroups.map((group) => (
                <div key={group.id} id={`help-group-${group.id}`} className="flex w-full scroll-mt-[80px] flex-col items-start gap-[14px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="size-[8px] rounded-[4px] bg-[#8d54d8]" />
                    <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">{group.title}</p>
                  </div>
                  <div className="flex w-full flex-col items-start gap-[12px]">
                    {group.questions.map((question) => (
                      <QaSelection key={question} text={question} />
                    ))}
                  </div>
                </div>
              ))}

              {visibleGroups.length === 0 && (
                <p className="w-full py-[24px] text-center text-[14px] font-medium leading-[22px] text-[#a2a2a2]">找不到符合「{query.trim()}」的問題，換個關鍵字試試。</p>
              )}
            </Card>
          </main>

          <div />
        </MinPanelHeight>
      </ScaleToFit>
    </div>
  );
}
