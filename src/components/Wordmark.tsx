import { MARK, WORDMARK } from "@/lib/brand-paths";

/**
 * The script "launchy." It writes itself once as the page opens: the pen runs along the measured
 * centreline of the letters, clipped to the artwork's exact outline, so what appears is the real
 * logo, stroke by stroke. Pure CSS (globals.css, `.write`), so it plays before any script loads,
 * and reduced motion shows it finished.
 */
export function Wordmark({ className, write = true, id = "wordmark" }: { className?: string; write?: boolean; /** Unique per use on the page: it names the clip path. */ id?: string }) {
  const { w, h, outline, stroke, strokeWidth, dot } = WORDMARK;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label="Launchy">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={outline} clipRule="evenodd" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <path
          d={stroke}
          pathLength={1}
          className={write ? "write" : undefined}
          fill="none"
          stroke="#FF5A1F"
          strokeWidth={strokeWidth * 1.35}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill="#0B0C0E" className={write ? "land" : undefined} />
    </svg>
  );
}

/** The "l." mark on ink: the app's icon, for the middle of the QR code. */
export function AppMark({ className }: { className?: string }) {
  const { w, h, outline, dot } = MARK;
  const pad = w * 0.18;
  return (
    <svg viewBox={`${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`} className={className} aria-hidden>
      <rect x={-pad} y={-pad} width={w + pad * 2} height={h + pad * 2} rx={(w + pad * 2) * 0.22} fill="#0B0C0E" />
      <path d={outline} fill="#FF5A1F" fillRule="evenodd" />
      <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill="#F2EFE8" />
    </svg>
  );
}
