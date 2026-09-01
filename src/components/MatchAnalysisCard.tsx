"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial from "./AnimatedArrowSpecial";

export type MatchAnalysisCardProps = {
  image: string;
  title: string;
  date: string;
  excerpt: string;
};

// Figma "Match analysis" (03_WU88-H-PC-Sport node 66:20550, seen live in
// the 賽事分析 grid at 54:5338, hover state seen live at 66:72796). A light
// card: a small dark thumbnail, then a headline (single line, ellipsis-
// truncated) with the same teal "verified" checkmark as News Banner, a
// timestamp, and a 3-line excerpt. Figma clips the excerpt to a fixed 57px
// box across possibly-2-or-3 `<p>` paragraphs, which isn't real
// ellipsis-able CSS -- `line-clamp-3` on the joined text reproduces the
// same "long excerpt, visibly cut off" intent with a real ellipsis instead
// of a hard mid-line clip.
//
// Hover swaps the flat gray fill for a white card with a light-gray
// outline (a permanent transparent border avoids the box growing when
// that outline appears), and grows the card to reveal a share + Play
// button pair bottom-right. This one genuinely changes height on hover
// -- confirmed against both node ids, not assumed: the default grid at
// 54:5338 has every "Match analysis" instance at exactly 146.452px
// (20+106.452+20, no button row at all), while the hover instance at
// 66:72796 is 215.45px (20+106.452+19+50+20, the button row's height
// plus its own 19px gap both present). Growing the card's own in-flow
// box like this only pushes down what comes *after* it in normal flow
// -- safe here specifically because SportsMachAnalysis stacks each
// column as its own independent `flex-col` rather than a CSS grid, so
// "what comes after" is only the cards below it in the same column, not
// a shared grid row that would also drag the other column's sibling
// down. Animating a flex child's `height` needs an explicit 0 -> 50px
// target (not `auto`), and a collapsed flex child still reserves its
// parent's `gap` on both sides even at height 0 -- so the row's own
// `mt`, not the column's `gap`, carries the 19px so it collapses to
// nothing at rest instead of leaving a phantom 19px slot. `overflow-
// hidden` on the row keeps the buttons from spilling out while
// collapsed. The Play button's arrow doesn't exist on the card at rest
// at all -- same "draws on" AnimatedArrowSpecial treatment as News
// Banner's own Arrow_Special, not a flat fade-in.
//
// `onHoverChange` is SportsMachAnalysis's doing, not Figma's: it needs
// to know *which* card in a column is hovered so it can fade the
// column's opposite edge (see its own comment) once this card's growth
// pushes the column past its designed height.
export default function MatchAnalysisCard({
  image,
  title,
  date,
  excerpt,
  onHoverChange,
}: MatchAnalysisCardProps & { onHoverChange?: (hovered: boolean) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group flex w-full shrink-0 flex-col items-end rounded-[25px] border-2 border-transparent bg-[#f4f4f4] p-[20px] transition-colors duration-300 hover:border-[#f4f4f4] hover:bg-white"
      onMouseEnter={() => {
        setHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverChange?.(false);
      }}
    >
      <div className="flex w-full items-start gap-[15px]">
        <div className="h-[106.452px] w-[169px] shrink-0 overflow-hidden rounded-[15px] bg-[#3e4140]">
          <img alt="" src={withBasePath(image)} className="pointer-events-none size-full object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
          <div className="flex w-full items-center gap-[5px]">
            <img alt="" src={withBasePath("/icon/sports-news-subtract.png")} className="size-[12px] shrink-0" />
            <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">
              {title}
            </p>
          </div>
          <p className="whitespace-nowrap text-[10px] font-medium leading-[18px] tracking-[0.15px] text-[#dadada]">{date}</p>
          <p className="line-clamp-3 w-full text-[12px] leading-[18px] tracking-[0.15px] text-[#b2b2b2]">{excerpt}</p>
        </div>
      </div>

      <div className="mt-0 flex h-0 shrink-0 items-center gap-[10px] overflow-hidden transition-[height,margin-top] duration-300 group-hover:mt-[19px] group-hover:h-[50px]">
        <button
          type="button"
          aria-label="share"
          className="flex size-[50px] shrink-0 items-center justify-center rounded-full border border-[#f4f4f4] bg-white/80 backdrop-blur-[2px]"
        >
          <img alt="" src={withBasePath("/assets/sports-match/share-icon.svg")} className="size-[25px]" />
        </button>
        <button
          type="button"
          aria-label="read more"
          className="flex size-[50px] shrink-0 items-center justify-center rounded-full border-[1.11px] border-[#f4f4f4] bg-[#3e4140] backdrop-blur-[10px]"
        >
          <AnimatedArrowSpecial hovered={hovered} color="#23f3d5" />
        </button>
      </div>
    </div>
  );
}
