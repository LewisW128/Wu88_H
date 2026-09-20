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

// Design-space height (px, at scale 1) the site's foreground chrome needs
// so nothing stacks into anything else. Set by the tallest fixed stack on
// any page (Reward Center: detail panel + its 505px table + the Reward_Kit
// row + the real-px gaps around them), and shared by every page so the same
// sidebar/top bar/chat panel are the same size wherever you navigate.
export const PAGE_DESIGN_HEIGHT = 970;

// UI scale that stays constant as the window widens: the smaller of the
// width fit (never wider than the canvas) and a height fit against
// `designHeight`. Width beyond what the current scale needs is left over as
// extra horizontal room for the layout to spread into, while the height-
// based cap is what stops tall content stacking into overlaps.
export function useHeightCappedScale(designHeight: number = PAGE_DESIGN_HEIGHT) {
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
// The scale is `useHeightCappedScale`'s (width AND height fit), not width
// alone: UI size no longer grows with the window's width, so a wider window
// only adds horizontal room. `scale` lets a page that already computes the
// same value for its own fixed layers pass it in instead of computing it twice.
export default function ScaleToFit({ children, scale: scaleOverride }: { children: React.ReactNode; scale?: number }) {
  const heightCappedScale = useHeightCappedScale();
  const scale = scaleOverride ?? heightCappedScale;

  // Always a fluid 100% width, never a fixed DESIGN_WIDTH box: `zoom`
  // multiplies this box's layout width back up, so 100% of the real window
  // is `window width / scale` design px -- exactly DESIGN_WIDTH when the
  // width fit is what limits the scale (unchanged from before), and wider
  // than that when the height fit does, which is the extra room the grid's
  // own fluid middle column (Hot Games' extra cards, etc.) and any
  // edge-anchored layout spread into instead of the whole UI growing.
  return (
    <div style={{ width: "100%", zoom: scale } as React.CSSProperties}>
      <ScaleContext.Provider value={scale}>{children}</ScaleContext.Provider>
    </div>
  );
}
