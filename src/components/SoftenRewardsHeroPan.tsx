"use client";

import { useEffect } from "react";
import {
  CLOSE_UP_PAN_DURATION_MS,
  CLOSE_UP_PAN_SHIFT,
  CLOSE_UP_PAN_SHIFT_LEGACY,
} from "../lib/rewardsHeroPan";

/**
 * Softens the rewards hero close-up pan without rewriting RewardsCenterContent.tsx
 * (that file is too large for a safe GitHub MCP push). Scales the live `top`
 * displacement from the legacy 257 design-px down to CLOSE_UP_PAN_SHIFT, and
 * lengthens the transition to CLOSE_UP_PAN_DURATION_MS.
 */
export default function SoftenRewardsHeroPan() {
  useEffect(() => {
    const scale = CLOSE_UP_PAN_SHIFT / CLOSE_UP_PAN_SHIFT_LEGACY;

    function isPanLayer(el: HTMLElement) {
      return (
        el.classList.contains("absolute") &&
        el.classList.contains("inset-x-0") &&
        el.className.includes("transition-[top]")
      );
    }

    function soften(el: HTMLElement) {
      el.style.transitionDuration = `${CLOSE_UP_PAN_DURATION_MS}ms`;
      const top = el.style.top;
      if (!top || top === "0px" || top === "0") {
        delete el.dataset.rewardsPanLegacy;
        return;
      }
      const match = /^(-?[\d.]+)px$/.exec(top);
      if (!match) return;
      const px = Number(match[1]);
      if (!Number.isFinite(px) || px >= 0) {
        delete el.dataset.rewardsPanLegacy;
        return;
      }

      const mag = Math.abs(px);
      const minLegacy = CLOSE_UP_PAN_SHIFT_LEGACY * 0.2;
      const maxLegacy = CLOSE_UP_PAN_SHIFT_LEGACY * 1.2;
      if (!el.dataset.rewardsPanLegacy && mag >= minLegacy && mag <= maxLegacy) {
        el.dataset.rewardsPanLegacy = String(px);
      }
      if (!el.dataset.rewardsPanLegacy) return;

      const next = Number(el.dataset.rewardsPanLegacy) * scale;
      if (Math.abs(px - next) > 0.5) {
        el.style.top = `${next}px`;
      }
    }

    function scan(root: ParentNode = document) {
      root.querySelectorAll<HTMLElement>("div.absolute.inset-x-0").forEach((el) => {
        if (isPanLayer(el)) soften(el);
      });
    }

    scan();

    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.target instanceof HTMLElement) {
          if (isPanLayer(m.target)) soften(m.target);
        }
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n instanceof HTMLElement) {
              if (isPanLayer(n)) soften(n);
              scan(n);
            }
          });
        }
      }
    });
    obs.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    return () => obs.disconnect();
  }, []);

  return null;
}
