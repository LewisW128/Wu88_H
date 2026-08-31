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
    teamA: { name: "ENGLAND", flag: "/flag/england.png" },
    teamB: { name: "NORWAY", flag: "/flag/norway.png" },
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
    teamA: { name: "RUSSIA", flag: "/flag/russia.png" },
    teamB: { name: "EGYPT", flag: "/flag/egypt.png" },
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
    teamA: { name: "URUGUAY", flag: "/flag/uruguay.png" },
    teamB: { name: "FRANCE", flag: "/flag/france.png" },
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
    teamA: { name: "AUSTRALIA", flag: "/flag/australia.png" },
    teamB: { name: "DENMARK", flag: "/flag/denmark.png" },
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
    teamA: { name: "BRAZIL", flag: "/flag/brazil.png" },
    teamB: { name: "SPAIN", flag: "/flag/spain.png" },
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

// Figma "Frame 1242": a small decorative 6x6 grid of tiny dots, a page-level
// sibling of Container_BG (not part of it) sitting near the bottom-left of
// the hero, overlapping Sidebar's own column -- same position as the
// Casino page's own copy (both measure top-[957px] off the white
// container's own top edge), so it's given a low z-index and sits behind
// Sidebar's sticky column instead of competing with its icons.
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

export default function SportsPage() {
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

          <MicroDotGrid />

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
                <TopUp account="123456" />
              </StickyUtilityBar>

              {/* Sports Live's own top sits 480px below the utility row's
                  bottom edge (measured off 03_WU88-H-PC-Sport node 54:5335
                  vs the utility row's own y+height); the column's shared
                  gap-[25px] already contributes 25 of that, so this margin
                  makes up the remaining 455 -- same measure-the-delta
                  approach as Casino's own Hot Games margin above. */}
              <div className="mt-[455px]">
                <SportsLive games={sportsLiveGames} />
              </div>

              {/* Sports form sits a plain 40px below Sports Live (944 vs
                  604+300) -- 15 once the shared gap-25 is subtracted. */}
              <div className="mt-[15px]">
                <SportsForm buttons={sportsFormButtons} />
              </div>

              {/* Figma has two more sections here (Sports_News, Sports
                  Match analysis) that haven't been built yet -- see the
                  user's own incremental-module workflow for this page.
                  SocialLinks/QuickLinks and Footer follow directly on the
                  shared gap-25 for now rather than faking the gap those
                  missing sections would otherwise take up. */}
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
