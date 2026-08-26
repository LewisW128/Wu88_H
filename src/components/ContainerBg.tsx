import { withBasePath } from "../lib/asset";

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

      <img
        alt=""
        src={withBasePath("/assets/container-bg/digital-dots.svg")}
        className="pointer-events-none absolute left-[calc(50%+238.27px)] top-[82px] h-[361px] w-[378.536px] -translate-x-1/2"
      />

      <div
        className="pointer-events-none absolute left-0 top-[243px] h-[835px] w-full"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 17.529%, white 81.023%)" }}
      />
    </div>
  );
}
