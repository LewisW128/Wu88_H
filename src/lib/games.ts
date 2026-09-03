import type { ProductCardProps } from "../components/ProductCard";
import type { RankedProductCardProps } from "../components/RankedProductCard";

// Single source of truth for every game instance across the site (home,
// casino's category tabs) -- previously each page (and /profile's own
// favorites row) kept its own copy of the same entries, which is how a
// like on, say, casino's slot tab could silently never show up under
// /profile's own "收藏的遊戲": that row only ever checked its own local,
// much smaller list. Everything below is unchanged data, just moved here
// so every page (and ALL_GAMES, the pool /profile filters by like) reads
// from the same place instead of drifting copies.

// Figma "Hot Games" (node 1136:88905): a numbered rank row, 01-10. Casino's
// own "Hot Games" (02_WU88-H-PC-Casino node 122:6585) reuses this exact
// same instance, not new art -- so it's exported once here, not per-page.
export const hotGames: RankedProductCardProps[] = [
  { rank: "01", image: "/assets/hot-games/rank1-super-sports.png", title: "SUPER 體育", category: "體育", views: "10,000", wins: "1,000", labels: ["HOT"] },
  { rank: "02", image: "/assets/hot-games/rank2-gold-hunt.png", title: "掏金歷險", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"] },
  { rank: "03", image: "/assets/hot-games/rank3-aladdin.png", title: "阿拉丁", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"] },
  { rank: "04", image: "/assets/hot-games/rank4-dragon-legend.png", title: "魔龍傳奇", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW", "WU88"] },
  { rank: "05", image: "/assets/hot-games/rank5-penguin.png", title: "企鵝打磚塊", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"] },
  { rank: "06", image: "/assets/hot-games/rank6-empire.png", title: "帝國崛起", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW", "WU88"] },
  { rank: "07", image: "/assets/hot-games/rank7-fishing.png", title: "瘋狂釣魚", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"] },
  { rank: "08", image: "/assets/hot-games/rank8-pirates.png", title: "神鬼奇航", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"] },
  { rank: "09", image: "/assets/hot-games/rank9-mahjong.png", title: "龍虎鬥麻將", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW", "WU88"] },
  { rank: "10", image: "/assets/hot-games/rank10-racing.png", title: "瘋狂賽車", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"] },
];

// Figma "General Games" / 推薦遊戲 (node 1066:144380). The first slot reuses
// the same zombie-photo demo art as everywhere else in this project, and
// four more slots reuse Hot Games' own art -- Figma repeats those exact
// same game instances across both sections rather than using new photos.
export const generalGames: ProductCardProps[] = [
  { image: "/assets/product-card/zombie-photo.png", title: "殭屍大戰", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"] },
  { image: "/assets/general-games/dungeon.png", title: "暗黑地下城", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"] },
  { image: "/assets/general-games/zeus.png", title: "宙斯創世", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"] },
  { image: "/assets/general-games/dragon-heir.png", title: "龍的傳人", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"] },
  { image: "/assets/general-games/yakuza.png", title: "人中之龍", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"] },
  { image: "/assets/hot-games/rank2-gold-hunt.png", title: "掏金歷險", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"] },
  { image: "/assets/hot-games/rank3-aladdin.png", title: "阿拉丁", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"] },
  { image: "/assets/hot-games/rank5-penguin.png", title: "企鵝打磚塊", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"] },
  { image: "/assets/hot-games/rank6-empire.png", title: "帝國崛起", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"] },
  { image: "/assets/general-games/swordsmith.png", title: "鑄劍大師", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"] },
];

// Casino "Frame 1296"'s tab row -- see casino/page.tsx's own (former) comment
// on where each category's art came from.
export const casinoGames: ProductCardProps[] = [
  { image: "/assets/product-card/zombie-photo.png", title: "殭屍大戰", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/general-games/dungeon.png", title: "暗黑地下城", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"], size: "L" },
  { image: "/assets/general-games/zeus.png", title: "宙斯創世", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/general-games/dragon-heir.png", title: "龍的傳人", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"], size: "L" },
  { image: "/assets/general-games/yakuza.png", title: "人中之龍", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/hot-games/rank2-gold-hunt.png", title: "掏金歷險", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"], size: "L" },
  { image: "/assets/hot-games/rank3-aladdin.png", title: "阿拉丁", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"], size: "L" },
  { image: "/assets/hot-games/rank5-penguin.png", title: "企鵝打磚塊", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/hot-games/rank6-empire.png", title: "帝國崛起", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/general-games/swordsmith.png", title: "鑄劍大師", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/hot-games/rank1-super-sports.png", title: "SUPER 體育", category: "體育", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/hot-games/rank4-dragon-legend.png", title: "魔龍傳奇", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW", "WU88"], size: "L" },
  { image: "/assets/hot-games/rank7-fishing.png", title: "瘋狂釣魚", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/hot-games/rank8-pirates.png", title: "神鬼奇航", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/hot-games/rank9-mahjong.png", title: "龍虎鬥麻將", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW", "WU88"], size: "L" },
  { image: "/assets/hot-games/rank10-racing.png", title: "瘋狂賽車", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/general-games/dungeon.png", title: "暗黑地下城", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/general-games/zeus.png", title: "宙斯創世", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/general-games/dragon-heir.png", title: "龍的傳人", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/general-games/yakuza.png", title: "人中之龍", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
];

export const slotGames: ProductCardProps[] = [
  { image: "/assets/product-card/zombie-photo.png", title: "殭屍大戰", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/slot/dark-witch.jpg", title: "暗夜女巫", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/slot/thunder-zeus.jpg", title: "雷神宙斯", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/slot/dragon-heir.jpg", title: "龍的傳人", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/slot/yakuza.jpg", title: "人中之龍", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/slot/gold-hunt.jpg", title: "掏金歷險", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW", "WU88"], size: "L" },
  { image: "/assets/casino/slot/aladdin.jpg", title: "阿拉丁", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/slot/penguin.jpg", title: "企鵝打磚塊", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW", "WU88"], size: "L" },
  { image: "/assets/casino/slot/kingdom-rise.jpg", title: "王國崛起", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/slot/war-god-set.jpg", title: "戰神賽特", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"], size: "L" },
  { image: "/assets/casino/slot/swordsmith.jpg", title: "鑄劍大師", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/slot/viking.jpg", title: "維京傳奇", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/slot/dwarf-mine.jpg", title: "矮人礦坑", category: "電子", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
];

export const liveGames: ProductCardProps[] = [
  { image: "/assets/casino/live/dg.jpg", title: "DG 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/live/wm.jpg", title: "WM 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/live/mt.jpg", title: "MT 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/live/t9.jpg", title: "T9 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/live/jp.jpg", title: "JP 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/live/wg.jpg", title: "WG 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT", "NEW", "WU88"], size: "L" },
  { image: "/assets/casino/live/astar.jpg", title: "ASTAR 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/live/allbet.jpg", title: "ALLBET 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/live/db.jpg", title: "DB 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/live/mt2.jpg", title: "MT 真人", category: "真人", views: "10,000", wins: "1,000", labels: ["HOT", "NEW"], size: "L" },
];

export const lotteryGames: ProductCardProps[] = [
  { image: "/assets/casino/lottery/wg.jpg", title: "WG 彩票", category: "彩票", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/lottery/9k.jpg", title: "9K 彩票", category: "彩票", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/lottery/db.jpg", title: "DB 彩票", category: "彩票", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/lottery/goldenwin.jpg", title: "高登彩票", category: "彩票", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
];

export const cardsGames: ProductCardProps[] = [
  { image: "/assets/casino/cards/goldenwin.jpg", title: "高登棋牌", category: "棋牌", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/cards/good-road.jpg", title: "好路棋牌", category: "棋牌", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/cards/happy.jpg", title: "開心棋牌", category: "棋牌", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/cards/lucky.jpg", title: "幸福棋牌", category: "棋牌", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
];

export const fishingGames: ProductCardProps[] = [
  { image: "/assets/casino/fishing/crazy.jpg", title: "瘋狂捕魚", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/fishing/happy.jpg", title: "開心捕魚", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/fishing/fish-among-fish.jpg", title: "魚中魚", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/fishing/fish-and-chips.jpg", title: "炸魚薯條", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/fishing/fishing-master.jpg", title: "摸魚高手", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
];

export const esportsGames: ProductCardProps[] = [
  { image: "/assets/casino/esports/mario.jpg", title: "瑪利歐", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/esports/warcraft.jpg", title: "魔獸世界", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/esports/crazy-rally.jpg", title: "瘋狂拉力賽", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/esports/hero-showdown.jpg", title: "英雄對決", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/esports/pirates.jpg", title: "神鬼奇航", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
];

function withoutRank(games: RankedProductCardProps[]): ProductCardProps[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- rank is discarded on purpose
  return games.map(({ rank, ...game }) => game);
}

// The pool /profile's own "收藏的遊戲" row filters down to whatever's
// actually liked (see ProfileContent, ProductCard, FavoritesProvider) --
// every game across the whole site, so a like anywhere shows up there.
// Same title can legitimately appear more than once above (Figma reuses
// the exact same game instance across sections/pages on purpose -- see
// each array's own comment) -- de-duped here by title, first occurrence
// wins, since ProductCard already treats title as a game's real identity
// (its own React `key` everywhere assumes the same).
const seenTitles = new Set<string>();
export const ALL_GAMES: ProductCardProps[] = [
  ...withoutRank(hotGames),
  ...generalGames,
  ...casinoGames,
  ...slotGames,
  ...liveGames,
  ...lotteryGames,
  ...cardsGames,
  ...fishingGames,
  ...esportsGames,
].filter((game) => {
  if (seenTitles.has(game.title)) return false;
  seenTitles.add(game.title);
  return true;
});
