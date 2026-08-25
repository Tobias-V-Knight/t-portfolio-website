// Desktop icons, drawn as SVG rather than shipped as bitmaps so they stay
// crisp on a retina display without a 2x asset pipeline. shapeRendering
// crispEdges is what keeps the 1 bit look: no antialiased pixel edges.

type IconProps = { className?: string }

// An icon that is a real image rather than a drawing. Zippy is a photograph
// with a cutout, which is exactly the 90s shareware icon move: most Mac
// desktops had at least one icon that was obviously somebody's dog.
export function ImgIcon({ className, src, alt }: IconProps & { src: string; alt: string }) {
  return <img className={className} src={src} alt={alt} />
}

// The six stripe Apple. It is the single most recognisable thing in the whole
// interface, and its absence was most of why the menu bar did not read as a
// Macintosh. Drawn rather than an image so it stays crisp at 16px.
export function AppleLogo({ className }: IconProps) {
  const stripes = ['#5cb85c', '#f4c430', '#f08a24', '#d4453c', '#8e4b9e', '#3d7fd1']
  return (
    <svg viewBox="0 0 14 17" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <clipPath id="apple-body">
          <path d="M9.6 0.2c0.1 1-0.3 1.9-0.9 2.5c-0.6 0.7-1.5 1.2-2.4 1.1c-0.1-0.9 0.3-1.9 0.9-2.5C7.8 0.6 8.8 0.2 9.6 0.2z M13 12.4c-0.4 1-0.6 1.4-1.1 2.3c-0.7 1.2-1.7 2.6-2.9 2.6c-1.1 0-1.4-0.7-2.9-0.7c-1.5 0-1.8 0.7-2.9 0.7c-1.2 0-2.1-1.3-2.8-2.4C-1.5 11.7-1.7 7.2 0.6 5.4c0.8-0.7 1.9-1.1 2.8-1.1c1.2 0 1.9 0.7 2.9 0.7c0.9 0 1.5-0.7 2.9-0.7c0.8 0 1.7 0.3 2.4 0.9c-2.1 1.2-1.8 4.3 0.4 5.2z" />
        </clipPath>
      </defs>
      <g clipPath="url(#apple-body)">
        {stripes.map((c, i) => (
          <rect key={c} x="-1" y={-1 + i * 3.1} width="16" height="3.2" fill={c} />
        ))}
      </g>
    </svg>
  )
}

const base = {
  viewBox: '0 0 32 32',
  xmlns: 'http://www.w3.org/2000/svg',
  shapeRendering: 'crispEdges' as const,
  'aria-hidden': true,
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      {/* Classic Mac folder: a back sheet with a left tab, and a front flap
         over it. The 1px step between them is what gives it depth at 32px. */}
      <path d="M2 7h9l2 3h17v4H2z" fill="#b9b6af" stroke="#000" />
      <path d="M2 12h28v17H2z" fill="#dedbd4" stroke="#000" />
      <path d="M3 13h26v2H3z" fill="#f2f0ea" />
    </svg>
  )
}

export function DocIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 2h14l6 6v22H6z" fill="#f7f6f2" stroke="#000" />
      <path d="M20 2v6h6" fill="#d8d5ce" stroke="#000" />
      <path d="M10 13h12M10 17h12M10 21h12M10 25h7" stroke="#6c6a64" />
    </svg>
  )
}

export function AppIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 3h24v26H4z" fill="#dedbd4" stroke="#000" />
      <path d="M5 4h22v3H5z" fill="#4a4a8c" />
      <path d="M16 10l7 7-7 7-7-7z" fill="#c1401f" stroke="#000" />
      <path d="M16 14l3 3-3 3-3-3z" fill="#f7f6f2" />
    </svg>
  )
}

export function DiskIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      {/* 3.5" floppy: the OG Mac save/disk object, cut top-right corner, metal
         shutter up top, a label with a couple of written lines. */}
      <path d="M4 3h21l3 3v23H4z" fill="#3f5c86" stroke="#000" />
      <path d="M10 3h11v8H10z" fill="#c9c6bf" stroke="#000" />
      <path d="M16 4h3v6h-3z" fill="#7f8ea6" />
      <path d="M7 15h18v13H7z" fill="#f4f2ed" stroke="#000" />
      <path d="M9 18h14M9 21h14M9 24h9" stroke="#6c6a64" />
    </svg>
  )
}

// Project specific icons. Charlie Dean's desktop is memorable because every
// icon is a different object; ours had two identical diamonds for two very
// different projects, which is the thing that makes a desktop read as a
// template. These are still generic shapes, but they are the right shapes.

// The house on the HOME window's title bar. Mac OS 8 put a small icon at the
// left of a window's title, and its absence is one of those details that makes
// chrome read as approximate rather than authentic.
export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M16 4L2 15h5v13h18V15h5z" fill="#dedbd4" stroke="#000" strokeWidth="1.5" />
      <path d="M9 16h14v11H9z" fill="#f4f2ed" />
      <path d="M13 19h6v8h-6z" fill="#4a4a8c" stroke="#000" />
      <path d="M22 6h4v5h-4z" fill="#c96a2a" stroke="#000" />
    </svg>
  )
}

export function PaddleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3h20v22H6z" fill="#dedbd4" stroke="#000" />
      <path d="M7 4h18v3H7z" fill="#4a4a8c" />
      <path d="M13 9h8v10a4 4 0 0 1-8 0z" fill="#c96a2a" stroke="#000" />
      <path d="M15 19h4v6h-4z" fill="#8a5a2a" stroke="#000" />
      <circle cx="10" cy="13" r="3" fill="#e8d24a" stroke="#000" />
      <path d="M9 12h1M11 12h1M10 14h1" stroke="#000" strokeWidth="0.8" />
    </svg>
  )
}

export function RoadIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 3h24v26H4z" fill="#dedbd4" stroke="#000" />
      <path d="M5 4h22v3H5z" fill="#4a4a8c" />
      <path d="M10 9h12l4 19H6z" fill="#5a5a5f" stroke="#000" />
      <path d="M15.4 11h1.6l.4 4h-2.4z M14.9 17h2.4l.4 4h-3.2z M14.3 23h3.6l.4 4h-4.4z" fill="#f4f2ed" />
    </svg>
  )
}

export function TvIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 8h26v18H3z" fill="#dedbd4" stroke="#000" />
      <path d="M6 11h20v12H6z" fill="#2b3a52" stroke="#000" />
      <path d="M8 13h6v3H8z" fill="#e8687a" />
      <path d="M16 13h8v1.5h-8z M16 16h6v1.5h-6z" fill="#9fc7e8" />
      <path d="M8 19h16v2H8z" fill="#4a4a8c" />
      <path d="M11 8l5-5M21 8l-5-5" stroke="#000" />
      <circle cx="6.5" cy="28.5" r="1.5" fill="#6c6a64" />
      <circle cx="25.5" cy="28.5" r="1.5" fill="#6c6a64" />
    </svg>
  )
}

export function FilmIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      {/* A clapperboard: the board, the angled clapper top, its diagonal
         stripes, and a couple of scene lines. */}
      <path d="M4 12h24v16H4z" fill="#dedbd4" stroke="#000" />
      <path d="M4 6l23-3 .8 4.6-23 3z" fill="#2b2b2b" stroke="#000" />
      <path d="M9 5.4l-1 4.2M14 4.6l-1 4.2M19 3.8l-1 4.2M24 3.4l-1 4" stroke="#f4f2ed" />
      <path d="M8 17h16M8 21h16M8 25h10" stroke="#6c6a64" />
    </svg>
  )
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 7h26v18H3z" fill="#f7f6f2" stroke="#000" />
      <path d="M3 7l13 10L29 7" fill="none" stroke="#000" />
      <path d="M3 25l9-8M29 25l-9-8" fill="none" stroke="#6c6a64" />
    </svg>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      {/* Classic Mac trash can: knob handle, lid, and a tapered bin with the
         vertical ridges that make it read as a metal wastebasket. */}
      <path d="M13 3h6v2h-6z" fill="#c9c6bf" stroke="#000" />
      <path d="M7 5h18v3H7z" fill="#dedbd4" stroke="#000" />
      <path d="M9 8h14l-2 21H11z" fill="#c9c6bf" stroke="#000" />
      <path d="M12.6 11l-.4 15M16 11v15M19.4 11l.4 15" stroke="#6c6a64" />
    </svg>
  )
}
