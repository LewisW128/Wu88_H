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

const FILTERS = [
  { key: "all", icon: "/icon/sport-filter-all.png", activeIcon: "/icon/sport-filter-all-active.png" },
  { key: "football", icon: "/icon/sport-filter-football.png", activeIcon: "/icon/sport-filter-football-active.png" },
  { key: "basketball", icon: "/icon/sport-filter-basketball.png", activeIcon: "/icon/sport-filter-basketball-active.png" },
  { key: "baseball", icon: "/icon/sport-filter-baseball.png", activeIcon: "/icon/sport-filter-baseball-active.png" },
];

export type SportsLiveProps = {
  games: SportGameBoardProps[];
};

// Figma "Sports Live" (03_WU88-H-PC-Sport node 801:11548): the "即時賽事"
// title bar + a 4-icon sport-type filter row + a Left&Right pair, over a
// horizontally scrolling row of SportGameBoard cards -- same title-bar/
// filter-row/edge-faded-row skeleton as HotGames and Casino's category
// grid, so it reuses their exact hook/mask/nav-button pieces rather than
// re-deriving the scroll math. The 4 filter icons have no per-category
// game data yet (Figma only ever defines the one 即時賽事 list), so
// clicking one just swaps the active highlight for now -- wire in real
// filtering once that's specified.
export default function SportsLive({ games }: SportsLiveProps) {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
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
              activeIcon={f.activeIcon}
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
