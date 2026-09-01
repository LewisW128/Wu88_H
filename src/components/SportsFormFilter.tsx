import { withBasePath } from "../lib/asset";

export type SportsFormFilterProps = {
  icon: string;
  active?: boolean;
  onClick?: () => void;
};

// Figma "Sports form" (03_WU88-H-PC-Sport node 801:11163, seen active/
// inactive across 801:11163-11166). Icon-only, no label -- inactive is a
// plain light-gray rounded box, active swaps to the dark fill plus a
// small teal underline bar under the icon.
//
// One icon file, not two: `icon` is always the real WU88 icon-library
// source (Wu88_v02/public/icons/actions/Sports_game -- flat #3E4140
// strokes/fills throughout), which reads fine on the light inactive
// pill but would vanish on the dark active one, so the active state
// recolors it to white via a CSS filter instead of needing a second,
// separately-authored "white" export per icon to keep in sync.
export default function SportsFormFilter({ icon, active = false, onClick }: SportsFormFilterProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex h-[48px] w-[46px] items-center justify-center rounded-[10px] transition-colors ${active ? "bg-[#3e4140]" : "bg-[#f4f4f4]"}`}
    >
      <img alt="" src={withBasePath(icon)} className="size-[25px]" style={active ? { filter: "brightness(0) invert(1)" } : undefined} />
      {active && <div className="absolute bottom-[6px] h-[3px] w-[9px] rounded-full bg-[#23f3d5]" />}
    </button>
  );
}
