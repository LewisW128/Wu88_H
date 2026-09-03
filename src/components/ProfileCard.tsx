"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import AnimatedArrowSpecial, { useArrowPulse } from "./AnimatedArrowSpecial";
import { useAuth } from "./AuthProvider";
import LoginModal from "./LoginModal";
import Switch from "./Switch";
import TwinklingDots from "./TwinklingDots";

export type ProfileCardProps =
  | { loggedIn: true; avatar: string; name: string; email: string; memberId: string }
  | { loggedIn: false };

// Figma "Frame 1304": the profile header, in two states --
// logged-in (05_WU88-H-PC-Profile-Page node 444:42438, seen live at
// 428:17332) and logged-out/guest (node 455:23386, seen live at
// 455:23317). Same avatar-with-ribbons treatment either way, but the
// info panel differs in both width and content: logged-in sits at a
// fixed 614px beside VipCard (614+614+20 gap = this page's usual 1249px
// content width -- VipCard doesn't exist for a guest, so there's nothing
// to share the row with), and shows the real name/email/ID; logged-out
// spans the full row width and shows 註冊/登入 buttons instead (per a
// Figma update -- was 登錄, now matches the "登入" label TopUp/LoginPopup
// already use everywhere else; also picked up the asymmetric
// bl/br/tr-[20px] pill shape those buttons already use, replacing this
// card's own stale uniform rounded-[15px]), with both privacy toggles
// rendered `disabled` (there's nothing to toggle before you've logged
// in). "登入" opens the same LoginModal TopUp's own guest button does --
// there's no reason this card's own button should be inert when a real
// login flow already exists. The avatar itself swaps a real cropped photo
// for a generic person-outline icon centered in the same mask shape.
//
// Paint order matters and mirrors Figma's own layer order exactly: the
// info panel is painted first, then the avatar on top of it (so the
// avatar visually covers the panel's own left portion instead of the
// panel's white fill showing through), then the two ribbons on top of
// both (so they read as decoration cutting across the photo, not
// underneath it).
//
// The avatar's dot-cluster decoration reuses TwinklingDots -- the same
// animated component the home hero uses -- scaled down to this card's own
// ~226x216 box via a plain CSS size override on its SVG, rather than a
// second static digital-dots asset (per the user's own call to reuse the
// hero's version here instead of re-exporting a new one). Positioned at
// left-[95px] (not the ~-18px it briefly drifted to) to match Figma's own
// `calc(50% - 26.63px)` against this box's 243.268px width -- confirmed
// identical in both the logged-in and guest Figma refs, so it's one
// shared position rather than something that needs to branch per state.
//
// The three ribbon streaks are the same path geometry either way, but
// Figma recolors them from teal to gray for the guest state (small:
// #3E4140 @ 50% opacity, medium: solid #3E4140, large: solid #BFBFBF vs.
// the logged-in teal #23F3D5 fills) -- hence the separate *-guest.svg
// assets swapped in below instead of a single shared file.
export default function ProfileCard(props: ProfileCardProps) {
  const [hideProfile, setHideProfile] = useState(false);
  const [hideNickname, setHideNickname] = useState(false);
  const { setLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const registerArrow = useArrowPulse();
  const loginArrow = useArrowPulse();

  return (
    <div className={`relative h-[303px] overflow-hidden rounded-[25px] bg-white ${props.loggedIn ? "flex-1" : "w-full"}`}>
      <div className="absolute left-0 right-0 top-[67px] h-[236px] overflow-hidden rounded-[25px] border border-[#f4f4f4] bg-white">
        <img
          alt=""
          src={withBasePath(props.loggedIn ? "/assets/profile/ribbon-small.svg" : "/assets/profile/ribbon-small-guest.svg")}
          className="absolute left-[190px] top-[119px] h-[59px] w-[80px]"
        />

        {props.loggedIn ? (
          <div className="absolute left-[319px] top-[19px] flex flex-col items-start">
            <div className="flex items-center gap-[5px]">
              <img alt="" src={withBasePath("/assets/profile/verified-check.svg")} className="size-[8.133px]" />
              <p className="whitespace-nowrap text-[20px] font-bold leading-[32px] tracking-[0.35px] text-[#3e4140]">{props.name}</p>
            </div>
            <p className="whitespace-nowrap text-[14px] leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{props.email}</p>
            <p className="whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">ID {props.memberId}</p>
          </div>
        ) : (
          <div className="absolute left-[944px] top-[19px] flex items-center gap-[20px]">
            <button
              type="button"
              onMouseEnter={registerArrow.pulse}
              className="flex h-[40px] w-[127px] items-center justify-between overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#8d54d8] px-[15px] py-[10px]"
            >
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-white">註冊</span>
              <AnimatedArrowSpecial hovered={registerArrow.hovered} size={25} color="white" />
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              onMouseEnter={loginArrow.pulse}
              className="flex h-[40px] w-[127px] items-center justify-between overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] bg-[#23f3d5] px-[15px] py-[10px]"
            >
              <span className="whitespace-nowrap text-[12px] font-bold leading-[18px] tracking-[0.15px] text-[#3e4140]">登入</span>
              <AnimatedArrowSpecial hovered={loginArrow.hovered} size={25} color="#3e4140" />
            </button>
          </div>
        )}

        <div className="absolute left-[318px] right-[19px] top-[109px] h-px bg-[#f4f4f4]" />

        {props.loggedIn && (
          <button type="button" aria-label="edit profile" className="absolute right-[19px] top-[46px] size-[25px]">
            <img alt="" src={withBasePath("/assets/profile/edit-icon.svg")} className="size-full" />
          </button>
        )}

        <div className="absolute right-[19px] top-[130px] flex w-[275px] items-center justify-between">
          <p className="w-[73px] text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">隱藏個人資料</p>
          <Switch checked={hideProfile} onChange={setHideProfile} disabled={!props.loggedIn} />
        </div>
        <div className="absolute right-[19px] top-[173px] flex w-[275px] items-center justify-between">
          <p className="w-[73px] text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">隱藏暱稱</p>
          <Switch checked={hideNickname} onChange={setHideNickname} disabled={!props.loggedIn} />
        </div>
      </div>

      <div className="absolute left-0 top-[-18px] h-[402.797px] w-[243.268px] overflow-hidden">
        {props.loggedIn ? (
          <div
            className="absolute left-[-30px] top-[13px] h-[316px] w-[235px]"
            style={{ maskImage: `url("${withBasePath("/assets/profile/avatar-mask.svg")}")`, maskSize: "100% 100%", maskRepeat: "no-repeat" }}
          >
            <img alt="" src={props.avatar} className="pointer-events-none absolute inset-0 size-full object-cover" />
          </div>
        ) : (
          <div
            className="absolute left-[-18px] top-0 size-[297px] overflow-hidden"
            style={{ maskImage: `url("${withBasePath("/assets/profile/avatar-mask.svg")}")`, maskSize: "100% 100%", maskRepeat: "no-repeat" }}
          >
            <img alt="" src={withBasePath("/assets/profile/guest-avatar-icon.svg")} className="pointer-events-none absolute inset-[7.7%_7.5%]" />
          </div>
        )}
        <TwinklingDots className="pointer-events-none absolute left-[95px] top-[93.19px] h-[215.53px] w-[226px]" />
      </div>

      <img
        alt=""
        src={withBasePath(props.loggedIn ? "/assets/profile/ribbon-medium.svg" : "/assets/profile/ribbon-medium-guest.svg")}
        className="absolute left-[-76px] top-[218px] h-[121px] w-[163px]"
      />
      <img
        alt=""
        src={withBasePath(props.loggedIn ? "/assets/profile/ribbon-large.svg" : "/assets/profile/ribbon-large-guest.svg")}
        className="absolute left-[8px] top-[220px] h-[223px] w-[299px]"
      />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={() => { setLoggedIn(true); setShowLogin(false); }} />}
    </div>
  );
}
