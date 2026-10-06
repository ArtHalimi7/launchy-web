import { GetApp } from "@/components/GetApp";
import { Launch } from "@/components/Launch";
import { Story } from "@/components/story/Story";
import { Wordmark } from "@/components/Wordmark";
import { HOW } from "@/content";

const WRAP = "mx-auto w-full max-w-[1240px] px-6 md:px-12";

/**
 * The story of what Launchy does, told by the phone, then the three taps it takes to get in.
 */
export default function Home() {
  return (
    <>
      <Launch />
      <Story />

      <section className="bg-ink text-white">
        <div className={`${WRAP} pb-24 pt-20 md:pb-32 md:pt-28`}>
          <h2 className="max-w-[13ch] text-[clamp(38px,6vw,68px)] font-semibold leading-[0.98] tracking-[-0.05em]">{HOW.title}</h2>
          <ol className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-12">
            {HOW.steps.map((s, i) => (
              <li key={s.title} className="border-t border-white/15 pt-6">
                <span className="text-[17px] font-semibold tabular-nums text-ember">{i + 1}</span>
                <h3 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] md:text-[30px]">{s.title}</h3>
                <p className="mt-2.5 max-w-[34ch] text-[17px] leading-[1.45] text-white/60">{s.body}</p>
              </li>
            ))}
          </ol>
          <GetApp className="mt-14 w-full sm:w-auto" />
        </div>
        <footer className={`${WRAP} flex items-center justify-between border-t border-white/10 py-7 text-[14px] text-white/45`}>
          <Wordmark id="wordmark-footer" write={false} dot="#FFFFFF" className="h-7 w-auto" />
          <span>© 2026 Launchy</span>
        </footer>
      </section>
    </>
  );
}
