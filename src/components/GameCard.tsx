"use client";

import { useRef } from "react";
import { withBasePath } from "../lib/asset";

// Figma "Form" component (Components Library node 1:485). Layering, bottom
// to top: looping video -> dark "Subtract" shade (keeps the label legible
// against busy footage) -> digital-dots decoration -> label text. All four
// are clipped together by the card's own shape -- rounded 25px on three
// corners, but the fourth (top-right) isn't a plain square cut, it curves
// inward to hug the Play button's own roundness. A simple `rounded-*` combo
// can't express that concave notch. Figma's "Subtract" layer traces the
// notch curve exactly (reused verbatim below, the C/H/C/H/C segments) but
// is otherwise a bare rectangle with sharp corners everywhere else -- it
// was only ever meant as the shade's own boundary, not the card's, so the
// three plain corners are rounded back in by hand to match the container's
// original rounded-bl/br/tl-[25px].
const CARD_CLIP_PATH =
  'path("M74.6678,0 C88.5263,0 99.7607,11.2345 99.7607,25.0929 L99.7607,37.2459 C99.7607,51.1043 110.995,62.3388 124.854,62.3388 L135.907,62.3388 C149.766,62.3388 161,73.5733 161,87.4317 L161,159 A25,25 0 0 1 136,184 L25,184 A25,25 0 0 1 0,159 L0,25 A25,25 0 0 1 25,0 Z")';

export type GameCardProps = {
  video?: string;
  image?: string;
  mainText: string;
  subText: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

// Hover state (node 670:6505, "state=on") renders the same card ~12.4%
// larger (181x206.857 vs 161x184) with a teal-to-purple gradient border and
// an inverted Play button (dark bg + teal icon instead of light bg + dark
// icon).
//
// Growing via a bare `transform: scale()` on the flex item itself doesn't
// touch layout at all -- neighbors never move, so in a tightly-packed row
// (Form Bar) the enlarged card just overlaps whatever's beside/above/below
// it and gets clipped by any ancestor's overflow. Instead, the OUTER flex
// item's real width/height grows on hover (so the flex row actually
// reflows and neighbors shift apart to make room), while an INNER wrapper
// -- fixed at the original 161x184 box so the pixel-coordinate clip-path
// stays correct -- gets the `scale(1.124)` that makes the footage/dots/
// text/button all grow together as one image. Both use the same
// bottom-left transform-origin, so the card grows upward+rightward from
// its own bottom-left corner: upward keeps it from creeping into the row
// below (cards are bottom-aligned via `items-end`), rightward is the
// natural flex-reflow direction that pushes later siblings away.
export default function GameCard({ video, image, mainText, subText, onMouseEnter, onMouseLeave }: GameCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="group relative h-[184px] w-[161px] shrink-0 origin-bottom-left transition-[width,height] duration-300 ease-out hover:z-10 hover:h-[206.816px] hover:w-[180.964px]"
      onMouseEnter={() => {
        videoRef.current?.play();
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        const el = videoRef.current;
        if (el) {
          el.pause();
          el.currentTime = 0;
        }
        onMouseLeave?.();
      }}
    >
      <div className="absolute bottom-0 left-0 h-[184px] w-[161px] origin-bottom-left transition-transform duration-300 ease-out group-hover:scale-[1.124]">
        {/* Only the footage/decoration/text share the notched clip -- the
            Play button sits in the notch itself, so it must live outside
            this clipped layer or the clip would cut the button off too. */}
        <div className="absolute inset-0" style={{ clipPath: CARD_CLIP_PATH }}>
          {video ? (
            <video ref={videoRef} src={video} loop muted playsInline className="pointer-events-none absolute inset-0 size-full object-cover" />
          ) : (
            <img alt="" src={image} className="pointer-events-none absolute inset-0 size-full object-cover" />
          )}

          <img alt="" src={withBasePath("/assets/game-card/subtract-shade.svg")} className="pointer-events-none absolute inset-0 size-full" />

          <img alt="" src={withBasePath("/assets/game-card/digital-dots.svg")} className="pointer-events-none absolute left-[20px] top-[20px] size-[218px]" />

          <div className="absolute left-[20px] top-[125px] flex flex-col items-start whitespace-nowrap tracking-[0.15px]">
            <p className="text-[14px] font-bold leading-[20px] text-white">{mainText}</p>
            <p className="text-[12px] leading-[18px] text-[#23f3d5]">{subText}</p>
          </div>
        </div>

        <img
          alt=""
          src={withBasePath("/assets/game-card/hover-border.svg")}
          className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <button
          type="button"
          aria-label={mainText}
          className="absolute -right-[0.3px] top-0 flex size-[47.029px] items-center justify-center rounded-full bg-[#f4f4f4] p-[9.406px] backdrop-blur-[9.406px] transition-colors duration-300 group-hover:bg-[#3e4140]"
        >
          <img alt="" src={withBasePath("/assets/game-card/arrow-special.svg")} className="size-[26.111px] group-hover:hidden" />
          <img alt="" src={withBasePath("/assets/game-card/arrow-special-hover.svg")} className="hidden size-[26.111px] group-hover:block" />
        </button>
      </div>
    </div>
  );
}
