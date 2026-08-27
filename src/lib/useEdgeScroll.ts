"use client";

import { useEffect, useRef, useState } from "react";

export type EdgeScroll = {
  left: boolean;
  right: boolean;
};

// Shared by every horizontally-scrolling row with a Left&Right nav pair
// (Hot Games, Business, General Games, Promotions): tracks which edges
// still have more content past them, so a caller can both drive its own
// fade mask and know when the row doesn't overflow its container at all
// (`!canScroll.left && !canScroll.right`, since with nothing to scroll to
// in either direction `canScroll.right` never goes true even at rest) --
// that's the signal for hiding a section's own "更多"/nav controls
// entirely rather than just disabling them.
export function useEdgeScroll<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  const [canScroll, setCanScroll] = useState<EdgeScroll>({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScroll({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1,
      });
    }

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  function scrollByStep(step: number) {
    ref.current?.scrollBy({ left: step, behavior: "smooth" });
  }

  return { ref, canScroll, scrollByStep };
}
