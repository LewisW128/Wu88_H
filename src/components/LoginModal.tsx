"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LoginPopup from "./LoginPopup";
import PopupScaleToFit from "./PopupScaleToFit";
import RegistrationPopup, { REGISTRATION_POPUP_HEIGHT, REGISTRATION_POPUP_WIDTH } from "./RegistrationPopup";

export type AuthModalView = "login" | "register";

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
//
// The same overlay also hosts the sign-up form (RegistrationPopup): 註冊 in
// the login popup swaps to it, "已有帳號？登入" swaps back, and the page's own
// 註冊 buttons open it directly via `initialView`. A successful sign-up logs
// the new member straight in, through the same `onLoginSuccess` a login uses.
export default function LoginModal({
  onClose,
  onLoginSuccess,
  initialView = "login",
}: {
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialView?: AuthModalView;
}) {
  const [view, setView] = useState<AuthModalView>(initialView);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    // Only close when the backdrop itself is the click target. PopupScaleToFit
    // uses CSS `zoom`, and Chromium can mis-hit-test clicks on zoomed children
    // onto this overlay — which previously dismissed the modal on "建立帳號"
    // before the registration form could show a validation error.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[20px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {view === "login" ? (
          <PopupScaleToFit width={976} height={630.898} margin={60} maxScale={0.8}>
            <LoginPopup onClose={onClose} onLoginSuccess={onLoginSuccess} onRegister={() => setView("register")} />
          </PopupScaleToFit>
        ) : (
          <PopupScaleToFit width={REGISTRATION_POPUP_WIDTH} height={REGISTRATION_POPUP_HEIGHT} margin={60} maxScale={0.8}>
            <RegistrationPopup onClose={onClose} onLogin={() => setView("login")} onRegisterSuccess={onLoginSuccess} />
          </PopupScaleToFit>
        )}
      </div>
    </div>,
    document.body,
  );
}
