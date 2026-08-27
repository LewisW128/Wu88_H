import { withBasePath } from "../lib/asset";
import TwinklingDots from "./TwinklingDots";

// Figma "Container_BG" component (Components Library node 755:9420,
// style=01_Container01). A full-bleed page hero background: 1728x1078,
// white, rounded top-left corner. Animations/container_01.mp4 is ~1.6:1,
// the same aspect ratio as this whole 1728x1078 container (not the narrow
// portrait "girl" sub-frame) -- it's an animated version of the entire
// background (glow blobs + character together), so it covers the full
// box exactly like the static photo it replaces, not layered as a small
// character cutout on top of a separate blobs-only image. The digital-dots
// cluster is layered on top, since Figma keeps it as a separate live
// element rather than flattening it into the background export.
export default function ContainerBg() {
  return (
    <div className="relative h-[1078px] w-[1728px] overflow-hidden rounded-tl-[60px] bg-white">
      <video
        src={withBasePath("/assets/container-bg/hero.mp4")}
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />

      <TwinklingDots className="pointer-events-none absolute left-[calc(50%+238.27px)] top-[82px] h-[361px] w-[378.536px] -translate-x-1/2" />

      {/* Covers the FULL container (`inset-0`), not a shorter band pinned
          to some `top` offset -- an earlier version's bug: shifting `top`
          up without also growing `height` left a gap of raw, unfaded
          video exposed between the band's bottom edge and the
          container's real bottom, showing through behind Hot Games'
          cards. Stop positions are plain percentages of the full 1078px
          height, so the covered range can't drift out of sync with the
          container's own size again.
          Four stops, not two: full character down to 40% (~y431,
          comfortably past the jacket), then a fade that's only 80% of
          the way to white by 68% (~y733, around her waist) so it stays
          partially visible there instead of already being fully gone,
          then a second, steeper ramp finishing at pure white by 71%
          (~y765) -- with a real margin before Hot Games' own top at 73%
          (y787, measured live) -- so that row's card cutouts still see
          clean white, not a partial tint. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 68%, white 71%)",
        }}
      />
    </div>
  );
}
