"use client";

import { useEffect, useState } from "react";
import BackgroundSequence from "./BackgroundSequence";
import MinPanelHeight from "./MinPanelHeight";
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

const HERO_WIDTH = 1728;
const HERO_HEIGHT = 1317;

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
  const fixedScale = useFixedLayerScale();

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
          whenever it's taller/wider than the window. */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div
          className="relative shrink-0 overflow-hidden rounded-tl-[50px] bg-[#f4f4f4]"
          style={{ width: HERO_WIDTH * fixedScale, height: HERO_HEIGHT * fixedScale }}
        >
          <BackgroundSequence
            stage={selectedKit === null ? "idle" : "selected"}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-x-0 bottom-0"
            style={{ height: 250 * fixedScale, background: "linear-gradient(to bottom, rgba(255,255,255,0), white)" }}
          />
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

        {/* `relative`, NOT the hero's own fixed h-1317/overflow-hidden --
            those live on the fixed background layer above instead (see its
            own comment for why it has to sit outside this zoomed subtree
            entirely). Talking_Bar computes its own height straight off the
            real window (see its own panelHeight state, independent of any
            parent), same as it does on every other page -- on a browser
            window taller/narrower than the 1728x900 design ratio that's
            routinely MORE than 1317px. Foreground content (title row, VIP
            block) still uses plain `top-*` offsets straight off Figma's
            own numbers, which land in the exact same place either way. */}
        <div className="relative">
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
              <TalkingBar messages={talkingBarMessages} friends={talkingBarFriends} simulatedMessages={talkingBarSimulatedMessages} />
            </div>
          </MinPanelHeight>

        </div>
      </ScaleToFit>

      {/* Fixed to the bottom of the real viewport, like a mobile bottom-nav
          bar -- per the user's own direct call, this row has to stay
          visible without scrolling, not just sit at a fixed design-space
          `top` offset inside the scrolling page above. Same
          independent-of-ScaleToFit `fixedScale` as the background layer
          above (see its own comment for why), applied with `zoom` rather
          than `transform: scale()` -- this row is still horizontally
          scrollable when there are more kits than fit on screen, and
          `transform` only repaints smaller without shrinking the element's
          actual layout/scroll box to match, which would leave the
          scrollable range wrong at any scale other than 1 (the exact
          reason ScaleToFit itself uses `zoom` for the whole page instead
          of `transform`). Horizontally centered to match the background
          layer's own centering, with the same `pl-[164px]` Figma offset
          preserved inside so the row still starts under where the sidebar
          column sits. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[20px] z-[5] flex justify-center">
        <div
          className="no-scrollbar pointer-events-auto overflow-x-auto overflow-y-hidden"
          style={{ width: HERO_WIDTH * fixedScale }}
        >
          <div className="flex w-max flex-col gap-[20px] pl-[164px]" style={{ zoom: fixedScale } as React.CSSProperties}>
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
    </div>
  );
}
