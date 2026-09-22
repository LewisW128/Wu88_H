/** Design-px upward pan when rewards hero switches to close-up framing. */
export const CLOSE_UP_PAN_SHIFT = 110;

/** Legacy in-component pan (RewardsCenterContent) before soften — used to scale live `top`. */
export const CLOSE_UP_PAN_SHIFT_LEGACY = 257;

/** Close-up pan CSS transition duration (ms). Longer + eased = less of a jump. */
export const CLOSE_UP_PAN_DURATION_MS = 1800;

/** CSS timing function for the close-up `top` pan (ease-in-out, not linear). */
export const CLOSE_UP_PAN_EASING = "cubic-bezier(0.45, 0, 0.55, 1)";
