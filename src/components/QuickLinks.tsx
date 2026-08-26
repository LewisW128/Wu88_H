import { withBasePath } from "../lib/asset";

const LINKS = ["賭場", "體育", "會員中心"];

// Figma "Frame 1277": three outlined pill shortcuts sitting beside the
// footer, each a label plus the same diagonal Arrow_Special glyph used on
// every card's play button elsewhere in this design.
export default function QuickLinks() {
  return (
    <div className="flex items-center gap-[10px]">
      {LINKS.map((label) => (
        <button
          key={label}
          type="button"
          className="flex w-[120px] items-center justify-between rounded-[15px] border border-[#01fab0] px-[10px] py-[5px]"
        >
          <p className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[0.15px] text-[#3e4140]">{label}</p>
          <img alt="" src={withBasePath("/assets/product-card/arrow-special.svg")} className="size-[25px]" />
        </button>
      ))}
    </div>
  );
}
