"use client";

import { IconArrowUp, IconBrandApple, IconBrandGooglePlay } from "@tabler/icons-react";
import { m, useInView } from "motion/react";
import { useRef } from "react";

import { Dome } from "@/components/Dome";
import { Wordmark } from "@/components/Wordmark";
import { FINALE } from "@/content";
import { EXPO } from "@/lib/motion";

/**
 * Scene 07, that's a wrap: the cream curtain comes up one last time, the logo writes itself huge
 * across it, and the way in. The app isn't in the stores yet, so the buttons say so rather than
 * pretending.
 */
export function Finale() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  return (
    <section id="apply" data-scene="6" className="relative bg-cream text-ink">
      <Dome />
      <div ref={ref} className="relative px-5 pb-16 pt-[14vh] md:px-10 md:pb-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
          <m.h2
            className="text-[clamp(3rem,9vw,9rem)] font-extrabold leading-[0.88] tracking-crush"
            initial={{ opacity: 0, y: 30 }}
            animate={seen ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EXPO }}>
            {FINALE.title.replace(".", "")}
            <span className="text-ember">.</span>
          </m.h2>
          <m.div initial={{ opacity: 0, y: 20 }} animate={seen ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1, delay: 0.12, ease: EXPO }}>
            <p className="max-w-[36ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.4] text-ink/70">{FINALE.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {FINALE.stores.map((store, i) => (
                <span key={store} aria-disabled className="flex h-12 items-center gap-2.5 rounded-full bg-ink pl-4 pr-5 text-cream">
                  {i === 0 ? <IconBrandApple size={20} stroke={1.8} aria-hidden /> : <IconBrandGooglePlay size={19} stroke={1.8} aria-hidden />}
                  <span className="flex flex-col leading-none">
                    <span className="label text-[8.5px] text-ash">{FINALE.soon}</span>
                    <span className="mt-1 text-[15px] font-semibold tracking-[-0.01em]">{store}</span>
                  </span>
                </span>
              ))}
            </div>
          </m.div>
        </div>

        <Wordmark write show={seen} delay={0.35} duration={1.6} dot="#0B0C0E" className="mt-[10vh] w-full" />

        <div className="label mt-10 flex items-center justify-between border-t border-ink/15 pt-5 text-ink/55">
          <span>© 2026 Launchy</span>
          <span className="hidden sm:inline">Cut · 00:01:30:00</span>
          <a href="#top" className="flex items-center gap-1.5 text-ink transition-opacity hover:opacity-60">
            Back to the top <IconArrowUp size={13} stroke={2.2} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
