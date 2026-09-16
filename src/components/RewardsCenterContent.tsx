"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import BackgroundSequence from "./BackgroundSequence";
import MinPanelHeight from "./MinPanelHeight";
import ProfileSidebar from "./ProfileSidebar";
import { CURRENT_KIT_SCALE, KIT_CARD_GAP, PLAIN_KIT_CARD_WIDTH, REWARD_KITS, RewardKitCard, RewardKitDetailPanel } from "./RewardKit";
import RewardVipCard from "./RewardVipCard";
import ScaleToFit from "./ScaleToFit";
import TalkingBar from "./TalkingBar";
import TopBar from "./TopBar";
import TopUp from "./TopUp";
import { TimeUnit, useCountdown } from "./PromotionCard";
import { withBasePath } from "../lib/asset";
import { topBarAnnouncements, talkingBarMessages, talkingBarSimulatedMessages, talkingBarFriends } from "../lib/chatMockData";

// Figma "Level_line"/"Level_Point" (node 202:7697 / 203:7706): the season's
// XP-milestone rail under the Reward_Kit row -- 7 points (numerals are this
// season's own literal thresholds, not counters), each followed by a
// connector line, matching Figma's own repeated pairing exactly (including
// the last point still getting a trailing line).
const LEVEL_POINTS = ["1", "14", "28", "41", "54", "67", "82"];

// Figma node 689:16248 (a standalone example of the FIRST point+line pair,
// "1", on the logged-in-and-recharged reward center page) shows a
// DIFFERENT pair of assets once a milestone is actually reached -- the
// hexagon's own stroke and the numeral both swap from gray (#3e4140) to
// this project's teal (#23f3d5), and the line following it swaps the same
// way, not just a recolor applied in code: `level-point-active.svg`/
// `level-line-active.svg` are Figma's own real exports for that state, not
// a CSS filter over the plain ones.
function LevelPoint({ numeral, active }: { numeral: string; active: boolean }) {
  return (
    <div className="relative size-[24px] shrink-0">
      {/* The hexagon (level-point.svg, natural 20.7846x24) needs its own
          6.7%-inset wrapper sized purely by that inset -- putting `size-full`
          on the SAME element as `inset-[0_6.7%]` (an earlier version here
          did) over-constrains the box: an explicit width/height wins over
          the implied one from left+right, so the hexagon rendered at the
          full 24px square instead of 20.78px, stretched and overflowing
          past its own container. Two nested elements, exactly matching
          Figma's own structure, avoids that fight entirely. */}
      <div className="absolute inset-[0_6.7%]">
        <img
          alt=""
          src={withBasePath(active ? "/assets/rewards/level-point-active.svg" : "/assets/rewards/level-point.svg")}
          className="block size-full max-w-none"
        />
      </div>
      <p
        className={`absolute left-1/2 top-[calc(50%-9px)] -translate-x-1/2 whitespace-nowrap text-[12px] font-medium leading-[18px] tracking-[0.15px] ${active ? "text-[#23f3d5]" : "text-[#3e4140]"}`}
      >
        {numeral}
      </p>
    </div>
  );
}

// `width` is passed in per-instance now, not a flat `w-[212px]` -- see
// `kitCardCenters`'s own comment on the bottom menu's JSX below for why
// this needs to actually vary per segment. Both source SVGs are just a
// single flat `M0 Y H<width>` stroked path (confirmed by reading them
// directly), so resizing the rendered width doesn't stretch or distort
// any texture/pattern the way an arbitrary raster or dashed asset would.
// `maxWidth: "none"` is required, not optional -- Tailwind's own preflight
// reset (`@import "tailwindcss"` in globals.css) sets a blanket `img {
// max-width: 100% }`, and `max-width` always wins over `width` regardless
// of the latter's specificity (a basic CSS box-model rule, not a cascade
// question) -- confirmed live: this img's own explicit inline `width` was
// being applied (readable back off `.style.width`) while its ACTUAL
// rendered `getBoundingClientRect().width` measured 0, because the
// absolutely-positioned wrapper div around it has no explicit width of its
// own for that 100% to resolve against. The user's own screenshot caught
// this as the connector lines between the level-rail numbers having
// silently vanished.
function LevelLine({ active, width }: { active: boolean; width: number }) {
  return (
    <img
      alt=""
      src={withBasePath(active ? "/assets/rewards/level-line-active.svg" : "/assets/rewards/level-line.svg")}
      className="h-[19px] shrink-0"
      style={{ width, maxWidth: "none" }}
    />
  );
}

const SEASON_COUNTDOWN_SEED = { days: "08", hours: "08", minutes: "12", seconds: "32" };

const HERO_WIDTH = 1728;
const HERO_HEIGHT = 1317;
// Per the user's own updated Figma (node 701:18568, "Frame 1376" -- the
// character image, still 1317 tall, now nested INSIDE a shorter 1079-tall
// wrapper carrying the mask's own `overflow-clip rounded-tl-[50px]`,
// confirmed directly via get_design_context): the MASK is genuinely
// shorter than the image it holds, permanently cropping the bottom 238px
// -- not the same height as the image the way this file's own mask box
// used to assume. Using the image's own 1317 height for the mask (an
// earlier version here did) made the rounded corner's radius comically
// small relative to the box in proportion terms once `bgScale` shrunk it
// for a real viewport, on top of an apparent rendering issue where the
// corner wasn't clipping visibly at all -- matching this file's own
// height to Figma's actual (shorter) mask height is the correct fix
// either way, independent of that rendering question.
const HERO_MASK_HEIGHT = 1079;
// The season-title/kit-detail panel's own Figma offset, `left-[38px]`
// inside the grid's MIDDLE column -- which itself starts at x=164 (the
// first, sidebar column's own width, see the grid's `gridTemplateColumns`
// below), not at the hero canvas's own x=0. Now that this panel is its
// own fixed layer instead of a grid child, its `left` has to be measured
// from that same x=0 directly, so the 164px the grid used to contribute
// for free is folded in here -- omitting it (an earlier version here did)
// put the panel 164px too far left, overlapping ProfileSidebar's own
// icons instead of sitting clear of them the way Figma intended.
const TITLE_PANEL_LEFT = 164 + 38;
const TITLE_PANEL_TOP = 150;
// Per the user's own direct call: the kit-DETAIL panel specifically (not
// the plain season title) sits noticeably lower than Talking_Bar's own
// top edge -- moved up to align with it instead, matching the SAME
// `top-[58px]`/`top-[59px]` row every other sticky element on this page
// (Talking_Bar, ProfileSidebar's back button, the "領獎中心" title row)
// already shares. Figma's own reference (node 667:15723, y=148) puts it
// at essentially the same spot as the plain title block (150) -- this is
// a deliberate deviation from that reference, not a bug fix.
const DETAIL_PANEL_TOP = 58;

// Figma's own reference screen (657:18891, "這是登陸之後已經充值後等級8的畫面"
// per the user's own direct call) is this project's usual hardcoded demo
// member -- same Lv.8 / 700 of 1,500 exp / 10,000 continuous deposit
// ProfileContent's own VipCard already shows for its logged-in state, not
// independently invented numbers for this page.
const MEMBER_LEVEL = 8;
const MEMBER_EXP = 700;
const MEMBER_MAX_EXP = 1500;
const MEMBER_CONTINUOUS_DEPOSIT = "10,000";
// Figma's own VIP_Card export (node 210:19103) uses a DIFFERENT crystal
// crop from the square-ish `kit.image` renders RewardKitCard/
// RewardKitDetailPanel use -- a tall 736x1308 image specifically composed
// for this card's own narrow bleed slot, not the same asset reused at a
// different aspect ratio (an earlier version here reused `kit.image`
// directly, which `object-cover` then had to crop far more aggressively
// than Figma's own export ever needed, confirmed wrong via the user's own
// side-by-side screenshot). Only exists for the Lv.1-13 bracket (matching
// this project's established "only bracket 0 has real per-kit art"
// limitation, see RewardKit's own comment) -- not swapped per current
// tier the way the small card art is.
const VIP_CARD_CRYSTAL_IMAGE = "/assets/rewards/vip-card-crystal.png";

// The background character art and the Reward_Kit row both need to stay
// visible with no scrolling and no drift, per the user's own direct call --
// but nothing ELSE on this page (Sidebar/Talking_Bar/the grid) should
// change from how every other page already behaves. Pulling just these two
// pieces out to `position: fixed` layers (below) does that without
// touching anything else, but `position: fixed` measures against the REAL
// viewport, not ScaleToFit's own zoomed coordinate space -- so they can't
// just read ScaleToFit's `useScale()` context (an earlier version of this
// file tried that; zoom's actual interaction with fixed descendants is
// murky enough across engines that it isn't worth relying on). This
// recomputes the same width-only scale directly off window.innerWidth
// instead, entirely independent of ScaleToFit.
function useFixedLayerScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      setScale(Math.min(1, window.innerWidth / HERO_WIDTH));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

const BOTTOM_GAP = 20;
// The plain card row's own natural height (262px card + 20px gap + ~24px
// level-point row) -- the reference this menu's OWN scale shrinks against
// below. Not the detail panel's height (taller, and varies per kit): that
// panel leans on its own `maxHeight` + internal scroll instead (see
// RewardKitDetailPanel's own comment) rather than needing this shared
// scale to chase whichever content happens to be showing.
const CARD_ROW_HEIGHT = 262 + 20 + 24;

// The bottom Reward_Kit row doubles as this page's own "bottom nav" (see
// its own comment below) -- per the user's own direct call it should
// shrink proportionally on a short viewport, unlike the background above
// (which deliberately crops instead of shrinking, per that SAME user's
// earlier direct call not to make the whole page rescale for height).
// Also returns the real leftover height in real screen px, which the
// detail panel's own `maxHeight` prop needs converted back to this row's
// OWN design-space coordinates (divided by `scale` below) since it lives
// inside this row's own zoomed subtree.
function useBottomMenuLayout() {
  const [state, setState] = useState({ scale: 1, availableHeight: CARD_ROW_HEIGHT });

  useEffect(() => {
    function update() {
      const widthScale = Math.min(1, window.innerWidth / HERO_WIDTH);
      const availableHeight = Math.max(0, window.innerHeight - BOTTOM_GAP);
      const heightScale = Math.min(1, availableHeight / CARD_ROW_HEIGHT);
      setState({ scale: Math.min(widthScale, heightScale), availableHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return state;
}

function useViewportSize() {
  const [size, setSize] = useState({ width: HERO_WIDTH, height: HERO_HEIGHT });

  useEffect(() => {
    function update() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

// Per the user's own direct call ("動態也要跟隨阿"): now that the page from
// screen 1 to screen 2 (see the bottom menu's own comment) is an actual
// scroll, the background can't just sit perfectly rigid on screen the
// whole time -- it needs to visibly react to that same scroll, not just
// the menu. A light parallax drift (translateY, a fraction of scrollY)
// on the background's own sized box gives it that "follows the scroll"
// motion without touching its existing centering/crop behavior at all.
function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function update() {
      setScrollY(window.scrollY);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrollY;
}

// Wires up click-and-drag scrolling on a plain `overflow-x-auto` element --
// per the user's own direct call, that's the actual reason the bottom
// Reward_Kit row's last card read as unreachable with a mouse: an
// `overflow-x-auto` div has no drag-to-scroll behavior of its own on
// desktop (only real touch/trackpad horizontal swipes scroll it natively),
// and `no-scrollbar` hides the one other way to reach it by dragging a
// visible scrollbar thumb. `moved` tracks whether the pointer actually
// traveled past a small threshold during the down-to-up span; the
// capturing click listener uses it to swallow the click a drag produces,
// so dragging the row never also fires whichever card's button the
// pointer happened to land on.
function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const drag = { down: false, startX: 0, startScrollLeft: 0, moved: false };

    function onPointerDown(e: PointerEvent) {
      drag.down = true;
      drag.moved = false;
      drag.startX = e.clientX;
      drag.startScrollLeft = el!.scrollLeft;
    }
    function onPointerMove(e: PointerEvent) {
      if (!drag.down) return;
      const dx = e.clientX - drag.startX;
      if (Math.abs(dx) > 3) drag.moved = true;
      el!.scrollLeft = drag.startScrollLeft - dx;
    }
    function onPointerUp() {
      drag.down = false;
    }
    function onClickCapture(e: MouseEvent) {
      if (drag.moved) {
        e.stopPropagation();
        e.preventDefault();
        drag.moved = false;
      }
    }

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return ref;
}

// Figma "05_WU88-H-PC-Profile-Page" node 648:14692 ("領獎中心" / Reward
// center, "第 2 季 VIP 盛典"). Same 1728px fixed-canvas + ScaleToFit
// convention as every other page, but unlike ProfileContent this frame is
// one single hero screen (no scrollable rows below it) -- so instead of
// ProfileContent's 3-column grid of independently-scrolling sections, this
// reuses ProfileSidebar/TalkingBar positioned directly over one full-bleed
// background, matching Figma's own flat "everything absolutely positioned
// on one canvas" structure.
//
// The background is the two-stage Premiere render described in
// BackgroundSequence's own comment: "01" plays once on load and holds on
// its last frame, "02" (the same continuous shot's remainder) plays once
// this page reaches its own "screen 2" (Figma node 667:15687 -- see
// `isScreenTwo`'s own comment) and then holds on ITS last frame -- moving
// back and forth afterwards does not replay anything, since "02" already
// finished the take. Reachable two ways now, per the user's own direct
// call: scrolling down into screen 2 on its own, or picking a Reward_Kit
// card directly (which still snaps straight there, same as before this
// page could scroll at all).
export default function RewardsCenterContent() {
  const { loggedIn } = useAuth();
  const [selectedKit, setSelectedKit] = useState<number | null>(null);
  const countdown = useCountdown(SEASON_COUNTDOWN_SEED);
  const bgScale = useFixedLayerScale();
  const { scale: menuScale } = useBottomMenuLayout();
  const viewport = useViewportSize();
  const menuScrollRef = useDragScroll<HTMLDivElement>();
  const scrollY = useScrollY();
  // Drives BOTH the background's own "01"->"02" swap and the bottom menu's
  // own reveal off the SAME scroll progress, so the two stay in sync
  // instead of the menu settling somewhere disconnected from wherever the
  // background happens to switch (confirmed live, an earlier `position:
  // sticky` version let the menu's own native "unstuck" flow position land
  // it in the dead middle of the screen, overlapping the season title,
  // rather than resting near the bottom the way it's meant to -- native
  // sticky's "stuck vs. static" transition isn't something this page can
  // precisely aim, so this computes the reveal directly off `scrollY`
  // instead and drives a plain `translateY` with it).
  const SCREEN_TWO_SCROLL_DISTANCE = viewport.height * 0.6;
  const screenTwoProgress = Math.min(1, Math.max(0, scrollY / SCREEN_TWO_SCROLL_DISTANCE));
  // Figma's own two reference frames for this page (648:14692, the plain
  // title/countdown state used throughout, and 667:15687, "Figma's hover/
  // selected page state" already referenced by the detail-panel swap
  // below) ARE screen 1 and screen 2 -- reached by scrolling, not a card
  // click. Purely `screenTwoProgress` now -- an earlier version here also
  // treated `selectedKit !== null` as reaching screen 2 on its own, which
  // meant picking a card (only possible once already ON screen 2, since
  // the bottom menu itself is hidden until then) latched this true
  // PERMANENTLY, even after scrolling back up: confirmed live as the
  // user's own "選取其他選項之後就滾不回去了" -- screen 1 became unreachable
  // by scroll again once any card had ever been clicked. `selectedKit`
  // still selects WHICH kit's panel to show (`effectiveSelectedKit`'s own
  // comment), it just no longer forces screen 2 to stay true regardless
  // of where you've actually scrolled to.
  const isScreenTwo = screenTwoProgress >= 1;

  // Per the user's own direct call: the video should be top-anchored
  // (flush with the mask's own top, never cropping her face) during the
  // WIDE/full-body part of the "01" clip -- once she's close enough that
  // the shot is a medium/close-up framing, it pans up by a flat
  // `CLOSE_UP_PAN_SHIFT` (below) instead, since by then her face fills
  // most of the frame's own height and staying top-anchored would start
  // cutting into her chin instead of leaving room past it.
  // BackgroundSequence has no exposed playback clock (it's a plain
  // autoplaying `<img>`, not a `<video>` with `currentTime`), so this
  // approximates "has the close-up part started" with a plain timer keyed
  // to real elapsed time since THIS stage last started playing --
  // confirmed against the source frames (D:\works\09_WU88-H\source\public\
  // Premiere\Bonus_Charactor\01): still a full-body shot through roughly
  // frame 100 (~3.3s @ 33ms/frame), clearly medium/close by frame 140
  // (~4.6s) -- ~4.3s (frame ~130) sits in between. "02" (the screen-2
  // clip) continues the SAME close framing "01" ends on from its own
  // frame 0, so it's always treated as close-up, no timer needed.
  const CLOSE_UP_DELAY_MS = 4300;
  const [videoIsCloseUp, setVideoIsCloseUp] = useState(false);
  useEffect(() => {
    if (isScreenTwo) {
      // Syncing from an external system (real elapsed time / which video
      // clip is playing), not mirroring state that was already correct --
      // `isScreenTwo` flipping is exactly the moment "02"'s own always-
      // close-up framing starts, so this has to fire immediately, not on
      // some later render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVideoIsCloseUp(true);
      return;
    }
    // Same reasoning: landing back on screen 1 remounts "01" (see below)
    // from its own frame 0, so the wide-shot framing genuinely restarts
    // too, not just this timer.
    setVideoIsCloseUp(false);
    // `key={stage}` on BackgroundSequence remounts (and restarts) "01"
    // from its own frame 0 every time we land back on screen 1, so this
    // timer has to restart right along with it, not just fire once ever.
    const timer = setTimeout(() => setVideoIsCloseUp(true), CLOSE_UP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isScreenTwo]);

  // The menu's own reveal is a plain on/off flip driven by `isScreenTwo`,
  // NOT `screenTwoProgress` directly -- an earlier version here tracked
  // scroll continuously (1:1 with every pixel scrolled), which the user
  // read as the row feeling dragged/"卡上來" rather than a clean float-up.
  // Screen 1 keeps it fully hidden the entire time regardless of how far
  // you've scrolled short of actually reaching screen 2; once there, a CSS
  // transition (on the element's own className below) animates it into
  // place on its own instead of being pinned to scroll position.
  const screenTwoReveal = isScreenTwo ? 1 : 0;
  // The detail panel Figma shows on 667:15687 is specifically the FIRST
  // bracket's (index 0) -- scrolling into screen 2 without having clicked
  // any particular card yet defaults to that same kit, matching the
  // reference exactly rather than leaving screen 2 with no detail panel
  // at all. Only resolves to a kit at all while actually `isScreenTwo` --
  // `selectedKit` on its own (e.g. still set from a previous visit to
  // screen 2) never shows a panel back on screen 1, same fix as
  // `isScreenTwo`'s own comment.
  const effectiveSelectedKit = isScreenTwo ? (selectedKit ?? 0) : null;

  // Per the user's own direct call, only the bracket matching the member's
  // OWN current level renders large in the bottom row (see RewardKitCard's
  // own comment) -- and only once actually logged in and recharged
  // (`loggedIn` doubles for both here, same as everywhere else on this
  // page already gates on it), not for a guest browsing the reward tiers.
  const currentKitIndex = REWARD_KITS.findIndex((kit) => MEMBER_LEVEL >= kit.levelStart && MEMBER_LEVEL <= kit.levelEnd);

  // Per the user's own direct call ("reward kit要跟下方的數字剛好居中",
  // "數字跟數字中間的線也要等距拉長"), the Level_line rail below the
  // Reward_Kit row needs to actually line up with the cards above it --
  // an earlier version here laid the rail out as its own independent flex
  // row (a flat `ml-[96px]` plus a fixed 212px line asset repeated 7
  // times), which had no relationship at all to the real card widths/gaps
  // above it, and visibly drifted out of alignment by the time the row
  // reached the LOGGED-IN "current" card's own `CURRENT_KIT_SCALE` zoom
  // (274px instead of the plain 216px every other card uses).
  // `kitCardCenters[i]` is the actual rendered x-center of REWARD_KITS[i]'s
  // own card, computed the same way the flex row above lays them out itself
  // (running sum of each card's own width, `PLAIN_KIT_CARD_WIDTH` unless
  // it's the current-level card, plus `KIT_CARD_GAP` between them) --  so
  // each LevelPoint can be positioned at the exact center of the card it
  // corresponds to, and each LevelLine stretched to the exact distance
  // between one point and the next instead of a flat guessed width.
  const { kitCardCenters, kitRowWidth } = (() => {
    const centers: number[] = [];
    let left = 0;
    for (let i = 0; i < REWARD_KITS.length; i++) {
      const width = loggedIn && i === currentKitIndex ? PLAIN_KIT_CARD_WIDTH * CURRENT_KIT_SCALE : PLAIN_KIT_CARD_WIDTH;
      centers.push(left + width / 2);
      left += width + KIT_CARD_GAP;
    }
    return { kitCardCenters: centers, kitRowWidth: left - KIT_CARD_GAP };
  })();

  // The season-title/kit-detail panel used to be plain content inside
  // ScaleToFit's own scrolling/zoomed subtree -- but per the user's own
  // direct call (echoing the background/bottom-menu treatment above) its
  // position needs to stay fixed too, so it's never one scroll away from
  // view. It's now a THIRD fixed layer, positioned with the same `bgScale`
  // as the background it overlays (so it visually tracks the character art
  // consistently, rather than the height-shrinking `menuScale` the bottom
  // row uses) -- see the layer's own JSX comment for the actual position
  // math. `maxHeight` still caps its own height against whatever room is
  // actually left in the real viewport below it, with internal scroll for
  // the rest (see RewardKitDetailPanel's own comment), independent of
  // `bgScale`'s crop-not-shrink behavior.
  // `heroBoxLeft`/`HERO_BOX_TOP` are the background mask's own position
  // (see that layer's JSX) -- reused here purely so this panel's `left`
  // offset lines up with the character art beneath it. `HERO_BOX_TOP` is a
  // flat 0 (its own comment below), so this panel's own `top` always lands
  // at exactly `TITLE_PANEL_TOP`/`DETAIL_PANEL_TOP` scaled -- no viewport-
  // height floor math needed any more now that the mask itself never moves.
  const heroBoxLeft = Math.max(0, (viewport.width - HERO_WIDTH * bgScale) / 2);
  // Per the user's own direct, repeated call ("外圈遮罩應該維持固定位子不動才對
  // 會動的是遮罩裡面的影片", then explicitly "而且我不是早說遮罩不用置中嗎?" once
  // an earlier viewport-height-based centering formula was still driving
  // this) -- the mask's own top is a flat, always-0 constant, not derived
  // from viewport height at all. Even "unclamped symmetric centering"
  // still moved the mask up/down as the window resized; only a literal
  // constant actually satisfies "固定位子不動". This also fixes a real,
  // confirmed-live side effect: the mask's own rounded-tl-[50px] corner
  // (what the user's own Figma reference shows behind the back button --
  // "那個圓角不就是遮罩的形狀嗎?") was only ever visible in the narrow band of
  // viewport heights where a centered top happened to land near 0 -- on
  // most real windows it either floated below a gap (short mask, tall
  // viewport) or scrolled its own corner off past the top entirely (tall
  // mask, short viewport), so "the corner disappeared" was true almost
  // everywhere. Pinned at a flat 0, the corner sits reliably right next to
  // the back button on every viewport height.
  const HERO_BOX_TOP = 0;
  const CLOSE_UP_PAN_SHIFT = 257;
  const videoPanShift = CLOSE_UP_PAN_SHIFT * bgScale;
  const titlePanelScreenLeft = heroBoxLeft + TITLE_PANEL_LEFT * bgScale;
  // `DETAIL_PANEL_TOP` (its own comment) only once the detail panel is
  // actually the thing showing in this slot -- the plain season title
  // stays at its own Figma-matched `TITLE_PANEL_TOP`.
  const titlePanelTopValue = effectiveSelectedKit !== null ? DETAIL_PANEL_TOP : TITLE_PANEL_TOP;
  const titlePanelScreenTop = titlePanelTopValue * bgScale + HERO_BOX_TOP;
  // Capped against the bottom MENU's own top edge, not the raw viewport
  // bottom -- that menu is a separate fixed layer occupying its own real
  // screen space (`CARD_ROW_HEIGHT * menuScale` tall, `BOTTOM_GAP` off the
  // viewport bottom), invisible to a plain "how much viewport is left
  // below this panel" calc. Confirmed live: on a wide-but-not-very-tall
  // window, the fully-uncropped detail panel (no scroll needed by the OLD
  // formula) rendered tall enough to visually overlap the Reward_Kit row
  // sitting underneath it instead of capping/scrolling sooner.
  const menuTopScreenY = viewport.height - BOTTOM_GAP - CARD_ROW_HEIGHT * menuScale;
  const detailPanelMaxHeight = Math.max(0, menuTopScreenY - BOTTOM_GAP - titlePanelScreenTop) / (bgScale || 1);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f4f4]">
      {/* A fixed, viewport-centered backdrop, not part of the scrolling
          page flow below -- per the user's own direct call, the character
          has to stay centered (both horizontally AND vertically) at any
          window size, cropping symmetrically instead of anchoring to the
          top-left the way this page's fixed-1728 canvas otherwise does.
          `overflow-hidden` on the outer `inset-0` layer is what actually
          produces that symmetric crop: the sized box below it is centered
          by flexbox and simply clipped at the real viewport's edges
          whenever it's taller/wider than the window.
          `pointer-events-auto` + `onClick` here, not `-none` -- per the
          user's own direct call, clicking any blank/background area
          (the character art itself, or the letterboxed margin around it)
          deselects back to the plain title/countdown view. Safe to put
          directly on this whole layer without any card/sidebar/Talking_Bar
          click accidentally triggering it too: none of those live INSIDE
          this background layer's own React tree (each is its own sibling
          fixed layer, or sits in the separately-scrolling grid), so there's
          no bubbling to guard against -- whatever a click here actually
          landed on really was empty background, not another control. */}
      <div
        className="pointer-events-auto fixed inset-0 z-0 overflow-hidden"
        onClick={() => setSelectedKit(null)}
      >
        {/* `left`/`top`, not `flex items-center justify-center` -- per the
            user's own repeated direct call, this box (the "遮罩" -- mask --
            identified by its own rounded-tl-[50px] corner) sits at a flat
            constant position (`heroBoxLeft`/`HERO_BOX_TOP`, their own
            comment above) and never moves for any reason, viewport height
            included -- it should "單純做遮罩的功能" (simply act as a mask),
            with the video free to control its own position inside it
            independently. */}
        <div
          className="absolute shrink-0 overflow-hidden bg-[#f4f4f4]"
          style={{
            width: HERO_WIDTH * bgScale,
            height: HERO_MASK_HEIGHT * bgScale,
            left: heroBoxLeft,
            top: HERO_BOX_TOP,
            // 60, matching every other /profile/* page's own
            // `rounded-tl-[60px]` corner literally (ProfileContent's own
            // ident block), not this page's own Figma frame's literal 50 --
            // per the user's own direct call ("不管他們原理如何 重點領獎中心左上角
            // 的樣式跟其他頁就是不一樣"), visual consistency with the rest of the
            // site wins over exactly matching this one frame's own number.
            // Flat/unscaled (not `bgScale * 60`) for the same reason a flat
            // 50 replaced a scaled 50 two commits ago: `/profile`'s own
            // 60px, being inside ScaleToFit's zoomed subtree, shrinks below
            // Top_bar's own unscaled 38px height (confirmed live) at any
            // viewport narrower than ~1094px, at which point it's not
            // visible at all -- reusing that same scaled approach here would
            // just reproduce the same disappearing act instead of fixing it.
            borderTopLeftRadius: 60,
          }}
        >
          {/* The video's own `top` carries all of this box's reframing
              logic -- top-anchored (flush with the mask's own top) during
              the wide shot, panned up by the full `videoPanShift` once
              close-up. `object-cover` on this box's own exact aspect ratio
              leaves ZERO vertical slack to pan within on its own (proven
              live: height is always the constraining dimension for this
              box, so the source clip already fills the box's full height
              with no room to slide) -- so this wrapper is deliberately
              rendered `videoPanShift` px TALLER than the mask box itself,
              giving the video that much genuine vertical overflow to pan
              through (clipped by the mask's own `overflow-hidden`).
              `duration-1000 ease-in-out`, not `duration-700 ease-out` --
              per the user's own direct call, an earlier version's bigger
              pan distance read as an abrupt jump at the shorter
              duration/`ease-out` (which front-loads nearly all of a
              transition's motion into its first moment). `ease-in-out`
              spreads the motion out (slow start, faster middle, slow
              finish) and the longer duration gives it more time to cover,
              together reading as a smooth pan instead of a jump. */}
          <div
            className="absolute inset-x-0 transition-[top] duration-1000 ease-in-out"
            style={{
              top: videoIsCloseUp ? -videoPanShift : 0,
              height: HERO_HEIGHT * bgScale + videoPanShift,
            }}
          >
            <BackgroundSequence stage={isScreenTwo ? "selected" : "idle"} className="absolute inset-0 size-full object-cover" />
          </div>
          <div
            className="absolute inset-x-0 bottom-0"
            style={{ height: 250 * bgScale, background: "linear-gradient(to bottom, rgba(255,255,255,0), white)" }}
          />
        </div>
      </div>

      {/* A second fixed, viewport-anchored layer -- the season-title/kit-
          detail panel (top-left over the character art), per the user's
          own direct call to give it a fixed position too, matching the
          background/bottom-menu treatment above. Positioned directly
          against this OUTER `inset-0` layer (real screen px, `heroBoxLeft`/
          `titlePanelScreenTop` already computed above) rather than nested
          inside a hero-sized box the way the background layer is -- that
          box's own top goes off-screen once it's taller than the viewport
          (intentional there, see its own comment), which silently carried
          this panel off-screen right along with it before `titlePanel
          ScreenTop`'s own clamp existed. */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {/* Positioning (`left`/`top`, real screen px) and scaling (`zoom`)
            need to be on TWO SEPARATE nested elements, not the same one --
            confirmed live that `zoom` on the SAME element as its own
            `left`/`top` scales that offset a SECOND time too (measured
            `top: 78.3px` rendering at an actual 40.9px, exactly 78.3 times
            the zoom factor), which is why the bottom menu's own row
            already keeps its `width`-only real-px wrapper and its `zoom`
            wrapper as two separate divs -- this now matches that. */}
        <div className="pointer-events-auto absolute" style={{ left: titlePanelScreenLeft, top: titlePanelScreenTop }}>
          <div style={{ zoom: bgScale } as React.CSSProperties}>
          {/* Figma's hover/selected page state (node 667:15687, this
                page's own "screen 2" -- see `effectiveSelectedKit`'s own
                comment) swaps this ENTIRE block for Reward_Kit's own
                detail panel (image + level-by-level USDT table) -- it
                doesn't sit alongside the season title, it replaces it in
                the same top-left slot. Reverts to the plain title/
                countdown block back on screen 1 (there's no toggle-off
                click target of its own here; picking a different card
                just swaps which kit's panel shows). */}
            {effectiveSelectedKit !== null ? (
              <RewardKitDetailPanel kit={REWARD_KITS[effectiveSelectedKit]} maxHeight={detailPanelMaxHeight} />
            ) : (
              <>
              <div className="flex w-[464px] flex-col items-start gap-[20px]">
                <div className="flex w-full flex-col items-start justify-center gap-[10px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="flex items-center justify-center rounded-[20px] border-2 border-solid border-[#3e4140] px-[20px] py-[10px]">
                      <p className="whitespace-nowrap text-[40px] font-bold leading-[36px] tracking-[0.36px] text-[#3e4140]">第 2 季</p>
                    </div>
                    <p className="whitespace-nowrap text-[40px] font-bold leading-[36px] tracking-[0.36px] text-[#3e4140]">VIP 盛典</p>
                  </div>
                  <div className="flex items-start gap-[10px] whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[0.15px] text-[#3e4140]">
                    <p>2024年10月17日（GMT 09:00）</p>
                    <p>～</p>
                    <p>2024年11月17日（GMT 09:00）</p>
                  </div>
                </div>

                {/* `bg-white/50` added on top of Figma's own raw export --
                    that export is just a border + `backdrop-blur-[10px]`
                    with no fill at all (a flattened Background Blur EFFECT
                    layer, not a solid), which over this page's own vivid,
                    busy character animation reads as a broken half-see-
                    through box with a hard color seam rather than a frosted
                    pill. Same white/50 tint this project's own countdown
                    pill already uses elsewhere (PromotionCard's Large
                    variant) makes it read as one coherent frosted-glass
                    surface regardless of what's moving behind it. */}
                <div className="flex w-full flex-col items-start overflow-hidden rounded-[20px] border border-solid border-[#a2a2a2] bg-white/50 px-[20px] py-[14px] backdrop-blur-[10px]">
                  <div className="flex w-full items-center justify-between whitespace-nowrap">
                    <p className="text-[16px] font-medium leading-[24px] tracking-[0.15px] text-[#3e4140]">活動倒數：</p>
                    <div className="flex items-center gap-[20px]">
                      <TimeUnit value={countdown.days} unit="天" />
                      <TimeUnit value={countdown.hours} unit="時" />
                      <TimeUnit value={countdown.minutes} unit="分" />
                      <TimeUnit value={countdown.seconds} unit="秒" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Figma "VIP_Card" (node 210:19103) -- shown alongside the
                  season title, per the user's own direct call, only once
                  actually logged in and recharged (`loggedIn`, same gate
                  the rest of this project's logged-in member content
                  already uses). Sits 40px below the title block's own
                  bottom edge (Figma's own 356 top minus 316, the title
                  block's own 150 top + 166 tall) -- a plain `mt-[40px]`
                  here, not a shared flex gap with the block above it,
                  since that block's own internal title/countdown gap is a
                  smaller 20px, not this same 40. */}
              {loggedIn && (
                <div className="mt-[40px]">
                  <RewardVipCard
                    level={MEMBER_LEVEL}
                    currentExp={MEMBER_EXP}
                    maxExp={MEMBER_MAX_EXP}
                    continuousDeposit={MEMBER_CONTINUOUS_DEPOSIT}
                    crystalImage={VIP_CARD_CRYSTAL_IMAGE}
                  />
                </div>
              )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Plain fit-to-width -- same ScaleToFit call, no special props, as
          every other page (home/casino/sports/promotions/profile/wallet).
          This page scrolls on a short viewport exactly the way those
          pages already do; it isn't a one-off exception with its own
          scale/no-scroll rule. */}
      <ScaleToFit>
        <div className="sticky top-0 z-20">
          <TopBar onlineCount="900" totalReward="10,000,000" announcements={topBarAnnouncements} />
        </div>

        {/* Same corner-notch trick every other /profile/* page uses (see
            ProfileContent's own identical block) -- without it, Top_bar's
            own flat bottom edge sits flush above the white sidebar
            backdrop's `rounded-tl-[60px]` corner below, reading as a small
            square step instead of one continuous curve. */}
        <div className="sticky top-[38px] left-0 z-30 h-0">
          <div
            className="pointer-events-none size-[60px]"
            style={{ background: "radial-gradient(circle at 100% 100%, transparent 60px, #f4f4f4 60px)" }}
          />
        </div>

        {/* `relative`, NOT the hero's own fixed h-1317/overflow-hidden --
            those live on the fixed background layer above instead (see its
            own comment for why it has to sit outside this zoomed subtree
            entirely). Talking_Bar computes its own height straight off the
            real window (see its own panelHeight state, independent of any
            parent), same as it does on every other page -- on a browser
            window taller/narrower than the 1728x900 design ratio that's
            routinely MORE than 1317px. Foreground content (title row, VIP
            block) still uses plain `top-*` offsets straight off Figma's
            own numbers, which land in the exact same place either way.
            `pointer-events-none` on this div itself too, not just its grid
            child below -- this div has no visible content of its own left
            (the background/title-panel/Reward_Kit row all moved out to
            their own fixed siblings), but its own box still sat in front
            of that fixed background layer's `z-0` in paint order, silently
            swallowing every click meant for the background's own new
            click-to-deselect handler (confirmed live via
            `elementFromPoint`, which kept returning this exact div instead
            of the background layer for a click over the character art).
            Its own grid child already opts specific pieces back in with
            `pointer-events-auto` (sidebar/title row/Talking_Bar), so
            nothing here loses its own interactivity. */}
        <div className="relative pointer-events-none">
          {/* Per the user's own direct call, after going back and forth on
              this exact question across several turns: the SHAPE (a box
              with a top-left border-radius) is identical whether it's used
              as a plain background or as a mask over moving video content
              ("白底的形狀跟遮罩的形狀製作有不一樣嗎? 不都是依樣畫出形狀") -- but
              the same 60px curve cut into a continuously-changing video
              frame (color, hair texture always shifting) reads far less
              clean than the identical curve cut into a flat white fill,
              confirmed directly against the user's own "乾淨俐落" white-
              backdrop screenshot vs. the video-corner version. Restored
              here for exactly that reason: a plain white `rounded-tl-[60px]`
              backdrop, scoped to just the sidebar's own 164px column so it
              never covers the video in the columns where it needs to stay
              visible (this grid already sits at `z-10`, above the video's
              `z-0` -- painting white across the FULL grid width would hide
              the video everywhere, not just behind the sidebar). Positioned
              with no explicit z-index (z:auto) so DOM order (it comes AFTER
              the video in the document) breaks the tie in its favor against
              the video's own `z-0`, while still sitting below MinPanel
              Height's own explicit `z-10` right after it, so the sidebar
              icons stay on top of it. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[164px] rounded-tl-[60px] bg-white" />
          {/* `pointer-events-none` here too, not just on the content column
              below -- with only the content column opted out, a click over
              any part of ITS transparent area fell through past it to the
              GRID CONTAINER ITSELF (this element), which still caught it
              since IT has no pointer-events override of its own: skipping a
              `pointer-events-none` child hands the hit to whatever the
              browser finds next at that point, and that's this element's
              own box, not the unrelated OUTER sibling (the Reward_Kit row,
              a cousin of this grid, not a descendant of the content column)
              -- confirmed live via `elementFromPoint`, which returned this
              exact div's own className for a click over the row below.
              ProfileSidebar/Talking_Bar's own wrappers opt back in with
              `pointer-events-auto`, same as content's own visible children
              already do. */}
          <MinPanelHeight className="relative z-10 grid pointer-events-none" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            {/* `sticky`, same mechanism ProfileSidebar's wrapper uses on
                EVERY other page -- not `relative`. This page not scrolling
                (via ScaleToFit's `fitHeight` below) already gets the actual
                requirement (sidebar never scrolls away, nothing to scroll
                to anyway) without this wrapper itself needing to behave
                differently from everywhere else it's used. `sticky` does
                leave the back button a few px out of vertical center with
                the title row next to it (a quirk that already exists
                identically on /profile itself, not something unique to
                this page), which is the tradeoff for staying consistent
                rather than introducing a page-specific positioning rule. */}
            <div className="pointer-events-auto sticky top-[59px] z-10 self-start justify-self-start pl-[30px]">
              <ProfileSidebar />
            </div>

            {/* `pointer-events-none` on this whole column -- now that the
                Reward_Kit row moved out to its own full-bleed sibling (see
                that div's own comment on why), THIS column no longer has
                any visible content below the VIP block, but it's still a
                `relative` grid item that stretches to the grid row's full
                height by default (same as ProfileSidebar/Talking_Bar would
                if they didn't already opt out with `self-start`). Left as
                the default `auto`, that invisible box -- part of the grid's
                own `z-10` -- silently ate
                every click and wheel-scroll meant for the cards underneath
                it, even though nothing was visibly there to click. Each
                actual visible child below opts back in with its own
                `pointer-events-auto`. */}
            <div className="relative pointer-events-none">
              <div className="pointer-events-auto sticky top-[59px] z-10 flex w-full items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <img alt="" src={withBasePath("/assets/rewards/icon-title.svg")} className="size-[25px]" />
                  <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">領獎中心</p>
                </div>
                <TopUp />
              </div>
            </div>

            <div className="pointer-events-auto sticky top-[58px] z-10 ml-[20px] self-start">
              <TalkingBar messages={talkingBarMessages} friends={talkingBarFriends} simulatedMessages={talkingBarSimulatedMessages} />
            </div>

            {/* A plain invisible spacer, INSIDE this same grid -- not a
                sibling after `</ScaleToFit>` (an earlier version here put
                it there instead). `position: sticky` only ever stays stuck
                within its own containing block's own height, which for
                ProfileSidebar/Talking_Bar above is this grid itself
                (`relative`, making it their containing block) -- a spacer
                OUTSIDE the grid grows the page's own scrollable height
                just fine, but doesn't grow THIS box, so both of them ran
                out of room to stay stuck partway through the screen-1-to-
                screen-2 scroll and scrolled away instead of staying fixed
                in place, exactly what the user's own screenshot showed and
                said shouldn't happen ("那邊本來就固定位子"). Auto-placed into
                its own new grid row below the row ProfileSidebar/Talking_
                Bar/content already occupy, so it adds height without
                disturbing that row's own layout. Sized in this zoomed
                subtree's own design-space units (divided by `bgScale`, not
                a real screen px value directly) so it still resolves to
                the SAME real height needed after the ambient `zoom`
                scales it back down. */}
            <div
              className="pointer-events-none"
              style={{ height: (SCREEN_TWO_SCROLL_DISTANCE + 300) / (bgScale || 1) }}
            />
          </MinPanelHeight>

        </div>
      </ScaleToFit>

      {/* Fixed to the bottom of the real viewport, like a mobile bottom-nav
          bar -- per the user's own direct call, this row has to stay
          visible without scrolling, not just sit at a fixed design-space
          `top` offset inside the scrolling page above. Independent of
          ScaleToFit the same way the background layer above is (see its
          own comment for why), but scaled with its OWN `menuScale` --
          this row shrinks proportionally when the viewport is too SHORT
          for it, unlike the background (which deliberately crops instead
          of shrinking, per that same user's earlier direct call). `zoom`
          rather than `transform: scale()` -- this row is still
          horizontally scrollable when there are more kits than fit on
          screen, and `transform` only repaints smaller without shrinking
          the element's actual layout/scroll box to match, which would
          leave the scrollable range wrong at any scale other than 1 (the
          exact reason ScaleToFit itself uses `zoom` for the whole page
          instead of `transform`). Horizontally centered to match the
          background layer's own centering, with the same `pl-[164px]`
          Figma offset preserved inside so the row still starts under
          where the sidebar column sits. `z-[5]` stays BELOW the grid's own
          `z-10` (Talking_Bar included) on purpose -- per the user's own
          direct call, this row belongs behind the chat panel. The actual
          click-drag problem was never stacking order or reach: a mouse has
          no way to drag-scroll a plain `overflow-x-auto` div (no visible
          scrollbar either, `no-scrollbar` hides it) -- confirmed by the
          user's own report of not being able to slide it with the cursor
          at all. `useDragScroll` below wires up click-and-drag scrolling
          directly, so the last card is reachable by sliding the row
          itself, exactly like the rest of this row's own touch/trackpad
          users could already do. */}
      {/* Back to `position: fixed` (an earlier version here tried `sticky`
          instead -- see `screenTwoProgress`'s own comment for why that
          didn't work), with a `translateY` driven directly by
          `screenTwoReveal`: 100% (fully below its own resting spot, i.e.
          off-screen under the viewport's own bottom edge) at scroll 0, 0%
          (its normal `bottom-[20px]` resting position) once on screen 2 --
          continuously interpolated with the scroll itself short of an
          explicit card click, which snaps straight to 0% instead (`screen
          TwoReveal`'s own comment) the same way clicking already jumped
          straight to the panel before scrolling existed here at all.
          Exactly the "floats up from below the screen" the user asked
          for, with nothing left to native sticky/flow positioning to get
          wrong. */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[20px] z-[5] flex justify-center transition-transform duration-500 ease-out"
        style={{
          // `+ Npx`, not just the `N%` alone -- `%` here resolves against
          // this element's OWN height, so shifting by exactly 100% only
          // clears it back to its resting `bottom-[20px]` position, not
          // the full 20px past that needed to leave the viewport
          // entirely. Confirmed live: without it, a ~20px sliver of the
          // row's own top edge stayed visible at scrollY 0.
          transform: `translateY(calc(${(1 - screenTwoReveal) * 100}% + ${(1 - screenTwoReveal) * 20}px))`,
        }}
      >
        <div
          ref={menuScrollRef}
          className="no-scrollbar pointer-events-auto cursor-grab overflow-x-auto overflow-y-hidden active:cursor-grabbing"
          style={{ width: HERO_WIDTH * menuScale }}
        >
          <div className="flex w-max flex-col gap-[20px] pl-[164px]" style={{ zoom: menuScale } as React.CSSProperties}>
            <div className="flex items-end gap-[20px]">
              {REWARD_KITS.map((kit, index) => (
                <RewardKitCard
                  key={`${kit.name}-${index}`}
                  kit={kit}
                  // Per the user's own direct call: the selected-glow card
                  // frame belongs ONLY to the paying member's own current
                  // level tier, permanently, once logged in -- not to
                  // whichever card someone happens to have clicked. Clicking
                  // ANY card (including this one) still opens its own detail
                  // panel via `onSelect`/`selectedKit`, but never changes
                  // this prop -- every other card, and every card at all
                  // for a guest with no level, stays on the plain default
                  // frame no matter what gets clicked.
                  selected={loggedIn && index === currentKitIndex}
                  current={loggedIn && index === currentKitIndex}
                  onSelect={() => setSelectedKit(index)}
                />
              ))}
            </div>

            {/* Below the Reward_Kit row (262 card height + 20 gap), not
                Figma's own raw top-[1057px] -- that value actually lands
                mid-way THROUGH the card row above, so the level rail
                visually cut across the bottom of the cards instead of
                sitting under them. Moved down per the user's own direct
                visual call on the live page.
                No `ml-`/flex-gap layout of its own any more -- absolutely
                positioned at the real `kitCardCenters` (own comment above)
                instead, since that's what actually keeps every point
                centered under its own card, current-level zoom included,
                rather than a row laid out independently of the cards above
                it. */}
            <div className="relative h-[24px]" style={{ width: kitRowWidth }}>
              {LEVEL_POINTS.map((numeral, i) => {
                // Per the user's own direct call, matching Figma's own
                // example (node 689:16248): a milestone reads as reached
                // once the logged-in member's own level has actually
                // passed it, not just decoration -- same `loggedIn` gate
                // as the VIP card/enlarged kit card above, so a guest
                // never sees any of this rail as "already achieved".
                const achieved = loggedIn && MEMBER_LEVEL >= Number(numeral);
                const center = kitCardCenters[i];
                // The line after point `i` reaches toward the NEXT card's
                // own center (`kitCardCenters[i + 1]`) -- always valid,
                // even for the last point (numeral "82"): REWARD_KITS has
                // one more card (index 7, Lv.93-100) than LEVEL_POINTS has
                // numerals, so the trailing line Figma's own reference
                // still shows after the last point (this file's own
                // established comment on `LEVEL_POINTS`) reaches toward
                // that 8th card's center, same as every other segment.
                const lineEnd = kitCardCenters[i + 1];
                const lineWidth = lineEnd - center - 24;
                return (
                  <div key={i} className="absolute top-0" style={{ left: center - 12 }}>
                    <LevelPoint numeral={numeral} active={achieved} />
                    <div className="absolute left-[24px] top-[2.5px]">
                      <LevelLine active={achieved} width={lineWidth} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
