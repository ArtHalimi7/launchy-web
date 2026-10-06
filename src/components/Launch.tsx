import { WORDMARK } from "@/lib/brand-paths";

/*
 * The launch, the app's own (launchy-app, src/design/launch.tsx), for the web: the full stop writes
 * the name.
 *
 * The cream full stop fades up in the middle, glides to where the script begins and shrinks to a
 * pen, and writes "launchy" in one line, the ink following it. Where the line ends the pen lifts
 * and lands as the full stop, and the ink settles into the artwork's exact shape. The stop gathers,
 * pops, a ring goes out, and the stop opens into a hole with an ember rim that grows until the
 * page, already there underneath, is all there is.
 *
 * All CSS, on one clock, so it plays from the first frame, before any script, and nothing in it can
 * fall out of step. The pen rides the script's measured path (`offset-path`). With motion reduced,
 * the finished wordmark simply shows, then fades.
 */

const { w, h, stroke, strokeWidth, length, dot, outline, tipX, tipY } = WORDMARK;

/** The word is written 280px wide, as in the app. */
const WORD = 280;
const K = WORD / w;
const R = dot.r * K;
/** The stop's place, from the middle of the screen. */
const STOP = { x: (dot.cx - w / 2) * K, y: (dot.cy - h / 2) * K };
/** A little longer than the path, so rounding never leaves the last millimetre unwritten. */
const DASH = length * 1.03;

// The pen's whole way, in the wordmark's own units: from the middle to the start of the script,
// along the script, and from its end to the full stop.
const mid = [w / 2, h / 2];
const start = [tipX[0], tipY[0]];
const end = [tipX[tipX.length - 1], tipY[tipY.length - 1]];
const glide = Math.hypot(start[0] - mid[0], start[1] - mid[1]);
const land = Math.hypot(dot.cx - end[0], dot.cy - end[1]);
const way = glide + length + land;
const MOTION = `M${mid[0]} ${mid[1]}L${start[0]} ${start[1]}${stroke.replace(/^M\s*-?[\d.]+[ ,]-?[\d.]+/, "")}L${dot.cx} ${dot.cy}`;

// The moments, in seconds (the app's own).
const T = {
  shown: 0.16,
  write: 0.48,
  written: 1.48,
  landed: 1.72,
  charged: 1.94,
  open: 2.1,
  opened: 2.72,
  gone: 2.76,
};

const EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
const HAND = "cubic-bezier(0.42, 0, 0.3, 1)";
const PORTAL = "cubic-bezier(0.72, 0, 0.18, 1)";
const OUT_QUAD = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const IN_OUT_CUBIC = "cubic-bezier(0.65, 0, 0.35, 1)";

type Key = [at: number, value: string, ease?: string];

/** One property's keyframes on the launch's clock, from absolute times, each held to the end. */
function track(name: string, prop: string, keys: Key[]) {
  const last = keys[keys.length - 1];
  if (last[0] < T.gone) keys = [...keys, [T.gone, last[1]]];
  const body = keys.map(([at, v, ease]) => `${+((at / T.gone) * 100).toFixed(3)}%{${prop}:${v}${ease ? `;animation-timing-function:${ease}` : ""}}`).join("");
  return { name, css: `@keyframes ${name}{${body}}` };
}

const tracks = {
  line: [
    track("l-line-o", "opacity", [[0, "0"], [T.write - 0.001, "0"], [T.write, "1"], [T.written - 0.06, "1", OUT_QUAD], [T.written + 0.2, "0"]]),
    track("l-line-d", "stroke-dashoffset", [[0, `${DASH}`], [T.write, `${DASH}`, HAND], [T.written, "0"]]),
  ],
  outline: [track("l-outline", "opacity", [[0, "0"], [T.written - 0.06, "0", OUT_QUAD], [T.written + 0.2, "1"]])],
  word: [track("l-word", "opacity", [[0, "1"], [T.open, "1"], [T.open + 0.2, "0"]])],
  pen: [
    track("l-pen-at", "offset-distance", [[0, "0%"], [T.shown, "0%", EXPO], [T.write, `${((glide / way) * 100).toFixed(3)}%`, HAND], [T.written, `${(((glide + length) / way) * 100).toFixed(3)}%`, EXPO], [T.landed, "100%"]]),
    track("l-pen-o", "opacity", [[0, "0", OUT_QUAD], [T.shown, "1"], [T.open, "1"], [T.open + 0.08, "0"]]),
  ],
  // The stop's size (a smaller pen while it writes), then gather and pop. On the dot, not the pen:
  // a scale on the element riding the path would scale the path too.
  dot: [
    track("l-dot-size", "scale", [[0, "1"], [T.shown, "1", EXPO], [T.write, "0.6"], [T.written, "0.6", EXPO], [T.landed, "1"]]),
    track("l-dot", "transform", [
      [0, "translateY(0) scale(1, 1)"],
      [T.landed, "translateY(0) scale(1, 1)", IN_OUT_CUBIC],
      [T.charged, `translateY(${dot.r * 0.18}px) scale(1.16, 0.84)`, OUT_QUAD],
      [T.charged + 0.117, `translateY(${dot.r * 0.06}px) scale(1.25, 1.17)`, EXPO],
      [T.charged + 0.48, "translateY(0) scale(1, 1)"],
    ]),
  ],
  ping: [
    track("l-ping-s", "scale", [[0, "1"], [T.charged, "1", EXPO], [T.gone, "4.2"]]),
    track("l-ping-o", "opacity", [[0, "0"], [T.charged, "0"], [T.charged + 0.033, "0.9"], [T.charged + 0.45, "0.35"], [T.gone, "0"]]),
  ],
  // The ground: ink, then a hole the size of the stop, growing past the corners.
  ground: [
    track("l-hole", "--hole", [[0, "-3px"], [T.open - 0.001, "-3px"], [T.open, `${R}px`, PORTAL], [T.opened, "150vmax"]]),
    track("l-rim", "--rim", [[0, "0"], [T.open - 0.001, "0"], [T.open, "1"], [T.open + (T.opened - T.open) * 0.55, "0.7"], [T.opened, "0"]]),
    track("l-off", "visibility", [[0, "visible"], [T.gone - 0.001, "visible"], [T.gone, "hidden"]]),
  ],
};

const run = (ts: { name: string }[]) => ts.map((t) => `${t.name} ${T.gone}s linear both`).join(",");

const CSS = [
  ...Object.values(tracks).flatMap((ts) => ts.map((t) => t.css)),
  `.launch{--stop-x:calc(50% + ${STOP.x.toFixed(2)}px * var(--m));--stop-y:calc(50% + ${STOP.y.toFixed(2)}px * var(--m));animation:${run(tracks.ground)}}`,
  `.launch-mark{animation:${run(tracks.word)}}`,
  `.launch-ink,.launch-host{left:${-WORD / 2}px;top:${(-(h * K) / 2).toFixed(3)}px}`,
  `.launch-ink{width:${WORD}px;height:${(h * K).toFixed(3)}px}`,
  `.launch-line{stroke-dasharray:${DASH} ${DASH};animation:${run(tracks.line)}}`,
  `.launch-outline{animation:${run(tracks.outline)}}`,
  `.launch-host{width:${w}px;height:${h}px;scale:${K.toFixed(6)}}`,
  `.launch-pen{width:${dot.r * 2}px;height:${dot.r * 2}px;offset-path:path("${MOTION}");animation:${run(tracks.pen)}}`,
  `.launch-dot{animation:${run(tracks.dot)}}`,
  `.launch-ping{left:${(STOP.x - R).toFixed(2)}px;top:${(STOP.y - R).toFixed(2)}px;width:${(R * 2).toFixed(2)}px;height:${(R * 2).toFixed(2)}px;animation:${run(tracks.ping)}}`,
  `.launch-still{left:${-WORD / 2}px;top:${(-(h * K) / 2).toFixed(3)}px;width:${WORD}px;height:${(h * K).toFixed(3)}px}`,
].join("\n");

export function Launch() {
  return (
    <div className="launch" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="launch-mark">
        <svg className="launch-ink launch-motion" viewBox={`0 0 ${w} ${h}`}>
          <path className="launch-outline" d={outline} fillRule="evenodd" />
          <path className="launch-line" d={stroke} fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <i className="launch-ping launch-motion" />
        <div className="launch-host launch-motion">
          <i className="launch-pen">
            <i className="launch-dot" />
          </i>
        </div>
        <svg className="launch-still" viewBox={`0 0 ${w} ${h}`}>
          <path d={outline} fillRule="evenodd" />
          <circle cx={dot.cx} cy={dot.cy} r={dot.r} />
        </svg>
      </div>
    </div>
  );
}
