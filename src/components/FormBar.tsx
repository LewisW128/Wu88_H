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
// Every card grows to the right on hover via plain CSS :hover, same as
// every other card -- no special-cased width/position math. Hovering the
// FIRST or LAST card additionally scrolls the row to that end (native
// `scrollTo`, not a `transform`), so a grown edge card is guaranteed
// fully visible via the browser's own scroll mechanics instead of a
// hand-rolled shift that has to be measured and kept in sync with the
// card's own growth.
//
// The fade mask reflects real scroll position (`scroll` events) for the
// general case, but hovering the LAST card is a deliberate exception: per
// spec that card should read as fully, cleanly revealed with no fade at
// all while it's the thing being looked at, even though scrolling to
// reveal it necessarily moves scrollLeft off 0 (which would otherwise
// turn the left fade on, since there's now real content scrolled past
// that edge). `isLastHovered` suppresses just that left fade for exactly
// as long as the last card is being hovered.
export default function FormBar({ games }: FormBarProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  const [isLastHovered, setIsLastHovered] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    function measure() {
      if (!el) return;
      setCanScroll({
        left: el.scrollLeft > 0,
        right: el.scrollLeft < el.scrollWidth - el.clientWidth - 1,
      });
    }
    measure();
    el.addEventListener("scroll", measure);
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [games]);

  function scrollToEnd(edge: "start" | "end") {
    const el = rowRef.current;
    if (!el) return;
    el.scrollTo({ left: edge === "start" ? 0 : el.scrollWidth, behavior: "smooth" });
  }

  return (
    <div
      ref={rowRef}
      className="no-scrollbar flex h-[206.816px] items-end gap-[20px] overflow-x-auto overflow-y-hidden"
      style={{ maskImage: buildFadeMask(isLastHovered ? false : canScroll.left, canScroll.right) }}
    >
      {games.map((game, index) => {
        const isFirst = index === 0;
        const isLast = index === games.length - 1;
        return (
          <GameCard
            key={game.mainText}
            {...game}
            onMouseEnter={
              isFirst
                ? () => scrollToEnd("start")
                : isLast
                  ? () => {
                      scrollToEnd("end");
                      setIsLastHovered(true);
                    }
                  : undefined
            }
            onMouseLeave={isLast ? () => setIsLastHovered(false) : undefined}
          />
        );
      })}
    </div>
  );
}
