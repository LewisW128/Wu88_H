"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import BackgroundSequence from "./BackgroundSequence";
import MinPanelHeight from "./MinPanelHeight";
import ProfileSidebar from "./ProfileSidebar";
import { CURRENT_KIT_SCALE, DETAIL_PANEL_TOP_OFFSET, KIT_CARD_GAP, PLAIN_KIT_CARD_WIDTH, REWARD_KITS, RewardKitCard, RewardKitDetailPanel } from "./RewardKit";
import RewardVipCard, { VIP_CARD_CRYSTAL_IMAGE } from "./RewardVipCard";
import ScaleToFit, { useHeightCappedScale } from "./ScaleToFit";
import TalkingBar from "./TalkingBar";
import TopBar from "./TopBar";
import TopUp from "./TopUp";
import { TimeUnit, useCountdown } from "./PromotionCard";
import { withBasePath } from "../lib/asset";
import { MEMBER_CONTINUOUS_DEPOSIT, MEMBER_EXP, MEMBER_LEVEL, MEMBER_MAX_EXP } from "../lib/member";
import { topBarAnnouncements, talkingBarMessages, talkingBarSimulatedMessages, talkingBarFriends } from "../lib/chatMockData";

// Figma "Level_line"/"Level_Point" (node 202:7697 / 203:7706, resized in a
// later revision at node 667:15687/757:17358's own bottom menu -- 34px
// points now, not the original 24px): the season's XP-milestone rail under
// the Reward_Kit row -- 8 points (numerals are this season's own literal
// thresholds, not counters), each followed by a connector line except the
// final "100" (under the last kit).
const LEVEL_POINTS = ["1", "14", "28", "41", "54", "67", "82", "100"];

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
    <div className="relative size-[34px] shrink-0">
      {/* The hexagon (level-point.svg, natural 29.4449x34) needs its own
          6.7%-inset wrapper sized purely by that inset -- putting `size-full`
          on the SAME element as `inset-[0_6.7%]` (an earlier version here
          did) over-constrains the box: an explicit width/height wins over
          the implied one from left+right, so the hexagon rendered at the
          full 34px square instead of 29.44px, stretched and overflowing
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
//
// `progress` (0-1) is how much of this segment the member's own level has
// covered -- it's an experience bar as much as a rail: the segment between
// two milestones fills teal from its start in proportion to how far the
// level has gone between them (Lv.8 sits 7/13 of the way from 1 to 14), so
// the plain gray line shows through the unfilled remainder. 0 is fully gray
// and 1 fully teal, exactly the two states this used to switch between.
function LevelLine({ progress, width }: { progress: number; width: number }) {
  const filled = width * Math.min(1, Math.max(0, progress));
  return (
    <div className="relative h-[19px] shrink-0" style={{ width }}>
      <img alt="" src={withBasePath("/assets/rewards/level-line.svg")} className="absolute left-0 top-0 h-[19px]" style={{ width, maxWidth: "none" }} />
      {filled > 0 && (
        <div className="absolute left-0 top-0 h-[19px] overflow-hidden" style={{ width: filled }}>
          <img alt="" src={withBasePath("/assets/rewards/level-line-active.svg")} className="h-[19px]" style={{ width, maxWidth: "none" }} />
        </div>
      )}
    </div>
  );
}

const CLAIMED_KITS_STORAGE_KEY = "wu88-reward-kits-claimed";

const SEASON_COUNTDOWN_SEED = { days: "08", hours: "08", minutes: "12", seconds: "32" };

const HERO_WIDTH = 1728;
const HERO_HEIGHT = 1317;
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
// (Now shared from lib/member.ts so every page reads the same level.)
// The crystal on this page's VIP card is the Lv.1-13 kit's own rotating gem
// (RewardKit.tsx's `animatedImage` comment), reused per the user's own direct
// call ("是同一組阿") rather than generated from the card's original still
// photo -- see `VIP_CARD_CRYSTAL_IMAGE` in RewardVipCard.tsx, shared with
// /profile's card.

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
// `168 * CURRENT_KIT_SCALE`, not a flat `168` (itself the card's own new
// Figma height, PLAIN_KIT_CARD_WIDTH's own comment -- was `262` before
// that revision) -- the logged-in member's own CURRENT tier card (its own
// `selected`/`current` comment below) renders enlarged via
// `zoom: CURRENT_KIT_SCALE`, and with the row's own `items-end` alignment
// that extra height grows the row's real rendered height upward, not just
// that one card's own box. A flat card height here under-counted the
// row's true height by that same difference -- confirmed live: on a
// short, wide viewport, this constant feeds
// `menuTopScreenY`/`detailPanelMaxHeight` below, which under-estimating
// the row's real height let the detail panel's own `maxHeight` run taller
// than the room actually left above the row, visibly overlapping the two
// panels instead of leaving the intended `BOTTOM_GAP` clearance between
// them. The rest (20px gap + 24px level-point row) is unchanged from the
// row's own actual layout.
// The Reward_Kit row's own height in design space, which
// `PAGE_DESIGN_HEIGHT` folds into the whole page's height budget.
// The detail panel still leans on its own `maxHeight` + internal scroll (see
// RewardKitDetailPanel's own comment) as a fallback for whatever that budget
// doesn't cover, rather than this constant chasing whichever content is showing.
const CARD_ROW_HEIGHT = 168 * CURRENT_KIT_SCALE + 20 + 24;

// `PAGE_DESIGN_HEIGHT` (ScaleToFit.tsx) is derived from THIS page's foreground
// stack: the detail panel's own top (`DETAIL_PANEL_TOP` + its
// `DETAIL_PANEL_TOP_OFFSET`), its box's natural height (Figma's 541px,
// notch and 8-row table included, so the usual 13-level kit never has to
// scroll; the one 14-level kit is 26px taller and scrolls when short), and
// the Reward_Kit row
// below it (`CARD_ROW_HEIGHT`), plus the two `BOTTOM_GAP`-sized clearances
// between/under them (real px, ~50 design px at the scales this lands at).
// Sharing it with every other page keeps the sidebar/chat/top bar the same
// size on all of them. It keeps a short window from stacking the gem/table
// into the row: the whole foreground shrinks together instead, and only
// width changes spread it out.

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
      // Per the user's own direct report: dragging this row was also
      // triggering the browser's own native text/image selection (the
      // whole page flashing into a blue-highlighted "select all" state)
      // alongside the custom scroll -- a plain `pointerdown` on this kind
      // of content (background photo + text panels layered underneath)
      // is exactly what a native drag-select gesture starts from, and
      // nothing here was telling the browser not to. `preventDefault`
      // suppresses that without affecting the click this same pointer
      // sequence still fires afterward (`onClickCapture` below already
      // handles telling an actual drag apart from a real click).
      e.preventDefault();
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
  // Which kits the member has already claimed (their own "立即領取" in the
  // detail panel), by index into REWARD_KITS -- persisted, since a claim
  // has to survive a reload the same way the Day Rewards ones do.
  const [claimedKits, setClaimedKits] = useState<Set<number>>(() => new Set());
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CLAIMED_KITS_STORAGE_KEY);
      // Loaded from localStorage after mount (not a lazy initializer) so the
      // first client render matches the server's markup.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setClaimedKits(new Set(JSON.parse(stored) as number[]));
    } catch {
      /* unreadable storage: start with nothing claimed */
    }
  }, []);
  const claimKit = (index: number) => {
    setClaimedKits((prev) => {
      const next = new Set(prev).add(index);
      localStorage.setItem(CLAIMED_KITS_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };
  const countdown = useCountdown(SEASON_COUNTDOWN_SEED);
  const bgScale = useFixedLayerScale();
  // Foreground (sidebar, title/detail panel, chat, bottom row) size --
  // capped by window height as well as width, so widening the window never
  // enlarges it. `bgScale` above stays width-only for the background.
  const uiScale = useHeightCappedScale();
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
  // cutting into her chin instead of leaving room past it. Reverted back
  // in after a later direct call to drop it ("這裡的背景不需要再特別keyframe了")
  // turned out to be based on a mix-up with the SEPARATE full-bleed
  // `object-cover` fix (higgsfield.ai/enterprise's own technique, already
  // applied to this mask box) -- that fix keeps the box itself from
  // letterboxing at any viewport size, but has no idea where the subject's
  // own face is in frame, so it can't on its own stop THIS specific video's
  // face from being cropped the way this manual reframe does; confirmed
  // live, removing this immediately brought the cropping back.
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
  // it's the current-level card, plus the row's own EFFECTIVE gap between
  // them) -- so each LevelPoint can be positioned at the exact center of
  // the card it corresponds to, and each LevelLine stretched to the exact
  // distance between one point and the next instead of a flat guessed
  // width.
  // `menuIsFluid`/`effectiveKitGap`: per the user's own direct call, once
  // the window is wider than the canvas needs at the current `uiScale`, the
  // leftover width between the row's own content and the chat panel's own
  // reserved column spreads out evenly as extra gap -- card SIZE stays put
  // (`uiScale` never grows with width), only the spacing changes. Until
  // then (a window no wider than the canvas at this scale) it stays a flat
  // `KIT_CARD_GAP`. `295 * uiScale` reserves the chat panel's own grid
  // column width (its own comment elsewhere, `gridTemplateColumns`); the
  // sidebar's own 164px reservation is already the row's existing
  // `pl-[164px]` (below), not a second subtraction here. Feeding this SAME computed
  // value into both the row's own actual CSS `gap` (below) and this
  // center-math is what keeps the level rail from drifting out of sync
  // with the cards' real positions -- exactly the failure this file
  // already hit once with two independent sources of truth for the same
  // gap value.
  // "Fluid" now means the window is wider than the canvas at the CURRENT
  // (height-capped) scale needs, not that the scale itself reached 1.
  const menuIsFluid = viewport.width / uiScale > HERO_WIDTH + 1;
  const { kitCardCenters, kitRowWidth, effectiveKitGap } = (() => {
    const numGaps = REWARD_KITS.length - 1;
    let totalCardWidth = 0;
    for (let i = 0; i < REWARD_KITS.length; i++) {
      totalCardWidth += loggedIn && i === currentKitIndex ? PLAIN_KIT_CARD_WIDTH * CURRENT_KIT_SCALE : PLAIN_KIT_CARD_WIDTH;
    }
    let gap = KIT_CARD_GAP;
    if (menuIsFluid) {
      // In design-space px: the real width left of the chat column, divided
      // back through `uiScale`, minus the row's own sidebar-width padding.
      const availableForRow = Math.max(0, viewport.width - 295 * uiScale) / uiScale - 164;
      gap = Math.max(KIT_CARD_GAP, (availableForRow - totalCardWidth) / numGaps);
    }

    const centers: number[] = [];
    let left = 0;
    for (let i = 0; i < REWARD_KITS.length; i++) {
      const width = loggedIn && i === currentKitIndex ? PLAIN_KIT_CARD_WIDTH * CURRENT_KIT_SCALE : PLAIN_KIT_CARD_WIDTH;
      centers.push(left + width / 2);
      left += width + gap;
    }
    return { kitCardCenters: centers, kitRowWidth: left - gap, effectiveKitGap: gap };
  })();

  // The season-title/kit-detail panel used to be plain content inside
  // ScaleToFit's own scrolling/zoomed subtree -- but per the user's own
  // direct call (echoing the background/bottom-menu treatment above) its
  // position needs to stay fixed too, so it's never one scroll away from
  // view. It's now a THIRD fixed layer, positioned with `uiScale` -- the
  // same height-capped scale ScaleToFit's own grid (sidebar/Talking_Bar
  // columns) and the bottom row use, so all of the foreground keeps one
  // size and the panel's `left` stays anchored to the sidebar column's own
  // right edge whatever the window width. See the layer's own JSX comment
  // for the actual position math. `maxHeight` still caps its own height
  // against whatever room is actually left in the real viewport below it,
  // with internal scroll for the rest (see RewardKitDetailPanel's own
  // comment) -- a fallback now that `uiScale` already budgets for the
  // panel's natural height (`PAGE_DESIGN_HEIGHT`).
  // The background mask always spans the full real viewport from a flat
  // left 0 (its JSX below), with `bgScale` (width-only) sizing just its own
  // video pan -- it stays independent of `uiScale` and of window size.
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
  // Was 257 — that pan read as the character “jumping” up while she
  // walks in from the wide shot. Halved-ish to 110 so the close-up reframe
  // still lifts her face out of the chin crop without a big vertical hop.
  const CLOSE_UP_PAN_SHIFT = 110;
  const videoPanShift = CLOSE_UP_PAN_SHIFT * bgScale;
  const titlePanelScreenLeft = TITLE_PANEL_LEFT * uiScale;
  // `DETAIL_PANEL_TOP` (its own comment) only once the detail panel is
  // actually the thing showing in this slot -- the plain season title
  // stays at its own Figma-matched `TITLE_PANEL_TOP`.
  const titlePanelTopValue = effectiveSelectedKit !== null ? DETAIL_PANEL_TOP : TITLE_PANEL_TOP;
  const titlePanelScreenTop = titlePanelTopValue * uiScale + HERO_BOX_TOP;
  // Capped against the bottom MENU's own top edge, not the raw viewport
  // bottom -- that menu is a separate fixed layer occupying its own real
  // screen space (`CARD_ROW_HEIGHT * uiScale` tall, `BOTTOM_GAP` off the
  // viewport bottom), invisible to a plain "how much viewport is left
  // below this panel" calc. Confirmed live: on a wide-but-not-very-tall
  // window, the fully-uncropped detail panel (no scroll needed by the OLD
  // formula) rendered tall enough to visually overlap the Reward_Kit row
  // sitting underneath it instead of capping/scrolling sooner.
  // `- DETAIL_PANEL_TOP_OFFSET * bgScale` -- RewardKitDetailPanel's own
  // gem+text row starts `DETAIL_PANEL_TOP_OFFSET` design-space px BELOW
  // this `titlePanelScreenTop` (its own comment, aligning the gem/text to
  // the sidebar's own icon height), so the room actually left for that
  // row's own content is that much LESS than the raw gap between
  // `titlePanelScreenTop` and the menu row above. Omitting this (an
  // earlier version here did) let the panel's own `maxHeight` run that
  // much too tall, overlapping the Reward_Kit row below by roughly this
  // same amount -- confirmed live.
  const menuTopScreenY = viewport.height - BOTTOM_GAP - CARD_ROW_HEIGHT * uiScale;
  const detailPanelMaxHeight = Math.max(0, menuTopScreenY - BOTTOM_GAP - titlePanelScreenTop - DETAIL_PANEL_TOP_OFFSET * uiScale) / (uiScale || 1);

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
        {/* `inset-0`, not `flex items-center justify-center` -- per the
            user's own repeated direct call, this box (the "遮罩" -- mask)
            sits at a flat constant position (a fixed 0,0 corner, `HERO_BOX_TOP`
            their own comment above) and never moves for any reason,
            viewport height included -- it should "單純做遮罩的功能" (simply
            act as a mask), with the video free to control its own position
            inside it independently.
            No rounded corner any more -- per the user's own direct call
            ("算了領獎中心原角拔掉") after several rounds trying to get this
            corner's radius/visibility to match every other page's own
            (Figma's literal 50px, then a flat 60px, then `bgScale`-scaled
            60px to mathematically match /profile's own effective radius --
            confirmed exactly equal at 31.25px on a 900px-wide viewport, yet
            still not what the user wanted here), dropping the radius
            entirely is the simplest resolution: a plain square corner.
            Full viewport height AND width -- per the user's own direct call
            to make this mask behave like higgsfield.ai/enterprise's own
            full-bleed hero video (plain `object-cover` inside an `absolute
            inset-0`, always filling the real viewport with no letterboxing,
            whatever its aspect ratio). Independent of `uiScale`: the
            foreground's size never touches the background. */}
        <div className="absolute inset-0 shrink-0 overflow-hidden bg-[#f4f4f4]">
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
              `calc(100% + videoPanShift)`, not a flat
              `HERO_HEIGHT * bgScale + videoPanShift` -- now that the mask
              box itself is always exactly the real viewport's own height
              (its own comment above), this wrapper's "taller than its
              parent by the pan amount" relationship has to be expressed
              relative to that same 100%, not a flat Figma-derived number
              that no longer matches the mask's own (now dynamic) height.
              `duration-[1400ms]`, not `duration-700`/`1000` -- a bigger pan used to
              read as an abrupt jump; with CLOSE_UP_PAN_SHIFT lowered to
              110 we still keep a slightly longer ease so the remaining
              lift feels like a soft reframe, not a hop.
              `ease-[cubic-bezier(0.65,0,0.35,1)]`, not Tailwind's own flat
              `ease-in-out` (`cubic-bezier(0.4,0,0.2,1)`) -- per a later
              direct call ("擬設的動態的線性比較不向曲線 像一直線"), that built-in
              curve is gentle enough over this short a distance that it read
              as close to constant-speed/linear rather than a genuine
              slow-fast-slow S-curve. This custom curve pushes both ends
              (the near-zero start/end velocity) much further, so the
              easing itself is visibly a curve, not just technically one. */}
          <div
            className="absolute inset-x-0 transition-[top] duration-[1400ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              top: videoIsCloseUp ? -videoPanShift : 0,
              height: `calc(100% + ${videoPanShift}px)`,
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
          against this OUTER `inset-0` layer (real screen px, `titlePanelScreenLeft`/
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
          <div style={{ zoom: uiScale } as React.CSSProperties}>
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
              <RewardKitDetailPanel
                kit={REWARD_KITS[effectiveSelectedKit]}
                maxHeight={detailPanelMaxHeight}
                loggedIn={loggedIn}
                canClaim={loggedIn && MEMBER_LEVEL >= REWARD_KITS[effectiveSelectedKit].levelStart}
                claimed={loggedIn && claimedKits.has(effectiveSelectedKit)}
                onClaim={() => claimKit(effectiveSelectedKit)}
              />
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
      <ScaleToFit scale={uiScale}>
        <div className="sticky top-0 z-20">
          <TopBar onlineCount="900" totalReward="10,000,000" announcements={topBarAnnouncements} />
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
          {/* NO white sidebar backdrop -- tried twice across this page's
              build (once relying on DOM order, once with an explicit
              z-index) and reverted both times. Confirmed live: any content
              inside ScaleToFit's own `zoom`-ed wrapper -- no matter how high
              its own z-index goes, tested up to 999999 -- still loses to the
              video's `fixed z-0` layer outside that wrapper, because
              ScaleToFit's own zoomed div behaves like a sealed stacking-
              context boundary content inside it can't escape (the ONE
              exception, MinPanelHeight's own `z-10`, still wins because
              THAT element establishes its own stacking context directly
              inside the same boundary the video's fixed div also roots
              from -- a plain sibling div like this one doesn't get that).
              Per the user's own final direct call once this was confirmed
              ("我要那個影片是滿版" / "不要看到白底"), the video wins that fight
              on purpose now: full-bleed under the sidebar, no white patch.
              The mask box itself has no rounded corner any more either
              (its own JSX comment above, "算了領獎中心原角拔掉") -- a plain
              square corner shows through here now. */}
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
              style={{ height: (SCREEN_TWO_SCROLL_DISTANCE + 300) / (uiScale || 1) }}
            />
          </MinPanelHeight>

        </div>
      </ScaleToFit>

      {/* Fixed to the bottom of the real viewport, like a mobile bottom-nav
          bar -- per the user's own direct call, this row has to stay
          visible without scrolling, not just sit at a fixed design-space
          `top` offset inside the scrolling page above. Independent of
          ScaleToFit the same way the background layer above is (see its
          own comment for why), but scaled with `uiScale` (height-
          capped, shared with the rest of the foreground) -- this row shrinks
          proportionally when the viewport is too SHORT for the page's
          stack, unlike the background (which deliberately crops instead
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
      {/* `justify-start`: the inner scroll box below always starts flush with
          the real left edge/sidebar column (its own width is either the full
          viewport or stops at the chat panel's edge, `menuIsFluid`), so
          neither case wants centering. */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[20px] z-[5] flex justify-start transition-transform duration-500 ease-out"
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
        {/* Per the user's own direct report ("怎麼滑最右邊還是會擋在聊天系統後面"):
            this scroll VIEWPORT has to stop at the chat panel's own column
            in BOTH cases, not just the `menuIsFluid` one -- Talking_Bar's
            `z-10` sits above this row's own `z-[5]` on purpose (this row
            belongs behind it), so any card that scrolls into that same
            screen region is just invisible under it no matter how far you
            drag; the old `: viewport.width` fallback let the non-fluid case
            span the FULL viewport width (including that region), so the
            last kit(s) could scroll to a position that's permanently
            covered instead of ever actually reaching daylight left of the
            panel. `menuIsFluid` still separately decides whether
            `effectiveKitGap` spreads the cards out (its own comment) --
            that part of the split was never the bug, only this width. */}
        <div
          ref={menuScrollRef}
          className="no-scrollbar pointer-events-auto cursor-grab overflow-x-auto overflow-y-hidden active:cursor-grabbing"
          style={{ width: Math.max(0, viewport.width - 295 * uiScale) }}
        >
          <div className="flex w-max flex-col gap-[20px] pl-[164px]" style={{ zoom: uiScale } as React.CSSProperties}>
            {/* `gap: effectiveKitGap`, not a hardcoded `gap-[20px]` Tailwind
                literal or the flat `KIT_CARD_GAP` constant -- confirmed
                live this was the actual root cause of the level rail
                drifting out from under its own cards after the card size
                update (PLAIN_KIT_CARD_WIDTH's own comment): `kitCardCenters`
                above already computed each point's target position off
                whatever gap value it used, but this row's own REAL visual
                gap was a SEPARATE hardcoded value that never got updated
                alongside it -- two independent sources of truth for the
                same value, silently drifting apart. Reusing the exact same
                `effectiveKitGap` this component already computed for
                `kitCardCenters` (its own comment) -- now also the dynamic,
                wide-viewport-spread value instead of always the flat
                constant -- is the only way this can't happen again. */}
            <div className="flex items-end" style={{ gap: effectiveKitGap }}>
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

            {/* Below the Reward_Kit row (its own card height + 20 gap, a
                plain flex-col flow, not a hardcoded number here), not
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
            <div className="relative h-[34px]" style={{ width: kitRowWidth }}>
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
                // Final "100" sits on the last kit center and has no trailing
                // connector -- do not index past REWARD_KITS / kitCardCenters.
                const lineEnd = kitCardCenters[i + 1];
                const hasTrailingLine = lineEnd != null;
                const segmentStart = Number(numeral);
                const segmentEnd = i + 1 < LEVEL_POINTS.length
                  ? Number(LEVEL_POINTS[i + 1])
                  : segmentStart;
                // `- 34`/`- 17`, not the original `- 24`/`- 12` -- the point's
                // own width doubled its role here now that it's 34px (Figma's
                // later revision, LEVEL_POINTS' own comment): half of it is
                // how far each point's wrapper sits left of its `center`, and
                // the full width is how far past that same center the line
                // after it has to start clearing the point's own right edge.
                const lineWidth = hasTrailingLine ? lineEnd - center - 34 : 0;
                const lineProgress = hasTrailingLine && loggedIn
                  ? (MEMBER_LEVEL - segmentStart) / Math.max(1, segmentEnd - segmentStart)
                  : 0;
                return (
                  <div key={i} className="absolute top-0" style={{ left: center - 17 }}>
                    <LevelPoint numeral={numeral} active={achieved} />
                    {hasTrailingLine ? (
                      // `top-[7.5px]`, not the original `2.5px` -- `(34-19)/2`,
                      // matching Figma's own new `Level_line` y-offset exactly
                      // (node 758:20716, x=34 y=7.5) for the bigger 34px point.
                      <div className="absolute left-[34px] top-[7.5px]">
                        <LevelLine progress={lineProgress} width={lineWidth} />
                      </div>
                    ) : null}
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
