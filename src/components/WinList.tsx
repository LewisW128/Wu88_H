"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "../lib/asset";
import RankSection, { type RankSectionProps } from "./RankSection";
import Tag from "./Tag";

// Both the white panel's fill (clip-path) and its border art (an inline
// SVG stroke here, was a static panel-bg.svg) trace the exact same
// outline -- Figma's own notch-plus-two-rounded-corners shape -- so one
// function builds the path for both. Only the RIGHT-side coordinates
// (the top-right corner and the bottom-right rounding) are a function of
// `panelWidth`; the notch and the bottom-left rounding are anchored to
// the left edge and don't move as the panel grows. `panelWidth - 1`
// mirrors the original hand-authored path, which draws 1px inset from
// the panel's true edges (a 1249-wide panel's rightmost coordinate is
// 1248, not 1249).
//
// The bottom-right corner's curve is NOT copied verbatim from Figma's
// own panel-bg.svg -- that asset's control points are
// `C1226.06 422 1199 422 1199 422` (the second control point and the
// endpoint collapsed onto the same point), which draws a visibly
// flattened/chamfered corner instead of a round one: its sagitta (how
// far the curve bulges from a straight chamfer) is 7.2px, about half of
// a true 49px-radius quarter-circle's 14.35px. The panel's OTHER
// corner (bottom-left, `C22.9895 422 1 400.06 1 373`) is a proper
// circle-approximating bezier and matches that 14.35px sagitta almost
// exactly, so this looks like a one-off authoring error in that
// specific asset rather than an intentional shape. Rebuilt here using
// the standard circle-bezier kappa constant (0.5523) against the same
// corner box (49x49, from (right,373) to (right-49,422)) instead of
// reproducing the flattened original.
function panelBorderPath(panelWidth: number) {
  const right = panelWidth - 1;
  return `M308.164 1H${right}V373C${right} 400.06 ${right - 21.94} 422 ${right - 49} 422H50.1201C22.9895 422 1 400.06 1 373V113C1 85.9381 22.9381 64 50 64H245.164C263.113 64 277.664 49.4493 277.664 31.5C277.664 14.6555 291.32 1.00025 308.164 1Z`;
}

// The row list's own shape mask (was a static list-shape-mask.svg),
// clipping scrolling rows to the same bottom-rounded silhouette as the
// panel so they fade into its corners instead of being cut off by a
// plain rectangle. Its top half (the notch region) sits above where the
// mask is actually positioned over the row (`maskPosition: "-20px
// -88px"` in the row's own style below) and is never visible, so it's
// kept exactly as authored -- only the bottom-right corner, which IS
// visible, needs to track `panelWidth`.
function rowMaskPath(panelWidth: number) {
  const right = panelWidth;
  return `M50.1204 423H${right - 50}C${right - 22.39} 423 ${right} 400.614 ${right} 373V0H308.165C290.768 0 276.665 14.103 276.665 31.5C276.665 48.897 262.561 63 245.164 63H50C22.3858 63 0 85.3858 0 113V373C0 400.614 22.4397 423 50.1204 423Z`;
}

function rowMaskDataUri(panelWidth: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${panelWidth}" height="423" viewBox="0 0 ${panelWidth} 423"><path d="${rowMaskPath(panelWidth)}" fill="white"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

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
// Design-space (1206px row) block-start offsets. As the row grows wider
// than this, the extra width is split into 4 equal shares and handed out
// cumulatively to bet/win/odds -- so every one of the 4 gaps between the
// 5 "columns" (name, bet, win, odds, thumbnail) grows by the same amount
// instead of just one gap absorbing all of it. The thumbnail needs no
// share of its own: it's already `right-0`-anchored in RankSection, so
// its column-start tracks the row's own width for free, and giving odds
// a 3/4 share (rather than a full share) is exactly what keeps the
// odds-to-thumbnail gap growing at the same 1/4 rate as the other three.
const DESIGN_ROW_WIDTH = 1206;
const BET_LEFT = 264;
const WIN_LEFT = 557;
const ODDS_LEFT = 887;
// Thumbnail sits flush at the row's own right edge (row itself starts at
// ROW_OFFSET and is 1206 wide, at design width), so its distance from
// the PANEL's right edge is simply the panel width minus that right
// edge -- fixed regardless of width, since the panel and the row's right
// edge grow together.
const PANEL_WIDTH = 1249;
const COLUMN_RIGHT_GAME = PANEL_WIDTH - (ROW_OFFSET + 1206);

export type WinListProps = {
  rows: RankSectionProps[];
};

const TRACK_HEIGHT = 252;
const ROW_HEIGHT = 335;
const FADE_TOP = 40;
// Copied straight from Figma's own row mask (node 672:16915's fill,
// "Frame 1274" / gradient paint0_linear_0_718: stops at 0%→0, 20%→opaque,
// 75%→opaque, 100%→0 down a 406px run, positioned -88px above the row).
// Converting those stops into row-local px: the plateau of full opacity
// ends at 216.5px and reaches fully transparent by 318px -- a much
// bigger, earlier-starting fade than a plain "N px from the edge"
// guess, which is why that guess still read as barely-there next to the
// real design: the actual fade starts well before the last visible row
// and finishes well past its top, not just nibbling its bottom edge.
const BOTTOM_FADE_START = 216.5;
const BOTTOM_FADE_END = 318;

function buildFadeMask(canScrollUp: boolean, canScrollDown: boolean) {
  const topColor = canScrollUp ? "transparent" : "black";
  const bottomColor = canScrollDown ? "transparent" : "black";
  return `linear-gradient(to bottom, ${topColor} 0px, black ${FADE_TOP}px, black ${BOTTOM_FADE_START}px, ${bottomColor} ${BOTTOM_FADE_END}px, ${bottomColor} 100%)`;
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
//
// The whole panel is fluid (`w-full`, not a fixed 1249px) so it grows on
// wide screens like every other row in this layout -- but unlike a plain
// card row, its rounded/notched shape and its 4 absolutely-positioned
// columns can't just stretch: the row's own real width is measured
// (`rowWidth`) and fed into `panelBorderPath`/`rowMaskDataUri` (so the
// notch and corners stay their original, undistorted size and only slide
// right) and into the bet/win/odds column-start math above (so their
// gaps grow evenly instead of everything bunching up at the fixed
// design-width positions while blank space opens up on the right).
export default function WinList({ rows }: WinListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ height: TRACK_HEIGHT, top: 0 });
  const [fade, setFade] = useState({ up: false, down: false });
  const [tab, setTab] = useState<"recent" | "rich">("recent");
  const [rowWidth, setRowWidth] = useState(DESIGN_ROW_WIDTH);

  const displayRows = tab === "rich" ? [...rows].sort((a, b) => parseWinAmount(b.win) - parseWinAmount(a.win)) : rows;

  function selectTab(next: "recent" | "rich") {
    setTab(next);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setRowWidth(entry.contentRect.width);
    });
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

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
  }, [rows, tab, rowWidth]);

  const panelWidth = rowWidth + PANEL_WIDTH - DESIGN_ROW_WIDTH;
  const extra = Math.max(0, rowWidth - DESIGN_ROW_WIDTH);
  const betLeft = BET_LEFT + extra * 0.25;
  const winLeft = WIN_LEFT + extra * 0.5;
  const oddsLeft = ODDS_LEFT + extra * 0.75;
  const borderPath = panelBorderPath(panelWidth);

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={withBasePath("/assets/win-list/title-icon.svg")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">玩家排名</p>
      </div>

      <div className="relative h-[423px] w-full shrink-0 overflow-hidden rounded-br-[50px]">
        <div className="absolute inset-0 bg-white" style={{ clipPath: `path("${borderPath}")` }} />
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          viewBox={`0 0 ${panelWidth} 423`}
          preserveAspectRatio="none"
          fill="none"
        >
          <path d={borderPath} stroke="#F4F4F4" strokeWidth={2} />
        </svg>

        <img
          alt=""
          src={withBasePath("/assets/win-list/digital-dots-bg.svg")}
          className="pointer-events-none absolute right-[140.46px] top-[311px] h-[361px] w-[378.536px]"
        />

        <div className="absolute left-0 top-0 flex items-center gap-[20px]">
          <Tag label="最近贏家" active={tab === "recent"} width={124} onClick={() => selectTab("recent")} />
          <Tag label="富豪榜" active={tab === "rich"} width={112} onClick={() => selectTab("rich")} />
        </div>

        <ColumnHeader label="投注" left={ROW_OFFSET + betLeft + ICON_TO_TEXT} />
        <ColumnHeader label="盈利" left={ROW_OFFSET + winLeft + ICON_TO_TEXT} />
        <ColumnHeader label="賠率" left={ROW_OFFSET + oddsLeft} />
        <ColumnHeader label="遊戲" right={COLUMN_RIGHT_GAME} />

        <div
          className="pointer-events-none absolute right-0 w-[2px] rounded-full bg-[#23f3d5]"
          style={{ top: 86 + thumb.top, height: thumb.height }}
        />

        <div
          ref={scrollRef}
          className="no-scrollbar absolute left-[20px] right-[23px] top-[88px] flex h-[335px] flex-col items-start gap-[20px] overflow-y-auto"
          style={{
            paddingBottom: ROW_HEIGHT - BOTTOM_FADE_START,
            maskImage: `${rowMaskDataUri(panelWidth)}, ${buildFadeMask(fade.up, fade.down)}`,
            maskSize: `${panelWidth}px 423px, 100% 100%`,
            maskPosition: "-20px -88px, 0 0",
            maskRepeat: "no-repeat, no-repeat",
            // `intersect` multiplies this layer's alpha with the fade
            // gradient's, so the fade actually dims the row wherever the
            // shape mask is opaque (nearly everywhere) instead of the two
            // masks fighting over the same pixels. The old paired
            // `-webkit-mask-composite: source-in, source-in` looked like
            // the vendor-prefixed equivalent but isn't -- `source-in` is a
            // legacy Safari-only keyword, not one of the standard
            // add/subtract/intersect/exclude values, and setting it
            // alongside the standard property let it silently win over
            // `intersect` in this browser, which is why the fade barely
            // showed and the corner clip looked wrong: the two masks were
            // effectively being unioned instead of multiplied.
            maskComposite: "intersect",
          }}
        >
          {displayRows.map((row) => (
            <RankSection key={`${row.name}-${row.bet}`} {...row} betLeft={betLeft} winLeft={winLeft} oddsLeft={oddsLeft} />
          ))}
        </div>
      </div>
    </div>
  );
}
