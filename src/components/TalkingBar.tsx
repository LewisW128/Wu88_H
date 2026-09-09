"use client";

import { useEffect, useId, useRef, useState } from "react";
import Avatar from "./Avatar";
import AnimatedArrowSpecial from "./AnimatedArrowSpecial";
import LevelBadge from "./LevelBadge";
import TalkSection, { type TalkSectionProps } from "./TalkSection";
import { useScale } from "./ScaleToFit";
import { withBasePath } from "../lib/asset";

export type Friend = {
  id: string;
  name: string;
  avatar: string;
  levelLabel: string;
  // Also doubles as the avatar's own ring color, same as Talk_section's
  // established convention (see TalkSection.tsx's own comment).
  levelBackground: string;
  // The online-status dot (Components Library node 754:9317's own
  // Ellipse 46/47/48) is a THIRD color, independent of the level badge --
  // Jackson's own dot is teal/online, Johnny's is orange/away, Arick's is
  // gray/offline, none of which match their own level-badge colors.
  status: "online" | "away" | "offline";
  timestamp: string;
  // Omitted entirely (not just blank) for a friend with no conversation
  // yet -- Arick's own card in the Figma reference has no message preview
  // at all, which reads naturally as "you haven't messaged them yet"
  // rather than as a missing/loading value.
  lastMessage?: string;
  messages: TalkSectionProps[];
};

const STATUS_DOT_COLOR: Record<Friend["status"], string> = {
  online: "#23f3d5",
  away: "#f39923",
  offline: "#a2a2a2",
};

// A stable reference for "no messages yet" -- `selectedFriend?.messages ??
// []` would create a brand-new array every render, which as an effect
// dependency below re-fires that effect every render, which calls
// setState, which re-renders, forever (an infinite "Maximum update depth
// exceeded" loop caught live while testing this).
const NO_MESSAGES: TalkSectionProps[] = [];

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
// path, parametrized on the actual panel height: the top ~110px (the notch
// geometry) is fixed regardless of height, only the right/bottom/left edges
// and the three plain rounded corners scale to wherever the real bottom
// edge (`h`) ends up, exactly like a 9-slice image would but expressed as
// path math instead.
//
// Uses the IDENTICAL coordinates as fade-mask.svg below (not a
// hand-adjusted approximation) -- the border ring and the message list's
// fade mask are two independent DOM layers, and if their shapes are ever
// maintained as separately-tuned numbers they can drift apart. Rendering
// this as a real SVG `<path>` with a `stroke` (centered on the path by
// definition) rather than a CSS `border` on a `clip-path`'d box also
// removes the need to hand-inset every coordinate by ~1px to fake that
// same centering -- one shared source of numbers, no compensation math.
function panelPath(h: number) {
  return `M25 0H93C106.807 0 118 11.1929 118 25V35C118 62.6142 140.386 85 168 85H250C263.807 85 275 96.1929 275 110V${h - 25}C275 ${h - 11.1929} 263.807 ${h} 250 ${h}H25C11.1929 ${h} 0 ${h - 11.1929} 0 ${h - 25}V25C0 11.1929 11.1929 0 25 0Z`;
}

export type TalkingBarProps = {
  messages: TalkSectionProps[];
  // The "私人訊息" channel's own entry point (Components Library node
  // 754:9317, "All Friends"): a friend list, not a single conversation
  // directly -- picking a friend (node 998:10020, "Eachother talk") is
  // what actually opens their own thread, replacing the old flat
  // `privateMessages` prop that skipped straight to one hardcoded
  // conversation.
  friends: Friend[];
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

// Figma "Talk section" (Components Library, the friend-list row inside
// node 754:9317's "All Friends" TalkingBar variant) -- distinct from
// Talk_section (TalkSection.tsx), which is a chat MESSAGE row, not a
// friend-list row. Fixed 71px tall even for a friend with no
// `lastMessage` (Arick's own card in the reference), so the list stays
// evenly spaced rather than each row hugging its own content height.
// The corner arrow reuses AnimatedArrowSpecial (the same glyph family as
// ProfileSidebar's own back-arrow.svg) instead of a new static asset,
// statically fully-drawn (`hovered` pinned true) since this row isn't
// itself hover-tracked -- only the click matters here.
function FriendCard({ friend, onClick }: { friend: Friend; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-[71px] w-full shrink-0 items-start gap-[10px] rounded-[10px] border border-[#f4f4f4] bg-white/50 p-[10px] text-left"
    >
      <div className="relative shrink-0">
        <Avatar photo={withBasePath(friend.avatar)} size={46} badge={false} ringColor={friend.levelBackground} />
        <div
          className="absolute bottom-0 right-0 size-[11px] rounded-full border-2 border-white"
          style={{ background: STATUS_DOT_COLOR[friend.status] }}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
        <div className="flex w-full items-center justify-between gap-[10px]">
          <div className="flex min-w-0 items-center gap-[5px]">
            <p className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">{friend.name}</p>
            <LevelBadge label={friend.levelLabel} background={friend.levelBackground} />
          </div>
          <p className="whitespace-nowrap text-[8px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">{friend.timestamp}</p>
        </div>

        {friend.lastMessage && (
          <div className="max-w-full rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] bg-[#f4f4f4] px-[10px] py-[4px]">
            <p className="truncate text-[12px] leading-[18px] tracking-[0.15px] text-[#3e4140]">{friend.lastMessage}</p>
          </div>
        )}
      </div>

      <AnimatedArrowSpecial hovered size={12} color="#3e4140" className="absolute bottom-[9px] right-[10px] shrink-0" />
    </button>
  );
}

// Figma "TalkingBar" component (Components Library node 639:4086, the full
// multi-person chat panel that Talk_section rows live inside). The panel's
// own outline -- a rounded rect with a notch bitten out of the top-right
// corner so the channel switcher can nest into it -- traces Figma's own
// "Union" export as a stroked SVG path (see `panelPath`) rather than using
// that export as a flat background image, since the panel's height now
// tracks the real viewport and a stretched image would warp every curve.
// The message list is masked with Figma's matching fade SVG so messages
// scrolling up fade out under that notch instead of hard-clipping. The
// channel switch (all-chat vs. private) is wired to real state that
// actually swaps the rendered message list, not just a static screenshot
// of "all" selected with the switch as inert decoration.
export default function TalkingBar({ messages, friends, simulatedMessages = [] }: TalkingBarProps) {
  const clipId = useId();
  const [channel, setChannel] = useState<Channel>("all");
  const [liveMessages, setLiveMessages] = useState(messages);
  // Which friend's thread is open, if any -- null means "私人訊息" is
  // showing the friend list itself (node 754:9317), not a conversation.
  // Persists across switching to "all" and back rather than resetting, so
  // tabbing away from a conversation and back doesn't lose your place.
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const selectedFriend = channel === "private" ? (friends.find((f) => f.id === selectedFriendId) ?? null) : null;
  const showFriendList = channel === "private" && !selectedFriend;
  const activeMessages = channel === "all" ? liveMessages : (selectedFriend?.messages ?? NO_MESSAGES);
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
  }, [activeMessages, showFriendList, friends, trackHeight]);

  return (
    <div className="relative w-[275px] shrink-0" style={{ height: panelHeight }}>
      {/* What used to read as "the border/notch disappeared" is contrast:
          `border-[#f4f4f4]` + `bg-white/50` was designed as backdrop-blur
          over vivid hero art, and is nearly invisible once this panel
          extends down over the page's own plain white/light sections (Win
          List, Business) with nothing colorful behind it to blur. */}
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        style={{ backdropFilter: "blur(10px)" }}
        viewBox={`0 0 275 ${panelHeight}`}
        preserveAspectRatio="none"
      >
        {/* Fill and stroke are two separate paths sharing the same `d`, not
            one path with both attributes set. A single path's stroke
            straddles the outline (half inside, half outside) -- the inside
            half sits on top of this same element's own semi-transparent
            fill and blends with it, while the outside half doesn't, so the
            line reads as a different effective thickness/opacity depending
            on how much of each half a given stretch of curve exposes. Two
            paths keep the stroke's own rendering independent of the fill
            underneath it.

            SVG has no native "inside" stroke alignment, so the stroke path
            draws at DOUBLE width (4) and gets clipped to its own outline --
            clip-path keeps only the half that falls inside the shape,
            discarding the half that would've drawn outside it. That outer
            half was the actual source of the "thicker on curves, thinner
            on straight edges" look: it's the part liable to fall across
            whatever sits just past this panel's own edge (neighboring
            elements, the panel's own container boundary), so how much of
            it actually stayed visible varied with local geometry. An
            inside-only stroke never has an outer half to lose, so all 2px
            of it reads the same everywhere without needing a shadow to
            compensate. */}
        <path d={panelPath(panelHeight)} fill="white" fillOpacity={0.5} />
        <defs>
          <clipPath id={clipId}>
            <path d={panelPath(panelHeight)} />
          </clipPath>
        </defs>
        <path d={panelPath(panelHeight)} fill="none" stroke="#f4f4f4" strokeWidth={4} clipPath={`url(#${clipId})`} />
      </svg>

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
        {showFriendList
          ? friends.map((friend) => <FriendCard key={friend.id} friend={friend} onClick={() => setSelectedFriendId(friend.id)} />)
          : activeMessages.map((message, i) => <TalkSection key={i} {...message} />)}
      </div>

      <div
        className="pointer-events-none absolute right-0 w-[2px] rounded-full bg-[#23f3d5]"
        style={{ top: 125 + thumb.top, height: thumb.height }}
      />

      {/* Own avatar (Components Library node 754:9317/998:10020's own
          "AvatarMassage", always online -- it's you) sits here while
          browsing the friend list; picking a friend swaps it for a back
          button in the exact same spot so entering/leaving a thread never
          shifts the message list's own carefully-tuned top/height math
          below. Neither design shows a back affordance at all (Figma's
          own mockup has no route to return once a friend's opened), so
          reusing this fixed slot -- rather than adding a new header row
          that would need its own space carved out of the panel -- was the
          smallest way to make the flow actually navigable both ways. */}
      {channel === "private" &&
        (selectedFriend ? (
          <button
            type="button"
            aria-label="返回好友列表"
            onClick={() => setSelectedFriendId(null)}
            className="absolute left-[30px] top-[20px] flex size-[45px] items-center justify-center rounded-full bg-[#3e4140]"
          >
            <img alt="" src={withBasePath("/assets/sidebar/back-arrow.svg")} className="size-[20px]" />
          </button>
        ) : (
          <div className="absolute left-[30px] top-[20px]">
            <Avatar photo={withBasePath("/assets/talk-section/avatar-jessica.png")} size={45} badge={false} ringColor="#01fab0" />
            <div className="absolute bottom-0 right-0 size-[11px] rounded-full border-2 border-white" style={{ background: STATUS_DOT_COLOR.online }} />
          </div>
        ))}

      {showFriendList && (
        <button
          type="button"
          aria-label="新增好友"
          className="absolute bottom-[20px] right-[20px] flex size-[45px] items-center justify-center rounded-full bg-[#3e4140]"
        >
          <img alt="" src={withBasePath("/assets/talk-section/icon-add-friend.svg")} className="size-[15px]" />
        </button>
      )}

      {!showFriendList && (
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
      )}

      <div className="absolute right-0 top-0 flex h-[65px] w-[136px] items-center justify-between overflow-hidden rounded-full border-2 border-[#f4f4f4] bg-[#f4f4f4]/50 backdrop-blur-[15px]">
        <ChannelButton active={channel === "all"} icon="/assets/talk-section/message-all.svg" onClick={() => setChannel("all")} label="群組聊天" />
        <ChannelButton active={channel === "private"} icon="/assets/talk-section/message-private.svg" onClick={() => setChannel("private")} label="私人訊息" />
      </div>
    </div>
  );
}
