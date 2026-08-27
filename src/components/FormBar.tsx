"use client";

import { useEffect, useRef, useState } from "react";
import GameCard, { type GameCardProps } from "./GameCard";

const FADE = 120; // matches Hot Games' own edge fade distance.

function buildFadeMask(fadeRight: boolean) {
  const rightColor = fadeRight ? "transparent" : "black";
  return `linear-gradient(to right, black 0px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
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
// Every card, including the last one, just grows to the right on hover via
// plain CSS :hover -- the same as every other card in this row, no special
// case. An earlier version tried to keep the last card's growth from ever
// crossing the row's own nominal boundary by shifting the whole row left
// to compensate (a `:has(:hover)` rule) plus a matching mask/overflow-
// hidden setup on the left edge. That chased its own tail across several
// rounds of fixes -- a shift that has to be measured (rest-state overflow
// via ResizeObserver), synced to the exact same tick as the card's own
// native-CSS growth, and then have the fade mask's own coordinates
// corrected for how far the shift moved them -- three interdependent
// moving parts, any one of which being slightly off (or off only at
// certain viewport widths, timings, or load orders) reads as "still
// cut," which is exactly what kept happening. Measured directly, the
// grown last card already clears Talking_Bar with real margin to spare
// at every width this project actually supports -- the shift was solving
// a problem that didn't need solving, at the cost of a fragile mechanism
// that kept finding new ways to be wrong. The row's own edge fade (shown
// whenever any card's growth might push the row's real content past its
// nominal width) is enough on its own.
export default function FormBar({ games }: FormBarProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    function measure() {
      if (!el) return;
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
    measure();
    el.addEventListener("scroll", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [games]);

  return (
    <div
      ref={rowRef}
      className="no-scrollbar flex h-[206.816px] items-end gap-[20px] overflow-x-auto overflow-y-hidden"
      style={{ maskImage: buildFadeMask(hoveredIndex !== null || canScrollRight) }}
    >
      {games.map((game, index) => (
        <GameCard
          key={game.mainText}
          {...game}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
        />
      ))}
    </div>
  );
}
