const ON_GRADIENT =
  "linear-gradient(135deg, #01fab0 0%, #14e8b8 7%, #48bace 20%, #9a71f1 39%, #b65afd 45%, #8d54d8 68%, #6f4fbd 88%, #644eb3 100%)";

export type SwitchProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  // Figma's own guest/logged-out ProfileCard (node 455:23386) shows both
  // toggles in a separate "Disable" export (flat #a2a2a2 track, #f4f4f4
  // knob) -- there's nothing to toggle before you've logged in.
  disabled?: boolean;
};

// Figma "Switch button" (Components Library node 456:31795/456:31796): the
// two exported states share the same knob position (circle always at
// cx=33.5, the right side) and only swap the track's fill -- a dark flat
// gray for "off" as static exports. Reproduced here as a real animated
// toggle instead (knob slides left/right, track color transitions) since
// a static "off" knob glued to the right edge would read as broken/on.
export default function Switch({ checked, onChange, disabled = false }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className="relative h-[23px] w-[45px] shrink-0 rounded-[11.5px] transition-colors duration-200 disabled:cursor-not-allowed"
      style={{ background: disabled ? "#a2a2a2" : checked ? ON_GRADIENT : "#3e4140" }}
    >
      <span
        className="absolute top-1/2 size-[17px] -translate-y-1/2 rounded-full transition-[left] duration-200"
        style={{ left: checked ? 25 : 3, background: disabled ? "#f4f4f4" : "white" }}
      />
    </button>
  );
}
