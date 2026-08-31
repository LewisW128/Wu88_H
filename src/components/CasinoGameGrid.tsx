"use client";

import { useState } from "react";
import GameSelections from "./GameSelections";
import ProductCard, { type ProductCardProps } from "./ProductCard";

export type CasinoCategory = {
  key: string;
  icon: string;
  activeIcon: string;
  label: string;
  games: ProductCardProps[];
};

export type CasinoGameGridProps = {
  categories: CasinoCategory[];
};

// Figma "Frame 1296": the category tab row (Frame 1295) plus its grid
// (Frame 1294) below. Each of the 6 named-category tabs has its own
// distinct set of Products in Figma (02_WU88-H-PC-Casino nodes
// 133:15752/19563/22710/25553, 136:81084/83473) -- not the same 20 cards
// re-filtered -- so this owns the active-tab state and swaps the whole
// grid's content, rather than just re-styling a shared static list.
export default function CasinoGameGrid({ categories }: CasinoGameGridProps) {
  const [active, setActive] = useState(categories[0]?.key);
  const activeCategory = categories.find((c) => c.key === active) ?? categories[0];

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center gap-[10px]">
        {categories.map((cat) => (
          <GameSelections
            key={cat.key}
            icon={cat.icon}
            activeIcon={cat.activeIcon}
            label={cat.label}
            active={cat.key === active}
            onClick={() => setActive(cat.key)}
          />
        ))}
        {/* The trailing icon-only button (Figma's last "Game_selections"
            instance, no label) is hidden for now -- its behavior hasn't
            been decided yet, per the user. Re-add with an onClick once
            that's settled. */}
      </div>

      <div className="grid grid-cols-5 gap-[20px]">
        {activeCategory?.games.map((game, i) => (
          <ProductCard key={`${activeCategory.key}-${i}`} {...game} />
        ))}
      </div>
    </div>
  );
}
