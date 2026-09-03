"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import LoginPopup from "./LoginPopup";
import PopupScaleToFit from "./PopupScaleToFit";

// The overlay that TopUp's "登入" button opens LoginPopup inside of --
// LoginPopup itself only knows how to render the card; this owns the
// backdrop, viewport-fit scaling (via PopupScaleToFit, same "never stretch,
// only ever shrink toward the viewport" rule as the popup's own /login
// preview route), and the three ways Figma implies this should close:
// the popup's own X button, clicking the dimmed backdrop, and Escape.
//
// Portaled straight to document.body rather than rendered in place: every
// page wraps its whole tree in ScaleToFit's `zoom` (see that component's
// own comment on why `zoom`, not `transform`), and Chromium scales
// `position: fixed` descendants along with a zoomed ancestor instead of
// sizing them against the real viewport -- so rendered in place, this
// overlay's "cover the screen" math and dimmed backdrop landed at the
// wrong size/position instead of over the real window. Portaling out from
// under that zoomed subtree gives it the real, unscaled viewport back.
export default function LoginModal({ onClose, onLoginSuccess }: { onClose: () => void; onLoginSuccess?: () => void }) {
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
        <PopupScaleToFit width={976} height={630.898} margin={60} maxScale={0.8}>
          <LoginPopup onClose={onClose} onLoginSuccess={onLoginSuccess} />
        </PopupScaleToFit>
      </div>
    </div>,
    document.body,
  );
}
