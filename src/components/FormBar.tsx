"use client";

import { useEffect, useRef, useState } from "react";
import GameCard, { type GameCardProps } from "./GameCard";

const FADE = 120; // matches Hot Games' own edge fade distance.

function buildFadeMask(canLeft: boolean, canRight: boolean) {
  const leftColor = canLeft ? "transparent" : "black";
  const rightColor = canRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftColor} 0px, black ${FADE}px, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
}

// Design-space card/gap widths (GameCard's own resting/hover-grown sizes),
// used to compute the row's total content width at the exact moment the
// last card is fully grown -- see the comment on `scrollToEnd` below for
// why this is a fixed calculation instead of a live measurement.
const CARD_WIDTH = 161;
const CARD_WIDTH_GROWN = 180.964;
const CARD_GAP = 20;
// Extra scroll past the exact minimum needed to reveal the grown last
// card, so it settles with real breathing room on both sides instead of
// sitting flush against the edge.
const END_SCROLL_MARGIN = 20;

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
// card's own growth. The fade mask is a pure function of real scroll
// position (`scroll` events) on both edges, no hover-based override --
// scrolling to reveal the last card can genuinely carry the first card's
// edge out of view, and the fade is what makes that a smooth visual
// transition instead of a hard, abrupt clip by the scroll container's own
// boundary. An earlier version suppressed the left fade specifically
// while the last card was hovered (to read as "fully revealed"), but
// that suppression made the actual clip look worse, not better: content
// really was scrolled out of view, and turning the fade off just removed
// the smoothing that made losing sight of it look intentional instead of
// broken.
export default function FormBar({ games }: FormBarProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

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

  // The "start" case can just target a fixed 0 -- correct at any moment,
  // regardless of any card's own hover-transition state. "end" used to
  // read `el.scrollWidth` live instead, but that reflects whatever width
  // the last card happens to have AT THAT INSTANT: this handler fires the
  // moment the mouse enters (real CSS :hover, no JS delay), which is
  // BEFORE the card's own 300ms width transition has actually grown it --
  // so the scroll target was calculated from the card's still-shrunk
  // resting width, undershooting where it needed to land once the card
  // finished growing a moment later. Computing the same fixed target the
  // "start" case uses -- the row's total width once every card except the
  // last is at rest and the last one is fully grown, a known constant
  // derived from GameCard's own sizes rather than measured off a
  // mid-transition DOM -- sidesteps that race the same way "start"'s
  // fixed 0 does.
  //
  // `behavior: "instant"`, not "smooth": a smooth scroll moves the ROW's
  // content under a mouse cursor that stays at the same screen position
  // the whole time -- so every card the content slides past during that
  // couple hundred ms genuinely passes under the cursor and fires its own
  // real mouseenter/mouseleave, growing and fading each one in turn as it
  // sweeps by. That's what produced multiple cards appearing "hover-
  // grown" at once and the fade turning on/off at seemingly the wrong
  // times -- not a logic bug in which state was tracked, but a cascade of
  // genuine extra hover events the animated scroll itself was causing.
  // Jumping straight to the target removes the window for that entirely.
  function scrollToEnd(edge: "start" | "end") {
    const el = rowRef.current;
    if (!el) return;
    if (edge === "start") {
      el.scrollTo({ left: 0, behavior: "instant" });
      return;
    }
    const totalGrownWidth = (games.length - 1) * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH_GROWN;
    el.scrollTo({ left: totalGrownWidth - el.clientWidth + END_SCROLL_MARGIN, behavior: "instant" });
  }

  return (
    <div
      ref={rowRef}
      className="no-scrollbar flex h-[206.816px] items-end gap-[20px] overflow-x-auto overflow-y-hidden"
      style={{ maskImage: buildFadeMask(canScroll.left, canScroll.right) }}
    >
      {games.map((game, index) => {
        const isFirst = index === 0;
        const isLast = index === games.length - 1;
        return (
          <GameCard
            key={game.mainText}
            {...game}
            onMouseEnter={isFirst ? () => scrollToEnd("start") : isLast ? () => scrollToEnd("end") : undefined}
          />
        );
      })}
    </div>
  );
}
