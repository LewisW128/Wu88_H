"use client";

import { createContext, useContext, useState } from "react";

type FavoritesContextValue = {
  liked: Set<string>;
  toggleLiked: (title: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// No real game catalog/backend exists yet, so a game's own `title` is used
// as its identity (ProductCard's own React `key` everywhere already
// assumes titles are unique -- the same title really is the same game
// instance reused across pages, e.g. "殭屍大戰" on both home and profile's
// own game lists, not a coincidence). Shared here (root layout, alongside
// AuthProvider) rather than living in ProductCard's own local state, so
// liking a game on one page is reflected wherever else that same title
// shows up -- most importantly /profile's own "收藏的遊戲" row, which
// filters down to just what's in this set (see ProfileContent's comment).
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  function toggleLiked(title: string) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return <FavoritesContext.Provider value={{ liked, toggleLiked }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
