"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import GameSelections from "./GameSelections";
import PromotionCard, { type PromotionCardProps } from "./PromotionCard";

export type PromotionsCategory = {
  key: string;
  icon: string;
  label: string;
  promotions: (PromotionCardProps & { key: string })[];
};

export type PromotionsGridProps = {
  categories: PromotionsCategory[];
};

// Figma "Promotions" grid section (04_WU88-H-PC-Promotions node 106:10866):
// icon+"所有優惠" title, a 全部/新會員/VIP/體育/賭場 filter row (Game_selections,
// same component as Casino's category tabs), then a grid of PromotionCards
// in Figma's own mixed sizes (one Large + a run of Smalls). Figma only
// specifies content for the 全部 tab (the other four aren't shown selected
// anywhere in the file) -- 新會員/VIP/體育/賭場 below are this project's own
// reasonable-fit grouping of that same 全部 pool by each card's own copy
// (e.g. "新會員首儲" -> 新會員, "看世足賽" -> 體育), not a second Figma state.
//
// The mixed-width row (Large 594 + Smalls 297, gap-20, in a 1249px-wide
// flex-wrap) reproduces Figma's exact row breaks (3 cards / 4 cards / 3
// cards) without hand-splitting into row containers: 594+297+297+2 gaps
// already exceeds the width before a 4th item fits, so it wraps on its
// own, and the same falls out for the following rows -- verified against
// Figma's own per-row pixel widths (1228/1248/931).
export default function PromotionsGrid({ categories }: PromotionsGridProps) {
  const [active, setActive] = useState(categories[0]?.key);
  const activeCategory = categories.find((c) => c.key === active) ?? categories[0];

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={withBasePath("/assets/section-header/icon-promotions.svg")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">所有優惠</p>
      </div>

      <div className="flex items-center gap-[10px]">
        {categories.map((cat) => (
          <GameSelections key={cat.key} icon={cat.icon} label={cat.label} active={cat.key === active} onClick={() => setActive(cat.key)} />
        ))}
      </div>

      <div className="flex w-[1249px] flex-wrap items-start gap-[20px]">
        {activeCategory?.promotions.map(({ key, ...promo }) => (
          <PromotionCard key={key} {...promo} />
        ))}
      </div>
    </div>
  );
}
