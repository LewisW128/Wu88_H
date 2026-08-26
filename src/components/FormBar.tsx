"use client";

import { useEffect, useId, useRef, useState } from "react";
import GameCard, { type GameCardProps } from "./GameCard";

const FADE = 120; // matches Hot Games' own edge fade distance.

// `leftShiftBy` is the row's own current translateX distance (0 when not
// shifted). The mask's coordinates live in the ROW's own space, but the
// row is what actually moves -- shifting it left by N carries the
// gradient's "transparent at 0px" point N px left of the wrapper's real
// (stationary) clip edge along with it. Without correcting for that, the
// content actually sitting at the wrapper's visible boundary is only
// partway through the fade (not yet transparent) when `overflow-hidden`
// hard-cuts it, showing a visible seam right where a card is still
// partially opaque. Offsetting the gradient's stops by `leftShiftBy`
// keeps "fully transparent" pinned to the wrapper's real edge regardless
// of how far the row itself has shifted.
function buildFadeMask(leftShiftBy: number, fadeRight: boolean) {
  const leftStop = leftShiftBy > 0 ? `transparent ${-leftShiftBy}px, black ${FADE - leftShiftBy}px` : "black 0px";
  const rightColor = fadeRight ? "transparent" : "black";
  return `linear-gradient(to right, ${leftStop}, black calc(100% - ${FADE}px), ${rightColor} 100%)`;
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
// The edge fade is tied to hover state, not scroll position: at rest the
// row's own content already fits, so there's nothing to hint at and no
// fade shows. Hovering any card OTHER than the last one grows it via
// normal flex reflow, pushing every later card (including the last one)
// to the right -- that's when the right edge fades, to signal there's more
// past it. Hovering the LAST card is the one case that can't just grow
// right (it's already flush with the row's own edge, and growing further
// would run it into Talking_Bar), so it instead shifts the whole row left
// far enough to make room -- see `lastCardShift` below. That shift is a
// `transform` on the scroll container itself, not a scroll of its content,
// so it carries the row's own left edge past its normal position and would
// otherwise bleed the first card's leading edge into the Sidebar column
// next door -- `overflow-hidden` on the wrapper clips that bleed at the
// row's true boundary, and the mask's left edge fades that same card out
// right at that boundary instead of just hard-cutting it.
//
// The shift itself is driven by a real `:has(:hover)` CSS rule (in the
// injected <style> below), not by React state + an inline `transform`.
// The last card's own width growth is native `:hover` (instant, no JS
// round-trip); a React state update always takes at least one extra
// render to reach the DOM. Driving the shift from state meant it
// consistently started a frame or more behind the card's own growth for
// the ENTIRE 300ms of the transition, not just a one-off flash -- long
// enough that the card's right edge was visibly past the (React-state-
// driven) shifted boundary and getting hard-clipped by `overflow-hidden`
// the whole time you hovered it, correcting only once the transition
// settled. A `:has()` rule reacts to the same native `:hover` change the
// card's own width does, so both start on the same tick. React state
// still drives the fade mask below (hoveredIndex) -- a fade lagging by a
// frame is imperceptible in a way a hard clip lagging by a frame is not.
const LAST_CARD_GROWTH_DELTA = 19.964; // 180.964 - 161

export default function FormBar({ games }: FormBarProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const rowId = `form-bar-row-${rawId.replace(/:/g, "")}`;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // How far the row needs to shift left so the grown last card's own right
  // edge lands exactly on the row's real right edge. Naively this is just
  // LAST_CARD_GROWTH_DELTA (the card's own growth), but that assumes the
  // row's resting content exactly fills its container with zero slack --
  // any pre-existing sub-pixel rounding slop in the row's own layout adds
  // straight onto how far right the grown card would otherwise overflow.
  // Measuring the row's actual rest-state overflow and folding it into the
  // shift keeps the right edge flush regardless of that slop, instead of
  // just hoping the fixed constant happens to be exact. `scrollWidth` and
  // `clientWidth` are already in this element's own authored (design-
  // space) pixels despite living inside ScaleToFit's zoomed canvas --
  // unlike `getBoundingClientRect()`, they don't reflect the zoom factor --
  // so no conversion against `scale` is needed here.
  const [extraShift, setExtraShift] = useState(0);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    function measure() {
      if (!el) return;
      setExtraShift(Math.max(0, el.scrollWidth - el.clientWidth));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [games]);

  const lastIndex = games.length - 1;
  const isLastHovered = hoveredIndex === lastIndex;
  const isOtherHovered = hoveredIndex !== null && !isLastHovered;
  const lastCardShift = LAST_CARD_GROWTH_DELTA + extraShift;

  return (
    <div className="overflow-hidden">
      <style>{`#${rowId}:has(> div:last-child:hover) { transform: translateX(-${lastCardShift}px); }`}</style>
      <div
        ref={rowRef}
        id={rowId}
        className="no-scrollbar flex h-[206.816px] items-end gap-[20px] overflow-x-auto overflow-y-hidden transition-transform duration-300 ease-out"
        style={{ maskImage: buildFadeMask(isLastHovered ? lastCardShift : 0, isOtherHovered) }}
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
    </div>
  );
}
