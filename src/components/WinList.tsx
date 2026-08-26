"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "../lib/asset";
import RankSection, { type RankSectionProps } from "./RankSection";
import Tag from "./Tag";

const PANEL_CLIP_PATH =
  'path("M308.164 1H1248V373C1248 400.062 1226.06 422 1199 422H50.1201C22.9895 422 1 400.06 1 373V113C1 85.9381 22.9381 64 50 64H245.164C263.113 64 277.664 49.4493 277.664 31.5C277.664 14.6555 291.32 1.00025 308.164 1Z")';

function ColumnHeader({ label, left, right }: { label: string; left?: number; right?: number }) {
  const alignEnd = right !== undefined;
  return (
    <div
      className={`absolute top-[20px] flex flex-col gap-[19px] ${alignEnd ? "items-end" : "items-start"}`}
      style={alignEnd ? { right } : { left }}
    >
      <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#a2a2a2]">{label}</p>
      <img alt="" src={withBasePath("/assets/win-list/header-tick.svg")} className="h-[11px] w-[21px]" />
    </div>
  );
}

// Header aligns to the LEFT edge of the value text below it (not the
// icon) for every column except the last, "遊戲", which aligns to the
// RIGHT edge of the thumbnail instead. Bet/win text starts after the
// icon (25px) plus its gap (10px); odds has no icon so its text already
// starts at its own row-relative position.
const ROW_OFFSET = 20;
const ICON_TO_TEXT = 25 + 10;
const COLUMN_LEFTS = {
  bet: ROW_OFFSET + 264 + ICON_TO_TEXT,
  win: ROW_OFFSET + 557 + ICON_TO_TEXT,
  odds: ROW_OFFSET + 887,
};
// Thumbnail sits flush at the row's own right edge (row itself starts at
// ROW_OFFSET and is 1206 wide), so its distance from the PANEL's right
// edge is simply the panel width minus that right edge.
const PANEL_WIDTH = 1249;
const COLUMN_RIGHT_GAME = PANEL_WIDTH - (ROW_OFFSET + 1206);

export type WinListProps = {
  rows: RankSectionProps[];
};

const TRACK_HEIGHT = 252;
const FADE = 40;

function buildFadeMask(canScrollUp: boolean, canScrollDown: boolean) {
  const topColor = canScrollUp ? "transparent" : "black";
  const bottomColor = canScrollDown ? "transparent" : "black";
  return `linear-gradient(to bottom, ${topColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${bottomColor} 100%)`;
}

// "+ 10,000,000" -> 10000000, so 富豪榜 can rank by actual win amount.
function parseWinAmount(win: string) {
  return Number(win.replace(/[^0-9.-]/g, "")) || 0;
}

// Figma "Win List" component (Components Library node 672:17146). Title +
// a notched panel (white fill via clip-path, Figma's own outline SVG drawn
// on top for the border) holding two filter Tags, four column headers, and
// a fading stack of RankSection rows -- both reused as-is from their own
// standalone components rather than rebuilt inline.
//
// The teal "divider line" on the right isn't decoration -- it's a scroll
// thumb for the row list. The row list keeps the fade mask (so overflowing
// rows still soften at the edges) but is now actually scrollable, with the
// thumb's height/position tracking real scroll metrics instead of a fixed
// static bar.
export default function WinList({ rows }: WinListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ height: TRACK_HEIGHT, top: 0 });
  const [fade, setFade] = useState({ up: false, down: false });
  const [tab, setTab] = useState<"recent" | "rich">("recent");

  const displayRows = tab === "rich" ? [...rows].sort((a, b) => parseWinAmount(b.win) - parseWinAmount(a.win)) : rows;

  function selectTab(next: "recent" | "rich") {
    setTab(next);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const canScrollUp = scrollTop > 0;
      const canScrollDown = scrollTop < scrollHeight - clientHeight - 1;
      setFade({ up: canScrollUp, down: canScrollDown });

      if (scrollHeight <= clientHeight) {
        setThumb({ height: TRACK_HEIGHT, top: 0 });
        return;
      }
      const height = Math.max(24, (clientHeight / scrollHeight) * TRACK_HEIGHT);
      const maxTop = TRACK_HEIGHT - height;
      const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;
      setThumb({ height, top });
    }

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [rows, tab]);

  return (
    <div className="flex w-[1249px] flex-col items-start gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={withBasePath("/assets/win-list/title-icon.svg")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">玩家排名</p>
      </div>

      <div className="relative h-[423px] w-full shrink-0 overflow-hidden rounded-br-[50px]">
        <div className="absolute inset-0 bg-white" style={{ clipPath: PANEL_CLIP_PATH }} />
        <img alt="" src={withBasePath("/assets/win-list/panel-bg.svg")} className="pointer-events-none absolute inset-0 size-full" />

        <img
          alt=""
          src={withBasePath("/assets/win-list/digital-dots-bg.svg")}
          className="pointer-events-none absolute right-[140.46px] top-[311px] h-[361px] w-[378.536px]"
        />

        <div className="absolute left-0 top-0 flex items-center gap-[20px]">
          <Tag label="最近贏家" active={tab === "recent"} width={124} onClick={() => selectTab("recent")} />
          <Tag label="富豪榜" active={tab === "rich"} width={112} onClick={() => selectTab("rich")} />
        </div>

        <ColumnHeader label="投注" left={COLUMN_LEFTS.bet} />
        <ColumnHeader label="盈利" left={COLUMN_LEFTS.win} />
        <ColumnHeader label="賠率" left={COLUMN_LEFTS.odds} />
        <ColumnHeader label="遊戲" right={COLUMN_RIGHT_GAME} />

        <div
          className="pointer-events-none absolute right-0 w-[2px] rounded-full bg-[#23f3d5]"
          style={{ top: 86 + thumb.top, height: thumb.height }}
        />

        <div
          ref={scrollRef}
          className="no-scrollbar absolute left-[20px] top-[88px] flex h-[335px] w-[1206px] flex-col items-start gap-[20px] overflow-y-auto"
          style={{
            paddingBottom: FADE,
            maskImage: `url("${withBasePath("/assets/win-list/list-shape-mask.svg")}"), ${buildFadeMask(fade.up, fade.down)}`,
            maskSize: "1249px 423px, 100% 100%",
            maskPosition: "-20px -88px, 0 0",
            maskRepeat: "no-repeat, no-repeat",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in, source-in",
          }}
        >
          {displayRows.map((row) => (
            <RankSection key={`${row.name}-${row.bet}`} {...row} />
          ))}
        </div>
      </div>
    </div>
  );
}
