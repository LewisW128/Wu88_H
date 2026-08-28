import { withBasePath } from "../lib/asset";

const LINKS = ["賭場", "體育", "會員中心"];

// Figma node 900:9523's stroke is the WU88 rainbow (the same gradient as
// Avatar/ProductLabel's badge ring), not a flat teal -- get_design_context
// flattens it to one color, the same way it silently drops other
// gradient/image fills. Reading the raw stroke paint off the node gives
// gradientTransform [[-0.3576,-0.0243,0.5008],[0.0239,-0.0195,0.4976]] on
// this 120x37 node; converting that to a CSS angle and checking it against
// a live render (teal top-left sweeping to purple bottom-right, matching
// Figma's own screenshot of this node) confirms ~89deg, a near-horizontal
// sweep rather than the ~-27/-48deg used elsewhere for this same palette.
const BORDER_GRADIENT =
  "linear-gradient(89deg, #01fab0 0%, #14e8b8 7%, #48bace 20%, #9a71f1 39%, #b65afd 45%, #8d54d8 68%, #6f4fbd 88%, #644eb3 100%)";

// Figma "Frame 1277": three pill shortcuts, each a label plus the same
// diagonal Arrow_Special glyph used on every card's play button elsewhere
// in this design. The border is a gradient, so a plain Tailwind
// `border-[color]` can't express it -- built instead as two stacked
// backgrounds (a solid white fill clipped to the padding box, the
// gradient clipped to the border box, real border made transparent),
// since `border-image` would work color-wise but ignores `border-radius`
// entirely and square off this pill's rounded corners.
export default function QuickLinks() {
  return (
    <div className="flex items-center gap-[10px]">
      {LINKS.map((label) => (
        <button
          key={label}
          type="button"
          className="flex w-[120px] items-center justify-between rounded-[15px] border border-transparent px-[10px] py-[5px]"
          style={{ background: `linear-gradient(white, white) padding-box, ${BORDER_GRADIENT} border-box` }}
        >
          <p className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[0.15px] text-[#3e4140]">{label}</p>
          <img alt="" src={withBasePath("/assets/product-card/arrow-special.svg")} className="size-[25px]" />
        </button>
      ))}
    </div>
  );
}
