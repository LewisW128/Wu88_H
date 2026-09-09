"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial from "./AnimatedArrowSpecial";
import { TextsLine, TimeUnit, useCountdown } from "./PromotionCard";

// Same seed PromotionCard's own "usdt" Large entry uses (see that
// file's own useCountdown comment for why deriving it from wall-clock
// time keeps both copies of this identical promo synchronized without
// any shared state between them).
const COUNTDOWN_SEED = { days: "08", hours: "08", minutes: "12", seconds: "32" };

// Figma "Promotion" (05_WU88-H-PC-Profile-Page node 595:15300, seen live
// on the guest page at 455:23317): sits beside the guest ProfileCard the
// same way VipCard sits beside the logged-in one, but it is NOT a reuse
// of PromotionCard's own "Large" size despite matching that entry's exact
// countdown copy (新會員首儲『贈』200,000, 08/08/12/32) -- Figma builds
// this one as a plain rounded-[20px] card with a full-bleed photo, not
// the notched Products/GameCard family PromotionCard's own mask-image
// logic produces. The photo itself is unique to this slot too (a
// different still than the Promotions row's own large-usdt.png), sized
// larger than the card (611x279 against the card's own 594x236) and
// object-contain'd off-center so it deliberately bleeds past the left/
// top/bottom edges rather than being cropped tight to fill it.
export default function GuestPromoCard() {
  const [hovered, setHovered] = useState(false);
  const countdown = useCountdown(COUNTDOWN_SEED);

  return (
    <div
      className="group relative h-[236px] w-[594px] shrink-0 overflow-hidden rounded-[20px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        alt=""
        src={withBasePath("/assets/profile/guest-promo-character.png")}
        className="pointer-events-none absolute bottom-[-30px] left-1/2 h-[279px] w-[611px] max-w-none -translate-x-1/2 object-contain"
      />

      <img alt="" src={withBasePath("/assets/game-card/digital-dots.svg")} className="pointer-events-none absolute left-[20px] top-[9px] size-[218px]" />

      <div className="absolute inset-x-0 bottom-0 h-[72px] bg-gradient-to-b from-transparent to-black">
        <div className="absolute left-[20px] top-1/2 flex -translate-y-1/2 items-center gap-[20px]">
          <div className="flex w-[119px] items-center gap-[10px]">
            <TextsLine />
            <div className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px]">
              <p className="text-white">新會員首儲『贈』</p>
              <p className="text-[#23f3d5]">200,000</p>
            </div>
          </div>

          <div className="flex flex-col items-start rounded-[10px] bg-white/50 px-[10px] py-[5px] backdrop-blur-[10px]">
            <div className="flex w-[327px] items-center justify-between whitespace-nowrap tracking-[0.15px]">
              <TimeUnit value={countdown.days} unit="天" />
              <TimeUnit value={countdown.hours} unit="時" />
              <TimeUnit value={countdown.minutes} unit="分" />
              <TimeUnit value={countdown.seconds} unit="秒" />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="promotion"
        className="absolute bottom-[20px] right-[20px] flex size-[47.761px] items-center justify-center rounded-full bg-[#f4f4f4] p-[10px] backdrop-blur-[10px] transition-colors duration-300 group-hover:bg-[#3e4140]"
      >
        <div className="relative size-[27.761px]">
          <AnimatedArrowSpecial hovered={!hovered} color="#3e4140" className="absolute inset-0" />
          <AnimatedArrowSpecial hovered={hovered} color="#23f3d5" className="absolute inset-0" />
        </div>
      </button>
    </div>
  );
}
