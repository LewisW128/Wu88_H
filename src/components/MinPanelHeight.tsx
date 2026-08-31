"use client";

import { useMinPanelHeight } from "./ScaleToFit";

// See `useMinPanelHeight`'s own comment: guarantees the wrapped container
// (the grid holding Sidebar/content/Talking_Bar) is always at least as
// tall as Talking_Bar's own viewport-driven height, so its `sticky
// top-[58px]` offset has room to apply even on pages whose real content
// is short.
export default function MinPanelHeight({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const minHeight = useMinPanelHeight();
  return (
    <div className={className} style={minHeight ? { ...style, minHeight } : style}>
      {children}
    </div>
  );
}
