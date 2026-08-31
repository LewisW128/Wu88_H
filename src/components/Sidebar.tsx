import { withBasePath } from "../lib/asset";
import MainSelections from "./MainSelections";

const NAV_ICONS = [
  { page: "casino", icon: "/assets/sidebar/nav-casino.svg", activeIcon: "/assets/sidebar/nav-casino-active.svg", label: "賭場" },
  { page: "sports", icon: "/assets/sidebar/nav-sports.svg", label: "體育" },
  { page: "promo", icon: "/assets/sidebar/nav-promo.svg", label: "優惠活動" },
] as const;

export type SidebarPage = "home" | (typeof NAV_ICONS)[number]["page"];

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

export type SidebarProps = {
  // Which page this Sidebar instance renders on, so it can highlight the
  // matching nav icon. All six icon slots are actually the same Figma
  // "Main Selections" component (on/off variant) reused per page -- see
  // 02_WU88-H-PC-Casino node 122:6692's "Frame 1257", where the 賭場 slot
  // is the active variant instead of 首頁. Only 賭場 has a downloaded
  // active-state asset so far (this is the only page that needed one);
  // 體育/優惠活動 fall back to their plain icon until their own pages ask
  // for it, same as MainSelections did before any page but home existed.
  page?: SidebarPage;
};

// Figma "Frame 1257": the page's left rail -- logo, the "首頁" state, three
// more nav icons (each its own pre-composited Figma export, unlike
// MainSelections which only models the home icon's on/off pair), a divider,
// then two trailing icons (contact support + download app).
export default function Sidebar({ page = "home" }: SidebarProps) {
  return (
    <div className="flex w-[94px] flex-col items-center gap-[40px]">
      <img alt="WU88.ONE" src={withBasePath("/assets/sidebar/logo-mark.svg")} className="h-[29px] w-[91px] self-start" />

      <div className="flex w-full flex-col items-center gap-[30px]">
        <MainSelections active={page === "home"} />
        <Divider />
        <div className="flex w-full flex-col items-start gap-[20px]">
          {NAV_ICONS.map((item) => (
            <NavIcon key={item.label} icon={page === item.page && "activeIcon" in item ? item.activeIcon : item.icon} label={item.label} />
          ))}
        </div>
        <Divider />
        <NavIcon icon="/assets/sidebar/nav-member.svg" label="聯繫客服" />
        <NavIcon icon="/assets/sidebar/nav-download.svg" label="下載APP" />
      </div>
    </div>
  );
}
