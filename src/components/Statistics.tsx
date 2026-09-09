"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial, { useArrowPulse } from "./AnimatedArrowSpecial";

// A plain numeric string ("10,000", "100,000%", "6") counts up from 0;
// anything else (guest's "---" placeholder) just renders as-is, no
// animation. `format` re-applies the original's own comma grouping and
// suffix (currently only ever "%" here, but written generically rather
// than hardcoding that one character) at each intermediate frame, not
// just the final value.
function parseCountable(value: string): { target: number; format: (n: number) => string } | null {
  const match = value.match(/^(\d[\d,]*)(\D*)$/);
  if (!match) return null;
  const target = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;
  const suffix = match[2];
  return { target, format: (n) => `${Math.round(n).toLocaleString()}${suffix}` };
}

// Ease-out cubic: the rate of change starts fast and tapers off toward
// the end, i.e. "從快到慢" -- a linear ramp would read as a constant
// speed the whole way, not a decelerating one.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const COUNT_UP_MS = 1200;

// Runs the "跳表" (odometer count-up) once per mount -- every visit to
// this page re-triggers it, not just the first ever load, since there's
// no persisted "already played" flag. Starts the displayed text at "0"
// (formatted the same way the real value will be, so the swap from 0 to
// counting-up to final doesn't jump in digit grouping/suffix) on BOTH
// server and client renders -- deterministic from `value` alone, no
// Date.now()/Math.random() in the initializer -- so there's no
// hydration-mismatch risk; the actual counting only starts once the
// effect runs post-hydration, client-side.
function useCountUpText(value: string) {
  const [display, setDisplay] = useState(() => {
    const parsed = parseCountable(value);
    return parsed ? parsed.format(0) : value;
  });

  useEffect(() => {
    const parsed = parseCountable(value);
    if (!parsed) {
      // Only reachable if `value` itself changes after mount (e.g. a
      // logged-in/guest toggle swapping a real number for "---") -- the
      // lazy initializer above already covers the first-render case, so
      // this is syncing from a genuinely new prop value, not mirroring
      // state that was already correct.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }

    let frame: number;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / COUNT_UP_MS);
      setDisplay(parsed!.format(parsed!.target * easeOutCubic(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return display;
}

export type StatisticEntry = {
  icon: string;
  value: string;
  label: string;
};

export type StatisticsProps = {
  stats: [StatisticEntry, StatisticEntry, StatisticEntry, StatisticEntry];
  // The balance readout + 儲值 button in the title row -- shown for both
  // guest and logged-in now (guest passes the literal "---" placeholder
  // rather than omitting the row; see `guest` below).
  balance: string;
  // Guest/not-logged-in (05_WU88-H-PC-Profile-Page node 455:23317, its own
  // Statistics instance 619:17383) used to drop the trend-graph glyph and
  // the balance/儲值 row entirely -- Figma's since redesigned it to show
  // both anyway, just in a "no data yet" placeholder look: every value
  // (including balance) in placeholder gray (#a2a2a2) instead of the real
  // dark gray (#3e4140), and the trend glyph swapped from the real teal
  // trending-checkmark (icon-graph.svg) to a flat gray dash
  // (icon-graph-empty.svg) rather than hidden. Defaults to false (the
  // logged-in look), matching every existing caller before this.
  guest?: boolean;
};

// Figma "Statistics" (05_WU88-H-PC-Profile-Page node 459:85358 logged-in /
// 619:17383 guest, seen live on the page at 428:17332 / 455:23317): a
// title bar ("投注紀錄") over 4 equal-width stat cards (總投注/總獲利/排名/
// 平均勝率), each holding its own icon + value pair top-left and a
// trend-graph glyph top-right. `flex-1` cards in a `gap-[20px]` row, not 4
// fixed-287px boxes, matching this project's own convention of flexible
// rather than pixel-pinned row layouts (SportsMachAnalysis's two columns,
// GeneralGames'/Promotions' cards).
//
// `balance`'s own row shares the title row rather than stacking below it
// (Figma has both anchored to the same y=0/20 pair, title left-aligned,
// balance right-aligned) -- its 40px number is taller than the plain
// title text, so the row grows and pushes the stat cards down with it for
// free, matching the ~16px gap Figma's logged-in version has over the
// guest one without needing to hardcode that difference anywhere.
export default function Statistics({ stats, balance, guest = false }: StatisticsProps) {
  const topUpArrow = useArrowPulse();
  const valueColor = guest ? "text-[#a2a2a2]" : "text-[#3e4140]";

  const animatedBalance = useCountUpText(balance);
  // `stats` is a fixed 4-tuple (see the type above), so calling the hook
  // once per literal index -- not inside the `.map()` below -- stays
  // rules-of-hooks safe: this always runs exactly 4 times, never a
  // variable number.
  const animatedValues: [string, string, string, string] = [
    useCountUpText(stats[0].value),
    useCountUpText(stats[1].value),
    useCountUpText(stats[2].value),
    useCountUpText(stats[3].value),
  ];

  return (
    <div className="flex w-full flex-col items-start gap-[20px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <img alt="" src={withBasePath("/assets/statistics/icon-title.svg")} className="size-[25px]" />
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">投注紀錄</p>
        </div>

        <div className="flex items-center gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <img alt="" src={withBasePath("/assets/statistics/icon-balance.svg")} className="size-[25px]" />
            <div className="h-[20px] w-px bg-[#f4f4f4]" />
            <p className={`whitespace-nowrap text-[40px] font-black leading-[36px] tracking-[0.36px] ${valueColor}`}>{animatedBalance}</p>
          </div>
          <button
            type="button"
            onMouseEnter={topUpArrow.pulse}
            className="flex w-[100px] items-center justify-between overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#23f3d5] px-[15px] py-[10px]"
          >
            <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">儲值</span>
            <AnimatedArrowSpecial hovered={topUpArrow.hovered} size={25} color="#3e4140" />
          </button>
        </div>
      </div>

      <div className="flex w-full items-center gap-[20px]">
        {stats.map((stat, i) => (
          <div key={i} className="flex h-[118px] flex-1 flex-col justify-between rounded-[25px] bg-[#f4f4f4] p-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[20px]">
                <img alt="" src={withBasePath(stat.icon)} className="size-[25px]" />
                <p className={`whitespace-nowrap text-[20px] font-bold leading-[32px] tracking-[0.35px] ${valueColor}`}>{animatedValues[i]}</p>
              </div>
              <img
                alt=""
                src={withBasePath(guest ? "/assets/statistics/icon-graph-empty.svg" : "/assets/statistics/icon-graph.svg")}
                className="size-[25px]"
              />
            </div>
            <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
