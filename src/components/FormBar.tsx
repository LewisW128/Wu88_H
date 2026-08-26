"use client";

import { useEffect, useRef, useState } from "react";
import GameCard, { type GameCardProps } from "./GameCard";

const FADE = 120; // matches Hot Games' own edge fade distance.

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

export type FormBarProps = {
  games: GameCardProps[];
};

// Figma "Form Bar" sits inside the hero layer, between the carousel dots and
// Hot Games. `overflow-x-auto` forces the browser to compute overflow-y as
// "auto" too (a well-known CSS quirk -- you can't pair non-visible overflow
// on one axis with visible on the other), so the row is fixed at the card's
// own hover-grown height (not its 184px resting height): any resting height
// here would clip a card's hover-growth instead of letting it expand upward
// into open space, and `overflow-y-hidden` overrides that same auto-Y back
// off -- without it this row can pick up its own independent vertical
// scrollbar that hijacks the mouse wheel instead of it scrolling the page.
//
// Edge-faded like every other scrollable row in this project (Hot Games,
// General Games, Promotions, Business), so growth that pushes the row's
// real content past its visible edge reads as "more to scroll to" instead
// of a hard clip.
//
// The rightmost card has no room to grow further right on hover -- it's
// already flush with the row's own right edge, so normal flex growth would
// just run it into whatever sits past the row (Talking_Bar). Tracking that
// card's own hover state and shifting the WHOLE row left by exactly its
// growth delta (161px -> 180.964px, a 19.964px difference) the moment it's
// hovered makes every earlier card shift left in lockstep (uniform gaps
// preserved) while the growing card's right edge stays flush with the
// row's own boundary instead of overflowing it. This is plain React state
// (onMouseEnter/onMouseLeave) rather than a `:has(:hover)` CSS selector --
// functionally equivalent, but state that can be inspected and driven
// directly is easier to reason about and test than relying on the
// browser's own `:has()` invalidation.
const LAST_CARD_GROWTH_DELTA = 19.964; // 180.964 - 161

export default function FormBar({ games }: FormBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  const [lastCardHovered, setLastCardHovered] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScroll({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1,
      });
    }

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [games]);

  return (
    <div
      ref={scrollRef}
      className="no-scrollbar flex h-[206.816px] items-end gap-[20px] overflow-x-auto overflow-y-hidden transition-transform duration-300 ease-out"
      style={{
        maskImage: buildFadeMask(canScroll.left, canScroll.right),
        transform: lastCardHovered ? `translateX(-${LAST_CARD_GROWTH_DELTA}px)` : undefined,
      }}
    >
      {games.map((game, index) => (
        <GameCard
          key={game.mainText}
          {...game}
          onMouseEnter={index === games.length - 1 ? () => setLastCardHovered(true) : undefined}
          onMouseLeave={index === games.length - 1 ? () => setLastCardHovered(false) : undefined}
        />
      ))}
    </div>
  );
}
