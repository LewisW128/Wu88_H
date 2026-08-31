import { DEFAULT_RING_COLOR } from "../../components/Avatar";
import CasinoGameGrid, { type CasinoCategory } from "../../components/CasinoGameGrid";
import ContainerBg from "../../components/ContainerBg";
import Footer from "../../components/Footer";
import HotGames from "../../components/HotGames";
import Language from "../../components/Language";
import MinPanelHeight from "../../components/MinPanelHeight";
import { type ProductCardProps } from "../../components/ProductCard";
import QuickLinks from "../../components/QuickLinks";
import type { RankedProductCardProps } from "../../components/RankedProductCard";
import ScaleToFit from "../../components/ScaleToFit";
import Search from "../../components/Search";
import Sidebar from "../../components/Sidebar";
import SocialLinks from "../../components/SocialLinks";
import StickyUtilityBar from "../../components/StickyUtilityBar";
import TalkingBar from "../../components/TalkingBar";
import type { TalkSectionProps } from "../../components/TalkSection";
import TopBar from "../../components/TopBar";
import TopUp from "../../components/TopUp";

const winListRows = [
  { name: "@Jessica", win: "+ 10,000,000" },
  { name: "@Jackson", win: "+ 9,000,000" },
  { name: "@Alex", win: "+ 800,000" },
  { name: "@Jannie", win: "+ 5,020,000" },
  { name: "@Jessica", win: "+ 18,200,050" },
  { name: "@Jannifer", win: "+ 15,600,000" },
  { name: "@Russell", win: "+ 20,100,000" },
];

const topBarAnnouncements = winListRows.map((row) => ({
  name: row.name.replace(/^@/, ""),
  amount: `USDT${row.win.replace(/^\+\s*/, "")}`,
}));

// Same group chat / private thread / live-drip data as the homepage's own
// TalkingBar -- not a trimmed-down version. There's only one chat, not a
// separate one per page.
const talkingBarMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "嗨～！剛剛進來玩", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "有什麼好玩的呢？有誰可以推薦嗎？", variant: "myself" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: DEFAULT_RING_COLOR,
    timestamp: "3 分鐘前",
    text: "我剛剛才中了時二十萬出來",
    variant: "other",
    replyTo: { name: "Jessica", text: "有什麼好玩的呢？有誰可以推薦嗎？" },
  },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "真的假的，這麼容易嗎？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "3 分鐘前", text: "真的啊～趕快去試試！", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "你玩哪個遊戲？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "3 分鐘前", text: "XXX電子 射龍門", variant: "other" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "剛剛輸慘了 IOI", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "3 分鐘前", text: "你玩什麼？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "XXX 真人", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "3 分鐘前", text: "拍拍 多下幾注就會贏回來了", variant: "other" },
];

// Cycled into the group chat one at a time so it reads as a live, ongoing
// conversation instead of a finished transcript.
const talkingBarSimulatedMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "剛剛", text: "有沒有人在玩百家樂的？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "剛剛", text: "我在，怎麼了？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "剛剛", text: "剛剛連續開三把大，太扯了", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "剛剛", text: "手氣不錯喔，繼續加油", variant: "other" },
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "剛剛", text: "有推薦的電子遊戲嗎？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "剛剛", text: "我都玩殭屍大戰，蠻好玩的", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "剛剛", text: "我去試試看", variant: "other" },
];

// A private 1-on-1 thread with Jackson, separate from the group chat above.
const talkingBarPrivateMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "5 分鐘前", text: "嗨，方便私訊聊嗎？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "4 分鐘前", text: "可以啊，怎麼了？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "3 分鐘前", text: "剛剛那個遊戲的連結可以給我嗎？", variant: "other" },
];

// Figma "Hot Games" reuses the exact same 10 ranked entries as the
// homepage -- 02_WU88-H-PC-Casino node 122:6585 is the same "Hot Games"
// component instance, not new art.
const hotGames: RankedProductCardProps[] = [
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

// Figma "Frame 1296"'s tab row: 所有遊戲 (a mix of existing project art,
// reused the same way the homepage's own 推薦遊戲 row reuses art -- see
// its own comment below) plus 6 more category tabs, each with its own
// distinct set of "Products" cards in Figma (nodes 133:15752 電子遊戲,
// 133:19563 真人娛樂, 133:22710 彩票遊戲, 133:25553 棋牌遊戲, 136:81084
// 捕魚遊戲, 136:83473 電競遊戲) -- not the same cards re-filtered. Every
// tab icon is genuinely different art (dice/reels, camera, ticket, cards,
// hook, gamepad) -- get_design_context flattened every instance to the
// same generic "grid" glyph (Actions' own default appearance), so these
// came from download_assets' real rendered export of each instance
// instead, cropped to the icon and re-keyed to a transparent PNG.
//
// Likewise, get_design_context can't resolve per-instance photo overrides
// inside a "Products" grid at all (same flattening issue, just for whole
// photos instead of icons) -- these categories' games are new art (not
// reused from elsewhere in the project), pulled via download_assets'
// rawImages off each category's grid frame and matched back to the
// titles/labels read from that node's own screenshot.
const casinoGames: ProductCardProps[] = [
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

const slotGames: ProductCardProps[] = [
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

const liveGames: ProductCardProps[] = [
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

const lotteryGames: ProductCardProps[] = [
  { image: "/assets/casino/lottery/wg.jpg", title: "WG 彩票", category: "彩票", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/lottery/9k.jpg", title: "9K 彩票", category: "彩票", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/lottery/db.jpg", title: "DB 彩票", category: "彩票", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/lottery/goldenwin.jpg", title: "高登彩票", category: "彩票", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
];

const cardsGames: ProductCardProps[] = [
  { image: "/assets/casino/cards/goldenwin.jpg", title: "高登棋牌", category: "棋牌", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/cards/good-road.jpg", title: "好路棋牌", category: "棋牌", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/cards/happy.jpg", title: "開心棋牌", category: "棋牌", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/cards/lucky.jpg", title: "幸福棋牌", category: "棋牌", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
];

const fishingGames: ProductCardProps[] = [
  { image: "/assets/casino/fishing/crazy.jpg", title: "瘋狂捕魚", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/fishing/happy.jpg", title: "開心捕魚", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/fishing/fish-among-fish.jpg", title: "魚中魚", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/fishing/fish-and-chips.jpg", title: "炸魚薯條", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/fishing/fishing-master.jpg", title: "摸魚高手", category: "捕魚", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
];

const esportsGames: ProductCardProps[] = [
  { image: "/assets/casino/esports/mario.jpg", title: "瑪利歐", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/esports/warcraft.jpg", title: "魔獸世界", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT"], size: "L" },
  { image: "/assets/casino/esports/crazy-rally.jpg", title: "瘋狂拉力賽", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/esports/hero-showdown.jpg", title: "英雄對決", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
  { image: "/assets/casino/esports/pirates.jpg", title: "神鬼奇航", category: "電競", views: "10,000", wins: "1,000", labels: ["HOT", "WU88"], size: "L" },
];

const CASINO_CATEGORIES: CasinoCategory[] = [
  { key: "all", icon: "/icon/game-all.png", activeIcon: "/icon/game-all-active.png", label: "所有遊戲", games: casinoGames },
  { key: "slot", icon: "/icon/game-slot.png", activeIcon: "/icon/game-slot-active.png", label: "電子遊戲", games: slotGames },
  { key: "live", icon: "/icon/game-live.png", activeIcon: "/icon/game-live-active.png", label: "真人娛樂", games: liveGames },
  { key: "lottery", icon: "/icon/game-lottery.png", activeIcon: "/icon/game-lottery-active.png", label: "彩票遊戲", games: lotteryGames },
  { key: "cards", icon: "/icon/game-cards.png", activeIcon: "/icon/game-cards-active.png", label: "棋牌遊戲", games: cardsGames },
  { key: "fishing", icon: "/icon/game-fishing.png", activeIcon: "/icon/game-fishing-active.png", label: "捕魚遊戲", games: fishingGames },
  { key: "esports", icon: "/icon/game-esports.png", activeIcon: "/icon/game-esports-active.png", label: "電競遊戲", games: esportsGames },
];

// Figma "Frame 1242": a small decorative 6x6 grid of tiny dots, a page-level
// sibling of Container_BG (not part of it) sitting near the bottom-left of
// the hero, overlapping Sidebar's own column -- purely decorative, so it's
// given a low z-index and sits behind Sidebar's sticky column instead of
// competing with its icons.
function MicroDotGrid() {
  return (
    <div className="pointer-events-none absolute left-[46px] top-[957px] z-0 flex flex-col gap-[7.75px]">
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="flex gap-[7.75px]">
          {Array.from({ length: 6 }).map((_, col) => (
            <div key={col} className="size-[3.875px] rounded-full bg-[#8d54d8]/40" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CasinoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f4]">
      <ScaleToFit>
        <div className="sticky top-0 z-20">
          <TopBar onlineCount="900" totalReward="10,000,000" announcements={topBarAnnouncements} />
        </div>

        <div className="sticky top-[38px] left-0 z-30 h-0">
          <div
            className="pointer-events-none size-[60px]"
            style={{ background: "radial-gradient(circle at 100% 100%, transparent 60px, #f4f4f4 60px)" }}
          />
        </div>

        <div className="relative rounded-tl-[60px] bg-white">
          <div className="pointer-events-none absolute right-0 top-0">
            <ContainerBg variant="casino" />
          </div>

          <MicroDotGrid />

          {/* `MinPanelHeight` (not a plain div): on a category with only a
              row or two of cards, this grid's real content is shorter than
              Talking_Bar's own viewport-driven height, which makes
              Talking_Bar the tallest grid item and its own containing
              block exactly its own size -- leaving no room for its
              `sticky top-[58px]` offset to apply (sticky can never push an
              element past its containing block's edge), so it rendered
              flush under Top_bar instead of with the intended gap. See
              `useMinPanelHeight`'s own comment. */}
          <MinPanelHeight className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            <div className="sticky top-[79px] z-10 self-start justify-self-start pl-[30px]">
              <Sidebar page="casino" />
            </div>

            <div className="flex flex-col gap-[25px] pb-[40px]">
              <StickyUtilityBar>
                <div className="flex items-center gap-[20px]">
                  <Search />
                  <Language />
                </div>
                <TopUp account="123456" />
              </StickyUtilityBar>

              {/* Figma has no headline/carousel/Form Bar on this page --
                  just the "CASINO" hero art directly above Hot Games. Its
                  own Hot Games top sits 409px below the utility row's
                  bottom edge (measured off 02_WU88-H-PC-Casino node
                  122:6585 vs the utility row's own y+height); the column's
                  shared gap-[25px] already contributes 25 of that, so this
                  margin makes up the remaining 384. */}
              <div className="mt-[384px]">
                <HotGames games={hotGames} />
              </div>

              <CasinoGameGrid categories={CASINO_CATEGORIES} />

              <div className="mt-[55px] flex items-center justify-between">
                <SocialLinks />
                <QuickLinks />
              </div>

              <Footer />
            </div>

            <div className="sticky top-[58px] z-10 ml-[20px] self-start">
              <TalkingBar
                messages={talkingBarMessages}
                privateMessages={talkingBarPrivateMessages}
                simulatedMessages={talkingBarSimulatedMessages}
              />
            </div>
          </MinPanelHeight>
        </div>
      </ScaleToFit>
    </div>
  );
}
