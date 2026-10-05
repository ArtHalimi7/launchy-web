"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { m, useTransform, type MotionValue } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { MAT, PASS, REACTION_STILLS, SHEET } from "@/lib/media";

/*
 * The four formats as the app draws them on Create, rebuilt for the page: the viewfinder, the
 * cutting mat, the pass and the contact sheet. Each fills a 4:5 stage, laid out in percentages so it
 * holds together at any size, and every picture in it is a real one from the app.
 */

const SIZES = "(min-width: 768px) 22vw, 40vw";

function Stage({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px]" style={{ background: bg }}>
      {children}
    </div>
  );
}

function Pill({ children, dark = true }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[clamp(11px,1.1vw,14px)] font-semibold tracking-[-0.01em] ${dark ? "bg-ink text-cream" : "bg-[#FFFDF8] text-ink shadow-[0_6px_14px_rgba(70,40,15,0.18)]"}`}>
      {children}
      <IconArrowRight size={14} stroke={2.4} className="text-ember" aria-hidden />
    </div>
  );
}

/* ── React: a camera's viewfinder, today's pick playing with two more behind ── */

export function ReactStage() {
  return (
    <Stage bg="#F2EFE8">
      <div className="absolute inset-y-0 left-1/3 w-px bg-ink/5" />
      <div className="absolute inset-y-0 left-2/3 w-px bg-ink/5" />
      <div className="absolute inset-x-0 top-1/3 h-px bg-ink/5" />
      <div className="absolute inset-x-0 top-2/3 h-px bg-ink/5" />
      {(["left-[5%] top-[4%] border-l border-t", "right-[5%] top-[4%] border-r border-t", "bottom-[4%] left-[5%] border-b border-l", "bottom-[4%] right-[5%] border-b border-r"] as const).map((c) => (
        <span key={c} className={`absolute size-[7%] border-ink/30 ${c}`} />
      ))}
      <div className="label absolute left-[9%] top-[8%] flex items-center gap-1.5 text-[9px] text-ink">
        <span className="blink size-1.5 rounded-full bg-ember" /> Rec <span className="text-ink/50">00:00:14</span>
      </div>
      <div className="label absolute right-[9%] top-[8%] text-[9px] text-ink/45">1080p · 30</div>

      <div className="absolute inset-x-0 top-[26%] flex justify-center">
        {REACTION_STILLS.map((src, i) => {
          const front = i === 1;
          const side = i === 0 ? -1 : 1;
          return (
            <div
              key={i}
              className="absolute rounded-[14px] bg-white p-1 shadow-[0_14px_26px_rgba(40,30,20,0.18)]"
              style={{
                width: front ? "78%" : "60%",
                zIndex: front ? 3 : 1,
                transform: front ? "none" : `translate(${side * 34}%, 12%) rotate(${side * 7}deg)`,
              }}>
              <div className="relative aspect-video overflow-hidden rounded-[10px] bg-ink">
                <Image src={src} alt="" fill sizes={SIZES} className="object-cover" />
              </div>
            </div>
          );
        })}
      </div>
      <p className="label absolute inset-x-0 bottom-[16%] text-center text-[9px] text-ink/45">Today’s pick · Bodycam · 9 min</p>
      <div className="absolute bottom-[6%] left-[10%] right-[10%] flex h-[7%] items-center justify-center rounded-full bg-ember text-[clamp(11px,1.1vw,14px)] font-bold text-ink">
        Record your take →
      </div>
    </Stage>
  );
}

/* ── DIY: a cutting mat with one project's steps dealt across an orange band ── */

export function DiyStage() {
  return (
    <Stage bg="#F2EFE8">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="mat-cell" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#0B0C0E" strokeOpacity="0.05" />
          </pattern>
          <pattern id="mat-major" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#mat-cell)" />
            <path d="M120 0H0V120" fill="none" stroke="#0B0C0E" strokeOpacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mat-major)" />
      </svg>
      <div className="absolute inset-x-0 top-[30%] h-[36%] bg-ember" />
      <div className="absolute inset-x-0 top-[13%] flex justify-center">
        {MAT.map((src, i) => {
          const front = i === 1;
          const side = i === 0 ? -1 : 1;
          return (
            <Polaroid key={i} src={src} front={front} style={front ? {} : { transform: `translate(${side * 58}%, 8%) rotate(${side * 5}deg)` }} n={i} />
          );
        })}
      </div>
      <Pill>Flower bottle vase · 5 steps</Pill>
    </Stage>
  );
}

function Polaroid({ src, front, style, n }: { src: StaticImageData; front: boolean; style: object; n: number }) {
  return (
    <div className="absolute rounded-[16px] border-[5px] border-white bg-[#2A231E] shadow-[0_14px_28px_rgba(11,12,14,0.32)]" style={{ width: front ? "44%" : "37%", zIndex: front ? 3 : 1, ...style }}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-[11px]">
        <Image src={src} alt="" fill sizes={SIZES} className="object-cover" />
      </div>
      <div className="absolute inset-x-[6%] bottom-[5%] flex items-center justify-center gap-1 rounded-full bg-white py-1">
        <span className="font-mono text-[9px] text-ember">0{n + 1}</span>
        <span className="text-[10px] font-semibold text-ink">{["Prep", "Shoot", "Done"][n]}</span>
      </div>
    </div>
  );
}

/* ── Cooking: the pass, a brass rail with one recipe's orders clipped on ── */

export function CookStage() {
  return (
    <Stage bg="#F4EFE6">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="wall-tiles" width="64" height="64" patternUnits="userSpaceOnUse">
            <rect width="64" height="64" fill="#F4EFE6" />
            <path d="M0 .5H64M0 32.5H64M.5 0V32M32.5 32V64" stroke="rgba(120,98,72,0.18)" />
            <path d="M0 2H64M0 34H64" stroke="#fff" strokeOpacity="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wall-tiles)" />
      </svg>
      <div className="absolute inset-x-[7%] top-[17%] h-[2px] rounded-full bg-[#B8925A]" />
      <div className="absolute inset-x-0 top-[16%] flex justify-center">
        {PASS.map((src, i) => {
          const front = i === 1;
          const side = i === 0 ? -1 : 1;
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ width: front ? "42%" : "35%", zIndex: front ? 3 : 1, transform: front ? "none" : `translate(${side * 60}%, 9%) rotate(${side * 4}deg)` }}>
              <span className="z-10 -mb-[3px] h-[9px] w-[22px] rounded-[2px] bg-[#B8925A]" />
              <div className="w-full rounded-[4px] bg-[#FFFDF8] p-[6px] pb-0 shadow-[0_16px_28px_rgba(70,40,15,0.16)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-[#E9E3D6]">
                  <Image src={src} alt="" fill sizes={SIZES} className="object-cover" />
                </div>
                <div className="mt-1.5 border-t border-dashed border-[#DDD5C6] px-0.5 py-1.5">
                  <p className="font-mono text-[8.5px] tracking-[0.12em] text-ember">0{i + 1} · {["PREP", "COOK", "PLATE"][i]}</p>
                  <p className="truncate text-[11px] font-semibold text-ink">{["Lay it out", "Smash and sear", "The final shot"][i]}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[20%] border-t-4 border-[#E9CFAA] bg-[#D2AB7E]">
        <Pill dark={false}>Smash burger tacos · 6 steps</Pill>
      </div>
    </Stage>
  );
}

/* ── Challenges: a contact sheet, each approved video circled in grease pencil ── */

/** How many of the twelve are circled once the beat has fully played. */
const APPROVED = 7;

export function ChallengeStage({ draw }: { draw: MotionValue<number> }) {
  return (
    <Stage bg="#EFEAE0">
      <div className="absolute left-[7%] right-[7%] top-[9%] -rotate-1 rounded-[3px] bg-[#FFFDF8] p-[4%] pt-[3.5%] shadow-[0_18px_32px_rgba(70,40,15,0.16)]">
        <span className="absolute -left-3 top-1 h-4 w-12 -rotate-[38deg] bg-[rgba(226,212,180,0.9)]" />
        <span className="absolute -right-3 top-1 h-4 w-12 rotate-[38deg] bg-[rgba(226,212,180,0.9)]" />
        <div className="mb-[3%] flex justify-between px-[6%] font-mono text-[clamp(7px,0.8vw,10px)] tracking-[0.12em]">
          <span className="text-ink">12 HOME TRICKS</span>
          <span className="text-ember">{APPROVED}/12 APPROVED</span>
        </div>
        <div className="flex flex-col gap-[3%]">
          {[0, 1, 2].map((row) => (
            <div key={row} className="relative bg-[#141518] px-[3%] py-[5%]">
              <Sprockets top />
              <Sprockets />
              <div className="grid grid-cols-4 gap-[4%]">
                {SHEET.slice(row * 4, row * 4 + 4).map((src, j) => {
                  const i = row * 4 + j;
                  return (
                    <div key={i} className="relative aspect-[4/5]">
                      <div className={`relative h-full overflow-hidden rounded-[2px] ${i < APPROVED + 2 ? "" : "opacity-40"}`}>
                        <Image src={src} alt="" fill sizes="10vw" className="object-cover" />
                      </div>
                      {i < APPROVED ? <Loop draw={draw} at={i / APPROVED} seed={i} /> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pill>12 Home Tricks · 7 of 12</Pill>
    </Stage>
  );
}

function Sprockets({ top = false }: { top?: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 h-[3px] ${top ? "top-[1.6%]" : "bottom-[1.6%]"}`}
      style={{ backgroundImage: "repeating-linear-gradient(90deg, #FFFDF8 0 4px, transparent 4px 9px)", opacity: 0.85 }}
    />
  );
}

/** An editor's loop round a frame, drawn as the beat plays: one pencil stroke, a little past its start. */
function Loop({ draw, at, seed }: { draw: MotionValue<number>; at: number; seed: number }) {
  const pathLength = useTransform(draw, [at * 0.8, at * 0.8 + 0.2], [0, 1]);
  const start = -1.9 + (seed % 5) * 0.31;
  const pts = Array.from({ length: 31 }, (_, i) => {
    const t = start + (i / 30) * Math.PI * 2.14;
    const r = (1 + 0.03 * Math.sin(i * 1.3 + seed)) * (1 - 0.07 * (i / 30));
    return `${(50 + Math.cos(t) * 56 * r).toFixed(1)},${(50 + Math.sin(t) * 58 * r).toFixed(1)}`;
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute -inset-[14%] z-10 h-[128%] w-[128%] overflow-visible" aria-hidden>
      <m.path d={`M${pts.join(" L")}`} fill="none" stroke="#FF5A1F" strokeWidth={3} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength }} />
    </svg>
  );
}
