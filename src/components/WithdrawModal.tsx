"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { withBasePath } from "../lib/asset";
import { DIAMOND_TO_CASH_RATE, MEMBER_DIAMOND_BALANCE, MIN_WITHDRAW_DIAMONDS, formatMoney } from "../lib/member";
import PopupScaleToFit from "./PopupScaleToFit";

const CARD_WIDTH = 556;
const CARD_HEIGHT = 1253;

const PURPLE_TO_TEAL = "linear-gradient(93.597deg, rgb(141, 84, 216) 0.27398%, rgb(20, 232, 184) 104.92%)";
const PURPLE_TO_TEAL_BUTTON = "linear-gradient(102.233deg, rgb(141, 84, 216) 0.27398%, rgb(20, 232, 184) 104.92%)";

// Figma's 1px border is a stroke drawn inside the box, so it doesn't take any
// layout space -- an inset shadow gives the same look without shifting content.
const OUTLINE = "shadow-[inset_0_0_0_1px_#3e4140]";

// A "換算明細" row: label left (gray), value right -- bold #3e4140 once real,
// or gray placeholder text (待計算/尚未輸入) before there's anything to show.
function SummaryRow({ label, value, placeholder }: { label: string; value: string | null; placeholder: string }) {
  return (
    <div className="flex w-full items-start justify-between">
      <p className="whitespace-nowrap text-[14px] leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{label}</p>
      <p className={`whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[0.15px] ${value ? "text-[#3e4140]" : "text-[#a2a2a2]"}`}>
        {value ?? placeholder}
      </p>
    </div>
  );
}

// Figma "withdraw-modal" (1J_WU88-H-PC_儲值 nodes 37:19945 empty / 37:23343
// filled): the 鑽石兌換現金提領 (diamonds-to-cash withdrawal) flow -- 託售's
// own real destination, which TopUp/AccountWallet's own 託售 buttons never
// had one to link to before. Same frosted 556-wide card family as
// RechargeModal/RegistrationPopup, just taller: a balance card, the
// conversion-ratio note, the amount input + 全部提領, a bank-account card,
// a live 換算明細 breakdown, and 送出提領申請 (disabled until a valid
// amount -- at least MIN_WITHDRAW_DIAMONDS and no more than the real
// balance -- is entered).
function WithdrawCard({ onClose }: { onClose: () => void }) {
  const [diamondsInput, setDiamondsInput] = useState("");
  const hasInput = diamondsInput.length > 0;
  const diamonds = Number.parseInt(diamondsInput, 10) || 0;
  const isValid = diamonds >= MIN_WITHDRAW_DIAMONDS && diamonds <= MEMBER_DIAMOND_BALANCE;
  const cashAmount = Math.floor(diamonds / DIAMOND_TO_CASH_RATE);
  // Figma's own example always shows a $0 fee -- same "免費" convention
  // RechargeModal's own 手續費 row already uses, just expressed as $0
  // here since this row sits inside a live-computed breakdown instead of
  // a fixed label.
  const fee = 0;
  const netAmount = cashAmount - fee;

  return (
    <div
      className="relative flex flex-col items-start gap-[24px] overflow-hidden rounded-bl-[50px] rounded-br-[50px] rounded-tr-[50px] bg-white/90 p-[40px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_8px_24px_rgba(0,0,0,0.07),0_24px_64px_rgba(0,0,0,0.1)] backdrop-blur-[12px]"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <img alt="" src={withBasePath("/assets/registration/decor-small.svg")} className="pointer-events-none absolute left-[164px] top-[11px] h-[65px] w-[79px] max-w-none rotate-180" />
      <img alt="" src={withBasePath("/assets/day-rewards/claim-decor-large.svg")} className="pointer-events-none absolute left-[-105px] top-[-99px] h-[228px] w-[277px] max-w-none rotate-180" />

      {/* Explicit z-10, not just relying on DOM order -- this title is long
          enough to actually reach into the corner ribbon's own drawn area
          (RechargeModal's own shorter "儲值帳戶" never does), so it needs to
          unambiguously win rather than risk the ribbon painting over it. */}
      <div className="relative z-10 flex w-full items-start justify-between">
        <div className="flex w-[420px] flex-col items-start gap-[10px]">
          <p className="w-full text-[40px] font-bold leading-[48px] tracking-[0.36px] text-[#3e4140]">鑽石兌換現金提領</p>
          <p className="w-full text-[14px] leading-[20px] tracking-[0.15px] text-[#a2a2a2]">
            先確認可兌換的鑽石餘額，再輸入要兌換並提領的鑽石數量。系統會依兌換比例算出現金金額、扣除手續費後，再提領至你的收款帳戶。
          </p>
        </div>
        <button type="button" aria-label="關閉" onClick={onClose} className="flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-[16px]">
          <img alt="" src={withBasePath("/assets/registration/close.svg")} className="size-[25px]" />
        </button>
      </div>

      <div className="flex w-full flex-col items-start gap-[16px]">
        <div className={`flex w-full flex-col items-start gap-[14px] rounded-[15px] bg-[#f4f4f4] p-[20px] ${OUTLINE}`}>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <img alt="" src={withBasePath("/assets/withdraw/icon-safe.svg")} className="size-[30px] shrink-0" />
              <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">可兌換鑽石餘額</p>
            </div>
            <span className="whitespace-nowrap rounded-[999px] bg-[#23f3d5]/10 px-[10px] py-[4px] text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">
              即時可用
            </span>
          </div>
          <p className="whitespace-nowrap text-[20px] font-black leading-[32px] tracking-[0.35px] text-[#3e4140]">{formatMoney(MEMBER_DIAMOND_BALANCE)} 鑽石</p>
          <p className="w-full text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">此為目前可兌換成現金並申請提領的鑽石數量。下方會依兌換比例自動算出對應的現金金額。</p>
        </div>

        <div className="flex w-full flex-col items-start gap-[10px] rounded-[15px] bg-[#23f3d5]/[0.07] p-[16px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <img alt="" src={withBasePath("/assets/withdraw/icon-ratio.svg")} className="size-[22.5px] shrink-0" />
              <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">兌換比例</p>
            </div>
            <span className="whitespace-nowrap rounded-[999px] bg-[#23f3d5]/20 px-[10px] py-[4px] text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">
              {DIAMOND_TO_CASH_RATE} 鑽石 = $1
            </span>
          </div>
          <p className="w-full text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">輸入鑽石數量後，系統會自動將鑽石換算成現金金額，並依手續費計算實際可入帳金額。</p>
        </div>

        <div className="flex w-full flex-col items-start gap-[10px]">
          <div className="flex items-center gap-[12px]">
            <img alt="" src={withBasePath("/assets/recharge/style-topup.svg")} className="size-[25px] shrink-0" />
            <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">提領鑽石數量</p>
          </div>
          <div className="flex w-full items-start gap-[10px]">
            <label className={`flex h-[56px] w-[328px] shrink-0 items-center gap-[10px] rounded-[15px] bg-[#f4f4f4] px-[18px] ${OUTLINE}`}>
              <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">鑽石</span>
              <input
                type="text"
                inputMode="numeric"
                value={diamondsInput}
                onChange={(event) => setDiamondsInput(event.target.value.replace(/\D/g, "").slice(0, 9))}
                placeholder="輸入要兌換並提領的數量"
                aria-label="提領鑽石數量"
                className="min-w-px flex-1 bg-transparent text-[14px] leading-[20px] tracking-[0.15px] text-[#3e4140] outline-none placeholder:text-[#a2a2a2]"
              />
            </label>
            <button
              type="button"
              onClick={() => setDiamondsInput(String(MEMBER_DIAMOND_BALANCE))}
              className="flex h-[56px] flex-1 items-center justify-center rounded-bl-[15px] rounded-br-[15px] rounded-tr-[15px] backdrop-blur-[10px]"
              style={{ backgroundImage: PURPLE_TO_TEAL }}
            >
              <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">全部提領</span>
            </button>
          </div>
          <div className="flex w-full items-center gap-[10px]">
            <span className={`size-[8px] shrink-0 rounded-[4px] ${hasInput ? "bg-[#23f3d5]" : "bg-[#a2a2a2]"}`} />
            <p className="min-w-px flex-1 text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">
              {hasInput
                ? `最低兌換提領數量為 ${formatMoney(MIN_WITHDRAW_DIAMONDS)} 鑽石；也可使用「全部提領」帶入目前可兌換的完整鑽石餘額。`
                : "尚未輸入提領數量，請先填寫數量或使用「全部提領」帶入目前可兌換的完整鑽石餘額。"}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[10px]">
          <div className="flex items-center gap-[12px]">
            <img alt="" src={withBasePath("/assets/withdraw/icon-bank-account.svg")} className="size-[25px] shrink-0" />
            <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">收款銀行帳戶</p>
          </div>
          <div className={`flex w-full items-center gap-[12px] rounded-[15px] bg-[#f4f4f4] p-[16px] ${OUTLINE}`}>
            <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-white">
              <img alt="" src={withBasePath("/assets/recharge/icon-card-dark.svg")} className="size-[25px]" />
            </div>
            <div className="flex min-w-px flex-1 flex-col items-start gap-[4px]">
              <div className="flex w-full items-center justify-between">
                <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">玉山銀行 •••• 4242</span>
                <span className="whitespace-nowrap rounded-[999px] bg-[#23f3d5]/10 px-[8px] py-[4px] text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">預設</span>
              </div>
              <p className="w-full whitespace-nowrap text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">王小明｜兌換完成後預計 1-2 個工作天入帳</p>
            </div>
          </div>
          <div className="flex w-full items-center gap-[10px]">
            <button type="button" className={`flex h-[40px] w-[112px] items-center justify-center rounded-[12px] bg-white ${OUTLINE}`}>
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">管理帳戶</span>
            </button>
            <button
              type="button"
              className="flex h-[40px] w-[112px] items-center justify-center rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] backdrop-blur-[10px]"
              style={{ backgroundImage: PURPLE_TO_TEAL }}
            >
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-white">新增帳戶</span>
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[10px] p-[16px]">
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">換算明細</p>
          <SummaryRow label="兌換比例" value={`${DIAMOND_TO_CASH_RATE} 鑽石 = $1`} placeholder="" />
          <SummaryRow label="提領鑽石數量" value={hasInput ? `${formatMoney(diamonds)} 鑽石` : null} placeholder="尚未輸入" />
          <SummaryRow label="兌換後現金金額" value={hasInput ? `$${formatMoney(cashAmount)}` : null} placeholder="待計算" />
          <SummaryRow label="手續費" value={hasInput ? `$${formatMoney(fee)}` : null} placeholder="待計算" />
          <div className="h-px w-full bg-[#3e4140] opacity-10" />
          <div className="flex w-full items-center justify-between">
            <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">實際入帳金額</p>
            <p className={`whitespace-nowrap text-[18px] font-bold leading-[24px] tracking-[0.15px] ${hasInput ? "text-[#3e4140]" : "text-[#a2a2a2]"}`}>
              {hasInput ? `$${formatMoney(netAmount)}` : "待計算"}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-[10px] rounded-[15px] bg-[#23f3d5]/[0.07] p-[12px]">
          <img alt="" src={withBasePath("/assets/withdraw/icon-secure.svg")} className="size-[20px] shrink-0" />
          <p className="min-w-px flex-1 text-[12px] leading-[18px] tracking-[0.15px] text-[#3e4140]">送出後系統會先將鑽石兌換成現金，再依序完成審核與入帳處理。請確認兌換數量、手續費與收款帳戶皆正確。</p>
        </div>

        <div className="flex w-full flex-col items-start gap-[12px]">
          <button
            type="button"
            disabled={!isValid}
            onClick={onClose}
            className="flex h-[56px] w-full items-center justify-center rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] border border-[#a2a2a2] bg-[#f4f4f4] text-[#a2a2a2] backdrop-blur-[10px] transition-opacity disabled:opacity-70 enabled:border-0 enabled:text-white"
            style={isValid ? { backgroundImage: PURPLE_TO_TEAL_BUTTON } : undefined}
          >
            <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px]">送出提領申請</span>
          </button>
          <p className="w-full text-center text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">送出後可於交易紀錄中查看兌換狀態、審核進度與到帳結果。</p>
        </div>
      </div>
    </div>
  );
}

// Overlay for the card above -- same treatment as RechargeModal (dimmed
// backdrop, closes on backdrop click / Escape, portaled to <body> out from
// under ScaleToFit's zoom, fitted to the viewport by PopupScaleToFit).
export default function WithdrawModal({ onClose }: { onClose: () => void }) {
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
          <WithdrawCard onClose={onClose} />
        </PopupScaleToFit>
      </div>
    </div>,
    document.body,
  );
}
