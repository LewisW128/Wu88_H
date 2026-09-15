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
  const bgScale = useFixedLayerScale();
  const { scale: menuScale } = useBottomMenuLayout();
  const viewport = useViewportSize();

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
  // `heroBoxLeft`/`heroBoxTop` are the background layer's own centered
  // position (see that layer's JSX) -- reused here purely so this panel's
  // `left` offset lines up with the character art beneath it. `heroBoxTop`
  // specifically goes NEGATIVE once the background is taller than the
  // viewport -- correct for THAT layer (it deliberately crops off-screen
  // top and bottom, see its own comment), but blindly inheriting it for
  // this panel's own `top` pushed it off the top of the screen entirely on
  // a short window (confirmed live: rect.top around -33px). Only ADDING
  // `heroBoxTop` when it's positive -- never subtracting -- floors this
  // panel at the exact position it'd sit at if the background's own top
  // edge were pinned flush to the real viewport's top instead of centered
  // (i.e. Figma's own `top-150` reference position, its own natural floor
  // with zero fudge-factor guessing), and lets a tall viewport's extra
  // centering room push it further down as a bonus exactly like before.
  // A flat px floor here (tried first) needed guessing a safe clearance
  // under the scrolling grid's own "領獎中心" title row + ProfileSidebar's
  // back button/first icon, which sit at that SAME natural ~y-150 spot at
  // scale 1 anyway -- this floor already keeps clear of them for free.
  const heroBoxLeft = Math.max(0, (viewport.width - HERO_WIDTH * bgScale) / 2);
  const heroBoxTop = (viewport.height - HERO_HEIGHT * bgScale) / 2;
  const titlePanelScreenLeft = heroBoxLeft + TITLE_PANEL_LEFT * bgScale;
  const titlePanelScreenTop = TITLE_PANEL_TOP * bgScale + Math.max(0, heroBoxTop);
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
          whenever it's taller/wider than the window. */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div
          className="relative shrink-0 overflow-hidden rounded-tl-[50px] bg-[#f4f4f4]"
          style={{ width: HERO_WIDTH * bgScale, height: HERO_HEIGHT * bgScale }}
        >
          <BackgroundSequence
            stage={selectedKit === null ? "idle" : "selected"}
            className="absolute inset-0 size-full object-cover"
          />
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
          {/* Figma's hover/selected page state (node 667:15687) swaps this
                ENTIRE block for Reward_Kit's own detail panel (image +
                level-by-level USDT table) once a card is picked -- it
                doesn't sit alongside the season title, it replaces it in
                the same top-left slot. Reverts to the plain title/
                countdown block on deselect (there's no toggle-off click
                target of its own here; picking a different card just
                swaps which kit's panel shows). */}
            {selectedKit !== null ? (
              <RewardKitDetailPanel kit={REWARD_KITS[selectedKit]} maxHeight={detailPanelMaxHeight} />
            ) : (
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
          where the sidebar column sits. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[20px] z-[5] flex justify-center">
        <div
          className="no-scrollbar pointer-events-auto overflow-x-auto overflow-y-hidden"
          style={{ width: HERO_WIDTH * menuScale }}
        >
          <div className="flex w-max flex-col gap-[20px] pl-[164px]" style={{ zoom: menuScale } as React.CSSProperties}>
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
