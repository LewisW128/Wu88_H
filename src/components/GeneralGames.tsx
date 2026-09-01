"use client";

import { useRouter } from "next/navigation";
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

// Figma "推薦遊戲" section (title renamed to "電子遊戲推薦" per request --
// Figma's own component name is unchanged): same title-bar + scrollable-
// card-row pattern as Hot Games/Business, just with plain ProductCards --
// pulled into its own component (it used to be an inline, non-scroll-aware
// block in page.tsx) so it can share `useEdgeScroll` and get a real fade
// mask and a nav pair that actually scrolls and hides itself when there's
// nothing to scroll to, same as every other row here. Its "更多" goes to
// /casino with the 電子遊戲 (slot) tab pre-selected via `?tab=slot` --
// see CasinoGameGrid's `initialTab` prop -- rather than just being a
// decorative label like it was before.
export default function GeneralGames({ games }: GeneralGamesProps) {
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([games]);
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <SectionHeader
        icon="/assets/section-header/icon-general-games.svg"
        title="電子遊戲推薦"
        canLeft={canScroll.left}
        canRight={canScroll.right}
        onLeft={() => scrollByStep(-SCROLL_STEP)}
        onRight={() => scrollByStep(SCROLL_STEP)}
        onMoreClick={() => router.push("/casino?tab=slot")}
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
