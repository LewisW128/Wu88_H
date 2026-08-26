import { withBasePath } from "../lib/asset";

export type PromotionCardSize = "General" | "Small" | "Large";

export type PromotionCardCountdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export type PromotionCardProps = {
  size?: PromotionCardSize;
  image: string;
  lines: [string, string];
  countdown?: PromotionCardCountdown;
};

const SIZE_CONFIG = {
  General: {
    width: 331,
    mask: "/assets/promotion/card-mask-general.svg",
    buttonSize: 50,
    arrowSize: 27.761,
  },
  Small: {
    width: 297,
    mask: "/assets/promotion/card-mask-small.svg",
    buttonSize: 50,
    arrowSize: 27.761,
  },
  Large: {
    width: 594,
    mask: "/assets/promotion/card-mask-large.svg",
    buttonSize: 47.761,
    arrowSize: 27.761,
  },
} as const;

function TextsLine() {
  return <img alt="" src={withBasePath("/assets/product-card/texts-line.svg")} className="w-[10px] self-stretch" />;
}

function TimeUnit({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex items-end gap-[5px]">
      <p className="text-[14px] font-bold leading-[20px] text-[#23f3d5]">{value}</p>
      <p className="text-[10px] leading-[18px] text-[#3e4140]">{unit}</p>
    </div>
  );
}

// Figma "Promotion" component (Components Library node 77:1094 / 835:10368 /
// 672:21887, size=General/Small/Large). Same notched-card family as
// GameCard/ProductCard, landscape. General and Small share one photo
// ("Style=11") and just crop it to a narrower frame -- Figma keeps the photo
// at its original 331-wide box and shifts it left, then re-masks with an
// equal-and-opposite offset so the shape stays pinned to the narrower
// container (see the paired left/mask-position values below). Large swaps in
// its own wider photo and adds an "Everyday Rewards" countdown pill next to
// the promo text; its Play button is also a touch smaller (47.761 vs 50px).
export default function PromotionCard({ size = "General", image, lines, countdown }: PromotionCardProps) {
  const config = SIZE_CONFIG[size];
  const maskStyle = {
    maskImage: `url("${withBasePath(config.mask)}")`,
    maskSize: `${config.width}px 210px`,
    maskRepeat: "no-repeat",
  };

  return (
    <div className="group relative h-[210px] shrink-0" style={{ width: config.width }}>
      <div className="absolute inset-0" style={maskStyle}>
        {size === "Small" ? (
          <div
            className="absolute left-[-17px] top-0 h-[210px] w-[331px] overflow-hidden"
            style={{ ...maskStyle, maskPosition: "17px 0px" }}
          >
            <img
              alt=""
              src={image}
              className="pointer-events-none absolute max-w-none object-cover"
              style={{ left: "-22.05%", top: "-4.39%", width: "144.11%", height: "127.84%" }}
            />
          </div>
        ) : size === "Large" ? (
          <img
            alt=""
            src={image}
            className="pointer-events-none absolute left-0 h-[271px] w-full max-w-none object-cover"
            style={{ ...maskStyle, maskPosition: "0px 34px", bottom: "-27px" }}
          />
        ) : (
          <img
            alt=""
            src={image}
            className="pointer-events-none absolute max-w-none object-cover"
            style={{ left: "-22.05%", top: "-4.39%", width: "144.11%", height: "127.84%" }}
          />
        )}

        <img
          alt=""
          src={withBasePath("/assets/game-card/digital-dots.svg")}
          className="pointer-events-none absolute left-[70px] top-[9px] size-[218px]"
          style={{ ...maskStyle, maskPosition: "-70px -9px" }}
        />

        <div
          className="absolute bottom-0 left-0 h-[72px] w-full bg-gradient-to-b from-transparent to-black"
          style={{ ...maskStyle, maskPosition: "0px -138px" }}
        >
          <div className="absolute left-[20px] top-1/2 flex -translate-y-1/2 items-center gap-[20px]">
            <div className="flex w-[119px] items-center gap-[10px]">
              <TextsLine />
              <div className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px]">
                <p className="text-white">{lines[0]}</p>
                <p className="text-[#23f3d5]">{lines[1]}</p>
              </div>
            </div>

            {size === "Large" && countdown && (
              <div className="flex flex-col items-start rounded-[10px] bg-white/50 px-[10px] py-[5px] backdrop-blur-[10px]">
                <div className="flex w-[327px] items-center justify-between whitespace-nowrap tracking-[0.15px]">
                  <TimeUnit value={countdown.days} unit="天" />
                  <TimeUnit value={countdown.hours} unit="時" />
                  <TimeUnit value={countdown.minutes} unit="分" />
                  <TimeUnit value={countdown.seconds} unit="秒" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="promotion"
        className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-[#f4f4f4] p-[10px] backdrop-blur-[10px] transition-colors duration-300 group-hover:bg-[#3e4140]"
        style={{ width: config.buttonSize, height: config.buttonSize }}
      >
        <img
          alt=""
          src={withBasePath("/assets/product-card/arrow-special.svg")}
          className="group-hover:hidden"
          style={{ width: config.arrowSize, height: config.arrowSize }}
        />
        <img
          alt=""
          src={withBasePath("/assets/product-card/arrow-special-hover.svg")}
          className="hidden group-hover:block"
          style={{ width: config.arrowSize, height: config.arrowSize }}
        />
      </button>
    </div>
  );
}
