"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import ProductLabel, { type ProductLabelType } from "./ProductLabel";

export type ProductCardProps = {
  image: string;
  title: string;
  category: string;
  views: string;
  wins: string;
  labels?: ProductLabelType[];
  like?: boolean;
  // "L" (225px, Casino page's grid) vs "S" (200px, homepage's 推薦遊戲 row) --
  // Figma exports these as two separate mask assets (photo-mask-l.svg /
  // photo-mask.svg) rather than one shape that scales, since the notch's
  // curve radii don't scale linearly with width.
  size?: "S" | "L";
};

// Figma "Products" component (Components Library node 1:491, hover state
// node 631:5929, "L" 225px variant seen on 02_WU88-H-PC-Casino node
// 122:6664). Same family as GameCard (dots decoration, Play button poking
// into a curved notch) but portrait-oriented, the notch sits bottom-right
// instead of top-right, and the photo is a real image rather than looping
// video. Figma's own generated code keeps the 3 plain corners as simple
// `rounded-*` classes on the container and only masks the photo/gradient/
// dots layers for the notch (photo-mask.svg) -- no custom clip-path math
// needed since the Play button's circle already lines up with the
// container's own bottom-right radius.
//
// Hover swaps in: the darkening gradient grows from a 50px strip to cover
// the full card, revealing a category tag + view/win counts under the
// title; the Play button inverts (dark fill + light ring, teal arrow); and
// a second icon button appears below the like button.
export default function ProductCard({ image, title, category, views, wins, labels = ["HOT"], like = false, size = "S" }: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  const width = size === "L" ? 225 : 200;
  const maskAsset = size === "L" ? "photo-mask-l.svg" : "photo-mask.svg";
  const maskStyle = {
    maskImage: `url("${withBasePath(`/assets/product-card/${maskAsset}`)}")`,
    maskSize: `${width}px 266px`,
    maskRepeat: "no-repeat",
  };

  return (
    <div
      className="group relative h-[266px] shrink-0 overflow-clip rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px]"
      style={{ width: `${width}px` }}
    >
      <img alt="" src={image} className="pointer-events-none absolute inset-0 size-full object-cover" style={maskStyle} />

      <img
        alt=""
        src={withBasePath("/assets/game-card/digital-dots.svg")}
        className="pointer-events-none absolute left-[20px] top-[20px] size-[218px]"
        style={{ ...maskStyle, maskPosition: "-20px -20px" }}
      />

      <div className="absolute left-[10px] top-[17px] flex items-center gap-[5px]">
        {labels.map((label) => (
          <ProductLabel key={label} type={label} />
        ))}
      </div>

      <div className="absolute inset-0" style={maskStyle}>
        <div className="absolute bottom-0 left-0 h-[50px] w-full bg-gradient-to-b from-transparent to-black transition-[height] duration-300 ease-out group-hover:h-[266px]">
          <div className="absolute bottom-[20px] left-[20px] flex flex-col items-start gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white">{title}</p>

              <div className="hidden h-[10px] w-px bg-white/40 group-hover:block" />
              <p className="hidden whitespace-nowrap text-[10px] font-medium leading-[18px] tracking-[0.15px] text-[#23f3d5] group-hover:block">{category}</p>
            </div>

            <div className="hidden flex-col items-start gap-[5px] group-hover:flex">
              <div className="flex items-center gap-[5px]">
                <img alt="" src={withBasePath("/assets/product-card/icon-views.svg")} className="size-[15px]" />
                <p className="whitespace-nowrap text-[10px] font-bold leading-[18px] tracking-[0.15px] text-[#23f3d5]">{views}</p>
              </div>
              <div className="flex items-center gap-[5px]">
                <img alt="" src={withBasePath("/assets/product-card/icon-wins.svg")} className="size-[15px]" />
                <p className="whitespace-nowrap text-[10px] font-bold leading-[18px] tracking-[0.15px] text-[#23f3d5]">{wins}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={title}
        className="absolute -bottom-[0.19px] -right-[0.19px] flex size-[50px] items-center justify-center rounded-full bg-[#f4f4f4] p-[10px] backdrop-blur-[10px] transition-colors duration-300 group-hover:bg-[#3e4140]"
      >
        <img alt="" src={withBasePath("/assets/product-card/arrow-special.svg")} className="size-[27.761px] group-hover:hidden" />
        <img alt="" src={withBasePath("/assets/product-card/arrow-special-hover.svg")} className="hidden size-[27.761px] group-hover:block" />
      </button>

      {like && (
        <>
          <button
            type="button"
            aria-label="like"
            aria-pressed={liked}
            onClick={() => setLiked((prev) => !prev)}
            className={`absolute right-[10px] top-[10px] size-[35px] ${
              liked ? "block" : "hidden rounded-[10px] bg-white/80 backdrop-blur-[2px] group-hover:block"
            }`}
          >
            {liked ? (
              <img alt="" src={withBasePath("/assets/product-card/like-icon-on.svg")} className="absolute left-0 top-0 h-[37px] w-[35px]" />
            ) : (
              <img alt="" src={withBasePath("/assets/product-card/like-icon.svg")} className="absolute left-[5px] top-[5px] size-[25px]" />
            )}
          </button>

          <div className="absolute right-[10px] top-[55px] hidden size-[35px] rounded-[10px] bg-white/80 backdrop-blur-[2px] group-hover:block">
            <img alt="" src={withBasePath("/assets/product-card/icon-second.svg")} className="absolute left-[5px] top-[5px] size-[25px]" />
          </div>
        </>
      )}
    </div>
  );
}
