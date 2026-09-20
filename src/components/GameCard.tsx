"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial from "./AnimatedArrowSpecial";

// Figma "Form" component (Components Library node 1:485). Layering, bottom
// to top: looping video -> dark shade (keeps the label legible against busy
// footage) -> digital-dots decoration -> label text. All of them are clipped
// together by the card's own shape -- rounded 25px on three corners, but
// the fourth (top-right) isn't a plain square cut, it curves inward to hug
// the Play button's own roundness. A simple `rounded-*` combo can't express
// that concave notch, so `cardClipPath` below traces it exactly (Figma's
// "Subtract" layer's own C/H/C/H/C segments), with the three plain corners
// rounded back in by hand to match the container's original
// rounded-bl/br/tl-[25px].

// Design-space size of Figma's own resting card; the width is only the
// MINIMUM now (see `GameCard`'s own comment).
const BASE_WIDTH = 161;
const BASE_HEIGHT = 184;

// The clip path is parametrized on the card's real (unscaled) width `w`:
// everything from the notch rightward is anchored to the RIGHT edge, so the
// notch keeps its exact size and position while the body stretches. At
// w=161 this is the original Figma path.
function cardClipPath(w: number) {
  const k = w - BASE_WIDTH;
  const x = (n: number) => +(n + k).toFixed(4);
  return `path("M${x(74.6678)},0 C${x(88.5263)},0 ${x(99.7607)},11.2345 ${x(99.7607)},25.0929 L${x(99.7607)},37.2459 C${x(99.7607)},51.1043 ${x(110.995)},62.3388 ${x(124.854)},62.3388 L${x(135.907)},62.3388 C${x(149.766)},62.3388 ${x(161)},73.5733 ${x(161)},87.4317 L${x(161)},159 A25,25 0 0 1 ${x(136)},184 L25,184 A25,25 0 0 1 0,159 L0,25 A25,25 0 0 1 25,0 Z")`;
}

// The gradient outline that goes with `cardClipPath` (Figma's own
// hover-border.svg, drawn in its 181x206.857 grown-size space and squeezed
// into the resting box). Same right-anchored shift, expressed in that
// space: the SVG's viewBox is widened by the same amount (converted by the
// 181/161 ratio) and then stretched back to the card's width.
const BORDER_SPACE = 181 / BASE_WIDTH;
function cardBorder(w: number) {
  const k = (w - BASE_WIDTH) * BORDER_SPACE;
  const x = (n: number) => +(n <= 30 ? n : n + k).toFixed(4);
  const d = `M28.21 1.5H${x(83.9434)}C${x(98.6949)} 1.50001 ${x(110.653)} 13.4585 ${x(110.653)} 28.21V41.873C${x(110.653)} 58.2812 ${x(123.955)} 71.5829 ${x(140.363)} 71.583H${x(152.79)}C${x(167.542)} 71.583 ${x(179.5)} 83.5414 ${x(179.5)} 98.293V178.647C${x(179.5)} 193.399 ${x(167.541)} 205.357 ${x(152.79)} 205.357H28.21C13.4586 205.357 1.50017 193.399 1.5 178.647V28.21C1.50004 13.4585 13.4585 1.50002 28.21 1.5Z`;
  return { d, viewWidth: 181 + k };
}

const BORDER_STOPS: [number, string][] = [
  [0, "#01FAB0"],
  [0.07, "#14E8B8"],
  [0.2, "#48BACE"],
  [0.39, "#9A71F1"],
  [0.45, "#B65AFD"],
  [0.68, "#8D54D8"],
  [0.88, "#6F4FBD"],
  [1, "#644EB3"],
];

// The card's own unscaled layout width, kept in state so the shapes above
// follow it as the card widens/narrows with the window. Uses the observer's
// fractional content box rather than `offsetWidth` (which rounds to whole px).
function useLayoutWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

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
// item's real size grows on hover (so the flex row actually reflows and
// neighbors shift apart to make room), while an INNER wrapper -- sized to
// the card's own UNGROWN width so the clip-path stays correct -- gets the
// `scale(1.124)` that makes the footage/dots/text/button all grow together
// as one image. Both use the same bottom-left transform-origin, so the card
// grows upward+rightward from its own bottom-left corner: upward keeps it
// from creeping into the row below (cards are bottom-aligned via
// `items-end`), rightward is the natural flex-reflow direction that pushes
// later siblings away.
//
// The width is FLEXIBLE now, not Figma's fixed 161: on a wider window every
// card grows equally (`flex-grow` from a zero basis, so the ratio between a
// hovered card and its neighbors is exactly the hover factor) with the
// row's gap held fixed, while 161px stays the minimum (a row too narrow for
// that keeps scrolling as before). Everything is derived from one
// transitionable `--card-grow` (globals.css: 1 at rest, 1.124 on hover), so
// flex-grow, min-width, height, the inner width and the scale all animate in
// lockstep. The video/image stays `object-cover`, so the footage keeps
// filling the frame at any width.
export default function GameCard({ video, image, mainText, subText, onMouseEnter, onMouseLeave }: GameCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const { ref: innerRef, width } = useLayoutWidth(BASE_WIDTH);
  const border = cardBorder(width);

  return (
    <div
      className="game-card group relative origin-bottom-left hover:z-10"
      style={{
        flex: "var(--card-grow) 1 0%",
        minWidth: `calc(${BASE_WIDTH}px * var(--card-grow))`,
        height: `calc(${BASE_HEIGHT}px * var(--card-grow))`,
      }}
      onMouseEnter={() => {
        videoRef.current?.play();
        setHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        const el = videoRef.current;
        if (el) {
          el.pause();
          el.currentTime = 0;
        }
        setHovered(false);
        onMouseLeave?.();
      }}
    >
      <div
        ref={innerRef}
        className="absolute bottom-0 left-0 origin-bottom-left"
        style={{ width: "calc(100% / var(--card-grow))", height: BASE_HEIGHT, scale: "var(--card-grow)" }}
      >
        {/* Only the footage/decoration/text share the notched clip -- the
            Play button sits in the notch itself, so it must live outside
            this clipped layer or the clip would cut the button off too. */}
        <div className="absolute inset-0" style={{ clipPath: cardClipPath(width) }}>
          {video ? (
            <video ref={videoRef} src={video} loop muted playsInline className="pointer-events-none absolute inset-0 size-full object-cover" />
          ) : (
            <img alt="" src={image} className="pointer-events-none absolute inset-0 size-full object-cover" />
          )}

          {/* A plain 25% black wash over the whole card: Figma's own
              subtract-shade.svg is this same fill cut to the notch outline,
              which the clip path above already does (and which would warp
              if that SVG were stretched to a wider card). */}
          <div className="pointer-events-none absolute inset-0 bg-black/25" />

          <img alt="" src={withBasePath("/assets/game-card/digital-dots.svg")} className="pointer-events-none absolute left-[20px] top-[20px] size-[218px]" />

          <div className="absolute left-[20px] top-[125px] flex flex-col items-start whitespace-nowrap tracking-[0.15px]">
            <p className="text-[14px] font-bold leading-[20px] text-white">{mainText}</p>
            <p className="text-[12px] leading-[18px] text-[#23f3d5]">{subText}</p>
          </div>
        </div>

        <svg
          aria-hidden
          width="100%"
          height="100%"
          viewBox={`0 0 ${border.viewWidth} 206.857`}
          preserveAspectRatio="none"
          fill="none"
          className="pointer-events-none absolute inset-0 overflow-visible opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <path d={border.d} stroke="url(#game-card-border)" strokeWidth={3} />
          <defs>
            <linearGradient id="game-card-border" x1={border.viewWidth / 2} y1={206.86} x2={border.viewWidth / 2} y2={-0.00152891} gradientUnits="userSpaceOnUse">
              {BORDER_STOPS.map(([offset, color]) => (
                <stop key={offset} offset={offset} stopColor={color} />
              ))}
            </linearGradient>
          </defs>
        </svg>

        <button
          type="button"
          aria-label={mainText}
          className="absolute -right-[0.3px] top-0 flex size-[47.029px] items-center justify-center rounded-full bg-[#f4f4f4] p-[9.406px] backdrop-blur-[9.406px] transition-colors duration-300 group-hover:bg-[#3e4140]"
        >
          <div className="relative size-[26.111px]">
            <AnimatedArrowSpecial hovered={!hovered} size={26.111} color="#3e4140" className="absolute inset-0" />
            <AnimatedArrowSpecial hovered={hovered} size={26.111} color="#23f3d5" className="absolute inset-0" />
          </div>
        </button>
      </div>
    </div>
  );
}
