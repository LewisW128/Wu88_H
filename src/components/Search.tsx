import { withBasePath } from "../lib/asset";

// Figma "Search" component (Components Library node 573:3549, hover=off/on).
// A round icon button (64px) that expands into a 231px-wide pill with a
// "請輸入關鍵字" (enter keyword) placeholder on hover. The icon's own
// position barely moves between states (centered at ~19.5px vs. hover's
// fixed 20px, Figma's own numbers), so it stays at a fixed left-[20px]
// throughout rather than animating a near-imperceptible 0.5px shift --
// only the container width and the placeholder's opacity actually
// transition.
export default function Search() {
  return (
    <div className="group relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full bg-[#f4f4f4] transition-[width] duration-300 hover:w-[231px]">
      <img
        alt="search"
        src={withBasePath("/assets/search/icon.svg")}
        className="absolute left-[20px] top-1/2 size-[25px] -translate-y-1/2"
      />
      <p className="absolute left-[65px] top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-[#a2a2a2] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        請輸入關鍵字
      </p>
    </div>
  );
}
