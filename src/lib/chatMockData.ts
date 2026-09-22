import { DEFAULT_RING_COLOR } from "../components/Avatar";
import { JACKSON_AVATAR_RING, LEVEL_LEBALS_BACKGROUND } from "./levelBadge";
import { MEMBER_BEST_WIN, formatMoney } from "./member";
import type { Friend } from "../components/TalkingBar";
import type { TalkSectionProps } from "../components/TalkSection";

// Shared across every page's own TopBar/TalkingBar instance -- there's only
// one site-wide group chat and one win-announcement feed, not a separate
// trimmed-down copy per page. Moved here (out of ProfileContent, the first
// page to need it) once a second page (Rewards center) needed the exact
// same data rather than a near-duplicate.
export const winListRows = [
  { name: "@Jessica", win: `+ ${formatMoney(MEMBER_BEST_WIN)}` },
  { name: "@Jackson", win: "+ 9,000,000" },
  { name: "@Alex", win: "+ 800,000" },
  { name: "@Jannie", win: "+ 5,020,000" },
  { name: "@Jasmine", win: "+ 18,200,050" },
  { name: "@Jannifer", win: "+ 15,600,000" },
  { name: "@Russell", win: "+ 20,100,000" },
];

export const topBarAnnouncements = winListRows.map((row) => ({
  name: row.name.replace(/^@/, ""),
  amount: `USDT${row.win.replace(/^\+\s*/, "")}`,
}));

export const talkingBarMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "嗨～！剛剛進來玩", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "有什麼好玩的呢？有誰可以推薦嗎？", variant: "myself" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: LEVEL_LEBALS_BACKGROUND,
    ringColor: JACKSON_AVATAR_RING,
    timestamp: "3 分鐘前",
    text: "我剛剛才中了時二十萬出來",
    variant: "other",
    replyTo: { name: "Jessica", text: "有什麼好玩的呢？有誰可以推薦嗎？" },
  },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "真的假的，這麼容易嗎？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: LEVEL_LEBALS_BACKGROUND, ringColor: JACKSON_AVATAR_RING, timestamp: "3 分鐘前", text: "真的啊～趕快去試試！", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "你玩哪個遊戲？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "3 分鐘前", text: "XXX電子 射龍門", variant: "other" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "剛剛輸慘了 IOI", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: LEVEL_LEBALS_BACKGROUND, ringColor: JACKSON_AVATAR_RING, timestamp: "3 分鐘前", text: "你玩什麼？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "XXX 真人", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: LEVEL_LEBALS_BACKGROUND, ringColor: JACKSON_AVATAR_RING, timestamp: "3 分鐘前", text: "拍拍 多下幾注就會贏回來了", variant: "other" },
];

// Cycled into the group chat one at a time so it reads as a live, ongoing
// conversation instead of a finished transcript.
export const talkingBarSimulatedMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "剛剛", text: "有沒有人在玩百家樂的？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "剛剛", text: "我在，怎麼了？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "剛剛", text: "剛剛連續開三把大，太扯了", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: LEVEL_LEBALS_BACKGROUND, ringColor: JACKSON_AVATAR_RING, timestamp: "剛剛", text: "手氣不錯喔，繼續加油", variant: "other" },
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "剛剛", text: "有推薦的電子遊戲嗎？", variant: "other" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "剛剛", text: "我都玩殭屍大戰，蠻好玩的", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "剛剛", text: "我去試試看", variant: "other" },
];

// The 私人訊息 channel's own friend list (Components Library node
// 754:9317) -- picking a friend opens their own thread (node 998:10020)
// instead of skipping straight to one hardcoded conversation the way the
// old flat `privateMessages` prop did. Arick has no `lastMessage` (and an
// empty thread) on purpose, matching Figma's own reference card, which
// omits the message preview entirely -- reads as "a friend you haven't
// messaged yet" rather than a missing value.
export const talkingBarFriends: Friend[] = [
  {
    id: "service",
    name: "@ Service",
    avatar: "",
    icon: "/assets/talk-section/icon-service.svg",
    status: "online",
    messages: [
      {
        avatar: "/assets/talk-section/icon-service.svg",
        name: "@ Service",
        timestamp: "剛剛",
        text: "您好，需要什麼協助呢？",
        variant: "other",
      },
    ],
  },
  {
    id: "jackson",
    name: "@ Jackson",
    avatar: "/assets/talk-section/avatar-jackson.png",
    levelLabel: "Lv.100",
    levelBackground: LEVEL_LEBALS_BACKGROUND,
    ringColor: JACKSON_AVATAR_RING,
    status: "online",
    timestamp: "3 分鐘前",
    lastMessage: "我剛剛才中了時...",
    messages: [
      {
        avatar: "/assets/talk-section/avatar-jessica.png",
        name: "@ Jessica",
        timestamp: "3 分鐘前",
        text: "嗨～！剛剛進來玩",
        variant: "myself",
      },
      {
        avatar: "/assets/talk-section/avatar-jessica.png",
        name: "@ Jessica",
        timestamp: "3 分鐘前",
        text: "有什麼好玩的呢？有誰可以推薦嗎？",
        variant: "myself",
      },
      {
        avatar: "/assets/talk-section/avatar-jackson.png",
        name: "@ Jackson",
        levelLabel: "Lv.100",
        levelBackground: LEVEL_LEBALS_BACKGROUND,
        ringColor: JACKSON_AVATAR_RING,
        timestamp: "剛剛",
        text: "我剛剛才中了時二十萬出來",
        variant: "other",
        replyTo: { name: "Jessica", text: "有什麼好玩的呢？有誰可以推薦嗎？" },
      },
    ],
  },
  {
    id: "johnny",
    name: "@ Johnny",
    avatar: "/assets/talk-section/avatar-johnny.png",
    levelLabel: "Lv.79",
    levelBackground: "#79d4a2",
    status: "away",
    timestamp: "3 分鐘前",
    lastMessage: "XXX電子 射龍門",
    messages: [
      { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "12 分鐘前", text: "在嗎？想約你打幾把", variant: "other" },
      { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "11 分鐘前", text: "在啊，玩什麼？", variant: "myself" },
      { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "10 分鐘前", text: "XXX電子 射龍門，一起來", variant: "other" },
    ],
  },
  {
    id: "arick",
    name: "@ Arick",
    avatar: "/assets/talk-section/avatar-arick.png",
    levelLabel: "Lv.53",
    levelBackground: "#ffcf00",
    status: "offline",

    messages: [],
  },
];
