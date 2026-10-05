"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { APPLY_HREF, SCENES } from "@/content";

/** The whole page is one take, ninety seconds long: the timecode runs with the scroll. */
const TAKE_SECONDS = 90;
const FPS = 30;

function timecode(progress: number) {
  const frames = Math.round(Math.min(1, Math.max(0, progress)) * TAKE_SECONDS * FPS);
  const two = (n: number) => String(n).padStart(2, "0");
  const s = Math.floor(frames / FPS);
  return `00:${two(Math.floor(s / 60))}:${two(s % 60)}:${two(frames % FPS)}`;
}

/**
 * The viewfinder over the page: four corner marks, REC with the take's timecode, the scene being
 * shot, and a thin line for how far through the take you are. It sits in difference mode, so it reads
 * on the black scenes and the cream ones alike without changing colour by hand. Nothing in it moves
 * on its own except the REC light.
 */
export function Frame() {
  const { scrollYProgress } = useScroll();
  const tc = useRef<HTMLSpanElement>(null);
  const [scene, setScene] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (tc.current) tc.current.textContent = timecode(v);
  });

  // The scene under the middle of the screen is the one being shot.
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setScene(Number(e.target.getAttribute("data-scene")));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const n = String(scene + 1).padStart(2, "0");
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-3 z-40 text-cream mix-blend-difference md:inset-6">
        <Corner className="left-0 top-0 border-l border-t" />
        <Corner className="right-0 top-0 border-r border-t" />
        <Corner className="bottom-0 left-0 border-b border-l" />
        <Corner className="bottom-0 right-0 border-b border-r" />

        <div className="label absolute left-5 top-4 flex items-center gap-2 md:left-7 md:top-6">
          {/* The light itself sits outside the blend (below), so it stays ember on any scene. */}
          <span className="inline-block size-1.5" />
          <span>Rec</span>
          <span ref={tc} className="tabular-nums opacity-70">
            00:00:00:00
          </span>
        </div>

        <div className="label absolute bottom-4 left-5 flex items-center gap-3 md:bottom-6 md:left-7">
          <span className="tabular-nums opacity-60">Scene {n}</span>
          <span>{SCENES[scene]}</span>
        </div>
        <div className="label absolute bottom-4 right-5 hidden tabular-nums opacity-60 sm:block md:bottom-6 md:right-7">
          1080p · 30
        </div>

        <m.div className="absolute bottom-0 left-0 right-0 h-px origin-left bg-current opacity-50" style={{ scaleX: scrollYProgress }} />
      </div>

      <span aria-hidden className="blink pointer-events-none fixed left-[32px] top-[31.8px] z-40 size-1.5 rounded-full bg-ember md:left-[52px] md:top-[51.8px]" />

      <a
        href={APPLY_HREF}
        className="fixed right-[32px] top-[17px] z-50 flex h-9 items-center gap-1.5 rounded-full bg-ember pl-4 pr-3 text-[13px] font-semibold tracking-[-0.01em] text-ink transition-transform duration-300 ease-expo hover:scale-[1.04] md:right-[52px] md:top-[37px]">
        Apply
        <IconArrowUpRight size={15} stroke={2.4} aria-hidden />
      </a>
    </>
  );
}

function Corner({ className }: { className: string }) {
  return <span className={`absolute size-5 border-current opacity-70 md:size-6 ${className}`} />;
}
