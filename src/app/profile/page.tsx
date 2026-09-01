import { DEFAULT_RING_COLOR } from "../../components/Avatar";
import Footer from "../../components/Footer";
import GeneralGames from "../../components/GeneralGames";
import Language from "../../components/Language";
import MinPanelHeight from "../../components/MinPanelHeight";
import type { ProductCardProps } from "../../components/ProductCard";
import ProfileCard from "../../components/ProfileCard";
import type { PromotionCardProps } from "../../components/PromotionCard";
import Promotions from "../../components/Promotions";
import QuickLinks from "../../components/QuickLinks";
import ScaleToFit from "../../components/ScaleToFit";
import Search from "../../components/Search";
import Sidebar from "../../components/Sidebar";
import SocialLinks from "../../components/SocialLinks";
import Statistics from "../../components/Statistics";
import StickyUtilityBar from "../../components/StickyUtilityBar";
import TalkingBar from "../../components/TalkingBar";
import type { TalkSectionProps } from "../../components/TalkSection";
import TopBar from "../../components/TopBar";
import TopUp from "../../components/TopUp";
import VipCard from "../../components/VipCard";

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

// Same group chat / private thread / live-drip data as every other page's
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

// Figma "General Games" (05_WU88-H-PC-Profile-Page node 451:16762, seen
// live at 428:17332): the same 電子遊戲推薦 row every other page shows --
// not a profile-specific game list.
const generalGames: ProductCardProps[] = [
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

// Figma "Promotions" (node 451:18295, seen live at 428:17332): same 優惠活動
// row as the homepage's own -- one Large countdown card plus three General
// cards.
const promotions: (PromotionCardProps & { key: string })[] = [
  {
    key: "usdt",
    size: "Large",
    image: "/assets/promotions/large-usdt.png",
    lines: ["新會員首儲『贈』", "200,000"],
    countdown: { days: "08", hours: "08", minutes: "12", seconds: "32" },
  },
  { key: "rebate", size: "General", image: "/assets/promotions/rebate.png", lines: ["ＵＳＤＴ返利無上限", "每筆加碼贈 20%"] },
  { key: "store", size: "General", image: "/assets/promotions/convenience-store.png", lines: ["超商儲值禮", "送 G-CLASS"] },
  { key: "wheel", size: "General", image: "/assets/promotions/wheel.png", lines: ["天天轉 8,888", "武財神風輪盤"] },
];

export default function ProfilePage() {
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

        {/* No Container_BG on this page -- Figma's own page frame (node
            428:17332) has no hero instance at all, unlike home/casino/
            sports. Content starts right below the utility row. */}
        <div className="relative rounded-tl-[60px] bg-white">
          <MinPanelHeight className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            <div className="sticky top-[79px] z-10 self-start justify-self-start pl-[30px]">
              <Sidebar page="profile" />
            </div>

            <div className="flex flex-col gap-[25px] pb-[40px]">
              <StickyUtilityBar>
                <div className="flex items-center gap-[20px]">
                  <Search />
                  <Language />
                </div>
                <TopUp account="123456" />
              </StickyUtilityBar>

              <div className="flex w-full items-start gap-[20px]">
                <ProfileCard avatar="/assets/profile/avatar-placeholder.jpg" name="JESSICA" email="JESSICA123@gmail.com" memberId="1234567890" />
                <VipCard level={8} currentExp={700} maxExp={1500} continuousDeposit="10,000" />
              </div>

              <GeneralGames games={generalGames} />

              <Statistics
                stats={[
                  { icon: "/assets/statistics/icon-diamond.svg", value: "10,000", label: "總投注" },
                  { icon: "/assets/statistics/icon-win.svg", value: "10,000,000", label: "總獲利" },
                  { icon: "/assets/statistics/icon-trophy.svg", value: "6", label: "排名" },
                  { icon: "/assets/statistics/icon-fraction.svg", value: "100,000%", label: "平均勝率" },
                ]}
              />

              <Promotions promotions={promotions} />

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
