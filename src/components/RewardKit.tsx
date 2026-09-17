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
  // proof-of-concept for the Lv.1-13 bracket only so far (see
  // REWARD_KITS' own comment); the other 7 brackets fall back to their
  // plain static `image` until the same treatment is made for them too.
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
    name: "綠寶石寶箱",
    levelRange: "Lv.1-13",
    levelStart: 1,
    levelEnd: 13,
    image: "/assets/rewards/lv-01-13.png",
    // Proof-of-concept only -- per the user's own direct call to test ONE
    // gem before doing the rest. Rotation is baked into the asset itself
    // (AI image-to-video from this same static PNG, background removed
    // and re-keyed against its own gem shape rather than a flat color
    // threshold, so the gem's own dark internal cracks/shadows didn't get
    // punched full of holes along with the real background); the floating
    // bob is added separately via the `gem-float` CSS keyframe where this
    // asset is actually used, not part of the video itself.
    animatedImage: "/assets/rewards/gem-lv-01-13-rotate.webp",
    rewardTable: KIT0_TABLE,
  },
  { name: "琥珀石寶箱", levelRange: "Lv.14-27", levelStart: 14, levelEnd: 27, image: "/assets/rewards/lv-14-27.png", rewardTable: buildRewardTable(14, 27, 1500) },
  { name: "摩根石寶箱", levelRange: "Lv.28-40", levelStart: 28, levelEnd: 40, image: "/assets/rewards/lv-28-40.png", rewardTable: buildRewardTable(28, 40, 4500) },
  { name: "血鑽石寶箱", levelRange: "Lv.41-53", levelStart: 41, levelEnd: 53, image: "/assets/rewards/lv-41-53.png", rewardTable: buildRewardTable(41, 53, 13500) },
  { name: "綠寶石寶箱", levelRange: "Lv.54-66", levelStart: 54, levelEnd: 66, image: "/assets/rewards/lv-54-66.png", rewardTable: buildRewardTable(54, 66, 40500) },
  { name: "翡翠石寶箱", levelRange: "Lv.67-79", levelStart: 67, levelEnd: 79, image: "/assets/rewards/lv-67-79.png", rewardTable: buildRewardTable(67, 79, 121500) },
  { name: "孔雀石寶箱", levelRange: "Lv.80-92", levelStart: 80, levelEnd: 92, image: "/assets/rewards/lv-80-92.png", rewardTable: buildRewardTable(80, 92, 364500) },
  { name: "合金石寶箱", levelRange: "Lv.93-100", levelStart: 93, levelEnd: 100, image: "/assets/rewards/lv-93-100.png", rewardTable: buildRewardTable(93, 100, 1093500) },
];

// The little ribbon/medal glyph next to every kit's name (Figma "Actions",
// node 662:16740 etc.) is built from plain border shapes plus one ellipse
// image rather than a single icon export -- reproduced as-is here instead
// of flattening it into a downloaded PNG, since Figma itself never exports
// it as one image (get_design_context returns only the ellipse asset, with
// the ribbon lines as real bordered divs).
function RankRibbonIcon() {
  return (
    <div className="relative size-[17px] shrink-0 overflow-hidden">
      <div className="absolute inset-[56%_4%_4%_56%]">
        <img alt="" src={withBasePath("/assets/rewards/icon-badge-ellipse.svg")} className="absolute inset-0 block size-full max-w-none" />
      </div>
      <div className="absolute inset-[12%_8%_8%_8%]">
        <div className="absolute inset-[12%_8%_36%_8%] rounded-tl-[2.04px] rounded-tr-[2.04px] rounded-bl-[1.36px] rounded-br-[1.36px] border-[1.36px] border-solid border-[#3e4140]" />
        <div className="absolute inset-[12%_28%_36%_28%] border-[1.36px] border-solid border-[#3e4140]" />
        <div className="absolute inset-[40%_40%_48%_40%] rounded-[2.526px] border-[1.36px] border-solid border-[#3e4140]" />
        <div className="absolute inset-[56%_12%_8%_12%] flex items-center justify-center" style={{ containerType: "size" }}>
          <div className="h-[100cqh] w-[100cqw] flex-none -rotate-180 -scale-x-100">
            <div className="relative size-full rounded-tl-[1.36px] rounded-tr-[1.36px] border-[1.36px] border-solid border-[#3e4140]" />
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
// other kit (274x332.35 vs the plain 216x262 every other bracket still
// uses) -- confirmed by diffing the two instances' own outer frame sizes
// in Figma, both perfectly consistent at that same ratio (274/216 ==
// 332.3518/262). Structurally identical otherwise (same card-frame image,
// same gem art, same name/ribbon/"前 5,000 名" text), so `zoom` -- not a
// hand-duplicated larger copy -- reproduces it exactly: it scales this
// button's own layout box along with everything inside it uniformly,
// which is also why the surrounding row's own `gap-[20px]` still lines up
// against the NEXT card at Figma's own x=294 (0 + 274 + 20) without this
// card needing special-cased margins of its own.
// Exported (not just used locally below) so the Level_line rail on
// RewardsCenterContent's own bottom menu can compute each card's real
// rendered width -- see that file's own `kitCardCenters` comment.
export const CURRENT_KIT_SCALE = 274 / 216;
export const PLAIN_KIT_CARD_WIDTH = 216;
export const KIT_CARD_GAP = 20;

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
  // starts floating/rotating on hover, not always-on): `kit.animatedImage`
  // (its own comment) only exists for the Lv.1-13 proof-of-concept bracket
  // so far, so every other kit's own `hovered` state simply never has
  // anything to swap to. `key={hovered}` forces a remount on the SAME
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
      className="relative block h-[262px] w-[216px] shrink-0 overflow-visible rounded-[20px] text-left"
      style={current ? ({ zoom: CURRENT_KIT_SCALE } as React.CSSProperties) : undefined}
    >
      <img
        alt=""
        src={withBasePath(selected ? "/assets/rewards/card-frame-selected.svg" : "/assets/rewards/card-frame.svg")}
        className="absolute bottom-0 left-px h-[196px] w-[215px]"
      />
      <div className="absolute left-1/2 top-[-8px] size-[212px] -translate-x-1/2 overflow-hidden">
        {/* Centering (`left-1/2 top-1/2 -translate-x/y-1/2`) and the
            floating bob need to be on TWO SEPARATE nested elements, not
            the same one -- a `@keyframes` animation's own `transform`
            REPLACES the element's whole transform value, which would wipe
            out this centering translate rather than combining with it
            (the same double-transform trap ScaleToFit's own zoom/position
            split elsewhere in this project already ran into). The floating
            wrapper below starts from a plain identity transform, so
            `gem-float`'s own translateY has nothing to clobber. */}
        <div className="absolute left-1/2 top-1/2 size-[160px] -translate-x-1/2 -translate-y-1/2">
          <img
            key={String(showAnimated)}
            alt={kit.levelRange}
            src={withBasePath(showAnimated ? kit.animatedImage! : kit.image)}
            className={`size-full object-contain ${showAnimated ? "animate-[gem-float_3s_ease-in-out_infinite]" : ""}`}
          />
        </div>
      </div>
      <div className="absolute bottom-[20px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[5px]">
        <div className="flex w-full items-center gap-[5px]">
          <RankRibbonIcon />
          <p className="whitespace-nowrap text-[12px] text-black">{kit.name}</p>
        </div>
        <div className="flex items-center gap-[5px] whitespace-nowrap">
          <p className="text-[12px] text-[#a2a2a2]">前</p>
          <p className="text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#23f3d5]">5,000</p>
          <p className="text-[12px] text-[#a2a2a2]">名</p>
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

export function RewardKitDetailPanel({ kit, maxHeight }: { kit: RewardKitData; maxHeight?: number }) {
  const half = Math.ceil(kit.rewardTable.length / 2);
  const left = kit.rewardTable.slice(0, half);
  const right = kit.rewardTable.slice(half);

  // Same thin teal scrollbar thumb this project already uses for its other
  // two scrollable panels (ProfileSidebar's own rail, Talking_Bar's own
  // message list) -- per the user's own direct call to reuse that exact
  // style here rather than a native browser scrollbar.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ height: 0, top: 0 });
  // Per the user's own direct call ("這裡下面看不到的地方要淡出" -- the part
  // that's cut off at the bottom here should fade out): the reward table
  // otherwise just hard-clips at this box's own edge whenever there's more
  // scrolled content below, with nothing indicating that's not simply the
  // end of the table. `hasMoreBelow` drives a bottom fade the same way
  // ProfileSidebar's own rail already fades its TOP edge once scrolled
  // away from it -- reusing that established mask-image convention rather
  // than inventing a different technique for the same kind of "there's
  // more, keep scrolling" affordance.
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      // `> 1`, not `> 0` -- sub-pixel scroll-height rounding (fractional
      // `zoom` scaling elsewhere on this page routinely produces this)
      // otherwise left a permanent 0.3px sliver of "more below" that never
      // actually clears even scrolled fully to the bottom.
      setHasMoreBelow(scrollHeight - clientHeight - scrollTop > 1);
      if (scrollHeight <= clientHeight) {
        setThumb({ height: 0, top: 0 });
        return;
      }
      // The box's own `rounded-tr-[50px]`/`rounded-br-[50px]` corners curve
      // inward well past this scroll container's own 20px vertical padding
      // -- a thumb track inset by just that padding (an earlier version
      // here did) poked out past the rounded silhouette at both ends,
      // confirmed live via a zoomed screenshot showing the thumb sticking
      // out past the curve. Insetting the TRACK by the corner radius
      // itself instead keeps the thumb inside the box's actual rounded
      // shape at any scroll position.
      const trackHeight = Math.max(0, clientHeight - 2 * SCROLLBAR_CORNER_INSET);
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
    // `items-center`, not the original `items-start` -- per the user's own
    // direct call ("石頭跟右邊的文案上下至中對其"), the gem column and the
    // text/table panel next to it should be vertically centered against
    // each other, not top-aligned. Doesn't affect the SEPARATE `items-start`
    // inside the scroll box below (its own comment explains that one).
    // `gap-[172.5px]` -- NOT the box's own literal spacing, and the gem's
    // box below is back to its ORIGINAL untouched `175px` (a version here
    // briefly widened that box to 480px to make the gap math simpler, but
    // that shifted the gem's own rendered position/center -- per the
    // user's own direct catch ("為什麼連石頭都出去了" / "石頭位子不變阿" / "我只是
    // 要你改石頭跟文案之間的間距"), the gem itself must stay exactly where it
    // already was; only the GAP to the text should change). The gem's own
    // box is still deliberately narrower than its 480px image (that box's
    // own comment), so the image bleeds (480-175)/2 = 152.5px past the
    // box's own right edge -- same as before any of this. `gap` measures
    // box-to-box, so the real visual clearance from the image's own true
    // (bled-out) edge is this value MINUS that 152.5px overflow. Tried 40px
    // of real clearance first (gap 192.5) -- confirmed live via the user's
    // own screenshot that read as much wider than the ~12.5px gap the
    // ORIGINAL (pre-enlarged) image had at this same spot, then 20px
    // (`152.5 + 20 = 172.5`), then per the user's own direct call to pull
    // the text 20px closer to the stone, settled on 0px of real
    // clearance -- the text now starts right at the gem's own bled-out
    // edge: `152.5 + 0 = 152.5`.
    <div className="flex items-center gap-[152.5px]">
      <div className="relative flex h-[311px] w-[175px] shrink-0 items-center justify-center overflow-visible">
        {/* Per the user's own direct call ("這裡顯示的能量石 不需要hover就會自轉"
            -- this large detail-panel gem always spins, no hover needed,
            unlike the small card's own hover-gated version): plays
            `kit.animatedImage` (its own comment) straight away whenever it
            exists, with no floating bob here -- Figma has no floating spec
            for this instance, only the small card asked for that.
            `size-[480px]` (BOTH width and height explicit), not just a
            `w-[480px]` -- per the user's own direct call ("這裡的石頭要跟我畫
            的紅圈依樣大"), circling roughly 2x this gem's own rendered size in
            a live screenshot. This box's own `overflow-visible` (its
            wrapper's own comment above) already lets the gem bleed past its
            175px column without clipping. A width-only version here
            silently computed to the image's own natural 460px instead of
            the requested 480 (confirmed live even with an `!important`
            inline override) -- this flex row's parent has a fixed
            `h-[311px]` cross-axis, and leaving height as `auto` put this
            replaced element into a sizing algorithm that solved for the
            wrong width entirely instead of deriving height from the
            explicit width via the image's own aspect ratio. Setting both
            dimensions explicitly (the asset is square, so equal) sidesteps
            that algorithm rather than depending on it. */}
        <img
          alt=""
          src={withBasePath(kit.animatedImage ?? kit.image)}
          className="size-[480px] max-w-none object-contain"
        />
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
          exactly as it always rendered, unconstrained. */}
      <div className="relative shrink-0">
        <div
          ref={scrollRef}
          className="no-scrollbar flex items-start overflow-y-auto rounded-tr-[50px] rounded-bl-[50px] rounded-br-[50px] border border-solid border-[#f4f4f4] bg-white/50 px-[40px] py-[20px] backdrop-blur-[10px]"
          style={{
            ...(maxHeight !== undefined && { maxHeight }),
            ...(hasMoreBelow && {
              maskImage: "linear-gradient(to bottom, black calc(100% - 40px), transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 40px), transparent)",
            }),
          }}
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
                以下為 Lv.{kit.levelStart}–{kit.levelEnd} 累積儲值等級的暫定範例。玩家的累積儲值金額達到對應門檻後，即可進入下一個等級，並逐步解鎖更高階的{kit.name}與成長回饋。前期等級門檻較容易達成，適合新手快速體驗升級節奏；中期開始提高累積需求，讓每次儲值都能明確推進進度；高階等級則提供更具挑戰性的長期目標，鼓勵玩家持續累積並朝 Lv.{kit.levelEnd} 邁進。等級越高，代表完成的累積里程碑越多，也能展現更高的會員身份與參與程度。下方金額皆以 USDT 計算，僅供版面與活動規劃參考，實際門檻、獎勵內容、發放條件及活動期間，仍應以最終公告與正式規則為準。請在儲值前確認目前累積進度與對應級別，避免因活動結算時間、資料更新或其他條件而影響資格判定。
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
      </div>
    </div>
  );
}
