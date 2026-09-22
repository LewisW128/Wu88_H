"use client";

import { useState, type FormEvent } from "react";
import { withBasePath } from "../lib/asset";

export const REGISTRATION_POPUP_WIDTH = 560;
export const REGISTRATION_POPUP_HEIGHT = 659;

// Same 6-12 letters-and-digits rule the login popup's own password
// placeholder states ("請輸入您的6-12位英文字母及數字").
const PASSWORD_PATTERN = /^[A-Za-z0-9]{6,12}$/;
// Require a real dot-TLD of at least 2 chars so values like "a@b.c" still
// fail client-side checks instead of "succeeding" and dismissing the modal.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Figma "Registration Card" (01_WU88-H-PC-Home-Page node 1304:117728, the
// popup shown over the dimmed home page at 1303:114061): the sign-up form
// LoginModal swaps to when 註冊 is clicked. A 560x659 frosted card (white/90
// + 12px blur, deep double shadow) with a plain top-left corner -- that
// corner is where the two pale diagonal ribbons bleed in, clipped by the
// card -- and 50px radii on the other three. Every field is a real input;
// "建立帳號" only submits once the form is valid, and a successful sign-up
// logs the new member straight in (same hand-off LoginPopup's own login uses).
export default function RegistrationPopup({
  onClose,
  onLogin,
  onRegisterSuccess,
}: {
  onClose?: () => void;
  // Switches back to the login popup ("已有帳號？登入").
  onLogin?: () => void;
  onRegisterSuccess?: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Checked, as in Figma's own frame.
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState("");

  function validate() {
    if (!firstName.trim() || !lastName.trim()) return "請輸入名字與姓氏。";
    if (!EMAIL_PATTERN.test(email.trim())) return "請輸入有效的電子郵件。";
    if (!PASSWORD_PATTERN.test(password)) return "密碼需為 6-12 位英文字母及數字。";
    if (password !== confirmPassword) return "兩次輸入的密碼不一致。";
    if (!agreed) return "請先同意服務條款與隱私權政策。";
    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      const message = validate();
      setError(message);
      // Only dismiss / log in when validation actually passed. Invalid input
      // must keep the modal open and show the message above.
      if (message) return;
      onRegisterSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "註冊時發生錯誤，請檢查輸入後再試。");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative flex flex-col items-start gap-[40px] overflow-hidden rounded-bl-[50px] rounded-br-[50px] rounded-tr-[50px] bg-white/90 p-[40px] shadow-[0_8px_24px_rgba(0,0,0,0.07),0_24px_64px_rgba(0,0,0,0.1)] backdrop-blur-[12px]"
      style={{ width: REGISTRATION_POPUP_WIDTH, height: REGISTRATION_POPUP_HEIGHT }}
    >
      <img alt="" src={withBasePath("/assets/registration/decor-small.svg")} className="pointer-events-none absolute left-[164px] top-[11px] h-[65px] w-[79px] max-w-none rotate-180" />
      <img alt="" src={withBasePath("/assets/registration/decor-large.svg")} className="pointer-events-none absolute left-[-105px] top-[-99px] h-[228px] w-[277px] max-w-none rotate-180" />

      <div className="relative flex w-full shrink-0 flex-col items-start gap-[20px]">
        <div className="flex w-full flex-col items-start gap-[10px]">
          <p className="w-full text-[40px] font-bold leading-[36px] tracking-[0.36px] text-[#3e4140]">註冊帳號</p>
          <p className="w-full text-[14px] leading-[20px] tracking-[0.15px] text-[#a2a2a2]">請填寫以下資料，建立帳號並開始使用。</p>
        </div>

        <div className="flex w-full flex-col items-start gap-[20px]">
          <div className="flex w-full items-start gap-[16px]">
            <Field label="名字" placeholder="請輸入名字" value={firstName} onChange={setFirstName} className="w-[232px] shrink-0" autoComplete="given-name" />
            <Field label="姓氏" placeholder="請輸入姓氏" value={lastName} onChange={setLastName} className="w-[232px] shrink-0" autoComplete="family-name" />
          </div>
          <Field label="電子郵件" placeholder="請輸入電子郵件" value={email} onChange={setEmail} type="email" autoComplete="email" invalid={Boolean(error && error.includes("電子郵件"))} />
          <Field label="密碼" placeholder="請建立密碼" value={password} onChange={setPassword} type="password" autoComplete="new-password" invalid={Boolean(error && error.includes("密碼") && !error.includes("不一致"))} />
          <Field label="確認密碼" placeholder="請再次輸入密碼" value={confirmPassword} onChange={setConfirmPassword} type="password" autoComplete="new-password" invalid={Boolean(error && error.includes("不一致"))} />
        </div>
      </div>

      {/* Validation message: sits in the 40px gap between the fields and the
          footer (absolutely placed) so showing it never shifts the layout.
          z-10 keeps it above the footer so a failed submit is always readable. */}
      {error ? (
        <p
          role="alert"
          aria-live="assertive"
          className="absolute left-[40px] top-[470px] z-10 max-w-[480px] rounded-[8px] bg-[#fff1f0] px-[10px] py-[4px] text-[12px] font-medium leading-[18px] tracking-[0.15px] text-[#e80800]"
        >
          {error}
        </p>
      ) : null}

      <div className="relative flex w-full shrink-0 flex-col items-start gap-[10px]">
        <label className="flex w-full cursor-pointer items-center gap-[12px]">
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="sr-only" />
          <span
            className={`flex size-[20px] shrink-0 flex-col items-center justify-center rounded-[6px] ${agreed ? "bg-[#23f3d5]" : "border border-solid border-[#3e4140] bg-[#f4f4f4]"}`}
          >
            {agreed && <img alt="" src={withBasePath("/assets/registration/check.svg")} className="size-[12px]" />}
          </span>
          <span className="min-w-px flex-1 text-[10px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">我同意服務條款與隱私權政策。</span>
        </label>

        <div className="flex w-full flex-col items-start gap-[20px]">
          <button type="submit" className="flex h-[56px] w-full shrink-0 items-center justify-center rounded-[15px] bg-[#8d54d8]">
            <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">建立帳號</span>
          </button>
          <p className="w-full text-center text-[12px] text-[#a2a2a2]">
            已有帳號？
            <button type="button" onClick={onLogin} className="text-[12px] font-semibold text-[#3e4140]">
              登入
            </button>
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label="關閉"
        onClick={onClose}
        className="absolute left-[504px] top-[24px] flex size-[32px] items-center justify-center overflow-hidden rounded-[16px]"
      >
        <img alt="" src={withBasePath("/assets/registration/close.svg")} className="size-[25px]" />
      </button>
    </form>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "w-full",
  autoComplete,
  invalid = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  autoComplete?: string;
  invalid?: boolean;
}) {
  return (
    <label className={`flex flex-col items-start gap-[5px] ${className}`}>
      <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        className={`h-[45px] w-full rounded-[15px] border border-solid bg-[#f4f4f4] px-[16px] text-[12px] leading-[18px] tracking-[0.15px] text-[#3e4140] outline-none placeholder:text-[#a2a2a2] focus:border-[#8d54d8] ${
          invalid ? "border-[#e80800]" : "border-[#3e4140]"
        }`}
      />
    </label>
  );
}
