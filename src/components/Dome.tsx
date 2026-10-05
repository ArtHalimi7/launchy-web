"use client";

import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Backbone's domed edge, on a cream scene: an ellipse of the scene's colour sits on its top edge and
 * flattens as the scene comes up. Only a transform moves, so it costs nothing to scroll.
 */
export function Dome({ color = "bg-cream" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0">
      <m.div style={{ scaleY }} className={`absolute -left-[15%] -top-[12vw] h-[24vw] w-[130%] origin-bottom rounded-[50%] ${color}`} />
    </div>
  );
}
