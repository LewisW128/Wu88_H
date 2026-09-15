"use client";

import { useState } from "react";
import BackgroundSequence from "./BackgroundSequence";
import ProfileSidebar from "./ProfileSidebar";
import { REWARD_KITS, RewardKitCard, RewardKitDetailPanel } from "./RewardKit";
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

function LevelPoint({ numeral }: { numeral: string }) {
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
        <img alt="" src={withBasePath("/assets/rewards/level-point.svg")} className="block size-full max-w-none" />
      </div>
      <p className="absolute left-1/2 top-[calc(50%-9px)] -translate-x-1/2 whitespace-nowrap text-[12px] font-medium leading-[18px] tracking-[0.15px] text-[#3e4140]">
        {numeral}
      </p>
    </div>
  );
}

function LevelLine() {
  return <img alt="" src={withBasePath("/assets/rewards/level-line.svg")} className="h-[19px] w-[212px] shrink-0" />;
}

const SEASON_COUNTDOWN_SEED = { days: "08", hours: "08", minutes: "12", seconds: "32" };

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
// its last frame, "02" (the same continuous shot's remainder) plays the
// instant any Reward_Kit card below is picked and then holds on ITS last
// frame -- picking a different kit afterwards does not replay anything,
// since "02" already finished the take.
export default function RewardsCenterContent() {
  const [selectedKit, setSelectedKit] = useState<number | null>(null);
  const countdown = useCountdown(SEASON_COUNTDOWN_SEED);

  return (
    // `h-screen w-screen overflow-hidden` + centering both axes, unlike
    // every other page's plain `min-h-screen items-center` (which lets
    // the page grow taller than the viewport and scroll) -- this page is
    // Figma's own single hero screen with nothing scrollable below it, so
    // per the user's own request it should never need to scroll on any
    // window size. `height={1317}` below makes ScaleToFit shrink the
    // whole 1728x1317 canvas to fit the real viewport's height too, not
    // just its width; centering the result keeps it from pinning to one
    // corner when the window's own aspect ratio doesn't match 1728:1317
    // (letterboxed on whichever axis has slack). Since the entire canvas
    // -- background art included -- scales as one uniform unit rather
    // than being cropped independently, the character in the background
    // stays exactly where Figma placed her relative to the frame at
    // every size, never drifting off-center or getting clipped.
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-[#f4f4f4]">
      <ScaleToFit height={1317}>
        <div className="sticky top-0 z-20">
          <TopBar onlineCount="900" totalReward="10,000,000" announcements={topBarAnnouncements} />
        </div>

        {/* `relative`, NOT the hero's own fixed h-1317/overflow-hidden --
            those live on the background layer below instead. Since this
            page now fits the whole 1728x1317 canvas within the real
            viewport as one uniform-scaled unit (ScaleToFit's own `height`
            prop above) instead of scrolling, Talking_Bar/ProfileSidebar no
            longer need to chase the real window's own height independently
            the way they do on every scrolling page -- both are pinned to
            fixed design-space heights below (Talking_Bar's own `height`
            prop; the grid wrapper skips MinPanelHeight's dynamic stretch
            entirely) so nothing here ever grows taller than the 1317 hero
            it needs to fit inside. */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1317px] w-[1728px] overflow-hidden rounded-tl-[50px] bg-[#f4f4f4]">
            <BackgroundSequence
              stage={selectedKit === null ? "idle" : "selected"}
              className="absolute inset-0 size-full object-cover"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[250px]"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0), white)" }}
            />
          </div>

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
          {/* A plain grid, NOT MinPanelHeight -- that component's whole
              purpose is stretching a short page's content to reach the
              real viewport's bottom edge so a scrolling page's sticky
              children have room to apply, which is exactly what this page
              must NOT do: it needs to stay exactly as tall as its own
              content (which fits inside the fixed 1317 hero once
              Talking_Bar's own height is pinned below), not inflate to
              chase however tall the real window happens to be. */}
          <div className="relative z-10 grid pointer-events-none" style={{ gridTemplateColumns: "164px minmax(0, 1fr) 295px" }}>
            {/* `sticky`, same mechanism ProfileSidebar's wrapper uses on
                EVERY other page -- not `relative`. This page not scrolling
                (ScaleToFit's own `height` prop above) already gets the
                actual requirement (sidebar never scrolls away, nothing to
                scroll to anyway) without this wrapper itself needing to
                behave differently from everywhere else it's used. `sticky`
                does leave the back button a few px out of vertical center
                with the title row next to it (a quirk that already exists
                identically on /profile itself, not something unique to
                this page), which is the tradeoff for staying consistent
                rather than introducing a page-specific positioning rule. */}
            <div className="pointer-events-auto sticky top-[59px] z-10 self-start justify-self-start pl-[30px]">
              {/* height=1239: same fixed target as Talking_Bar's own `height`
                  prop below (see its comment) -- ProfileSidebar's rail does
                  the identical window.innerHeight-chasing calc by default,
                  which silently stretched this grid row past the 1317
                  hero the same way Talking_Bar's unpinned height did before
                  that fix. */}
              <ProfileSidebar height={1239} />
            </div>

            {/* `pointer-events-none` on this whole column -- now that the
                Reward_Kit row moved out to its own full-bleed sibling (see
                that div's own comment on why), THIS column no longer has
                any visible content below the VIP block, but it's still a
                `relative` grid item that stretches to the grid row's full
                height by default (same as ProfileSidebar/Talking_Bar would
                if they didn't already opt out with `self-start`). Left as
                the default `auto`, that invisible box -- part of the grid's
                own `z-10`, above the Reward_Kit row's `z-5` -- silently ate
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

              {/* Figma's hover/selected page state (node 667:15687) swaps this
                  ENTIRE block for Reward_Kit's own detail panel (image +
                  level-by-level USDT table) once a card is picked -- it
                  doesn't sit alongside the season title, it replaces it in
                  the same top-left slot. Reverts to the plain title/
                  countdown block on deselect (there's no toggle-off click
                  target of its own here; picking a different card just
                  swaps which kit's panel shows). */}
              {selectedKit !== null ? (
                <div className="pointer-events-auto absolute left-[38px] top-[150px]">
                  <RewardKitDetailPanel kit={REWARD_KITS[selectedKit]} />
                </div>
              ) : (
                <div className="pointer-events-auto absolute left-[38px] top-[150px] flex w-[464px] flex-col items-start gap-[20px]">
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
              )}

            </div>

            <div className="pointer-events-auto sticky top-[58px] z-10 ml-[20px] self-start">
              {/* height=1239: the 1317 hero minus the same 58px top
                  offset + 20px bottom gap every scrolling page's dynamic
                  calc targets (see TalkingBar's own comment) -- pinned to
                  a fixed number here since there's no real viewport bottom
                  to chase on a page that never scrolls. */}
              <TalkingBar messages={talkingBarMessages} friends={talkingBarFriends} simulatedMessages={talkingBarSimulatedMessages} height={1239} />
            </div>
          </div>

          {/* Figma's own reference: this row runs the FULL page width,
              behind BOTH ProfileSidebar and Talking_Bar -- scrolling slides
              cards visually in and out from under them (peeking through the
              gaps between sidebar icons, disappearing under Talking_Bar's
              own panel), not hard-clipped at the content column's own
              edges. An earlier version here bounded the scroll box to
              `left-0 right-0` INSIDE the content column, which did clip
              cleanly, but per the user's own reference that clean clip is
              wrong -- the row is supposed to be full-bleed, with the
              sidebar/Talking_Bar simply painting on top of it, not a
              container the row is clipped inside of.
              `z-[5]`: below the grid's own `z-10` (so ProfileSidebar/
              Talking_Bar still paint over this row where they overlap it)
              but above the background hero layer (`z-0`/auto), which is
              what actually lets cards visually slide "behind" the side
              panels instead of behind the character art too.
              `pl-[164px]` on the inner wrapper reproduces the same visual
              start position the row had before (matching the content
              column's own left edge, i.e. Figma's own left-164 for this
              row) now that the scroll box itself spans the full 0-1728
              canvas rather than starting there. */}
          <div className="no-scrollbar absolute left-0 right-0 top-[955px] z-[5] overflow-x-auto overflow-y-hidden">
            <div className="flex w-max flex-col gap-[20px] pl-[164px]">
              <div className="flex items-end gap-[20px]">
                {REWARD_KITS.map((kit, index) => (
                  <RewardKitCard key={`${kit.name}-${index}`} kit={kit} selected={selectedKit === index} onSelect={() => setSelectedKit(index)} />
                ))}
              </div>

              {/* Below the Reward_Kit row (262 card height + 20 gap), not
                  Figma's own raw top-[1057px] -- that value actually lands
                  mid-way THROUGH the card row above, so the level rail
                  visually cut across the bottom of the cards instead of
                  sitting under them. Moved down per the user's own direct
                  visual call on the live page. */}
              <div className="ml-[96px] flex items-center">
                {LEVEL_POINTS.map((numeral, i) => (
                  <div key={i} className="flex items-center">
                    <LevelPoint numeral={numeral} />
                    <LevelLine />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScaleToFit>
    </div>
  );
}
