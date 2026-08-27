"use client";

import { useEdgeScroll } from "../lib/useEdgeScroll";
import ProductCard, { type ProductCardProps } from "./ProductCard";
import SectionHeader from "./SectionHeader";

const FADE = 120; // matches Hot Games' own edge fade distance.
const SCROLL_STEP = 220; // one card (200px) + its gap (20px)

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

export type GeneralGamesProps = {
  games: ProductCardProps[];
};

// Figma "推薦遊戲" section: same title-bar + scrollable-card-row pattern as
// Hot Games/Business, just with plain ProductCards -- pulled into its own
// component (it used to be an inline, non-scroll-aware block in page.tsx)
// so it can share `useEdgeScroll` and get a real fade mask and a "更多"/nav
// pair that actually scrolls and hides itself when there's nothing to
// scroll to, same as every other row here.
export default function GeneralGames({ games }: GeneralGamesProps) {
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([games]);

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <SectionHeader
        icon="/assets/section-header/icon-general-games.svg"
        title="推薦遊戲"
        canLeft={canScroll.left}
        canRight={canScroll.right}
        onLeft={() => scrollByStep(-SCROLL_STEP)}
        onRight={() => scrollByStep(SCROLL_STEP)}
      />
      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full items-center gap-[20px] overflow-x-auto overflow-y-hidden"
        style={{ maskImage: buildFadeMask(canScroll.left, canScroll.right) }}
      >
        {games.map((game) => (
          <ProductCard key={game.title} {...game} />
        ))}
      </div>
    </div>
  );
}
