import { IconChevronDown } from "@tabler/icons-react";
import Image from "next/image";
import type { CSSProperties } from "react";

import challenge from "@/assets/formats/challenge.webp";
import cooking from "@/assets/formats/cooking.webp";
import diy from "@/assets/formats/diy.webp";
import react from "@/assets/formats/react.webp";
import { GetApp } from "@/components/GetApp";
import { Qr } from "@/components/Qr";
import { Wordmark } from "@/components/Wordmark";
import { CTA, FAQ, FAQ_TITLE, FORMATS, FORMATS_TITLE, HERO, STEPS, STEPS_TITLE, TESTFLIGHT_URL } from "@/content";

const PICTURES = { react, diy, cooking, challenge };
const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

/**
 * Launchy for creators: one short page for someone who just tapped a link under a TikTok. What it
 * is, the button that gets the app, what you can make, how it works, and the questions people ask.
 * On a computer the button is joined by a QR code to scan with an iPhone.
 */
export default function Home() {
  return (
    <main className="mx-auto max-w-[1160px] px-5 pb-10 md:px-10">
      <header className="flex items-center justify-between pt-6 md:pt-9">
        <Wordmark className="h-9 w-auto md:h-11" />
        <span className="rise rounded-full border border-ink/15 px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[-0.01em]" style={delay(0.2)}>
          {HERO.badge}
        </span>
      </header>

      <section className="grid grid-cols-[minmax(0,1fr)] gap-12 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] md:items-center md:gap-16 md:pt-16">
        <div className="min-w-0">
          <h1 className="rise text-[clamp(3.1rem,12vw,5.8rem)] font-extrabold leading-[0.94] tracking-[-0.045em]" style={delay(0.25)}>
            {HERO.title[0]}
            <br />
            {HERO.title[1].replace(".", "")}
            <span className="text-ember">.</span>
          </h1>
          <p className="rise mt-5 max-w-[30ch] text-[18px] leading-[1.45] text-ink/65 md:text-[20px]" style={delay(0.35)}>
            {HERO.sub}
          </p>
          <GetApp className="rise mt-8" />

          <div className="rise mt-10 hidden max-w-[440px] items-center gap-5 rounded-[26px] bg-paper p-5 shadow-[0_10px_30px_rgba(70,40,15,0.08)] md:flex" style={delay(0.5)}>
            <Qr value={TESTFLIGHT_URL} className="w-[118px] shrink-0" />
            <div>
              <p className="text-[17px] font-semibold tracking-[-0.015em]">{CTA.scanTitle}</p>
              <p className="mt-1 text-[14.5px] leading-[1.4] text-ink/60">{CTA.scanBody}</p>
            </div>
          </div>
        </div>

        {/* min-w-0: the carousel scrolls inside its column instead of widening the page. */}
        <div className="min-w-0">
          <p className="mb-4 text-[15px] font-semibold tracking-[-0.01em] text-ink/70">{FORMATS_TITLE}</p>
          <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
            {FORMATS.map((f, i) => (
              <article key={f.id} className="deal w-[72vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none" style={delay(0.35 + i * 0.08)}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-fog">
                  <Image
                    src={PICTURES[f.id]}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 280px, 72vw"
                    className="object-cover"
                    loading="eager"
                    fetchPriority={i === 0 ? "high" : undefined}
                  />
                </div>
                <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.015em]">{f.title}</h3>
                <p className="mt-0.5 text-[14.5px] text-ink/60">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-[30px] bg-ink px-6 py-9 text-cream md:mt-24 md:px-12 md:py-12">
        <h2 className="text-[clamp(2rem,6vw,3rem)] font-extrabold tracking-[-0.035em]">
          {STEPS_TITLE.replace(".", "")}
          <span className="text-ember">.</span>
        </h2>
        <ol className="mt-7 grid gap-7 md:grid-cols-3 md:gap-10">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4 md:flex-col md:gap-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ember text-[16px] font-bold text-ink">{i + 1}</span>
              <div>
                <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.45] text-fog/80">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="faq" className="mt-16 grid gap-6 md:mt-24 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <h2 className="text-[clamp(2rem,6vw,3rem)] font-extrabold tracking-[-0.035em]">
          {FAQ_TITLE.replace(".", "")}
          <span className="text-ember">.</span>
        </h2>
        <div className="border-t border-ink/12">
          {FAQ.map((item, i) => (
            <details key={item.id} id={`faq-${item.id}`} open={i === 0} className="group border-b border-ink/12">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[18px] font-semibold tracking-[-0.015em]">
                {item.q}
                <IconChevronDown size={20} stroke={2} aria-hidden className="chev shrink-0 text-ink/50 transition-transform duration-300" />
              </summary>
              <p className="-mt-1 max-w-[52ch] pb-5 text-[16px] leading-[1.5] text-ink/65">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col items-center rounded-[30px] bg-paper px-6 py-12 text-center shadow-[0_10px_30px_rgba(70,40,15,0.06)] md:mt-24 md:py-16">
        <Wordmark write={false} id="wordmark-end" className="h-12 w-auto md:h-16" />
        <p className="mt-5 max-w-[26ch] text-[18px] leading-[1.45] text-ink/65">{HERO.sub}</p>
        <GetApp className="mt-7 flex w-full flex-col items-center sm:w-auto" />
      </section>

      <footer className="mt-10 flex items-center justify-between text-[13px] text-ink/45">
        <span>© 2026 Launchy</span>
        <a href="#top" className="hover:text-ink">
          Back to the top ↑
        </a>
      </footer>
    </main>
  );
}
