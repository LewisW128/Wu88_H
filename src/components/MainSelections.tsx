import Link from "next/link";
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
// Figma "Footbar_btn" (node 894:215150): a dark pill tooltip showing the
// icon's label, appearing 13.5px right of the icon and vertically
// centered on it. Every sidebar icon gets one on hover -- see the
// matching span in Sidebar.tsx's own NavIcon.
//
// This is a real Link to "/" (previously a plain non-interactive div --
// there was no way back to the homepage once another page like /casino
// existed).
export default function MainSelections({ active = false }: MainSelectionsProps) {
  return (
    <Link href="/" aria-label="首頁" className="group relative flex h-[89px] w-[93px] shrink-0 items-center justify-center">
      <img
        alt=""
        src={withBasePath(active ? "/assets/main-selections/state-on.svg" : "/assets/main-selections/state-off.svg")}
        className="h-[89px] w-[93px]"
      />
      <span className="pointer-events-none absolute left-full top-1/2 ml-[13.5px] -translate-y-1/2 whitespace-nowrap rounded-[15px] bg-[#3e4140] px-[11px] py-[9px] text-[14px] font-medium leading-[20px] tracking-[0.15px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        首頁
      </span>
    </Link>
  );
}
