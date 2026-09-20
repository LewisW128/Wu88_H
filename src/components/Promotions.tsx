"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { useEdgeScroll } from "../lib/useEdgeScroll";
import PromotionCard, { type PromotionCardProps } from "./PromotionCard";
import SectionHeader from "./SectionHeader";

const FADE = 60;
const SCROLL_STEP = 351; // one "General" card (331px) + its gap (20px)

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

const GAP = 20;
// How far a row that only just overflows may squeeze to show every card
// whole instead of scrolling: the gap down to MIN_GAP first, then a uniform
// zoom no lower than MIN_FIT_SCALE. Anything tighter is a genuine overflow
// and keeps the scrolling row.
const MIN_GAP = 10;
const MIN_FIT_SCALE = 0.9;

// How to lay the row out so a row that overflows by only a sliver shows
// every card whole (no scrolling, no fade, no arrows) instead of leaving
// its last card clipped behind a scroll the user has to reach for.
function useFitToRow(count: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ gap: GAP, scale: 1, squeezed: false });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    function update() {
      if (!container || !content) return;
      // `offsetWidth`/`clientWidth` both report unzoomed design px, so this
      // is independent of the fit zoom applied below (and of ScaleToFit's).
      const cards = [...content.children] as HTMLElement[];
      const cardsWidth = cards.reduce((sum, card) => sum + card.offsetWidth, 0);
      const gaps = Math.max(0, cards.length - 1);
      const available = container.clientWidth;
      let next = { gap: GAP, scale: 1, squeezed: false };
      if (gaps > 0 && cardsWidth + gaps * GAP > available) {
        const tightest = cardsWidth + gaps * MIN_GAP;
        if (tightest <= available) next = { gap: (available - cardsWidth) / gaps, scale: 1, squeezed: true };
        else if (available / tightest >= MIN_FIT_SCALE) next = { gap: MIN_GAP, scale: available / tightest, squeezed: true };
      }
      setFit((prev) => (prev.squeezed === next.squeezed && Math.abs(prev.gap - next.gap) < 0.01 && Math.abs(prev.scale - next.scale) < 0.0001 ? prev : next));
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [count]);

  return { containerRef, contentRef, fit };
}

export type PromotionsProps = {
  promotions: (PromotionCardProps & { key: string })[];
  // Off on /promotions' own page, where this row sits directly above the
  // full 所有優惠 listing -- a "更多" back to /promotions there would be
  // pointless. Every other page (home, profile) keeps it on.
  showMore?: boolean;
};

// Figma "優惠活動" section: same title-bar + scrollable-card-row pattern as
// Hot Games/Business, just with PromotionCards -- pulled into its own
// component (it used to be an inline, non-scroll-aware block in page.tsx)
// so it can share `useEdgeScroll` and get a real fade mask and a "更多"/nav
// pair that actually scrolls and hides itself when there's nothing to
// scroll to, same as every other row here. "更多" goes to /promotions,
// same idea as GeneralGames' own "更多" -- see the profile/home page's
// own copy of this row, which now shares that navigation too.
export default function Promotions({ promotions, showMore = true }: PromotionsProps) {
  const { containerRef, contentRef, fit } = useFitToRow(promotions.length);
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([promotions, fit]);
  const router = useRouter();
  // A squeezed row shows every card whole, so it has nothing to scroll to
  // even where the browser's own scroll extents (which `zoom` skews) say
  // otherwise -- trust the fit, not the raw measurement.
  const scrollable = fit.squeezed ? { left: false, right: false } : canScroll;

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <SectionHeader
        icon="/assets/section-header/icon-promotions.svg"
        title="優惠活動"
        canLeft={scrollable.left}
        canRight={scrollable.right}
        onLeft={() => scrollByStep(-SCROLL_STEP)}
        onRight={() => scrollByStep(SCROLL_STEP)}
        onMoreClick={showMore ? () => router.push("/promotions") : undefined}
        hideMore={!showMore}
      />
      <div
        ref={(el) => {
          scrollRef.current = el;
          containerRef.current = el;
        }}
        className={`no-scrollbar w-full overflow-y-hidden ${fit.squeezed ? "overflow-x-hidden" : "overflow-x-auto"}`}
        style={{ maskImage: buildFadeMask(scrollable.left, scrollable.right) }}
      >
        <div ref={contentRef} className="flex w-max items-center" style={{ gap: fit.gap, zoom: fit.scale } as React.CSSProperties}>
          {promotions.map(({ key, ...promo }) => (
            <PromotionCard key={key} {...promo} />
          ))}
        </div>
      </div>
    </div>
  );
}
