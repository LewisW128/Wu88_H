"use client";

import Link from "next/link";
import { withBasePath } from "../lib/asset";
import { useAuth } from "./AuthProvider";

function Divider() {
  return <div className="h-px w-[36px] shrink-0 bg-[#f4f4f4]" />;
}

// Every one of these icon assets is already a pre-composited 93x89 card
// (frosted-white bg + blur, same as MainSelections' own state-on/off) --
// no separate background wrapper needed here, just the image itself.
function NavIcon({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="group relative flex h-[89px] w-[93px] shrink-0 items-center justify-center">
      <img alt="" src={withBasePath(icon)} className="h-[89px] w-[93px]" />
      <span className="pointer-events-none absolute left-full top-1/2 ml-[13.5px] -translate-y-1/2 whitespace-nowrap rounded-[15px] bg-[#3e4140] px-[11px] py-[9px] text-[14px] font-medium leading-[20px] tracking-[0.15px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

// Figma "Frame 1237" (05_WU88-H-PC-Profile-Page node 428:17420, seen live
// on the page at 428:17332): the Profile page's own left rail -- a
// completely different icon set from the marketing pages' Sidebar
// (賭場/體育/優惠活動), not that same shared component reused. Confirmed by
// diffing the fetched "home" glow-card icon against Sidebar's own
// MainSelections asset: this page's top icon is a dashboard/grid glyph
// (a distinct member-center landing icon), not the site's own house
// glyph, so it can't just be `<MainSelections active />` pointing at "/".
//
// Above this rail, Figma also swaps the logo (present in every other
// page's Sidebar) for a dark circular "back" button (node 428:17416,
// misleadingly named "Search" like other Figma-mislabeled instances
// this project has already run into) -- rendered here, not in the
// shared Sidebar, since it's specific to sub-pages you navigate *into*
// rather than land on directly.
//
// Every label below except 下載APP/登出 is inferred from icon shape alone
// -- Figma's own layer names are all the generic "Main Selections"
// wrapper, with no text layer to read a real label from. Update these
// once the real copy is known; they're not decorative guesses baked
// into the icon assets themselves.
//
// 登出 is the only NavIcon with real behavior (the rest are still
// decorative -- no wallet/records/etc. pages exist yet): it flips the same
// shared AuthProvider state TopUp's login flips, so it hands off directly
// to ProfileContent's own `isGuest = !loggedIn` (see that component's
// comment) instead of this page needing its own separate notion of being
// logged in.
export default function ProfileSidebar() {
  const { setLoggedIn } = useAuth();

  return (
    <div className="flex w-[94px] flex-col items-center gap-[30px]">
      <Link
        href="/"
        aria-label="返回"
        className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-[#3e4140]"
      >
        <img alt="" src={withBasePath("/assets/sidebar/back-arrow.svg")} className="size-[25px]" />
      </Link>

      <NavIcon icon="/assets/sidebar/profile-nav/home-active.svg" label="會員中心" />

      <div className="flex w-full flex-col items-start gap-[20px]">
        <NavIcon icon="/assets/sidebar/profile-nav/wallet.svg" label="錢包" />
        <NavIcon icon="/assets/sidebar/profile-nav/records.svg" label="投注紀錄" />
        <NavIcon icon="/assets/sidebar/profile-nav/trophy.svg" label="排行榜" />
      </div>

      <NavIcon icon="/assets/sidebar/profile-nav/help.svg" label="常見問題" />

      <Divider />

      <NavIcon icon="/assets/sidebar/profile-nav/account.svg" label="帳戶設定" />
      <NavIcon icon="/assets/sidebar/profile-nav/download.svg" label="下載APP" />

      <Divider />

      <NavIcon icon="/assets/sidebar/profile-nav/logout.svg" label="登出" onClick={() => setLoggedIn(false)} />
    </div>
  );
}
