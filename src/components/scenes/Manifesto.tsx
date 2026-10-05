"use client";

import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { Dome } from "@/components/Dome";
import { MANIFESTO } from "@/content";

/**
 * Scene 02, the idea: one sentence, held on screen while you scroll, its words lighting up one
 * after another. The cream curtain rises with a domed edge, as Backbone's scenes do.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = MANIFESTO.lines.flat();
  const after = useTransform(scrollYProgress, [0.72, 0.86], [0, 1]);
  const afterY = useTransform(scrollYProgress, [0.72, 0.86], [18, 0]);

  // Where each line's words start in the sentence, so every word knows its turn.
  const starts = MANIFESTO.lines.map((_, li) => MANIFESTO.lines.slice(0, li).flat().length);
  return (
    <section ref={ref} data-scene="1" className="relative h-[260vh] bg-cream text-ink">
      <Dome />
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-5 md:px-10">
        <h2 className="max-w-[14ch] text-[clamp(3rem,9.4vw,10rem)] font-extrabold leading-[0.9] tracking-crush">
          {MANIFESTO.lines.map((line, li) => (
            <span key={li} className="block">
              {line.map((word, wi) => {
                const i = starts[li] + wi;
                const accent = li === MANIFESTO.lines.length - 1;
                return (
                  <Word key={`${li}-${word}`} progress={scrollYProgress} at={i / words.length} accent={accent}>
                    {word}
                  </Word>
                );
              })}
            </span>
          ))}
        </h2>
        <m.p style={{ opacity: after, y: afterY }} className="mt-10 max-w-[36ch] text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium leading-[1.3] tracking-[-0.015em] text-ink/70">
          {MANIFESTO.after}
        </m.p>
      </div>
    </section>
  );
}

/** One word: faint until the scroll reaches it, then full ink (the second line in serif italic). */
function Word({ progress, at, accent, children }: { progress: MotionValue<number>; at: number; accent: boolean; children: string }) {
  const start = 0.04 + at * 0.62;
  const opacity = useTransform(progress, [start, start + 0.08], [0.14, 1]);
  return (
    <m.span style={{ opacity }} className={`mr-[0.22em] inline-block ${accent ? "font-serif font-normal italic tracking-[-0.02em]" : ""}`}>
      {children}
    </m.span>
  );
}
