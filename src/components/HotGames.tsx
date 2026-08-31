"use client";

import { withBasePath } from "../lib/asset";
import { useEdgeScroll } from "../lib/useEdgeScroll";
import LeftRight from "./LeftRight";
import RankedProductCard, { type RankedProductCardProps } from "./RankedProductCard";
import Tag from "./Tag";

const FADE = 120;
const SCROLL_STEP = 317; // one card (297px) + its gap (20px)

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

export type HotGamesProps = {
  games: RankedProductCardProps[];
};

// Figma "Hot Games" component (Components Library node 672:19756): a title
// bar (icon + "熱門遊戲", a "更多" Tag, and a real Left&Right scroll pair --
// same functional-nav pattern as Business's own prev/next buttons) above a
// horizontally scrolling row of ranked cards, edge-faded like every other
// scrollable row in this project. A large decorative dot-scatter graphic
// sits low behind the row's left edge, peeking out from under rank 01.
//
// The "更多"/nav side hides entirely when the row doesn't overflow its
// container at all (e.g. a very wide screen showing every card at once)
// -- see the comment on SectionHeader for why `canLeft || canRight` is
// the right test for that.
export default function HotGames({ games }: HotGamesProps) {
  const { ref: scrollRef, canScroll, scrollByStep } = useEdgeScroll<HTMLDivElement>([games]);
  const hasOverflow = canScroll.left || canScroll.right;

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <div className="flex h-[44px] w-full items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <img alt="" src={withBasePath("/assets/section-header/icon-hot-games.svg")} className="size-[25px]" />
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">熱門遊戲</p>
        </div>
        {hasOverflow && (
          <div className="flex items-center gap-[20px]">
            <Tag label="更多" active />
            <LeftRight
              canLeft={canScroll.left}
              canRight={canScroll.right}
              onLeft={() => scrollByStep(-SCROLL_STEP)}
              onRight={() => scrollByStep(SCROLL_STEP)}
            />
          </div>
        )}
      </div>

      {/* `overflow-hidden` here isn't decorative -- Figma's own node
          (189:31151) applies a `mask-size-[1541px_292px]` mask to this
          same dots graphic specifically so its real 361px height gets
          clipped to this row's 292px. Without it, the extra 69px of the
          decoration bleeds out the bottom of Hot Games into whatever
          content follows -- invisible on the homepage where General
          Games' own opaque cards happen to sit right under it, but a
          visible stray dot landing on the Casino page's category tabs
          just below (this row is one of the last things a user pointed
          at as "a white dot on the 電子遊戲 tab" before this was traced
          back here). */}
      <div className="relative h-[292px] w-full overflow-hidden">
        <img
          alt=""
          src={withBasePath("/assets/hot-games/digital-dots-large.svg")}
          className="pointer-events-none absolute left-0 top-0 h-[361px] w-[378.536px]"
        />

        <div
          ref={scrollRef}
          className="no-scrollbar relative flex h-full items-center gap-[20px] overflow-x-auto overflow-y-hidden"
          style={{ maskImage: buildFadeMask(canScroll.left, canScroll.right) }}
        >
          {games.map((game) => (
            <RankedProductCard key={game.rank} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
}
