"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import { ChallengeStage, CookStage, DiyStage, ReactStage } from "@/components/formats";
import { FORMATS } from "@/content";
import { EXPO } from "@/lib/motion";

/**
 * Scene 03, pick: the four formats, held on screen while you scroll through them, one beat each.
 * The words change on the left; on the right, each format's own scene from the app comes in from
 * below and settles. The last beat draws the challenge's circles as you go.
 */
export function Pick() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [beat, setBeat] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(FORMATS.length - 1, Math.floor(v * FORMATS.length));
    setBeat((b) => (b === next ? b : next));
  });
  // The fourth beat runs from 0.75 to 1: the circles draw across most of it.
  const draw = useTransform(scrollYProgress, [0.76, 0.97], [0, 1]);
  const format = FORMATS[beat];

  const stages = [<ReactStage key="r" />, <DiyStage key="d" />, <CookStage key="c" />, <ChallengeStage key="ch" draw={draw} />];

  return (
    <section ref={ref} id="pick" data-scene="2" className="relative h-[480vh]">
      <div className="sticky top-0 grid h-[100svh] grid-rows-[auto_1fr] gap-6 px-5 pb-16 pt-20 md:grid-cols-[1fr_1.05fr] md:grid-rows-1 md:items-center md:gap-14 md:px-10 md:py-0">
        <div className="md:max-w-[34rem]">
          <div className="label flex items-center gap-3 text-ash">
            <span className="tabular-nums text-cream">0{beat + 1}</span>
            <span className="h-px w-8 bg-ash/50" />
            <span className="tabular-nums">0{FORMATS.length}</span>
            <span className="ml-2">Pick a format</span>
          </div>
          <div className="relative mt-5 min-h-[9.5rem] md:mt-8 md:min-h-[17rem]">
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={format.id} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: EXPO }}>
                <p className="label text-ember">{format.kicker}</p>
                <h2 className="mt-3 text-[clamp(2.4rem,6vw,5.6rem)] font-extrabold leading-[0.92] tracking-tight2">{format.title}</h2>
                <p className="mt-4 max-w-[30ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.4] text-fog">{format.body}</p>
              </m.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 hidden gap-2 md:flex" aria-hidden>
            {FORMATS.map((f, i) => (
              <span key={f.id} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i === beat ? "bg-ember" : i < beat ? "bg-cream/40" : "bg-cream/12"}`} />
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] h-full max-h-[min(76svh,46rem)] w-auto max-w-full self-center">
          {stages.map((stage, i) => (
            <m.div
              key={i}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === beat ? 1 : 0, y: i === beat ? 0 : i < beat ? -40 : 60, scale: i === beat ? 1 : 0.94, rotate: i === beat ? 0 : i < beat ? -2 : 2 }}
              transition={{ duration: 0.8, ease: EXPO }}
              aria-hidden={i !== beat}>
              {stage}
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
