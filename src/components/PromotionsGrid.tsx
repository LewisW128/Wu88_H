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
// in Figma's own mixed sizes (one Large + a run of Smalls). Each tab's card
// set is passed in by the caller (see promotions/page.tsx) matching Figma's
// own per-tab states -- 5 separate frames in the file, one per highlighted
// tab (全部 106-10795, 新會員 109-12586, VIP 109-18635/109-16812, 體育
// 109-20768, 賭場 109-23711).
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

      {/* `w-full` with a `min-w-[1249px]` floor, not the Figma canvas's own
          fixed 1249px: on a wider window the extra room lets later cards
          wrap up into earlier rows instead of leaving them stranded below
          blank space. The floor is what keeps Figma's 3/4/3 row breaks at
          the canvas width -- the real column there comes out a few px under
          1249 (scrollbar, gutters), which would otherwise push a 4th small
          card (4 x 297 + 3 gaps = 1248) onto the next row and leave every
          row short with a stray card at the bottom. */}
      <div className="flex w-full min-w-[1249px] flex-wrap items-start gap-[20px]">
        {activeCategory?.promotions.map(({ key, ...promo }) => (
          <PromotionCard key={key} {...promo} />
        ))}
      </div>
    </div>
  );
}
