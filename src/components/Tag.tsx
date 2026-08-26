import { withBasePath } from "../lib/asset";

export type TagProps = {
  label?: string;
  active?: boolean;
  width?: number;
  onClick?: () => void;
};

// Figma "Tag" component (Components Library node 752:8309). A toggle chip:
// active state is teal with one square corner (top-left) marking it as the
// selected tab; inactive is plain light-gray with uniform rounded corners.
// The arrow points down-right (rotated 180deg from the raw asset, which
// actually points up-left, not up-right -- confirmed by opening the raw
// file directly, since the path coordinates are easy to misread). When a
// fixed width is given (as Win List's own "最近贏家"/"富豪榜" instances
// specify), text and arrow spread to its edges via justify-between instead
// of hugging with a fixed gap.
export default function Tag({ label = "更多", active = true, width, onClick }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center overflow-hidden px-[15px] py-[10px] ${width ? "justify-between" : "gap-[10px]"} ${
        active ? "rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#23f3d5]" : "rounded-[20px] bg-[#f4f4f4]"
      }`}
      style={width ? { width } : undefined}
    >
      <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">{label}</p>
      <img alt="" src={withBasePath("/assets/tag/arrow.svg")} className="size-[25px] rotate-180" />
    </button>
  );
}
