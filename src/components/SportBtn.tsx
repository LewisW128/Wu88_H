import { withBasePath } from "../lib/asset";

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
// per betting provider: SUPER/WG/AP/熊貓/LIVE). A light-gray, bordered pill
// (346x119) with a real athlete cutout photo overlapping its top edge, the
// project's digital-dots decoration behind it, and a provider label + dark
// Play button on the right. All 5 reference instances render the Play
// button in its dark "hover" look permanently (there's no lighter rest
// state among them), so that's just this component's one look rather than
// a hover toggle -- add one later if a rest-state design shows up.
export default function SportBtn({ provider, image, windowStyle, imageStyle }: SportBtnProps) {
  return (
    <div className="relative h-[169px] w-[346px]">
      <div className="absolute bottom-0 h-[119px] w-[346px] rounded-[25px] border border-[#a2a2a2] bg-[#f4f4f4]" />

      <div className="absolute overflow-clip" style={windowStyle}>
        <img alt={provider} src={image} className="pointer-events-none absolute object-cover" style={imageStyle} />
      </div>

      <img
        alt=""
        src={withBasePath("/item/sport-btn/digital-dots.svg")}
        className="pointer-events-none absolute left-0 top-[50px] h-[201.225px] w-[211px]"
      />

      <div className="absolute right-[20px] top-[85px] flex items-center gap-[20px]">
        <p className="whitespace-nowrap text-right text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#021128]">
          {provider}
          <br />
          <span className="text-[#23f3d5]">體育</span>
        </p>
        <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full border-[1.11px] border-[#f4f4f4] bg-[#3e4140] p-[10px] backdrop-blur-[10px]">
          <img alt="" src={withBasePath("/item/arrow-special-dark.svg")} className="size-[27.761px]" />
        </div>
      </div>
    </div>
  );
}
