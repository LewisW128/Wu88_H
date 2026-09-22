export type LevelBadgeProps = {
  label: string;
  background: string;
  opacity?: number;
  // The badge text's weight: Rank_section / Talk_section use medium, the
  // friend-list row's own Figma instance (node 988:9544) is regular.
  weight?: "medium" | "regular";
};

// Figma "Level_Lebals" component. Shared by Rank_section and Talk_section.
// Callers pass the fill via `background`. For Johnny/Arick that matches the
// avatar ring; for Jackson VIP the badge is LEVEL_LEBALS_BACKGROUND while the
// ring is JACKSON_AVATAR_RING (#01fab0).
export default function LevelBadge({ label, background, opacity, weight = "medium" }: LevelBadgeProps) {
  return (
    <div className="flex h-[18px] shrink-0 items-center justify-center rounded-full px-[5px] py-[2px]" style={{ background, opacity }}>
      <p className={`whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-white ${weight === "regular" ? "font-normal" : "font-medium"}`}>{label}</p>
    </div>
  );
}
