"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import GameSelections from "./GameSelections";
import MatchAnalysisCard, { type MatchAnalysisCardProps } from "./MatchAnalysisCard";

// Same filter row as Sports_News -- see its own comment for why these are
// the real source SVGs from Wu88_v02's actions icon library (全部 = the
// general "Overview" glyph), not Sports_game's icons or a screenshot crop.
const FILTERS = [
  { key: "all", label: "全部", icon: "/icon/action-overview.svg" },
  { key: "football", label: "足球", icon: "/icon/action-football.svg" },
  { key: "basketball", label: "籃球", icon: "/icon/action-basketball.svg" },
  { key: "baseball", label: "棒球", icon: "/icon/action-baseball.svg" },
];

export type SportsMachAnalysisProps = {
  // One real list per category, same classified-RSS pool Sports_News's own
  // `newsByCategory` reads from (see lib/sportsNews.ts's shared fetch) --
  // the user's own call for this section to follow the news content and
  // use the same 全部/足球/籃球/棒球 categorization instead of its previous
  // static 8-article mock. A thin category can turn up fewer than the
  // usual 8 articles -- MatchAnalysisColumn still clamps to the full
  // 4-per-column height regardless (the user's own call too), so
  // switching filters never changes this section's height and jumps
  // everything below it on the page.
  articlesByCategory: Record<string, MatchAnalysisCardProps[]>;
};

// Figma "Sports Mach analysis" (03_WU88-H-PC-Sport node 66:20574, seen
// live at 54:5338): title bar, the same 全部/足球/籃球/棒球 filter row as
// Sports_News (same GameSelections pills, same icons -- no need for a
// second copy), then a 2-column grid of Match analysis cards. Figma wraps
// this grid in a scroll mask, but at this page's originally-static 8-
// article mock, the grid's own height already fit the mask's visible area
// with no overflow -- now that a category can realistically turn up fewer
// real articles than that (see lib/sportsNews.ts's own note on how thin
// the 足球 RSS coverage can be on an ordinary day), each column's own
// clamp height is derived from its real card count rather than assuming a
// fixed 4-per-column layout -- see MatchAnalysisColumn's own comment.
//
// This is two independent flex columns, not a CSS `grid-cols-2` -- a
// real grid's rows are shared across both columns, so MatchAnalysisCard
// growing 69px taller on hover (see its own comment) would grow that
// *row's* height and drag the untouched sibling card down with it, and
// every row after it too. Splitting the articles left/right up front
// (even indices left, odd right, matching Figma's own per-row left-then-
// right source order) and stacking each side in its own `flex-col` means
// a hover only ever pushes the cards below it in the *same* column --
// exactly what should move -- while the other column holds still.
export default function SportsMachAnalysis({ articlesByCategory }: SportsMachAnalysisProps) {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
  const articles = articlesByCategory[activeFilter] ?? [];
  const leftColumn = articles.filter((_, i) => i % 2 === 0);
  const rightColumn = articles.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={withBasePath("/icon/sports-match-title-icon.png")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">賽事分析</p>
      </div>

      <div className="flex items-center gap-[20px]">
        {FILTERS.map((f) => (
          <GameSelections
            key={f.key}
            icon={f.icon}
            label={f.label}
            active={f.key === activeFilter}
            onClick={() => setActiveFilter(f.key)}
          />
        ))}
      </div>

      <div className="flex w-full items-start gap-x-[20px]">
        <MatchAnalysisColumn articles={leftColumn} />
        <MatchAnalysisColumn articles={rightColumn} />
      </div>
    </div>
  );
}

// Figma's own "Frame 1301" wrapping all 4 rows at 54:5338 is a fixed
// 630.808px (4 cards at rest's 146.452px + 3 gaps at 15px). Kept as that
// same fixed constant regardless of how many articles a category actually
// has -- a thin category (say 2 real cards after the RSS classify) still
// gets the full 4-card-tall clamp, leaving blank space at the bottom of
// its columns, rather than a shorter clamp sized to its own real count.
// The alternative (deriving the clamp from the real card count) was tried
// and reverted: it made switching filters change this section's own
// height, which reflows everything below it on the page -- the exact
// per-card version of the reflow problem MatchAnalysisCard's own hover
// growth had to solve, just triggered by the filter row instead of a
// mouse. `overflow-hidden` on this fixed height is what stops a hover
// from growing a column past its own designed footprint (the whole point
// of splitting into independent columns in the first place). A top-
// anchored column only ever overflows at the *bottom* though -- growth
// always pushes later cards down, never earlier ones up -- so hovering
// the bottom-half cards would just clip their own newly-revealed button
// row straight out of view, defeating the point of hovering them. Instead
// the inner content shifts up by GROWTH_PX when a bottom-half card is
// hovered (keeping that card's reveal inside the viewport by letting the
// *top* run off instead), so which edge is clipped tracks which half is
// hovered: top-half hover clips the bottom, bottom-half hover clips the
// top, hovering nothing leaves the column at its unshifted rest height
// with no overflow at all. A `maskImage` gradient softens whichever edge
// is currently clipped rather than a hard cut line -- same left/right-
// fade-on-scroll technique as SportsLive/SportsForm's own `buildFadeMask`,
// just vertical.
const COLUMN_REST_HEIGHT = 630.808; // 4 cards at 146.452px + 3 gaps at 15px
const COLUMN_FADE = 60;
const GROWTH_PX = 69; // MatchAnalysisCard's own hover delta: 215.45 - 146.452

function buildColumnMask(fadeTop: boolean, fadeBottom: boolean) {
  if (!fadeTop && !fadeBottom) return undefined;
  const topColor = fadeTop ? "transparent" : "black";
  const bottomColor = fadeBottom ? "transparent" : "black";
  return `linear-gradient(to bottom, ${topColor} 0px, black ${COLUMN_FADE}px, black calc(100% - ${COLUMN_FADE}px), ${bottomColor} 100%)`;
}

function MatchAnalysisColumn({ articles }: { articles: MatchAnalysisCardProps[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const fadeBottom = hoveredIndex !== null && hoveredIndex < articles.length / 2;
  const fadeTop = hoveredIndex !== null && hoveredIndex >= articles.length / 2;

  return (
    <div className="min-w-0 flex-1 overflow-hidden" style={{ height: `${COLUMN_REST_HEIGHT}px`, maskImage: buildColumnMask(fadeTop, fadeBottom) }}>
      <div
        className="flex flex-col gap-[15px] transition-transform duration-300"
        style={{ transform: fadeTop ? `translateY(-${GROWTH_PX}px)` : undefined }}
      >
        {articles.map((article, i) => (
          <MatchAnalysisCard
            key={i}
            {...article}
            onHoverChange={(isHovered) => setHoveredIndex((prev) => (isHovered ? i : prev === i ? null : prev))}
          />
        ))}
      </div>
    </div>
  );
}
