import "./robot-mascot.css";

/** A friendly companion that peeks out from behind the phone when the story settles. */
export function RobotMascot() {
  return (
    <div className="robot-lane" data-mood="hidden" aria-hidden="true">
      <div className="robot-runner">
        <svg className="robot" viewBox="0 0 80 88" fill="none">
          <defs>
            <linearGradient id="robot-shell" x1="21" y1="16" x2="61" y2="65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF9EF" /><stop offset="0.55" stopColor="#E9E4DB" /><stop offset="1" stopColor="#AAA6A0" />
            </linearGradient>
            <linearGradient id="robot-orange" x1="25" y1="7" x2="56" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFBA76" /><stop offset="1" stopColor="#FF5A1F" />
            </linearGradient>
            <linearGradient id="robot-visor" x1="28" y1="24" x2="50" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#333139" /><stop offset="1" stopColor="#101014" />
            </linearGradient>
          </defs>
          <g className="robot-legs-rest">
            <path d="M33 65V77M46 65V77" stroke="#CBC6BE" strokeWidth="7" strokeLinecap="round" />
            <path d="M28 79H35M43 79H51" stroke="#FFF9EF" strokeWidth="6" strokeLinecap="round" />
          </g>
          <g className="robot-personality">
            <g className="robot-body">
              <g className="robot-arm-back">
                <path d="M27 52L20 63" stroke="#B5B0A8" strokeWidth="6" strokeLinecap="round" />
                <circle cx="20" cy="64" r="4" fill="url(#robot-orange)" />
              </g>
              <rect x="26" y="44" width="28" height="24" rx="10" fill="url(#robot-shell)" />
              <path d="M33 48H46" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
              <rect x="33" y="52" width="15" height="11" rx="5" fill="url(#robot-orange)" />
              <path d="M40.5 60L37 57.5C34 55 38 52.5 40.5 55C43 52.5 47 55 44 57.5L40.5 60Z" fill="#FFF8EA" />
              <g className="robot-head">
                <path d="M38 17L35 8" stroke="#CBC6BE" strokeWidth="3" strokeLinecap="round" />
                <circle className="robot-antenna" cx="34" cy="6" r="4" fill="url(#robot-orange)" />
                <rect x="10" y="26" width="7" height="13" rx="3.5" fill="url(#robot-orange)" />
                <rect x="62" y="26" width="7" height="13" rx="3.5" fill="url(#robot-orange)" />
                <rect x="14" y="16" width="51" height="32" rx="14" fill="url(#robot-shell)" />
                <path d="M25 20H50" stroke="white" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="19" y="24" width="41" height="19" rx="9" fill="url(#robot-visor)" />
                <path d="M24 27H35" stroke="white" strokeOpacity="0.1" strokeWidth="2" strokeLinecap="round" />
                <g className="robot-eyes">
                  <path d="M29 33C29 29 34 29 34 33M45 33C45 29 50 29 50 33" stroke="#FFF8EA" strokeWidth="2.6" strokeLinecap="round" />
                </g>
                <path d="M36 37C38 39 41 39 43 37" stroke="#FFF8EA" strokeWidth="1.7" strokeLinecap="round" />
                <ellipse cx="25" cy="36" rx="2.5" ry="1.3" fill="#FF8D63" opacity="0.65" />
                <ellipse cx="54" cy="36" rx="2.5" ry="1.3" fill="#FF8D63" opacity="0.65" />
              </g>
              <g className="robot-arm-front">
                <path d="M53 51L63 58L69 54" stroke="#E9E4DB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="71" cy="52" r="4.5" fill="url(#robot-orange)" />
                <path d="M73 48L76 46" stroke="#FFAA6A" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
