import { withBasePath } from "../lib/asset";

export type BusinessCardProps = {
  logo: string;
  name: string;
};

// Figma "Business_Card" component (Components Library, inside node 737:8017
// "Business", Hover=off/on at node 754:8625). A partner-logo tile: light-gray
// rounded card, digital-dots decoration peeking from the bottom, logo
// top-left (contain-fit, since every partner mark is simple line art at a
// different native aspect ratio), name bottom-right. On hover, a
// lifehigh-brand gradient border and a pre-rendered purple/teal glow
// (Wu88_v02's own "Group 1096.png" -- already blurred and pre-cropped to
// the card's own 190x130 corner, so it just anchors flush at top-left) fade
// in, the glow behind the logo and the border on top of everything.
//
// The border is a pre-rendered SVG stroke (hover-border.svg), same
// technique as GameCard's "Form" hover border, rather than a CSS
// mask-composite ring: a thin CSS-masked ring reads noticeably less
// saturated than a real vector stroke once anti-aliasing blends it against
// the card underneath, which doesn't match Figma's own crisp rendering.
// The SVG's gradient reuses Form's exact stop offsets (0/.07/.2/.39/.45/
// .68/.88/1) but diagonal (top-left teal to bottom-right violet, via
// objectBoundingBox x1y1->x2y2 0,0->1,1) instead of Form's vertical one.
export default function BusinessCard({ logo, name }: BusinessCardProps) {
  return (
    <div className="group relative h-[130px] w-[346px] shrink-0 overflow-hidden rounded-[25px] bg-[#f4f4f4]">
      <img
        alt=""
        src={withBasePath("/assets/business/digital-dots.svg")}
        className="pointer-events-none absolute left-1/2 top-[calc(50%+93.5px)] h-[361px] w-[378.536px] -translate-x-1/2 -translate-y-1/2"
      />

      <img
        alt=""
        src={withBasePath("/assets/business/hover-glow.png")}
        className="pointer-events-none absolute left-0 top-0 hidden h-[130px] w-[190px] opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100"
      />

      <div className="absolute left-[18px] top-[9px] size-[108px]">
        <img alt={name} src={logo} className="size-full object-contain" />
      </div>

      <p className="absolute right-[18px] top-[47px] whitespace-nowrap text-right text-[20px] font-bold leading-[32px] tracking-[0.35px] text-[#021128]">
        {name}
      </p>

      <img
        alt=""
        src={withBasePath("/assets/business/hover-border.svg")}
        className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
}
