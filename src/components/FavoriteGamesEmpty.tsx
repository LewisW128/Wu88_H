import { withBasePath } from "../lib/asset";

// Figma "General Games" instance on the Profile page's guest state
// (05_WU88-H-PC-Profile-Page node 455:23414, title "收藏的遊戲"): the same
// row this page shows as "電子遊戲推薦" when logged in swaps to a favorites
// row before login -- there's nothing to favorite yet, so it's a single
// empty-state card instead of a real ProductCard grid. Reuses ProductCard's
// own S-size mask/dots assets (photo-mask.svg, digital-dots.svg) since it's
// the same 200x266 card shape with the same bottom-right notch, just with a
// plain gray fill instead of a photo and a "+" glyph instead of the arrow.
export default function FavoriteGamesEmpty() {
  const maskStyle = {
    maskImage: `url("${withBasePath("/assets/product-card/photo-mask.svg")}")`,
    maskSize: "200px 266px",
    maskRepeat: "no-repeat",
  };

  return (
    <div className="flex w-full flex-col items-start gap-[15px]">
      <div className="flex h-[44px] items-center gap-[10px]">
        <img alt="" src={withBasePath("/assets/section-header/icon-favorite-games.svg")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#444242]">收藏的遊戲</p>
      </div>

      <div className="relative h-[266px] w-[200px] shrink-0 overflow-clip rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] bg-[#f4f4f4]" style={maskStyle}>
        <img
          alt=""
          src={withBasePath("/assets/product-card/digital-dots.svg")}
          className="pointer-events-none absolute left-[20px] top-[20px] size-[218px]"
          style={{ ...maskStyle, maskPosition: "-20px -20px" }}
        />

        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">
          沒有任何收藏
        </p>

        <button
          type="button"
          aria-label="收藏遊戲"
          className="absolute -bottom-[0.19px] -right-[0.19px] flex size-[50px] items-center justify-center rounded-full bg-[#f4f4f4] p-[10px] backdrop-blur-[10px]"
        >
          <img alt="" src={withBasePath("/assets/game-card/icon-add.svg")} className="size-[16.66px]" />
        </button>
      </div>
    </div>
  );
}
