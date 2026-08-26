import LeftRight from "./LeftRight";
import Tag from "./Tag";

export type SectionHeaderProps = {
  icon: string;
  title: string;
  onLeft?: () => void;
  onRight?: () => void;
};

// Figma "Title_bar" (reused across Hot Games/General Games/Promotions):
// icon + section name on the left, a "更多" Tag and a Left&Right nav pair
// pinned to the right.
export default function SectionHeader({ icon, title, onLeft, onRight }: SectionHeaderProps) {
  return (
    <div className="flex h-[44px] w-full items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={icon} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">{title}</p>
      </div>
      <div className="flex items-center gap-[20px]">
        <Tag label="更多" active />
        <LeftRight onLeft={onLeft} onRight={onRight} />
      </div>
    </div>
  );
}
