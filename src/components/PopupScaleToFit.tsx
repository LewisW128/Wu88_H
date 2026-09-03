"use client";

import { useEffect, useState } from "react";

// Same `zoom`-based fit-to-viewport technique as ScaleToFit (see that
// component's own comment for why `zoom`, not `transform: scale`, keeps
// child layout/sticky math internally consistent at any scale) -- but for
// a modal's own fixed design size instead of the whole page's 1728px
// canvas, and without ScaleToFit's own "go fluid past 100%" behavior:
// a popup has no reason to grow past its native size just because the
// viewport is wider, so scale only ever shrinks toward 0, capped at 1.
//
// `margin` reserves that many px on every side before fitting -- without
// it, whichever dimension binds (usually width) scales the card to exactly
// window.innerWidth/innerHeight, i.e. edge-to-edge with no visible gap.
// `maxScale` caps how big it's allowed to get even when the viewport has
// room to spare (default 1 = full native size). The standalone /login
// preview route (which wants the card to use all available space) leaves
// both at their defaults; LoginModal passes a real margin and a maxScale
// below 1 so the card reads as a modestly-sized centered popup over a
// visibly dimmed backdrop, not a full-bleed page, even on a big monitor.
export default function PopupScaleToFit({
  width,
  height,
  margin = 0,
  maxScale = 1,
  children,
}: {
  width: number;
  height: number;
  margin?: number;
  maxScale?: number;
  children: React.ReactNode;
}) {
  const [scale, setScale] = useState(maxScale);

  useEffect(() => {
    function update() {
      setScale(Math.min(maxScale, (window.innerWidth - margin * 2) / width, (window.innerHeight - margin * 2) / height));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [width, height, margin, maxScale]);

  return <div style={{ width, height, zoom: scale } as React.CSSProperties}>{children}</div>;
}
