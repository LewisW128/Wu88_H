import { withBasePath } from "../lib/asset";
import ProductCard, { type ProductCardProps } from "./ProductCard";

export type RankedProductCardProps = ProductCardProps & {
  rank: "00" | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10";
};

// Figma "Rank" component (Components Library node 19:439, style=Small).
// Products S sits top-right over a big outlined rank numeral peeking out
// from the bottom-left corner. Rank "10" is a wider variant (its two-digit
// numeral is exported at 350px instead of every other rank's 175px), so the
// whole card widens to 473px to give it room instead of squeezing it down.
export default function RankedProductCard({ rank, ...productProps }: RankedProductCardProps) {
  const isWide = rank === "10";
  return (
    <div className={`relative h-[292px] shrink-0 overflow-clip ${isWide ? "w-[473px]" : "w-[297px]"}`}>
      <img
        alt=""
        src={withBasePath(`/item/number=${rank}.svg`)}
        className={`pointer-events-none absolute bottom-0 left-0 h-[231px] ${isWide ? "w-[350px]" : "w-[175px]"}`}
      />
      <div className="absolute right-0 top-0">
        <ProductCard {...productProps} />
      </div>
    </div>
  );
}
