"use client";

import { useRouter } from "next/navigation";
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
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([promotions]);
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <SectionHeader
        icon="/assets/section-header/icon-promotions.svg"
        title="優惠活動"
        canLeft={canScroll.left}
        canRight={canScroll.right}
        onLeft={() => scrollByStep(-SCROLL_STEP)}
        onRight={() => scrollByStep(SCROLL_STEP)}
        onMoreClick={showMore ? () => router.push("/promotions") : undefined}
        hideMore={!showMore}
      />
      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full items-center gap-[20px] overflow-x-auto overflow-y-hidden"
        style={{ maskImage: buildFadeMask(canScroll.left, canScroll.right) }}
      >
        {promotions.map(({ key, ...promo }) => (
          <PromotionCard key={key} {...promo} />
        ))}
      </div>
    </div>
  );
}
