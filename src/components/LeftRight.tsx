import { withBasePath } from "../lib/asset";

export type LeftRightProps = {
  onLeft?: () => void;
  onRight?: () => void;
};

function NavButton({ active, label, onClick }: { active: boolean; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-[32.4px] items-center justify-center rounded-[36px] p-[7.2px] backdrop-blur-[7.2px] ${
        active ? "bg-[#3e4140]" : "bg-[#f4f4f4]"
      }`}
    >
      <img
        alt=""
        src={withBasePath(active ? "/assets/section-header/arrow-general-active.svg" : "/assets/section-header/arrow-general.svg")}
        className="size-[18px]"
      />
    </button>
  );
}

// Figma "Left&Right" pair (Components Library node 951:94803/951:94805) used
// beside every section's "更多" tag: a plain gray left-pointing chevron and
// a teal-on-dark right-pointing chevron -- each direction already baked
// into its own asset, not one glyph rotated per side.
export default function LeftRight({ onLeft, onRight }: LeftRightProps) {
  return (
    <div className="flex items-center gap-[5px]">
      <NavButton active={false} label="previous" onClick={onLeft} />
      <NavButton active label="next" onClick={onRight} />
    </div>
  );
}
