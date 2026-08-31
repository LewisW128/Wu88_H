import { withBasePath } from "../lib/asset";

export type SportGameBoardTeam = {
  name: string;
  flag: string;
};

export type SportGameBoardOdd = {
  label: string;
  value: string;
};

export type SportGameBoardProps = {
  sportName: string;
  gameName: string;
  teamA: SportGameBoardTeam;
  teamB: SportGameBoardTeam;
  scoreA: string;
  scoreB: string;
  sportTime: string;
  startTime: string;
  odds: [SportGameBoardOdd, SportGameBoardOdd, SportGameBoardOdd];
};

// Figma "Sport game board" (03_WU88-H-PC-Sport node 788:8874, seen live in
// the "Sports Live" row at 801:11171-11175). A frosted-glass card (white
// border + blurred half-opacity fill) holding: sport icon/name + league
// subtitle top-left, two teams with circular flags mid-left, three
// odds pills along the bottom, a two-row score box, and a time/clock
// badge pair top-right -- all absolutely positioned at Figma's own
// coordinates rather than flexed, since several of them (the score box,
// the time badges) sit independently of the two text columns beside them.
export default function SportGameBoard({ sportName, gameName, teamA, teamB, scoreA, scoreB, sportTime, startTime, odds }: SportGameBoardProps) {
  return (
    <div className="relative h-[197px] w-[281px] shrink-0 overflow-hidden rounded-[25px] border border-white bg-[rgba(244,244,244,0.5)] backdrop-blur-[10px]">
      <div className="absolute left-[14px] top-[14px] flex w-[79px] flex-col items-start gap-[5px]">
        <div className="flex w-full items-center gap-[5px]">
          <img alt="" src={withBasePath("/icon/sport-live-trophy.png")} className="size-[17px]" />
          <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">{sportName}</p>
        </div>
        <p className="w-[117px] overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-medium leading-[18px] tracking-[0.15px] text-[#a2a2a2]">
          {gameName}
        </p>
      </div>

      <div className="absolute left-[14px] top-[67px] flex w-[96px] flex-col items-start gap-[11px]">
        {[teamA, teamB].map((team) => (
          <div key={team.name} className="flex w-full items-center gap-[6px]">
            <img alt="" src={withBasePath(team.flag)} className="size-[20px] shrink-0 rounded-full" />
            <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px] text-[#3e4140]">{team.name}</p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-[14px] left-[14px] flex items-center gap-[10px] whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[0.15px]">
        {odds.map((odd, i) => (
          <div key={i} className="relative h-[40px] rounded-[15px] bg-white" style={{ width: i === 1 ? 55 : 88 }}>
            <p className="absolute left-[10px] top-[11px] text-[12px] leading-[18px] text-[#a2a2a2]">{odd.label}</p>
            <p className="absolute right-[10px] top-[10px] text-[14px] leading-[20px] text-[#3e4140]">{odd.value}</p>
          </div>
        ))}
      </div>

      <div className="absolute right-[18px] top-[62px] flex w-[30px] items-center rounded-[10px] bg-white px-[10px] py-[5px]">
        <div className="flex h-[51px] w-[10px] flex-col items-start justify-between text-[14px] font-medium leading-[20px] tracking-[0.15px] text-[#3e4140]">
          <p className="w-full">{scoreA}</p>
          <p className="w-full">{scoreB}</p>
        </div>
      </div>

      <div className="absolute right-[14px] top-[14px] flex items-center gap-[10px]">
        <div className="flex items-center justify-center rounded-[10px] bg-white p-[5px]">
          <p className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[0.15px] text-[#3e4140]">{sportTime}</p>
        </div>
        <div className="flex items-center justify-center gap-[10px] rounded-[10px] bg-white p-[5px]">
          <img alt="" src={withBasePath("/icon/sport-live-clock.png")} className="size-[17px]" />
          <p className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[0.15px] text-[#3e4140]">{startTime}</p>
        </div>
      </div>
    </div>
  );
}
