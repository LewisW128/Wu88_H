import Avatar from "./Avatar";
import LevelBadge from "./LevelBadge";
import { withBasePath } from "../lib/asset";

const DEFAULT_RING_COLOR = "#f4f4f4";

export type TalkSectionVariant = "myself" | "other";

export type TalkSectionReply = {
  name: string;
  text: string;
};

export type TalkSectionProps = {
  avatar: string;
  name: string;
  levelLabel?: string;
  levelBackground?: string;
  timestamp: string;
  text: string;
  variant: TalkSectionVariant;
  replyTo?: TalkSectionReply;
};

// Figma "Talk_section" component (Components Library node 640:6210,
// style=general(myself)/general(other)/Reply(Myself)/Reply(other)). A chat
// message row: avatar + name/level, timestamp + reply icon, then the
// message bubble -- green/50%-opacity for your own messages, light gray for
// everyone else's. Figma treats "replying to someone" as two more style
// variants (own colors doubled up), but it's really an orthogonal feature
// (a quoted block prepended to either bubble color), so it's modeled here
// as an optional `replyTo` prop instead of a 4-way enum.
//
// The multi-person chat panel (TalkingBar) shows the level badge in
// different colors per user (VIP gradient, plain green, plain yellow) --
// same levelLabel/levelBackground shape as Rank_section, not a fixed
// gradient -- and non-members simply don't have one. The avatar ring
// follows the same levelBackground (matching Rank_section's own
// ring=badge-color pattern), falling back to a plain gray border when
// there's no level at all.
export default function TalkSection({ avatar, name, levelLabel, levelBackground, timestamp, text, variant, replyTo }: TalkSectionProps) {
  const isMine = variant === "myself";
  const bubbleBg = isMine ? "rgba(35,243,213,0.5)" : "#f4f4f4";
  const quoteBg = isMine ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.8)";

  return (
    <div className="flex w-[237px] max-w-full items-start gap-[5px]">
      <Avatar photo={avatar} size={32} badge={false} ringColor={levelBackground ?? DEFAULT_RING_COLOR} />

      <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
        <div className="flex w-full items-center justify-between gap-[10px]">
          <div className="flex min-w-0 items-center gap-[10px]">
            <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">{name}</p>
            {levelLabel && levelBackground && <LevelBadge label={levelLabel} background={levelBackground} />}
          </div>

          <div className="flex shrink-0 items-center gap-[2px]">
            <p className="whitespace-nowrap text-[8px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">{timestamp}</p>
            <img alt="" src={withBasePath("/assets/talk-section/reply-icon.svg")} className="h-[10px] w-[7.207px]" />
          </div>
        </div>

        <div
          className="flex max-w-full rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px]"
          style={
            replyTo
              ? { background: bubbleBg, padding: 10 }
              : { background: bubbleBg, paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4 }
          }
        >
          <div className="flex min-w-0 flex-col items-start gap-[5px]">
            {replyTo && (
              <div className="flex min-w-0 flex-col items-start rounded-bl-[8px] rounded-br-[8px] rounded-tr-[8px] px-[5px] py-[2px]" style={{ background: quoteBg }}>
                <div className="flex w-full items-center gap-[10px]">
                  <span className="h-[20px] w-[2px] shrink-0 rounded-full bg-[#23f3d5] shadow-[2px_0_4px_rgba(35,243,213,0.8)]" />
                  <div className="flex min-w-0 flex-col items-start justify-center leading-[18px] tracking-[0.15px]">
                    <p className="whitespace-nowrap text-[10px] font-bold text-[#a2a2a2]">{`@ ${replyTo.name}`}</p>
                    <p className="break-words text-[12px] text-[#3e4140]">{replyTo.text}</p>
                  </div>
                </div>
              </div>
            )}
            <p className="break-words text-[12px] leading-[18px] tracking-[0.15px] text-[#3e4140]">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
