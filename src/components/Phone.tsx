import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import screen from "@/assets/app-create.webp";

/** A box, in the photo's own pixels: left, top, right, bottom. */
type Box = [number, number, number, number];

/**
 * A photograph of a hand holding an iPhone with its screen off, and where that screen is, measured
 * from the photo itself. The photo was made blank on purpose: the screen is the real app, laid in
 * here sharp at any size.
 */
export type HeldPhone = { src: StaticImageData; screen: Box; island: Box; /** The display's corner, in photo pixels. */ radius: number };

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function place([x0, y0, x1, y1]: Box, w: number, h: number): CSSProperties {
  return { left: pct(x0, w), top: pct(y0, h), width: pct(x1 - x0, w), height: pct(y1 - y0, h) };
}

/**
 * The photo at its own aspect ratio, so the screen stays exactly on the glass however the box is
 * sized; the page sizes and crops the box. The app wakes a moment after the page opens, like a phone
 * lifting to its lock screen.
 */
export function Phone({ shot, alt, className = "", preload = false }: { shot: HeldPhone; alt: string; className?: string; preload?: boolean }) {
  const { width: w, height: h } = shot.src;
  const [x0, y0, x1, y1] = shot.screen;
  const radius = `${(shot.radius / (x1 - x0)) * 100}% / ${(shot.radius / (y1 - y0)) * 100}%`;
  return (
    <div className={`absolute ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <Image src={shot.src} alt={alt} fill sizes="(orientation: portrait) 100vw, 120vw" placeholder="blur" loading={preload ? "eager" : "lazy"} fetchPriority={preload ? "high" : "auto"} quality={86} />

      <div className="wake absolute overflow-hidden bg-black [container-type:inline-size]" style={{ ...place(shot.screen, w, h), borderRadius: radius }}>
        <StatusBar />
        <div className="absolute inset-x-0 bottom-0 top-[6.2%]">
          <Image src={screen} alt="Launchy's Create screen: React to a clip, Make something, and more" fill sizes="(orientation: portrait) 40vw, 24vw" quality={90} className="object-cover object-top" />
        </div>
      </div>
      {/* The Dynamic Island sits on the glass, over whatever the screen shows. */}
      <div className="absolute rounded-full bg-black" style={place(shot.island, w, h)} aria-hidden />
    </div>
  );
}

/** iPhone's status bar, drawn: the time on the left, signal, Wi-Fi and battery on the right. */
function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[6.2%] items-center justify-between px-[9%] pt-[1.2%] text-white" aria-hidden>
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
