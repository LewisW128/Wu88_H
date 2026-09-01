import { withBasePath } from "../lib/asset";

export type VipCardProps = {
  level: number;
  currentExp: number;
  maxExp: number;
  continuousDeposit: string;
};

// Figma "VIP_Card" (05_WU88-H-PC-Profile-Page node 451:16306, seen live on
// the page at 428:17332 beside ProfileCard): a frosted white card with a
// crown + "Lv. N" title top-left, a cluster of diagonal ribbons and a
// medal graphic bleeding off the top-right corner, and an experience bar
// pinned to the bottom (VIP 經驗 current/max, a "+" pill, a progress track,
// and a continuous-deposit line). Sits beside ProfileCard as a flex-1
// pair, not a fixed px card -- see ProfileCard's own comment for why.
//
// The progress fill was a raster gradient PNG in Figma (a flat teal->
// purple sweep with no texture) -- reproduced as a plain CSS
// `linear-gradient` instead of shipping another image asset, and its
// width is a real `currentExp/maxExp` percentage rather than Figma's own
// static "trim 59px off the right" export (which only happens to match
// the 700/1,500 example in the design, not any other ratio).
export default function VipCard({ level, currentExp, maxExp, continuousDeposit }: VipCardProps) {
  const progress = Math.min(100, Math.max(0, (currentExp / maxExp) * 100));

  return (
    <div className="relative h-[236px] flex-1 overflow-hidden rounded-[25px] border border-[#f4f4f4] bg-white/90 backdrop-blur-[10px]">
      <div className="pointer-events-none absolute inset-[-1px] h-[282px] overflow-hidden">
        <div className="absolute right-[-58px] top-[-80px] flex h-[427px] w-[519px] rotate-180 items-center justify-center">
          <img alt="" src={withBasePath("/assets/vip-card/ribbon-1.svg")} className="size-full" />
        </div>
        <div className="absolute right-[-29px] top-[127px] flex h-[81px] w-[98px] rotate-180 items-center justify-center">
          <img alt="" src={withBasePath("/assets/vip-card/ribbon-2.svg")} className="size-full" />
        </div>
        <div className="absolute right-[229px] top-[61px] flex h-[81px] w-[99px] rotate-180 items-center justify-center">
          <img alt="" src={withBasePath("/assets/vip-card/ribbon-3.svg")} className="size-full" />
        </div>
        <div className="absolute right-[86px] top-[7px] flex h-[48px] w-[59px] rotate-180 items-center justify-center">
          <img alt="" src={withBasePath("/assets/vip-card/ribbon-4.svg")} className="size-full" />
        </div>
        <div className="absolute right-[117px] top-[141px] flex h-[23px] w-[28px] rotate-180 items-center justify-center">
          <img alt="" src={withBasePath("/assets/vip-card/ribbon-5.svg")} className="size-full" />
        </div>
        <div className="absolute right-[-102px] top-[calc(50%-80px)] size-[264px] -translate-y-1/2 overflow-hidden">
          <img
            alt=""
            src={withBasePath("/assets/vip-card/medal.png")}
            className="pointer-events-none absolute left-1/2 top-1/2 size-[214.5px] -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
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
