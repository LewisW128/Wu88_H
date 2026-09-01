const ON_GRADIENT =
  "linear-gradient(135deg, #01fab0 0%, #14e8b8 7%, #48bace 20%, #9a71f1 39%, #b65afd 45%, #8d54d8 68%, #6f4fbd 88%, #644eb3 100%)";

export type SwitchProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

// Figma "Switch button" (Components Library node 456:31795/456:31796): the
// two exported states share the same knob position (circle always at
// cx=33.5, the right side) and only swap the track's fill -- a dark flat
// gray for "off" as static exports. Reproduced here as a real animated
// toggle instead (knob slides left/right, track color transitions) since
// a static "off" knob glued to the right edge would read as broken/on.
export default function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="relative h-[23px] w-[45px] shrink-0 rounded-[11.5px] transition-colors duration-200"
      style={{ background: checked ? ON_GRADIENT : "#3e4140" }}
    >
      <span
        className="absolute top-1/2 size-[17px] -translate-y-1/2 rounded-full bg-white transition-[left] duration-200"
        style={{ left: checked ? 25 : 3 }}
      />
    </button>
  );
}
