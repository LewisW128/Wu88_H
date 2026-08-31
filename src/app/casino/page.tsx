import { DEFAULT_RING_COLOR } from "../../components/Avatar";
import ContainerBg from "../../components/ContainerBg";
import Footer from "../../components/Footer";
import GameSelections from "../../components/GameSelections";
import HotGames from "../../components/HotGames";
import Language from "../../components/Language";
import ProductCard, { type ProductCardProps } from "../../components/ProductCard";
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
];

const topBarAnnouncements = winListRows.map((row) => ({
  name: row.name.replace(/^@/, ""),
  amount: `USDT${row.win.replace(/^\+\s*/, "")}`,
}));

const talkingBarMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "嗨～！剛剛進來玩", variant: "myself" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: DEFAULT_RING_COLOR,
    timestamp: "3 分鐘前",
    text: "手氣不錯喔，繼續加油",
    variant: "other",
  },
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "3 分鐘前", text: "有推薦的電子遊戲嗎？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "我都玩殭屍大戰，蠻好玩的", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "我去試試看", variant: "other" },
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

// Figma "Frame 1295": 所有遊戲 (active by default) + 7 more category
// shortcuts, then a trailing icon-only view-toggle button with no label.
// Every icon here is genuinely different art per category (dice/reels,
// camera, ticket, cards, hook, gamepad) -- get_design_context flattened
// every instance to the same generic "grid" glyph (Actions' own default
// appearance), so these came from download_assets' real rendered export
// of each instance instead, cropped to the icon and re-keyed to a
// transparent PNG.
const CATEGORY_TABS = [
  { key: "all", icon: "/icon/game-all.png", label: "所有遊戲" },
  { key: "slot", icon: "/icon/game-slot.png", label: "電子遊戲" },
  { key: "live", icon: "/icon/game-live.png", label: "真人娛樂" },
  { key: "lottery", icon: "/icon/game-lottery.png", label: "彩票遊戲" },
  { key: "cards", icon: "/icon/game-cards.png", label: "棋牌遊戲" },
  { key: "fishing", icon: "/icon/game-fishing.png", label: "捕魚遊戲" },
  { key: "esports", icon: "/icon/game-esports.png", label: "電競遊戲" },
] as const;

// Figma "Frame 1296": a 5-column x 4-row grid of "L" (225px) Products
// cards, 20 total. No new per-game photography was supplied for this grid,
// so -- same convention the homepage's own 推薦遊戲 row already uses --
// it cycles the project's existing game art/titles instead of inventing
// new ones.
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

          <div className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
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

              <div className="flex flex-col gap-[20px]">
                <div className="flex items-center gap-[10px]">
                  {CATEGORY_TABS.map((tab, i) => (
                    <GameSelections key={tab.key} icon={tab.icon} label={tab.label} active={i === 0} />
                  ))}
                  <GameSelections icon="/icon/list-toggle.png" />
                </div>

                <div className="grid grid-cols-5 gap-[20px]">
                  {casinoGames.map((game, i) => (
                    <ProductCard key={i} {...game} />
                  ))}
                </div>
              </div>

              <div className="mt-[55px] flex items-center justify-between">
                <SocialLinks />
                <QuickLinks />
              </div>

              <Footer />
            </div>

            <div className="sticky top-[58px] z-10 ml-[20px] self-start">
              <TalkingBar messages={talkingBarMessages} privateMessages={[]} simulatedMessages={[]} />
            </div>
          </div>
        </div>
      </ScaleToFit>
    </div>
  );
}
