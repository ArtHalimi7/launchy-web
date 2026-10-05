"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";

import { Wordmark } from "@/components/Wordmark";
import { markOpened, QUART, useOpened } from "@/lib/motion";

const WRITE = 1.15;
const HOLD = 0.35;

/**
 * The opening: black, the logo writes itself, then the black lifts off the page like a curtain.
 * About two seconds, once per visit (the inline script in the layout skips it on a return visit and
 * for reduced motion, before it ever paints). The page underneath is already there: nothing waits on it.
 */
export function Opening() {
  const [lift, setLift] = useState(false);
  // Already opened this visit (or skipped): nothing to show, and nothing to wait for.
  const opened = useOpened();

  useEffect(() => {
    if (document.documentElement.dataset.opened === "1") return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const t = setTimeout(() => setLift(true), (0.2 + WRITE + HOLD) * 1000);
    return () => {
      clearTimeout(t);
      root.style.overflow = "";
    };
  }, []);

  if (opened) return null;
  return (
    <m.div
      className="opening fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      initial={false}
      animate={lift ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.85, ease: QUART }}
      onAnimationComplete={() => {
        if (!lift) return;
        document.documentElement.style.overflow = "";
        markOpened();
      }}
      aria-hidden>
      <Wordmark write delay={0.2} duration={WRITE} className="w-[min(64vw,460px)]" />
      <div className="label absolute bottom-8 flex items-center gap-2 text-ash">
        <span className="blink inline-block size-1.5 rounded-full bg-ember" />
        Rolling
      </div>
    </m.div>
  );
}
