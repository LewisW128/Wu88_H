export type LevelBadgeProps = {
  label: string;
  background: string;
  opacity?: number;
  // The badge text's weight: Rank_section / Talk_section use medium, the
  // friend-list row's own Figma instance (node 988:9544) is regular.
  weight?: "medium" | "regular";
};

// Figma "Level_Lebals" component. Shared by Rank_section and Talk_section --
// both attach it to a name, and both tie the avatar's ring color to this
// same `background` value so the badge and the ring always match.
export default function LevelBadge({ label, background, opacity, weight = "medium" }: LevelBadgeProps) {
  return (
    <div className="flex h-[18px] shrink-0 items-center justify-center rounded-full px-[5px] py-[2px]" style={{ background, opacity }}>
      <p className={`whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-white ${weight === "regular" ? "font-normal" : "font-medium"}`}>{label}</p>
    </div>
  );
}
