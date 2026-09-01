export type AnimatedArrowSpecialProps = {
  hovered: boolean;
  size?: number;
  color?: string;
  className?: string;
};

// Figma "Arrow_Special" (the diagonal "open" arrow used on every card's
// Play button, Tag, QuickLinks, etc.) is really just two paths: a corner
// bracket ("Rectangle 25", an H+V stroke forming the arrowhead) and a
// diagonal stroke ("Line 25", the shaft) -- see any of the raw
// arrow-special*.svg exports. `pathLength={1}` normalizes both paths to a
// length of 1 regardless of their real geometry, so `strokeDasharray:1` +
// animating `strokeDashoffset` 1->0 draws each one from nothing to fully
// stroked without hand-measuring pixel lengths. Corner draws first
// (0-200ms), then the shaft (200-400ms) -- requested draw order, reused
// everywhere this glyph's hover state produces it (News Banner, and the
// Play-button color swap on ProductCard/GameCard/PromotionCard, where two
// instances of this stack -- one undrawing in the rest color, one drawing
// in in the hover color -- replace what used to be an instant image swap).
export default function AnimatedArrowSpecial({ hovered, size = 27.761, color = "#3E4140", className }: AnimatedArrowSpecialProps) {
  return (
    <svg viewBox="0 0 27.7607 27.7607" width={size} height={size} fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.9457 9.02633H8.23761V18.7344"
        stroke={color}
        strokeWidth={2.22086}
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: hovered ? 0 : 1, transition: "stroke-dashoffset 200ms ease-out" }}
      />
      <path
        d="M8.36635 9.18336L17.7887 18.6057"
        stroke={color}
        strokeWidth={2.22086}
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: hovered ? 0 : 1, transition: "stroke-dashoffset 200ms ease-out 200ms" }}
      />
    </svg>
  );
}
