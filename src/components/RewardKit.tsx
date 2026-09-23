"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "../lib/asset";

export type RewardKitLevelRow = { level: string; usdt: string };

export type RewardKitData = {
  name: string;
  levelRange: string;
  levelStart: number;
  levelEnd: number;
  image: string;
  // Optional per-kit rotating+floating animated WebP (transparent bg),
  // generated via AI image-to-video per the user's own direct request --
  // all 8 brackets have one now (see REWARD_KITS' own comment on the
  // first entry for the pipeline). Still optional in the type since the
  // static `image` is the real fallback if a future bracket is added
  // without one.
  animatedImage?: string;
  rewardTable: RewardKitLevelRow[];
};

function formatUsdt(n: number): string {
  return `${Math.round(n).toLocaleString()} USDT`;
}

// Figma's own hover/selected export (node 667:15723, "等級 1-13：綠寶石寶箱")
// only ever showed the real per-level USDT table for THIS ONE bracket
// (Lv.1-13, 500 -> 200,000 USDT) -- its own description text calls it "Lv.
// 1–13 累積儲值等級的暫定範例" (a tentative example), not final copy. The
// other 7 brackets have no equivalent table in the file at all. Rather than
// leaving them with no detail view, each continues the SAME relative
// per-level growth shape as the one real table Figma provided (the ratio
// between consecutive levels there, cycled to fit each bracket's own level
// count), with every bracket's own starting value 3x the previous
// bracket's -- a placeholder extrapolation of the one confirmed curve, not
// independently invented numbers, but still needs real copy before ship.
const KIT0_RATIOS = [2, 2, 1.75, 10 / 7, 1.6, 1.5, 5 / 3, 1.5, 5 / 3, 1.6, 1.5, 5 / 3];

function buildRewardTable(levelStart: number, levelEnd: number, firstValue: number): RewardKitLevelRow[] {
  const rows: RewardKitLevelRow[] = [];
  let value = firstValue;
  for (let lv = levelStart; lv <= levelEnd; lv++) {
    rows.push({ level: `Lv.${lv}`, usdt: formatUsdt(value) });
    value *= KIT0_RATIOS[(lv - levelStart) % KIT0_RATIOS.length];
  }
  return rows;
}

const KIT0_TABLE: RewardKitLevelRow[] = [500, 1000, 2000, 3500, 5000, 8000, 12000, 20000, 30000, 50000, 80000, 120000, 200000].map(
  (usdt, i) => ({ level: `Lv.${i + 1}`, usdt: formatUsdt(usdt) }),
);

// Figma "Reward_Kit" (node 664:17202/17204-17210, seen live at 648:14692's
// own "領獎中心" frame): 8 loot-crystal cards, one plain white notched frame
// (card-frame.svg) behind each kit's own gem render. Figma's own exported
// gem images were placeholders -- the real per-kit art lives at
// D:\works\09_WU88-H\source\public\item\Bonus (per the user's own
// correction) as one 150x150 crystal render per LEVEL BRACKET, matching
// the Level_line row's own 7 milestones (1/14/28/41/54/67/82) one-to-one,
// with the 8th kit covering the tail bracket up to level 100. Node
// 664:17207 really does repeat 664:17202's own "綠寶石寶箱" label on a
// different gem image -- kept as-is rather than "fixed" to a guessed
// unique name, since that's what the design itself contains.
export const REWARD_KITS: RewardKitData[] = [
  {
    name: "青銅寶箱",
    levelRange: "Lv.1-13",
    levelStart: 1,
    levelEnd: 13,
    image: "/assets/rewards/lv-01-13.png",
    // Started as a proof-of-concept on this one gem before doing the rest
    // (now all 8 brackets have their own `animatedImage`, same pipeline).
    // Rotation is baked into the asset itself (AI image-to-video from this
    // same static PNG, background removed and re-keyed against its own
    // gem shape rather than a flat color threshold, so the gem's own dark
    // internal cracks/shadows didn't get punched full of holes along with
    // the real background); the floating bob is added separately via the
    // `gem-float` CSS keyframe where this asset is actually used, not part
    // of the video itself.
    animatedImage: "/assets/rewards/gem-lv-01-13-rotate.webp",
    rewardTable: KIT0_TABLE,
  },
  // `gem-lv-14-27-rotate.webp` is the ONE exception to this file's own
  // "all 8 via AI image-to-video" comment above -- swapped out per the
  // user's own direct request for a real pre-rendered 238-frame PNG
  // sequence instead (D:\works\09_WU88-H\source\public\Animations\
  // Stone_02), already properly alpha-transparent (no chroma-key step
  // needed at all, unlike every other kit's own asset).
  { name: "琥珀石寶箱", levelRange: "Lv.14-27", levelStart: 14, levelEnd: 27, image: "/assets/rewards/lv-14-27.png", animatedImage: "/assets/rewards/gem-lv-14-27-rotate.webp", rewardTable: buildRewardTable(14, 27, 1500) },
  { name: "摩根石寶箱", levelRange: "Lv.28-40", levelStart: 28, levelEnd: 40, image: "/assets/rewards/lv-28-40.png", animatedImage: "/assets/rewards/gem-lv-28-40-rotate.webp", rewardTable: buildRewardTable(28, 40, 4500) },
  { name: "血鑽石寶箱", levelRange: "Lv.41-53", levelStart: 41, levelEnd: 53, image: "/assets/rewards/lv-41-53.png", animatedImage: "/assets/rewards/gem-lv-41-53-rotate.webp", rewardTable: buildRewardTable(41, 53, 13500) },
  { name: "綠寶石寶箱", levelRange: "Lv.54-66", levelStart: 54, levelEnd: 66, image: "/assets/rewards/lv-54-66.png", animatedImage: "/assets/rewards/gem-lv-54-66-rotate.webp", rewardTable: buildRewardTable(54, 66, 40500) },
  { name: "翡翠石寶箱", levelRange: "Lv.67-79", levelStart: 67, levelEnd: 79, image: "/assets/rewards/lv-67-79.png", animatedImage: "/assets/rewards/gem-lv-67-79-rotate.webp", rewardTable: buildRewardTable(67, 79, 121500) },
  { name: "孔雀石寶箱", levelRange: "Lv.80-92", levelStart: 80, levelEnd: 92, image: "/assets/rewards/lv-80-92.png", animatedImage: "/assets/rewards/gem-lv-80-92-rotate.webp", rewardTable: buildRewardTable(80, 92, 364500) },
  { name: "合金石寶箱", levelRange: "Lv.93-100", levelStart: 93, levelEnd: 100, image: "/assets/rewards/lv-93-100.png", animatedImage: "/assets/rewards/gem-lv-93-100-rotate.webp", rewardTable: buildRewardTable(93, 100, 1093500) },
];

// The little ribbon/medal glyph next to every kit's name (Figma "Actions",
// node 662:16740 etc.) is built from plain border shapes plus one ellipse
// image rather than a single icon export -- reproduced as-is here instead
// of flattening it into a downloaded PNG, since Figma itself never exports
// it as one image (get_design_context returns only the ellipse asset, with
// the ribbon lines as real bordered divs).
// `size-[15px]`/`border-[1.2px]`, not the original `17px`/`1.36px` -- same
// updated Figma revision as the card's own size (PLAIN_KIT_CARD_WIDTH's
// own comment). Every inset here is percentage-based already, so it scales
// automatically with the outer size change alone; only the border widths
// and two of the rounded-corner radii (2.04->1.8, 1.36->1.2) needed their
// own explicit update to match Figma's new literal values. The one
// `rounded-[2.526px]` stayed IDENTICAL in the new Figma export -- not
// touched, confirmed against the fetched design context directly rather
// than assumed to scale along with everything else.
function RankRibbonIcon() {
  return (
    <div className="relative size-[15px] shrink-0 overflow-hidden">
      <div className="absolute inset-[56%_4%_4%_56%]">
        <img alt="" src={withBasePath("/assets/rewards/icon-badge-ellipse.svg")} className="absolute inset-0 block size-full max-w-none" />
      </div>
      <div className="absolute inset-[12%_8%_8%_8%]">
        <div className="absolute inset-[12%_8%_36%_8%] rounded-tl-[1.8px] rounded-tr-[1.8px] rounded-bl-[1.2px] rounded-br-[1.2px] border-[1.2px] border-solid border-[#3e4140]" />
        <div className="absolute inset-[12%_28%_36%_28%] border-[1.2px] border-solid border-[#3e4140]" />
        <div className="absolute inset-[40%_40%_48%_40%] rounded-[2.526px] border-[1.2px] border-solid border-[#3e4140]" />
        <div className="absolute inset-[56%_12%_8%_12%] flex items-center justify-center" style={{ containerType: "size" }}>
          <div className="h-[100cqh] w-[100cqw] flex-none -rotate-180 -scale-x-100">
            <div className="relative size-full rounded-tl-[1.2px] rounded-tr-[1.2px] border-[1.2px] border-solid border-[#3e4140]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Figma's real selected export (node 667:15713, seen live inside 667:15687's
// hover-state row): NOT a lift + gradient ring around the card (this file's
// own earlier guess, made before that node existed here to check against) --
// just the SAME notched card-frame shape with a different fill/stroke:
// `card-frame-selected.svg` swaps the plain white-gradient fill for a radial
// teal (#23F3D5) glow (transparent at the shape's own center, solid toward
// its edges, bleeding past them since the source SVG itself sets
// `overflow="visible"`) and a solid teal stroke in place of the unselected
// state's #F4F4F4 one. Name/ribbon/"前 5,000 名" text stay exactly where
// they are -- only this one background image swaps.
// Figma "Reward_Kit" (node 664:17374, seen live at 657:18891's own
// "登陸之後已經充值後等級8" state): the ONE card matching the logged-in
// member's own current level bracket renders ~1.2685x larger than every
// other kit -- confirmed by diffing the two instances' own outer frame
// sizes in Figma, both perfectly consistent at that same ratio. This is a
// per-project ratio (how much bigger the current-tier card reads, not a
// Figma-given absolute size), so it stays fixed across the base card size
// change below -- `zoom: CURRENT_KIT_SCALE` still scales this button's own
// layout box, and everything inside it, uniformly around whatever the
// current `PLAIN_KIT_CARD_WIDTH` is.
// Exported (not just used locally below) so the Level_line rail on
// RewardsCenterContent's own bottom menu can compute each card's real
// rendered width -- see that file's own `kitCardCenters` comment.
export const CURRENT_KIT_SCALE = 274 / 216;
// `139`/`95`, not the original `216`/`20` -- per the user's own direct
// call ("下方選單的Reward kit尺寸有改") pointing at an updated Figma revision
// of this same node (667:15687): the plain card shrank from 216x262 to
// 139x168, and the row's own gap between cards grew from 20 to 95 to
// compensate -- confirmed live that the two changes roughly cancel out
// (216+20=236 old pitch vs 139+95=234 new pitch), so the level-rail's own
// overall span barely moves even though each card itself reads smaller.
export const PLAIN_KIT_CARD_WIDTH = 139;
export const KIT_CARD_GAP = 95;
// The detail panel's own top offset (its `mt-[...]` below, RewardKitDetailPanel's
// own comment) -- exported so RewardsCenterContent's `detailPanelMaxHeight`
// calc can subtract this SAME number when budgeting the room actually left
// above the bottom Reward_Kit row. Two independent hardcoded copies of this
// value already drifted out of sync once (confirmed live: the detail panel
// rendered visibly taller than the room really left, overlapping the row
// below it, because the height budget was computed against this panel's
// OLD top position from before this offset existed) -- a single shared
// constant is the only way to keep them from silently drifting again.
export const DETAIL_PANEL_TOP_OFFSET = 95;

export function RewardKitCard({
  kit,
  selected,
  current,
  onSelect,
}: {
  kit: RewardKitData;
  selected: boolean;
  current?: boolean;
  onSelect: () => void;
}) {
  // Per the user's own direct call ("當我hover的時候會開始漂浮選轉" -- only
  // starts floating/rotating on hover, not always-on): every kit now has
  // its own `kit.animatedImage` (its own comment), so this hover-swap
  // applies uniformly across the whole row. `key={hovered}` forces a
  // remount on the SAME
  // element BackgroundSequence.tsx's own comment already established this
  // project's pattern for: swapping just the `src` on a live `<img>`
  // doesn't reliably restart an already-decoded animated image, but a full
  // remount does -- so re-hovering after the rotation already finished
  // restarts it from frame 0 instead of holding on the last frame.
  const [hovered, setHovered] = useState(false);
  const showAnimated = hovered && !!kit.animatedImage;

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={selected}
      className="relative block h-[168px] w-[139px] shrink-0 overflow-visible rounded-[20px] text-left"
      style={current ? ({ zoom: CURRENT_KIT_SCALE } as React.CSSProperties) : undefined}
    >
      {/* `h-[126px] w-[138px]`, not the original `196px`/`215px` -- same
          updated Figma card size as everything else in this component (the
          exported size constants' own comment). A plain vector re-render of
          the SAME `card-frame(-selected).svg`, so shrinking its own box
          here doesn't distort or crop it. */}
      <img
        alt=""
        src={withBasePath(selected ? "/assets/rewards/card-frame-selected.svg" : "/assets/rewards/card-frame.svg")}
        className="absolute bottom-0 left-px h-[126px] w-[138px]"
      />
      {/* `top-[-5.15px] size-[123.148px]`, not the original `-8px`/`212px`
          -- Figma's own new literal values for this same gem-art frame. */}
      <div className="absolute left-1/2 top-[-5.15px] size-[123.148px] -translate-x-1/2 overflow-hidden">
        {/* Centering (`left-1/2 top-1/2 -translate-x/y-1/2`) and the
            floating bob need to be on TWO SEPARATE nested elements, not
            the same one -- a `@keyframes` animation's own `transform`
            REPLACES the element's whole transform value, which would wipe
            out this centering translate rather than combining with it
            (the same double-transform trap ScaleToFit's own zoom/position
            split elsewhere in this project already ran into). The floating
            wrapper below starts from a plain identity transform, so
            `gem-float`'s own translateY has nothing to clobber.
            `size-[93px]`, not the original `160px` -- Figma's own new gem
            frame (above) doesn't have a direct equivalent for this square
            production-art wrapper (its own art reuses the same square
            gem render regardless, not Figma's own placeholder photo crop,
            per RewardKitDetailPanel's own comment on that exact swap) --
            scaled down by this same frame's own ratio instead
            (93/123.148 ~= 160/212, both ~0.755) to keep the gem reading at
            the same proportion of its own frame as before.
            `scale-[1.15]` while `showAnimated` -- per the user's own direct
            catch ("hover之後圖案縮小"), the animated WebP's own canvas has a
            lot more built-in padding around the gem than the static PNG's
            own tight crop (confirmed live: the gem's own content fills only
            ~53-77% of the animated canvas vs ~86-90% for the static one),
            so `object-contain`, which sizes off the full canvas, rendered
            the SAME apparent gem noticeably smaller once hovered even
            though both share this same `size-[93px]` box. This scale
            compensates for that baked-in padding so hovering doesn't visibly
            shrink the gem. Applied to this OUTER wrapper's own already-static
            centering transform, not the `<img>` below -- that element's own
            `gem-float` keyframe sets its OWN `transform` (translateY) every
            frame, which would silently replace (not combine with) a scale
            placed on the same element instead of composing with it (the
            same double-transform trap this file's own comment above already
            names elsewhere). */}
        <div className={`absolute left-1/2 top-1/2 size-[93px] -translate-x-1/2 -translate-y-1/2 ${showAnimated ? "scale-[1.15]" : ""}`}>
          <img
            key={String(showAnimated)}
            alt={kit.levelRange}
            src={withBasePath(showAnimated ? kit.animatedImage! : kit.image)}
            className={`size-full object-contain ${showAnimated ? "animate-[gem-float_3s_ease-in-out_infinite]" : ""}`}
          />
        </div>
      </div>
      {/* `bottom-[10px]`, not the original `20px` -- Figma's own new
          literal value. Name text is now `text-[10px] font-bold` (was
          `12px`, no bold), and the "前 5,000 名" line drops its own
          previous per-span size split (`前`/`名` at 12px, the number
          itself larger at 14px bold) for one shared `text-[10px]` across
          all three -- Figma's new export sets `text-[10px]` on the row's
          own wrapper div rather than each span, so this matches that by
          moving the size up to this row's own className instead of
          repeating it on each `<p>`. */}
      <div className="absolute bottom-[10px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[5px]">
        <div className="flex w-full items-center gap-[5px]">
          <RankRibbonIcon />
          <p className="whitespace-nowrap text-[10px] font-bold text-black">{kit.name}</p>
        </div>
        <div className="flex items-center gap-[5px] whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px]">
          <p className="text-[#a2a2a2]">前</p>
          <p className="font-bold text-[#23f3d5]">5,000</p>
          <p className="text-[#a2a2a2]">名</p>
        </div>
      </div>
    </button>
  );
}

function RewardTableColumn({ rows }: { rows: RewardKitLevelRow[] }) {
  return (
    <div className="flex flex-col items-start">
      {rows.map((row) => (
        <div key={row.level} className="flex w-[172px] items-start gap-[10px] py-[4px]">
          <p className="w-[40px] shrink-0 font-medium text-[#14d7bb]">{row.level}</p>
          <p className="whitespace-nowrap font-bold text-[#3e4140]">{row.usdt}</p>
        </div>
      ))}
    </div>
  );
}

// Figma "Frame 1368" (node 667:15723, seen live at 667:15687's own hover/
// selected page state): what a Reward_Kit card expands into once picked --
// replaces the VIP-season title block above the card row (same slot,
// same 40/150 top-left origin) rather than decorating the card itself.
// Gem art reuses the SAME 150x150 production render the card's own icon
// already uses (object-contain, centered) instead of Figma's own tall
// 175x311 moody photo -- that photo was a per-bracket placeholder image
// this project doesn't have a real equivalent of, unlike the small-card
// icon (see RewardKit's own comment on why that swap happened at all).
// Matches the scroll box's own `rounded-tr-[50px]`/`rounded-br-[50px]`
// corner radius (see the thumb-tracking effect's own comment below).
const SCROLLBAR_CORNER_INSET = 50;
// The box's bottom-right notch (below) begins this far above its bottom edge
// on the right side, so a scrollbar thumb hugging that edge has to stop
// before it -- the bottom counterpart of SCROLLBAR_CORNER_INSET.
const SCROLLBAR_NOTCH_INSET = 140;
// The box keeps 30px of empty padding under its last table row, so a cap that
// clips up to that much (less a small margin) still shows every word of the
// copy -- nothing to scroll to, hence no scrollbar (and no scrolling).
const FITS_TOLERANCE = 24;

// The panel is a fixed 441px wide (361px of content + 40px each side). Its
// outline is Figma's "Subtract" shape (Frame 1374, nodes 730:16932 /
// 652:17081): a plain top-left corner, 50px radii on the other three, and a
// notch cut out of the bottom-right for the 立即領取 pill to sit in. Only the
// HEIGHT varies (the box scrolls once it's capped), so the path is
// parametrized on `h` -- everything below the notch's start is anchored to the
// bottom edge. At h=541 this is Figma's own path.
const PANEL_WIDTH = 441;
function panelPath(h: number) {
  const b = (dy: number) => +(h - dy).toFixed(3);
  return `M391 0.5C418.338 0.5 440.5 22.6619 440.5 50V${b(140)}C440.5 ${b(112.662)} 418.338 ${b(90.5)} 391 ${b(90.5)}H310C284.871 ${b(90.5)} 264.5 ${b(70.129)} 264.5 ${b(45)}C264.5 ${b(20.423)} 244.577 ${b(0.5)} 220 ${b(0.5)}H50C22.6619 ${b(0.5)} 0.5 ${b(22.662)} 0.5 ${b(50)}V0.5H391Z`;
}

// A keyword picked out in the description's teal.
function Hl({ children }: { children: React.ReactNode }) {
  return <span className="text-[#14d8bb]">{children}</span>;
}

export function RewardKitDetailPanel({
  kit,
  maxHeight,
  loggedIn = false,
  canClaim = false,
  claimed = false,
  onClaim,
}: {
  kit: RewardKitData;
  maxHeight?: number;
  // Only changes the description's "Lv.x-y" weight (bold for a guest, per
  // Figma's two frames).
  loggedIn?: boolean;
  // Whether the 立即領取 pill is live (purple) or the greyed "can't claim"
  // style -- a guest, or a member whose level hasn't reached this kit yet.
  canClaim?: boolean;
  // This kit was already claimed: the pill turns into Figma's "已經領取"
  // style (node 1015:12773) and stops being clickable.
  claimed?: boolean;
  onClaim?: () => void;
}) {
  // The right-hand column stays short (at most 5 rows) so it clears the
  // bottom-right notch; the left column takes the rest (Lv.1-8 | Lv.9-13 for
  // a 13-level kit, as in Figma).
  const rightCount = Math.min(5, Math.floor(kit.rewardTable.length / 2));
  const left = kit.rewardTable.slice(0, kit.rewardTable.length - rightCount);
  const right = kit.rewardTable.slice(kit.rewardTable.length - rightCount);

  // The box's real rendered height, for the height-parametrized outline.
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxHeight, setBoxHeight] = useState(541);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setBoxHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Same thin teal scrollbar thumb this project already uses for its other
  // two scrollable panels (ProfileSidebar's own rail, Talking_Bar's own
  // message list) -- per the user's own direct call to reuse that exact
  // style here rather than a native browser scrollbar.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ height: 0, top: 0 });
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const fitsNow = scrollHeight - clientHeight <= FITS_TOLERANCE;
      setFits(fitsNow);
      if (fitsNow) {
        setThumb({ height: 0, top: 0 });
        return;
      }
      // The box's own top-right corner curves inward well past this scroll
      // container's own 20px vertical padding -- a thumb track inset by just
      // that padding (an earlier version here did) poked out past the
      // rounded silhouette, confirmed live via a zoomed screenshot showing
      // the thumb sticking out past the curve. Insetting the TRACK by the
      // corner radius at the top and by where the bottom-right notch begins
      // at the bottom keeps the thumb inside the box's actual shape at any
      // scroll position.
      const trackHeight = Math.max(0, clientHeight - SCROLLBAR_CORNER_INSET - SCROLLBAR_NOTCH_INSET);
      const height = Math.max(24, Math.min(trackHeight, (clientHeight / scrollHeight) * trackHeight));
      const maxTop = Math.max(0, trackHeight - height);
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
  }, [kit, maxHeight]);

  return (
    // `items-start` (reverted from a brief `items-center` per an earlier
    // direct call, "石頭跟右邊的文案上下至中對其") -- per a later direct call with
    // an annotated screenshot ("文案跟石頭頂端對其這個高度"), the gem and the
    // text/table panel next to it should have their TOP edges level with
    // each other instead. Doesn't affect the SEPARATE `items-start` inside
    // the scroll box below (its own comment explains that one). The gem's
    // own wrapper box below also switches its internal `items-center` to
    // `items-start`, so the (larger-than-the-box) gem image's own top edge
    // lands at the box's own top edge instead of bleeding out symmetrically
    // above and below it -- otherwise this row-level top-alignment would
    // still leave the image itself floating above the text's own top.
    // `marginTop: DETAIL_PANEL_TOP_OFFSET` -- top-aligning the gem and text
    // TO EACH OTHER (above) wasn't the whole ask: per the user's own direct
    // follow-up ("我意思是兩者高度都不要超過紅線"), that shared top edge also
    // must not sit higher than a specific reference line, which the user
    // then pinned down precisely as the left sidebar's own "會員中心" icon's
    // own top edge ("石頭跟文案的頂端要跟左邊的會員中心按鈕的上緣對其"). Measured
    // live: that icon's own top sits 35.94px lower (in real, post-zoom
    // screen space) than this row's own un-shifted top -- this page's own
    // global `zoom` scale at measurement time was 0.378472, so pushed down
    // by 35.94 / 0.378472 = 94.95px (rounded to the exported constant's 95)
    // of this component's own PRE-zoom design space to land at the same
    // real height, regardless of viewport width (the zoom scale is why a
    // flat px value here still tracks a fixed point elsewhere on the page
    // across different screen sizes). A plain numbered constant, not a
    // `mt-[95px]` Tailwind literal -- RewardsCenterContent's own
    // `detailPanelMaxHeight` has to subtract this SAME offset (its own
    // comment), and a second hardcoded "95" over there already drifted out
    // of sync with this one once.
    // `gap-[128.5px]` -- NOT the box's own literal spacing, and the gem's
    // box below is back to its ORIGINAL untouched `175px` (a version here
    // briefly widened that box to 480px to make the gap math simpler, but
    // that shifted the gem's own rendered position/center -- per the
    // user's own direct catch ("為什麼連石頭都出去了" / "石頭位子不變阿" / "我只是
    // 要你改石頭跟文案之間的間距"), the gem itself must stay exactly where it
    // already was; only the GAP to the text should change). The gem's own
    // box is still deliberately narrower than its image (that box's own
    // comment), so at the current 432px image size it bleeds
    // (432-175)/2 = 128.5px past the box's own right edge. `gap` measures
    // box-to-box, so the real visual clearance from the image's own true
    // (bled-out) edge is this value MINUS that overflow. Went through
    // 40px of real clearance (gap 192.5 at the old 480px size), then 20px
    // (`152.5 + 20 = 172.5`), then per the user's own direct call to pull
    // the text closer, 0px of real clearance at the old size
    // (`152.5 + 0 = 152.5`) -- still 0px of real clearance now, just
    // re-derived for the smaller 432px image's own smaller overflow:
    // `128.5 + 0 = 128.5`.
    <div className="flex items-start gap-[128.5px]" style={{ marginTop: DETAIL_PANEL_TOP_OFFSET }}>
      <div className="relative flex h-[311px] w-[175px] shrink-0 items-start justify-center overflow-visible">
        {/* Per the user's own direct call ("這裡顯示的能量石 不需要hover就會自轉"
            -- this large detail-panel gem always spins, no hover needed,
            unlike the small card's own hover-gated version): plays
            `kit.animatedImage` (its own comment) straight away whenever it
            exists. Now also always-on `gem-float` (a later direct call,
            "這裡的石頭也要微微的上下漂浮，跟下方選項hover效果一樣") -- same reasoning
            as the rotation above: this instance has no hover state to gate
            behind in the first place, so the small card's OWN hover-gated
            version doesn't apply literally, just its floating motion.
            Safe directly on this `<img>` (unlike the small card's own
            split-across-two-elements version, RewardKitCard's own comment
            on why) -- nothing else here sets a `transform` on this same
            element for `gem-float`'s own `translateY` to clobber.
            `size-[432px]` (BOTH width and height explicit), not just a
            `w-[432px]` -- originally sized to 480px per the user's own
            direct call ("這裡的石頭要跟我畫的紅圈依樣大"), circling roughly 2x
            this gem's own rendered size in a live screenshot, then reduced
            10% per a later direct call ("石頭幫我小10%": 480 * 0.9 = 432).
            This box's own `overflow-visible` (its wrapper's own comment
            above) already lets the gem bleed past its 175px column without
            clipping. A width-only version here silently computed to the
            image's own natural 460px instead of the requested width
            (confirmed live even with an `!important` inline override) --
            this flex row's parent has a fixed `h-[311px]` cross-axis, and
            leaving height as `auto` put this replaced element into a
            sizing algorithm that solved for the wrong width entirely
            instead of deriving height from the explicit width via the
            image's own aspect ratio. Setting both dimensions explicitly
            (the asset is square, so equal) sidesteps that algorithm rather
            than depending on it. */}
        {(() => {
          const gemSrc = withBasePath(kit.animatedImage ?? kit.image);
          return (
            <>
              <img alt="" src={gemSrc} className="size-[432px] max-w-none animate-[gem-float_3s_ease-in-out_infinite] object-contain" />
              {/* Experimental per the user's own direct call ("這個石頭的裂縫的
                  亮部有微光像呼吸般閃爍" / "很像是石頭裡面有個發光體") -- try this on
                  ONLY the first kit (青銅寶箱) for now, per their own direct
                  request, before deciding whether to roll it out to the
                  other 7 (each kit's own crack color/brightness differs, so
                  this exact `brightness`/`blur` tuning may not read the same
                  way on the rest).
                  A second copy of the SAME source image, not a hand-cut
                  crack mask (no such asset exists for any of the 8 gems) --
                  `brightness(2.4)` blows the ALREADY-bright crack pixels
                  toward white/blown-out while the much-darker rock body
                  stays comparatively dim (brightness is multiplicative, so
                  the gap between the two widens rather than both just
                  lifting together), `blur` softens that into a soft bloom
                  rather than a hard-edged recolor, and `mix-blend-mode:
                  screen` (below, as an inline style since Tailwind's own
                  `mix-blend-screen` utility isn't loaded in this project)
                  only ever ADDS light on top of the base image underneath,
                  never darkens or tints it.
                  `maskImage: gemSrc` (the SAME source, not a separate cut
                  mask) clips this glow layer to the base image's own alpha
                  silhouette -- without it, `blur` would soften the image's
                  own edges outward into a drop-shadow-style halo around the
                  WHOLE gem, exactly the "外圍發光" (outer-edge glow) effect
                  already rejected earlier in favor of an internal one.
                  `gem-glow-breathe` (globals.css) then pulses this whole
                  layer's own opacity, so the bloom itself breathes in and
                  out rather than sitting at one constant brightness. */}
              {kit === REWARD_KITS[0] && (
                <img
                  aria-hidden
                  alt=""
                  src={gemSrc}
                  className="absolute inset-0 size-[432px] max-w-none animate-[gem-float_3s_ease-in-out_infinite,gem-glow-breathe_3s_ease-in-out_infinite] object-contain"
                  style={{
                    filter: "brightness(2.4) blur(6px)",
                    mixBlendMode: "screen",
                    WebkitMaskImage: `url(${gemSrc})`,
                    maskImage: `url(${gemSrc})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                />
              )}
            </>
          );
        })()}
      </div>

      {/* `items-start`, not the original `items-center` -- centering only
          matters when content is shorter than the box, and once `maxHeight`
          (the real leftover room below this panel on a short viewport, per
          the user's own direct call) makes content TALLER than the box
          instead, centering a scrolled overflow starts the scroll position
          somewhere in the middle of the content instead of at its top.
          `overflow-y-auto` is the fallback for whatever this page's own
          proportional shrink (RewardsCenterContent's own `fixedScale`)
          still doesn't make room for -- this box's own text/table content
          scrolls internally rather than pushing past the fixed bottom
          layer's own bounds. No `maxHeight` (the default) keeps this
          exactly as it always rendered, unconstrained.
          No bottom fade mask any more -- an earlier version here added one
          for whenever more content sat below the visible scroll area
          ("這裡下面看不到的地方要淡出"), reusing ProfileSidebar's own top-fade
          mask-image convention; reverted per a later direct call
          ("這裡的文案我改不做淡出了"), back to a plain hard clip at the box's
          own edge. */}
      <div ref={boxRef} className="relative shrink-0" style={{ width: PANEL_WIDTH }}>
        {/* The frosted fill (white/50 + 10px backdrop blur) and the 1px #f4f4f4
            outline, both cut to `panelPath` -- a plain `rounded-*` box can't
            express the bottom-right notch. */}
        <div
          className="pointer-events-none absolute inset-0 bg-white/50 backdrop-blur-[10px]"
          style={{ clipPath: `path("${panelPath(boxHeight)}")` }}
        />
        <svg aria-hidden width={PANEL_WIDTH} height={boxHeight} viewBox={`0 0 ${PANEL_WIDTH} ${boxHeight}`} fill="none" className="pointer-events-none absolute inset-0 overflow-visible">
          <path d={panelPath(boxHeight)} stroke="#F4F4F4" />
        </svg>
        <div
          ref={scrollRef}
          className={`no-scrollbar flex items-start px-[40px] pb-[30px] pt-[20px] ${fits ? "overflow-y-hidden" : "overflow-y-auto"}`}
          style={{ ...(maxHeight !== undefined ? { maxHeight } : null), clipPath: `path("${panelPath(boxHeight)}")` }}
        >
          <div className="flex w-[361px] flex-col items-start gap-[20px]">
            <div className="flex flex-col items-start gap-[10px] tracking-[0.15px]">
              <p className="text-[14px] leading-[20px] text-[#3e4140]">
                等級 <span className="text-[20px] font-bold leading-[32px] tracking-[0.35px] text-[#14d8bb]">{kit.levelStart}-{kit.levelEnd}</span>
                ：{kit.name}，達成指定條件即可解鎖
                <br />
                限前 <span className="text-[#14d8bb]">5,000</span> 名領取。
              </p>
              <p className="text-[12px] leading-[18px] text-[#a2a2a2]">
                以下為 <span className={`text-[#14d8bb] ${loggedIn ? "" : "font-bold"}`}>Lv.{kit.levelStart}–{kit.levelEnd}</span> <Hl>累積儲值等級</Hl>的暫定範例。玩家的<Hl>累積儲值金額</Hl>達到<Hl>對應門檻</Hl>後，即可進入<Hl>下一個等級</Hl>，並逐步解鎖更高階的<Hl>{kit.name}</Hl>與<Hl>成長回饋</Hl>。前期等級門檻較容易達成，適合<Hl>新手快速體驗升級節奏</Hl>；中期開始提高累積需求，讓每次儲值都能<Hl>明確推進進度</Hl>；高階等級則提供更具挑戰性的<Hl>長期目標</Hl>，鼓勵玩家持續累積並朝 <Hl>Lv.{kit.levelEnd}</Hl> 邁進。等級越高，代表完成的<Hl>累積里程碑</Hl>越多，也能展現更高的<Hl>會員身份與參與程度</Hl>。下方金額皆以 <Hl>USDT</Hl> 計算，僅供版面與活動規劃參考，實際門檻、獎勵內容、發放條件及活動期間，仍應以<Hl>最終公告與正式規則</Hl>為準。請在儲值前確認<Hl>目前累積進度與對應級別</Hl>，避免因活動結算時間、資料更新或其他條件而影響資格判定。
              </p>
            </div>

            <img alt="" src={withBasePath("/assets/rewards/detail-divider.svg")} className="h-px w-[359px]" />

            <div className="flex items-start gap-[20px] text-[12px] leading-[18px] tracking-[0.15px]">
              <RewardTableColumn rows={left} />
              <RewardTableColumn rows={right} />
            </div>
          </div>
        </div>

        {/* `right-0`, flush against the box's own edge -- matching
            Talking_Bar/ProfileSidebar's own scrollbar thumb convention
            exactly, per the user's own direct call to reuse that same
            style here. An earlier version here used `right-[10px]`,
            tucked inside the box's own 40px horizontal padding rather
            than at its actual edge -- easy to miss entirely against the
            white/50 backdrop it sat on.
            `top: SCROLLBAR_CORNER_INSET + thumb.top`, not the box's own
            20px padding -- the track itself is already inset by that same
            corner radius (see the tracking effect's own comment), so the
            thumb's screen position has to match or it re-introduces the
            exact "pokes out past the rounded corner" bug that inset was
            added to fix. */}
        {thumb.height > 0 && (
          <div
            className="pointer-events-none absolute right-0 w-[2px] rounded-full bg-[#23f3d5]"
            style={{ top: SCROLLBAR_CORNER_INSET + thumb.top, height: thumb.height }}
          />
        )}

        {/* Figma's "立即領取" pill, nested in the notch (right-0 / bottom-0 --
            top-471 of the 541px frame). Purple and live when the member can
            claim this kit (logged in and their level has reached it).
            Every disabled state -- a guest, a not-yet-eligible kit, and an
            already-claimed one -- shares ONE style (Figma node 1015:12773,
            per the user's own call to unify them): a light-gray pill with
            grey text and a dark round button, the text reading "已經領取"
            only once actually claimed. */}
        {canClaim && !claimed ? (
          <button
            type="button"
            onClick={onClaim}
            className="absolute bottom-0 right-0 flex items-center gap-[20px] rounded-[50px] bg-[#8d54d8] py-[10px] pl-[10px] pr-[20px]"
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
        ) : (
          <button
            type="button"
            disabled
            className="absolute bottom-0 right-0 flex cursor-not-allowed items-center gap-[10px] rounded-[50px] bg-[#f4f4f4] py-[10px] pl-[20px] pr-[10px]"
          >
            <span className="whitespace-nowrap text-right text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{claimed ? "已經領取" : "立即領取"}</span>
            <span className="relative size-[50px] shrink-0 rounded-full border-[1.11px] border-solid border-white bg-[#3e4140]">
              <img
                alt=""
                src={withBasePath("/assets/day-rewards/icon-receive-white.svg")}
                className="absolute left-[calc(50%-0.12px)] top-[calc(50%-0.12px)] size-[27.761px] -translate-x-1/2 -translate-y-1/2"
              />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
