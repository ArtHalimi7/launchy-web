"use client";

import { IconArrowDown, IconArrowUpRight } from "@tabler/icons-react";
import { m, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";

import { APPLY_HREF, HERO } from "@/content";
import { WALL } from "@/lib/media";
import { EXPO, useOpened } from "@/lib/motion";

const ROWS = 5;

/**
 * Scene 01, rolling: what Launchy is, in five words, over a wall of what creators actually make on
 * it. The wall is the app's own (every format mixed), tilted and drifting on the compositor; the
 * words rise out of their lines once the opening has lifted.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const opened = useOpened();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const sink = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const rows = Array.from({ length: ROWS }, (_, r) => WALL.filter((_, i) => i % ROWS === r));
  const last = HERO.lines.length - 1;

  return (
    <section ref={ref} data-scene="0" id="top" className="relative h-[100svh] min-h-[600px] overflow-hidden">
      <m.div aria-hidden style={{ y: sink }} className="absolute inset-[-12%] flex -rotate-6 flex-col justify-center gap-3">
        {rows.map((row, r) => (
          <div key={r} className={`flex w-max gap-3 ${r % 2 ? "drift-reverse" : "drift"}`} style={{ "--drift": `${90 + r * 14}s` } as CSSProperties}>
            {[...row, ...row, ...row].map((tile, k) => (
              <div key={k} className="relative aspect-[3/2] h-[clamp(92px,12.5vw,200px)] shrink-0 overflow-hidden rounded-2xl bg-smoke">
                <Image src={tile.src} alt="" fill sizes="(min-width: 768px) 300px, 140px" className="object-cover" loading={r < 3 && k < 5 ? "eager" : "lazy"} />
                <span className="label absolute bottom-2 left-2 rounded-[5px] bg-ink/75 px-1.5 py-1 text-[9px] text-cream">{tile.label}</span>
              </div>
            ))}
          </div>
        ))}
      </m.div>
      {/* One flat veil, no gradient: the wall stays a texture behind the words. */}
      <div aria-hidden className="absolute inset-0 bg-ink/72" />

      <m.div style={{ y: lift, opacity: fade }} className="relative z-10 flex h-full flex-col justify-end px-5 pb-[calc(12vw+4.5rem)] md:px-10 md:pb-[calc(12vw+3rem)]">
        <m.p
          className="label text-fog"
          initial={{ opacity: 0, y: 12 }}
          animate={opened ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.05, ease: EXPO }}>
          {HERO.kicker}
        </m.p>
        <h1 className="mt-5 text-[clamp(4.1rem,13.2vw,13.5rem)] font-extrabold leading-[0.84] tracking-crush">
          {HERO.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.07em]">
              <m.span
                className="block"
                initial={{ y: "112%" }}
                animate={opened ? { y: "0%" } : undefined}
                transition={{ duration: 1.15, delay: 0.1 + i * 0.09, ease: EXPO }}>
                {line}
                {i === last ? <span className="text-ember">.</span> : null}
              </m.span>
            </span>
          ))}
        </h1>

        <m.div
          className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={opened ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.42, ease: EXPO }}>
          <p className="max-w-[24ch] text-[clamp(1.15rem,2vw,1.6rem)] font-medium leading-[1.2] tracking-[-0.02em] text-fog">{HERO.sub}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={APPLY_HREF}
              className="flex h-12 items-center gap-2 rounded-full bg-ember pl-6 pr-5 font-semibold tracking-[-0.01em] text-ink transition-transform duration-300 ease-expo hover:scale-[1.04]">
              {HERO.apply}
              <IconArrowUpRight size={18} stroke={2.4} aria-hidden />
            </a>
            <a
              href="#pick"
              className="flex h-12 items-center gap-2 rounded-full border border-cream/25 pl-6 pr-5 font-semibold tracking-[-0.01em] text-cream transition-colors duration-300 hover:border-cream/60">
              {HERO.how}
              <IconArrowDown size={18} stroke={2.2} aria-hidden />
            </a>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
