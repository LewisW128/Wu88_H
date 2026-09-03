import { DEFAULT_RING_COLOR } from "../components/Avatar";
import Business from "../components/Business";
import Footer from "../components/Footer";
import { type GameCardProps } from "../components/GameCard";
import FormBar from "../components/FormBar";
import GeneralGames from "../components/GeneralGames";
import {
  Provider as HeroCarouselProvider,
  Background as HeroCarouselBackground,
  Content as HeroCarouselContent,
  Dots as HeroCarouselDots,
} from "../components/HomeHeroCarousel";
import HotGames from "../components/HotGames";
import Language from "../components/Language";
import { type PromotionCardProps } from "../components/PromotionCard";
import Promotions from "../components/Promotions";
import QuickLinks from "../components/QuickLinks";
import ScaleToFit from "../components/ScaleToFit";
import Search from "../components/Search";
import Sidebar from "../components/Sidebar";
import SocialLinks from "../components/SocialLinks";
import StickyUtilityBar from "../components/StickyUtilityBar";
import TalkingBar from "../components/TalkingBar";
import type { TalkSectionProps } from "../components/TalkSection";
import TopBar from "../components/TopBar";
import TopUp from "../components/TopUp";
import WinList from "../components/WinList";
import type { RankSectionProps } from "../components/RankSection";
import { hotGames, generalGames } from "../lib/games";

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
          {/* HomeHeroCarousel.Provider wraps both Background (this section,
              a sibling of the grid below) and Content (inside the grid's
              middle column, far below) so they share one `active` slide
              index -- see that component's own comment on why they can't
              just be local state in either piece alone. */}
          <HeroCarouselProvider>
          {/* Anchored to the RIGHT edge, not the left: Container_BG is a
              fixed 1728x1078 asset that can't stretch to fill a wider
              fluid panel without distorting or zooming the video, so on a
              screen wider than the design width it stays its own native
              size and instead slides right to keep its right edge flush
              with the panel's own (now wider) right edge -- following
              Talking_Bar rather than sitting stuck flush against Sidebar
              with a growing gap of dead white space to its right. At the
              design width this is pixel-identical to left-0 (panel width
              == 1728 == this box's own width), and the area it uncovers
              on the left as it slides right repaints as this panel's own
              white background, indistinguishable from the video's own
              blank left margin it used to show there. */}
          <div className="pointer-events-none absolute right-0 top-0">
            <HeroCarouselBackground />
          </div>

          {/* The middle column is fluid (not a fixed 1249px) so this grid
              actually uses whatever extra width a wide screen gives it --
              ScaleToFit's own wrapper only lets that extra width reach
              here at all once scale is pinned at 1 (see ScaleToFit.tsx).
              Every horizontal-scroll row in this column (Hot Games,
              General Games, Form Bar, Promotions, Business) is already
              a plain flex row with no fixed width of its own, so a wider
              column just lets the browser's normal flex-wrap-before-
              overflow behavior show more cards before the row needs
              scrolling -- no per-row "how many fit" logic needed.
              `minmax(0,1fr)`, not a bare `1fr`: a plain `1fr` track can't
              shrink below its content's own natural min-width, so a
              horizontal-scroll row's full unscrolled content width would
              force the whole grid wider than intended at narrow sizes;
              `minmax(0, ...)` explicitly allows the track to go to 0,
              letting overflow-x-auto do its normal job instead. */}
          <div className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            {/* top-[79px] = Top_bar's own 38px height + the original 41px
                gap below it, now that Top_bar is persistently pinned too
                instead of only ever appearing once at the true page top. */}
            <div className="sticky top-[79px] z-10 self-start justify-self-start pl-[30px]">
              <Sidebar />
            </div>

            <div className="flex flex-col gap-[25px] pb-[40px]">
              {/* Sticky like Top_bar/Sidebar/Talking_Bar, from scroll
                  position 0 -- no background of its own and no
                  scroll-triggered state (see StickyUtilityBar's own
                  comment). Search/Language/Top_up each own their own
                  look throughout. */}
              <StickyUtilityBar>
                <div className="flex items-center gap-[20px]">
                  <Search />
                  <Language />
                </div>
                <TopUp />
              </StickyUtilityBar>

              {/* Figma (01_WU88-H-PC-Home-Page node 883:125520) puts Frame
                  1241's headline at absolute y=299, 150px below where the
                  utility row (Search/Language, itself ending at y≈124)
                  actually sits -- not the 130px this used to have, which
                  landed the headline 20px too high. The carousel dots sit
                  another 123px below the headline block's own bottom
                  (y=492 vs the headline group's y=369), not a plain 30px
                  gap -- Figma's own composition gives the dots real
                  breathing room below the text instead of hugging it. The
                  trailing `pb-[15px]` makes up the rest of the gap down to
                  Form Bar (y=532): the parent's own `gap-[25px]` between
                  siblings already matches Figma everywhere else in this
                  column (Form Bar to Hot Games, Hot Games to General
                  Games, etc.), so the extra 15px belongs here, on this
                  wrapper, rather than changing that shared gap. */}
              <div className="flex flex-col gap-[123px] pb-[15px] pt-[150px]">
                <HeroCarouselContent />
                <HeroCarouselDots />
              </div>

              {/* Figma "Form Bar" sits inside this same hero layer, between
                  the carousel dots and Hot Games -- not below the fold with
                  the other sections. */}
              <FormBar games={formBarGames} />

              <HotGames games={hotGames} />

              <GeneralGames games={generalGames} />

              <WinList rows={winListRows} />

              <Promotions promotions={promotions} />

              <Business cards={businessCards} />

              {/* 80px below Business specifically, not this column's
                  shared gap-[25px] every other pair of sections uses --
                  mt-[55px] tops that up to 80 (25+55) without changing
                  the gap value itself. */}
              <div className="mt-[55px] flex items-center justify-between">
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
          </HeroCarouselProvider>
        </div>
      </ScaleToFit>
    </div>
  );
}
