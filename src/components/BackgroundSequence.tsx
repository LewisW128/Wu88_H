import { withBasePath } from "../lib/asset";

export type BackgroundSequenceStage = "idle" | "selected";

// Figma's own background here (Rectangle10, a single still frame) is
// replaced per the user's own instructions with the actual Premiere render
// it was pulled from: one continuous 10-second shot (D:\works\09_WU88-H\
// source\public\Premiere\Bonus_Charactor), exported as 298 PNG frames and
// split by the user into two folders -- "01" (frames sh000-sh182, the
// portion shown the moment this page loads) and "02" (sh183-sh297, picked
// up once the caller's own "stage" prop says so -- currently the Reward
// Center page's own screen 2, reachable by scrolling there or picking a
// Reward_Kit card, see that page's own comment). The two are one
// continuous take, not independent loops, so "02" has to visually pick up
// exactly where "01" left off rather than replaying from its own start.
//
// Each folder was encoded (see the one-off build script this project used,
// not checked in) into a single non-looping animated WEBP at 30fps --
// hundreds of individual PNGs would be far too many requests, and a sprite-
// sheet-in-CSS-background (this project's usual technique for a shorter
// idle loop, see ContainerBg) doesn't scale to 183/115 frames without the
// sheet itself becoming an unreasonably large single image. WEBP keeps the
// alpha channel both PNG sequences render with (MP4 can't carry alpha, see
// ContainerBg's own comment on why its hero sprites aren't plain video).
//
// `key={stage}` forces a full remount when the stage changes, which is what
// actually restarts the (loop:1, i.e. play-once-then-hold-last-frame) WEBP
// from its own frame 0 -- swapping just the `src` on a live <img> does not
// reliably restart an already-decoded animated image in every browser.
export default function BackgroundSequence({ stage, className }: { stage: BackgroundSequenceStage; className?: string }) {
  return (
    <img
      key={stage}
      alt=""
      src={withBasePath(stage === "selected" ? "/animation/rewards-bg-02.webp" : "/animation/rewards-bg-01.webp")}
      className={className}
    />
  );
}
