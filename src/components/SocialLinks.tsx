import { withBasePath } from "../lib/asset";

const ICONS = [
  { icon: "/assets/social/whatsapp.svg", label: "WhatsApp", bare: false },
  { icon: "/assets/social/telegram.svg", label: "Telegram", bare: false },
  { icon: "/assets/social/instagram.svg", label: "Instagram", bare: false },
  { icon: "/assets/social/line.svg", label: "LINE", bare: true },
];

// Figma "Footer" (node 901:9725) "SocialApp" instances: four 33px icon
// buttons (WhatsApp, Telegram, Instagram, LINE). The first three are a
// plain glyph on a dark rounded-square background applied by this
// component; LINE's own export already bakes in its rounded background
// (Figma's SocialApp renders it with no extra wrapper styling at all),
// so it renders bare at full size instead of being padded/boxed again.
export default function SocialLinks() {
  return (
    <div className="flex items-center gap-[10px]">
      {ICONS.map((item) =>
        item.bare ? (
          <img key={item.label} alt={item.label} src={withBasePath(item.icon)} className="size-[33px]" />
        ) : (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            className="flex size-[33px] items-center justify-center overflow-hidden rounded-[10px] bg-[#3e4140]"
          >
            <img alt="" src={withBasePath(item.icon)} className="size-[25px]" />
          </button>
        ),
      )}
    </div>
  );
}
