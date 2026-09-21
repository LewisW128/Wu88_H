"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { withBasePath } from "../lib/asset";
import PopupScaleToFit from "./PopupScaleToFit";

const CARD_WIDTH = 556;
const CARD_HEIGHT = 868;

// 1 diamond = NT$1, so the diamond count is also the amount charged.
const PACKAGES = [500, 1000, 2000, 5000] as const;
const CUSTOM = "custom";
type Selection = (typeof PACKAGES)[number] | typeof CUSTOM;

type PaymentMethod = "card" | "applepay";

// Mock account -- same "no real backend" pattern as the rest of the site.
const MOCK_BALANCE = 12480;

const PURPLE_TO_TEAL = "linear-gradient(93.082deg, rgb(141, 84, 216) 0.27398%, rgb(20, 232, 184) 104.92%)";

const formatAmount = (n: number) => n.toLocaleString("en-US");

// Figma's 1px border is a stroke drawn inside the box, so it doesn't take any
// layout space -- an inset shadow gives the same look without shifting content.
const OUTLINE = "shadow-[inset_0_0_0_1px_#3e4140]";

// Figma "recharge-modal" (1J_WU88-H-PC_儲值 node 8:13167): the same frosted
// 556x868 card RegistrationPopup uses (plain top-left corner with the two pale
// ribbons bleeding in, 50px radii elsewhere), holding the account balance, the
// diamond packages (a 5th "自訂數量" one takes any amount), the payment method,
// an order summary and 確認儲值. The selected package / payment method gets the
// purple-to-teal fill; the rest sit as outlined #f4f4f4 boxes.
function RechargeCard({ onClose }: { onClose: () => void }) {
  const [selection, setSelection] = useState<Selection>(1000);
  const [customValue, setCustomValue] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("card");

  const customAmount = Number.parseInt(customValue, 10) || 0;
  const amount = selection === CUSTOM ? customAmount : selection;
  const canSubmit = amount > 0;

  return (
    <div
      className="relative overflow-hidden rounded-bl-[50px] rounded-br-[50px] rounded-tr-[50px] bg-white/90 p-[40px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_8px_24px_rgba(0,0,0,0.07),0_24px_64px_rgba(0,0,0,0.1)] backdrop-blur-[12px]"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <img alt="" src={withBasePath("/assets/registration/decor-small.svg")} className="pointer-events-none absolute left-[164px] top-[11px] h-[65px] w-[79px] max-w-none rotate-180" />
      <img alt="" src={withBasePath("/assets/registration/decor-large.svg")} className="pointer-events-none absolute left-[-105px] top-[-99px] h-[228px] w-[277px] max-w-none rotate-180" />

      <div className="relative flex w-full flex-col items-start gap-[20px]">
        <div className="flex w-full items-start justify-between">
          <div className="flex w-[420px] flex-col items-start gap-[10px]">
            <p className="w-full text-[40px] font-bold leading-[48px] tracking-[0.36px] text-[#3e4140]">儲值帳戶</p>
            <p className="w-full text-[14px] leading-[20px] tracking-[0.15px] text-[#a2a2a2]">選擇金額並完成付款，資金將會立即進入你的帳戶餘額。</p>
          </div>
          <button type="button" aria-label="關閉" onClick={onClose} className="flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-[16px]">
            <img alt="" src={withBasePath("/assets/registration/close.svg")} className="size-[25px]" />
          </button>
        </div>

        <div className="flex w-full flex-col items-start gap-[20px] pt-[20px]">
          <div className={`flex w-full items-center rounded-[15px] bg-[#f4f4f4] p-[16px] ${OUTLINE}`}>
            <div className="flex items-center gap-[20px]">
              <img alt="" src={withBasePath("/assets/recharge/balance-diamond.svg")} className="size-[40px] shrink-0" />
              <p className="whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px] text-[#3e4140]">${formatAmount(MOCK_BALANCE)}</p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[10px]">
            <div className="flex items-center gap-[12px]">
              <img alt="" src={withBasePath("/assets/recharge/style-topup.svg")} className="size-[25px] shrink-0" />
              <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">選擇鑽石數量</p>
            </div>

            <div role="radiogroup" aria-label="選擇鑽石數量" className="flex w-full flex-col items-start gap-[10px]">
              <div className="flex w-full items-start gap-[10px]">
                {PACKAGES.slice(0, 3).map((pkg) => (
                  <PackageCard key={pkg} selected={selection === pkg} onSelect={() => setSelection(pkg)} title={`${formatAmount(pkg)} 鑽石`} subtitle={`NT$${formatAmount(pkg)}`} />
                ))}
              </div>
              <div className="flex w-full items-start gap-[10px]">
                <PackageCard selected={selection === 5000} onSelect={() => setSelection(5000)} title="5,000 鑽石" subtitle="NT$5,000" />
                <PackageCard
                  selected={selection === CUSTOM}
                  onSelect={() => setSelection(CUSTOM)}
                  title="自訂數量"
                  subtitle="依輸入數量計算"
                  customValue={customValue}
                  onCustomChange={setCustomValue}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[10px]">
            <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">付款方式</p>
            <div role="radiogroup" aria-label="付款方式" className="flex w-full items-start gap-[10px]">
              <PaymentCard
                selected={method === "card"}
                onSelect={() => setMethod("card")}
                icon={withBasePath(method === "card" ? "/assets/recharge/icon-card.svg" : "/assets/recharge/icon-card-dark.svg")}
                title="信用卡"
                subtitle="Visa •••• 4242"
              />
              <PaymentCard
                selected={method === "applepay"}
                onSelect={() => setMethod("applepay")}
                icon={withBasePath("/assets/recharge/icon-applepay.svg")}
                title="Apple Pay"
                subtitle="一鍵快速付款"
              />
            </div>
          </div>

          <div className={`flex w-full flex-col items-start gap-[10px] rounded-[15px] bg-[#f4f4f4] p-[16px] ${OUTLINE}`}>
            <div className="flex w-full items-start justify-between">
              <p className="whitespace-nowrap text-[14px] leading-[20px] tracking-[0.15px] text-[#a2a2a2]">儲值金額</p>
              <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">${formatAmount(amount)}</p>
            </div>
            <div className="flex w-full items-start justify-between">
              <p className="whitespace-nowrap text-[14px] leading-[20px] tracking-[0.15px] text-[#a2a2a2]">手續費</p>
              <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#3e4140]">免費</p>
            </div>
            <div className="h-px w-full bg-[#3e4140] opacity-10" />
            <div className="flex w-full items-center justify-between text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">
              <p className="whitespace-nowrap">實際到帳</p>
              <p className="whitespace-nowrap">${formatAmount(amount)}</p>
            </div>
          </div>

          <div className="flex w-full items-center gap-[10px]">
            <img alt="" src={withBasePath("/assets/recharge/icon-secure.svg")} className="size-[20px] shrink-0" />
            <p className="min-w-px flex-1 text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">你的付款資訊會經過加密處理，交易完成後可於交易紀錄中查看明細。</p>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={onClose}
            className="flex h-[56px] w-full items-center justify-center rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] backdrop-blur-[10px] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundImage: "linear-gradient(102.233deg, rgb(141, 84, 216) 0.27398%, rgb(20, 232, 184) 104.92%)" }}
          >
            <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">確認儲值</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// One diamond package. The selected one is the purple-to-teal fill with its top-
// left corner squared (Figma's 15px radii on the other three). The custom one
// swaps its caption for a number field once it's selected.
function PackageCard({
  selected,
  onSelect,
  title,
  subtitle,
  customValue,
  onCustomChange,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  customValue?: string;
  onCustomChange?: (value: string) => void;
}) {
  const isCustom = onCustomChange !== undefined;
  const className = `flex h-[72px] min-w-px flex-1 cursor-pointer flex-col items-center justify-center text-center ${
    selected ? "rounded-bl-[15px] rounded-br-[15px] rounded-tr-[15px] backdrop-blur-[10px]" : `rounded-[15px] bg-[#f4f4f4] ${OUTLINE}`
  }`;
  const style = selected ? { backgroundImage: PURPLE_TO_TEAL } : undefined;
  const content = (
    <>
      <span className={`whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] ${selected ? "text-white" : "text-[#3e4140]"}`}>{title}</span>
      {isCustom && selected ? (
        <input
          type="text"
          inputMode="numeric"
          autoFocus
          value={customValue}
          onChange={(event) => onCustomChange(event.target.value.replace(/\D/g, "").slice(0, 7))}
          onClick={(event) => event.stopPropagation()}
          placeholder="輸入鑽石數量"
          aria-label="自訂鑽石數量"
          className="mt-[2px] h-[18px] w-[110px] rounded-[6px] bg-white/25 text-center text-[12px] leading-[18px] tracking-[0.15px] text-white outline-none placeholder:text-white/70"
        />
      ) : (
        <span className={`whitespace-nowrap text-[12px] leading-[18px] tracking-[0.15px] ${selected ? "text-white/80" : "text-[#a2a2a2]"}`}>{subtitle}</span>
      )}
    </>
  );

  // The custom card holds an <input>, which can't live inside a <button>.
  return isCustom ? (
    <div role="radio" aria-checked={selected} tabIndex={0} onClick={onSelect} onKeyDown={(event) => event.target === event.currentTarget && (event.key === "Enter" || event.key === " ") && onSelect()} className={className} style={style}>
      {content}
    </div>
  ) : (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className={className} style={style}>
      {content}
    </button>
  );
}

function PaymentCard({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-w-px flex-1 cursor-pointer items-center gap-[12px] p-[16px] text-left ${
        selected ? "rounded-bl-[15px] rounded-br-[15px] rounded-tr-[15px] backdrop-blur-[10px]" : `rounded-[15px] bg-[#f4f4f4] ${OUTLINE}`
      }`}
      style={selected ? { backgroundImage: "linear-gradient(94.592deg, rgb(141, 84, 216) 0.27398%, rgb(20, 232, 184) 104.92%)" } : undefined}
    >
      <span className={`flex size-[36px] shrink-0 items-center justify-center rounded-[10px] ${selected && title === "信用卡" ? "bg-white/10" : "bg-white"}`}>
        <img alt="" src={icon} className="size-[25px]" />
      </span>
      <span className="flex min-w-px flex-1 flex-col items-start gap-[4px]">
        <span className={`whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] ${selected ? "text-white" : "text-[#3e4140]"}`}>{title}</span>
        <span className={`whitespace-nowrap text-[12px] leading-[18px] tracking-[0.15px] ${selected ? "text-white/80" : "text-[#a2a2a2]"}`}>{subtitle}</span>
      </span>
    </button>
  );
}

// Overlay for the card above -- same treatment as LoginModal / ClaimSuccessModal
// (dimmed backdrop, closes on backdrop click / Escape, portaled to <body> out
// from under ScaleToFit's zoom, fitted to the viewport by PopupScaleToFit).
export default function RechargeModal({ onClose }: { onClose: () => void }) {
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
        <PopupScaleToFit width={CARD_WIDTH} height={CARD_HEIGHT} margin={40} maxScale={0.9}>
          <RechargeCard onClose={onClose} />
        </PopupScaleToFit>
      </div>
    </div>,
    document.body,
  );
}
