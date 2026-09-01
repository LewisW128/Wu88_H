"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import { useEdgeScroll } from "../lib/useEdgeScroll";
import LeftRight from "./LeftRight";
import SportGameBoard, { type SportGameBoardProps } from "./SportGameBoard";
import SportsFormFilter from "./SportsFormFilter";

const FADE = 120;
const SCROLL_STEP = 301; // one card (281px) + its gap (20px)

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

// Real source SVGs from the WU88 icon library (Wu88_v02/public/icons/
// actions/Sports_game) -- see SportsFormFilter's own comment for why a
// single icon per category is enough (active recolors via CSS filter
// instead of needing a separate white export).
const FILTERS = [
  { key: "all", icon: "/icon/sports-game-all.svg" },
  { key: "football", icon: "/icon/sports-game-football.svg" },
  { key: "basketball", icon: "/icon/sports-game-basketball.svg" },
  { key: "baseball", icon: "/icon/sports-game-baseball.svg" },
];

export type SportsLiveProps = {
  // One real list per category -- see sports/page.tsx's own game data for
  // where each comes from. Same `Record<string, T[]>` + `[key] ?? []`
  // shape as SportsNews's `newsByCategory`, for the same reason: the key
  // set here is exactly FILTERS' own keys, not a fixed tuple, so a
  // missing/renamed category degrades to an empty row instead of a type
  // error masking a real mismatch.
  gamesByCategory: Record<string, SportGameBoardProps[]>;
};

// Figma "Sports Live" (03_WU88-H-PC-Sport node 801:11548, per-category
// content seen live at 54:9589 足球/54:27866 籃球/65:17483 棒球): the
// "即時賽事" title bar + a 4-icon sport-type filter row + a Left&Right
// pair, over a horizontally scrolling row of SportGameBoard cards -- same
// title-bar/filter-row/edge-faded-row skeleton as HotGames and Casino's
// category grid, so it reuses their exact hook/mask/nav-button pieces
// rather than re-deriving the scroll math. Clicking a filter now swaps in
// that category's own game list (same `activeFilter` + `[key] ?? []`
// pattern as SportsNews), not just the active highlight.
export default function SportsLive({ gamesByCategory }: SportsLiveProps) {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
  const games = gamesByCategory[activeFilter] ?? [];
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([games]);
  const hasOverflow = canScroll.left || canScroll.right;

  return (
    <div className="flex w-full flex-col items-start gap-[20px]">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={withBasePath("/icon/sport-live-title-icon.png")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">即時賽事</p>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[10px]">
          {FILTERS.map((f) => (
            <SportsFormFilter
              key={f.key}
              icon={f.icon}
              active={f.key === activeFilter}
              onClick={() => setActiveFilter(f.key)}
            />
          ))}
        </div>
        {hasOverflow && (
          <LeftRight
            canLeft={canScroll.left}
            canRight={canScroll.right}
            onLeft={() => scrollByStep(-SCROLL_STEP)}
            onRight={() => scrollByStep(SCROLL_STEP)}
          />
        )}
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full items-center gap-[20px] overflow-x-auto overflow-y-hidden"
        style={{ maskImage: buildFadeMask(canScroll.left, canScroll.right) }}
      >
        {games.map((game, i) => (
          <SportGameBoard key={i} {...game} />
        ))}
      </div>
    </div>
  );
}
