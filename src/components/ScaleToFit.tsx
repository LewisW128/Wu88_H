"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DESIGN_WIDTH = 1728;

const ScaleContext = createContext(1);

// Lets a descendant (Talking_Bar, so it can size itself against the real
// browser viewport height instead of a fixed design-space number) read the
// same width-based scale factor ScaleToFit applies to the whole canvas.
export function useScale() {
  return useContext(ScaleContext);
}

// The design-space height a container needs so that a `sticky` child
// wanting to reach `bottomGap` screen-px above the real viewport bottom
// (Talking_Bar's own target -- see its VIEWPORT_BOTTOM_GAP) actually has
// room to. `position: sticky` can never push an element past its own
// containing block's edge: on a page whose real content (e.g. a Casino
// category with only 1-2 rows of cards) is shorter than Talking_Bar's
// own viewport-driven height, Talking_Bar itself ends up as the tallest
// grid item, which sizes its own containing block to exactly its own
// height -- leaving zero slack for the `top-[58px]` sticky offset to
// apply, so it renders flush under Top_bar instead of with the intended
// gap. Applying this as a `minHeight` on that containing block keeps it
// at least as tall as Talking_Bar's own target bottom edge regardless of
// how little real content the page has, restoring the gap.
export function useMinPanelHeight(bottomGap = 20) {
  const scale = useScale();
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    function update() {
      if (!scale) return;
      setMinHeight((window.innerHeight - bottomGap) / scale);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [scale, bottomGap]);

  return minHeight;
}

// UI scale for pages that must keep a constant size as the window widens:
// the smaller of the width fit (never wider than the canvas) and a height
// fit against `designHeight` (the design-space height the page's content
// needs at scale 1). Width beyond what the current scale needs is left over
// as extra horizontal room for the layout to spread into, while the
// height-based cap is what stops tall content stacking into overlaps.
export function useHeightCappedScale(designHeight: number) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      setScale(Math.min(1, window.innerWidth / DESIGN_WIDTH, window.innerHeight / designHeight));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [designHeight]);

  return scale;
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
// Uses the CSS `zoom` property, NOT `transform: scale()`. `transform`
// only changes paint -- the element's layout box stays at its pre-scale
// size, so anything computed relative to real viewport pixels inside it
// goes wrong at any scale other than exactly 1. `position: sticky`
// (Top_bar, Sidebar, Talking_Bar, the utility row) is exactly that kind of
// calculation: at scale=1 its threshold math happened to line up by
// coincidence, but at any other window width sticky simply stopped
// engaging and the whole page scrolled as one rigid block -- confirmed by
// the bug only appearing at widths other than exactly 1728x900. `zoom`
// instead changes the actual effective pixel size of its subtree, so
// child layout, scroll, and sticky math all stay internally consistent at
// any scale -- and this wrapper doesn't need to separately track/apply a
// scaled height or width either, since zoom already makes the browser
// treat this box as `DESIGN_WIDTH * scale` real pixels wide on its own.
//
// `scale` overrides the width-only default with a caller-supplied value
// (see `useHeightCappedScale`): UI size stops being tied to window width, so
// a wider window only adds horizontal room instead of enlarging everything.
export default function ScaleToFit({ children, scale: scaleOverride }: { children: React.ReactNode; scale?: number }) {
  const [widthScale, setWidthScale] = useState(1);

  useEffect(() => {
    function update() {
      setWidthScale(Math.min(1, window.innerWidth / DESIGN_WIDTH));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scale = scaleOverride ?? widthScale;

  // Below the design width, this stays a fixed DESIGN_WIDTH box that zoom
  // shrinks to fit -- unchanged from before. At or above it, scale is
  // pinned at exactly 1 (never scales up), so this box would otherwise
  // render at a hard 1728px and just sit centered with gray margins on
  // either side no matter how much wider the real window is -- the
  // layout inside never actually saw that extra space to do anything
  // with it. Switching to a fluid 100% width in that case (zoom:1 has no
  // scaling effect either way, so this changes nothing about the zoomed-
  // shrink behavior) lets the grid's own fluid middle column actually
  // grow with the real viewport, which is what lets rows like Hot Games
  // reveal more cards on a wide screen instead of just sitting in a
  // fixed-size box with empty space around it.
  // A caller-supplied scale can sit BELOW `widthScale` (height-limited), in
  // which case a fixed DESIGN_WIDTH box would zoom to less than the window's
  // width and leave a gap on the right -- so an override is always fluid.
  const isFluid = scaleOverride !== undefined || scale >= 1;

  return (
    <div style={{ width: isFluid ? "100%" : DESIGN_WIDTH, zoom: scale } as React.CSSProperties}>
      <ScaleContext.Provider value={scale}>{children}</ScaleContext.Provider>
    </div>
  );
}
