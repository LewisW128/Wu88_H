import { withBasePath } from "../lib/asset";

export type RewardVipCardProps = {
  level: number;
  currentExp: number;
  maxExp: number;
  continuousDeposit: string;
  crystalImage: string;
};

// Figma "Ellipse 2", repeated in a plain 6x6 grid (node 662:16100) -- a
// flat filled circle, not worth downloading 36 near-identical copies of
// the same tiny asset for; a plain rounded div reproduces it exactly.
function DotGrid() {
  const rows = 6;
  const cols = 6;
  return (
    <div className="absolute right-[20px] top-[20px] flex flex-col items-start gap-[7.75px]">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-center gap-[7.75px]">
          {Array.from({ length: cols }).map((_, col) => (
            <div key={col} className="size-[3.875px] shrink-0 rounded-full bg-[#3e4140]" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Figma "VIP_Card" (node 210:19103, seen live on the Reward Center's own
// logged-in-and-recharged state, 657:18891 -- "這是登陸之後已經充值後等級8的
// 畫面" per the user's own direct call). A DIFFERENT decorative background
// from the shared VipCard component ProfileContent/promotions already use
// (that one bleeds ribbon-1..5.svg + a medal off the top-right corner) --
// this one bleeds 4 plain diagonal teal stripes (vip-stripe-1..4.svg) plus
// the CURRENT reward-kit bracket's own crystal art and a 6x6 dot grid
// instead. Crown/Lv title, exp bar, and continuous-deposit line are laid
// out identically to the shared VipCard, and Figma's own displayed numbers
// here (Lv.8, 700/1,500, 10,000) match that other card's own demo data
// exactly -- both are the same mock member. Sized as a fixed 464x282 (this
// page's own Figma slot), not the shared VipCard's `flex-1` -- there's no
// sibling card it needs to split a row with here.
export default function RewardVipCard({ level, currentExp, maxExp, continuousDeposit, crystalImage }: RewardVipCardProps) {
  const progress = Math.min(100, Math.max(0, (currentExp / maxExp) * 100));

  return (
    <div className="relative h-[282px] w-[464px] overflow-hidden rounded-[20px] border border-solid border-[#a2a2a2] bg-white/50 backdrop-blur-[10px]">
      <div className="pointer-events-none absolute inset-[-1px] overflow-hidden">
        <div className="absolute right-[-21px] top-[33px] h-[335.676px] w-[408px] rotate-180">
          <img alt="" src={withBasePath("/assets/rewards/vip-stripe-1.svg")} className="size-full" />
        </div>
        <div className="absolute right-[-29px] top-[97px] h-[81px] w-[98px] rotate-180">
          <img alt="" src={withBasePath("/assets/rewards/vip-stripe-2.svg")} className="size-full" />
        </div>
        <div className="absolute right-[-12px] top-[-11px] h-[61px] w-[74.556px] rotate-180">
          <img alt="" src={withBasePath("/assets/rewards/vip-stripe-3.svg")} className="size-full" />
        </div>
        <div className="absolute right-[107.26px] top-[127px] h-[54px] w-[65.739px] rotate-180">
          <img alt="" src={withBasePath("/assets/rewards/vip-stripe-4.svg")} className="size-full" />
        </div>

        <div className="absolute right-[-43px] top-[-14px] size-[237px] overflow-hidden">
          <img
            alt=""
            src={withBasePath(crystalImage)}
            className="absolute left-1/2 top-1/2 h-[221.2px] w-[124.467px] -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>

        <DotGrid />
      </div>

      <div className="absolute left-[19px] top-[18px] flex items-center gap-[20px]">
        <img alt="" src={withBasePath("/assets/vip-card/crown-icon.svg")} className="size-[40px]" />
        <p className="whitespace-nowrap text-[40px] font-black leading-[36px] tracking-[0.36px] text-[#3e4140]">Lv. {level}</p>
      </div>

      <div className="absolute bottom-[19px] left-[19px] right-[19px] flex flex-col items-start gap-[10px]">
        <div className="flex w-full items-center justify-between">
          <p className="whitespace-nowrap">
            <span className="text-[12px] leading-[18px] tracking-[0.15px] text-[#b2b2b2]">VIP 經驗 </span>
            <span className="text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#23f3d5]">{currentExp.toLocaleString()}</span>
            <span className="text-[12px] leading-[18px] tracking-[0.15px] text-[#b2b2b2]"> / {maxExp.toLocaleString()}</span>
          </p>
          <div className="flex size-[25px] items-center justify-center rounded-full bg-[#3e4140] p-[5px] backdrop-blur-[5.556px]">
            <img alt="" src={withBasePath("/assets/vip-card/add-icon.svg")} className="size-[13.889px]" />
          </div>
        </div>
        <div className="h-[10px] w-full overflow-hidden rounded-[50px] border border-[#a2a2a2] bg-white">
          <div
            className="h-full rounded-[50px]"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3cc2ca 0%, #b559fc 100%)" }}
          />
        </div>
        <p className="whitespace-nowrap">
          <span className="text-[12px] leading-[18px] tracking-[0.15px] text-[#b2b2b2]">已經連續儲值 </span>
          <span className="text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#23f3d5]">{continuousDeposit}</span>
        </p>
      </div>
    </div>
  );
}
