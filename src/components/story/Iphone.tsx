import type { CSSProperties, ReactNode } from "react";

/*
 * iPhone 18 Pro Max, in CSS 3D, measured off the 3D model the page draws it with
 * (public/models/iphone.glb): 163.3 × 79.0 × 8.7 mm, a 73.0 × 158.5 mm display with 12 mm
 * corners, and the 18's narrower Dynamic Island. Everything is a fraction of the phone's width,
 * `--pw`, so the page sizes the phone with one number.
 *
 * Once the model has loaded (PhoneGL), only the display is shown from here: it lies exactly on the
 * model's screen. Until then, and wherever WebGL isn't available, this is the whole phone: a front,
 * a back, and a band of flat strips round the edge (straight sides, and each rounded corner cut
 * into a few facets), each one turned to face outward, with the light baked in by where it faces.
 */

const WIDTH_MM = 78.97;
const mm = (v: number) => v / WIDTH_MM;
const len = (f: number) => `calc(var(--pw) * ${+f.toFixed(5)})`;

const BODY = { h: mm(163.34), d: mm(8.7), r: mm(14), rim: mm(0.75) };
const DISPLAY = { x: mm(2.965), y: mm(2.425), r: mm(12) };
/** The 18 Pro's island: a quarter narrower than the 17's. */
const ISLAND = { w: mm(15.4), h: mm(5.69), top: mm(2.54) };

/** The display's own shape, for laying screens out on it. */
export const SCREEN = {
  /** Height over width. */
  aspect: (BODY.h - 2 * DISPLAY.y) / (1 - 2 * DISPLAY.x),
  /** Width as a fraction of the phone's. */
  width: 1 - 2 * DISPLAY.x,
};

/** Corners are cut into this many facets: enough that the edge reads as round when it turns. */
const FACETS = 5;
/** Where the light comes from, as a direction in the screen's plane (x right, y down). */
const LIGHT = norm(-0.55, -0.83);

function norm(x: number, y: number): [number, number] {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
}

type Strip = { key: string; cx: number; cy: number; w: number; normal: number; buttons?: Button[] };
type Button = { from: number; to: number; kind?: "control" };

/** The phone's buttons, in millimetres from the top. Left: Action, volume up and down. Right: side button and Camera Control. */
const LEFT_BUTTONS: Button[] = [
  { from: 28, to: 36.5 },
  { from: 43, to: 56 },
  { from: 60, to: 73 },
];
const RIGHT_BUTTONS: Button[] = [
  { from: 45, to: 66 },
  { from: 108.5, to: 127.5, kind: "control" },
];

function strips(): Strip[] {
  const { h, r } = BODY;
  const out: Strip[] = [
    { key: "t", cx: 0.5, cy: 0, w: 1 - 2 * r, normal: -90 },
    { key: "r", cx: 1, cy: h / 2, w: h - 2 * r, normal: 0, buttons: RIGHT_BUTTONS },
    { key: "b", cx: 0.5, cy: h, w: 1 - 2 * r, normal: 90 },
    { key: "l", cx: 0, cy: h / 2, w: h - 2 * r, normal: 180, buttons: LEFT_BUTTONS },
  ];
  const corners: [number, number, number][] = [
    [1 - r, r, -90],
    [1 - r, h - r, 0],
    [r, h - r, 90],
    [r, r, 180],
  ];
  const step = 90 / FACETS;
  const rad = (d: number) => (d * Math.PI) / 180;
  for (const [x, y, from] of corners) {
    for (let i = 0; i < FACETS; i++) {
      const a = from + (i + 0.5) * step;
      // Inscribed facets, a touch wider than their chord so neighbours meet without a hairline.
      const dist = r * Math.cos(rad(step / 2));
      out.push({
        key: `c${from}-${i}`,
        cx: x + dist * Math.cos(rad(a)),
        cy: y + dist * Math.sin(rad(a)),
        w: 2 * r * Math.sin(rad(step / 2)) * 1.06,
        normal: a,
      });
    }
  }
  return out;
}

/**
 * One strip of the edge, standing on its long side. It's laid flat facing up (`rotateX(90deg)`),
 * then turned about the phone's depth axis so it faces its own way out. Along its height runs the
 * phone's thickness: back at the top, front at the bottom.
 */
function stripStyle(s: Strip): CSSProperties {
  const n = (s.normal * Math.PI) / 180;
  const lit = Math.cos(n) * LIGHT[0] + Math.sin(n) * LIGHT[1];
  const shade = (0.38 * (1 - (lit + 1) / 2)).toFixed(3);
  const glint = Math.max(0, lit - 0.55) * 0.9;
  return {
    left: len(s.cx - s.w / 2),
    top: `calc(${len(s.cy)} - var(--pd) / 2)`,
    width: len(s.w),
    transform: `rotateZ(${+(s.normal + 90).toFixed(3)}deg) rotateX(90deg)`,
    backgroundImage: `linear-gradient(rgba(255,255,255,${glint.toFixed(3)}), rgba(0,0,0,${shade})), var(--ip-edge)`,
  };
}

/** Where a button sits along its strip, which runs bottom-to-top on the left and top-to-bottom on the right. */
function buttonStyle(strip: Strip, b: Button): CSSProperties {
  const { h, r } = BODY;
  const start = strip.key === "l" ? h - r - mm(b.to) : mm(b.from) - r;
  return { left: len(start), width: len(mm(b.to - b.from)) };
}

const EDGE = strips();

/**
 * The phone. `children` is what's on its display, laid out on a box the display's exact size,
 * which is also a size container, so screens can be drawn in `cqw`.
 */
export function Iphone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`ip ${className}`}>
      <div className="ip-face ip-front">
        <div className="ip-glass" style={{ inset: len(BODY.rim), borderRadius: len(BODY.r - BODY.rim) }}>
          <div
            className="ip-display"
            style={{
              left: len(DISPLAY.x - BODY.rim),
              top: len(DISPLAY.y - BODY.rim),
              right: len(DISPLAY.x - BODY.rim),
              bottom: len(DISPLAY.y - BODY.rim),
              borderRadius: len(DISPLAY.r),
            }}>
            {children}
            <i
              className="ip-island"
              style={{ width: len(ISLAND.w), height: len(ISLAND.h), top: len(ISLAND.top), marginLeft: len(-ISLAND.w / 2) }}
              aria-hidden
            />
          </div>
          <i className="ip-glare s-glare" data-a aria-hidden />
        </div>
      </div>

      <div className="ip-face ip-back" aria-hidden>
        <div className="ip-plateau">
          <i className="ip-lens" style={{ left: "17.3%", top: "28.2%" }} />
          <i className="ip-lens" style={{ left: "17.3%", top: "73.5%" }} />
          <i className="ip-lens" style={{ left: "38.5%", top: "50.9%" }} />
          <i className="ip-flash" style={{ left: "82%", top: "27%" }} />
          <i className="ip-lidar" style={{ left: "82%", top: "73%" }} />
          <i className="ip-mic" style={{ left: "68%", top: "20%" }} />
        </div>
        <div className="ip-panel" />
        <i className="ip-sheen s-sheen" data-a />
      </div>

      {EDGE.map((s) => (
        <i key={s.key} className="ip-edge" style={stripStyle(s)} aria-hidden>
          {s.buttons?.map((b) => (
            <i key={b.from} className={b.kind === "control" ? "ip-btn ip-btn-control" : "ip-btn"} style={buttonStyle(s, b)} />
          ))}
        </i>
      ))}
    </div>
  );
}
