"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import GameSelections from "./GameSelections";
import MatchAnalysisCard, { type MatchAnalysisCardProps } from "./MatchAnalysisCard";

// Same filter row as Sports_News -- see its own comment for why these
// reuse SportsLive's clean /icon/sport-filter-*.png exports instead of the
// noisy, jaggy-edged crops this section briefly had.
const FILTERS = [
  { key: "all", label: "全部", icon: "/icon/game-all.png" },
  { key: "football", label: "足球", icon: "/icon/sport-filter-football.png" },
  { key: "basketball", label: "籃球", icon: "/icon/sport-filter-basketball.png" },
  { key: "baseball", label: "棒球", icon: "/icon/sport-filter-baseball.png" },
];

export type SportsMachAnalysisProps = {
  articles: MatchAnalysisCardProps[];
};

// Figma "Sports Mach analysis" (03_WU88-H-PC-Sport node 66:20574, seen
// live at 54:5338): title bar, the same 全部/足球/籃球/棒球 filter row as
// Sports_News (same GameSelections pills, same icons -- no need for a
// second copy), then a 2-column grid of Match analysis cards. Figma wraps
// this grid in a scroll mask, but at this page's actual article count (8)
// the grid's own height already fits the mask's visible area with no
// overflow -- so this renders as a plain static grid rather than adding
// scroll/fade machinery that has nothing to do yet.
export default function SportsMachAnalysis({ articles }: SportsMachAnalysisProps) {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);

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

      <div className="grid w-full grid-cols-2 gap-x-[20px] gap-y-[15px]">
        {articles.map((article, i) => (
          <MatchAnalysisCard key={i} {...article} />
        ))}
      </div>
    </div>
  );
}
