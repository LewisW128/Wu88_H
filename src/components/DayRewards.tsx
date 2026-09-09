"use client";

import { useAuth } from "./AuthProvider";
import { withBasePath } from "../lib/asset";

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

type RewardCardProps = {
  day: string;
  reward: string;
  icon: RewardIcon;
  claimed?: boolean;
};

// Figma "Reward_box" (129x167): a plain white card with a faint teal blob
// pattern (card-frame.svg) behind a dark day-label bar, the reward amount,
// and a big centered icon. The already-claimed DAY 1 card is the same box
// plus two overlays Figma layers on top -- a translucent blurred white
// wash to dim it, and a gradient checkmark badge in place of the icon --
// rather than a separate asset, so claimed/unclaimed stay the same shape.
function RewardCard({ day, reward, icon, claimed = false }: RewardCardProps) {
  return (
    <div className="relative h-[167px] w-[129px] shrink-0 overflow-hidden rounded-[20px] border border-[#f4f4f4] bg-white">
      <img alt="" src={withBasePath("/assets/day-rewards/card-frame.svg")} className="absolute inset-0 size-full" />
      <div className="absolute inset-x-0 top-0 flex h-[35px] items-center justify-center bg-[#3e4140]">
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#67e4d2]">{day}</p>
      </div>
      <p className="absolute left-1/2 top-[132px] -translate-x-1/2 whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">
        {reward}
      </p>
      <img
        alt=""
        src={withBasePath(`/assets/day-rewards/${REWARD_ICON_SRC[icon]}.svg`)}
        className="absolute left-1/2 top-1/2 size-[51px] -translate-x-1/2 -translate-y-1/2"
      />
      {claimed && (
        <>
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
          <img alt="" src={withBasePath("/assets/day-rewards/icon-check.svg")} className="absolute left-[41px] top-[64px] size-[45px]" />
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
  priceLeft = "74.5px",
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
const REWARD_HOVER_CLIP_PATH =
  'path("M149,111.917C149,122.963 140.046,131.917 129,131.917H109.105C98.0593,131.917 89.105,140.872 89.105,151.917V172C89.105,183.046 80.1507,192 69.105,192H20C8.95431,192 0,183.046 0,172V20C0,8.95431 8.9543,0 20,0H129C140.046,0 149,8.9543 149,20V111.917Z")';

function RewardCardLarge({ day, reward }: { day: string; reward: string }) {
  return (
    <div className="group relative h-[192px] w-[149px] shrink-0">
      <div
        className="absolute inset-0 overflow-hidden rounded-[25px] border-2 border-transparent opacity-100 transition-opacity duration-200 group-hover:opacity-0"
        style={{ background: `linear-gradient(white, white) padding-box, ${REWARD_BORDER_GRADIENT} border-box` }}
      >
        <RewardCardLargeContent day={day} reward={reward} />
      </div>

      <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ clipPath: REWARD_HOVER_CLIP_PATH }}>
        <RewardCardLargeContent day={day} reward={reward} priceLeft="44.5px" priceMaxWidth="84px" />
      </div>
      <img
        alt=""
        src={withBasePath("/assets/day-rewards/hover-border.svg")}
        className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />

      <button
        type="button"
        aria-label="claim"
        className="absolute bottom-0 right-0 hidden size-[50px] items-center justify-center rounded-full bg-[#3e4140] backdrop-blur-[10px] group-hover:flex"
      >
        <img alt="" src={withBasePath("/assets/day-rewards/icon-receive.svg")} className="size-[27.761px]" />
      </button>
    </div>
  );
}

// Figma "Day Rewards" (05_WU88-H-PC-Profile-Page node 601:14802, seen live
// on the logged-in page at 428:17332, node 610:57263 for the instance
// itself): a 7-day login-streak row, new since the last pass at this page
// -- DAY 1 already claimed (dimmed, checkmarked) sits beside the current
// day's own larger highlighted card, then DAY 3-6 waiting to be unlocked.
// No DAY 2/7 card -- Figma's own row skips straight from the two DAY 1
// cards to DAY 3, and the "七日壓軸好禮" (7-day grand prize) character art
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
export default function DayRewards() {
  const { loggedIn } = useAuth();
  if (!loggedIn) return null;

  return (
    <div className="relative flex w-[1260px] items-start">
      <div className="z-10 -mr-[50px] flex w-[894px] flex-col items-start gap-[15px]">
        <div className="flex items-center gap-[10px]">
          <img alt="" src={withBasePath("/assets/day-rewards/icon-title.svg")} className="size-[25px]" />
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">每日獎勵</p>
        </div>
        <div className="flex w-full items-center gap-[20px]">
          <RewardCard day="DAY 1" reward="+99 K" icon="peace" claimed />
          <RewardCardLarge day="DAY 2" reward="+99W" />
          <RewardCard day="DAY 3" reward="+10 M" icon="more" />
          <RewardCard day="DAY 4" reward="+50 M" icon="box" />
          <RewardCard day="DAY 5" reward="30% 返水" icon="30percent" />
          <RewardCard day="DAY 6" reward="+8 B" icon="container" />
        </div>
      </div>

      <div className="relative h-[291.589px] w-[416px]">
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
      </div>
    </div>
  );
}
