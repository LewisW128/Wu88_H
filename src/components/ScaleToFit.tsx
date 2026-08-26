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
export default function ScaleToFit({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      setScale(Math.min(1, window.innerWidth / DESIGN_WIDTH));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div style={{ width: DESIGN_WIDTH, zoom: scale } as React.CSSProperties}>
      <ScaleContext.Provider value={scale}>{children}</ScaleContext.Provider>
    </div>
  );
}
