"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial from "./AnimatedArrowSpecial";

export type PromotionCardSize = "General" | "Small" | "Large";

export type PromotionCardCountdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

// Only ever used as a hook-call fallback when no `countdown` prop is
// passed (General/Small cards, which never render the pill anyway) --
// never actually displayed.
const DEFAULT_COUNTDOWN_SEED: PromotionCardCountdown = { days: "08", hours: "08", minutes: "12", seconds: "32" };

function countdownToSeconds({ days, hours, minutes, seconds }: PromotionCardCountdown): number {
  return (Number(days) || 0) * 86400 + (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60 + (Number(seconds) || 0);
}

const pad2 = (n: number) => String(n).padStart(2, "0");

// A recurring countdown derived purely from wall-clock time (Date.now()
// modulo the cycle length), not a fixed calendar deadline -- there's no
// real promo end-date behind "08 天 08 時 12 分 32 秒", just a repeating
// "counts down, hits zero, starts over" timer (per the user's own
// request: 隨時間倒數，直到歸零再重來). Deriving it this way, rather than
// tracking "time since mount" or persisting a target end-time, also
// means every place this same promo appears (PromotionCard's own "usdt"
// entry AND GuestPromoCard's copy of the identical countdown) shows the
// same synchronized value at any given real moment for free, with no
// shared state needed between them.
export function useCountdown(seed: PromotionCardCountdown): PromotionCardCountdown {
  const cycleMs = countdownToSeconds(seed) * 1000;
  // SSR-safe: starts at the exact seed values (matching what used to be
  // the permanently-static display) on both the server render and the
  // first client render, then corrects to the real live value once
  // mounted -- same reasoning as this project's other wall-clock/
  // localStorage-driven state (Day Rewards, the count-up numbers on
  // Statistics, etc.).
  const [remainingMs, setRemainingMs] = useState(cycleMs);

  useEffect(() => {
    function update() {
      const elapsed = Date.now() % cycleMs;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemainingMs(cycleMs - elapsed);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [cycleMs]);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  return {
    days: pad2(Math.floor(totalSeconds / 86400)),
    hours: pad2(Math.floor((totalSeconds % 86400) / 3600)),
    minutes: pad2(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad2(totalSeconds % 60),
  };
}

export type PromotionCardProps = {
  size?: PromotionCardSize;
  image: string;
  lines: [string, string];
  countdown?: PromotionCardCountdown;
};

const SIZE_CONFIG = {
  General: {
    width: 331,
    mask: "/assets/promotion/card-mask-general.svg",
    buttonSize: 50,
    arrowSize: 27.761,
  },
  Small: {
    width: 297,
    mask: "/assets/promotion/card-mask-small.svg",
    buttonSize: 50,
    arrowSize: 27.761,
  },
  Large: {
    width: 594,
    mask: "/assets/promotion/card-mask-large.svg",
    buttonSize: 47.761,
    arrowSize: 27.761,
  },
} as const;

// Exported for GuestPromoCard -- the guest profile page pairs ProfileCard
// with a Promotion instance (node 595:15300) that shares this exact
// countdown-pill markup but isn't the notched Products/GameCard family
// this component itself is (plain rounded card, a bleeding object-contain
// photo instead of a masked crop), so it can't just reuse PromotionCard
// wholesale the way the Promotions row's own "usdt" entry does elsewhere.
export function TextsLine() {
  return <img alt="" src={withBasePath("/assets/product-card/texts-line.svg")} className="w-[10px] self-stretch" />;
}

export function TimeUnit({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex items-end gap-[5px]">
      <p className="text-[14px] font-bold leading-[20px] text-[#23f3d5]">{value}</p>
      <p className="text-[10px] leading-[18px] text-[#3e4140]">{unit}</p>
    </div>
  );
}

// Figma "Promotion" component (Components Library node 77:1094 / 835:10368 /
// 672:21887, size=General/Small/Large). Same notched-card family as
// GameCard/ProductCard, landscape. General and Small share one photo
// ("Style=11") and just crop it to a narrower frame -- Figma keeps the photo
// at its original 331-wide box and shifts it left, then re-masks with an
// equal-and-opposite offset so the shape stays pinned to the narrower
// container (see the paired left/mask-position values below). Large swaps in
// its own wider photo and adds an "Everyday Rewards" countdown pill next to
// the promo text; its Play button is also a touch smaller (47.761 vs 50px).
export default function PromotionCard({ size = "General", image, lines, countdown }: PromotionCardProps) {
  const config = SIZE_CONFIG[size];
  const [hovered, setHovered] = useState(false);
  // Hooks can't be called conditionally, so this runs every render
  // regardless of `size`/whether `countdown` was passed -- its result is
  // simply unused below when there's no countdown pill to show. Falls
  // back to the caller-agnostic default seed rather than e.g. skipping
  // with a zero-length cycle, which would divide by zero.
  const liveCountdown = useCountdown(countdown ?? DEFAULT_COUNTDOWN_SEED);
  const maskStyle = {
    maskImage: `url("${withBasePath(config.mask)}")`,
    maskSize: `${config.width}px 210px`,
    maskRepeat: "no-repeat",
  };

  return (
    <div
      className="group relative h-[210px] shrink-0"
      style={{ width: config.width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0" style={maskStyle}>
        {size === "Small" ? (
          <div
            className="absolute left-[-17px] top-0 h-[210px] w-[331px] overflow-hidden"
            style={{ ...maskStyle, maskPosition: "17px 0px" }}
          >
            <img
              alt=""
              src={image}
              className="pointer-events-none absolute max-w-none object-cover"
              style={{ left: "-22.05%", top: "-4.39%", width: "144.11%", height: "127.84%" }}
            />
          </div>
        ) : size === "Large" ? (
          <img
            alt=""
            src={image}
            className="pointer-events-none absolute left-0 h-[271px] w-full max-w-none object-cover"
            style={{ ...maskStyle, maskPosition: "0px 34px", bottom: "-27px" }}
          />
        ) : (
          <img
            alt=""
            src={image}
            className="pointer-events-none absolute max-w-none object-cover"
            style={{ left: "-22.05%", top: "-4.39%", width: "144.11%", height: "127.84%" }}
          />
        )}

        <img
          alt=""
          src={withBasePath("/assets/game-card/digital-dots.svg")}
          className="pointer-events-none absolute left-[70px] top-[9px] size-[218px]"
          style={{ ...maskStyle, maskPosition: "-70px -9px" }}
        />

        <div
          className="absolute bottom-0 left-0 h-[72px] w-full bg-gradient-to-b from-transparent to-black"
          style={{ ...maskStyle, maskPosition: "0px -138px" }}
        >
          <div className="absolute left-[20px] top-1/2 flex -translate-y-1/2 items-center gap-[20px]">
            <div className="flex w-[119px] items-center gap-[10px]">
              <TextsLine />
              <div className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px]">
                <p className="text-white">{lines[0]}</p>
                <p className="text-[#23f3d5]">{lines[1]}</p>
              </div>
            </div>

            {size === "Large" && countdown && (
              <div className="flex flex-col items-start rounded-[10px] bg-white/50 px-[10px] py-[5px] backdrop-blur-[10px]">
                <div className="flex w-[327px] items-center justify-between whitespace-nowrap tracking-[0.15px]">
                  <TimeUnit value={liveCountdown.days} unit="天" />
                  <TimeUnit value={liveCountdown.hours} unit="時" />
                  <TimeUnit value={liveCountdown.minutes} unit="分" />
                  <TimeUnit value={liveCountdown.seconds} unit="秒" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="promotion"
        className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-[#f4f4f4] p-[10px] backdrop-blur-[10px] transition-colors duration-300 group-hover:bg-[#3e4140]"
        style={{ width: config.buttonSize, height: config.buttonSize }}
      >
        <div className="relative" style={{ width: config.arrowSize, height: config.arrowSize }}>
          <AnimatedArrowSpecial hovered={!hovered} size={config.arrowSize} color="#3e4140" className="absolute inset-0" />
          <AnimatedArrowSpecial hovered={hovered} size={config.arrowSize} color="#23f3d5" className="absolute inset-0" />
        </div>
      </button>
    </div>
  );
}
