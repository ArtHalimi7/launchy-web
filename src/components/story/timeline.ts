/*
 * The whole story as one timeline. 0 is the top of the story, 1 the bottom; every actor's moves
 * are keyed to points along it. This turns them into plain CSS keyframes at build time, which the
 * browser plays against scroll position itself (scroll-driven animations), off the main thread.
 * Where it can't, StoryDriver plays the same keyframes by setting their time from the scroll.
 *
 * The phone is the exception: its body is drawn in WebGL and its screen in HTML, and the two have
 * to move in the same frame, so script plays it, reading its keys with `rigPose`.
 *
 * Only transforms and opacity move, so nothing is laid out or painted again while you scroll.
 * Values that depend on the screen's shape come in pairs, `{ l, p }`: landscape and portrait.
 */


type Value = string | { l: string; p: string };
type Key = readonly [at: number, value: Value, ease?: string];
type Prop = "translate" | "transform" | "scale" | "opacity";
type Track = readonly [prop: Prop, keys: readonly Key[]];
type Actor = {
  name: string;
  tracks: readonly Track[];
  /** Where it rests when motion is reduced, and before script runs. */
  rest?: number;
  /** Played by script, not CSS: only its resting place is written as CSS. */
  script?: boolean;
};
export type Layout = "l" | "p";

/** Ease in and out: the default between any two keys. */
const IO = "cubic-bezier(0.65, 0, 0.35, 1)";
/** Arrives fast and settles: things entering. */
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const STEP = "steps(1, end)";
/** iOS's own push between screens: quick to start, long to settle. */
const IN_OUT_IOS = "cubic-bezier(0.32, 0.72, 0, 1)";
// A key's timing function shapes the way from that key to the next.

const lp = (l: string, p: string) => ({ l, p });

/*
 * Where the phone is, as an offset from the middle of the screen. Landscape keeps the phone to the
 * right of the words from the ideas on; portrait keeps the words above it.
 */
export const POS = {
  hero: lp("0px 3svh", "0px 25svh"),
  // On a phone: centred in the room the words above and the button below leave it.
  center: lp("0px 0px", "0px 9svh"),
  side: lp("17vw 0px", "0px 9svh"),
  /** Filming: a touch higher, drifting up as the take goes on. */
  film: lp("17vw -2svh", "0px 8.5svh"),
  filmed: lp("17vw -4svh", "0px 7.5svh"),
  lift: lp("15vw -12svh", "0px 2svh"),
  end: lp("17vw 0px", "0px 11svh"),
};

/** The scenes, by where they start. StoryDriver uses these to know which one is on. */
export const SCENES = [
  ["hero", 0],
  ["turn", 0.039],
  ["ideas", 0.29],
  /** The screen becomes the camera, and the recording counts down. */
  ["film", 0.52],
  ["edit", 0.687],
  ["paid", 0.844],
  ["end", 0.933],
] as const;

const rot = (x: number, y: number, z: number) => `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;

/** A line of words that rises in, holds, and lifts away. */
function beat(name: string, from: number, to: number, last = false): Actor {
  const keysO: Key[] = [
    [from, "0"],
    [from + 0.02, "1"],
  ];
  const keysT: Key[] = [
    [from, "0px 5svh", OUT],
    [from + 0.03, "0px 0px"],
  ];
  if (!last) {
    keysO.push([to - 0.018, "1"], [to, "0"]);
    keysT.push([to - 0.02, "0px 0px"], [to, "0px -4svh"]);
  }
  const tracks: Track[] = [
    ["opacity", keysO],
    ["translate", keysT],
  ];
  return { name, rest: from + 0.03, tracks };
}

/** The four kinds of idea, named in turn while the phone opens each one. */
const FORMAT_AT = [0.335, 0.371, 0.407, 0.443];
function format(i: number): Actor[] {
  const on = FORMAT_AT[i];
  const off = on + 0.036;
  const lit: Key[] = [
    [on - 0.0045, "0.28"],
    [on + 0.0045, "1"],
    [off - 0.0045, "1"],
    [off + 0.0045, "0.28"],
  ];
  const shown = lit.map(([a, v]) => [a, v === "1" ? "1" : "0"] as Key);
  return [
    { name: `fmt${i}`, tracks: [["opacity", lit]] },
    { name: `fmt-dot${i}`, tracks: [["opacity", shown]] },
    { name: `fmt-say${i}`, tracks: [["opacity", shown]] },
  ];
}

/** The Create screen, then each format's screen in turn, each one pushed in from the right. */
function formatScreens(): Actor[] {
  const swap = (at: number): [number, number] => [at - 0.006, at + 0.006];
  // When each screen comes in; the last one leaves as the camera opens.
  const ins = FORMAT_AT.map(swap);
  const outs = [...ins.slice(1), [0.512, 0.528] as [number, number]];
  const screen = (name: string, into: [number, number] | null, out: [number, number]): Actor => ({
    name,
    rest: into ? into[1] : 0,
    tracks: [
      ["opacity", into ? [[into[0] - 0.0005, "0", STEP], [into[0], "1"], [out[1] - 0.0005, "1", STEP], [out[1], "0"]] : [[out[1] - 0.0005, "1", STEP], [out[1], "0"]]],
      ["translate", into ? [[into[0], "100% 0px", IN_OUT_IOS], [into[1], "0% 0px"], [out[0], "0% 0px", IN_OUT_IOS], [out[1], "-30% 0px"]] : [[out[0], "0% 0px", IN_OUT_IOS], [out[1], "-30% 0px"]]],
    ],
  });
  return [screen("scr-create", null, ins[0]), ...FORMAT_AT.map((_, i) => screen(`scr-fmt${i}`, ins[i], outs[i]))];
}

const ACTORS: Actor[] = [
  // The phone.
  {
    name: "rig",
    rest: 0,
    script: true,
    tracks: [
      [
        "translate",
        [
          [0.039, POS.hero],
          [0.168, POS.center],
          [0.235, POS.center],
          [0.313, POS.side],
          [0.503, POS.side],
          [0.536, POS.film],
          [0.687, POS.filmed],
          [0.726, POS.lift],
          [0.805, POS.center],
          [0.927, POS.center],
          [0.983, POS.end],
        ],
      ],
      [
        "transform",
        [
          [0, rot(5, -16, -2)],
          [0.039, rot(5, -16, -2)],
          [0.173, rot(-2, 180, 0)],
          [0.235, rot(-6, 198, 3)],
          [0.318, rot(0, 352, 0)],
          [0.503, rot(0, 358, 0)],
          // It turns a little toward the words, like a phone held up to film.
          [0.536, rot(3, 346, -1.5)],
          [0.687, rot(-2, 352, 1.5)],
          [0.726, rot(12, 360, 5)],
          [0.805, rot(0, 720, 0)],
          [0.927, rot(0, 720, 0)],
          [0.983, rot(2, 706, -1)],
        ],
      ],
      [
        "scale",
        [
          [0.503, "1"],
          [0.536, "1.03"],
          [0.687, "1.03"],
          [0.726, "1.08"],
          [0.805, "1"],
        ],
      ],
    ],
  },

  // What's on the display. Each kind of idea opens as the list names it, pushed in like the app's
  // own screens; the film screen gives way to the edit while the phone's back is turned.
  ...formatScreens(),
  { name: "scr-film", tracks: [["opacity", [[0.512, "0"], [0.528, "1"], [0.7645, "1", STEP], [0.7665, "0"]]]] },
  { name: "scr-edit", tracks: [["opacity", [[0.7645, "0", STEP], [0.7665, "1"], [0.849, "1"], [0.864, "0"]]]] },
  { name: "scr-wallet", tracks: [["opacity", [[0.849, "0"], [0.864, "1"], [0.933, "1"], [0.95, "0"]]]] },
  { name: "scr-end", tracks: [["opacity", [[0.933, "0"], [0.95, "1"]]]] },
  // The light sliding over the glass as it turns.
  { name: "glare", tracks: [["translate", [[0.039, "-30% 0px"], [0.112, "70% 0px"], [0.224, "-70% 0px"], [0.318, "10% 0px"], [0.503, "0% 0px"], [0.536, "60% 0px"], [0.693, "-40% 0px"], [0.805, "40% 0px"]]]] },
  { name: "sheen", tracks: [["translate", [[0.089, "-60% 0px"], [0.235, "50% 0px"], [0.726, "-60% 0px"], [0.805, "60% 0px"]]]] },

  // The hero: the headline parts round the phone, the rest fades.
  {
    name: "get",
    rest: 0,
    tracks: [
      ["translate", [[0.009, "0px 0px"], [0.078, lp("-12vw 0px", "0px -6svh")]]],
      ["opacity", [[0.009, "1"], [0.062, "0"]]],
    ],
  },
  {
    name: "film",
    rest: 0,
    tracks: [
      ["translate", [[0.009, "0px 0px"], [0.078, lp("12vw 0px", "0px -6svh")]]],
      ["opacity", [[0.009, "1"], [0.062, "0"]]],
    ],
  },
  {
    name: "aside",
    rest: 0,
    tracks: [
      ["translate", [[0.0045, "0px 0px"], [0.045, "0px -3svh"]]],
      ["opacity", [[0.0045, "1"], [0.039, "0"]]],
    ],
  },

  // The aura stays faintly behind the phone in every scene, so a black phone never sinks into black.
  {
    name: "aura",
    rest: 0,
    tracks: [
      ["translate", [[0.039, "0px 0px"], [0.168, lp("0px -3svh", "0px -16svh")], [0.235, lp("0px -3svh", "0px -16svh")], [0.313, lp("17vw -6svh", "0px -16svh")], [0.693, lp("17vw -6svh", "0px -16svh")], [0.805, lp("0px -3svh", "0px -16svh")], [0.927, lp("0px -3svh", "0px -16svh")], [0.983, lp("17vw -3svh", "0px -14svh")]]],
      ["scale", [[0.039, "1"], [0.168, "0.8"], [0.844, "0.8"], [0.922, "1", OUT]]],
      ["opacity", [[0.039, "1"], [0.168, "0.4"], [0.503, "0.4"], [0.536, "0.55"], [0.687, "0.55"], [0.726, "0.4"], [0.844, "0.4"], [0.911, "1"]]],
    ],
  },

  // The words.
  beat("beat-phone", 0.101, 0.246),
  beat("beat-idea", 0.313, 0.486),
  ...format(0),
  ...format(1),
  ...format(2),
  ...format(3),
  beat("beat-film", 0.537, 0.682),
  beat("beat-edit", 0.777, 0.849),
  beat("beat-paid", 0.872, 0.927),
  beat("beat-end", 0.95, 1, true),

  // The button that stays within reach between the hero and the end.
  {
    name: "pill",
    tracks: [["opacity", [[0.05, "0"], [0.073, "1"], [0.916, "1"], [0.933, "0"]]]],
  },
];

const ALL = ACTORS;


const pct = (at: number) => `${+(at * 100).toFixed(3)}%`;
const pick = (v: Value, layout: Layout) => (typeof v === "string" ? v : v[layout]);
const MOTION: Prop[] = ["translate", "transform", "scale"];

/** Keys with the first and last held to either end, in order. */
function normalize(keys: readonly Key[]): Key[] {
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  if (ks[0][0] > 0) ks.unshift([0, ks[0][1], ks[0][2]]);
  if (ks[ks.length - 1][0] < 1) ks.push([1, ks[ks.length - 1][1]]);
  return ks;
}

function keyframes(name: string, prop: Prop, keys: readonly Key[], layout: Layout) {
  const body = normalize(keys)
    .map(([at, v, ease]) => `${pct(at)}{${prop}:${pick(v, layout)};animation-timing-function:${ease ?? IO}}`)
    .join("");
  return `@keyframes ${name}{${body}}`;
}

/** The value a track holds at a point, for where things rest when motion is reduced. */
function valueAt(keys: readonly Key[], at: number, layout: Layout) {
  const ks = normalize(keys);
  let v = ks[0][1];
  for (const k of ks) if (k[0] <= at) v = k[1];
  return pick(v, layout);
}

const perLayout = (keys: readonly Key[]) => keys.some(([, v]) => typeof v !== "string");

/** Every actor's keyframes, and which of them each actor plays. */
export function storyCss(extra: Actor[] = []): string {
  const actors = [...ALL, ...extra];
  const both: string[] = [];
  const land: string[] = [];
  const port: string[] = [];
  const reduced: string[] = [];

  for (const a of actors) {
    if (a.script) {
      for (const [prop, keys] of a.tracks) {
        land.push(`.s-${a.name}{${prop}:${valueAt(keys, a.rest ?? 0, "l")}}`);
        port.push(`.s-${a.name}{${prop}:${valueAt(keys, a.rest ?? 0, "p")}}`);
      }
      continue;
    }
    const names: string[] = [];
    const still: string[] = [];
    for (const [prop, keys] of a.tracks) {
      const name = `s-${a.name}-${prop}`;
      names.push(name);
      if (perLayout(keys)) {
        land.push(keyframes(name, prop, keys, "l"));
        port.push(keyframes(name, prop, keys, "p"));
      } else {
        both.push(keyframes(name, prop, keys, "l"));
      }
      if (MOTION.includes(prop)) {
        // With reduced motion the move is dropped and the actor simply rests where it reads best.
        const at = a.rest ?? 0;
        land.push(`.s-${a.name}{${prop}:${valueAt(keys, at, "l")}}`);
        port.push(`.s-${a.name}{${prop}:${valueAt(keys, at, "p")}}`);
      } else {
        still.push(name);
      }
    }
    both.push(`.s-${a.name}{animation-name:${names.join(",")}}`);
    reduced.push(`.s-${a.name}{animation-name:${still.length ? still.join(",") : "none"}}`);
  }

  return [
    ...both,
    `@media (orientation:landscape){${land.join("")}}`,
    `@media (orientation:portrait){${port.join("")}}`,
    `@media (prefers-reduced-motion:reduce){${reduced.join("")}}`,
  ].join("\n");
}

/*
 * Reading the timeline from script, the way the browser plays it: between two keys, the time
 * eased by the first key's timing function, each number interpolated. Lengths are resolved to
 * pixels by the caller (vw and svh depend on the screen), angles stay in degrees.
 */

/** Turns a number and its unit into pixels (or leaves degrees and plain numbers as they are). */
export type Resolve = (n: number, unit: string) => number;

/** `cubic-bezier()` as the browser computes it: solve for time on x, read y. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const coord = (t: number, a: number, b: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x: number) => {
    if (x <= 0 || x >= 1) return x;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      if (coord(mid, x1, x2) < x) lo = mid;
      else hi = mid;
    }
    return coord((lo + hi) / 2, y1, y2);
  };
}

const eases = new Map<string, (t: number) => number>();
function ease(name: string) {
  let f = eases.get(name);
  if (!f) {
    const n = name.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
    f = name.startsWith("cubic-bezier") ? bezier(n[0], n[1], n[2], n[3]) : name.startsWith("steps") ? (t: number) => (t < 1 ? 0 : 1) : (t: number) => t;
    eases.set(name, f);
  }
  return f;
}

const NUMBER = /(-?\d*\.?\d+)(px|vw|svh|deg|%)?/g;
const parsed = new Map<string, [number, string][]>();
function numbers(v: string) {
  let n = parsed.get(v);
  if (!n) {
    n = [...v.matchAll(NUMBER)].map((m) => [Number(m[1]), m[2] ?? ""]);
    parsed.set(v, n);
  }
  return n;
}

const tracks = new Map<string, Key[]>();
function keysOf(actor: string, prop: Prop) {
  const id = `${actor}/${prop}`;
  let keys = tracks.get(id);
  if (!keys) {
    const found = ALL.find((a) => a.name === actor)?.tracks.find(([p]) => p === prop)?.[1];
    if (!found) throw new Error(`No ${prop} track on ${actor}`);
    keys = normalize(found);
    tracks.set(id, keys);
  }
  return keys;
}

/** Where one of an actor's tracks stands at a point on the timeline, as numbers. */
export function sample(actor: string, prop: Prop, at: number, layout: Layout, resolve: Resolve): number[] {
  const keys = keysOf(actor, prop);
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1][0] <= at) i++;
  const [a0, v0, e] = keys[i];
  const [a1, v1] = keys[i + 1];
  const t = a1 > a0 ? Math.min(1, Math.max(0, (at - a0) / (a1 - a0))) : 1;
  const k = ease(e ?? IO)(t);
  const to = numbers(pick(v1, layout));
  return numbers(pick(v0, layout)).map(([n, u], j) => {
    const from = resolve(n, u);
    return from + (resolve(to[j][0], to[j][1]) - from) * k;
  });
}

/** The phone: its offset from the middle of the screen (px), its turn (degrees) and its scale. */
export type Pose = { x: number; y: number; rx: number; ry: number; rz: number; s: number };
export type PhonePosition = readonly [at: number, y: number];

export function rigPose(at: number, layout: Layout, resolve: Resolve, positions: readonly PhonePosition[] = []): Pose {
  const [x, fallbackY] = sample("rig", "translate", at, layout, resolve);
  let y = fallbackY;
  if (layout === "p" && positions.length > 1) {
    let i = 0;
    while (i < positions.length - 2 && positions[i + 1][0] <= at) i++;
    const [from, y0] = positions[i];
    const [to, y1] = positions[i + 1];
    const t = Math.min(1, Math.max(0, (at - from) / (to - from)));
    y = y0 + (y1 - y0) * ease(IO)(t);
  }
  const [rx, ry, rz] = sample("rig", "transform", at, layout, resolve);
  const [s] = sample("rig", "scale", at, layout, resolve);
  return { x, y, rx, ry, rz, s };
}
