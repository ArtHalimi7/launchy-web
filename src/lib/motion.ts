"use client";

import { useSyncExternalStore } from "react";

/** Backbone's expo-out: fast start, long settle. The same curve the app moves on. */
export const EXPO = [0.16, 1, 0.3, 1] as const;
/** For things leaving: a quart in-out. */
export const QUART = [0.76, 0, 0.24, 1] as const;

const OPENED = "launchy:opened";

/** Whether the opening has played (or was skipped), so the hero knows when to come in. */
export function useOpened() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener(OPENED, onChange);
      return () => window.removeEventListener(OPENED, onChange);
    },
    () => document.documentElement.dataset.opened === "1",
    () => false,
  );
}

export function markOpened() {
  document.documentElement.dataset.opened = "1";
  try {
    sessionStorage.setItem("launchy-opened", "1");
  } catch {
    // Private mode: it plays again next time, which is fine.
  }
  window.dispatchEvent(new Event(OPENED));
}
