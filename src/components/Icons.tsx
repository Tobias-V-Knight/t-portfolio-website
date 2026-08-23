// Desktop icons, drawn as SVG rather than shipped as bitmaps so they stay
// crisp on a retina display without a 2x asset pipeline. shapeRendering
// crispEdges is what keeps the 1 bit look: no antialiased pixel edges.

type IconProps = { className?: string }

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
      <path d="M2 8h10l2 3h16v18H2z" fill="#c9c6bf" stroke="#000" />
      <path d="M2 13h28" stroke="#000" />
      <path d="M3 14h26v14H3z" fill="#e6e3dc" />
      <path d="M3 9h8l2 3H3z" fill="#f4f2ed" />
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
      <path d="M2 9h28v15H2z" fill="#dedbd4" stroke="#000" />
      <path d="M3 10h26v4H3z" fill="#f4f2ed" />
      <path d="M20 17h7v4h-7z" fill="#4a4a8c" stroke="#000" />
      <path d="M5 18h11M5 21h8" stroke="#6c6a64" />
    </svg>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 3h14v3H9z" fill="#dedbd4" stroke="#000" />
      <path d="M6 7h20v3H6z" fill="#f4f2ed" stroke="#000" />
      <path d="M8 10h16l-2 19H10z" fill="#dedbd4" stroke="#000" />
      <path d="M13 14v11M19 14v11" stroke="#6c6a64" />
    </svg>
  )
}
