import { withBasePath } from "../lib/asset";

export type SportsFormFilterProps = {
  icon: string;
  activeIcon: string;
  active?: boolean;
  onClick?: () => void;
};

// Figma "Sports form" (03_WU88-H-PC-Sport node 801:11163, seen active/
// inactive across 801:11163-11166). Icon-only, no label -- inactive is a
// plain light-gray rounded box, active swaps to the dark fill plus a
// small teal underline bar under the icon. That underline is drawn here
// as its own element rather than baked into the icon art: Figma's only
// active reference (the trophy instance) bakes bar+icon into one flat
// export, but the bar itself is a generic "selected tab" indicator that
// belongs to the button, not any one category's glyph -- baking it in
// would mean carrying "no bar" cropped copies for the 3 icons that never
// got their own active export, plus recoloring per active state getting
// out of sync with the shared indicator.
export default function SportsFormFilter({ icon, activeIcon, active = false, onClick }: SportsFormFilterProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex h-[48px] w-[46px] items-center justify-center rounded-[10px] transition-colors ${active ? "bg-[#3e4140]" : "bg-[#f4f4f4]"}`}
    >
      <img alt="" src={withBasePath(active ? activeIcon : icon)} className="size-[25px]" />
      {active && <div className="absolute bottom-[6px] h-[3px] w-[9px] rounded-full bg-[#23f3d5]" />}
    </button>
  );
}
