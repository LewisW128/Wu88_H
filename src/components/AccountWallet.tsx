"use client";

import { useState } from "react";
import AnimatedArrowSpecial, { useArrowPulse } from "./AnimatedArrowSpecial";
import Footer from "./Footer";
import Language from "./Language";
import MinPanelHeight from "./MinPanelHeight";
import ProfileSidebar from "./ProfileSidebar";
import ScaleToFit from "./ScaleToFit";
import Search from "./Search";
import StickyUtilityBar from "./StickyUtilityBar";
import TalkingBar, { type Friend } from "./TalkingBar";
import type { TalkSectionProps } from "./TalkSection";
import TopBar from "./TopBar";
import TopUp from "./TopUp";
import { withBasePath } from "../lib/asset";

// Same group chat / friend list data as every other page's TalkingBar --
// not a trimmed-down version. There's only one chat, not a separate one
// per page.
const talkingBarMessages: TalkSectionProps[] = [
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "嗨～！剛剛進來玩", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "有什麼好玩的呢？有誰可以推薦嗎？", variant: "myself" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    timestamp: "3 分鐘前",
    text: "我剛剛才中了時二十萬出來",
    variant: "other",
    replyTo: { name: "Jessica", text: "有什麼好玩的呢？有誰可以推薦嗎？" },
  },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "真的假的，這麼容易嗎？", variant: "myself" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    timestamp: "3 分鐘前",
    text: "真的啊～趕快去試試！",
    variant: "other",
  },
  { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "3 分鐘前", text: "你玩哪個遊戲？", variant: "myself" },
  { avatar: "/assets/talk-section/avatar-johnny.png", name: "@ Johnny", levelLabel: "Lv.79", levelBackground: "#79d4a2", timestamp: "3 分鐘前", text: "XXX電子 射龍門", variant: "other" },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "剛剛輸慘了 IOI", variant: "other" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    timestamp: "3 分鐘前",
    text: "你玩什麼？",
    variant: "other",
  },
  { avatar: "/assets/talk-section/avatar-arick.png", name: "@ Arick", levelLabel: "Lv.53", levelBackground: "#ffcf00", timestamp: "3 分鐘前", text: "XXX 真人", variant: "other" },
  {
    avatar: "/assets/talk-section/avatar-jackson.png",
    name: "@ Jackson",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    timestamp: "3 分鐘前",
    text: "拍拍 多下幾注就會贏回來了",
    variant: "other",
  },
];

const talkingBarFriends: Friend[] = [
  {
    id: "jackson",
    name: "@ Jackson",
    avatar: "/assets/talk-section/avatar-jackson.png",
    levelLabel: "Lv.100",
    levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)",
    status: "online",
    timestamp: "3 分鐘前",
    lastMessage: "剛剛那個遊戲的連結可以給我嗎？",
    messages: [
      { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)", timestamp: "5 分鐘前", text: "嗨，方便私訊聊嗎？", variant: "other" },
      { avatar: "/assets/talk-section/avatar-jessica.png", name: "@ Jessica", timestamp: "4 分鐘前", text: "可以啊，怎麼了？", variant: "myself" },
      { avatar: "/assets/talk-section/avatar-jackson.png", name: "@ Jackson", levelLabel: "Lv.100", levelBackground: "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)", timestamp: "3 分鐘前", text: "剛剛那個遊戲的連結可以給我嗎？", variant: "other" },
    ],
  },
  {
    id: "johnny",
    name: "@ Johnny",
    avatar: "/assets/talk-section/avatar-johnny.png",
    levelLabel: "Lv.79",
    levelBackground: "#79d4a2",
    status: "away",
    timestamp: "10 分鐘前",
    lastMessage: "XXX電子 射龍門，一起來",
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
    timestamp: "1 小時前",
    messages: [],
  },
];

type Transaction = { name: string; date: string; amount: string; color: string };

// Figma "Wallet"'s own 13 rows (05_WU88-H-PC-Profile-Page node 610:45399,
// seen live at node 547:15722's own 帳戶明細 page): 信用卡充值/返水 in teal
// (#38ddcd, a deposit/credit), 託售 in pink (#ff76aa, a debit) -- reused
// verbatim rather than inventing new figures, including the repeated rows
// (Figma's own export repeats "信用卡充值" $10,000 six times).
const TRANSACTIONS: Transaction[] = [
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "託售", date: "06/12 13:30", amount: "-$100,000", color: "#ff76aa" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "返水", date: "06/12 13:30", amount: "$1,000,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd" },
];

const TABS = ["交易明細", "轉點明細", "投注紀錄", "活動點數", "其他明細"] as const;

function StatCard({ icon, label, value, valueColor = "#3e4140" }: { icon: string; label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-[10px] rounded-[20px] bg-[#f4f4f4] p-[20px]">
      <div className="flex items-center gap-[8px]">
        <img alt="" src={withBasePath(icon)} className="size-[25px]" />
        <p className="whitespace-nowrap text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">{label}</p>
      </div>
      <p className="whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px]" style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button type="button" className="flex shrink-0 items-center gap-[50px] rounded-[50px] bg-[#3e4140] px-[20px] py-[10px]">
      <span className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-white">{label}</span>
      <img alt="" src={withBasePath("/assets/wallet/icon-chevron-down.svg")} className="size-[25px]" />
    </button>
  );
}

function TransactionRow({ name, date, amount, color }: Transaction) {
  return (
    <div className="flex w-full items-center justify-between rounded-[25px] bg-[#fafafa] px-[20px] py-[10px]">
      <div className="flex w-[80px] shrink-0 flex-col items-start gap-[5px]">
        <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">{name}</p>
        <p className="whitespace-nowrap text-[12px] leading-[18px] text-[#a2a2a2]">{date}</p>
      </div>
      <div className="flex items-center gap-[40px]">
        <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px]" style={{ color }}>
          {amount}
        </p>
        <img alt="" src={withBasePath("/assets/wallet/icon-expand.svg")} className="size-[16px]" />
      </div>
    </div>
  );
}

// Figma "MacBook Pro 16" - Account Details" (05_WU88-H-PC-Profile-Page
// node 547:15722, "錢包" in ProfileSidebar): the wallet/transaction-detail
// sub-page, previously decorative -- same page shell as /profile and
// /profile/account (ScaleToFit/TopBar/ProfileSidebar/TalkingBar/Footer,
// the same 164px/1fr/295px grid), since Figma's own frame reuses that
// exact rail/chat-panel pairing rather than a bespoke layout.
//
// Figma only ever designed content for the 交易明細 tab (the 13-row
// Wallet list below) -- the other four tabs are real clickable state (the
// underline actually moves), but since no design exists for what they'd
// show, they render a plain "沒有任何資料" placeholder rather than
// fabricating content Figma never specified.
export default function AccountWallet() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("交易明細");
  const topUpArrow = useArrowPulse();

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f4]">
      <ScaleToFit>
        <div className="sticky top-0 z-20">
          <TopBar
            onlineCount="900"
            totalReward="10,000,000"
            announcements={[
              { name: "Jessica", amount: "USDT10,000,000" },
              { name: "Jackson", amount: "USDT9,000,000" },
              { name: "Alex", amount: "USDT800,000" },
            ]}
          />
        </div>

        <div className="sticky top-[38px] left-0 z-30 h-0">
          <div
            className="pointer-events-none size-[60px]"
            style={{ background: "radial-gradient(circle at 100% 100%, transparent 60px, #f4f4f4 60px)" }}
          />
        </div>

        <div className="relative rounded-tl-[60px] bg-white">
          <MinPanelHeight className="relative z-10 grid" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            <div className="sticky top-[79px] z-10 self-start justify-self-start pl-[30px]">
              <ProfileSidebar />
            </div>

            <div className="flex flex-col gap-[25px] pb-[40px]">
              <StickyUtilityBar>
                <div className="flex items-center gap-[20px]">
                  <Search />
                  <Language />
                </div>
                <TopUp />
              </StickyUtilityBar>

              <div className="mt-[40px] flex w-full flex-col items-start gap-[20px] rounded-[30px] border-2 border-[#f4f4f4] p-[30px]">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <img alt="" src={withBasePath("/assets/statistics/icon-balance.svg")} className="size-[25px]" />
                    <div className="h-[20px] w-px bg-[#f4f4f4]" />
                    <p className="whitespace-nowrap text-[40px] font-black leading-[36px] tracking-[0.36px] text-[#3e4140]">10,000,000</p>
                  </div>
                  <button
                    type="button"
                    onMouseEnter={topUpArrow.pulse}
                    className="flex items-center gap-[20px] overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#23f3d5] px-[20px] py-[10px]"
                  >
                    <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">儲值</span>
                    <AnimatedArrowSpecial hovered={topUpArrow.hovered} size={25} color="#3e4140" />
                  </button>
                </div>
              </div>

              <div className="flex w-full items-start gap-[20px]">
                <StatCard icon="/assets/wallet/icon-income.svg" label="今日收入" value="+8,200" />
                <StatCard icon="/assets/wallet/icon-expense.svg" label="今日支出" value="-1,500" valueColor="#f02692" />
                <StatCard icon="/assets/wallet/icon-topup.svg" label="本月儲值" value="120,000" />
                <StatCard icon="/assets/wallet/icon-rebate.svg" label="累計返水" value="3,480,000" />
              </div>

              <div className="flex w-full items-center gap-[36px] border-b border-[#f4f4f4]">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="flex flex-col items-center gap-[12px] pb-[12px]"
                  >
                    <span className={`whitespace-nowrap text-[14px] tracking-[0.15px] ${activeTab === tab ? "font-bold text-[#3e4140]" : "text-[#a2a2a2]"}`}>
                      {tab}
                    </span>
                    <div className={`h-[3px] w-[64px] rounded-[2px] ${activeTab === tab ? "bg-[#23f3d5]" : "bg-transparent"}`} />
                  </button>
                ))}
              </div>

              <div className="flex w-full items-start gap-[20px]">
                <FilterPill label="日期" />
                <FilterPill label="類型" />
                <div className="flex h-[45px] w-[256px] items-center gap-[10px] rounded-[50px] border-2 border-[#3e4140] bg-white/50 px-[13px] backdrop-blur-[10px]">
                  <img alt="" src={withBasePath("/assets/wallet/icon-search.svg")} className="size-[25px]" />
                  <p className="whitespace-nowrap text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">搜尋</p>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-[10px] rounded-bl-[50px] rounded-tr-[50px] border border-[#f4f4f4] bg-white/80 p-[20px] backdrop-blur-[10px]">
                {activeTab === "交易明細" ? (
                  TRANSACTIONS.map((t, i) => <TransactionRow key={i} {...t} />)
                ) : (
                  <p className="w-full py-[40px] text-center text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">沒有任何資料</p>
                )}
              </div>

              <Footer />
            </div>

            <div className="sticky top-[58px] z-10 ml-[20px] self-start">
              <TalkingBar messages={talkingBarMessages} friends={talkingBarFriends} />
            </div>
          </MinPanelHeight>
        </div>
      </ScaleToFit>
    </div>
  );
}
