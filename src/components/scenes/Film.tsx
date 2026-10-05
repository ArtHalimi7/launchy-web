"use client";

import { m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

import { FILM } from "@/content";
import { FILM_STEPS } from "@/lib/media";

/** Where each step's photo starts, scattered, before it lands in its frame: x/y in % of a frame, degrees. */
const SCATTER = [
  { x: -38, y: -14, r: -11 },
  { x: -14, y: 30, r: 7 },
  { x: 6, y: -18, r: -5 },
  { x: 18, y: 28, r: 9 },
  { x: 36, y: -12, r: -7 },
];
const CLIP_SECONDS = [3, 5, 7, 7, 8];

/**
 * Scene 04, film: a real DIY project's five step photos, scattered like a shoot's loose takes, fly
 * into a film strip as you scroll; then the strip closes up into one cut and a playhead runs across
 * it. Thirty seconds of video, made of five short shots.
 */
export function Film() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const strip = useTransform(p, [0.42, 0.56], [0, 1]);
  const gap = useTransform(p, [0.56, 0.68], ["3%", "0.4%"]);
  const head = useTransform(p, [0.68, 0.96], ["0%", "100%"]);
  const headOn = useTransform(p, [0.66, 0.7], [0, 1]);
  const tc = useRef<HTMLSpanElement>(null);
  const total = CLIP_SECONDS.reduce((a, b) => a + b, 0);
  useMotionValueEvent(p, "change", (v) => {
    const s = Math.round(Math.min(1, Math.max(0, (v - 0.68) / 0.28)) * total);
    if (tc.current) tc.current.textContent = `00:${String(s).padStart(2, "0")} / 00:${total}`;
  });

  return (
    <section ref={ref} data-scene="3" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-[6vh] overflow-hidden px-5 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.6rem,7vw,7rem)] font-extrabold leading-[0.9] tracking-tight2">
            {FILM.title}
            <br />
            <span className="font-serif font-normal italic tracking-[-0.02em] text-fog">{FILM.accent}</span>
          </h2>
          <p className="max-w-[34ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.45] text-fog">{FILM.body}</p>
        </div>

        <div className="relative mx-auto w-full max-w-[1180px]">
          <m.div style={{ opacity: strip }} className="absolute -inset-x-[1.5%] -inset-y-[9%] rounded-[6px] bg-[#141518]">
            <div className="absolute inset-x-0 top-[3%] h-[4px]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #f2efe8 0 7px, transparent 7px 16px)", opacity: 0.55 }} />
            <div className="absolute inset-x-0 bottom-[3%] h-[4px]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #f2efe8 0 7px, transparent 7px 16px)", opacity: 0.55 }} />
          </m.div>
          <m.div style={{ gap }} className="relative flex">
            {FILM_STEPS.map((src, i) => (
              <Frame key={i} src={src} i={i} p={p} />
            ))}
          </m.div>
          <m.div style={{ left: head, opacity: headOn }} className="absolute -bottom-[13%] -top-[13%] w-[2px] -translate-x-1/2 bg-ember">
            <span className="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full bg-ember" />
          </m.div>
        </div>

        <div className="mx-auto flex w-full max-w-[1180px] justify-between">
          <div className="label hidden gap-[2.2vw] text-ash md:flex">
            {FILM.steps.map((s, i) => (
              <span key={s}>
                <span className="text-ember">0{i + 1}</span> {s} · {CLIP_SECONDS[i]}s
              </span>
            ))}
          </div>
          <span ref={tc} className="label tabular-nums text-cream">
            00:00 / 00:{total}
          </span>
        </div>
      </div>
    </section>
  );
}

function Frame({ src, i, p }: { src: StaticImageData; i: number; p: MotionValue<number> }) {
  const s = SCATTER[i];
  // Each photo lands a moment after the one before it.
  const from = 0.04 + i * 0.05;
  const to = from + 0.3;
  const x = useTransform(p, [from, to], [`${s.x}%`, "0%"]);
  const y = useTransform(p, [from, to], [`${s.y}%`, "0%"]);
  const rotate = useTransform(p, [from, to], [s.r, 0]);
  const scale = useTransform(p, [from, to], [1.12, 1]);
  const radius = useTransform(p, [0.5, 0.62], [14, 2]);
  return (
    <m.div style={{ x, y, rotate, scale, borderRadius: radius }} className="relative aspect-[4/5] flex-1 overflow-hidden bg-smoke shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <Image src={src} alt={FILM.steps[i]} fill sizes="(min-width: 768px) 22vw, 19vw" className="object-cover" />
      <span className="label absolute left-[6%] top-[5%] text-[9px] text-cream/90">0{i + 1}</span>
    </m.div>
  );
}
