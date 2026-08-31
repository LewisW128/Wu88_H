"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import { useEdgeScroll } from "../lib/useEdgeScroll";
import GameSelections from "./GameSelections";
import LeftRight from "./LeftRight";
import NewsBanner, { type NewsBannerProps } from "./NewsBanner";
import Tag from "./Tag";

const FADE = 120;
const SCROLL_STEP = 424; // one banner (404.287px) + its gap (20px)

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

const FILTERS = [
  { key: "all", label: "全部", icon: "/icon/game-all.png" },
  { key: "football", label: "足球", icon: "/icon/sports-news-football.png" },
  { key: "basketball", label: "籃球", icon: "/icon/sports-news-basketball.png" },
  { key: "baseball", label: "棒球", icon: "/icon/sports-news-baseball.png" },
];

export type SportsNewsProps = {
  banners: NewsBannerProps[];
};

// Figma "Sports_News" (03_WU88-H-PC-Sport node 66:59470, seen live at
// 54:5337): title bar, a 全部/足球/籃球/棒球 filter row (reusing the same
// GameSelections pill this project's Casino category tabs already use --
// here the icon itself doesn't recolor between active/inactive, only the
// pill background does, so no separate activeIcon is passed), a "更多新聞"
// Tag, a Left&Right pair, and an edge-faded horizontally scrolling row of
// News Banner cards -- the same skeleton as HotGames/SportsLive/SportsForm
// yet again.
export default function SportsNews({ banners }: SportsNewsProps) {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].key);
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([banners]);
  const hasOverflow = canScroll.left || canScroll.right;

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={withBasePath("/icon/sports-news-title-icon.png")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">體育新聞</p>
      </div>

      <div className="flex w-full items-center justify-between">
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
        <div className="flex items-center gap-[20px]">
          <Tag label="更多新聞" active width={119} />
          {hasOverflow && (
            <LeftRight
              canLeft={canScroll.left}
              canRight={canScroll.right}
              onLeft={() => scrollByStep(-SCROLL_STEP)}
              onRight={() => scrollByStep(SCROLL_STEP)}
            />
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full items-center gap-[20px] overflow-x-auto overflow-y-hidden"
        style={{ maskImage: buildFadeMask(canScroll.left, canScroll.right) }}
      >
        {banners.map((banner, i) => (
          <NewsBanner key={i} {...banner} />
        ))}
      </div>
    </div>
  );
}
