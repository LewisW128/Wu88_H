"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextValue = {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// No real auth system exists yet (see TopUp/LoginPopup's own comments) --
// this is just enough shared state for the "logged in" look to survive a
// client-side navigation between pages. Living in the root layout (which
// Next.js keeps mounted across route changes, unlike each page's own tree)
// is what makes that work: TopUp used to hold `loggedIn` as its own local
// useState, which reset back to guest every time navigating to a different
// page created a fresh TopUp instance -- e.g. clicking the logged-in
// avatar to go to /profile landed there still showing the guest icon,
// since /profile's own TopUp had never been told a login happened.
//
// Also persisted to localStorage (not just the in-memory Context above)
// so a real browser reload -- not just a client-side navigation -- stays
// logged in too, matching every other piece of mock state this project
// persists the same way (Day Rewards' own claimed days, etc.) instead of
// silently reverting to guest the moment the page actually reloads.
const LOGGED_IN_STORAGE_KEY = "wu88-logged-in";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedInState] = useState(false);

  useEffect(() => {
    // Same SSR-safety reasoning as this project's other localStorage-
    // backed state (Day Rewards, TalkingBar's friend selection): default
    // to guest on both the server render and the first client render so
    // there's nothing to hydration-mismatch, then correct from
    // localStorage once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem(LOGGED_IN_STORAGE_KEY) === "1") setLoggedInState(true);
  }, []);

  function setLoggedIn(next: boolean) {
    setLoggedInState(next);
    localStorage.setItem(LOGGED_IN_STORAGE_KEY, next ? "1" : "0");
  }

  return <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
