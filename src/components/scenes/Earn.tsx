"use client";

import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { EARN } from "@/content";

/** A video's month, as the Insights tab draws it: the burst when it goes out, the long tail after. */
const CURVE = "M0,182 C70,180 110,176 150,170 C175,166 186,96 214,58 C238,30 262,72 300,96 C350,128 400,132 470,138 C540,144 590,118 630,92 C660,72 690,104 740,112 C820,126 900,104 1000,70";

const BIG = "text-[clamp(5.5rem,25vw,18rem)] font-extrabold leading-[0.8] tracking-crush";

/**
 * Scene 06, earn: as you scroll, the app's Insights line draws itself edge to edge and the huge
 * outlined words fill with ember behind it. What a creator gets, said plainly; no share, no figures.
 */
export function Earn() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const draw = useTransform(p, [0.08, 0.7], [0, 1]);
  const fill = useTransform(p, [0.15, 0.75], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const words = useTransform(p, [0.62, 0.8], [0, 1]);
  const wordsY = useTransform(p, [0.62, 0.8], [20, 0]);
  const area = useTransform(draw, [0.6, 1], [0, 0.08]);

  const lines = EARN.big.map((w, i) => (
    <span key={w} className="block">
      {i === EARN.big.length - 1 ? w.replace(".", "") : w}
      {i === EARN.big.length - 1 ? <span className="text-ember">.</span> : null}
    </span>
  ));

  return (
    <section ref={ref} data-scene="5" className="relative h-[230vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="relative px-5 md:px-10">
          <p aria-hidden className={`${BIG} text-transparent [-webkit-text-stroke:2px_rgba(242,239,232,0.28)]`}>
            {lines}
          </p>
          <m.p aria-hidden style={{ clipPath: fill }} className={`${BIG} absolute left-5 top-0 text-ember md:left-10`}>
            {EARN.big.map((w) => (
              <span key={w} className="block">
                {w}
              </span>
            ))}
          </m.p>
        </div>

        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="mt-[3vh] h-[clamp(90px,16vh,180px)] w-full" aria-hidden>
          <m.path d={`${CURVE} L1000,200 L0,200 Z`} fill="#FF5A1F" style={{ opacity: area }} />
          <line x1="0" x2="1000" y1="199.5" y2="199.5" stroke="rgba(242,239,232,0.12)" vectorEffect="non-scaling-stroke" />
          <m.path d={CURVE} fill="none" stroke="#FF5A1F" strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ pathLength: draw }} />
        </svg>

        <m.div style={{ opacity: words, y: wordsY }} className="mt-[4vh] flex flex-col gap-3 px-5 md:flex-row md:items-end md:justify-between md:px-10">
          <h2 className="text-[clamp(2.2rem,5vw,4.6rem)] font-extrabold leading-[0.92] tracking-tight2">
            <span className="sr-only">Every view. </span>
            {EARN.title.replace(".", "")}
            <span className="text-ember">.</span>
          </h2>
          <p className="max-w-[30ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.4] text-fog">{EARN.body}</p>
        </m.div>
      </div>
    </section>
  );
}
