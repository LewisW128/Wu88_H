"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";
import Switch from "./Switch";
import TwinklingDots from "./TwinklingDots";

export type ProfileCardProps = {
  avatar: string;
  name: string;
  email: string;
  memberId: string;
};

// Figma "Frame 1304" (05_WU88-H-PC-Profile-Page node 444:42438, seen live
// on the page at 428:17332): the profile header's left half -- a bordered
// info panel (name + verified checkmark, email, member ID, an edit
// button, and two privacy toggles) with an avatar photo bleeding out over
// its own left edge, cut across by two diagonal teal ribbons. Sits beside
// VipCard as a flex-1 pair (614px + 614px + a 20px gap = this page's usual
// 1249px content width), not a fixed px card.
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
// hero's version here instead of re-exporting a new one).
export default function ProfileCard({ avatar, name, email, memberId }: ProfileCardProps) {
  const [hideProfile, setHideProfile] = useState(false);
  const [hideNickname, setHideNickname] = useState(false);

  return (
    <div className="relative h-[303px] flex-1 overflow-hidden rounded-[25px] bg-white">
      <div className="absolute left-0 top-[67px] h-[236px] w-[614px] overflow-hidden rounded-[25px] border border-[#f4f4f4] bg-white">
        <img alt="" src={withBasePath("/assets/profile/ribbon-small.svg")} className="absolute left-[190px] top-[119px] h-[59px] w-[80px]" />

        <div className="absolute left-[319px] top-[19px] flex flex-col items-start">
          <div className="flex items-center gap-[5px]">
            <img alt="" src={withBasePath("/assets/profile/verified-check.svg")} className="size-[8.133px]" />
            <p className="whitespace-nowrap text-[20px] font-bold leading-[32px] tracking-[0.35px] text-[#3e4140]">{name}</p>
          </div>
          <p className="whitespace-nowrap text-[14px] leading-[20px] tracking-[0.15px] text-[#a2a2a2]">{email}</p>
          <p className="whitespace-nowrap text-[10px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">ID {memberId}</p>
        </div>

        <div className="absolute left-[319px] top-[110px] h-px w-[275px] bg-[#f4f4f4]" />

        <button type="button" aria-label="edit profile" className="absolute right-[19px] top-[46px] size-[25px]">
          <img alt="" src={withBasePath("/assets/profile/edit-icon.svg")} className="size-full" />
        </button>

        <div className="absolute left-[319px] top-[130px] flex w-[275px] items-center justify-between">
          <p className="w-[73px] text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">隱藏個人資料</p>
          <Switch checked={hideProfile} onChange={setHideProfile} />
        </div>
        <div className="absolute left-[319px] top-[173px] flex w-[275px] items-center justify-between">
          <p className="w-[73px] text-[12px] leading-[18px] tracking-[0.15px] text-[#a2a2a2]">隱藏暱稱</p>
          <Switch checked={hideNickname} onChange={setHideNickname} />
        </div>
      </div>

      <div className="absolute left-0 top-[-18px] h-[402.797px] w-[243.268px] overflow-hidden">
        <div
          className="absolute left-[-30px] top-[13px] h-[316px] w-[235px]"
          style={{ maskImage: `url("${withBasePath("/assets/profile/avatar-mask.svg")}")`, maskSize: "100% 100%", maskRepeat: "no-repeat" }}
        >
          <img alt="" src={avatar} className="pointer-events-none absolute inset-0 size-full object-cover" />
        </div>
        <TwinklingDots className="pointer-events-none absolute left-[-18px] top-[93.19px] h-[215.53px] w-[226px]" />
      </div>

      <img alt="" src={withBasePath("/assets/profile/ribbon-medium.svg")} className="absolute left-[-76px] top-[218px] h-[121px] w-[163px]" />
      <img alt="" src={withBasePath("/assets/profile/ribbon-large.svg")} className="absolute left-[8px] top-[220px] h-[223px] w-[299px]" />
    </div>
  );
}
