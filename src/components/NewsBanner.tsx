import { withBasePath } from "../lib/asset";

export type NewsBannerProps = {
  image: string;
  caption: string;
};

// Figma "News Banner" (03_WU88-H-PC-Sport node 66:59454, seen in the
// 體育新聞 row at 54:5337). A dark rounded card with a full-bleed photo and
// a blurred dark-gradient caption bar pinned to the bottom, a small teal
// "verified" checkmark before the (up to 2-line) headline.
export default function NewsBanner({ image, caption }: NewsBannerProps) {
  return (
    <div className="relative h-[241.945px] w-[404.287px] shrink-0 overflow-hidden rounded-[25px] bg-[#3e4140]">
      <img alt="" src={withBasePath(image)} className="pointer-events-none absolute inset-0 size-full object-cover" />
      <div
        className="absolute bottom-0 left-0 flex w-full items-start gap-[10px] overflow-hidden px-[20px] pt-[46px]"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 121.19%)", backdropFilter: "blur(10px)" }}
      >
        <img alt="" src={withBasePath("/icon/sports-news-subtract.png")} className="mt-[3px] size-[12px] shrink-0" />
        <p className="line-clamp-2 pb-[10px] text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">{caption}</p>
      </div>
    </div>
  );
}
