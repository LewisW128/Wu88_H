"use client";

import { withBasePath } from "../lib/asset";
import { useEdgeScroll } from "../lib/useEdgeScroll";
import LeftRight from "./LeftRight";
import SportBtn, { type SportBtnProps } from "./SportBtn";

const FADE = 120;
const SCROLL_STEP = 366; // one button (346px) + its gap (20px)

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

// Figma "Sports form" (03_WU88-H-PC-Sport node 66:29850, seen live at
// 54:5336): same title-bar/edge-faded-row skeleton as HotGames/SportsLive
// again, this time wrapping the 5 SportBtn provider buttons built earlier
// as their own module.
export default function SportsForm({ buttons }: { buttons: SportBtnProps[] }) {
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([buttons]);
  const hasOverflow = canScroll.left || canScroll.right;

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <div className="flex h-[44px] w-full items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <img alt="" src={withBasePath("/icon/sports-form-title-icon.png")} className="size-[25px]" />
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">更多盈利機會</p>
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
        {buttons.map((btn) => (
          <SportBtn key={btn.provider} {...btn} />
        ))}
      </div>
    </div>
  );
}
