import { withBasePath } from "../lib/asset";

export type TopBarAnnouncement = {
  name: string;
  amount: string;
};

export type TopBarProps = {
  onlineCount: string;
  totalReward: string;
  announcements: TopBarAnnouncement[];
};

function StatItem({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-[5px]">
      <img alt="" src={withBasePath(icon)} className="size-[17px]" />
      <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#23f3d5]">{value}</p>
      <p className="whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">{label}</p>
    </div>
  );
}

function AnnouncementItem({ name, amount }: TopBarAnnouncement) {
  return (
    <span className="whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">
      {`@ ${name} 百家樂獨得 `}
      <span className="text-[#23f3d5]">{amount}</span>
    </span>
  );
}

// Figma "Top_bar" component (Components Library node 652:5512). A slim
// 38px status strip: online count + cumulative reward stats, a vertical
// divider, then a marquee of win announcements. Figma's own reference just
// repeats one announcement twice back to back -- that's the classic
// seamless-marquee setup (duplicate the content once, animate -50% and
// snap back), so it's built as a real infinitely-scrolling marquee rather
// than static repeated text.
export default function TopBar({ onlineCount, totalReward, announcements }: TopBarProps) {
  return (
    <div className="flex h-[38px] w-[1728px] items-center gap-[20px] overflow-hidden bg-[#f4f4f4] pl-[40px]">
      <div className="flex items-center gap-[20px]">
        <StatItem icon="/assets/top-bar/icon-online.svg" value={onlineCount} label="在線人數" />
        <StatItem icon="/assets/top-bar/icon-reward.svg" value={totalReward} label="累計獎勵" />
      </div>

      <img alt="" src={withBasePath("/assets/top-bar/divider.svg")} className="h-[10px] w-[2px]" />

      <div className="flex min-w-0 flex-1 items-center gap-[5px] overflow-hidden">
        <img alt="" src={withBasePath("/assets/top-bar/icon-announcement.svg")} className="size-[17px] shrink-0" />
        <div
          className="flex min-w-0 flex-1 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
          }}
        >
          <div className="flex shrink-0 animate-[marquee_20s_linear_infinite] items-center gap-[40px] pr-[40px]">
            {announcements.map((a, i) => (
              <AnnouncementItem key={i} {...a} />
            ))}
          </div>
          <div aria-hidden className="flex shrink-0 animate-[marquee_20s_linear_infinite] items-center gap-[40px] pr-[40px]">
            {announcements.map((a, i) => (
              <AnnouncementItem key={i} {...a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
