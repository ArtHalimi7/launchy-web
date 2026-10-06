import Image, { type StaticImageData } from "next/image";

import edit from "@/assets/edit-tacos.webp";
import challenge from "@/assets/screens/challenge.jpg";
import cook from "@/assets/screens/cook.jpg";
import create from "@/assets/screens/create.jpg";
import diy from "@/assets/screens/diy.jpg";
import film from "@/assets/screens/film.webp";
import react from "@/assets/screens/react.jpg";
import wallet from "@/assets/screens/wallet.jpg";
import { Qr } from "@/components/Qr";
import { AppMark, Wordmark } from "@/components/Wordmark";
import { TESTFLIGHT_URL } from "@/content";

/*
 * What the phone shows, one screen per scene: screenshots of the app (src/assets/screens), on an
 * iPhone Pro Max. Their own status bar is covered and a clean one drawn over it. The filming
 * screenshot has the step's own picture laid into its camera view, since a screenshot can't catch
 * the camera. Only the finished video and the last screen are drawn here.
 */

/** The app's colours (launchy-app, src/design/theme.tsx). */
const C = { ink: "#0B0C0E", cream: "#F2EFE8", ember: "#FF5A1F" };

/** A length in the app's points, as a share of the display's width. */
const pt = (n: number) => `${+((n * 100) / 440).toFixed(3)}cqw`;
const SIZES = "(orientation: portrait) 100vw, 40vw";

/** The four kinds of idea, in the order the list names them. */
const FORMAT_SHOTS: [StaticImageData, string][] = [
  [react, "Launchy's React to a clip screen: Watch it. React to it."],
  [diy, "Launchy's Make something screen: Make it. Film it."],
  [cook, "Launchy's Cook something screen: Cook it. Film it."],
  [challenge, "Launchy's Take a challenge screen: Finish it. Unlock it."],
];

export function Screens() {
  return (
    <>
      <Shot name="scr-create" src={create} alt="Launchy's Create screen: What do you feel like shooting today?" preload />
      {FORMAT_SHOTS.map(([src, alt], i) => (
        <Shot key={i} name={`scr-fmt${i}`} src={src} alt={alt} />
      ))}
      <Shot name="scr-film" src={film} alt="Filming a recipe in Launchy: step 1 of 6, Lay it out" />
      <EditScreen />
      <Shot name="scr-wallet" src={wallet} alt="Launchy's wallet" />
      <EndScreen />
      <StatusBar />
    </>
  );
}

/** A screenshot, filling the display, its own status bar under a black band. */
function Shot({ name, src, alt, preload = false }: { name: string; src: StaticImageData; alt: string; preload?: boolean }) {
  return (
    <div className={`scr s-${name}`} data-a>
      <Image src={src} alt={alt} fill sizes={SIZES} quality={90} preload={preload} fetchPriority={preload ? undefined : "low"} className="object-cover object-top" />
      <i className="absolute inset-x-0 top-0 h-[6.2%] bg-black" aria-hidden />
    </div>
  );
}

/** The finished video, as it goes out: edited, captioned, playing. */
function EditScreen() {
  return (
    <div className="scr s-scr-edit" data-a style={{ background: "#000" }} aria-hidden>
      <Image src={edit} alt="" fill sizes={SIZES} quality={75} fetchPriority="low" className="object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,.6) 100%)" }} />
      <p
        className="absolute inset-x-0 text-center font-extrabold text-white"
        style={{ top: "58%", fontSize: pt(40), lineHeight: 1, letterSpacing: pt(-1), textShadow: `0 ${pt(2)} ${pt(10)} rgba(0,0,0,.55), 0 0 ${pt(2)} rgba(0,0,0,.9)` }}>
        Flip. Cheese.
        <br />
        <span style={{ color: C.ember }}>Melt.</span>
      </p>
      <div className="absolute text-white" style={{ left: pt(20), right: pt(20), bottom: pt(54) }}>
        <p className="font-bold" style={{ fontSize: pt(17) }}>
          Smash burger tacos
        </p>
        <p style={{ fontSize: pt(14), opacity: 0.75, marginTop: pt(3) }}>Six things, fifteen minutes.</p>
        <div className="overflow-hidden rounded-full" style={{ height: pt(3), background: "rgba(255,255,255,.25)", marginTop: pt(14) }}>
          <i className="play-bar block h-full rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

/** The last screen. On a computer: a QR code to scan with your phone. On a phone: the app, opening. */
function EndScreen() {
  return (
    <div className="scr s-scr-end" data-a style={{ background: "#000", color: C.cream }}>
      <div className="end-qr absolute inset-0 flex flex-col items-center justify-center" style={{ gap: pt(28) }}>
        <Wordmark id="wordmark-screen" write={false} dot={C.cream} className="h-auto w-[40cqw]" />
        <div style={{ background: C.cream, padding: pt(22), borderRadius: pt(36) }}>
          <Qr value={TESTFLIGHT_URL} ring="ring-[#F2EFE8]" className="w-[56cqw]" />
        </div>
      </div>
      <div className="end-splash absolute inset-0 grid place-items-center" aria-hidden>
        <AppMark className="w-[34cqw]" />
      </div>
    </div>
  );
}

/** iPhone's status bar, drawn: the time on the left, signal, Wi-Fi and battery on the right. */
function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-[6.5%] items-center justify-between px-[9%] pt-[1%] text-white" aria-hidden>
      <span className="text-[4.3cqw] font-semibold tracking-[-0.01em]">9:41</span>
      <span className="flex items-center gap-[1.6cqw]">
        <svg viewBox="0 0 18 12" className="h-[3cqw]" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-[3cqw]" fill="currentColor">
          <path d="M8 2.2c2.4 0 4.6.9 6.3 2.5l1.2-1.3A10.8 10.8 0 0 0 8 .4 10.8 10.8 0 0 0 .5 3.4l1.2 1.3A9 9 0 0 1 8 2.2Z" />
          <path d="M8 5.6c1.5 0 2.9.6 4 1.6l1.2-1.3A7.6 7.6 0 0 0 8 3.8a7.6 7.6 0 0 0-5.2 2.1L4 7.2a5.8 5.8 0 0 1 4-1.6Z" />
          <path d="M8 9c.6 0 1.2.2 1.6.6L8 11.4 6.4 9.6C6.8 9.2 7.4 9 8 9Z" />
        </svg>
        <svg viewBox="0 0 27 12" className="h-[3cqw]" fill="none">
          <rect x="0.5" y="0.5" width="23" height="11" rx="3.2" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="20" height="8" rx="2" fill="currentColor" />
          <path d="M25 4v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}
