import LoginPopup from "../../components/LoginPopup";
import PopupScaleToFit from "../../components/PopupScaleToFit";

// Placeholder shell just to preview LoginPopup in the browser -- not the
// real page layout yet (this'll eventually be a modal over the actual
// page content, not its own route).
export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4]">
      <PopupScaleToFit width={976} height={630.898}>
        <LoginPopup />
      </PopupScaleToFit>
    </div>
  );
}
