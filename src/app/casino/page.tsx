import { DEFAULT_RING_COLOR } from "../../components/Avatar";
import CasinoGameGrid, { type CasinoCategory } from "../../components/CasinoGameGrid";
import ContainerBg from "../../components/ContainerBg";
import Footer from "../../components/Footer";
import HotGames from "../../components/HotGames";
import Language from "../../components/Language";
import MinPanelHeight from "../../components/MinPanelHeight";
import QuickLinks from "../../components/QuickLinks";
import ScaleToFit from "../../components/ScaleToFit";
import Search from "../../components/Search";
import Sidebar from "../../components/Sidebar";
import SocialLinks from "../../components/SocialLinks";
import StickyUtilityBar from "../../components/StickyUtilityBar";
import TalkingBar from "../../components/TalkingBar";
import type { TalkSectionProps } from "../../components/TalkSection";
import TopBar from "../../components/TopBar";
import TopUp from "../../components/TopUp";
import { hotGames, casinoGames, slotGames, liveGames, lotteryGames, cardsGames, fishingGames, esportsGames } from "../../lib/games";

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

// Every game array below (hotGames -- Figma's own "Hot Games" reuses the
// exact same 10 ranked entries as the homepage, 02_WU88-H-PC-Casino node
// 122:6585 -- plus casinoGames/slotGames/liveGames/lotteryGames/
// cardsGames/fishingGames/esportsGames, each its own tab's distinct
// "Products" grid, nodes 133:15752/133:19563/133:22710/133:25553/
// 136:81084/136:83473) now lives in lib/games.ts, shared with home and
// /profile's own "收藏的遊戲" row -- see that file's own comment for why.
const CASINO_CATEGORIES: CasinoCategory[] = [
  { key: "all", icon: "/icon/game-all.png", activeIcon: "/icon/game-all-active.png", label: "所有遊戲", games: casinoGames },
  { key: "slot", icon: "/icon/game-slot.png", activeIcon: "/icon/game-slot-active.png", label: "電子遊戲", games: slotGames },
  { key: "live", icon: "/icon/game-live.png", activeIcon: "/icon/game-live-active.png", label: "真人娛樂", games: liveGames },
  { key: "lottery", icon: "/icon/game-lottery.png", activeIcon: "/icon/game-lottery-active.png", label: "彩票遊戲", games: lotteryGames },
  { key: "cards", icon: "/icon/game-cards.png", activeIcon: "/icon/game-cards-active.png", label: "棋牌遊戲", games: cardsGames },
  { key: "fishing", icon: "/icon/game-fishing.png", activeIcon: "/icon/game-fishing-active.png", label: "捕魚遊戲", games: fishingGames },
  { key: "esports", icon: "/icon/game-esports.png", activeIcon: "/icon/game-esports-active.png", label: "電競遊戲", games: esportsGames },
];

// `tab` (e.g. `?tab=slot`) lets a link from elsewhere -- the homepage's
// 電子遊戲推薦 section's own "更多" -- land here with a specific category
// tab already selected, instead of always opening on 所有遊戲.
export default async function CasinoPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;

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
                <TopUp />
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

              <CasinoGameGrid categories={CASINO_CATEGORIES} initialTab={tab} />

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
