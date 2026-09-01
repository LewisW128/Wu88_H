import { withBasePath } from "../lib/asset";

export type NewsBannerProps = {
  image: string;
  caption: string;
};

// Figma "News Banner" (03_WU88-H-PC-Sport node 66:59454, seen in the
// 體育新聞 row at 54:5337). A dark rounded card with a full-bleed photo and
// a blurred dark-gradient caption bar pinned to the bottom.
//
// The photo isn't a plain `inset-0 object-cover` -- Figma's own photo box
// is deliberately larger than the card (450.287x300.192 inside a
// 404.287x241.945 card) and vertically centered rather than top-aligned,
// which zooms/crops the image differently than letting object-cover fit
// the card's own bounds would. The caption bar is a FIXED 66px band
// (top:176px in a 241.945px-tall card, i.e. flush to the bottom), not an
// auto-height box grown from padding -- getting this wrong was the actual
// spec bug: padding-driven height let 2 lines of caption text push the
// band taller than Figma's 66px and drift its top edge up the photo.
export default function NewsBanner({ image, caption }: NewsBannerProps) {
  return (
    <div className="relative h-[241.945px] w-[404.287px] shrink-0 overflow-hidden rounded-[25px] bg-[#3e4140]">
      <img
        alt=""
        src={withBasePath(image)}
        className="pointer-events-none absolute left-0 top-1/2 h-[300.192px] w-[450.287px] -translate-y-1/2 object-cover"
      />
      <div
        className="absolute bottom-0 left-0 h-[66px] w-full overflow-hidden"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 121.19%)", backdropFilter: "blur(10px)" }}
      >
        <div className="absolute left-[20px] top-[10px] flex w-[229px] items-start gap-[10px]">
          <img alt="" src={withBasePath("/icon/sports-news-subtract.png")} className="mt-[4px] size-[12px] shrink-0" />
          <p className="line-clamp-2 h-[40px] overflow-hidden text-ellipsis text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}
