"use client";

import { useEffect, useState } from "react";
import { useScale } from "./ScaleToFit";

// Design-space scroll distance (matching Container_BG's own 1078px height)
// over which this row fades from transparent to opaque white.
const FADE_DISTANCE = 900;

// Search/Language/Top_up need to be transparent at rest (they float over
// vivid hero art -- an opaque fill there cuts a hard white bar across the
// image) but opaque once scrolling has carried the hero away, so whatever
// comes up next (Hot Games, Form Bar) is hidden behind this row instead of
// showing through it. A binary switch at a single scroll threshold just
// relocates the hard-edge problem to whatever's crossing that threshold at
// the moment it flips, so this fades continuously with scroll progress
// instead -- by the time real content needs hiding, opacity has already
// climbed most of the way to solid.
export default function StickyUtilityBar({ children }: { children: React.ReactNode }) {
  const scale = useScale();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    function update() {
      const fadeDistancePx = FADE_DISTANCE * (scale || 1);
      setOpacity(Math.min(1, window.scrollY / fadeDistancePx));
    }
    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scale]);

  return (
    <div className="sticky top-[38px] z-10 flex items-center justify-between pt-[21px]">
      <div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity }} />
      <div className="relative flex w-full items-center justify-between">{children}</div>
    </div>
  );
}
