"use client";

import { useEffect, useState } from "react";

// Same `zoom`-based fit-to-viewport technique as ScaleToFit (see that
// component's own comment for why `zoom`, not `transform: scale`, keeps
// child layout/sticky math internally consistent at any scale) -- but for
// a modal's own fixed design size instead of the whole page's 1728px
// canvas, and without ScaleToFit's own "go fluid past 100%" behavior:
// a popup has no reason to grow past its native size just because the
// viewport is wider, so scale only ever shrinks toward 0, capped at 1.
export default function PopupScaleToFit({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      setScale(Math.min(1, window.innerWidth / width, window.innerHeight / height));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [width, height]);

  return <div style={{ width, height, zoom: scale } as React.CSSProperties}>{children}</div>;
}
