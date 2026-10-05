"use client";

import "lenis/dist/lenis.css";

import { ReactLenis } from "lenis/react";
import { domAnimation, LazyMotion, MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Motion loads only the features the site uses (LazyMotion + `m`), and respects the visitor's
 * reduced-motion setting everywhere. Lenis smooths the wheel, nothing else: scrolling stays native,
 * so the sticky scenes and the scroll-linked values all read the real scroll position.
 */
export function Providers({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {reduce ? null : <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 }} />}
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
