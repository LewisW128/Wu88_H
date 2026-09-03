"use client";

import Link from "next/link";
import { useState } from "react";
import { withBasePath } from "../lib/asset";
import Avatar from "./Avatar";
import AnimatedArrowSpecial, { useArrowPulse } from "./AnimatedArrowSpecial";
import LoginModal from "./LoginModal";

// Figma "TopUp" component (Components Library). Two independent instances,
// each with its own Hover=off/on pair -- guest (node 750:8076 / 750:8115)
// and logged-in (node 881:53004 / 891:121516). Collapsed: just an avatar
// and a notification bell either way. On hover it expands to reveal, for a
// guest, purple "註冊" + green "登入" buttons (per request, dropped Figma's
// own "@handle" text next to the guest avatar -- nothing to show a handle
// for pre-login); for a logged-in member, the account's own handle/level/
// balance plus a green "儲值" (top-up) button -- then a divider before the
// bell either way. Since Figma only gives static hover snapshots, the
// expansion itself is built as a real width transition -- a
// grid-template-columns 0fr->1fr animation, which can animate to an unknown
// natural width smoothly (a plain width/max-width transition can't without
// hardcoding a guessed px value).
//
// No real auth system exists yet, so `loggedIn` is local, self-contained
// state: "登入" opens LoginModal, and successfully logging in (both fields
// filled, see LoginPopup's own comment) just flips this widget's own view
// -- it doesn't touch any other component. Mock account data ("Jessica")
// matches the same mock member profile/page.tsx already uses elsewhere.
//
// No `gap` on the outer flex: with 3 children where the middle one
// collapses to a real 0px wide box (not just visually hidden), `gap`
// still reserves its full width on BOTH sides of that box. Margins on the
// two OUTER children instead (matching each state's own Figma gap value)
// give exactly one gap's worth of space at rest, since the collapsed
// middle child contributes nothing between them.
// Avatar's own 34px display is a much more extreme downscale than
// ProfileCard's ~316px use of this same source photo -- browsers don't
// sharpen when scaling raster images down that far, so the fine detail
// (hair strands, soft studio lighting) just reads as blur at icon size.
// avatar-placeholder-thumb.png is a pre-cropped-to-square, pre-sharpened
// 200px thumbnail of the exact same photo, made for small contexts like
// this one -- ProfileCard keeps the full-res original since it needs the
// detail at its own larger size.
const MOCK_MEMBER = { avatar: "/assets/profile/avatar-placeholder-thumb.png", name: "Jessica", level: "Lv.35", balance: "10M" };

export default function TopUp() {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const topUpArrow = useArrowPulse();

  return (
    <div
      className={`group flex items-center rounded-[50px] bg-[#f4f4f4] px-[15px] backdrop-blur-[15px] transition-[padding] duration-300 ${
        loggedIn ? "py-[15px] group-hover:py-[11px]" : "h-[65px] py-[15px]"
      }`}
    >
      {loggedIn ? (
        <div className="mr-[40px] flex shrink-0 items-center transition-[margin] duration-300 group-hover:mr-[20px]">
          <Avatar photo={withBasePath(MOCK_MEMBER.avatar)} size={34} />
        </div>
      ) : (
        <div className="mr-[38px] flex shrink-0 items-center gap-[10px] transition-[margin] duration-300 group-hover:mr-[20px]">
          <Link
            href="/profile?guest=1"
            aria-label="會員中心"
            className="relative size-[34px] shrink-0 overflow-hidden rounded-full border-2 border-[#3e4140] bg-white"
          >
            <img
              alt=""
              src={withBasePath("/assets/top-up/avatar-icon.svg")}
              className="absolute inset-[calc(18.64%-1.25px)_calc(7.63%-1.69px)_calc(-3.39%-2.14px)_calc(7.63%-1.69px)] block size-full max-w-none"
            />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 group-hover:grid-cols-[1fr]">
        <div className="flex items-center gap-[20px] overflow-hidden">
          {loggedIn ? (
            <>
              <div className="flex shrink-0 flex-col items-start gap-[2px]">
                <div className="flex items-center gap-[10px]">
                  <p className="whitespace-nowrap text-[10px] font-medium leading-[18px] tracking-[0.15px] text-[#a2a2a2]">{`@ ${MOCK_MEMBER.name}`}</p>
                  <div className="flex h-[18px] items-center justify-center rounded-[50px] bg-[#8d54d8] px-[5px] py-[2px]">
                    <p className="whitespace-nowrap text-[10px] font-medium leading-[18px] tracking-[0.15px] text-white">{MOCK_MEMBER.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-[5px]">
                  <img alt="" src={withBasePath("/assets/top-up/coin-icon.svg")} className="size-[16px] shrink-0" />
                  <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">{MOCK_MEMBER.balance}</p>
                  <img alt="" src={withBasePath("/assets/top-up/trend-up.svg")} className="h-[10px] w-[12.629px] shrink-0" />
                </div>
              </div>

              <button
                type="button"
                onMouseEnter={topUpArrow.pulse}
                className="flex h-[40px] shrink-0 items-center justify-between gap-[10px] rounded-[15px] bg-[#23f3d5] p-[10px]"
              >
                <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">儲值</span>
                <AnimatedArrowSpecial hovered={topUpArrow.hovered} size={25} color="#3e4140" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                className="flex h-[40px] items-center justify-between gap-[10px] rounded-[15px] bg-[#8d54d8] p-[10px]"
              >
                <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-white">註冊</span>
                <img alt="" src={withBasePath("/assets/top-up/arrow-register.svg")} className="size-[25px]" />
              </button>

              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="flex h-[40px] items-center justify-between gap-[10px] rounded-[15px] bg-[#23f3d5] p-[10px]"
              >
                <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">登入</span>
                <img alt="" src={withBasePath("/assets/top-up/arrow-topup.svg")} className="size-[25px]" />
              </button>
            </div>
          )}

          <img alt="" src={withBasePath("/assets/top-up/divider.svg")} className="h-[2px] w-[16px] shrink-0 rotate-90" />
        </div>
      </div>

      <img
        alt="notifications"
        src={withBasePath("/assets/top-up/notify-icon.svg")}
        className="ml-0 size-[25px] shrink-0 transition-[margin] duration-300 group-hover:ml-[20px]"
      />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={() => { setLoggedIn(true); setShowLogin(false); }} />}
    </div>
  );
}
