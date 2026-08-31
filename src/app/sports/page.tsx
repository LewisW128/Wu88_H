import { DEFAULT_RING_COLOR } from "../../components/Avatar";
import ContainerBg from "../../components/ContainerBg";
import Footer from "../../components/Footer";
import Language from "../../components/Language";
import type { MatchAnalysisCardProps } from "../../components/MatchAnalysisCard";
import MinPanelHeight from "../../components/MinPanelHeight";
import type { NewsBannerProps } from "../../components/NewsBanner";
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

// Figma "Sports_News" (node 66:59470): 5 News Banner cards. The 2nd card's
// own caption in Figma is literally identical to the 1st's (never got
// customized past the default placeholder) -- kept as-is rather than
// inventing a different headline that isn't in the design.
const sportsNewsBanners: NewsBannerProps[] = [
  { image: "/assets/sports-news/argentina-1.jpg", caption: "不想待在英超了嗎？阿根廷晉級決賽功臣發文嘲笑英格蘭惹怒球迷" },
  { image: "/assets/sports-news/argentina-2.jpg", caption: "不想待在英超了嗎？阿根廷晉級決賽功臣發文嘲笑英格蘭惹怒球迷" },
  { image: "/assets/sports-news/messi.jpg", caption: "世足》梅西不只會西班牙語 自曝「我會講英語但不喜歡」" },
  { image: "/assets/sports-news/mlb-lee.jpg", caption: "MLB》美媒盛讚李灝宇值得待在大聯盟！老虎隨隊記者點出待進步之處" },
  { image: "/assets/sports-news/mlb-rankings.jpg", caption: "MLB》最新打擊實力榜出爐！大谷翔平狂轟猛炸排名回升 卻仍輸PCA" },
];

// Figma "Sports Mach analysis" (node 66:20574): 8 Match analysis cards.
// The 4th card reuses the 1st's photo+headline in Figma too (same "not yet
// customized" placeholder pattern as News Banner above).
const sportsMachArticles: MatchAnalysisCardProps[] = [
  {
    image: "/assets/sports-match/bellingham.jpg",
    title: "世足/阿根廷慶功他不爽！貝林漢拍對手後腦恐遭禁賽",
    date: "2026年7月17日週五 上午10:41",
    excerpt:
      "英格蘭今在世界盃4強賽以1比2不敵阿根廷，比賽結束英格蘭中場貝林漢（Jude Bellingham）淚謝球迷後，被鏡頭拍到打阿根廷替補球員巴柯（Valentin Barco）的後腦引發軒然大波，恐面臨國際足總追加禁賽處罰。雙方此役火藥味十足，全場共出現26次犯規，英格蘭在第55分鐘破門以1比0領先，眼看就要拿到自1966年以來首張世界盃決賽門票，沒想到第85分鐘與傷停補時階段被阿根廷逆轉。",
  },
  {
    image: "/assets/sports-match/argentina.jpg",
    title: "不想待在英超了嗎？阿根廷晉級決賽功臣發文嘲笑英格蘭惹怒球迷",
    date: "2026年7月17日週五 上午10:41",
    excerpt:
      "阿根廷能在四強賽2:1擊敗英格蘭，25歲中場大將費南德斯功不可沒，他在第85分鐘以一記精彩長射破網，讓阿根廷追成1:1平手，這位效力英超藍軍切爾西的好手，似乎是鐵了心要離開了，在自己的IG上發文嘲笑英格蘭，也讓英格蘭球迷對他更感冒。",
  },
  {
    image: "/assets/sports-match/heat.jpg",
    title: "NBA》熱火昔日兄弟撕破臉！Adebayo爆揍Herro內幕曝光 NBA官方決定不罰了",
    date: "2026年7月17日週五 上午10:41",
    excerpt:
      "邁阿密熱火昔日兩大主力Bam Adebayo與Tyler Herro，日前在拉斯維加斯爆發肢體衝突，不過，這場風波似乎將高高舉起、輕輕放下。根據《ESPN》權威記者Shams Charania報導，聯盟發言人證實，在與兩位球員及球員工會溝通後，各方都希望盡快息事寧人，因此官方決定不對動手的Adebayo進行任何處罰。",
  },
  {
    image: "/assets/sports-match/bellingham.jpg",
    title: "世足/阿根廷慶功他不爽！貝林漢拍對手後腦恐遭禁賽",
    date: "2026年7月17日週五 上午10:41",
    excerpt:
      "英格蘭今在世界盃4強賽以1比2不敵阿根廷，比賽結束英格蘭中場貝林漢（Jude Bellingham）淚謝球迷後，被鏡頭拍到打阿根廷替補球員巴柯（Valentin Barco）的後腦引發軒然大波，恐面臨國際足總追加禁賽處罰。",
  },
  {
    image: "/assets/sports-match/sasaki.jpg",
    title: "佐佐木朗希6局「斷崖式下滑」原因曝光！羅伯斯揭真相　再捎大谷回歸好消息",
    date: "2026年7月17日週五 上午10:41",
    excerpt:
      "道奇日籍投手佐佐木朗希今（31日）先發對戰水手，主投5又1/3局失2分，收下本季第5勝，也是近期2連勝。不過他在前5局無失分的情況下，第6局卻突然球速、控球同步下滑。賽後總教練羅伯斯（Dave Roberts）透露，主因是右小腿抽筋，並大讚佐佐木下半季展現出更強烈的自信心。",
  },
  {
    image: "/assets/sports-match/scooter.jpg",
    title: "MLB／騎滑板車撞消防車　巨人隊貝德離譜事蹟+1！左腳骨折宣告本季報銷",
    date: "2026年7月17日週五 上午10:41",
    excerpt:
      "近來名古屋亞運棒球中華隊球員徵召爭議，出現富邦悍將、台鋼雄鷹去跟棒協「協調」後，沒有支援球員，以及有高達8位旅外球員徵召，包括受傷開刀的徐若熙、大聯盟球員鄭宗哲，筆者認為，球團、棒協及運動部應該坐下來針對補充役球員的徵召進行討論、協商。",
  },
  {
    image: "/assets/sports-match/fifa-president.jpg",
    title: "FIFA主席偷賣世界盃股權！UEFA怒聯手55國封殺所有賽事　痛批：非可交易商品",
    date: "2026年7月17日週五 上午10:41",
    excerpt:
      "歐洲足球總會（UEFA）昨（30）日召開緊急會議，旗下55個會員協會一致通過決議，將全面杯葛國際足球總會（FIFA）主辦的所有賽事，以反對FIFA主席因凡提諾（Gianni Infantino）提出出售世界盃部分股權予私人投資者的計畫。歐足總強調，世界盃屬於全球足球共同資產，絕非可供交易的商業商品。",
  },
  {
    image: "/assets/sports-match/lakers.jpg",
    title: "湖人醞釀重磅交易？傳將全力挖角Jokic　盼與Doncic組歐洲雙星",
    date: "2026年7月17日週五 上午10:41",
    excerpt:
      "洛杉磯湖人隊正醞釀一筆可能撼動 NBA 版圖的超級重磅交易。隨著丹佛金塊隊為規避豪華稅，將前鋒 Peyton Watson 交易至克里夫蘭騎士隊，球隊內部動盪引發外界關注。據湖人內部消息人士 Anthony F. Irwin 透露，待湖人球團所有權問題塵埃落定後，球隊將下定決心全力網羅三屆最有價值球員 Nikola Jokic，期盼讓他與當家球星 Luka Doncic 聯手。",
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

              {/* Sports_News sits a plain 40px below Sports form (1212 vs
                  944+228) -- 15 once the shared gap-25 is subtracted. */}
              <div className="mt-[15px]">
                <SportsNews banners={sportsNewsBanners} />
              </div>

              {/* Sports Mach analysis sits a plain 40px below Sports_News
                  (1594 vs 1212+341.945) -- 15 once the shared gap-25 is
                  subtracted, same repeating 40px rhythm as every section
                  gap on this page. */}
              <div className="mt-[15px]">
                <SportsMachAnalysis articles={sportsMachArticles} />
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
