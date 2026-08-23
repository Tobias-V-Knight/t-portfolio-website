// Mapping a rectangle of DOM onto an arbitrary quadrilateral.
//
// The hero is a photograph of a real iMac G3, so its screen is a trapezoid in
// perspective, not a rectangle. To put live content in that screen, a plain
// rotate or skew is not enough: the two vertical edges of the screen are
// different lengths, which is a projective transform, and only matrix3d can
// express one in CSS.
//
// This solves the 8 unknowns of a 2D homography from four point pairs and
// packs them into the matrix3d CSS expects. It is the standard technique for
// "put this div on that surface in this photo".

type Point = [number, number]

// Gaussian elimination with partial pivoting. Eight equations, eight unknowns.
function solve(m: number[][], rhs: number[]) {
  const n = rhs.length
  const a = m.map((row, i) => [...row, rhs[i]])

  for (let col = 0; col < n; col++) {
    let pivot = col
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r
    }
    if (Math.abs(a[pivot][col]) < 1e-12) return null
    ;[a[col], a[pivot]] = [a[pivot], a[col]]

    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const f = a[r][col] / a[col][col]
      for (let c = col; c <= n; c++) a[r][c] -= f * a[col][c]
    }
  }
  return a.map((row, i) => row[n] / row[i])
}

/**
 * A CSS matrix3d that maps the rectangle (0,0)-(w,h) onto `quad`, given
 * clockwise from the top left. Returns null if the quad is degenerate, so the
 * caller can fall back rather than render a collapsed element.
 */
export function matrix3dFromQuad(w: number, h: number, quad: [Point, Point, Point, Point]) {
  const src: Point[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ]

  const m: number[][] = []
  const rhs: number[] = []

  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]
    const [u, v] = quad[i]
    m.push([x, y, 1, 0, 0, 0, -x * u, -y * u])
    rhs.push(u)
    m.push([0, 0, 0, x, y, 1, -x * v, -y * v])
    rhs.push(v)
  }

  const s = solve(m, rhs)
  if (!s) return null
  const [a, b, c, d, e, f, g, i] = s

  // Column major, which is the order CSS wants and the most common place this
  // gets written down wrong.
  return `matrix3d(${a}, ${d}, 0, ${g}, ${b}, ${e}, 0, ${i}, 0, 0, 1, 0, ${c}, ${f}, 0, 1)`
}
