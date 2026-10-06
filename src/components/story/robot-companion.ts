import type { Pose } from "./timeline";

type PhoneFrame = { progress: number; scene: string; pose: Pose; lean: [number, number] };
export type RobotCompanion = {
  resize(): void;
  update(frame: PhoneFrame): void;
  pointer(x: number, y: number): void;
  dispose(): void;
};

// Only peek while the phone has settled. Its turns and screen transitions get the stage to themselves.
const WINDOWS: Record<string, readonly [number, number]> = {
  hero: [0, 0.029],
  ideas: [0.325, 0.495],
  film: [0.565, 0.674],
  paid: [0.875, 0.92],
  end: [0.983, 1],
};
const WORDS: Record<string, string> = {
  hero: ".hero-aside", ideas: ".s-beat-idea", film: ".s-beat-film",
  paid: ".s-beat-paid", end: ".s-beat-end",
};

/** Short, event-driven appearances attached to the actual projected corner of the phone. */
export function createRobotCompanion(stage: HTMLElement, rig: HTMLElement, tilt: HTMLElement, wake: () => void): RobotCompanion | null {
  const lane = stage.querySelector<HTMLElement>(".robot-lane");
  const runner = lane?.querySelector<HTMLElement>(".robot-runner");
  const persp = tilt.parentElement;
  if (!lane || !runner || !persp) return null;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const visited = new Set<string>();
  const wordsBottom: Record<string, number> = {};
  let geometry = { width: 0, height: 0, cx: 0, cy: 0, tx: 0, ty: 0, ox: 0, oy: 0, distance: 1, size: 0, portrait: false, viewportWidth: 0 };
  let frame: PhoneFrame | null = null;
  let corner = { x: 0, y: 0 };
  let scene = "";
  let eligible = false;
  let wasReduced = reduced.matches;
  let pending = 0;
  let gesture = 0;
  let retreat = 0;
  let lastAppearance = -Infinity;
  let disposed = false;

  // Wait for the phone's entrance to finish before the first hello.
  const intro = stage.querySelector(".intro")?.getAnimations()[0];
  const entranceLeft = intro ? Math.max(0, Number(intro.effect?.getComputedTiming().endTime ?? 0) - Number(intro.currentTime ?? 0)) : 0;
  const readyAt = performance.now() + entranceLeft + 650;

  function clearTimers() {
    clearTimeout(pending);
    clearTimeout(gesture);
    clearTimeout(retreat);
    pending = gesture = retreat = 0;
  }

  function hide() {
    clearTimers();
    lane!.dataset.mood = "hidden";
  }

  function schedule(fromPointer = false) {
    if (disposed || !eligible || reduced.matches || document.hidden || pending || lane!.dataset.mood !== "hidden") return;
    if (!fromPointer && visited.has(scene)) return;
    const forScene = scene;
    pending = window.setTimeout(() => {
      pending = 0;
      if (disposed || !eligible || document.hidden || reduced.matches || scene !== forScene) return;
      visited.add(scene);
      lastAppearance = performance.now();
      lane!.dataset.mood = "peek";
      gesture = window.setTimeout(() => {
        gesture = 0;
        lane!.dataset.mood = forScene === "paid" ? "happy" : forScene === "end" || fromPointer ? "wave" : "curious";
      }, 850);
      retreat = window.setTimeout(hide, forScene === "hero" || forScene === "end" ? 4600 : 3400);
    }, Math.max(fromPointer ? 180 : 600, readyAt - performance.now()));
  }

  function resize() {
    const css = getComputedStyle(persp!);
    const [ox, oy] = css.perspectiveOrigin.split(" ").map(parseFloat);
    const [tx, ty] = getComputedStyle(tilt).transformOrigin.split(" ").map(parseFloat);
    const width = rig.offsetWidth;
    const height = rig.offsetHeight;
    geometry = {
      width, height, cx: rig.offsetLeft + width / 2, cy: rig.offsetTop + height / 2,
      tx, ty, ox, oy, distance: parseFloat(css.perspective), size: runner!.offsetWidth,
      portrait: matchMedia("(orientation: portrait)").matches, viewportWidth: stage.clientWidth,
    };
    for (const [name, selector] of Object.entries(WORDS)) {
      const word = stage.querySelector<HTMLElement>(selector);
      if (!word) continue;
      let bottom = word.offsetHeight;
      let parent: HTMLElement | null = word;
      while (parent && parent !== stage) {
        bottom += parent.offsetTop;
        parent = parent.offsetParent as HTMLElement | null;
      }
      wordsBottom[name] = bottom;
    }
    if (frame) attach(frame);
  }

  function attach({ pose, lean }: PhoneFrame) {
    const { width, height, cx, cy, tx, ty, ox, oy, distance, size } = geometry;
    // The same CSS transform chain as phone-gl.ts, including perspective and pointer lean.
    const matrix = new DOMMatrix()
      .translateSelf(tx, ty)
      .rotateAxisAngleSelf(1, 0, 0, lean[0])
      .rotateAxisAngleSelf(0, 1, 0, lean[1])
      .translateSelf(cx - tx + pose.x, cy - ty + pose.y)
      .scaleSelf(pose.s, pose.s, pose.s)
      .rotateAxisAngleSelf(1, 0, 0, pose.rx)
      .rotateAxisAngleSelf(0, 1, 0, pose.ry)
      .rotateAxisAngleSelf(0, 0, 1, pose.rz);
    const topCorners = [-1, 1].flatMap((x) => [-1, 1].map((z) => {
      const point = matrix.transformPoint(new DOMPoint(x * width / 2, -height / 2, z * width * 0.11017 / 2));
      const k = distance / (distance - point.z);
      return { x: ox + (point.x - ox) * k, y: oy + (point.y - oy) * k };
    }));
    corner = topCorners.reduce((right, point) => point.x > right.x ? point : right);
    const clearTop = geometry.portrait ? (wordsBottom[scene] ?? 0) + 8 : 8;
    const lift = Math.min(size * 0.52, Math.max(4, corner.y - clearTop - 4));
    lane!.style.translate = `${corner.x.toFixed(2)}px ${corner.y.toFixed(2)}px`;
    lane!.style.setProperty("--robot-peek-y", `${(-lift).toFixed(2)}px`);
    lane!.dataset.attached = "true";
  }

  function update(next: PhoneFrame) {
    frame = next;
    if (scene !== next.scene || wasReduced !== reduced.matches) {
      hide();
      scene = next.scene;
      wasReduced = reduced.matches;
    }
    attach(next);
    const range = WINDOWS[scene];
    eligible = !!range && next.progress >= range[0] && next.progress <= range[1]
      && corner.x + geometry.size * 0.65 < geometry.viewportWidth && !document.hidden;
    if (!eligible) return hide();
    if (reduced.matches) {
      lane!.dataset.mood = scene === "hero" || scene === "end" ? "peek" : "hidden";
      return;
    }
    schedule();
  }

  function pointer(x: number, y: number) {
    if (performance.now() - lastAppearance < 12000) return;
    if (Math.hypot(x - corner.x, y - corner.y) < 75) schedule(true);
  }

  const visibility = () => {
    if (document.hidden) hide();
    else wake();
  };
  lane.dataset.mood = "hidden";
  document.addEventListener("visibilitychange", visibility);

  return {
    resize, update, pointer,
    dispose() {
      disposed = true;
      hide();
      document.removeEventListener("visibilitychange", visibility);
    },
  };
}
