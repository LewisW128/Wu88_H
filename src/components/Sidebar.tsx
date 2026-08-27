import { withBasePath } from "../lib/asset";
import MainSelections from "./MainSelections";

const NAV_ICONS = [
  { icon: "/assets/sidebar/nav-casino.svg", label: "賭場" },
  { icon: "/assets/sidebar/nav-sports.svg", label: "體育" },
  { icon: "/assets/sidebar/nav-promo.svg", label: "優惠活動" },
];

function Divider() {
  return <div className="h-px w-[36px] shrink-0 bg-[#f4f4f4]" />;
}

// Figma "Footbar_btn" (node 894:215150): a dark pill tooltip showing the
// icon's label, appearing 13.5px right of the icon and vertically
// centered on it -- shown on hover, matching the same tooltip on
// MainSelections' own home icon.
function NavIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <button type="button" aria-label={label} className="group relative flex h-[89px] w-[93px] shrink-0 items-center justify-center">
      <img alt="" src={withBasePath(icon)} className="h-[89px] w-[93px]" />
      <span className="pointer-events-none absolute left-full top-1/2 ml-[13.5px] -translate-y-1/2 whitespace-nowrap rounded-[15px] bg-[#3e4140] px-[11px] py-[9px] text-[14px] font-medium leading-[20px] tracking-[0.15px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

// Figma "Frame 1257": the page's left rail -- logo, the active "首頁" state,
// three more nav icons (each its own pre-composited Figma export, unlike
// MainSelections which only models the home icon's on/off pair), a divider,
// then two trailing icons (contact support + download app).
export default function Sidebar() {
  return (
    <div className="flex w-[94px] flex-col items-center gap-[40px]">
      <img alt="WU88.ONE" src={withBasePath("/assets/sidebar/logo-mark.svg")} className="h-[29px] w-[91px] self-start" />

      <div className="flex w-full flex-col items-center gap-[30px]">
        <MainSelections active />
        <Divider />
        <div className="flex w-full flex-col items-start gap-[20px]">
          {NAV_ICONS.map((item) => (
            <NavIcon key={item.label} {...item} />
          ))}
        </div>
        <Divider />
        <NavIcon icon="/assets/sidebar/nav-member.svg" label="聯繫客服" />
        <NavIcon icon="/assets/sidebar/nav-download.svg" label="下載APP" />
      </div>
    </div>
  );
}
