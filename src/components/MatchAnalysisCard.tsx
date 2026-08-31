import { withBasePath } from "../lib/asset";

export type MatchAnalysisCardProps = {
  image: string;
  title: string;
  date: string;
  excerpt: string;
};

// Figma "Match analysis" (03_WU88-H-PC-Sport node 66:20550, seen live in
// the 賽事分析 grid at 54:5338). A light card: a small dark thumbnail,
// then a headline (single line, ellipsis-truncated) with the same teal
// "verified" checkmark as News Banner, a timestamp, and a 3-line excerpt.
// Figma clips the excerpt to a fixed 57px box across possibly-2-or-3
// `<p>` paragraphs, which isn't real ellipsis-able CSS -- `line-clamp-3`
// on the joined text reproduces the same "long excerpt, visibly cut off"
// intent with a real ellipsis instead of a hard mid-line clip.
export default function MatchAnalysisCard({ image, title, date, excerpt }: MatchAnalysisCardProps) {
  return (
    <div className="flex w-[614.5px] shrink-0 items-start gap-[15px] rounded-[25px] bg-[#f4f4f4] p-[20px]">
      <div className="h-[106.452px] w-[169px] shrink-0 overflow-hidden rounded-[15px] bg-[#3e4140]">
        <img alt="" src={withBasePath(image)} className="pointer-events-none size-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
        <div className="flex w-full items-center gap-[5px]">
          <img alt="" src={withBasePath("/icon/sports-news-subtract.png")} className="size-[12px] shrink-0" />
          <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">
            {title}
          </p>
        </div>
        <p className="whitespace-nowrap text-[10px] font-medium leading-[18px] tracking-[0.15px] text-[#dadada]">{date}</p>
        <p className="line-clamp-3 w-full text-[12px] leading-[18px] tracking-[0.15px] text-[#b2b2b2]">{excerpt}</p>
      </div>
    </div>
  );
}
