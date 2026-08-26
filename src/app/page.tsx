import { DEFAULT_RING_COLOR } from "../components/Avatar";
import Business from "../components/Business";
import ContainerBg from "../components/ContainerBg";
import Footer from "../components/Footer";
import GameCard, { type GameCardProps } from "../components/GameCard";
import HotGames from "../components/HotGames";
import Language from "../components/Language";
import ProductCard, { type ProductCardProps } from "../components/ProductCard";
import PromotionCard, { type PromotionCardProps } from "../components/PromotionCard";
import QuickLinks from "../components/QuickLinks";
import type { RankedProductCardProps } from "../components/RankedProductCard";
import ScaleToFit from "../components/ScaleToFit";
import Search from "../components/Search";
import SectionHeader from "../components/SectionHeader";
import Sidebar from "../components/Sidebar";
import SocialLinks from "../components/SocialLinks";
import StickyUtilityBar, { HeroZoneEndSentinel } from "../components/StickyUtilityBar";
import TalkingBar from "../components/TalkingBar";
import type { TalkSectionProps } from "../components/TalkSection";
import TopBar from "../components/TopBar";
import TopUp from "../components/TopUp";
import WinList from "../components/WinList";
import type { RankSectionProps } from "../components/RankSection";

const winListRows: RankSectionProps[] = [
  { avatar: "/assets/win-list/avatar-0.png", name: "@Jessica", levelLabel: "Lv.40", levelBackground: "#8d54d8", bet: "200", win: "+ 10,000,000", odds: "0.00x", thumb: "/assets/win-list/game-0.png" },
  { avatar: "/assets/win-list/avatar-1.png", name: "@Jackson", levelLabel: "Lv.100", levelBackground: DEFAULT_RING_COLOR, bet: "1,000", win: "+ 9,000,000", odds: "0.00x", thumb: "/assets/win-list/game-1.png" },
  { avatar: "/assets/win-list/avatar-2.png", name: "@Alex", levelLabel: "Lv.92", levelBackground: "#5fabe7", bet: "990", win: "+ 800,000", odds: "0.00x", thumb: "/assets/win-list/game-2.png" },
  { avatar: "/assets/win-list/avatar-3.png", name: "@Jannie", levelLabel: "Lv.66", levelBackground: "#e9cf88", levelOpacity: 0.66, bet: "20,000", win: "+ 5,020,000", odds: "0.00x", thumb: "/assets/win-list/game-3.png" },
  { avatar: "/assets/win-list/avatar-4.png", name: "@Jessica", levelLabel: "Lv.27", levelBackground: "#2470d2", bet: "4,000", win: "+ 18,200,050", odds: "0.00x", thumb: "/assets/win-list/game-4.png" },
  { avatar: "/assets/win-list/avatar-5.png", name: "@Jannifer", levelLabel: "Lv.40", levelBackground: "#8d54d8", bet: "360", win: "+ 15,600,000", odds: "0.00x", thumb: "/assets/win-list/game-5.png" },
  { avatar: "/assets/win-list/avatar-6.png", name: "@Russell", levelLabel: "Lv.40", levelBackground: "#8d54d8", bet: "5,000", win: "+ 20,100,000", odds: "0.00x", thumb: "/assets/win-list/game-5.png" },
];

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

const businessCards = [
  { logo: "/assets/business/logo-cq9.png", name: "CQ9 GAMING" },
  { logo: "/assets/business/logo-allbet.png", name: "ALLBET" },
  { logo: "/assets/business/logo-wg.png", name: "WG 真人" },
  { logo: "/assets/business/logo-dream.png", name: "DREAM GAMING" },
  { logo: "/assets/business/logo-super.png", name: "SUPER 體育" },
  { logo: "/assets/business/logo-sa.png", name: "SA 娛樂城" },
  { logo: "/assets/business/logo-mt.png", name: "MT 真人" },
  { logo: "/assets/business/logo-ag.png", name: "ASIA GAMING" },
  { logo: "/assets/business/logo-9k.png", name: "9K LOTTORY" },
];

// Same winners/amounts as the player ranking list below, not separate
// placeholder data -- just reformatted from "@Name" / "+ 1,234" into the
// announcement's "Name" / "USDT1,234" shape.
const topBarAnnouncements = winListRows.map((row) => ({
  name: row.name.replace(/^@/, ""),
  amount: `USDT${row.win.replace(/^\+\s*/, "")}`,
}));

// Figma "Hot Games" (node 1136:88905): a numbered rank row, 01-10.
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

// Figma "General Games" / 推薦遊戲 (node 1066:144380). The first slot reuses
// the same zombie-photo demo art as everywhere else in this project, and
// four more slots reuse Hot Games' own art -- Figma repeats those exact
// same game instances across both sections rather than using new photos.
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

// Figma "Form Bar" (node 883:125584): 7 category shortcuts, the same
// looping-video notched card as the homepage's own "輪盤" GameCard demo --
// Wu88_v02's Animations library already has a matching clip per category.
const formBarGames: GameCardProps[] = [
  { video: "/assets/form-bar/slot.mp4", mainText: "電子", subText: "SLOT" },
  { video: "/assets/form-bar/football.mp4", mainText: "足球", subText: "FOOTBALL" },
  { video: "/assets/form-bar/basketball.mp4", mainText: "籃球", subText: "BASKETBALL" },
  { video: "/assets/form-bar/baseball.mp4", mainText: "棒球", subText: "BASEBALL" },
  { video: "/assets/form-bar/live.mp4", mainText: "真人娛樂", subText: "LIVE" },
  { video: "/assets/form-bar/lottery.mp4", mainText: "彩票", subText: "LOTTORY" },
  { video: "/assets/form-bar/board-card.mp4", mainText: "棋牌", subText: "BOARD & CARD" },
];

// Figma "Promotions" / 優惠活動 (node 883:125581): one wide Large card with
// a countdown, then three General cards.
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

// Figma "Cotainer change bar": a 4-segment carousel indicator, first
// segment wider + teal to mark the active hero slide.
function CarouselDots() {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="h-[2px] w-[50px] rounded-full bg-[#23f3d5]" />
      <div className="h-[2px] w-[40px] rounded-full bg-[#f4f4f4]" />
      <div className="h-[2px] w-[40px] rounded-full bg-[#f4f4f4]" />
      <div className="h-[2px] w-[40px] rounded-full bg-[#f4f4f4]" />
    </div>
  );
}

// Figma "Frame 1241": the hero headline sitting on top of Container_BG.
function HeroText() {
  return (
    <div className="flex flex-col items-start gap-[14px]">
      <p className="w-full text-[40px] font-black leading-[36px] tracking-[0.36px] text-[#8d54d8]">精彩不設限 贏得更過癮</p>
      <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">
        高額獎金 <span className="text-[#23f3d5]">24h</span> 精彩不間斷
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f4]">
      <ScaleToFit>
        <div className="sticky top-0 z-20">
          <TopBar onlineCount="900" totalReward="10,000,000" announcements={topBarAnnouncements} />
        </div>

        {/* The white panel's own rounded-tl corner is a normal (non-sticky)
            part of its scrolling box, so it scrolls out of view within the
            first few px of scroll -- same as any other content. This tiny
            patch redraws just that corner curve (radial-gradient: gray
            outside a 60px-radius circle anchored at the patch's own
            bottom-right corner, transparent inside it) as its own sticky
            element pinned right below Top_bar, so the corner motif reads as
            permanent page chrome instead of disappearing on the first
            scroll tick. */}
        {/* `h-0` on the sticky element itself: it must not reserve its own
            60px in normal flow (that would just push the white panel and
            everything after it down by 60px). The visible 60x60 patch is a
            child overflowing that zero-height box instead. */}
        <div className="sticky top-[38px] left-0 z-30 h-0">
          <div
            className="pointer-events-none size-[60px]"
            style={{ background: "radial-gradient(circle at 100% 100%, transparent 60px, #f4f4f4 60px)" }}
          />
        </div>

        {/* Figma "Rectangle 10": everything below Top_bar sits on one white,
            top-left-rounded panel over the page's own gray base -- not a
            per-section white background repeated down the page. Sidebar and
            Talking_Bar are `sticky` grid columns spanning this whole panel
            (not just the hero) so they stay pinned in place as the middle
            column scrolls up "into" the panel's rounded shape -- matching
            the reference's scrolled-state mockup, where the top bar, the
            utility row, and the sidebar are all still visible alongside
            Win List despite the hero having scrolled away above them. */}
        <div className="relative rounded-tl-[60px] bg-white">
          <div className="pointer-events-none absolute left-0 top-0">
            <ContainerBg />
          </div>

          <div className="relative z-10 grid" style={{ gridTemplateColumns: "164px 1249px 295px" }}>
            {/* top-[79px] = Top_bar's own 38px height + the original 41px
                gap below it, now that Top_bar is persistently pinned too
                instead of only ever appearing once at the true page top. */}
            <div className="sticky top-[79px] z-10 self-start justify-self-start pl-[30px]">
              <Sidebar />
            </div>

            <div className="flex flex-col gap-[25px] pb-[40px]">
              {/* Sticky like Top_bar/Sidebar/Talking_Bar, but its background
                  can't be a flat always-on white: while the hero-associated
                  zone (hero art, Form Bar, Hot Games) is still in view this
                  row sits directly over vivid art, and an opaque fill cuts
                  a hard white bar across it -- yet once that whole zone has
                  scrolled away, transparent would let General Games/etc.
                  bleed through instead of being hidden behind it. Rather
                  than a continuous fade (which smears a washed-out
                  translucent band across Form Bar/Hot Games' art for the
                  whole transition), StickyUtilityBar flips instantly, with
                  no transition, the moment the HeroZoneEndSentinel dropped
                  after Hot Games below scrolls past it. */}
              <StickyUtilityBar>
                <div className="flex items-center gap-[20px]">
                  <Search />
                  <Language />
                </div>
                <TopUp account="123456" />
              </StickyUtilityBar>

              <div className="flex flex-col gap-[30px] pt-[130px]">
                <HeroText />
                <CarouselDots />
              </div>

              {/* Figma "Form Bar" sits inside this same hero layer, between
                  the carousel dots and Hot Games -- not below the fold with
                  the other sections. */}
              {/* Fixed at the card's own hover-grown height (not its 184px
                  resting height): `overflow-x-auto` forces the browser to
                  compute overflow-y as "auto" too (a well-known CSS quirk --
                  you can't pair non-visible overflow on one axis with
                  visible on the other), so any resting height here would
                  clip a card's hover-growth instead of letting it expand
                  upward into open space. `overflow-y-hidden` overrides that
                  same auto-Y back off -- without it this row can pick up
                  its own independent vertical scrollbar (e.g. from a
                  sub-pixel height mismatch) that hijacks the mouse wheel
                  instead of it scrolling the page. */}
              <div className="no-scrollbar flex h-[206.816px] items-end gap-[20px] overflow-x-auto overflow-y-hidden">
                {formBarGames.map((game) => (
                  <GameCard key={game.mainText} {...game} />
                ))}
              </div>

              <HotGames games={hotGames} />

              <HeroZoneEndSentinel />

              <div className="flex flex-col gap-[15px]">
                <SectionHeader icon="/assets/section-header/icon-general-games.svg" title="推薦遊戲" />
                <div className="no-scrollbar flex items-center gap-[20px] overflow-x-auto overflow-y-hidden">
                  {generalGames.map((game) => (
                    <ProductCard key={game.title} {...game} />
                  ))}
                </div>
              </div>

              <WinList rows={winListRows} />

              <div className="flex flex-col gap-[15px]">
                <SectionHeader icon="/assets/section-header/icon-promotions.svg" title="優惠活動" />
                <div className="no-scrollbar flex items-center gap-[20px] overflow-x-auto overflow-y-hidden">
                  {promotions.map(({ key, ...promo }) => (
                    <PromotionCard key={key} {...promo} />
                  ))}
                </div>
              </div>

              <Business cards={businessCards} />

              <div className="flex items-center justify-between">
                <SocialLinks />
                <QuickLinks />
              </div>

              <Footer />
            </div>

            {/* top-[58px] = Top_bar's own 38px height + the original 20px
                gap below it (see Sidebar's comment above). */}
            {/* `ml-[20px]` (not `pr-[20px]` / `justify-self-end`): the chat
                column is exactly 275+20=295px, matching Talking_Bar's own
                width plus this gap, so a left margin lands its left edge
                exactly 20px right of the middle column's real content edge
                -- flush with the column's own right edge, needing no right
                padding. The previous `pr-[20px]` padded from the wrong
                side, leaving Talking_Bar flush against the content instead
                (Hot Games/Form Bar cards touching it with zero clearance,
                reading as the whole row feeling cramped against it). */}
            <div className="sticky top-[58px] z-10 ml-[20px] self-start">
              <TalkingBar messages={talkingBarMessages} privateMessages={talkingBarPrivateMessages} simulatedMessages={talkingBarSimulatedMessages} />
            </div>
          </div>
        </div>
      </ScaleToFit>
    </div>
  );
}
