"use client";

import { createContext, useContext, useState } from "react";

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
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  return <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
