"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial from "./AnimatedArrowSpecial";

export type SportBtnProps = {
  provider: string;
  image: string;
  /** The clipped "window" the athlete photo sits in -- Figma sizes/positions
   * this per-instance (a wider crop for WG's action shot, bottom-anchored
   * for AP/熊貓/LIVE vs top-anchored for SUPER), not one fixed box reused
   * across every provider. */
  windowStyle: React.CSSProperties;
  /** The photo's own box inside that window -- each real athlete photo has
   * its own natural crop/framing, so this isn't a uniform object-position. */
  imageStyle: React.CSSProperties;
};

// Figma "Sport BTN" (Components Library node 816:11504-11508, one instance
// per betting provider: SUPER/WG/AP/熊貓/LIVE) plus its hover state seen in
// context on 03_WU88-H-PC-Sport node 66:65131 (the WG instance there,
// 816:11986, is mid-hover). A light-gray, bordered pill (346x119) with a
// real athlete cutout photo overlapping its top edge, the project's
// digital-dots decoration behind it, and a provider label + dark Play
// button on the right. All 5 reference instances render the Play button
// in its dark "hover" look permanently (there's no lighter rest state
// among them), so the button's own bg/border never toggles -- only the
// arrow inside it draws on hover, same as News Banner/ProductCard/etc.
export default function SportBtn({ provider, image, windowStyle, imageStyle }: SportBtnProps) {
  const [hovered, setHovered] = useState(false);

  return (
    // `overflow-hidden` here isn't optional -- Figma's own outer container
    // (816:11504-11508) is `h-[169px] w-[346px] overflow-clip`. The athlete
    // window and the digital-dots decoration are BOTH sized/positioned to
    // extend past this box in raw coordinates (WG's window starts at
    // left:-23/top:-22.3; the dots graphic's own top:50/height:201.225 runs
    // to y:251, past the card's 169px height) -- clipped there by Figma's
    // own outer bound, not by their own component boundaries. Dropping
    // this leaves the athlete photo and dots bleeding into whatever real
    // page content sits above/below/beside this button.
    //
    // `shrink-0`: standalone this button always got its full 346px, so the
    // scratch preview it was first verified in never exercised this -- only
    // surfaced once these sit in SportsForm's real flex row, where the row
    // has less total width than 5 buttons need and a flex item shrinks by
    // default. Every internal piece here is absolutely positioned against
    // the authored 346px, so a shrunk card doesn't scale them down with it;
    // it just clips the same fixed-position photo/text/button against a
    // narrower box, reading as a squashed, overlapping mess.
    <div
      className="group relative h-[169px] w-[346px] shrink-0 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover swaps the gray border for teal and layers a soft radial
          teal glow over the flat gray fill. Figma's own hover version is
          an inline SVG radialGradient with a gradientTransform (matrix
          ≈[0,14.45,-42.014,0,173,59.5]) that maps a nominal r=10 circle
          into an ellipse centered on the pill (346/2, 119/2) with a
          144.5px vertical / 420px horizontal radius -- reproduced here as
          a plain CSS radial-gradient of that same derived ellipse size
          instead of embedding the raw SVG data URI, since the two render
          identically and this is far easier to read/maintain. The
          gradient is *layered over* the flat `bg-[#f4f4f4]` (background-
          image over background-color) rather than replacing it, so the
          transparent center of the glow still reads as the pill's own
          fill instead of flashing to bare white. */}
      <div
        className="absolute bottom-0 h-[119px] w-[346px] rounded-[25px] border border-[#a2a2a2] bg-[#f4f4f4] transition-[background-image,border-color,backdrop-filter] duration-300 group-hover:border-[#23f3d5] group-hover:backdrop-blur-[10px] group-hover:bg-[radial-gradient(ellipse_840px_289px_at_center,transparent_0%,rgba(145,249,234,0.5)_50%,rgba(90,246,223,0.75)_75%,rgba(62,244,218,0.875)_87.5%,#23f3d5_100%)]"
      />

      <div className="absolute overflow-clip" style={windowStyle}>
        {/* `max-w-none`: Tailwind's Preflight resets every `img` to
            `max-width: 100%`, which caps this photo at its *window's* own
            width (172px) regardless of the explicit, larger `width` this
            takes per-instance (SUPER's needs 337px so enough of the photo
            is visible before the window clips it) -- `max-width` composes
            with `width` rather than being overridden by it, inline style
            or not, so the photo silently rendered shrunk-to-fit and
            mispositioned without this. */}
        <img alt={provider} src={image} className="pointer-events-none absolute max-w-none object-cover" style={imageStyle} />
      </div>

      <img
        alt=""
        src={withBasePath("/item/sport-btn/digital-dots.svg")}
        className="pointer-events-none absolute left-0 top-[50px] h-[201.225px] w-[211px]"
      />

      {/* Left-anchored at a fixed offset, not grouped with the Play button
          in a right-anchored flex row -- "SUPER"/"WG"/"AP"/"熊貓"/"LIVE"
          are all different lengths, so right-anchoring the pair let the
          text's own left edge (where a reader's eye actually lands)
          drift per label while the Play button stayed flush right. Once
          several of these sit side by side that reads as misaligned.
          Fixed `left-[204px]` (Figma's own value for this text layer)
          keeps every label starting at the same x regardless of length. */}
      <p className="absolute left-[204px] top-[85px] whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#021128]">
        {provider}
        <br />
        <span className="text-[#23f3d5]">體育</span>
      </p>
      <div className="absolute right-[20px] top-[85px] flex size-[50px] items-center justify-center rounded-full border-[1.11px] border-[#f4f4f4] bg-[#3e4140] p-[10px] backdrop-blur-[10px]">
        <AnimatedArrowSpecial hovered={hovered} color="#23f3d5" />
      </div>
    </div>
  );
}
