// The CRT.
//
// T pointed at fabiodicec.ca on 2026-08-23 and asked for the beige tube
// monitor sitting on the desktop as a physical object. Drawn rather than
// photographed: no licensing question, stays crisp at any size, and it reads
// as part of the same world as the icons instead of a cut out photo dropped
// on top of them.
//
// The screen is a placeholder. T's plan for it, parked in TICKETS.md: a mix of
// old PickleTrack clips, product building, and the funnier parts of the MSBA
// program. Everything on it stays tech and building related.

export function Crt() {
  return (
    <div className="mac-crt" aria-hidden>
      <svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Scanlines. One pixel on, one pixel off, which is the whole trick. */}
          <pattern id="crt-scan" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="#000" opacity="0.34" />
          </pattern>
          <linearGradient id="crt-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7b8f9c" />
            <stop offset="48%" stopColor="#4a5a66" />
            <stop offset="100%" stopColor="#232c34" />
          </linearGradient>
        </defs>

        {/* Case. Warm beige with the yellowed edge every one of these had. */}
        <path d="M18 16h284v208H18z" fill="#e2dcc9" stroke="#000" strokeWidth="2" />
        <path d="M18 16h284v10H18z" fill="#efe9d7" />
        <path d="M290 26h12v198h-12z" fill="#cfc8b4" />

        {/* Bezel and tube. The screen corners are rounded because the glass was. */}
        <rect x="40" y="36" width="240" height="168" rx="14" fill="#2a3138" stroke="#000" strokeWidth="2" />
        <rect x="48" y="44" width="224" height="152" rx="10" fill="url(#crt-glow)" />
        <rect x="48" y="44" width="224" height="152" rx="10" fill="url(#crt-scan)" />

        {/* The placeholder card on screen, in the site's own bitmap voice. */}
        <rect x="96" y="98" width="128" height="44" fill="#0d1216" opacity="0.55" />
        <text
          x="160"
          y="118"
          textAnchor="middle"
          fontFamily="Silkscreen, monospace"
          fontSize="14"
          fill="#cfe3ea"
        >
          NO SIGNAL
        </text>
        <text
          x="160"
          y="134"
          textAnchor="middle"
          fontFamily="Silkscreen, monospace"
          fontSize="11"
          fill="#7f98a3"
        >
          CH 03
        </text>

        {/* Glass reflection, one soft diagonal, not a whole shine layer. */}
        <path d="M56 52h64l-52 140H56z" fill="#ffffff" opacity="0.05" />

        {/* Front panel: vents, buttons, and the two coloured caps that every
            mid nineties monitor inexplicably had. */}
        <rect x="18" y="224" width="284" height="34" fill="#d9d2be" stroke="#000" strokeWidth="2" />
        <circle cx="52" cy="241" r="5" fill="#3b3b3b" />
        <rect x="76" y="236" width="30" height="9" rx="4" fill="#3b3b3b" />
        <rect x="114" y="236" width="30" height="9" rx="4" fill="#3b3b3b" />
        <rect x="238" y="234" width="13" height="13" fill="#9d9ae0" />
        <rect x="256" y="234" width="13" height="13" fill="#b48fd0" />
        <circle cx="286" cy="241" r="4" fill="#6e8a5a" />

        {/* Stand. */}
        <path d="M96 258h128l16 26H80z" fill="#cfc8b4" stroke="#000" strokeWidth="2" />
      </svg>
    </div>
  )
}
