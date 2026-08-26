"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 1728;

const ScaleContext = createContext(1);

// Lets a descendant (Talking_Bar, so it can size itself against the real
// browser viewport height instead of a fixed design-space number) read the
// same width-based scale factor ScaleToFit applies to the whole canvas.
export function useScale() {
  return useContext(ScaleContext);
}

// This page's whole component library is hand-built at a fixed 1728px
// canvas (every section hardcodes its own pixel widths, matching the
// Figma "MacBook Pro 16"" frame). At any narrower real browser width --
// which is most laptops -- that fixed canvas simply overflows instead of
// fitting, clipping content like Talking_Bar off-screen entirely. This
// scales the whole 1728 canvas down to match a narrower viewport, the same
// "fit-to-width" technique fixed-size admin dashboards/prototypes use, so
// the page fills edge-to-edge with no horizontal overflow.
//
// Scale is capped at 1 -- deliberately NOT scaled *up* past the design's
// own 100% size on wider screens. Uncapped, `viewportWidth / 1728` blows
// every element up beyond its real Figma dimensions on any monitor wider
// than 1728px (the common case), which is exactly what "everything looks
// oversized" was: the whole page rendering at e.g. 1920/1728 = 1.11x. On
// those wider screens the canvas instead sits at its true 1:1 size,
// centered, with the page's own gray base layer showing on both sides --
// consistent with the two-layer background model (gray base, white
// content panel on top) rather than treating the canvas as infinitely
// stretchy.
export default function ScaleToFit({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number>();

  useEffect(() => {
    // Deliberately window-resize-only, NOT a ResizeObserver on the content
    // itself: every card's hover-grow, the chat panel's live message drip,
    // and any other in-page layout change would also fire a content
    // resize, re-measuring and re-applying `scale`/height on every such
    // tick -- visible as the whole page continuously twitching. The
    // content's natural height only actually needs re-measuring when the
    // viewport itself changes.
    //
    // This used to also try to preserve scroll position (as a fraction of
    // page height) across a resize, since narrowing the window shrinks
    // this wrapper's height and can make the browser force-clamp scrollY.
    // That restoration attempt turned out to be its own worse bug: normal
    // hover-driven layout changes elsewhere on the page (Top_up's
    // hover-expand, a card's hover-grow) were intermittently misread as
    // needing the same correction, causing large, inconsistent scroll
    // jumps during ordinary interaction -- confirmed by triggering the
    // exact same hover state repeatedly and getting different scroll
    // results each time, a race condition rather than a deterministic
    // effect of the resize fix. A resize-triggered scroll clamp on a
    // narrower window is a minor, rare inconvenience; unpredictable jumps
    // during normal use are much worse, so this was removed rather than
    // patched further.
    function update() {
      const nextScale = Math.min(1, window.innerWidth / DESIGN_WIDTH);
      setScale(nextScale);
      if (contentRef.current) setScaledHeight(contentRef.current.scrollHeight * nextScale);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    // Width is the actual on-screen (post-scale) size, not "100%" -- a
    // transform doesn't shrink an element's own layout box, so sizing this
    // wrapper to the *unscaled* 1728px child would get it centered by the
    // page's own `items-center` against the wrong (pre-scale) width,
    // shifting the visually-scaled content off-true. Explicitly sizing to
    // `scale * DESIGN_WIDTH` keeps centering correct in both directions:
    // it equals the full viewport width when scale < 1 (flush edges, no
    // overflow) and equals 1728px when scale is capped at 1 (centered at
    // true size on wide screens).
    <div style={{ height: scaledHeight, width: scale * DESIGN_WIDTH }}>
      <div ref={contentRef} style={{ width: DESIGN_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <ScaleContext.Provider value={scale}>{children}</ScaleContext.Provider>
      </div>
    </div>
  );
}
