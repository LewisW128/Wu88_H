import { withBasePath } from "../lib/asset";
import TwinklingDots from "./TwinklingDots";

export type ContainerBgProps = {
  variant?: "home" | "casino" | "sport";
};

// The WU88 rainbow gradient (same palette as QuickLinks' border ring and
// every other gradient stroke in this design) used for the SPORTS
// headline's outline below.
const RAINBOW_STOPS: [number, string][] = [
  [0, "#01fab0"],
  [0.07, "#14e8b8"],
  [0.2, "#48bace"],
  [0.39, "#9a71f1"],
  [0.45, "#b65afd"],
  [0.68, "#8d54d8"],
  [0.88, "#6f4fbd"],
  [1, "#644eb3"],
];

// The SPORTS headline's raw stroke paint (fileKey wOq6yMa6VHpcmXudlTtqRj
// node 54:4599) is a GRADIENT_LINEAR, not the flat color get_design_context
// returns for it -- same flattening bug as QuickLinks' border and every
// other gradient this project has hit. Reproduced here as a real SVG
// <linearGradient> using Figma's own raw gradientTransform matrix
// (objectBoundingBox units) instead of collapsing it to one CSS angle: the
// box is a 973x242 rectangle, not square, so a single angle number can't
// reproduce an object-bounding-box gradient exactly the way the matrix
// does. Figma's 2x3 matrix is [[a,b,e],[c,d,f]] (x'=a·x+b·y+e); SVG's
// matrix(a,b,c,d,e,f) is x'=a·x+c·y+e -- so the middle two params swap
// positions when porting one to the other.
//
// Shared between SPORTS and CASINO -- CASINO's own Figma source has a flat
// white-50% fill, not a gradient outline, but per request its headline
// should now look the same as Sport's, so both render through this one
// component/gradient instead of keeping two near-duplicate treatments.
// Same 973x242 box and matrix for both: both strings are 6 characters at
// the same font-size/tracking/weight, so the derived-for-SPORTS geometry
// reads as the same intended treatment on CASINO too, not a mismatched one.
function GradientHeadline({ text, gradientId }: { text: string; gradientId: string }) {
  return (
    <svg
      viewBox="0 0 973 242"
      width={973}
      height={242}
      className="pointer-events-none absolute left-[174px] top-[197px]"
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="objectBoundingBox" gradientTransform="matrix(-0.9168286919593811, 0.17904022336006165, -0.18193991482257843, -0.08572134375572205, 0.942574679851532, 0.45118892192840576)">
          {RAINBOW_STOPS.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <text
        x="0"
        y="190"
        fill="rgba(255,255,255,0.5)"
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        fontSize={200}
        style={{ letterSpacing: "32px" }}
      >
        {text}
      </text>
    </svg>
  );
}

// Figma "Container_BG" component (Components Library node 755:9420,
// style=01_Container01 for the homepage, style=03_Casino for
// 02_WU88-H-PC-Casino node 122:6584, style=04_Sport for 03_WU88-H-PC-Sport
// node 54:5267). A full-bleed page hero background: 1728x1078, white,
// rounded top-left corner. All three variants share the same two large
// blurred glow-ellipse blobs positioned behind everything else.
//
// Home: reverted from the baked-together container_01.mp4 (glow blobs +
// character combined in one video) back to the same layered skeleton as
// Casino/Sport -- shared glow blobs underneath, character on top as its
// own element. The static character (home-hero-girl.png) is Wu88_v02's
// own pre-cutout "Style=01_Container01_girl" asset (1786x2092, real
// alpha) -- NOT extracted from the video or from Figma's "Event_girl02"
// raw image fill (that one's a rectangular studio photo with a dark
// gradient backdrop baked in; Figma only *displays* it cutout via a mask
// Figma applies on top, so exporting the raw fill pulls the un-masked
// rectangle, not an actual transparent PNG). Sized 893x1046 at
// left-629/top-32 -- that's the exact box the original Figma layer
// occupied (629.07,32.16, object-cover-fit into 893x1621, clipped by the
// container's own 1078px bottom edge), recomputed for this asset's own
// 0.8537 aspect ratio so the now-tightly-cropped cutout still lands in
// the same visual footprint the video's character occupied (verified by
// sampling the video frame's own non-white column/row bounds).
//
// Casino & Sport: same skeleton -- a giant tracked-out gradient-outline
// headline (GradientHeadline above; Figma's own Casino source actually has
// a flat white-50% fill, no gradient, but per request it now matches
// Sport's hollow-outline treatment instead) behind a hero figure that's an
// idle sway/smile-at-camera loop, not a still photo. Both generated with
// Higgsfield/Kling 3.0 from that variant's own still (Casino's WU88 dealer;
// Sport's the recurring WU88 catgirl character -- Catgirl character
// reference in memory) as the start_image, prompted on a locked-off camera
// so the framing and composition match the original photo exactly, just
// with motion added -- Casino's first prompt attempt read as sighing
// instead of swaying (open-mouth exhale expression), fixed by dropping
// "breathing" from the prompt and explicitly asking for a closed-mouth
// smile. Both play back as a background-position-stepped sprite sheet
// (casino-hero-sprite / sports-hero-sprite @keyframes in globals.css), not
// a <video> -- MP4/H.264 can't carry alpha, and both heroes need a
// transparent background to sit over the page like their original cutout
// photos did.
const SPRITE_FRAME_COUNT = 31;
const SPRITE_DURATION_S = SPRITE_FRAME_COUNT / 6;
const SPORTS_SPRITE_FRAME_W = 770;
const SPORTS_SPRITE_FRAME_H = 1096;
const CASINO_SPRITE_FRAME_W = 763;
const CASINO_SPRITE_FRAME_H = 1052;
const HOME_SPRITE_FRAME_W = 893;
const HOME_SPRITE_FRAME_H = 1046;
export default function ContainerBg({ variant = "home" }: ContainerBgProps) {
  const isCasino = variant === "casino";
  const isSport = variant === "sport";

  return (
    <div className="relative h-[1078px] w-[1728px] overflow-hidden rounded-tl-[60px] bg-white">
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

      {isCasino ? (
        <>
          <GradientHeadline text="CASINO" gradientId="casino-headline-stroke" />
          {/* Native frame res (816x1124) is close enough to this box's own
              763x1052 (both ~0.726 aspect) that stretching straight to the
              box size reads as object-cover would, without sports-hero's
              extra contain/centering wrapper. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[731px] top-[-8px]"
            style={{
              width: CASINO_SPRITE_FRAME_W,
              height: CASINO_SPRITE_FRAME_H,
              backgroundImage: `url(${withBasePath("/animation/casino-hero-sprite.webp")})`,
              backgroundSize: `${CASINO_SPRITE_FRAME_W * 6}px ${CASINO_SPRITE_FRAME_H * 6}px`,
              animation: `casino-hero-sprite ${SPRITE_DURATION_S}s steps(1, end) infinite`,
            }}
          />
        </>
      ) : isSport ? (
        <>
          <GradientHeadline text="SPORTS" gradientId="sports-headline-stroke" />
          {/* Outer box matches the original still photo's box exactly
              (bottom-[-18px]/left-[711px]/h-1096/w-877); centering a
              narrower fixed-size inner box inside it reproduces
              object-contain's own centering for a 804x1144-native frame
              that doesn't share the box's aspect ratio. */}
          <div className="pointer-events-none absolute bottom-[-18px] left-[711px] flex h-[1096px] w-[877px] items-center justify-center">
            <div
              aria-hidden
              style={{
                width: SPORTS_SPRITE_FRAME_W,
                height: SPORTS_SPRITE_FRAME_H,
                backgroundImage: `url(${withBasePath("/animation/sports-hero-sprite.webp")})`,
                backgroundSize: `${SPORTS_SPRITE_FRAME_W * 6}px ${SPORTS_SPRITE_FRAME_H * 6}px`,
                animation: `sports-hero-sprite ${SPRITE_DURATION_S}s steps(1, end) infinite`,
              }}
            />
          </div>
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute left-[629px] top-[32px]"
          style={{
            width: HOME_SPRITE_FRAME_W,
            height: HOME_SPRITE_FRAME_H,
            backgroundImage: `url(${withBasePath("/animation/home-hero-sprite.webp")})`,
            backgroundSize: `${HOME_SPRITE_FRAME_W * 6}px ${HOME_SPRITE_FRAME_H * 6}px`,
            animation: `home-hero-sprite ${SPRITE_DURATION_S}s steps(1, end) infinite`,
          }}
        />
      )}

      <TwinklingDots
        className={`pointer-events-none absolute top-[82px] h-[361px] w-[378.536px] -translate-x-1/2 ${
          isCasino ? "left-[calc(50%+158.27px)]" : isSport ? "left-[calc(50%+248.27px)]" : "left-[calc(50%+238.27px)]"
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
          clean white, not a partial tint. Both Casino's and Sport's own
          Figma gradient stops (15.131%/69.94%) are close enough to this
          same shape that reusing it keeps one gradient to maintain
          instead of three near-duplicates. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 68%, white 71%)",
        }}
      />
    </div>
  );
}
