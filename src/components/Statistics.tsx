import { withBasePath } from "../lib/asset";

export type StatisticEntry = {
  icon: string;
  value: string;
  label: string;
};

export type StatisticsProps = {
  stats: [StatisticEntry, StatisticEntry, StatisticEntry, StatisticEntry];
};

// Figma "Statistics" (05_WU88-H-PC-Profile-Page node 459:85358, seen live
// on the page at 428:17332): a title bar ("投注紀錄") over 4 equal-width
// stat cards (總投注/總獲利/排名/平均勝率), each holding its own icon +
// value pair top-left and a trend-graph glyph top-right. `flex-1` cards
// in a `gap-[20px]` row, not 4 fixed-287px boxes, matching this project's
// own convention of flexible rather than pixel-pinned row layouts
// (SportsMachAnalysis's two columns, GeneralGames'/Promotions' cards).
export default function Statistics({ stats }: StatisticsProps) {
  return (
    <div className="flex w-full flex-col items-start gap-[20px]">
      <div className="flex items-center gap-[10px]">
        <img alt="" src={withBasePath("/assets/statistics/icon-title.svg")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">投注紀錄</p>
      </div>

      <div className="flex w-full items-center gap-[20px]">
        {stats.map((stat, i) => (
          <div key={i} className="flex h-[118px] flex-1 flex-col justify-between rounded-[25px] bg-[#f4f4f4] p-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[20px]">
                <img alt="" src={withBasePath(stat.icon)} className="size-[25px]" />
                <p className="whitespace-nowrap text-[20px] font-bold leading-[32px] tracking-[0.35px] text-[#3e4140]">{stat.value}</p>
              </div>
              <img alt="" src={withBasePath("/assets/statistics/icon-graph.svg")} className="size-[25px]" />
            </div>
            <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
