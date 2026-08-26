import { withBasePath } from "../lib/asset";

export type MainSelectionsProps = {
  active?: boolean;
};

// Figma "Main Selections" component (Components Library node 626:4810,
// State=on/off). A home/nav icon button: the active state is a translucent
// purple/teal gradient-glow card (two large blurred circles clipped to the
// rounded-rect shape) with a teal underline glow beneath the icon; the
// inactive state is a plain frosted-white card (bg blur) with a gray icon
// and no underline. Both states -- glow blur, drop-shadow underline, and
// icon -- are pre-composited in the exported SVGs since they rely on
// Gaussian-blur filters that aren't worth hand-reproducing in CSS.
export default function MainSelections({ active = false }: MainSelectionsProps) {
  return (
    <img
      alt="首頁"
      src={withBasePath(active ? "/assets/main-selections/state-on.svg" : "/assets/main-selections/state-off.svg")}
      className="h-[89px] w-[93px]"
    />
  );
}
