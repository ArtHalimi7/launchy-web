"use client";

import { IconCheck } from "@tabler/icons-react";
import { m, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { POST } from "@/content";
import { FILM_STEPS } from "@/lib/media";
import { EXPO } from "@/lib/motion";

/**
 * Scene 05, post: the finished video, and the steps it really goes through in the app (sent, in
 * review, approved, live), ticking off one after another as it comes into view. No made-up numbers.
 */
export function Post() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  const last = POST.steps.length - 1;
  return (
    <section data-scene="4" className="relative px-5 py-[18vh] md:px-10">
      <div ref={ref} className="mx-auto grid max-w-[1180px] items-center gap-14 md:grid-cols-[1.45fr_1fr]">
        <div>
          <h2 className="text-[clamp(2.6rem,6.2vw,6.4rem)] font-extrabold leading-[0.9] tracking-tight2">
            {POST.title}
            <br />
            <span className="font-serif font-normal italic tracking-[-0.02em] text-fog">{POST.accent}</span>
          </h2>
          <p className="mt-6 max-w-[38ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.45] text-fog">{POST.body}</p>

          <ol className="mt-10 flex flex-col">
            {POST.steps.map((step, i) => (
              <m.li
                key={step}
                className="flex items-center gap-4 border-t border-cream/10 py-4 last:border-b"
                initial={{ opacity: 0.25 }}
                animate={seen ? { opacity: 1 } : undefined}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.45, ease: EXPO }}>
                <m.span
                  className={`flex size-7 items-center justify-center rounded-full ${i === last ? "bg-ember text-ink" : "bg-cream/10 text-cream"}`}
                  initial={{ scale: 0.6 }}
                  animate={seen ? { scale: 1 } : undefined}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.45, ease: EXPO }}>
                  {i === last ? <span className="blink size-2 rounded-full bg-ink" /> : <IconCheck size={15} stroke={2.6} aria-hidden />}
                </m.span>
                <span className="text-[clamp(1.1rem,1.6vw,1.4rem)] font-semibold tracking-[-0.02em]">{step}</span>
                <span className="label ml-auto text-ash">0{i + 1}</span>
              </m.li>
            ))}
          </ol>
        </div>

        <m.div
          className="relative mx-auto aspect-[9/16] w-[min(78vw,340px)] overflow-hidden rounded-[30px] bg-smoke shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          initial={{ y: 60, rotate: 3, opacity: 0 }}
          animate={seen ? { y: 0, rotate: 0, opacity: 1 } : undefined}
          transition={{ duration: 1.1, ease: EXPO }}>
          <Image src={FILM_STEPS[4]} alt="The finished video: the self-watering bottle in the plant pot" fill sizes="340px" className="object-cover" />
          <m.div
            className="label absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 text-cream"
            initial={{ opacity: 0, y: -8 }}
            animate={seen ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.25 + last * 0.45, ease: EXPO }}>
            <span className="blink size-1.5 rounded-full bg-ember" /> Live
          </m.div>
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-ink/75 p-3">
            <p className="text-[13px] font-semibold leading-tight text-cream">This bottle waters my plant for days 🌱</p>
            <p className="label mt-1.5 text-[9px] text-ash">DIY · 30 s</p>
          </div>
        </m.div>
      </div>
    </section>
  );
}
