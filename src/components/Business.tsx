"use client";

import { withBasePath } from "../lib/asset";
import { useEdgeScroll } from "../lib/useEdgeScroll";
import BusinessCard, { type BusinessCardProps } from "./BusinessCard";
import Tag from "./Tag";

const FADE = 60;
const SCROLL_STEP = 366; // one card (346px) + its gap (20px)

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

// Figma's own two icon assets aren't a plain arrow + its active-color twin --
// arrow-general.svg (gray) points LEFT by default, arrow-general-active.svg
// (teal) points RIGHT by default. So building a real 4-state (left/right x
// enabled/disabled) control means picking the asset by color/enabled-state
// and then flipping it whenever that asset's own baked-in direction doesn't
// match the button's actual direction.
function NavButton({ direction, disabled, onClick }: { direction: "left" | "right"; disabled: boolean; onClick: () => void }) {
  const active = !disabled;
  const assetDefaultDirection = active ? "right" : "left";
  const needsFlip = direction !== assetDefaultDirection;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "previous" : "next"}
      className={`flex h-[32.4px] items-center justify-center rounded-full p-[7.2px] backdrop-blur-[7.2px] transition-colors disabled:cursor-default ${
        active ? "bg-[#3e4140]" : "bg-[#f4f4f4]"
      }`}
    >
      <img
        alt=""
        src={withBasePath(active ? "/assets/business/arrow-general-active.svg" : "/assets/business/arrow-general.svg")}
        className={`size-[18px] ${needsFlip ? "rotate-180" : ""}`}
      />
    </button>
  );
}

export type BusinessProps = {
  cards: BusinessCardProps[];
};

// Figma "Business" component (Components Library node 737:8017). Title bar
// (icon + "頂級合作廠商", a "更多" Tag, and prev/next nav buttons) above a
// horizontally scrolling row of partner-logo cards. The row's edge fade
// mimics Win List's row fade -- Figma's own mask only fades the right edge
// (a static "more to scroll" hint for the un-scrolled starting state), but
// made properly scroll-aware here so the left edge fades in once scrolled
// and the right edge clears once you reach the last card. The nav buttons
// scroll by one card-width and their own enabled/disabled look follows the
// same scroll state.
//
// The "更多"/nav side hides entirely once the row no longer overflows its
// container -- see the comment on SectionHeader for why
// `canLeft || canRight` is the right test for that.
export default function Business({ cards }: BusinessProps) {
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([cards]);
  const hasOverflow = canScroll.left || canScroll.right;

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <div className="relative flex h-[44px] w-full items-center">
        <div className="flex items-center gap-[10px]">
          <img alt="" src={withBasePath("/assets/business/title-icon.svg")} className="size-[25px]" />
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">頂級合作廠商</p>
        </div>

        {hasOverflow && (
          <div className="absolute right-0 flex items-center gap-[20px]">
            <Tag label="更多" active />
            <div className="flex items-center gap-[5px]">
              <NavButton direction="left" disabled={!canScroll.left} onClick={() => scrollByStep(-SCROLL_STEP)} />
              <NavButton direction="right" disabled={!canScroll.right} onClick={() => scrollByStep(SCROLL_STEP)} />
            </div>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex h-[130px] w-full items-center gap-[20px] overflow-x-auto overflow-y-hidden"
        style={{ maskImage: buildFadeMask(canScroll.left, canScroll.right) }}
      >
        {cards.map((card, index) => (
          <BusinessCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
