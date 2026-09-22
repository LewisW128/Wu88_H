"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { withBasePath } from "../lib/asset";
import { openServiceChat } from "../lib/openServiceChat";
import { useAuth } from "./AuthProvider";
import { useScale } from "./ScaleToFit";

function Divider() {
  return <div className="h-px w-[36px] shrink-0 bg-[#f4f4f4]" />;
}

// Every one of these icon assets is already a pre-composited 93x89 card
// (frosted-white bg + blur, same as MainSelections' own state-on/off) --
// no separate background wrapper needed here, just the image itself.
//
// `href` renders a real Link (會員中心/錢包/個人資訊 now have actual pages);
// the rest stay plain buttons -- still decorative until their own pages
// exist. `activeIcon` swaps in the glowing on-state export once the
// current route actually matches `href` -- Figma's own rail shows a
// DIFFERENT icon highlighted on each of the 3 real pages (confirmed by
// fetching each page's own sidebar frame separately: 會員中心 glows on
// /profile, 帳戶明細 on /profile/wallet, 個人資訊 on /profile/account), not one
// icon permanently pinned "on" regardless of where you actually are.
function NavIcon({
  icon,
  activeIcon,
  label,
  href,
  onClick,
}: {
  icon: string;
  activeIcon?: string;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = !!href && !!activeIcon && pathname === href;

  // The label used to be a plain `absolute left-full` + `group-hover`
  // span, like Sidebar.tsx's own (unaffected) tooltip -- but this rail's
  // own icon list sits inside an `overflow-y-auto` scroll container
  // (added later for short viewports, below), and CSS has no way to let
  // one axis overflow visibly while the other clips: setting overflow-y
  // to anything but visible forces the browser to treat overflow-x as
  // auto too, so the tooltip started getting clipped at the list's own
  // right edge instead of floating past it. Portaling it to <body> and
  // positioning it from the icon's own measured rect (already in real
  // viewport coordinates, unaffected by any ancestor's `zoom`) sidesteps
  // that clipping entirely, the same way this file's own modals already
  // portal out from under ScaleToFit's zoom.
  //
  // Escaping that zoom also means escaping its SIZE, though -- unlike
  // Sidebar.tsx's own tooltip, which shrinks along with the rest of the
  // zoomed page, this one would render at native 1:1 size regardless of
  // how zoomed out the page currently is, reading bigger than Sidebar's
  // own the moment the page isn't at its full native scale (i.e. most
  // real window widths). Scaling every px value here by that same
  // `scale` keeps it visually identical to Sidebar's, just positioned
  // via measured coordinates instead of inheriting the ambient zoom.
  const scale = useScale();
  const anchorRef = useRef<HTMLElement | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);

  function showTooltip() {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 13.5 * scale });
  }
  function hideTooltip() {
    setTooltipPos(null);
  }

  const tooltip =
    tooltipPos &&
    createPortal(
      <span
        className="pointer-events-none fixed z-[60] -translate-y-1/2 whitespace-nowrap bg-[#3e4140] font-medium text-white"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          padding: `${9 * scale}px ${11 * scale}px`,
          borderRadius: 15 * scale,
          fontSize: 14 * scale,
          lineHeight: `${20 * scale}px`,
          letterSpacing: 0.15 * scale,
        }}
      >
        {label}
      </span>,
      document.body,
    );

  const icon_ = <img alt="" src={withBasePath(isActive ? activeIcon! : icon)} className="h-[89px] w-[93px]" />;

  if (href) {
    return (
      <>
        <Link
          ref={anchorRef as React.Ref<HTMLAnchorElement>}
          href={href}
          aria-label={label}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          className="relative flex h-[89px] w-[93px] shrink-0 items-center justify-center"
        >
          {icon_}
        </Link>
        {tooltip}
      </>
    );
  }

  return (
    <>
      <button
        ref={anchorRef as React.Ref<HTMLButtonElement>}
        type="button"
        aria-label={label}
        onClick={onClick}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="relative flex h-[89px] w-[93px] shrink-0 items-center justify-center"
      >
        {icon_}
      </button>
      {tooltip}
    </>
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
// Every page wraps this in its own `sticky top-[58px] ... self-start`
// container (unchanged) so the whole rail stays put while the page's own
// content scrolls past it -- same as Talking_Bar's own wrapper. What's new
// here is what happens WITHIN that sticky box: on a short viewport the
// icon stack (back button + 8ish nav icons + dividers, ~1080px worth) is
// routinely taller than the room actually available above the target
// VIEWPORT_BOTTOM_GAP, so it used to just overflow past the bottom of the
// screen with no way to reach the icons below the fold. This gives the
// rail its own fixed, viewport-driven height (identical formula to
// Talking_Bar's own panelHeight) and an internal scroll, with a matching
// thin teal scrollbar thumb (Figma "Line8", node 652:16074 -- the same
// 2px rounded `#23f3d5` bar Talking_Bar's own message list already uses),
// per the user's own direct request that every page's sidebar scroll
// independently in that same visual style.
const TOP_OFFSET = 58;
const VIEWPORT_BOTTOM_GAP = 20;
const DEFAULT_RAIL_HEIGHT = 900;
// 返回 sits above the scrollable list, not inside it -- per the user's own
// direct call, it has to stay pinned in place while everything below it
// scrolls, the same way Talking_Bar's own channel-switch header (node
// 754:9317) stays fixed above ITS scrolling message list rather than
// scrolling away with the messages. `GAP` matches the column's own
// established gap-[30px] rhythm between every other icon.
const BACK_BUTTON_SIZE = 64;
const GAP = 30;

export default function ProfileSidebar() {
  const { loggedIn, setLoggedIn } = useAuth();
  const scale = useScale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [railHeight, setRailHeight] = useState(DEFAULT_RAIL_HEIGHT);
  const [thumb, setThumb] = useState({ height: 0, top: 0 });
  const [scrolledFromTop, setScrolledFromTop] = useState(false);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);
  const listHeight = Math.max(0, railHeight - BACK_BUTTON_SIZE - GAP);

  useEffect(() => {
    function update() {
      if (!scale) return;
      const targetScreenBottom = window.innerHeight - VIEWPORT_BOTTOM_GAP;
      setRailHeight(targetScreenBottom / scale - TOP_OFFSET);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [scale]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      setScrolledFromTop(scrollTop > 0);
      // `> 1`, not `> 0` -- sub-pixel scroll-height rounding (fractional
      // `zoom` scaling elsewhere on this page routinely produces this)
      // otherwise left a permanent 0.3px sliver of "more below" that never
      // actually clears even scrolled fully to the bottom.
      setHasMoreBelow(scrollHeight - clientHeight - scrollTop > 1);
      if (scrollHeight <= clientHeight) {
        setThumb({ height: 0, top: 0 });
        return;
      }
      const height = Math.max(24, (clientHeight / scrollHeight) * clientHeight);
      const maxTop = clientHeight - height;
      const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;
      setThumb({ height, top });
    }

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [listHeight, loggedIn]);

  return (
    // `items-center` (horizontal only) -- NOT `justify-center`. An earlier
    // version here also centered the group VERTICALLY within the rail's
    // own height, but per the user's own direct correction that's not
    // wanted: only left-right centering, 返回 and the icon list still flow
    // from the top the same as before.
    <div className="relative flex w-[94px] flex-col items-center gap-[30px]" style={{ height: railHeight }}>
      <Link
        href="/"
        aria-label="返回"
        className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-[#3e4140]"
      >
        <img alt="" src={withBasePath("/assets/sidebar/back-arrow.svg")} className="size-[25px]" />
      </Link>

      {/* `max-height`, not a fixed `height` -- a fixed height equal to the
          full remaining space would leave visible empty room INSIDE this
          box whenever the icons don't actually fill it. `max-height` lets
          it shrink to its own natural content size when short, and only
          clamps (enabling the scroll+fade below) once the
          real content actually exceeds the available room.
          Fades the first/last ~16px of the list into transparent (a plain
          CSS gradient mask, not Talking_Bar's own fade-mask.svg -- that
          asset's shape is cut to Talking_Bar's own notched panel outline,
          meaningless for this plain rectangular column) -- the TOP fade
          only once actually scrolled away from the top (`scrolledFromTop`,
          not just `needsScroll`) -- `needsScroll` alone is true the
          instant there's ANY overflow, which faded the very first icon
          permanently even at rest, before scrolling away from it means
          anything. The BOTTOM fade mirrors that same logic off
          `hasMoreBelow` (per the user's own direct call, matching this
          same top/bottom-fade treatment RewardKitDetailPanel's own scroll
          box briefly had) -- only shown while there's still more below to
          scroll to, not once already at the very bottom. Keeping the fade
          zone short (16px, not the original 30px) is the "push it up
          more" the user asked for -- most of the icon in that edge slot
          stays fully visible, and only the sliver actually crossing the
          boundary fades. Built as one combined gradient (not two stacked
          masks -- `mask-image` only supports one layer reliably across
          engines the same way `background-image` supports several)
          with only the active edge(s)' own stop pair included, so a
          list short enough to need neither fade renders with no mask at
          all rather than a same-color no-op gradient. */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full flex-col items-center gap-[30px] overflow-y-auto"
        style={{
          maxHeight: listHeight,
          ...((scrolledFromTop || hasMoreBelow) &&
            (() => {
              const stops = [
                scrolledFromTop ? "transparent 0px" : "black 0px",
                scrolledFromTop ? "black 16px" : null,
                hasMoreBelow ? "black calc(100% - 16px)" : null,
                hasMoreBelow ? "transparent 100%" : "black 100%",
              ].filter((stop): stop is string => stop !== null);
              const gradient = `linear-gradient(to bottom, ${stops.join(", ")})`;
              return { maskImage: gradient, WebkitMaskImage: gradient };
            })()),
        }}
      >
        <NavIcon
          icon="/assets/sidebar/profile-nav/home.svg"
          activeIcon="/assets/sidebar/profile-nav/home-active.svg"
          label="會員中心"
          href="/profile"
        />

        <div className="flex w-full flex-col items-start gap-[20px]">
          <NavIcon
            icon="/assets/sidebar/profile-nav/wallet.svg"
            activeIcon="/assets/sidebar/profile-nav/wallet-active.svg"
            label="帳戶明細"
            href="/profile/wallet"
          />
          {/* /profile/account itself already bounces a guest straight back
              to /profile (see AccountSettings' own comment) -- hiding the
              icon too means a guest never sees an option that would just
              redirect them away the moment they clicked it. */}
          {loggedIn && (
            <NavIcon
              icon="/assets/sidebar/profile-nav/records.svg"
              activeIcon="/assets/sidebar/profile-nav/records-active.svg"
              label="個人資訊"
              href="/profile/account"
            />
          )}
          <NavIcon
            icon="/assets/sidebar/profile-nav/trophy.svg"
            activeIcon="/assets/sidebar/profile-nav/trophy-active.svg"
            label="領獎中心"
            href="/profile/rewards"
          />
        </div>

        {/* The "?" icon is the help center (Figma's own help-center frame,
            05_WU88-H-PC-Profile-Page node 211:23224, shows exactly this icon
            glowing) -- it was labeled "排行榜" from icon shape alone before that
            page existed. */}
        <NavIcon
          icon="/assets/sidebar/profile-nav/help.svg"
          activeIcon="/assets/sidebar/profile-nav/help-active.svg"
          label="幫助中心"
          href="/profile/help"
        />

        <Divider />

        <NavIcon icon="/assets/sidebar/profile-nav/account.svg" label="聯繫客服" onClick={openServiceChat} />
        <NavIcon icon="/assets/sidebar/profile-nav/download.svg" label="下載APP" />

        <Divider />

        <NavIcon icon="/assets/sidebar/profile-nav/logout.svg" label="登出" onClick={() => setLoggedIn(false)} />
      </div>

      {/* `right-[-20px]`: a fixed 20px clear of the icon column's own right
          edge, per the user's own direct spec -- not flush against it
          (`right-0`) and not out at Figma's Line8 divider position either
          (`right-[-40px]`, this file's own earlier guess before the user
          gave the exact number). `top: 94 + thumb.top` matches the list's
          own top offset (64px back button + 30px gap) so the thumb tracks
          the SCROLLABLE list, not the back button sitting above it. */}
      {thumb.height > 0 && (
        <div
          className="pointer-events-none absolute right-[-20px] w-[2px] rounded-full bg-[#23f3d5]"
          style={{ top: 94 + thumb.top, height: thumb.height }}
        />
      )}
    </div>
  );
}
