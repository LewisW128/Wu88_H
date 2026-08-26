"use client";

import { useEffect, useRef, useState } from "react";
import TalkSection, { type TalkSectionProps } from "./TalkSection";
import { useScale } from "./ScaleToFit";
import { withBasePath } from "../lib/asset";

// Default/fallback panel height (matches the Figma frame's own 1038px), used
// before the real viewport height is known and if measurement ever fails.
const DEFAULT_PANEL_HEIGHT = 1038;
// Message list: top-125px, must end 25px above the input bar (bottom-20px,
// 45px tall -> its own top is at height-20-45). (height-65)-25-125 = height-215.
const BOTTOM_CHROME = 215;
// The panel's real on-screen bottom edge must sit exactly 20px above the
// actual browser viewport's bottom edge, not just some fixed point in the
// design's own document flow -- ScaleToFit's whole canvas is scaled by
// window width, so "20px on screen" is `20 / scale` design-space px.
const VIEWPORT_BOTTOM_GAP = 20;
// Matches the `sticky top-[58px]` page.tsx positions this panel's own
// wrapper at (Top_bar's own 38px height + the original 20px gap below it).
const TOP_OFFSET = 58;

// Figma's own "Union" export: a rounded rect with a notch bitten out of the
// top-right corner (for the channel switcher to nest into). Stretching that
// flat SVG image to an arbitrary height (needed now that the panel's own
// height tracks the real viewport) distorts every curve non-uniformly --
// the rounded corners and the notch both warp. This traces the identical
// path as a `clip-path`, parametrized on the actual panel height: the top
// ~110px (the notch geometry) is fixed regardless of height, only the
// right/bottom/left edges and the three plain rounded corners scale to
// wherever the real bottom edge (`h`) ends up, exactly like a 9-slice image
// would but expressed as path math instead.
function panelClipPath(h: number) {
  return `path("M25 1H93C106.255 1 117 11.7452 117 25V35C117 63.1665 139.833 86 168 86H250C263.255 86 274 96.7452 274 110V${h - 25}C274 ${h - 11.75} 263.255 ${h - 1} 250 ${h - 1}H25C11.7452 ${h - 1} 1 ${h - 11.75} 1 ${h - 25}V25L1.00781 24.3809C1.33623 11.4122 11.9522 1 25 1Z")`;
}

export type TalkingBarProps = {
  messages: TalkSectionProps[];
  privateMessages: TalkSectionProps[];
  /** Extra messages appended one at a time to simulate the group chat staying
   * live -- cycles through this pool on an interval rather than a single
   * static snapshot. Only applies to the "all" channel. */
  simulatedMessages?: TalkSectionProps[];
};

type Channel = "all" | "private";

function ChannelButton({ active, icon, onClick, label }: { active: boolean; icon: string; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex items-center rounded-full p-[18px] transition-colors duration-300 ${active ? "bg-[#23f3d5]" : ""}`}
    >
      <img alt="" src={withBasePath(icon)} className="size-[25px]" />
    </button>
  );
}

// Figma "TalkingBar" component (Components Library node 639:4086, the full
// multi-person chat panel that Talk_section rows live inside). The panel's
// own outline -- a rounded rect with a notch bitten out of the top-right
// corner so the channel switcher can nest into it -- traces Figma's own
// "Union" export as a `clip-path` (see `panelClipPath`) rather than using
// that export as a flat background image, since the panel's height now
// tracks the real viewport and a stretched image would warp every curve.
// The message list is masked with Figma's matching fade SVG so messages
// scrolling up fade out under that notch instead of hard-clipping. The
// channel switch (all-chat vs. private) is wired to real state that
// actually swaps the rendered message list, not just a static screenshot
// of "all" selected with the switch as inert decoration.
export default function TalkingBar({ messages, privateMessages, simulatedMessages = [] }: TalkingBarProps) {
  const [channel, setChannel] = useState<Channel>("all");
  const [liveMessages, setLiveMessages] = useState(messages);
  const activeMessages = channel === "all" ? liveMessages : privateMessages;
  const scrollRef = useRef<HTMLDivElement>(null);
  const scale = useScale();
  const [panelHeight, setPanelHeight] = useState(DEFAULT_PANEL_HEIGHT);
  const trackHeight = panelHeight - BOTTOM_CHROME;
  const [thumb, setThumb] = useState({ height: trackHeight, top: 0 });

  useEffect(() => {
    function update() {
      if (!scale) return;
      const targetScreenBottom = window.innerHeight - VIEWPORT_BOTTOM_GAP;
      setPanelHeight(targetScreenBottom / scale - TOP_OFFSET);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [scale]);

  // Drip-feeds simulatedMessages into the "all" channel so the group chat
  // reads as live rather than a static, finished conversation. Every new
  // arrival scrolls the list to the bottom to show it.
  useEffect(() => {
    if (simulatedMessages.length === 0) return;
    let index = 0;
    const id = setInterval(() => {
      setLiveMessages((prev) => [...prev, simulatedMessages[index % simulatedMessages.length]]);
      index += 1;
      requestAnimationFrame(() => {
        if (channel === "all" && scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }, 4000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight) {
        setThumb({ height: trackHeight, top: 0 });
        return;
      }
      const height = Math.max(24, (clientHeight / scrollHeight) * trackHeight);
      const maxTop = trackHeight - height;
      const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;
      setThumb({ height, top });
    }

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [activeMessages, trackHeight]);

  return (
    <div className="relative w-[275px] shrink-0" style={{ height: panelHeight }}>
      {/* The clip-path shape itself (including the top-right notch the
          channel switcher nests into) is correct at any height -- verified
          directly by inspecting its rendered boundary. What actually reads
          as "the border/notch disappeared" is contrast: `border-[#f4f4f4]`
          + `bg-white/50` was designed as backdrop-blur over vivid hero art,
          and is nearly invisible once this panel extends down over the
          page's own plain white/light sections (Win List, Business) with
          nothing colorful behind it to blur. A drop shadow keeps the panel
          -- and its notch -- visually legible regardless of what's under
          it, the same way most frosted-glass card patterns pair blur with
          a shadow rather than relying on the border alone. */}
      <div
        className="pointer-events-none absolute inset-0 border-2 border-[#f4f4f4] bg-white/50 backdrop-blur-[10px]"
        style={{ clipPath: panelClipPath(panelHeight), filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.12))" }}
      />

      <div
        ref={scrollRef}
        className="no-scrollbar absolute left-[20px] top-[125px] flex w-[237px] flex-col items-start gap-[20px] overflow-y-auto"
        style={{
          height: trackHeight,
          // Deliberately NOT scaled to panelHeight: the message list itself
          // never reaches anywhere near the panel's bottom rounded corners
          // (it ends ~65px above them, at panelHeight-90 vs the corners
          // starting at panelHeight-25), so only this mask's fixed-position
          // top ~233px -- the notch outline and its fade gradient -- is
          // ever actually visible through it. Keeping its own coordinate
          // space at the original fixed 1038px avoids re-warping this
          // shape the same way the panel background just was.
          maskImage: `url("${withBasePath("/assets/talk-section/fade-mask.svg")}")`,
          maskSize: "275px 1038px",
          maskPosition: "-20px -125px",
          maskRepeat: "no-repeat",
        }}
      >
        {activeMessages.map((message, i) => (
          <TalkSection key={i} {...message} />
        ))}
      </div>

      <div
        className="pointer-events-none absolute right-0 w-[2px] rounded-full bg-[#23f3d5]"
        style={{ top: 125 + thumb.top, height: thumb.height }}
      />

      <div className="absolute bottom-[20px] left-[20px] flex h-[45px] w-[235px] items-center overflow-hidden rounded-[15px] bg-[#f4f4f4]/50 pl-[8px] pr-[4.5px] backdrop-blur-[15px]">
        <p className="flex-1 whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">輸入訊息</p>
        <button
          type="button"
          aria-label="send"
          className="flex size-[28.674px] items-center justify-center rounded-[10px] bg-[#23f3d5] p-[6px] backdrop-blur-[6px]"
        >
          <img alt="" src={withBasePath("/assets/talk-section/send-arrow.svg")} className="size-[16.667px]" />
        </button>
      </div>

      <div className="absolute right-0 top-0 flex h-[65px] w-[136px] items-center justify-between overflow-hidden rounded-full border-2 border-[#f4f4f4] bg-[#f4f4f4]/50 backdrop-blur-[15px]">
        <ChannelButton active={channel === "all"} icon="/assets/talk-section/message-all.svg" onClick={() => setChannel("all")} label="群組聊天" />
        <ChannelButton active={channel === "private"} icon="/assets/talk-section/message-private.svg" onClick={() => setChannel("private")} label="私人訊息" />
      </div>
    </div>
  );
}
