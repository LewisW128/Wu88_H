import { DEFAULT_RING_COLOR } from "../../components/Avatar";
import ContainerBg from "../../components/ContainerBg";
import Footer from "../../components/Footer";
import Language from "../../components/Language";
import MinPanelHeight from "../../components/MinPanelHeight";
import Promotions from "../../components/Promotions";
import { type PromotionCardProps } from "../../components/PromotionCard";
import PromotionsGrid, { type PromotionsCategory } from "../../components/PromotionsGrid";
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

const talkingBarSimulatedMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "剛剛", text: "有沒有人在玩百家樂的？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "剛剛", text: "我在，怎麼了？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "剛剛", text: "剛剛連續開三把大，太扯了", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "剛剛", text: "手氣不錯喔，繼續加油", variant: "other" },
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "剛剛", text: "有推薦的電子遊戲嗎？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "剛剛", text: "我都玩殭屍大戰，蠻好玩的", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "剛剛", text: "我去試試看", variant: "other" },
];

const talkingBarPrivateMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "5 分鐘前", text: "嗨，方便私訊聊嗎？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "4 分鐘前", text: "可以啊，怎麼了？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, timestamp: "3 分鐘前", text: "剛剛那個遊戲的連結可以給我嗎？", variant: "other" },
];

// Same "Promotions" row Figma reuses on the homepage (04_WU88-H-PC-Promotions
// node 106:10865 is the same component instance, not new art/copy).
const topPromotions: (PromotionCardProps & { key: string })[] = [
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

// The page's own "所有優惠" grid (node 106:10866): 10 distinct promo cards
// in Figma's own mixed Large/Small sizes. See PromotionsGrid's comment for
// why 新會員/VIP/體育/賭場 below are this project's own grouping of these
// same 10 by each card's copy, not a second Figma tab state.
const allPromotions: (PromotionCardProps & { key: string })[] = [
  {
    key: "new-member",
    size: "Large",
    image: "/assets/promotions/large-usdt.png",
    lines: ["新會員首儲『贈』", "200,000"],
    countdown: { days: "08", hours: "08", minutes: "12", seconds: "32" },
  },
  { key: "roulette", size: "Small", image: "/assets/promotions/roulette.png", lines: ["輪盤抽獎活動", ""] },
  { key: "fortune", size: "Small", image: "/assets/promotions/fortune-gems.png", lines: ["首儲就送", "8,888 發財金"] },
  { key: "neo-live", size: "Small", image: "/assets/promotions/neo-live.png", lines: ["來 NEO 真人", "精彩不凡人生"] },
  { key: "usdt-rebate", size: "Small", image: "/assets/promotions/usdt-rebate-2pct.png", lines: ["USTD 返利無上限", "每筆加贈 2%"] },
  { key: "gclass", size: "Small", image: "/assets/promotions/gclass.png", lines: ["贏取一輛", "G-CLASS"] },
  { key: "mall-gifts", size: "Small", image: "/assets/promotions/mall-gifts.png", lines: ["商城好禮購", "好禮 5 選 1"] },
  { key: "gift-card", size: "Small", image: "/assets/promotions/gift-card.png", lines: ["禮品卡兌換", ""] },
  { key: "world-cup", size: "Small", image: "/assets/promotions/world-cup.png", lines: ["看世足賽領獎金", "6,666"] },
  { key: "vip-jet", size: "Small", image: "/assets/promotions/vip-jet.png", lines: ["VIP 用戶", "獨享"] },
];

const byKey = (keys: string[]) => allPromotions.filter((p) => keys.includes(p.key));

const PROMOTIONS_CATEGORIES: PromotionsCategory[] = [
  { key: "all", icon: "/icon/action-overview.svg", label: "全部", promotions: allPromotions },
  { key: "member", icon: "/icon/action-gift.svg", label: "新會員", promotions: byKey(["new-member", "fortune"]) },
  { key: "vip", icon: "/icon/action-vip.svg", label: "VIP", promotions: byKey(["vip-jet", "gift-card"]) },
  { key: "sport", icon: "/icon/action-sport.svg", label: "體育", promotions: byKey(["world-cup"]) },
  { key: "casino", icon: "/icon/action-casino.svg", label: "賭場", promotions: byKey(["neo-live", "roulette"]) },
];

export default function PromotionsPage() {
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
            <ContainerBg variant="promotions" />
          </div>

          <MinPanelHeight className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            <div className="sticky top-[79px] z-10 self-start justify-self-start pl-[30px]">
              <Sidebar page="promo" />
            </div>

            <div className="flex flex-col gap-[25px] pb-[40px]">
              <StickyUtilityBar>
                <div className="flex items-center gap-[20px]">
                  <Search />
                  <Language />
                </div>
                <TopUp account="123456" />
              </StickyUtilityBar>

              {/* Same 384px gap under the hero as Casino/Sports use -- no
                  headline/carousel/Form Bar on this page either, just the
                  "PROMOTIONS" hero art directly above the reused
                  Promotions row, and Container_BG is the identical
                  1078px-tall hero on all three pages, so the same margin
                  that lines Casino's Hot Games up under its own hero
                  should hold here too. Verify against the live Figma
                  screenshot and adjust if the reused row sits off. */}
              <div className="mt-[384px]">
                <Promotions promotions={topPromotions} />
              </div>

              <PromotionsGrid categories={PROMOTIONS_CATEGORIES} />

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
