"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedArrowSpecial, { useArrowPulse } from "./AnimatedArrowSpecial";
import { useAuth } from "./AuthProvider";
import Footer from "./Footer";
import Language from "./Language";
import MinPanelHeight from "./MinPanelHeight";
import RechargeModal from "./RechargeModal";
import ProfileSidebar from "./ProfileSidebar";
import ScaleToFit from "./ScaleToFit";
import Search from "./Search";
import StickyUtilityBar from "./StickyUtilityBar";
import TalkingBar from "./TalkingBar";
import { talkingBarFriends } from "../lib/chatMockData";
import type { TalkSectionProps } from "./TalkSection";
import TopBar from "./TopBar";
import TopUp from "./TopUp";
import { withBasePath } from "../lib/asset";
import { MEMBER_BEST_WIN, MEMBER_BALANCE_TEXT, MEMBER_TODAY_EXPENSE, MEMBER_TODAY_INCOME, MEMBER_TOTAL_REBATE, formatMoney } from "../lib/member";

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


type Transaction = { name: string; date: string; amount: string; color: string; year: number; month: number; day: number };

// Every row shares this one calendar date (matches the "06/12 13:30" display
// string) -- spread onto each row below so the new 日期 filter (node
// 37:29157/51:23614/51:25200/51:26000) has a real year/month/day to match
// against instead of just parsing the display string at filter time.
const TX_DATE = { year: 2026, month: 6, day: 12 };

// Figma "Wallet"'s own 13 rows (05_WU88-H-PC-Profile-Page node 610:45399,
// seen live at node 547:15722's own 帳戶明細 page): 信用卡充值/返水 in teal
// (#38ddcd, a deposit/credit), 託售 in pink (#ff76aa, a debit) -- reused
// verbatim rather than inventing new figures, including the repeated rows
// (Figma's own export repeats "信用卡充值" $10,000 six times).
const TRANSACTIONS: Transaction[] = [
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "託售", date: "06/12 13:30", amount: "-$100,000", color: "#ff76aa", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "返水", date: "06/12 13:30", amount: "$1,000,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
  { name: "信用卡充值", date: "06/12 13:30", amount: "$10,000", color: "#38ddcd", ...TX_DATE },
];

// Each row's own plausible-but-fabricated settlement detail, shown when its
// row expands (Figma node 37:32188's "Payment informations expanded" only
// ever designed ONE example row -- Visa/4242/PAY-240612-1330/已完成 -- so the
// other 12 rows vary the card/txn-id deterministically by index rather than
// all repeating that exact same mock, per request).
const PAYMENT_METHODS = ["Visa 信用卡", "Apple Pay"] as const;
function buildTransactionDetail(t: Transaction, index: number) {
  const method = PAYMENT_METHODS[index % PAYMENT_METHODS.length];
  const last4 = String(1000 + ((index * 137 + 42) % 9000)).padStart(4, "0");
  const typeCode = t.name === "信用卡充值" ? "PAY" : t.name === "託售" ? "SEL" : "RBT";
  const txnId = `${typeCode}-240612-${String(1300 + index * 7).padStart(4, "0")}`;
  return {
    method,
    cardLabel: method === "Apple Pay" ? "已綁定裝置" : `•••• ${last4}`,
    txnId,
    status: "已完成",
  };
}

type DateValue = { year: number; month: number; day: number };

const WEEKDAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"];
// Figma's own list only ever shows 2022-2026, but its Rectangle scrollbar
// (55:23469/55:23470) implies more years sit above the fold -- scrollable
// back to 2012 rather than a hard-capped 5-year list, per request.
const CALENDAR_LATEST_YEAR = 2026;
const CALENDAR_YEARS = Array.from({ length: 15 }, (_, i) => CALENDAR_LATEST_YEAR - 14 + i);
const TYPE_OPTIONS = ["信用卡充值", "託售", "返水"] as const;

// Real Monday-first month grid (Figma's own June-2026 example -- node
// 44:22025 -- happens to start on a Monday and fits exactly 5 rows/35 cells,
// not a fixed 6/42, so the row count here is however many weeks that
// month/weekday combination actually needs).
function getMonthGrid(year: number, month: number) {
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const cells: { year: number; month: number; day: number; current: boolean }[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayIndex = i - firstWeekday + 1;
    if (dayIndex < 1) {
      const [y, m] = month === 1 ? [year - 1, 12] : [year, month - 1];
      cells.push({ year: y, month: m, day: prevMonthDays + dayIndex, current: false });
    } else if (dayIndex > daysInMonth) {
      const [y, m] = month === 12 ? [year + 1, 1] : [year, month + 1];
      cells.push({ year: y, month: m, day: dayIndex - daysInMonth, current: false });
    } else {
      cells.push({ year, month, day: dayIndex, current: true });
    }
  }
  return cells;
}

// 本月儲值 is what the list above actually shows being deposited, not a separate
// number. The 返水 / 託售 rows sit inside the member's lifetime totals
// (lib/member.ts), which is what 累計返水 reports.
const MONTH_DEPOSIT = TRANSACTIONS.filter((t) => t.name === "信用卡充值").reduce((sum, t) => sum + Number(t.amount.replace(/\D/g, "")), 0);

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

// Chevron flips to point up (icon-chevron-up.svg) while its own dropdown is
// open (Figma nodes 37:29157/37:29859 both show this on the active pill) --
// both arrows are already teal in Figma (#23f3d5), so this is a straight
// asset swap, not a color change.
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 items-center gap-[50px] rounded-[50px] bg-[#3e4140] px-[20px] py-[10px]">
      <span className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-white">{label}</span>
      <img alt="" src={withBasePath(active ? "/assets/wallet/icon-chevron-up.svg" : "/assets/wallet/icon-chevron-down.svg")} className="size-[25px]" />
    </button>
  );
}

// Figma "Calendar Menu" (node 44:22025, seen open in 37:29157) plus its own
// nested "Year Dropdown" (node 55:23458, seen in 51:23614/51:25200/51:26000 --
// those three only differ in how they colored the "2026" row, which per
// request maps to: default #3e4140 medium untouched, teal on hover, bold on
// the currently-picked year). Owns its own draft state -- 確定/取消 only
// push a value up via onConfirm/onCancel, so re-opening after 取消 or
// re-opening on a previously-confirmed month/year always starts from
// `initialValue` again (the component remounts each time its parent renders
// it conditionally).
function CalendarDropdown({
  initialValue,
  onConfirm,
  onCancel,
}: {
  initialValue: DateValue | null;
  onConfirm: (value: DateValue | null) => void;
  onCancel: () => void;
}) {
  const [viewYear, setViewYear] = useState(initialValue?.year ?? CALENDAR_YEARS[CALENDAR_YEARS.length - 1]);
  const [viewMonth, setViewMonth] = useState(initialValue?.month ?? 6);
  const [selected, setSelected] = useState<DateValue | null>(initialValue);
  const [showYears, setShowYears] = useState(false);
  const selectedYearRef = useRef<HTMLButtonElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);
  // Figma's own Year Dropdown (node 55:23458) draws its scrollbar as two
  // plain rounded rectangles (a translucent track + a teal thumb) rather
  // than relying on the browser's native one -- this tracks the list's
  // real scroll position/size into that same track+thumb shape instead of
  // just hiding the (visually mismatched) native scrollbar.
  const [thumb, setThumb] = useState({ top: 0, height: 0, track: 0, visible: false });

  function updateThumb() {
    const el = yearListRef.current;
    if (!el) return;
    const track = el.clientHeight;
    if (el.scrollHeight <= track) {
      setThumb({ top: 0, height: track, track, visible: false });
      return;
    }
    const height = Math.max(24, (track / el.scrollHeight) * track);
    const maxTop = track - height;
    const top = (el.scrollTop / (el.scrollHeight - track)) * maxTop;
    setThumb({ top, height, track, visible: true });
  }

  // The list scrolls back to 2012, so jump straight to the current year
  // (rather than opening on the oldest, scrolled-to-top entry) whenever it opens.
  useEffect(() => {
    if (!showYears) return;
    selectedYearRef.current?.scrollIntoView({ block: "center" });
    updateThumb();
  }, [showYears]);

  const cells = getMonthGrid(viewYear, viewMonth);
  const rows: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  function goToMonth(delta: number) {
    setShowYears(false);
    let month = viewMonth + delta;
    let year = viewYear;
    if (month < 1) { month = 12; year -= 1; }
    if (month > 12) { month = 1; year += 1; }
    setViewMonth(month);
    setViewYear(year);
  }

  function pickDay(cell: { year: number; month: number; day: number; current: boolean }) {
    if (!cell.current) return;
    setShowYears(false);
    const isSame = selected?.year === cell.year && selected?.month === cell.month && selected?.day === cell.day;
    setSelected(isSame ? null : { year: cell.year, month: cell.month, day: cell.day });
  }

  return (
    <div className="absolute left-0 top-[calc(100%+10px)] z-40 flex w-[341px] flex-col items-start gap-[18px] rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] border-2 border-[#f4f4f4] bg-white/80 p-[20px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowYears((v) => !v)}
              className={`flex items-center gap-[6px] rounded-[999px] border-2 bg-white py-[2px] pl-[14px] pr-[12px] ${showYears ? "border-[#23f3d5]" : "border-[#f4f4f4]"}`}
            >
              <span className="whitespace-nowrap text-[16px] font-bold leading-[32px] tracking-[0.35px] text-[#3e4140]">{viewYear}</span>
              <img alt="" src={withBasePath(showYears ? "/assets/wallet/icon-calendar-chevron-up.svg" : "/assets/wallet/icon-calendar-chevron.svg")} className="size-[18px]" />
            </button>
            {showYears && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[154px] overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] border-2 border-[#f4f4f4] bg-white/80 backdrop-blur-[10px]">
                <div
                  ref={yearListRef}
                  onScroll={updateThumb}
                  className="no-scrollbar flex max-h-[212px] flex-col items-start gap-[4px] overflow-y-auto p-[8px]"
                >
                  {CALENDAR_YEARS.map((y) => (
                    <button
                      key={y}
                      ref={y === viewYear ? selectedYearRef : undefined}
                      type="button"
                      onClick={() => { setViewYear(y); setShowYears(false); }}
                      className={`flex h-[36px] w-full shrink-0 items-center justify-center rounded-[14px] text-[14px] tracking-[0.15px] text-[#3e4140] hover:text-[#23f3d5] ${y === viewYear ? "font-bold" : "font-medium"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                {thumb.visible && (
                  <>
                    <div className="pointer-events-none absolute right-[4px] top-[8px] w-[4px] rounded-[999px] bg-white/50" style={{ height: thumb.track }} />
                    <div className="pointer-events-none absolute right-[3px] w-[2px] rounded-[999px] bg-[#23f3d5]" style={{ top: 8 + thumb.top, height: thumb.height }} />
                  </>
                )}
              </div>
            )}
          </div>
          <span className="whitespace-nowrap text-[16px] font-bold leading-[32px] tracking-[0.35px] text-[#3e4140]">{viewMonth} 月</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <button type="button" onClick={() => goToMonth(-1)} aria-label="上個月" className="flex size-[32px] items-center justify-center rounded-[16px] bg-[#3e4140]">
            <img alt="" src={withBasePath("/assets/wallet/icon-calendar-prev.svg")} className="size-[18px]" />
          </button>
          <button type="button" onClick={() => goToMonth(1)} aria-label="下個月" className="flex size-[32px] items-center justify-center rounded-[16px] bg-[#3e4140]">
            <img alt="" src={withBasePath("/assets/wallet/icon-calendar-next.svg")} className="size-[18px]" />
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-[8px]">
        <div className="flex w-full items-start gap-[7px]">
          {WEEKDAY_LABELS.map((w) => (
            <div key={w} className="flex h-[18px] w-[37px] shrink-0 flex-col items-center justify-center">
              <span className="whitespace-nowrap text-[10px] tracking-[0.15px] text-[#a2a2a2]">{w}</span>
            </div>
          ))}
        </div>
        {rows.map((row, i) => (
          <div key={i} className="flex w-full items-start gap-[7px]">
            {row.map((cell, j) => {
              const isSelected = cell.current && selected?.year === cell.year && selected?.month === cell.month && selected?.day === cell.day;
              return (
                <button
                  key={j}
                  type="button"
                  disabled={!cell.current}
                  onClick={() => pickDay(cell)}
                  className={`flex h-[32px] w-[37px] shrink-0 flex-col items-center justify-center rounded-[16px] text-[12px] tracking-[0.15px] ${
                    isSelected ? "bg-[#23f3d5] text-[#3e4140]" : cell.current ? "text-[#3e4140] hover:bg-[#f4f4f4]" : "cursor-default text-[#a2a2a2]"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex w-full items-start gap-[10px]">
        <button type="button" onClick={onCancel} className="flex h-[40px] flex-1 items-center justify-center rounded-[15px] bg-[#f4f4f4] text-[14px] font-medium tracking-[0.15px] text-[#3e4140]">
          取消
        </button>
        <button type="button" onClick={() => onConfirm(selected)} className="flex h-[40px] flex-1 items-center justify-center rounded-[15px] bg-[#23f3d5] text-[14px] font-bold tracking-[0.15px] text-[#3e4140]">
          確定
        </button>
      </div>
    </div>
  );
}

// Figma "Type Menu" (node 47:22620, seen open in 37:29859). Same draft-state
// shape as CalendarDropdown: clicking a row toggles it (so picking the same
// type twice clears the filter), 確定 pushes the pick up, 取消 discards it.
function TypeDropdown({
  initialValue,
  onConfirm,
  onCancel,
}: {
  initialValue: string | null;
  onConfirm: (value: string | null) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(initialValue);

  return (
    <div className="absolute left-0 top-[calc(100%+10px)] z-40 flex w-[341px] flex-col items-start gap-[18px] rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] border-2 border-[#f4f4f4] bg-white/80 p-[20px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
      <p className="whitespace-nowrap text-[16px] font-bold leading-[32px] tracking-[0.35px] text-[#3e4140]">類型</p>
      <div className="flex w-full flex-col items-start gap-[10px]">
        {TYPE_OPTIONS.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelected((cur) => (cur === type ? null : type))}
            className={`flex h-[40px] w-full items-center justify-center rounded-[15px] text-[14px] tracking-[0.15px] text-[#3e4140] hover:text-[#23f3d5] ${
              selected === type ? "font-bold" : "font-medium"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex w-full items-start gap-[10px]">
        <button type="button" onClick={onCancel} className="flex h-[40px] flex-1 items-center justify-center rounded-[15px] bg-[#f4f4f4] text-[14px] font-medium tracking-[0.15px] text-[#3e4140]">
          取消
        </button>
        <button type="button" onClick={() => onConfirm(selected)} className="flex h-[40px] flex-1 items-center justify-center rounded-[15px] bg-[#23f3d5] text-[14px] font-bold tracking-[0.15px] text-[#3e4140]">
          確定
        </button>
      </div>
    </div>
  );
}

function DetailCard({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex min-w-px flex-1 flex-col items-start gap-[6px] rounded-[18px] bg-[#f4f4f4] p-[16px]">
      <p className="whitespace-nowrap text-[12px] leading-[18px] text-[#a2a2a2]">{label}</p>
      <p className="w-full truncate text-[16px] font-bold leading-[24px] text-[#3e4140]" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </p>
    </div>
  );
}

// Collapsed state matches the original row exactly; expanded state matches
// Figma node 37:32188's "Payment informations expanded" -- same row grows in
// place rather than pushing a separate panel below it. icon-expand.svg
// (purple, pointing down) flips to icon-expand-active.svg (dark, pointing
// up) on expand, per Figma's own two chevron assets for this state.
function TransactionRow({ t, index, expanded, onToggle }: { t: Transaction; index: number; expanded: boolean; onToggle: () => void }) {
  const { name, date, amount, color } = t;

  if (!expanded) {
    return (
      <div className="flex w-full items-center justify-between rounded-[25px] bg-[#fafafa] px-[20px] py-[10px]">
        <div className="flex w-[80px] shrink-0 flex-col items-start gap-[5px]">
          <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">{name}</p>
          <p className="whitespace-nowrap text-[12px] leading-[18px] text-[#a2a2a2]">{date}</p>
        </div>
        <button type="button" onClick={onToggle} className="flex items-center gap-[40px]">
          <span className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px]" style={{ color }}>
            {amount}
          </span>
          <img alt="" src={withBasePath("/assets/wallet/icon-expand.svg")} className="size-[16px]" />
        </button>
      </div>
    );
  }

  const detail = buildTransactionDetail(t, index);
  return (
    <div className="flex w-full flex-col items-start gap-[16px] rounded-[25px] border border-[#f4f4f4] bg-[#fafafa] px-[24px] pb-[24px] pt-[20px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-start gap-[4px]">
          <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">{name}</p>
          <p className="whitespace-nowrap text-[12px] leading-[18px] text-[#a2a2a2]">{date}</p>
        </div>
        <button type="button" onClick={onToggle} className="flex items-center gap-[16px]">
          <span className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px]" style={{ color }}>
            {amount}
          </span>
          <img alt="" src={withBasePath("/assets/wallet/icon-expand-active.svg")} className="size-[16px]" />
        </button>
      </div>
      <div className="h-px w-full bg-[#f4f4f4]" />
      <div className="flex w-full items-start gap-[16px]">
        <DetailCard label="付款方式" value={detail.method} />
        <DetailCard label="卡號" value={detail.cardLabel} />
        <DetailCard label="交易單號" value={detail.txnId} />
        <DetailCard label="狀態" value={detail.status} valueColor="#23f3d5" />
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
//
// There's no real wallet to show before you have an account -- guests
// see the same "---" placeholder treatment Statistics/DayRewards already
// use elsewhere on /profile, and the transaction list stays empty
// regardless of which tab is picked (not just 交易明細), since none of
// this data is real for a guest either.
export default function AccountWallet() {
  const { loggedIn } = useAuth();
  const isGuest = !loggedIn;
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("交易明細");
  const topUpArrow = useArrowPulse();
  const sellArrow = useArrowPulse();
  const [showRecharge, setShowRecharge] = useState(false);

  // 日期/類型 pills (Figma nodes 37:29157/37:29859): only one dropdown open
  // at a time, closed by an outside click or Escape -- same convention as
  // RechargeModal/LoginModal's own backdrop-click-to-close.
  const [openFilter, setOpenFilter] = useState<"date" | "type" | null>(null);
  const [dateFilter, setDateFilter] = useState<DateValue | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  // Accordion: expanding a row closes whichever one was already open, per request.
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const filterRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openFilter) return;
    function handlePointerDown(e: MouseEvent) {
      if (filterRowRef.current && !filterRowRef.current.contains(e.target as Node)) setOpenFilter(null);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenFilter(null);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openFilter]);

  function toggleRow(index: number) {
    setExpandedRow((prev) => (prev === index ? null : index));
  }

  const visibleTransactions = TRANSACTIONS.map((t, index) => ({ t, index })).filter(
    ({ t }) =>
      (!typeFilter || t.name === typeFilter) &&
      (!dateFilter || (t.year === dateFilter.year && t.month === dateFilter.month && t.day === dateFilter.day)),
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f4]">
      <ScaleToFit>
        <div className="sticky top-0 z-20">
          <TopBar
            onlineCount="900"
            totalReward="10,000,000"
            announcements={[
              { name: "Jessica", amount: `USDT${formatMoney(MEMBER_BEST_WIN)}` },
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
            {/* top-[58px], matching StickyUtilityBar/TalkingBar's own
                sticky offset -- see ProfileContent's own comment on this
                same fix. */}
            <div className="sticky top-[58px] z-10 self-start justify-self-start pl-[30px]">
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
                    <p className={`whitespace-nowrap text-[40px] font-black leading-[36px] tracking-[0.36px] ${isGuest ? "text-[#a2a2a2]" : "text-[#3e4140]"}`}>
                      {isGuest ? "---" : MEMBER_BALANCE_TEXT}
                    </p>
                  </div>
                  <div className="flex items-center gap-[20px]">
                    <button
                      type="button"
                      onClick={() => setShowRecharge(true)}
                      onMouseEnter={topUpArrow.pulse}
                      className="flex items-center gap-[20px] overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#23f3d5] px-[20px] py-[10px]"
                    >
                      <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">儲值</span>
                      <AnimatedArrowSpecial hovered={topUpArrow.hovered} size={25} color="#3e4140" />
                    </button>
                    {/* Figma's own second pill next to 儲值 (node 37:28548) --
                        no 託售 (consignment/resale) flow exists yet anywhere
                        in the app to link to, so this matches the visual
                        exactly (white pill, dark outline, same Arrow_Special
                        hover) without a fabricated destination. */}
                    <button
                      type="button"
                      onMouseEnter={sellArrow.pulse}
                      className="flex items-center gap-[20px] rounded-[20px] border border-[#3e4140] bg-white px-[20px] py-[10px]"
                    >
                      <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">託售</span>
                      <AnimatedArrowSpecial hovered={sellArrow.hovered} size={25} color="#3e4140" />
                    </button>
                  </div>
                  {showRecharge && <RechargeModal onClose={() => setShowRecharge(false)} />}
                </div>
              </div>

              <div className="flex w-full items-start gap-[20px]">
                <StatCard icon="/assets/wallet/icon-income.svg" label="今日收入" value={isGuest ? "---" : `+${formatMoney(MEMBER_TODAY_INCOME)}`} valueColor={isGuest ? "#a2a2a2" : undefined} />
                <StatCard icon="/assets/wallet/icon-expense.svg" label="今日支出" value={isGuest ? "---" : `-${formatMoney(MEMBER_TODAY_EXPENSE)}`} valueColor={isGuest ? "#a2a2a2" : "#f02692"} />
                <StatCard icon="/assets/wallet/icon-topup.svg" label="本月儲值" value={isGuest ? "---" : formatMoney(MONTH_DEPOSIT)} valueColor={isGuest ? "#a2a2a2" : undefined} />
                <StatCard icon="/assets/wallet/icon-rebate.svg" label="累計返水" value={isGuest ? "---" : formatMoney(MEMBER_TOTAL_REBATE)} valueColor={isGuest ? "#a2a2a2" : undefined} />
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

              <div ref={filterRowRef} className="flex w-full items-start gap-[20px]">
                <div className="relative">
                  <FilterPill label="日期" active={openFilter === "date"} onClick={() => setOpenFilter(openFilter === "date" ? null : "date")} />
                  {openFilter === "date" && (
                    <CalendarDropdown
                      initialValue={dateFilter}
                      onCancel={() => setOpenFilter(null)}
                      onConfirm={(value) => { setDateFilter(value); setOpenFilter(null); }}
                    />
                  )}
                </div>
                <div className="relative">
                  <FilterPill label="類型" active={openFilter === "type"} onClick={() => setOpenFilter(openFilter === "type" ? null : "type")} />
                  {openFilter === "type" && (
                    <TypeDropdown
                      initialValue={typeFilter}
                      onCancel={() => setOpenFilter(null)}
                      onConfirm={(value) => { setTypeFilter(value); setOpenFilter(null); }}
                    />
                  )}
                </div>
                <div className="flex h-[45px] w-[256px] items-center gap-[10px] rounded-[50px] border-2 border-[#3e4140] bg-white/50 px-[13px] backdrop-blur-[10px]">
                  <img alt="" src={withBasePath("/assets/wallet/icon-search.svg")} className="size-[25px]" />
                  <p className="whitespace-nowrap text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">搜尋</p>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-[10px] rounded-bl-[50px] rounded-tr-[50px] border border-[#f4f4f4] bg-white/80 p-[20px] backdrop-blur-[10px]">
                {!isGuest && activeTab === "交易明細" && visibleTransactions.length > 0 ? (
                  visibleTransactions.map(({ t, index }) => (
                    <TransactionRow key={index} t={t} index={index} expanded={expandedRow === index} onToggle={() => toggleRow(index)} />
                  ))
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
