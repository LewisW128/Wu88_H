import { DEFAULT_RING_COLOR } from "../../components/Avatar";
import ContainerBg from "../../components/ContainerBg";
import Footer from "../../components/Footer";
import Language from "../../components/Language";
import MinPanelHeight from "../../components/MinPanelHeight";
import QuickLinks from "../../components/QuickLinks";
import ScaleToFit from "../../components/ScaleToFit";
import Search from "../../components/Search";
import Sidebar from "../../components/Sidebar";
import SocialLinks from "../../components/SocialLinks";
import type { SportBtnProps } from "../../components/SportBtn";
import type { SportGameBoardProps } from "../../components/SportGameBoard";
import SportsForm from "../../components/SportsForm";
import SportsLive from "../../components/SportsLive";
import SportsMachAnalysis from "../../components/SportsMachAnalysis";
import SportsNews from "../../components/SportsNews";
import { getSportsArticlesByCategory } from "../../lib/sportsNews";
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

// Figma "Sports Live" (03_WU88-H-PC-Sport node 801:11548): 5 cards, all
// sharing the same placeholder stats (FIFA World Cup, 6-0, 24'/16:15,
// 12.4/2.2/22.4) with different team pairs. Figma's own team-name labels
// have two typos ("EGIPT", "URUGRUAY") corrected to standard English here
// -- the flag filenames were already named by the corrected spelling.
const sportsLiveGames: SportGameBoardProps[] = [
  {
    sportName: "FIFA",
    gameName: "FIFA World Cup",
    teamA: { name: "ENGLAND", flag: "/flag/england.svg" },
    teamB: { name: "NORWAY", flag: "/flag/norway.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [
      { label: "x1", value: "12.4" },
      { label: "x", value: "2.2" },
      { label: "x1", value: "22.4" },
    ],
  },
  {
    sportName: "FIFA",
    gameName: "FIFA World Cup",
    teamA: { name: "RUSSIA", flag: "/flag/russia.svg" },
    teamB: { name: "EGYPT", flag: "/flag/egypt.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [
      { label: "x1", value: "12.4" },
      { label: "x", value: "2.2" },
      { label: "x1", value: "22.4" },
    ],
  },
  {
    sportName: "FIFA",
    gameName: "FIFA World Cup",
    teamA: { name: "URUGUAY", flag: "/flag/uruguay.svg" },
    teamB: { name: "FRANCE", flag: "/flag/france.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [
      { label: "x1", value: "12.4" },
      { label: "x", value: "2.2" },
      { label: "x1", value: "22.4" },
    ],
  },
  {
    sportName: "FIFA",
    gameName: "FIFA World Cup",
    teamA: { name: "AUSTRALIA", flag: "/flag/australia.svg" },
    teamB: { name: "DENMARK", flag: "/flag/denmark.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [
      { label: "x1", value: "12.4" },
      { label: "x", value: "2.2" },
      { label: "x1", value: "22.4" },
    ],
  },
  {
    sportName: "FIFA",
    gameName: "FIFA World Cup",
    teamA: { name: "BRAZIL", flag: "/flag/brazil.svg" },
    teamB: { name: "SPAIN", flag: "/flag/spain.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [
      { label: "x1", value: "12.4" },
      { label: "x", value: "2.2" },
      { label: "x1", value: "22.4" },
    ],
  },
];

const SPORTS_LIVE_ODDS = [
  { label: "x1", value: "12.4" },
  { label: "x", value: "2.2" },
  { label: "x1", value: "22.4" },
] as const;

// Figma "Sports Live" 足球 filter, seen live at 54:9589: 4 English
// Premier League fixtures, sharing the same placeholder stats as the 全部
// tab (6-0, 24'/16:15) since Figma never gave this category its own score/
// odds data either. Team badges are real club crests -- see AGENTS.md-
// adjacent note in flag/ for where these came from (D:\works\09_WU88-H\
// source\public\icons\flag, copied in and renamed to this project's own
// lowercase-hyphen flag/ convention). "EPL" itself (the competition, not
// a club) uses the league's own badge, matching Figma's own choice to
// label the first fixture's home side that way rather than inventing a
// third club.
const sportsLiveFootball: SportGameBoardProps[] = [
  {
    sportName: "FOOTBALL",
    gameName: "English Premier League",
    teamA: { name: "EPL", flag: "/flag/english-premier-league.svg" },
    teamB: { name: "AVL", flag: "/flag/aston-villa.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "FOOTBALL",
    gameName: "English Premier League",
    teamA: { name: "CFC", flag: "/flag/chelsea.svg" },
    teamB: { name: "Man Utd", flag: "/flag/manchester-united.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "FOOTBALL",
    gameName: "English Premier League",
    teamA: { name: "NEW", flag: "/flag/newcastle.svg" },
    teamB: { name: "BRE", flag: "/flag/brentford.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "FOOTBALL",
    gameName: "English Premier League",
    teamA: { name: "FUL", flag: "/flag/fulham.svg" },
    teamB: { name: "CRY", flag: "/flag/crystal-palace.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
];

// Figma "Sports Live" 籃球 filter, seen live at 54:27866: 5 NBA fixtures,
// same placeholder-stats convention as 全部/足球 above.
const sportsLiveBasketball: SportGameBoardProps[] = [
  {
    sportName: "BASKETBALL",
    gameName: "NBA",
    teamA: { name: "GSW", flag: "/flag/golden-state-warriors.svg" },
    teamB: { name: "DET", flag: "/flag/detroit-pistons.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "BASKETBALL",
    gameName: "NBA",
    teamA: { name: "DEN", flag: "/flag/denver-nuggets.svg" },
    teamB: { name: "DAL", flag: "/flag/dallas-mavericks.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "BASKETBALL",
    gameName: "NBA",
    teamA: { name: "CHI", flag: "/flag/chicago-bulls.svg" },
    teamB: { name: "CHA", flag: "/flag/charlotte-hornets.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "BASKETBALL",
    gameName: "NBA",
    teamA: { name: "BKN", flag: "/flag/brooklyn-nets.svg" },
    teamB: { name: "BOS", flag: "/flag/boston-celtics.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "BASKETBALL",
    gameName: "NBA",
    teamA: { name: "ATL", flag: "/flag/atlanta-hawks.svg" },
    teamB: { name: "CLE", flag: "/flag/cleveland-cavaliers.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
];

// Figma "Sports Live" 棒球 filter, seen live at 65:17483, isn't usable
// as-is: its "BASKETBALL"/"NBA" labels and World-Cup-country team names
// are leftover from copy-pasting the 全部/籃球 tabs and were never
// replaced with real baseball content -- using them verbatim would ship
// the same broken mockup Figma has. Real MLB fixtures below instead,
// same placeholder-stats convention as the other three tabs.
const sportsLiveBaseball: SportGameBoardProps[] = [
  {
    sportName: "BASEBALL",
    gameName: "MLB",
    teamA: { name: "NYY", flag: "/flag/new-york-yankees.svg" },
    teamB: { name: "BOS", flag: "/flag/boston-red-sox.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "BASEBALL",
    gameName: "MLB",
    teamA: { name: "HOU", flag: "/flag/houston-astros.svg" },
    teamB: { name: "OAK", flag: "/flag/oakland-athletics.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "BASEBALL",
    gameName: "MLB",
    teamA: { name: "TOR", flag: "/flag/toronto-blue-jays.svg" },
    teamB: { name: "KC", flag: "/flag/kansas-city-royals.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "BASEBALL",
    gameName: "MLB",
    teamA: { name: "LAA", flag: "/flag/los-angeles-angels.svg" },
    teamB: { name: "MIN", flag: "/flag/minnesota-twins.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
  {
    sportName: "BASEBALL",
    gameName: "MLB",
    teamA: { name: "ARI", flag: "/flag/arizona-diamondbacks.svg" },
    teamB: { name: "CWS", flag: "/flag/chicago-white-sox.svg" },
    scoreA: "6",
    scoreB: "0",
    sportTime: "24’",
    startTime: "16:15",
    odds: [...SPORTS_LIVE_ODDS],
  },
];

const sportsLiveGamesByCategory: Record<string, SportGameBoardProps[]> = {
  all: sportsLiveGames,
  football: sportsLiveFootball,
  basketball: sportsLiveBasketball,
  baseball: sportsLiveBaseball,
};

// Figma "Sports form" (03_WU88-H-PC-Sport node 66:29850): 5 betting-
// provider buttons, each with its own athlete cutout crop/frame -- see
// SportBtn's own comment for why `windowStyle`/`imageStyle` differ per
// provider instead of being one shared box.
const sportsFormButtons: SportBtnProps[] = [
  {
    provider: "SUPER",
    image: "/item/athlete-super.png",
    windowStyle: { left: 0, top: 1, width: 172, height: 167 },
    imageStyle: { bottom: 0, left: -59, width: 337, height: 169 },
  },
  {
    provider: "WG",
    image: "/item/athlete-wg.png",
    windowStyle: { left: -23, top: -22.3, width: 196, height: 190.302 },
    imageStyle: { bottom: 0, left: -42.16, width: 297.419, height: 166.372 },
  },
  {
    provider: "AP",
    image: "/item/athlete-ap.png",
    windowStyle: { left: 10, bottom: 0, width: 172, height: 167 },
    imageStyle: { left: "50%", transform: "translateX(calc(-50% + 0.5px))", top: 0, width: 131, height: 167 },
  },
  {
    provider: "熊貓",
    image: "/item/athlete-panda.png",
    windowStyle: { left: 10, bottom: 0, width: 172, height: 167 },
    imageStyle: { left: "50%", transform: "translateX(calc(-50% + 0.5px))", top: -23, width: 187, height: 252 },
  },
  {
    provider: "LIVE",
    image: "/item/athlete-live.png",
    windowStyle: { left: 10, bottom: 0, width: 172, height: 167 },
    imageStyle: { left: "50%", transform: "translateX(-50%)", top: 0, width: 134, height: 167 },
  },
];

export default async function SportsPage() {
  const { newsByCategory: sportsNewsByCategory, matchAnalysisByCategory: sportsMachArticlesByCategory } = await getSportsArticlesByCategory();

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
            <ContainerBg variant="sport" />
          </div>

          <MinPanelHeight className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            <div className="sticky top-[79px] z-10 self-start justify-self-start pl-[30px]">
              <Sidebar page="sports" />
            </div>

            <div className="flex flex-col gap-[25px] pb-[40px]">
              <StickyUtilityBar>
                <div className="flex items-center gap-[20px]">
                  <Search />
                  <Language />
                </div>
                <TopUp />
              </StickyUtilityBar>

              {/* Sports Live's own top sits 480px below the utility row's
                  bottom edge (measured off 03_WU88-H-PC-Sport node 54:5335
                  vs the utility row's own y+height); the column's shared
                  gap-[25px] already contributes 25 of that, so this margin
                  makes up the remaining 455 -- same measure-the-delta
                  approach as Casino's own Hot Games margin above. */}
              <div className="mt-[455px]">
                <SportsLive gamesByCategory={sportsLiveGamesByCategory} />
              </div>

              {/* Sports form sits a plain 40px below Sports Live (944 vs
                  604+300) -- 15 once the shared gap-25 is subtracted. */}
              <div className="mt-[15px]">
                <SportsForm buttons={sportsFormButtons} />
              </div>

              {/* Sports_News sits a plain 40px below Sports form (1212 vs
                  944+228) -- 15 once the shared gap-25 is subtracted. */}
              <div className="mt-[15px]">
                <SportsNews newsByCategory={sportsNewsByCategory} />
              </div>

              {/* Sports Mach analysis sits a plain 40px below Sports_News
                  (1594 vs 1212+341.945) -- 15 once the shared gap-25 is
                  subtracted, same repeating 40px rhythm as every section
                  gap on this page. */}
              <div className="mt-[15px]">
                <SportsMachAnalysis articlesByCategory={sportsMachArticlesByCategory} />
              </div>

              <div className="flex items-center justify-between">
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
