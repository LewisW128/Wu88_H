"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";

export type NewsBannerProps = {
  image: string;
  caption: string;
};

// Figma "Arrow_Special" (the same diagonal "open" arrow used by Tag/
// QuickLinks/SportBtn's Play button elsewhere) is really just two paths:
// a corner bracket ("Rectangle 25", an H+V stroke forming the arrowhead)
// and a diagonal stroke ("Line 25", the shaft). The hover reference (node
// 66:66589's 2nd card) shows this appearing top-right on hover -- the user
// asked for it to draw on rather than just appear, corner first then
// shaft, using this exact path data rather than a new asset.
//
// `pathLength={1}` normalizes both paths to a length of 1 regardless of
// their real geometry, so `strokeDasharray:1` + animating
// `strokeDashoffset` 1→0 draws the whole path from start to end without
// having to hand-measure each path's actual pixel length.
function AnimatedArrowSpecial({ hovered }: { hovered: boolean }) {
  return (
    <svg
      viewBox="0 0 27.7607 27.7607"
      width={27.761}
      height={27.761}
      fill="none"
      className="pointer-events-none absolute right-[20.1px] top-[22px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.9457 9.02633H8.23761V18.7344"
        stroke="#23F3D5"
        strokeWidth={2.22086}
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: hovered ? 0 : 1,
          transition: "stroke-dashoffset 200ms ease-out",
        }}
      />
      <path
        d="M8.36635 9.18336L17.7887 18.6057"
        stroke="#23F3D5"
        strokeWidth={2.22086}
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: hovered ? 0 : 1,
          transition: "stroke-dashoffset 200ms ease-out 200ms",
        }}
      />
    </svg>
  );
}

// Figma "News Banner" (03_WU88-H-PC-Sport node 66:59454, seen in the
// 體育新聞 row at 54:5337). A dark rounded card with a full-bleed photo and
// a blurred dark-gradient caption bar pinned to the bottom.
//
// The photo isn't a plain `inset-0 object-cover` -- Figma's own photo box
// is deliberately larger than the card (450.287x300.192 inside a
// 404.287x241.945 card) and vertically centered rather than top-aligned,
// which zooms/crops the image differently than letting object-cover fit
// the card's own bounds would. The caption bar is a FIXED 66px band
// (top:176px in a 241.945px-tall card, i.e. flush to the bottom), not an
// auto-height box grown from padding -- getting this wrong was the actual
// spec bug: padding-driven height let 2 lines of caption text push the
// band taller than Figma's 66px and drift its top edge up the photo.
export default function NewsBanner({ image, caption }: NewsBannerProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative h-[241.945px] w-[404.287px] shrink-0 overflow-hidden rounded-[25px] bg-[#3e4140]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        alt=""
        src={withBasePath(image)}
        className="pointer-events-none absolute left-0 top-1/2 h-[300.192px] w-[450.287px] -translate-y-1/2 object-cover"
      />
      <div
        className="absolute bottom-0 left-0 h-[66px] w-full overflow-hidden"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 121.19%)", backdropFilter: "blur(10px)" }}
      >
        <div className="absolute left-[20px] top-[10px] flex w-[229px] items-start gap-[10px]">
          <img alt="" src={withBasePath("/icon/sports-news-subtract.png")} className="mt-[4px] size-[12px] shrink-0" />
          <p className="line-clamp-2 h-[40px] overflow-hidden text-ellipsis text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">
            {caption}
          </p>
        </div>
        <AnimatedArrowSpecial hovered={hovered} />
      </div>
    </div>
  );
}
