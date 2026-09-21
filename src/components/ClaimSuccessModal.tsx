"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { withBasePath } from "../lib/asset";
import PopupScaleToFit from "./PopupScaleToFit";
import TwinklingDots from "./TwinklingDots";

const CARD_WIDTH = 560;
const CARD_HEIGHT = 659;
// When "領取成功 !" fades in: the moment the clip cuts to its last shot (she
// presents the chest to the camera).
const TITLE_REVEAL_S = 13;

// Figma "Registration Card" as reused for the daily-claim success popup
// (04_WU88-H-PC-Promotions node 192:21294): the same 560x659 frosted card
// shape RegistrationPopup uses -- plain top-left corner, 50px radii elsewhere,
// pale ribbons bleeding in from that corner -- filled edge to edge with the
// cyberpunk "she hands you the reward chest" scene, the digital-dot cluster
// top-right, a white "領取成功 !" over it and a translucent purple-to-teal
// "確定" button pinned to the bottom.
//
// The scene is now a 20s animation (Seedance 2.5, animated from Figma's still
// per the user's own call), pre-cropped to exactly the card's visible window
// (524x616, the card's 560:659) and re-encoded small (~1.7MB -- a frame
// sequence of the same clip would be 6-7MB, since H.264 only stores what
// changes between frames): she drives a supercar through the neon city, drifts
// to a stop in tire smoke, steps out, and ends presenting the chest to the
// camera -- the still's own composition. It plays once and holds its last
// frame; "領取成功 !" fades in as that last shot begins, and 確定 is always
// available. Sound plays when the browser allows it (the popup opens from a
// click), falling back to muted; a viewer who prefers reduced motion just gets
// Figma's still with the title showing.
function ClaimSuccessCard({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showTitle, setShowTitle] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Reading a media query after mount (it doesn't exist on the server).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReducedMotion(true);
      setShowTitle(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {
      // Autoplay with sound was refused -- play it silent instead.
      video.muted = true;
      video.play().catch(() => {});
    });
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-bl-[50px] rounded-br-[50px] rounded-tr-[50px] bg-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.07),0_24px_64px_rgba(0,0,0,0.1)] backdrop-blur-[12px]"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {reducedMotion ? (
        <img
          alt=""
          src={withBasePath("/assets/day-rewards/claim-success.webp")}
          className="pointer-events-none absolute left-[calc(50%+0.5px)] top-[calc(50%+96.5px)] h-[1374px] w-[773px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src={withBasePath("/assets/day-rewards/claim-success.mp4")}
          poster={withBasePath("/assets/day-rewards/claim-success-poster.jpg")}
          playsInline
          preload="auto"
          onTimeUpdate={(event) => {
            if (event.currentTarget.currentTime >= TITLE_REVEAL_S) setShowTitle(true);
          }}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      )}
      {/* Figma's digital-dots cluster (the same artwork as the page heroes' one,
          scaled to 242x231) as TwinklingDots, so each dot twinkles on its own
          timer instead of sitting as a flat image. */}
      <TwinklingDots className="pointer-events-none absolute right-[0.46px] top-0 h-[231px] w-[242.221px]" />
      <img alt="" src={withBasePath("/assets/registration/decor-small.svg")} className="pointer-events-none absolute left-[164px] top-[11px] h-[65px] w-[79px] max-w-none rotate-180" />
      <img alt="" src={withBasePath("/assets/day-rewards/claim-decor-large.svg")} className="pointer-events-none absolute left-[-105px] top-[-99px] h-[228px] w-[277px] max-w-none rotate-180" />

      <p
        className={`absolute left-[calc(50%-46px)] top-[502px] whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px] text-white transition-opacity duration-700 ${showTitle ? "opacity-100" : "opacity-0"}`}
      >
        領取成功 !
      </p>

      <div className="absolute inset-x-[40px] bottom-[40px]">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="flex h-[56px] w-full items-center justify-center rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] backdrop-blur-[10px]"
          style={{ backgroundImage: "linear-gradient(102.356deg, rgba(141, 84, 216, 0.5) 0.27484%, rgb(20, 232, 184) 104.68%)" }}
        >
          <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">確定</span>
        </button>
      </div>
    </div>
  );
}

// Overlay for the card above -- same treatment as LoginModal (dimmed backdrop,
// closes on backdrop click / Escape, portaled to <body> out from under
// ScaleToFit's zoom, fitted to the viewport by PopupScaleToFit), opened after
// a daily reward is claimed.
export default function ClaimSuccessModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[20px]" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <PopupScaleToFit width={CARD_WIDTH} height={CARD_HEIGHT} margin={60} maxScale={0.8}>
          <ClaimSuccessCard onClose={onClose} />
        </PopupScaleToFit>
      </div>
    </div>,
    document.body,
  );
}
