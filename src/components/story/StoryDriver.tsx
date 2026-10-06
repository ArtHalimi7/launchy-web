"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import type { PhoneGL } from "./phone-gl";
import { type Layout, type PhonePosition, type Pose, rigPose, sample, SCENES } from "./timeline";

/**
 * The part of the story script plays, none of it on the way to first paint:
 *
 * - The phone. Its body (WebGL, once loaded) and its screen (HTML) move together, so one frame
 *   loop reads the scroll, works out the phone's pose from the timeline and gives it to both.
 *   The loop runs only while something is moving: scroll, the pointer, a resize.
 * - The scene that's on (`data-scene` on the stage): it counts down the recording while you film,
 *   and lets faded-out buttons stop taking taps.
 * - Where the browser can't play the rest of the timeline against scroll itself, it plays it too,
 *   by setting every keyframed actor to the scroll's point.
 * - In the hero, with a mouse, the phone leans a little toward the pointer.
 * - Lenis smooths wheel and trackpad scrolling. Touch keeps the phone's own scrolling, which is
 *   already smooth. The phone is updated inside Lenis's frame, so it never trails the page.
 */
export function StoryDriver() {
  useEffect(() => {
    const story = document.querySelector<HTMLElement>("[data-story]");
    const stage = story?.querySelector<HTMLElement>(".stage");
    const tilt = story?.querySelector<HTMLElement>(".tilt");
    const rig = story?.querySelector<HTMLElement>(".rig");
    const canvas = story?.querySelector<HTMLCanvasElement>(".phone-gl");
    if (!story || !stage || !tilt || !rig || !canvas) return;

    const native = CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const portrait = matchMedia("(orientation: portrait)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");

    // The screen's units, for reading the timeline's lengths: vw, and svh from a probe.
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;height:100svh;width:0;visibility:hidden;pointer-events:none";
    document.body.append(probe);
    let vw = 0;
    let svh = 0;
    const resolve = (n: number, unit: string) => (unit === "vw" ? n * vw : unit === "svh" ? n * svh : n);

    let top = 0;
    let span = 1;
    let layout: Layout = "l";
    let actors: Animation[] = [];
    let positions: PhonePosition[] = [];
    const heroAside = story.querySelector<HTMLElement>(".hero-aside");
    const pill = story.querySelector<HTMLElement>(".pill");
    const beats = [...story.querySelectorAll<HTMLElement>(".beat")];

    // Layout offsets ignore the entrance and scroll transforms, even for a hidden scene.
    const bottomOf = (element: HTMLElement) => {
      let bottom = element.offsetHeight;
      let parent: HTMLElement | null = element;
      while (parent && parent !== stage) {
        bottom += parent.offsetTop;
        parent = parent.offsetParent as HTMLElement | null;
      }
      return bottom;
    };
    const measure = () => {
      vw = window.innerWidth / 100;
      svh = probe.offsetHeight / 100;
      layout = portrait.matches ? "p" : "l";
      top = story.getBoundingClientRect().top + window.scrollY;
      span = Math.max(1, story.offsetHeight - window.innerHeight);
      if (!native) actors = story.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation && a.animationName.startsWith("s-"));
      positions = [];
      if (layout === "p" && heroAside && pill) {
        const height = Math.min(probe.offsetHeight, window.visualViewport?.height ?? window.innerHeight);
        const halfPhone = rig.offsetHeight / 2;
        const gap = 20;
        const buttonTop = Math.min(pill.getBoundingClientRect().top, height - pill.offsetHeight - 14);
        const place = (wordsBottom: number, lowerEdge: number, hero = false) => {
          const upper = wordsBottom + gap + halfPhone;
          const lower = lowerEdge - gap - halfPhone;
          const center = hero ? upper + 16 : (wordsBottom + lowerEdge) / 2 - 12;
          return Math.max(upper, Math.min(lower, center)) - 50 * svh;
        };
        const hero = place(bottomOf(heroAside), height, true);
        const [phone, idea, film, edit, paid, end] = beats.map((beat) =>
          place(bottomOf(beat), beat.classList.contains("s-beat-end") ? height : buttonTop),
        );
        positions = [
          [0, hero], [0.039, hero],
          [0.168, phone], [0.235, phone],
          [0.313, idea], [0.503, idea],
          [0.567, film], [0.682, film],
          [0.805, edit], [0.849, edit],
          [0.897, paid], [0.927, paid],
          [0.983, end], [1, end],
        ];
      }
    };

    // The recording countdown on the filming screen.
    const recLeft = story.querySelector<HTMLElement>(".rec-left");
    let rec = 0;
    let left = 6;
    const recording = (on: boolean) => {
      if (on && !rec && recLeft) {
        rec = window.setInterval(() => {
          left = left > 1 ? left - 1 : 7;
          recLeft.textContent = String(left);
        }, 1000);
      } else if (!on && rec) {
        clearInterval(rec);
        rec = 0;
      }
    };

    let scene = "hero";
    const show = (now: string) => {
      if (now === scene) return;
      scene = now;
      stage.dataset.scene = now;
      recording(now === "film");
    };

    // The lean toward the pointer, eased.
    const lean = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      if (!pointer.matches || reduced.matches || scene !== "hero") return;
      lean.tx = -(e.clientY / window.innerHeight - 0.5) * 9;
      lean.ty = (e.clientX / window.innerWidth - 0.5) * 14;
      wake();
    };

    let gl: PhoneGL | null = null;
    let last = "";
    let frame = 0;
    const tick = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / span));
      if (!native) for (const a of actors) a.currentTime = p * 1000;
      let now: string = SCENES[0][0];
      for (const [name, at] of SCENES) if (p >= at) now = name;
      show(now);

      if (scene !== "hero") lean.tx = lean.ty = 0;
      lean.x += (lean.tx - lean.x) * 0.08;
      lean.y += (lean.ty - lean.y) * 0.08;
      const leaning = Math.abs(lean.tx - lean.x) + Math.abs(lean.ty - lean.y) > 0.01;
      if (!leaning) {
        lean.x = lean.tx;
        lean.y = lean.ty;
      }

      // With motion reduced the phone stays where the CSS rests it, upright, and only its screens change.
      const pose: Pose = reduced.matches ? { ...rigPose(0, layout, resolve, positions), rx: 0, ry: 0, rz: 0, s: 1 } : rigPose(p, layout, resolve, positions);
      const state = `${p}|${lean.x}|${lean.y}|${layout}`;
      if (state !== last) {
        last = state;
        tilt.style.transform = lean.x || lean.y ? `rotateX(${lean.x.toFixed(3)}deg) rotateY(${lean.y.toFixed(3)}deg)` : "";
        rig.style.translate = `${pose.x.toFixed(2)}px ${pose.y.toFixed(2)}px`;
        rig.style.scale = pose.s.toFixed(4);
        if (!reduced.matches) {
          rig.style.transform = `rotateX(${pose.rx.toFixed(3)}deg) rotateY(${pose.ry.toFixed(3)}deg) rotateZ(${pose.rz.toFixed(3)}deg)`;
        } else {
          rig.style.transform = "";
        }
        gl?.draw({ pose, lean: [lean.x, lean.y], aura: sample("aura", "opacity", p, layout, resolve)[0] });
        frame = requestAnimationFrame(tick);
      } else if (leaning) {
        frame = requestAnimationFrame(tick);
      }
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      gl?.resize();
      last = "";
      wake();
    };

    measure();
    tick();
    const lenis = reduced.matches ? null : new Lenis({ autoRaf: true, lerp: 0.09 });
    lenis?.on("scroll", () => {
      cancelAnimationFrame(frame);
      tick();
    });

    // The launch (Launch.tsx) covers the page until its hole opens: the page holds still till then.
    // Timed by the launch's own clock, which starts at first paint, not at navigation.
    const opens = (reduced.matches ? 0.5 : 2.1) * 1000;
    const launch = document.querySelector(".launch")?.getAnimations()[0];
    const playedFor = () => (launch?.currentTime != null ? Number(launch.currentTime) : performance.now());
    const wait = Math.max(0, opens - playedFor());
    const root = document.documentElement;
    let unhold = 0;
    if (wait > 0) {
      lenis?.stop();
      root.style.overflow = "hidden";
      unhold = window.setTimeout(() => {
        root.style.overflow = "";
        lenis?.start();
      }, wait);
    }
    const resized = new ResizeObserver(onResize);
    resized.observe(story);
    if (heroAside) resized.observe(heroAside);
    if (pill) resized.observe(pill);
    for (const beat of beats) resized.observe(beat);
    const onFontsLoaded = () => {
      if (!gone) onResize();
    };
    void document.fonts.ready.then(onFontsLoaded);
    document.fonts.addEventListener("loadingdone", onFontsLoaded);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    reduced.addEventListener("change", onResize);
    portrait.addEventListener("change", onResize);

    // The 3D phone: fetched once the launch has played and the page is idle, shown once the hero's
    // entrance has finished, so the swap from the HTML phone happens while nothing moves.
    let gone = false;
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 300));
    const fetchAt = window.setTimeout(() => idle(loadPhone), Math.max(0, opens + 600 - playedFor()));
    const loadPhone = async () => {
      try {
        const { createPhoneGL } = await import("./phone-gl");
        const phone = await createPhoneGL(canvas, stage);
        if (gone) return phone.dispose();
        await Promise.all(story.querySelector(".intro")!.getAnimations().map((a) => a.finished.catch(() => {})));
        if (gone) return phone.dispose();
        gl = phone;
        last = "";
        tick();
        stage.classList.add("gl");
        canvas.addEventListener("webglcontextlost", () => {
          gl = null;
          stage.classList.remove("gl");
        });
      } catch {
        // No WebGL, or the model didn't load: the HTML phone carries on.
      }
    };

    return () => {
      gone = true;
      clearTimeout(fetchAt);
      clearTimeout(unhold);
      root.style.overflow = "";
      resized.disconnect();
      document.fonts.removeEventListener("loadingdone", onFontsLoaded);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      reduced.removeEventListener("change", onResize);
      portrait.removeEventListener("change", onResize);
      cancelAnimationFrame(frame);
      lenis?.destroy();
      recording(false);
      probe.remove();
      gl?.dispose();
    };
  }, []);

  return null;
}
