import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial, { useArrowPulse } from "./AnimatedArrowSpecial";

export type StatisticEntry = {
  icon: string;
  value: string;
  label: string;
  // Guest/not-logged-in cards (05_WU88-H-PC-Profile-Page node 459:85252)
  // drop the trend-graph glyph entirely -- there's no real trend to show
  // before you have an account. Defaults to shown, matching every
  // existing logged-in caller.
  trend?: boolean;
};

export type StatisticsProps = {
  stats: [StatisticEntry, StatisticEntry, StatisticEntry, StatisticEntry];
  // The logged-in page (node 459:85358) added a balance readout + 儲值
  // button to the title row, absent from the guest version (node
  // 459:85252) -- there's nothing to top up before you have an account.
  // Omit for guest, same as every `trend` above.
  balance?: string;
};

// Figma "Statistics" (05_WU88-H-PC-Profile-Page node 459:85358, seen live
// on the page at 428:17332): a title bar ("投注紀錄") over 4 equal-width
// stat cards (總投注/總獲利/排名/平均勝率), each holding its own icon +
// value pair top-left and a trend-graph glyph top-right. `flex-1` cards
// in a `gap-[20px]` row, not 4 fixed-287px boxes, matching this project's
// own convention of flexible rather than pixel-pinned row layouts
// (SportsMachAnalysis's two columns, GeneralGames'/Promotions' cards).
//
// `balance`'s own row shares the title row rather than stacking below it
// (Figma has both anchored to the same y=0/20 pair, title left-aligned,
// balance right-aligned) -- its 40px number is taller than the plain
// title text, so the row grows and pushes the stat cards down with it
// for free, matching the ~16px gap Figma's logged-in version has over the
// guest one without needing to hardcode that difference anywhere.
export default function Statistics({ stats, balance }: StatisticsProps) {
  const topUpArrow = useArrowPulse();

  return (
    <div className="flex w-full flex-col items-start gap-[20px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <img alt="" src={withBasePath("/assets/statistics/icon-title.svg")} className="size-[25px]" />
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">投注紀錄</p>
        </div>

        {balance && (
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center gap-[10px]">
              <img alt="" src={withBasePath("/assets/statistics/icon-balance.svg")} className="size-[25px]" />
              <div className="h-[20px] w-px bg-[#f4f4f4]" />
              <p className="whitespace-nowrap text-[40px] font-black leading-[36px] tracking-[0.36px] text-[#3e4140]">{balance}</p>
            </div>
            <button
              type="button"
              onMouseEnter={topUpArrow.pulse}
              className="flex w-[100px] items-center justify-between overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#23f3d5] px-[15px] py-[10px]"
            >
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">儲值</span>
              <AnimatedArrowSpecial hovered={topUpArrow.hovered} size={25} color="#3e4140" />
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full items-center gap-[20px]">
        {stats.map((stat, i) => (
          <div key={i} className="flex h-[118px] flex-1 flex-col justify-between rounded-[25px] bg-[#f4f4f4] p-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[20px]">
                <img alt="" src={withBasePath(stat.icon)} className="size-[25px]" />
                <p className="whitespace-nowrap text-[20px] font-bold leading-[32px] tracking-[0.35px] text-[#3e4140]">{stat.value}</p>
              </div>
              {stat.trend !== false && <img alt="" src={withBasePath("/assets/statistics/icon-graph.svg")} className="size-[25px]" />}
            </div>
            <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
