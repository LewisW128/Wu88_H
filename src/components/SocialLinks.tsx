import { withBasePath } from "../lib/asset";

const ICONS = [
  { icon: "/assets/social/whatsapp.svg", label: "WhatsApp" },
  { icon: "/assets/social/telegram.svg", label: "Telegram" },
  { icon: "/assets/social/instagram.svg", label: "Instagram" },
  { icon: "/assets/social/more.svg", label: "更多" },
];

// Figma "Frame 1278": four dark rounded-square icon buttons (WhatsApp,
// Telegram, Instagram, a "more" kebab) sitting beside the footer.
export default function SocialLinks() {
  return (
    <div className="flex items-center gap-[10px]">
      {ICONS.map((item) => (
        <button
          key={item.label}
          type="button"
          aria-label={item.label}
          className="flex size-[33px] items-center justify-center overflow-hidden rounded-[10px] bg-[#3e4140]"
        >
          <img alt="" src={withBasePath(item.icon)} className="size-[25px]" />
        </button>
      ))}
    </div>
  );
}
