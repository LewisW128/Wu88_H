import LeftRight from "./LeftRight";
import Tag from "./Tag";

export type SectionHeaderProps = {
  icon: string;
  title: string;
  canLeft?: boolean;
  canRight?: boolean;
  onLeft?: () => void;
  onRight?: () => void;
  onMoreClick?: () => void;
  // Promotions' own page (05_WU88-H-PC-Promotions) reuses this same
  // "優惠活動" row directly under its hero, but a "更多" leading to /promotions
  // makes no sense on /promotions itself -- the full listing is already
  // the very next section down. Hides just the Tag, not the whole
  // trailing group, so the scroll arrows stay if the row still overflows.
  hideMore?: boolean;
};

// Figma "Title_bar" (reused across Hot Games/General Games/Promotions):
// icon + section name on the left, a "更多" Tag and a Left&Right nav pair
// pinned to the right.
//
// The "更多"/nav side hides entirely (not just disables) when the row
// behind it doesn't overflow at all -- `canLeft`/`canRight` both false at
// rest only happens when there's truly nothing to scroll to in either
// direction (an in-progress scroll always has at least one side true),
// so that's the signal that there aren't enough items to need "load
// more" or a scroller in the first place. Callers that don't track real
// scroll state (this component's own default) keep the original
// always-visible look.
export default function SectionHeader({ icon, title, canLeft = true, canRight = true, onLeft, onRight, onMoreClick, hideMore = false }: SectionHeaderProps) {
  const hasOverflow = canLeft || canRight;
  return (
    <div className="flex h-[44px] w-full items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={icon} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">{title}</p>
      </div>
      {hasOverflow && (
        <div className="flex items-center gap-[20px]">
          {!hideMore && <Tag label="更多" active onClick={onMoreClick} />}
          <LeftRight canLeft={canLeft} canRight={canRight} onLeft={onLeft} onRight={onRight} />
        </div>
      )}
    </div>
  );
}
