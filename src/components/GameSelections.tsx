import { withBasePath } from "../lib/asset";

export type GameSelectionsProps = {
  icon: string;
  // Shown instead of `icon` when `active` -- see the corner-badge comment
  // below for why this needs to be a distinct asset, not just `icon`
  // reused on a different background.
  activeIcon?: string;
  label?: string;
  active?: boolean;
  onClick?: () => void;
};

// Figma "Game_selections" component (02_WU88-H-PC-Casino node 122:6653's
// row). Same active/inactive corner treatment as Tag (active = teal with a
// square top-left corner marking it selected; inactive = plain light-gray,
// uniform rounded corners), but icon-first instead of label-first, a wider
// 20px gap/padding, and 14px bold text. Each category's icon is genuinely
// different art (dice, camera, ticket, cards, hook, gamepad, etc.) --
// get_design_context flattened every instance to the same generic "grid"
// glyph (the "所有遊戲" default), so these were pulled instead via
// download_assets' real rendered export of each instance and re-keyed to a
// transparent PNG, one per category.
//
// Two icon assets per category, not one: every icon has a shared
// bottom-right accent-dot badge that Figma composites at partial opacity
// over whatever sits behind it, so the exported pixel is a flat bake of
// "badge blended with THAT render's own background" -- reusing the
// gray-background bake on the teal active pill (or vice versa) leaves a
// visibly wrong-colored dot, since there's no real alpha left to
// recomposite against a different color. Capturing one export per state
// (matching each state's own bg) instead of trying to key/clip the badge
// out of a single export is what actually fixes it.
export default function GameSelections({ icon, activeIcon, label, active = false, onClick }: GameSelectionsProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-[20px] px-[20px] py-[10px] ${
        active ? "rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#23f3d5]" : "rounded-[20px] bg-[#f4f4f4]"
      }`}
    >
      <img alt="" src={withBasePath(active && activeIcon ? activeIcon : icon)} className="size-[25px]" />
      {label && <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">{label}</p>}
    </button>
  );
}
