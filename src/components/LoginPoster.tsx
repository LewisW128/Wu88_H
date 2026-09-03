"use client";

import { useState } from "react";
import { withBasePath } from "../lib/asset";

// Figma "loggin poster" (00_WU88-H-COMPONENTS LIBRARY node 951:10157): the
// three-character collage used on the login flow. Figma builds each girl
// from a raw AI still clipped by a CSS mask-image (sometimes two, stacked)
// to get its own diagonal-cut silhouette -- skipped here in favor of the
// already-cutout PNGs the user supplied directly (main-girl/basketball-
// girl/football-girl.webp), which already have that exact silhouette
// baked into their own alpha channel. Same simplification this project
// already leans on elsewhere (pre-cutout hero photos) -- just sourced from
// provided files instead of a fresh Kling/background-removal pass.
//
// One Figma layer ("ChatGPT Image...2", opacity-25, no fill and no image)
// is dropped entirely -- an empty div with nothing to paint, dead weight
// in the original file.
//
// Each layer drifts a little with the cursor for a soft parallax feel --
// per request, NOT glued 1:1 to the pointer. Two things keep it subtle:
// the offsets themselves are small (a handful of px at most, scaled by
// each layer's own DEPTH below) and every layer eases toward its target
// on a real CSS transition instead of jumping straight there, so it reads
// as gently trailing the cursor rather than tracking it directly.
// Every layer gets its own distinct depth (no two share a value) spread
// across a wide range, so the front-to-back separation actually reads
// while moving instead of the whole poster nudging as one flat sheet.
// Foreground-reading elements (both dice, the chip, front_item) sit at
// the top of the range; the background gradient stripe barely moves.
// die2 is the one exception to "closer looks bigger": it's Figma's own
// blurred/out-of-focus die, so a LOW depth (reads as far away, like
// camera depth-of-field) makes more visual sense than a high one despite
// sitting visually in front of the background layers.
const DEPTH = {
  bg: 3,
  medal: 5,
  beam: 7,
  die2: 6,
  main: 12,
  football: 16,
  basketball: 20,
  chip: 24,
  front: 28,
  die1: 32,
} as const;

export default function LoginPoster({ className }: { className?: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 }); // each in [-0.5, 0.5]

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  function layerStyle(depth: number): React.CSSProperties {
    return {
      transform: `translate3d(${tilt.x * depth}px, ${tilt.y * depth}px, 0)`,
      transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
    };
  }

  return (
    <div
      className={className || "relative h-[630.898px] w-[488px] overflow-hidden"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* bg-item.svg and medal-bg-item.svg both shipped with a `viewBox`
          smaller than their own `<path>`'s real bounding box (a Figma
          export quirk on rotated/skewed shapes) -- stretching that
          already-cropped little window up to Figma's own reported
          785.657x743.296 layer size made the gradient band render
          blown-up and soft instead of crisp. Fixed by correcting each
          SVG's own viewBox to match its path's true extent, so it needs
          no stretch at all here. */}
      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.bg)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-poster/bg-item.svg")}
          className="absolute left-[130px] top-[-235px] h-[780px] w-[825px]"
        />
      </div>

      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.chip)}>
        <div className="absolute left-[296px] top-[36.05px] flex h-[275px] w-[206px] items-center justify-center">
          <div className="h-[275px] w-[206px]" style={{ transform: "rotate(180deg) scaleY(-1)" }}>
            <img alt="" src={withBasePath("/item/loggin-poster/chip.webp")} className="size-full object-cover" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.medal)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-poster/medal-bg-item.svg")}
          className="absolute right-[107px] top-[358.05px] h-[343px] w-[361px]"
        />
      </div>

      {/* Light beam: Figma's own raw fill, reproduced as a real CSS
          gradient (same approach used for every other flattened-gradient
          fill in this project) rather than a shipped raster. */}
      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.beam)}>
        <div className="absolute left-[63.1px] top-[168.72px] flex size-[775.813px] items-center justify-center">
          <div
            className="h-[439.323px] w-[657.842px] -rotate-45"
            style={{ backgroundImage: "linear-gradient(185.42979600242478deg, rgba(255, 255, 255, 0) 6.2299%, rgb(255, 255, 255) 40.207%)" }}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.die2)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-poster/die-2.webp")}
          className="absolute left-[28px] top-[75.05px] h-[142px] w-[106px] blur-[2px]"
        />
      </div>

      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.main)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-poster/main-girl.webp")}
          className="absolute left-[78px] top-[-11px] h-[568px] w-[424px] object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.basketball)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-poster/basketball-girl.webp")}
          className="absolute left-0 top-[195px] h-[448px] w-[354px] object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.football)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-poster/football-girl.webp")}
          className="absolute left-[171px] top-[175px] h-[396px] w-[354px] object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.front)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-poster/front-item.webp")}
          className="absolute bottom-[89.85px] right-0 h-[168px] w-[176px]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0" style={layerStyle(DEPTH.die1)}>
        <img
          alt=""
          src={withBasePath("/item/loggin-poster/die-1.webp")}
          className="absolute left-[234px] top-[373.05px] h-[304px] w-[228px] object-cover"
        />
      </div>
    </div>
  );
}
