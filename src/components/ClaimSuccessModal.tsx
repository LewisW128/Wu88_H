"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { withBasePath } from "../lib/asset";
import PopupScaleToFit from "./PopupScaleToFit";

const CARD_WIDTH = 560;
const CARD_HEIGHT = 659;

// Figma "Registration Card" as reused for the daily-claim success popup
// (04_WU88-H-PC-Promotions node 192:21294): the same 560x659 frosted card
// shape RegistrationPopup uses -- plain top-left corner, 50px radii elsewhere,
// pale ribbons bleeding in from that corner -- but filled edge to edge with the
// cyberpunk "she hands you the reward chest" render, the digital-dot cluster
// top-right, a white "領取成功 !" over the image and a translucent purple-to-teal
// "確定" button pinned to the bottom.
function ClaimSuccessCard({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-bl-[50px] rounded-br-[50px] rounded-tr-[50px] bg-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.07),0_24px_64px_rgba(0,0,0,0.1)] backdrop-blur-[12px]"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <img
        alt=""
        src={withBasePath("/assets/day-rewards/claim-success.webp")}
        className="pointer-events-none absolute left-[calc(50%+0.5px)] top-[calc(50%+96.5px)] h-[1374px] w-[773px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
      />
      <img alt="" src={withBasePath("/assets/day-rewards/claim-dots.svg")} className="pointer-events-none absolute right-[0.46px] top-0 h-[231px] w-[242.221px] max-w-none" />
      <img alt="" src={withBasePath("/assets/registration/decor-small.svg")} className="pointer-events-none absolute left-[164px] top-[11px] h-[65px] w-[79px] max-w-none rotate-180" />
      <img alt="" src={withBasePath("/assets/day-rewards/claim-decor-large.svg")} className="pointer-events-none absolute left-[-105px] top-[-99px] h-[228px] w-[277px] max-w-none rotate-180" />

      <p className="absolute left-[calc(50%-46px)] top-[502px] whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px] text-white">領取成功 !</p>

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
