import { useEffect, useRef } from 'react'

// The iMac G3, Blueberry.
//
// Replaced the generic CRT on 2026-08-23. T's argument, and it is the right
// one: the CRT was borrowed from fabiodicec.ca, the iMac is his. He grew up
// around these machines, so the nostalgia has a reason to exist rather than
// being a mood.
//
// Drawn rather than modelled. A real Three.js hero costs a licensed model, a
// megabyte or more of bundle, and a mobile performance problem, all of which
// fight spec section 19. This gets most of the effect for none of that, and
// upgrading to a pre-rendered rotation sequence later does not require
// touching anything else.
//
// Deliberately NOT an eyeball on the screen. That is Fabio's composition. The
// principle being borrowed is the tension between a carefully rendered
// physical object and deliberately crude 640x480 contents, so the screen shows
// a tiny, badly aliased Macintosh desktop instead.

export function Imac() {
  const ref = useRef<HTMLDivElement>(null)

  // Parallax. A few pixels of travel, no more: this is a heavy object sitting
  // on a desk, and anything that moves it far reads as a sticker floating
  // above the page rather than a thing in the scene.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth <= 768) return

    let frame = 0
    function onMove(e: PointerEvent) {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 2
        const dy = (e.clientY / window.innerHeight - 0.5) * 2
        if (el) {
          el.style.transform = `translate3d(${(-dx * 9).toFixed(2)}px, ${(-dy * 6).toFixed(2)}px, 0) rotate(${(-dx * 0.5).toFixed(2)}deg)`
        }
      })
    }

    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="mac-imac" ref={ref} aria-hidden>
      <svg viewBox="0 0 340 390" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Blueberry. Translucent plastic reads as three things at once: a
              tint, something darker seen through it, and a hard specular
              highlight. Miss any one and it goes flat. */}
          <linearGradient id="im-shell" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#949cec" />
            <stop offset="36%" stopColor="#5b63c6" />
            <stop offset="72%" stopColor="#3b4090" />
            <stop offset="100%" stopColor="#282c66" />
          </linearGradient>

          <linearGradient id="im-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4f3f0" />
            <stop offset="72%" stopColor="#e3e1dc" />
            <stop offset="100%" stopColor="#cbc9c3" />
          </linearGradient>

          <radialGradient id="im-inner" cx="0.5" cy="0.4" r="0.66">
            <stop offset="0%" stopColor="#141744" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#141744" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="im-glass" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor="#5f7d88" />
            <stop offset="55%" stopColor="#2b3941" />
            <stop offset="100%" stopColor="#151c21" />
          </linearGradient>

          <pattern id="im-scan" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="1" fill="#000" opacity="0.28" />
          </pattern>
        </defs>

        {/* Shadow on the desk. */}
        <ellipse cx="170" cy="370" rx="122" ry="12" fill="#000" opacity="0.24" />

        {/* The shell. One continuous body: domed top, bulged flanks, a waist
            below the chin, then a splayed foot. The G3 had no separate stand,
            and the silhouette is most of what makes it recognisable. */}
        <path
          d="M170 10
             C252 10 300 52 300 126
             L300 214
             C300 264 274 294 238 306
             C222 311 214 322 214 336
             C214 350 232 360 258 364
             L82 364
             C108 360 126 350 126 336
             C126 322 118 311 102 306
             C66 294 40 264 40 214
             L40 126
             C40 52 88 10 170 10 Z"
          fill="url(#im-shell)"
          stroke="#191c4c"
          strokeWidth="2"
        />

        {/* What you can see through the plastic. The whole point of the
            machine was that the guts were visible, so a hint of them has to be
            there or it is just a blue box. */}
        <ellipse cx="170" cy="160" rx="112" ry="118" fill="url(#im-inner)" />
        <path d="M64 288 h212 v9 H64 z" fill="#1e2258" opacity="0.42" />
        <path d="M92 312 h156 v6 H92 z" fill="#1e2258" opacity="0.32" />
        <path d="M118 330 h104 v5 H118 z" fill="#1e2258" opacity="0.24" />

        {/* Recessed handle in the dome. */}
        <path d="M146 24 h48 a11 11 0 0 1 0 22 h-48 a11 11 0 0 1 0 -22 z" fill="#272b68" opacity="0.6" />
        <path d="M151 29 h38 a6 6 0 0 1 0 12 h-38 a6 6 0 0 1 0 -12 z" fill="#858ee2" opacity="0.45" />

        {/* Front bezel. Off white, the colour every one of these went, and it
            runs well below the tube: that chin is the G3's signature. */}
        <path
          d="M62 56 h216 a30 30 0 0 1 30 30 v134 a30 30 0 0 1 -30 30 h-216
             a30 30 0 0 1 -30 -30 v-134 a30 30 0 0 1 30 -30 z"
          fill="url(#im-bezel)"
          stroke="#191c4c"
          strokeWidth="2"
        />

        {/* Tube. Rounded because the glass was, inset because it sat back. */}
        <rect x="58" y="70" width="224" height="132" rx="18" fill="#191f24" />
        <rect x="64" y="76" width="212" height="120" rx="14" fill="url(#im-glass)" />

        {/* --- The crude 640x480 contents. Aliased on purpose. The tension
            between a carefully drawn object and deliberately bad graphics is
            the principle borrowed from Fabio, rather than his composition. --- */}
        <g>
          <rect x="68" y="80" width="204" height="112" fill="#7b7a85" />

          {/* A tiny window, with the same pinstriped title bar as the real
              ones on this site. */}
          <rect x="82" y="94" width="132" height="80" fill="#dedbd4" stroke="#000" />
          <rect x="82" y="94" width="132" height="10" fill="#dedbd4" stroke="#000" />
          <path d="M86 96.5 h124 M86 98.5 h124 M86 100.5 h124" stroke="#85827b" strokeWidth="0.8" />
          <rect x="84.5" y="96.5" width="5" height="5" fill="#f4f2ed" stroke="#000" strokeWidth="0.7" />
          <path
            d="M90 114 h92 M90 123 h108 M90 132 h74 M90 141 h100 M90 150 h64"
            stroke="#6c6a64"
            strokeWidth="1.7"
          />

          {/* Two icons on the little desktop. */}
          <rect x="232" y="92" width="17" height="13" fill="#e6e3dc" stroke="#000" strokeWidth="0.8" />
          <rect x="233" y="118" width="15" height="18" fill="#f7f6f2" stroke="#000" strokeWidth="0.8" />
        </g>

        {/* Scanlines and glass, over the contents rather than under them. */}
        <rect x="64" y="76" width="212" height="120" rx="14" fill="url(#im-scan)" />
        <path d="M72 80 h48 l-38 112 h-10 z" fill="#ffffff" opacity="0.06" />

        {/* The chin: slot loading drive, power light, and the little dimple
            where the logo went. */}
        <rect x="124" y="216" width="92" height="6" rx="3" fill="#c0bdb8" stroke="#8d8a84" strokeWidth="0.6" />
        <circle cx="252" cy="219" r="3.4" fill="#a4e6a9" />
        <circle cx="252" cy="219" r="7" fill="#a4e6a9" opacity="0.22" />
        <circle cx="88" cy="219" r="4" fill="#d8d5d0" stroke="#a9a6a0" strokeWidth="0.6" />

        {/* Ports and vents in the flank, seen through the plastic. */}
        <path d="M48 168 h9 v40 h-9 z" fill="#1e2258" opacity="0.38" />
        <path d="M283 168 h9 v40 h-9 z" fill="#1e2258" opacity="0.38" />

        {/* Specular highlights. Two, hard edged, top left, and nothing else,
            because plastic this shiny only ever caught the window. */}
        <path
          d="M62 66 C62 36 92 20 138 17 C100 26 78 46 76 80 C74 118 74 178 79 210 C64 178 60 100 62 66 Z"
          fill="#ffffff"
          opacity="0.32"
        />
        <path d="M244 28 C270 40 288 62 292 92 C282 62 266 44 240 34 Z" fill="#ffffff" opacity="0.18" />
        <path d="M104 348 C132 356 208 356 236 348 C210 358 130 358 104 348 Z" fill="#ffffff" opacity="0.14" />
      </svg>
    </div>
  )
}
