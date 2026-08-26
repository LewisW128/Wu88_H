import Avatar from "./Avatar";
import LevelBadge from "./LevelBadge";
import { withBasePath } from "../lib/asset";

export type RankSectionProps = {
  avatar: string;
  name: string;
  levelLabel: string;
  levelBackground: string;
  levelOpacity?: number;
  bet: string;
  win: string;
  odds: string;
  thumb: string;
};

// Figma "Rank_section" component (Components Library node 672:16776). No
// fill of its own -- just a 49px-tall row: Avatar (the standalone 82:2048
// component, reused here at 50px) + name/level, bet icon+amount, win
// icon+amount, odds text, and a game thumbnail.
//
// The thumbnail is two nested boxes, not one: the OUTER box is clipped to
// the row's own 49px height (top-0 bottom-0, stretched) -- that's the
// visible rounded-pill window. The INNER photo layer is deliberately taller
// (81.08px) and shifted up 10px, so the outer window only ever reveals its
// vertical middle. Making the outer box 81px tall too (this component's
// first pass did) removes the crop and lets the whole oversized pill
// protrude past the row.
export default function RankSection({ avatar, name, levelLabel, levelBackground, levelOpacity, bet, win, odds, thumb }: RankSectionProps) {
  return (
    <div className="relative h-[49px] w-[1206px] shrink-0">
      <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-[10px]">
        <Avatar photo={avatar} size={50} ringColor={levelBackground} badgeColor={levelBackground} />
        <div className="flex flex-col items-start gap-[5px]">
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{name}</p>
          <LevelBadge label={levelLabel} background={levelBackground} opacity={levelOpacity} />
        </div>
      </div>

      <div className="absolute left-[264px] top-1/2 flex -translate-y-1/2 items-center gap-[10px]">
        <img alt="" src={withBasePath("/icons/actions/bet.svg")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">{bet}</p>
      </div>

      <div className="absolute left-[557px] top-1/2 flex -translate-y-1/2 items-center gap-[10px]">
        <img alt="" src={withBasePath("/icons/actions/win.svg")} className="size-[25px]" />
        <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">{win}</p>
      </div>

      <p className="absolute left-[887px] top-1/2 -translate-y-1/2 whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">
        {odds}
      </p>

      <div className="absolute bottom-0 right-0 top-0 w-[60.962px] overflow-hidden rounded-[37.342px] bg-white">
        <div className="absolute left-1/2 top-[-10px] h-[81.08px] w-[60.962px] -translate-x-1/2 overflow-hidden backdrop-blur-[5.626px]">
          <div
            className="absolute inset-0"
            style={{
              maskImage: `url("${withBasePath("/assets/product-card/photo-mask.svg")}")`,
              maskSize: "200px 266px",
              maskRepeat: "no-repeat",
            }}
          >
            <img alt="" src={thumb} className="pointer-events-none absolute inset-0 size-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
