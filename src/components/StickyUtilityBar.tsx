"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SENTINEL_ID = "hero-zone-end-sentinel";

// Whether the hero-associated zone (hero art, Form Bar, Hot Games) has
// scrolled past this row. Exposed via context rather than a render-prop
// on `children`: page.tsx is a Server Component, and passing a function
// as a prop into a Client Component from server-rendered JSX isn't
// allowed (functions can't cross that boundary) -- context lets Top_up
// read this value itself without page.tsx needing to call anything.
// Defaults to `true` so a consumer rendered outside this provider (e.g.
// Top_up used on its own, elsewhere) still looks right -- opaque, not
// stuck assuming it's still sitting over hero art.
const HeroZoneContext = createContext(true);

export function useHeroZonePassed() {
  return useContext(HeroZoneContext);
}

// Search/Language/Top_up need to be transparent while the hero-associated
// content (the hero art itself, Form Bar, Hot Games -- all overlapping
// Container_BG's own art) is still directly behind them: an opaque fill
// there cuts a hard white bar across vivid artwork. But once scrolling has
// carried that whole zone away, transparent would let whatever comes up
// next (General Games, etc.) show/bleed through this row instead of being
// hidden behind it, per spec.
//
// A *continuous* fade between those two states (this component's earlier
// version) sounds like a compromise but is actually worse than either
// pure state: partway through the fade, this row sits over Form Bar/Hot
// Games at, say, 50% white opacity -- a washed-out translucent smear
// across game art that's scrolling right past it, for the entire
// multi-hundred-pixel scroll distance of that transition. There's no
// opacity value that looks right for that moment; the fix is to not pass
// through it. A sentinel dropped exactly where the hero-associated zone
// ends (see page.tsx) flips this row instantly, with no CSS transition --
// so it's always either cleanly transparent (art shows through crisply)
// or cleanly opaque (content is fully hidden), never the smear in between.
//
// Top_up's own pill background doesn't have that problem -- unlike this
// row's full-width fill, it's one small, self-contained shape in the
// corner, not a bar stretched edge-to-edge across other cards' art. It
// reads `useHeroZonePassed()` itself (see HeroZoneContext above) and
// fades its pill smoothly instead of matching this row's instant,
// transition-free flip.
export default function StickyUtilityBar({ children }: { children: React.ReactNode }) {
  const [heroZonePassed, setHeroZonePassed] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(SENTINEL_ID);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroZonePassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-[38px] z-10 flex items-center justify-between pt-[21px]">
      {heroZonePassed && <div className="pointer-events-none absolute inset-0 bg-white" />}
      <div className="relative flex w-full items-center justify-between">
        <HeroZoneContext.Provider value={heroZonePassed}>{children}</HeroZoneContext.Provider>
      </div>
    </div>
  );
}

export function HeroZoneEndSentinel() {
  return <div id={SENTINEL_ID} className="h-0" />;
}
