export type LevelBadgeProps = {
  label: string;
  background: string;
  opacity?: number;
};

// Figma "Level_Lebals" component. Shared by Rank_section and Talk_section --
// both attach it to a name, and both tie the avatar's ring color to this
// same `background` value so the badge and the ring always match.
export default function LevelBadge({ label, background, opacity }: LevelBadgeProps) {
  return (
    <div className="flex h-[18px] shrink-0 items-center justify-center rounded-full px-[5px] py-[2px]" style={{ background, opacity }}>
      <p className="whitespace-nowrap text-[10px] font-medium leading-[18px] tracking-[0.15px] text-white">{label}</p>
    </div>
  );
}
