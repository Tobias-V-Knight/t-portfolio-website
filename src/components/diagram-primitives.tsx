// Shared drawing primitives for the diagrams in `./diagrams/`.
//
// Architecture diagrams, ADR-0002: hand authored inline SVG, drawn with the
// same tokens as the window chrome around it. Not Mermaid, which looks like
// every engineering doc written since 2020 and would visibly not belong inside
// a Macintosh window, and not an exported PNG, which goes stale the moment the
// system changes and cannot be edited by an agent.
//
// Every colour comes from a CSS class in system.css rather than from a hex
// value or a presentation attribute, which is what makes these work in any
// theme: the drawing asks the stylesheet what the face colour is, the same way
// a button does.
//
// Strokes carry vector-effect="non-scaling-stroke" so a 1px rule stays 1px at
// any window width. Without it the whole drawing thickens as the window grows,
// which is the one thing that reads as clip art rather than as chrome.

// A Mac bevel, in four parts: the black outline, the face, a white inner rule
// along the top and left, and a dark one along the bottom and right. Light
// source top left, always, exactly as in system.css. This is the reason the
// boxes read as part of the interface rather than as a flowchart pasted onto
// it.
export function Box({ x, y, w, h, lines }: { x: number; y: number; w: number; h: number; lines: string[] }) {
  // Two lines sit 16 apart around the box centre, one line sits on it. The 4
  // is the optical correction for a cap height face with no descenders in it.
  const mid = y + h / 2
  const baselines = lines.length > 1 ? [mid - 6, mid + 10] : [mid + 4]

  return (
    <g>
      <rect className="mac-diagram-face" x={x} y={y} width={w} height={h} vectorEffect="non-scaling-stroke" />
      <path
        className="mac-diagram-hi"
        d={`M${x + 1} ${y + h - 1} L${x + 1} ${y + 1} L${x + w - 1} ${y + 1}`}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="mac-diagram-lo"
        d={`M${x + 1} ${y + h - 1} L${x + w - 1} ${y + h - 1} L${x + w - 1} ${y + 1}`}
        vectorEffect="non-scaling-stroke"
      />
      {lines.map((line, i) => (
        <text className="mac-diagram-label" key={line} x={x + w / 2} y={baselines[i]} textAnchor="middle">
          {line}
        </text>
      ))}
    </g>
  )
}

// A shaft and a solid head, drawn rather than done with a marker element: a
// marker carries its own fill rules, and the point of this file is that one
// class decides what colour the ink is.
export function Arrow({ x, y, len, down = false }: { x: number; y: number; len: number; down?: boolean }) {
  const end = down ? y + len : x + len
  const shaft = down ? `M${x} ${y} V${end - 6}` : `M${x} ${y} H${end - 6}`
  const head = down
    ? `${x - 4},${end - 6} ${x},${end} ${x + 4},${end - 6}`
    : `${end - 6},${y - 4} ${end},${y} ${end - 6},${y + 4}`

  return (
    <g className="mac-diagram-arrow">
      <path d={shaft} vectorEffect="non-scaling-stroke" />
      <polygon points={head} />
    </g>
  )
}
