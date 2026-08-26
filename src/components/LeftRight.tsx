import { withBasePath } from "../lib/asset";

export type LeftRightProps = {
  /** Defaults preserve this pair's original static look (left disabled,
   * right active) for callers that don't track real scroll position. */
  canLeft?: boolean;
  canRight?: boolean;
  onLeft?: () => void;
  onRight?: () => void;
};

// arrow-general.svg (gray) points LEFT by default, arrow-general-active.svg
// (teal) points RIGHT by default -- same asset pair/quirk as Business's own
// nav buttons, so picking the asset by active-state and flipping it when
// that asset's own baked-in direction doesn't match the button's actual
// direction is the same fix here.
function NavButton({ direction, active, onClick }: { direction: "left" | "right"; active: boolean; onClick?: () => void }) {
  const assetDefaultDirection = active ? "right" : "left";
  const needsFlip = direction !== assetDefaultDirection;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!active}
      aria-label={direction === "left" ? "previous" : "next"}
      className={`flex h-[32.4px] items-center justify-center rounded-[36px] p-[7.2px] backdrop-blur-[7.2px] transition-colors disabled:cursor-default ${
        active ? "bg-[#3e4140]" : "bg-[#f4f4f4]"
      }`}
    >
      <img
        alt=""
        src={withBasePath(active ? "/assets/section-header/arrow-general-active.svg" : "/assets/section-header/arrow-general.svg")}
        className={`size-[18px] ${needsFlip ? "rotate-180" : ""}`}
      />
    </button>
  );
}

// Figma "Left&Right" pair (Components Library node 951:94803/951:94805) used
// beside every section's "更多" tag. Each side's own enabled/disabled look
// now follows real scroll state (`canLeft`/`canRight`) instead of the left
// button always rendering gray/disabled and the right button always
// rendering active -- the same scroll-aware pattern Business's own nav
// buttons already use.
export default function LeftRight({ canLeft = false, canRight = true, onLeft, onRight }: LeftRightProps) {
  return (
    <div className="flex items-center gap-[5px]">
      <NavButton direction="left" active={canLeft} onClick={onLeft} />
      <NavButton direction="right" active={canRight} onClick={onRight} />
    </div>
  );
}
