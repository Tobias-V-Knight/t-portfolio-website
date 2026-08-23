import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Boot } from './Boot'
import { matrix3dFromQuad } from '../system/quad'

// The landing scene.
//
// It is a photograph. Three passes were spent trying to generate a convincing
// iMac G3 procedurally, and the honest conclusion was that the approach could
// not get there: the G3's body is a compound curved surface and what was being
// generated was an extruded silhouette. It looked like a nicely lit plastic
// toy because the shape underneath was wrong, and no amount of material
// tuning fixes a wrong shape.
//
// A real photograph does not need to be made to look real. What it gives up is
// rotation, which was never load bearing.
//
// The live boot log sits inside the machine's actual screen, mapped onto the
// screen's four corners with a projective transform. The screen in the photo
// is a trapezoid, so nothing short of matrix3d puts content on it correctly.
//
// Photo: Felix Winkelnkemper, CC BY 2.0, via Wikimedia Commons. The credit
// lives in the colophon in ABOUT_ME.TXT, which is what the licence requires.

// The screen's four corners, clockwise from top left, as fractions of the
// photograph. Measured by drawing the quad onto the source image at a fixed
// scale with measurement ticks, which was the only method that did not move
// its own reference frame between checks and send the numbers in circles.
//
// The SAME numbers were used to paint the photo's original screen black
// before export. Keep them in step: if this quad moves, the asset has to be
// regenerated, or the old Finder window reappears at the edges.
const SCREEN_QUAD: [number, number][] = [
  [0.4128, 0.1078],
  [0.766, 0.1205],
  [0.7628, 0.5025],
  [0.4092, 0.512],
]

// The DOM resolution of the screen. Fewer pixels mapped onto the same glass
// means larger type, so this is literally the CRT's resolution.
const SCREEN_PX = { w: 640, h: 480 }

// The photograph's own screen has been painted out at exactly these corners
// before the image was exported, so a small misalignment here shows black
// rather than the 2007 Finder window that used to be on it. That is why this
// is 1 and not something defensive: the safety net is in the asset.
const BLEED = 1.0

export function Landing({ onEnter }: { onEnter: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [ready, setReady] = useState(false)
  const [going, setGoing] = useState(false)

  // The transform depends on the displayed size of the photograph, so it has
  // to be recomputed whenever that changes rather than set once.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect
      setBox({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const transform = useMemo(() => {
    if (!box.w || !box.h) return undefined
    const cx = SCREEN_QUAD.reduce((a, p) => a + p[0], 0) / 4
    const cy = SCREEN_QUAD.reduce((a, p) => a + p[1], 0) / 4
    const quad = SCREEN_QUAD.map(([x, y]) => [
      (cx + (x - cx) * BLEED) * box.w,
      (cy + (y - cy) * BLEED) * box.h,
    ]) as [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ]
    return matrix3dFromQuad(SCREEN_PX.w, SCREEN_PX.h, quad) ?? undefined
  }, [box])

  const go = useCallback(() => {
    if (going) return
    setGoing(true)
    // The photograph scales up into its own screen, so the handover to the
    // desktop happens at the moment the glass already fills the frame.
    window.setTimeout(onEnter, 820)
  }, [going, onEnter])

  const handleReady = useCallback(() => setReady(true), [])

  return (
    <div className="mac-landing" data-going={going}>
      <div className="mac-landing-plate">
        <h1 className="mac-landing-name">TOBIASKNIGHT.DEV</h1>
        <p className="mac-landing-sub">builder / applied AI</p>
      </div>

      <div className="mac-landing-stage" ref={stageRef}>
        <img
          className="mac-landing-photo"
          src={`${import.meta.env.BASE_URL}imac-g3-v2.jpg`}
          srcSet={`${import.meta.env.BASE_URL}imac-g3-v2-small.jpg 1000w, ${import.meta.env.BASE_URL}imac-g3-v2.jpg 2000w`}
          sizes="(max-width: 768px) 96vw, 70vw"
          alt="An iMac G3 with its keyboard and mouse, running a training job"
          draggable={false}
        />

        {transform && (
          <div
            className="mac-photo-screen"
            style={{ width: SCREEN_PX.w, height: SCREEN_PX.h, transform }}
          >
            <Boot onDone={go} onReady={handleReady} />
          </div>
        )}
      </div>

      <p className="mac-landing-prompt" data-ready={ready}>
        {ready ? (
          <>
            PRESS ENTER TO CONTINUE
            <span className="mac-landing-caret" aria-hidden />
          </>
        ) : (
          'press any key to skip'
        )}
      </p>
    </div>
  )
}
