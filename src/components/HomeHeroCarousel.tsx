"use client";

import { createContext, useContext, useEffect, useState } from "react";
import ContainerBg from "./ContainerBg";
import Tag from "./Tag";

const SLIDE_COUNT = 2; // Figma's own carousel dots show 4 segments, but only
// this page's two hero variants (home 883:125520 / home-energy 894:103893)
// actually have content yet -- the extra two dots stay inert placeholders
// below rather than cycling to slides that don't exist.
const DOT_COUNT = 4;
const AUTO_ADVANCE_MS = 6000;
const FADE_MS = 700;
// Content's own box height stays pinned to the default slide's height on
// BOTH slides -- Dots/Form_Bar/Hot_Games below must sit at the exact same
// spot regardless of which slide is active, not shift down while the much
// taller energy card (303px, see EnergySlideCard) is showing. That card
// simply overflows past this box's own bottom edge instead of resizing it;
// nothing clips it there (Content has no `overflow-hidden`), and it paints
// over Dots/Form_Bar rather than under them purely because CSS stacking
// order puts an `absolute` box like the card's own wrapper above its
// non-positioned in-flow siblings -- no explicit z-index needed.
const DEFAULT_CONTENT_HEIGHT = 70; // headline leading-[36px] + gap-[14px] + subtitle leading-[20px]

type CarouselContext = { active: number; setActive: (i: number) => void };
const Ctx = createContext<CarouselContext | null>(null);

function useCarousel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("HomeHeroCarousel.* must be rendered inside HomeHeroCarousel.Provider");
  return ctx;
}

// The hero background (Container_BG, sibling of the page's own grid columns
// -- see page.tsx's own comment on why) and the hero text/CTA/dots (inside
// the grid's middle column) are two physically separate DOM subtrees that
// both need the same `active` slide index, so it's lifted into this
// Provider/Context pair instead of local state in either piece -- letting
// page.tsx mount Background and Content wherever Figma's own layout needs
// them while keeping one shared timer/click-source of truth.
export function Provider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDE_COUNT), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  return <Ctx.Provider value={{ active, setActive }}>{children}</Ctx.Provider>;
}

// Both variants are always mounted (not conditionally rendered) so the
// home-energy slide's static image is already decoded and the default
// slide's sprite animation never restarts/pops when either fades back in
// -- only `opacity` toggles between them.
export function Background() {
  const { active } = useCarousel();
  return (
    // `relative` + explicit size: both slides below are `absolute inset-0`
    // for the crossfade, so without a sized box of its own here, this
    // wrapper has nothing left in normal flow to compute an auto size from
    // and collapses to 0x0 -- taking both (otherwise correctly positioned)
    // slides with it. Matches ContainerBg's own fixed 1728x1078 native size.
    <div className="relative h-[1078px] w-[1728px]">
      <div className="absolute inset-0 transition-opacity ease-in-out" style={{ opacity: active === 0 ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}>
        <ContainerBg variant="home" />
      </div>
      <div className="absolute inset-0 transition-opacity ease-in-out" style={{ opacity: active === 1 ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}>
        <ContainerBg variant="home-energy" />
      </div>
    </div>
  );
}

// Figma "Frame 1241": the default slide's headline, no CTA.
function DefaultSlideText() {
  return (
    <div className="flex flex-col items-start gap-[14px]">
      <p className="w-full text-[40px] font-black leading-[36px] tracking-[0.36px] text-[#8d54d8]">精彩不設限 贏得更過癮</p>
      <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">
        高額獎金 <span className="text-[#23f3d5]">24h</span> 精彩不間斷
      </p>
    </div>
  );
}

// Figma "Subtract" (node 894:108272): the card's own outline, a 634x303
// rounded rect with a second, smaller rounded notch cut from its bottom-
// right corner so the Tag (below, fully opaque) nests flush into it
// instead of sitting on top of the panel's own rounded corner. Reproduced
// as a real `clip-path: path(...)` (Figma's own raw SVG path, verbatim)
// rather than a plain `rounded-[25px]` box -- a uniform rounded rect reads
// visibly wrong here since the notch is a good third of the card's own
// height, not a subtle corner tweak.
const SUBTRACT_PATH =
  "M25 1H609C622.255 1 633 11.7452 633 25V214C633 227.255 622.255 238 609 238H467C452.641 238 441 249.641 441 264V278C441 291.255 430.255 302 417 302H25C11.7452 302 1 291.255 1 278V25C1 11.7452 11.7452 1 25 1Z";

// Figma "Frame 1286" (node 894:108268): a self-contained 634x303 glass info
// card -- headline/subtitle, two rule-text blocks (活動方式/活動提醒), and the
// "立即領取" CTA pinned into the Subtract notch at its bottom-right corner.
// The blurred glass fill and its border are two separate layers sharing
// SUBTRACT_PATH (a `backdrop-blur` div clipped to the path, plus a plain
// `<svg>` stroke on top) rather than one bordered/clipped div, since
// `clip-path` cuts a box's border along with its content -- it can't
// produce a stroke that follows the clip path's own edge on its own.
function EnergySlideCard() {
  return (
    <div className="relative h-[303px] w-[634px]">
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[10px]" style={{ clipPath: `path('${SUBTRACT_PATH}')` }} />
      <svg className="pointer-events-none absolute inset-0" width={634} height={303} viewBox="0 0 634 303" fill="none">
        <path d={SUBTRACT_PATH} stroke="#f4f4f4" strokeWidth={2} />
      </svg>
      <div className="absolute inset-[15px] flex h-[274px] flex-col items-start gap-[20px] overflow-hidden">
        <div className="flex flex-col items-start gap-[10px]">
          <p className="whitespace-nowrap text-[40px] leading-[36px] tracking-[0.36px]">
            <span className="font-bold text-[#3e4140]">每日能源補給</span>
            <span className="font-bold text-[#f4f4f4]">｜</span>
            <span className="font-black text-[#8d54d8]">登入領取能量寶石</span>
          </p>
          <p className="text-[14px] font-bold leading-[20px] tracking-[17px] text-[#a2a2a2]">城市能源正在重新啟動</p>
        </div>
        <div className="text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">
          <p className="mb-[2px]">每日登入 WU88，即可開啟你的專屬能源補給艙，免費領取當日獎勵！</p>
          <p>
            連續登入的天數越多，獲得的能量寶石與補給獎勵也將逐步提升。
            <br />
            每天完成一次能源認證，累積寶石、解鎖更高階補給，讓你的能源儲備持續升級。
          </p>
        </div>
        <div className="flex flex-col items-start gap-[10px] tracking-[0.15px]">
          <p className="text-[14px] font-bold leading-[20px] text-[#3e4140]">活動方式</p>
          <div className="text-[12px] leading-[18px] text-[#a2a2a2]">
            <p className="mb-[2px]">
              每日登入活動頁面，即可領取當日專屬獎勵。
              <br />
              連續簽到可解鎖不同等級的能量寶石補給，越接近最終能源核心，獎勵越豐富！
            </p>
            <p className="mb-[2px]">登入 → 啟動補給 → 領取能量寶石 → 解鎖下一階段</p>
            <p>不要讓能源中斷。</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[10px] tracking-[0.15px]">
          <p className="text-[14px] font-bold leading-[20px] text-black">活動提醒</p>
          <div className="text-[12px] leading-[18px] text-[#a2a2a2]">
            <p className="mb-[2px]">
              每日獎勵限領取一次，逾期未領取之當日獎勵將無法補領。
              <br />
              實際獎勵內容及領取條件依活動頁面顯示為準。
            </p>
            <p>能源已就緒，今天的補給等你啟動。</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0">
        <Tag label="立即領取" active width={172} />
      </div>
    </div>
  );
}

// The default slide sits `bottom-0` of this box; Dots/Form_Bar below
// always land at the same spot regardless of which slide is active
// because the box's own bottom edge never moves. The energy card needs to
// start well above that bottom (see EnergySlideCard's own reference
// screenshot -- at its full 303px height it reaches nearly up to the
// utility row above), which is why the box itself is taller than
// DEFAULT_CONTENT_HEIGHT and shifted up by the same amount via a negative
// margin -- NOT by giving some child a negative `top` inside a box that
// stays DEFAULT_CONTENT_HEIGHT tall. That first version did exactly that
// and broke page scrolling everywhere, not just on this slide: an
// out-of-flow child positioned above its own `relative` ancestor's box
// still extends that ancestor's *scrollable* overflow region upward, and
// nothing between here and the document root clips it -- so the whole
// page gained ~150px of extra, blank scroll room above its actual top,
// visible as sticky Sidebar/Top_bar floating in empty space once
// scrolled up. Shifting the box itself up with `margin-top` instead stays
// entirely inside room the surrounding flex column's own `pt-[150px]`
// already reserves -- nothing new for any ancestor's overflow to pick up.
export function Content() {
  const { active } = useCarousel();
  return (
    <div className="relative -mt-[150px]" style={{ height: DEFAULT_CONTENT_HEIGHT + 150 }}>
      <div
        className={`absolute inset-x-0 bottom-0 transition-opacity ease-in-out ${active === 0 ? "opacity-100" : "invisible opacity-0"}`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      >
        <DefaultSlideText />
      </div>
      <div
        className={`absolute inset-x-0 top-0 transition-opacity ease-in-out ${active === 1 ? "opacity-100" : "invisible opacity-0"}`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      >
        <EnergySlideCard />
      </div>
    </div>
  );
}

// Figma "Cotainer change bar": a 4-segment indicator, active segment wider
// + teal. Only the first two are real, clickable slides (see SLIDE_COUNT's
// own comment) -- the other two stay their plain inactive look and don't
// respond to clicks.
export function Dots() {
  const { active, setActive } = useCarousel();
  return (
    <div className="flex items-center gap-[10px]">
      {Array.from({ length: DOT_COUNT }, (_, i) => {
        const isRealSlide = i < SLIDE_COUNT;
        const isActive = isRealSlide && i === active;
        return (
          <button
            key={i}
            type="button"
            aria-label={`第 ${i + 1} 張輪播圖`}
            aria-current={isActive}
            disabled={!isRealSlide}
            onClick={() => setActive(i)}
            className={`h-[2px] rounded-full transition-[width,background-color] duration-300 ${
              isActive ? "w-[50px] bg-[#23f3d5]" : "w-[40px] bg-[#f4f4f4]"
            } ${isRealSlide ? "cursor-pointer" : "cursor-default"}`}
          />
        );
      })}
    </div>
  );
}
