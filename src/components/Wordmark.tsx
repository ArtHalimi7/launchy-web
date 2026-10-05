"use client";

import { m } from "motion/react";
import { useId } from "react";

import { WORDMARK } from "@/lib/brand-paths";
import { EXPO } from "@/lib/motion";

/**
 * The script "launchy." As in the app's loader, it can write itself: the pen runs along the
 * measured centreline of the letters (`stroke`), clipped to the artwork's exact outline, so what
 * appears is the real logo, stroke by stroke. Then the full stop lands.
 */
export function Wordmark({
  write = false,
  show = true,
  delay = 0,
  duration = 1.25,
  ink = "#ff5a1f",
  dot = "#f2efe8",
  className,
  title = "Launchy",
}: {
  /** Draw it in (true), or show it finished. */
  write?: boolean;
  /** With `write`: hold it unwritten until this turns true (it comes into view, say). */
  show?: boolean;
  delay?: number;
  duration?: number;
  ink?: string;
  dot?: string;
  className?: string;
  title?: string;
}) {
  const clip = useId().replace(/:/g, "");
  const { w, h, outline, stroke, strokeWidth, dot: stop } = WORDMARK;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label={title}>
      <defs>
        <clipPath id={clip}>
          <path d={outline} clipRule="evenodd" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <m.path
          d={stroke}
          fill="none"
          stroke={ink}
          strokeWidth={strokeWidth * 1.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={write ? { pathLength: 0 } : false}
          animate={{ pathLength: show ? 1 : 0 }}
          transition={{ duration, delay, ease: [0.45, 0.05, 0.25, 1] }}
        />
      </g>
      <m.circle
        cx={stop.cx}
        cy={stop.cy}
        r={stop.r}
        fill={dot}
        initial={write ? { scale: 0, opacity: 0 } : false}
        animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: write ? delay + duration - 0.05 : 0, ease: EXPO }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
