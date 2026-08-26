import { withBasePath } from "../lib/asset";

export const DEFAULT_RING_COLOR =
  "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 34%, #b65afd 49%, #8d54d8 74%)";
const DEFAULT_BADGE_COLOR = "linear-gradient(-48deg, #01fab0 0%, #14e8b8 0%, #48bace 11%, #9a71f1 60%)";

// Ring thickness is a fixed 2px regardless of avatar size, not scaled.
const RING_THICKNESS = 2;

export type AvatarProps = {
  photo: string;
  size?: number;
  badge?: boolean;
  ringColor?: string;
  badgeColor?: string;
};

// Figma "Avatar" component (Components Library node 82:2048, property1=VIP).
// Base size is 34px, but Figma reuses this same proportions at 50px inside
// Rank_section -- badge and icon sizes scale with it (badge ~35.44% of the
// avatar, icon ~25.42%), matching Rank_section's own literal 50px instance
// (badge ~17.7px, icon 12.712px) exactly.
//
// Ring and badge take independent colors (each a solid hex or CSS gradient
// string) -- they're tuned separately, not one shared gradient. Win List
// rows pass the same level color to both so the avatar matches the level
// badge, but that's a caller choice, not something baked in here. The ring
// itself is a plain circle mask-cut into a ring shape rather than the
// original static SVG, so it can carry any color/gradient passed in.
export default function Avatar({ photo, size = 34, badge = true, ringColor = DEFAULT_RING_COLOR, badgeColor = DEFAULT_BADGE_COLOR }: AvatarProps) {
  const badgeSize = size * (12.05 / 34);
  const iconSize = size * (8.644 / 34);
  const ringMask = `radial-gradient(circle closest-side, transparent calc(100% - ${RING_THICKNESS}px), black calc(100% - ${RING_THICKNESS}px))`;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <img alt="" src={photo} className="pointer-events-none absolute inset-0 size-full rounded-full object-cover" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: ringColor, maskImage: ringMask, WebkitMaskImage: ringMask }}
        />
      </div>

      {badge && (
        <div
          className="absolute bottom-0 right-0 flex items-center justify-center overflow-hidden rounded-full"
          style={{ width: badgeSize, height: badgeSize, background: badgeColor }}
        >
          <img alt="" src={withBasePath("/assets/avatar/badge-icon.svg")} style={{ width: iconSize, height: iconSize }} />
        </div>
      )}
    </div>
  );
}
