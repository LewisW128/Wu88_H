import { withBasePath } from "../lib/asset";
import TwinklingDots from "./TwinklingDots";

export type ContainerBgProps = {
  variant?: "home" | "casino";
};

// Figma "Container_BG" component (Components Library node 755:9420,
// style=01_Container01 for the homepage, style=03_Casino for
// 02_WU88-H-PC-Casino node 122:6584). A full-bleed page hero background:
// 1728x1078, white, rounded top-left corner. Both variants share the same
// two large blurred glow-ellipse blobs positioned behind everything else.
//
// Home: Animations/container_01.mp4 is ~1.6:1, the same aspect ratio as
// this whole 1728x1078 container (not the narrow portrait "girl"
// sub-frame) -- it's an animated version of the entire background (glow
// blobs + character together), so it covers the full box exactly like the
// static photo it replaces, not layered as a small character cutout on
// top of a separate blobs-only image. Its own glow blobs are baked into
// the video, so the shared ones below render underneath/hidden for it.
//
// Casino: Figma only has a still "Dealer 1" photo + a "CASINO" giant
// tracked-out headline behind it -- no video, no Figma-native motion
// (checked via get_motion_context, nothing timed on this node). The user
// asked for the hero's real motion asset to live at /public/animation;
// until that's supplied this renders the same still photo, saved there as
// a placeholder so swapping in a real clip later is a one-line change.
export default function ContainerBg({ variant = "home" }: ContainerBgProps) {
  const isCasino = variant === "casino";

  return (
    <div className="relative h-[1078px] w-[1728px] overflow-hidden rounded-tl-[60px] bg-white">
      {isCasino && (
        <>
          <div className="pointer-events-none absolute left-[867px] top-[176px] size-[764px]">
            <div className="absolute inset-[-13.09%]">
              <img alt="" src={withBasePath("/assets/container-bg/glow-ellipse-1.svg")} className="block size-full max-w-none" />
            </div>
          </div>
          <div className="pointer-events-none absolute left-[789px] top-[54px] size-[366px]">
            <div className="absolute inset-[-27.32%]">
              <img alt="" src={withBasePath("/assets/container-bg/glow-ellipse-2.svg")} className="block size-full max-w-none" />
            </div>
          </div>
        </>
      )}

      {isCasino ? (
        <>
          <p
            className="pointer-events-none absolute left-[174px] top-[197px] whitespace-nowrap text-[200px] font-bold tracking-[32px] text-white/50"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            CASINO
          </p>
          <img
            alt=""
            src={withBasePath("/animation/casino-hero-dealer.png")}
            className="pointer-events-none absolute left-[731px] top-[-8px] h-[1052px] w-[763px] object-cover"
          />
        </>
      ) : (
        <video
          src={withBasePath("/assets/container-bg/hero.mp4")}
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      )}

      <TwinklingDots
        className={`pointer-events-none absolute top-[82px] h-[361px] w-[378.536px] -translate-x-1/2 ${
          isCasino ? "left-[calc(50%+158.27px)]" : "left-[calc(50%+238.27px)]"
        }`}
      />

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
          clean white, not a partial tint. The Casino variant's own Figma
          gradient stops (15.131%/69.94%) are close enough to this same
          shape that reusing it keeps one gradient to maintain instead of
          two near-duplicates. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 68%, white 71%)",
        }}
      />
    </div>
  );
}
