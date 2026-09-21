"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { withBasePath } from "../lib/asset";
import ClaimSuccessModal from "./ClaimSuccessModal";

// Same brand gradient QuickLinks/Avatar already use for their own gradient
// borders/rings (just this project's usual stop palette). get_design_context's
// own plain-code extraction flattens a gradient stroke down to its first
// stop as a flat color (#01fab0 here) since Tailwind's `border-*` utilities
// can't express a gradient -- worth double checking against the actual
// screenshot/rendered design before trusting a border color literally, not
// just here.
//
// Direction has needed two corrections against the user's own references
// (direct screenshots of this exact card, not the flattened solid color
// get_design_context reports): first that it's purple at the TOP fading to
// teal/green at the BOTTOM, not the reverse; then that the axis itself is
// on the diagonal, not straight down -- a screenshot of Figma's own
// gradient-handle overlay shows the line running from upper-left to
// lower-right, steeper than the 45° diagonal (measured off that overlay:
// ~29° off vertical, i.e. ~150.8deg toward the lower-right end). `-30deg`
// (equivalently 330deg) points the gradient axis toward the upper-left,
// which is where the 100% stop (#644eb3, dark purple) lands -- so purple
// sits upper-left and the array's own 0% stop (#01fab0, teal) lands
// lower-right, matching both which corner is which color and the tilt.
const REWARD_BORDER_GRADIENT =
  "linear-gradient(-30deg, #01fab0 0%, #14e8b8 7%, #48bace 20%, #9a71f1 39%, #b65afd 45%, #8d54d8 68%, #6f4fbd 88%, #644eb3 100%)";

type RewardIcon = "peace" | "more" | "box" | "30percent" | "container";

// Each day's own reward icon, provided directly (D:\works\09_WU88-H\
// source\public\icons\rewards\Style=*.svg) rather than reused generically
// across cards -- an earlier pass here wrongly recycled just two Figma
// exports (a gem + a wallet) across all of DAY 3/4/5/6, which didn't match
// the design at all once compared side by side.
const REWARD_ICON_SRC: Record<RewardIcon, string> = {
  peace: "peace-icon",
  more: "reward-more",
  box: "reward-box",
  "30percent": "reward-30percent",
  container: "reward-container",
};

// The full 7-day cycle's own reward per day, keyed by day number rather
// than hardcoded per JSX line, so the row can render as "claimed" / "the
// current claimable card" / "still to come" for whichever day is actually
// current instead of only ever supporting DAY 2 as the highlighted slot.
// Day 7 has no card at all -- Figma's row stops at DAY 6 and hands off to
// the "七日壓軸好禮" character art instead, so this table does too. Day 2's
// `icon` (used once it's claimed and shrinks out of the large slot) has no
// dedicated asset from the user's own icon folder the way days 1/3/4/5/6
// do -- it reuses "peace" as the closest match, since that's literally the
// same diamond glyph swirl.svg (the large card's own icon) already bakes
// in for the current day.
const REWARD_DAYS: { day: number; reward: string; icon: RewardIcon }[] = [
  { day: 1, reward: "+99 K", icon: "peace" },
  { day: 2, reward: "+99W", icon: "peace" },
  { day: 3, reward: "+10 M", icon: "more" },
  { day: 4, reward: "+50 M", icon: "box" },
  { day: 5, reward: "30% 返水", icon: "30percent" },
  { day: 6, reward: "+8 B", icon: "container" },
];

type RewardCardProps = {
  day: string;
  reward: string;
  icon: RewardIcon;
  claimed?: boolean;
};

// Figma "Reward_box" (129x167): a plain white card with a faint teal blob
// pattern (card-frame.svg) behind a dark day-label bar, the reward amount,
// and a big centered icon. The already-claimed variant (Components
// Library node 1005:10321) is the same box plus: the reward icon itself
// blurred (2.5px) rather than left crisp, a translucent blurred white wash
// scoped to `top-[35px]` down (i.e. everything BELOW the day-bar, not
// `inset-0` -- the day-bar itself stays sharp/legible, unwashed), and the
// gradient checkmark badge on top -- same asset as the border/hover
// gradient elsewhere in this file, already correct, nothing to swap there.
function RewardCard({ day, reward, icon, claimed = false }: RewardCardProps) {
  return (
    // `flex-1 basis-[129px]`, not a fixed `w-[129px]`: on a wider window every
    // card grows by the same amount (the row's own gap stays a flat 20px) --
    // everything inside is centered on the card, so it just re-centers.
    <div className="relative h-[167px] min-w-[129px] flex-1 basis-[129px] overflow-hidden rounded-[20px] border border-[#f4f4f4] bg-white">
      {/* Kept at its own native 129x167 and centered, not stretched to the
          card (`preserveAspectRatio="none"` would warp the blob pattern). */}
      <img alt="" src={withBasePath("/assets/day-rewards/card-frame.svg")} className="absolute left-1/2 top-0 h-[167px] w-[129px] max-w-none -translate-x-1/2" />
      <div className="absolute inset-x-0 top-0 flex h-[35px] items-center justify-center bg-[#3e4140]">
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#67e4d2]">{day}</p>
      </div>
      <p className="absolute left-1/2 top-[132px] -translate-x-1/2 whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">
        {reward}
      </p>
      <img
        alt=""
        src={withBasePath(`/assets/day-rewards/${REWARD_ICON_SRC[icon]}.svg`)}
        className={`absolute left-1/2 top-1/2 size-[51px] -translate-x-1/2 -translate-y-1/2 ${claimed ? "blur-[2.5px]" : ""}`}
      />
      {claimed && (
        <>
          <div className="absolute inset-x-0 top-[35px] h-[132px] bg-white/50 backdrop-blur-[2px]" />
          <img alt="" src={withBasePath("/assets/day-rewards/icon-check.svg")} className="absolute left-1/2 top-[64px] size-[45px] -translate-x-1/2" />
        </>
      )}
    </div>
  );
}

// Figma's own "Large" RewardBox variant: 149x192, a gradient outline (the
// current day you can actually claim, set apart from the rest of the row
// -- see REWARD_BORDER_GRADIENT's own comment for why this isn't a flat
// #01fab0 border despite that being what get_design_context reported) and
// a purple day-label bar instead of the normal cards' dark gray. Its
// center icon is swirl.svg alone -- unlike the normal cards, Figma never
// layers a separate REWARD_ICON_SRC image on top here, since the diamond
// glyph is already baked into swirl.svg itself (its own `Rewards` group,
// identical to peace-icon.svg's shape) alongside the teal blob and
// sparkle stars -- adding one anyway just doubled up the same diamond.
// `priceLeft` defaults to the card's true center (74.5px, rest state has
// nothing in the way and gets the full 149px to itself, so no width cap --
// left as `whitespace-nowrap` with the text always shown in full). The
// hover layer overrides it to 44.5px -- Figma's own hover price sits at
// `left: calc(50% - 30px)` rather than dead center, shifted clear of the
// notch/button in the bottom-right corner so the text doesn't render
// underneath it -- and passes `priceMaxWidth` to cap how far it can grow
// back toward that corner: past 84px (clearing the notch boundary around
// x=89) it truncates with an ellipsis instead of drifting under the
// button, per the user's own call once "+99W" was confirmed as the
// widest case Figma actually shows here.
function RewardCardLargeContent({
  day,
  reward,
  priceLeft = "50%",
  priceMaxWidth,
}: {
  day: string;
  reward: string;
  priceLeft?: string;
  priceMaxWidth?: string;
}) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 flex h-[44px] items-center justify-center bg-[#8d54d8]">
        <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#67e4d2]">{day}</p>
      </div>
      <img alt="" src={withBasePath("/assets/day-rewards/swirl.svg")} className="absolute left-1/2 top-[65px] h-[78px] w-[88.779px] -translate-x-1/2" />
      <p
        className="absolute -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px] text-[#3e4140]"
        style={{ left: priceLeft, top: "152px", maxWidth: priceMaxWidth }}
      >
        {reward}
      </p>
    </>
  );
}

// Hover state (Components Library node 1010:9829): NOT just a button
// appearing on top of an unchanged square card -- Figma's own hover export
// carries two different "Subtract" shapes (1010:9875 fill, 1010:9843
// stroke) where the bottom-right corner recedes into a stepped notch sized
// to nest the claim button, so the card's own outline changes shape. The
// notch's path is reused verbatim below as a clip-path (same technique,
// and the same source shape family, as GameCard's own concave-notch clip
// -- see CARD_CLIP_PATH there). Rather than animating one shared shape
// between plain-rounded and notched, the rest/hover states are two full
// layers that cross-fade via opacity (day bar/swirl/price repeated in
// both) -- Figma itself treats hover as a separate variant of the
// component, not a CSS transform of the same nodes, and border-radius/
// border can't express a concave notch anyway. The notched border is a
// downloaded SVG asset (hover-border.svg) rather than hand-built CSS: this
// hover export's stroke came back as a real gradient (`stroke="url(#...)"`)
// intact, unlike the rest state's flattened-to-a-flat-color one.
// Both shapes are parametrized on the card's real width `w` (the row's cards
// grow on a wider window): only the notch corner and the right-hand curves
// sit at fixed offsets from the RIGHT edge, so the notch keeps its exact
// size while the body stretches -- the same behavior as PromotionCard's own
// notched cards. At w=149 these reproduce Figma's original 149x192 paths.
function hoverClipPath(w: number) {
  const r = (dx: number) => +(w - dx).toFixed(3);
  return `path("M${w},111.917C${w},122.963 ${r(8.954)},131.917 ${r(20)},131.917H${r(39.895)}C${r(50.9407)},131.917 ${r(59.895)},140.872 ${r(59.895)},151.917V172C${r(59.895)},183.046 ${r(68.8493)},192 ${r(79.895)},192H20C8.95431,192 0,183.046 0,172V20C0,8.95431 8.9543,0 20,0H${r(20)}C${r(8.954)},0 ${w},8.9543 ${w},20V111.917Z")`;
}

// The gradient outline that goes with `hoverClipPath` (Figma's own
// hover-border.svg, 2px stroke inset 1px), same parametrization.
function hoverBorderPath(w: number) {
  const r = (dx: number) => +(w - dx).toFixed(3);
  return `M20 1H${r(20)}C${r(9.507)} 1 ${r(1)} 9.50659 ${r(1)} 20V111.917C${r(1)} 122.41 ${r(9.507)} 130.917 ${r(20)} 130.917H${r(39.895)}C${r(51.4924)} 130.917 ${r(60.8944)} 140.319 ${r(60.8945)} 151.917V172C${r(60.8945)} 182.493 ${r(69.4013)} 191 ${r(79.8945)} 191H20C9.50659 191 1 182.493 1 172V20C1 9.50659 9.50659 1 20 1Z`;
}

const HOVER_BORDER_STOPS: [number, string][] = [
  [0, "#01FAB0"],
  [0.07, "#14E8B8"],
  [0.2, "#48BACE"],
  [0.39, "#9A71F1"],
  [0.45, "#B65AFD"],
  [0.68, "#8D54D8"],
  [0.88, "#6F4FBD"],
  [1, "#644EB3"],
];

// The card's own rendered width, kept in state so the shapes above can be
// rebuilt as it grows/shrinks with the window.
function useElementWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

function RewardCardLarge({ day, reward, onClaim }: { day: string; reward: string; onClaim: () => void }) {
  const { ref, width } = useElementWidth(149);

  return (
    <div ref={ref} className="group relative h-[192px] min-w-[149px] flex-1 basis-[149px]">
      <div
        className="absolute inset-0 overflow-hidden rounded-[25px] border-2 border-transparent opacity-100 transition-opacity duration-200 group-hover:opacity-0"
        style={{ background: `linear-gradient(white, white) padding-box, ${REWARD_BORDER_GRADIENT} border-box` }}
      >
        <RewardCardLargeContent day={day} reward={reward} />
      </div>

      <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ clipPath: hoverClipPath(width) }}>
        <RewardCardLargeContent day={day} reward={reward} priceLeft="calc(50% - 30px)" priceMaxWidth="calc(100% - 65px)" />
      </div>
      <svg
        aria-hidden
        width={width}
        height={192}
        viewBox={`0 0 ${width} 192`}
        fill="none"
        className="pointer-events-none absolute inset-0 overflow-visible opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <path d={hoverBorderPath(width)} stroke="url(#day-reward-hover-border)" strokeWidth={2} />
        <defs>
          <linearGradient id="day-reward-hover-border" x1={(124.167 * width) / 149} y1={238.933} x2={(-142.563 * width) / 149} y2={-11.8151} gradientUnits="userSpaceOnUse">
            {HOVER_BORDER_STOPS.map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
      </svg>

      <button
        type="button"
        aria-label="claim"
        onClick={onClaim}
        className="absolute bottom-0 right-0 hidden size-[50px] items-center justify-center rounded-full bg-[#3e4140] backdrop-blur-[10px] group-hover:flex"
      >
        <img alt="" src={withBasePath("/assets/day-rewards/icon-receive.svg")} className="size-[27.761px]" />
      </button>
    </div>
  );
}

// The week's own length. Days 1-6 are the row's cards; day 7 has no card of
// its own -- Figma's row stops at DAY 6 and hands off to the "七日壓軸好禮"
// character art, whose claim pill (立即領取 / 已經領取) is day 7's claim.
// The whole cycle resets to zero every calendar week ("每隔一周都會歸零"):
// weeks run Monday to Sunday, so Monday is day 1 and Sunday is day 7, and
// counting starts from the current week ("先從這禮拜開始算第一周").
const CYCLE_DAYS = 7;
// Master switch for the claim rules described below (weekly reset, days
// unlocking one calendar day at a time, one claim per day, day-7 make-up).
// Switched OFF for now: every day is claimable at any time and nothing is
// persisted, so a claim only lasts until the page is reloaded ("每日領取先把
// 規則關閉 讓他隨意領取 重啟就歸零"). Flip to true to bring the rules back --
// all of that code is untouched behind this flag.
const CLAIM_RULES_ENABLED = false;
// The claims made while the rules are off. Module-level rather than component
// state so it survives client-side navigation (/profile <-> /promotions each
// mount their own DayRewards) but, being memory only, a reload wipes it.
const freeClaimed = new Set<number>();
// getDay() value the week starts on (0 = Sunday, 1 = Monday).
const WEEK_STARTS_ON = 1;
const MS_PER_DAY = 86400000;
const ANCHOR_STORAGE_KEY = "wu88-day-rewards-anchor";
const CLAIMED_STORAGE_KEY = "wu88-day-rewards-claimed";
// Start-of-day timestamp of the last claim, so the one-claim-per-calendar-day
// rule survives a reload.
const LAST_CLAIM_STORAGE_KEY = "wu88-day-rewards-last-claim";
// How often the open page re-checks the date, so it rolls over at midnight
// (unlocking the next day / resetting the week) without needing a reload.
const DATE_CHECK_INTERVAL_MS = 30000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// Start-of-day timestamp of the first day (Monday) of `date`'s calendar week.
function startOfWeek(date: Date) {
  const daysIntoWeek = (date.getDay() - WEEK_STARTS_ON + 7) % 7;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysIntoWeek).getTime();
}

// Real calendar days elapsed since `anchorMs` (itself already a
// start-of-day timestamp), not a raw 24h-period count -- so a claim made
// at 11pm still counts "tomorrow" as unlocked the moment it's past
// midnight, not 24 hours later.
function daysSinceAnchor(anchorMs: number, now: Date) {
  return Math.round((startOfDay(now) - anchorMs) / MS_PER_DAY);
}

// Real date-driven unlock, not click-driven: a day only becomes
// claimable once its own calendar day actually arrives (`unlockedDay`),
// so there's no way to claim ahead of today ("不能領取隔日"). Missing a
// day doesn't forfeit it, though -- `claimed` is a set, not a boundary,
// so any unlocked-but-unclaimed day (today's or an earlier missed one)
// stays claimable ("前一日沒領可以補領"). `currentDay` (the one card that
// actually gets the large/claimable treatment) is derived as the
// EARLIEST unclaimed day within what's unlocked, so catching up after
// missing several days happens one card at a time rather than unlocking
// every missed day's claim button simultaneously -- there's only ever
// one large-card slot in this row to begin with.
//
// One claim per calendar day ("當天的分領完 隔天的分要隔天才能領" -- no
// claiming across days): once ANYTHING has been claimed today
// (`claimedToday`), nothing is claimable again until the next calendar day,
// so the week is worked through one day at a time up to day 7, and only
// the weekly reset (below) starts it over. The one exception is the week's
// LAST day (day 7): the one-a-day limit is lifted there, so day 7's own
// portion can be claimed AND every earlier day still outstanding can be
// made up (one claim each, earliest first) -- a week with nothing claimed
// can still be collected in full on day 7. Whatever is still unclaimed when
// the week rolls over is simply gone ("不管上一周只領了一天或兩天,過了隔周
// 都是直接歸零").
//
// Both pieces persist to localStorage (not the AuthProvider Context)
// since they need to survive a real page reload/revisit, unlike the
// rest of this project's mock login state. The stored anchor is the Monday
// of the week the claims belong to: the first visit of a new calendar week
// finds it stale, clears the claims and re-anchors on that week's Monday
// -- so the very first visit starts a fresh week with nothing claimed and
// today's weekday as the unlocked day (Monday = day 1).
function useDayRewardsState() {
  const [claimed, setClaimed] = useState<Set<number>>(() => new Set(CLAIM_RULES_ENABLED ? [] : freeClaimed));
  const [unlockedDay, setUnlockedDay] = useState(CLAIM_RULES_ENABLED ? 1 : CYCLE_DAYS);
  const [claimedToday, setClaimedToday] = useState(false);

  useEffect(() => {
    if (!CLAIM_RULES_ENABLED) return;
    // Same reasoning as this file's earlier version of this effect: a
    // lazy useState initializer would dodge the set-state-in-effect rule
    // below, but this tree is server-rendered too and localStorage isn't
    // available there, so the effect is what keeps the first client
    // render matching the server's own default markup instead of
    // risking a hydration mismatch, only correcting it once mounted.
    // Re-run on an interval too, so the date rolling over while the page
    // stays open unlocks the next day / resets the week by itself.
    function sync() {
      const now = new Date();
      const thisWeek = startOfWeek(now);

      let claimedDays: number[] = [];
      try {
        const stored = localStorage.getItem(CLAIMED_STORAGE_KEY);
        if (stored) claimedDays = JSON.parse(stored);
      } catch {
        claimedDays = [];
      }

      // Weekly reset: the stored claims belong to a different (earlier)
      // calendar week than this one -- however many days of it went
      // unclaimed -- so they're dropped and this week starts from zero. That
      // includes the "already claimed today" marker: it belongs to the same
      // dropped record, and keeping it (a claim made today under an older
      // anchor) left DAY 1 showing as unclaimed yet not claimable at all,
      // with no large card to hover.
      let lastClaim = Number(localStorage.getItem(LAST_CLAIM_STORAGE_KEY)) || 0;
      if (Number(localStorage.getItem(ANCHOR_STORAGE_KEY)) !== thisWeek) {
        claimedDays = [];
        lastClaim = 0;
        localStorage.setItem(ANCHOR_STORAGE_KEY, String(thisWeek));
        localStorage.setItem(CLAIMED_STORAGE_KEY, JSON.stringify(claimedDays));
        localStorage.removeItem(LAST_CLAIM_STORAGE_KEY);
      }

      // A real claim always records a day, so an "already claimed today"
      // marker with nothing claimed is a leftover from a record that was
      // reset underneath it (the case fixed above, already sitting in some
      // browsers' storage) -- heal it instead of leaving DAY 1 unclaimable.
      if (lastClaim && claimedDays.length === 0) {
        lastClaim = 0;
        localStorage.removeItem(LAST_CLAIM_STORAGE_KEY);
      }

      const today = Math.min(CYCLE_DAYS, Math.max(1, 1 + daysSinceAnchor(thisWeek, now)));
      setUnlockedDay(today);
      setClaimed((prev) => (prev.size === claimedDays.length && claimedDays.every((d) => prev.has(d)) ? prev : new Set(claimedDays)));
      setClaimedToday(lastClaim === startOfDay(now));
    }

    sync();
    const timer = setInterval(sync, DATE_CHECK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // Derived, not its own state: computing it fresh from `claimed` +
  // `unlockedDay` every render means there's no separate value that
  // could ever drift out of sync with them. `null` once every unlocked
  // day is already claimed -- or once today's one claim is used -- so
  // nothing shows as current until tomorrow actually unlocks the next one.
  const isFinalDay = unlockedDay === CYCLE_DAYS;
  let currentDay: number | null = null;
  if (!claimedToday || isFinalDay) {
    for (let day = 1; day <= unlockedDay; day++) {
      if (!claimed.has(day)) {
        currentDay = day;
        break;
      }
    }
  }

  // The claim pill over the character art ("立即領取") is built ONLY for day 7
  // (the 七日壓軸好禮): it never claims any of the cards' days, and it isn't
  // even shown until day 7 itself has arrived. The large card is what
  // claims / makes up days 1-6.
  // With the rules off there's no calendar to wait for, so "day 7 has arrived"
  // means the row has been worked through to its end: all six cards claimed.
  const finalDayReached = CLAIM_RULES_ENABLED ? isFinalDay : Array.from({ length: CYCLE_DAYS - 1 }, (_, i) => i + 1).every((day) => claimed.has(day));
  const pillState: "hidden" | "ready" | "claimed" = !finalDayReached ? "hidden" : claimed.has(CYCLE_DAYS) ? "claimed" : "ready";

  // Returns whether the claim actually went through (it's refused once the
  // day's one claim is used), so the caller only celebrates real claims.
  const claim = (day: number) => {
    if (!CLAIM_RULES_ENABLED) {
      freeClaimed.add(day);
      setClaimed(new Set(freeClaimed));
      return true;
    }
    if (claimedToday && !isFinalDay) return false;
    localStorage.setItem(LAST_CLAIM_STORAGE_KEY, String(startOfDay(new Date())));
    setClaimedToday(true);
    setClaimed((prev) => {
      const next = new Set(prev);
      next.add(day);
      localStorage.setItem(CLAIMED_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
    return true;
  };

  // Rules-off mode only: once every day (incl. day 7) has been claimed the row
  // starts over from zero ("如果全部點完就歸零").
  const resetIfComplete = () => {
    if (CLAIM_RULES_ENABLED || claimed.size < CYCLE_DAYS) return;
    freeClaimed.clear();
    setClaimed(new Set());
  };

  return { claimed, currentDay, pillState, claim, resetIfComplete };
}

// Figma "Day Rewards" (05_WU88-H-PC-Profile-Page node 601:14802, seen live
// on the logged-in page at 428:17332, node 610:57263 for the instance
// itself): a 7-day login-streak row -- every claimed day sits dimmed/
// checkmarked, the earliest still-unlocked-but-unclaimed day (if any)
// gets the larger highlighted card with the claim button, and every day
// after that sits as a plain not-yet-reached card. In practice `claimed`
// never actually ends up with gaps -- the claim button only ever exists
// on that one earliest-pending card to begin with, so there's no way to
// reach a later day before an earlier missed one -- but see
// useDayRewardsState's own comment for why it's modeled as a set rather
// than a single boundary regardless. No DAY 7 card -- Figma's own row
// stops at DAY 6, and the "七日壓軸好禮" (7-day grand prize) character art
// on the right stands in for day 7 rather than a card.
//
// The character art overlaps the last reward card by 50px (a negative
// right margin on the card row, not overlap math on the art itself) --
// same effect as LoginPoster's own layering, just via margin instead of
// explicit offsets since Figma's own frame expresses it that way.
//
// A login streak is only meaningful once you're actually logged in, so
// this gates itself on the shared AuthProvider state rather than leaving
// each page to remember to wrap it in its own `isGuest` check -- it's
// used identically on both /profile and /promotions.
// Anchor other pages link to (e.g. `/promotions#day-rewards`).
export const DAY_REWARDS_ID = "day-rewards";
const DAY_REWARDS_HASH = `#${DAY_REWARDS_ID}`;

export default function DayRewards() {
  const { loggedIn } = useAuth();
  const { claimed, currentDay, pillState, claim, resetIfComplete } = useDayRewardsState();
  // The 領取成功 popup that follows every successful claim (Figma 192:21294).
  const [showSuccess, setShowSuccess] = useState(false);
  const handleClaim = (day: number) => {
    if (claim(day)) setShowSuccess(true);
  };
  // The home page's 每日能源補給 "立即領取" sends a logged-in member here with
  // `#day-rewards`. This section only exists once logged in (and after the
  // stored login has been read on mount), so the browser's own hash scroll
  // has nothing to land on yet -- scroll to it as soon as it does render.
  // Re-applied a few times over the first second: the page above it (hero,
  // images) is still settling and shifting this section's position, so one
  // early jump can land in the wrong place. Any wheel/touch by the user
  // cancels the remaining attempts.
  useEffect(() => {
    if (!loggedIn || window.location.hash !== DAY_REWARDS_HASH) return;
    const jump = () => document.getElementById(DAY_REWARDS_ID)?.scrollIntoView({ block: "center" });
    const timers = [0, 300, 900].map((ms) => setTimeout(jump, ms));
    const cancel = () => timers.forEach(clearTimeout);
    window.addEventListener("wheel", cancel, { once: true, passive: true });
    window.addEventListener("touchmove", cancel, { once: true, passive: true });
    return () => {
      cancel();
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
    };
  }, [loggedIn]);
  if (!loggedIn) return null;

  return (
    // `w-full` + a flexible card area (`min-w-[894px] flex-1`), not the Figma
    // canvas's fixed 1260px/894px: on a wider window the character art stays
    // pinned to the right edge and the extra width goes to the card row,
    // whose cards grow equally (`flex-1`) with the gap held at a flat 20px.
    // At the canvas width this is the same ~894px/20px-gap row as Figma.
    <div id={DAY_REWARDS_ID} className="relative flex w-full items-start">
      <div className="z-10 -mr-[50px] flex min-w-[894px] flex-1 flex-col items-start gap-[15px]">
        <div className="flex items-center gap-[10px]">
          <img alt="" src={withBasePath("/assets/day-rewards/icon-title.svg")} className="size-[25px]" />
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">每日獎勵</p>
        </div>
        <div className="flex w-full items-center gap-[20px]">
          {REWARD_DAYS.map(({ day, reward, icon }) =>
            day === currentDay ? (
              <RewardCardLarge key={day} day={`DAY ${day}`} reward={reward} onClaim={() => handleClaim(day)} />
            ) : (
              <RewardCard key={day} day={`DAY ${day}`} reward={reward} icon={icon} claimed={claimed.has(day)} />
            ),
          )}
        </div>
      </div>

      <div className="relative h-[291.589px] w-[416px] shrink-0">
        <div className="absolute left-[136px] top-[38px] size-[198px]">
          <div className="absolute inset-[-50.51%]">
            <img alt="" src={withBasePath("/assets/day-rewards/glow.svg")} className="size-full" />
          </div>
        </div>
        <img
          alt=""
          src={withBasePath("/assets/day-rewards/numeral-7.svg")}
          className="absolute bottom-[85.79px] left-[169.7px] h-[198.8px] w-[150.606px]"
        />
        <img
          alt=""
          src={withBasePath("/assets/day-rewards/character.png")}
          className="pointer-events-none absolute inset-x-0 top-0 aspect-[1498/1050] size-full object-cover"
        />
        <img
          alt=""
          src={withBasePath("/assets/day-rewards/digital-dots.svg")}
          className="absolute left-0 top-1/2 h-[173.126px] w-[181.536px] -translate-y-1/2"
        />
        <p className="absolute left-[69px] top-[10px] whitespace-nowrap text-[40px] font-black leading-[36px] tracking-[0.36px] text-[#23f3d5]">
          DAY
        </p>
        <div className="absolute left-[69px] top-[66px] flex items-center gap-[10px]">
          <img alt="" src={withBasePath("/assets/day-rewards/icon-subtract.svg")} className="size-[6px]" />
          <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">七日壓軸好禮</p>
        </div>

        {/* The claim pill over the character art (Figma nodes 1084:9619 /
            1015:12773): the daily claim only exists once logged in (this
            whole component already gates on `loggedIn`). It is day 7's own
            claim (the 七日壓軸好禮) and nothing else: not shown at all until
            day 7 arrives, then purple "立即領取", and the gray "已經領取"
            once day 7 is claimed (the finished-week state).
            The cards' days are claimed through the large card instead. The
            whole cycle resets weekly (`useDayRewardsState`). */}
        {pillState === "ready" ? (
          <button
            type="button"
            onClick={() => handleClaim(CYCLE_DAYS)}
            className="absolute left-[240px] top-[197px] flex items-center gap-[10px] rounded-[50px] bg-[#8d54d8] py-[10px] pl-[10px] pr-[20px]"
          >
            <span className="relative size-[50px] shrink-0 rounded-full border-[1.11px] border-solid border-white bg-[#f4f4f4]">
              <img
                alt=""
                src={withBasePath("/assets/day-rewards/icon-receive-dark.svg")}
                className="absolute left-[calc(50%-0.12px)] top-[calc(50%-0.12px)] size-[27.761px] -translate-x-1/2 -translate-y-1/2"
              />
            </span>
            <span className="whitespace-nowrap text-right text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">立即領取</span>
          </button>
        ) : pillState === "claimed" ? (
          <button
            type="button"
            disabled
            className="absolute left-[240px] top-[197px] flex items-center gap-[10px] rounded-[50px] bg-[#f4f4f4] py-[10px] pl-[20px] pr-[10px]"
          >
            <span className="whitespace-nowrap text-right text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">已經領取</span>
            <span className="relative size-[50px] shrink-0 rounded-full border-[1.11px] border-solid border-white bg-[#3e4140]">
              <img
                alt=""
                src={withBasePath("/assets/day-rewards/icon-receive-white.svg")}
                className="absolute left-[calc(50%-0.12px)] top-[calc(50%-0.12px)] size-[27.761px] -translate-x-1/2 -translate-y-1/2"
              />
            </span>
          </button>
        ) : null}
      </div>

      {showSuccess && (
        <ClaimSuccessModal
          onClose={() => {
            setShowSuccess(false);
            // Closing the popup after the last claim wipes the finished week.
            resetIfComplete();
          }}
        />
      )}
    </div>
  );
}
