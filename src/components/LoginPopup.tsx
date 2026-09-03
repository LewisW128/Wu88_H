"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial from "./AnimatedArrowSpecial";
import LoginPoster from "./LoginPoster";

// Figma "Loggin Popup" (00_WU88-H-COMPONENTS LIBRARY node 951:10131): the
// full login modal -- LoginPoster (the character collage, already its own
// component) on the right, the actual sign-in form on the left.
//
// Figma layers the popup's own background twice: the outer frame carries
// a Tailwind gradient+rounded-corner+border of its own, AND a separate
// "Loggin Popup_BG" image sits on top at the same size with a near-
// identical gradient plus a blurred rainbow accent blob and its own
// border baked in. Reproduced here with just the ONE image (it already
// has everything -- gradient, corner radius, accent blob, border) rather
// than doubling up on nearly-the-same gradient in Tailwind too. The
// image's own embedded `backdrop-filter` can't do anything once flattened
// into a static asset (same reason ContainerBg's "Subtract" glass panel
// needed a real live element for its blur) -- `backdrop-blur-[10px]`
// lives on this actual DOM element instead, clipped to the same
// rounded-bl/tr-100 shape so it blurs whatever's behind the popup.
//
// The WU88 logo reuses Sidebar's own `logo-mark.svg` instead of
// re-fetching Figma's "Union" export -- literally the same gradient
// wordmark, no reason to ship it twice. No text-input pattern existed
// anywhere in this codebase yet (Search is a decorative hover-expand
// pill, not a real field) -- these two are real `<input>`s since a login
// form needs actual keyboard interaction, establishing that pattern here.
//
// bg.svg originally baked its blurred rainbow accent blob into the same
// flattened image as the card shape/gradient/border -- split into bg.svg
// (just the static card) and bg-accent.svg (just the blurred blob) so the
// blob can get its own parallax transform independently, matching
// LoginPoster's own per-layer depth treatment on the right (per request:
// these background blurred pieces should drift with the cursor too, not
// just LoginPoster's layers). Both still get clipped to the card's own
// rounded-bl/tr-100 silhouette for free by the outer container's own
// `overflow-hidden` -- neither file needs its own internal clip-path.
const DEPTH = { accent: 5, chip3: 11 } as const;

export default function LoginPopup({ className }: { className?: string }) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 }); // each in [-0.5, 0.5]

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  function layerStyle(depth: number): React.CSSProperties {
    return {
      transform: `translate3d(${tilt.x * depth}px, ${tilt.y * depth}px, 0)`,
      transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
    };
  }

  return (
    <div
      className={
        className ||
        "relative h-[630.898px] w-[976px] overflow-hidden rounded-bl-[100px] rounded-tr-[100px] backdrop-blur-[10px]"
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img alt="" src={withBasePath("/item/loggin-popup/bg.svg")} className="pointer-events-none absolute inset-0 size-full" />

      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.accent)}>
        <img alt="" src={withBasePath("/item/loggin-popup/bg-accent.svg")} className="absolute inset-0 size-full" />
      </div>

      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.chip3)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-popup/chip-3.webp")}
          className="absolute left-[-105.56px] top-[352.44px] h-[464px] w-[348px] object-cover opacity-80 blur-[5px]"
        />
      </div>

      <button
        type="button"
        aria-label="關閉"
        className="absolute left-[39.44px] top-[39.38px] size-[25px]"
      >
        <img alt="" src={withBasePath("/item/loggin-popup/close.svg")} className="size-full" />
      </button>

      <div className="absolute left-[93.44px] top-1/2 flex -translate-y-1/2 flex-col items-center gap-[80px]">
        <div className="flex flex-col items-center gap-[40px]">
          <div className="flex flex-col items-start gap-[7px]">
            <img alt="WU88.ONE" src={withBasePath("/assets/sidebar/logo-mark.svg")} className="h-[47.6px] w-[148.87px]" />
            <p className="whitespace-nowrap text-[9.74px] font-semibold italic tracking-[13.149px] text-[#3e4140]">WU88.ONE</p>
          </div>

          <div className="flex flex-col items-start gap-[20px]">
            <div className="relative h-[45px] w-[300px] overflow-hidden rounded-[15px] border border-[#3e4140] bg-white">
              <img alt="" src={withBasePath("/item/loggin-popup/icon-account.svg")} className="absolute left-[9px] top-[9px] size-[25px]" />
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="請輸入您的帳號"
                className="absolute inset-0 bg-transparent pl-[48px] pr-[15px] text-[10px] leading-[18px] tracking-[0.15px] text-[#3e4140] outline-none placeholder:text-[#a2a2a2]"
              />
            </div>

            <div className="flex w-[300px] flex-col items-end gap-[10px]">
              <div className="relative h-[45px] w-full overflow-hidden rounded-[15px] border border-[#3e4140] bg-white">
                <img alt="" src={withBasePath("/item/loggin-popup/icon-password.svg")} className="absolute left-[9px] top-[9px] size-[25px]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入您的6-12位英文字母及數字"
                  className="absolute inset-0 bg-transparent pl-[48px] pr-[15px] text-[10px] leading-[18px] tracking-[0.15px] text-[#3e4140] outline-none placeholder:text-[#a2a2a2]"
                />
              </div>
              <button type="button" className="whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-[#8d54d8]">
                忘記密碼
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-[10px]">
          <div className="flex items-center gap-[20px]">
            <button
              type="button"
              className="flex w-[140px] items-center justify-between overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#8d54d8] px-[15px] py-[10px]"
            >
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-white">註冊</span>
              <AnimatedArrowSpecial hovered size={25} color="white" />
            </button>
            <button
              type="button"
              className="flex w-[140px] items-center justify-between overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#23f3d5] px-[15px] py-[10px]"
            >
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">登入</span>
              <AnimatedArrowSpecial hovered size={25} color="#3e4140" />
            </button>
          </div>
          <button type="button" className="whitespace-nowrap text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">
            進去逛逛
          </button>
        </div>
      </div>

      <p className="absolute bottom-[39.38px] left-[93.44px] whitespace-nowrap text-[12px] font-medium leading-[18px] tracking-[0.15px] text-[#a2a2a2]">
        Ver. 7.10.1101
      </p>

      {/* NOT pointer-events-none -- LoginPoster's own parallax listens for
          mousemove on this exact element. */}
      <LoginPoster className="absolute right-[-0.56px] top-[-0.56px] h-[630.898px] w-[488px] overflow-hidden" />
    </div>
  );
}
