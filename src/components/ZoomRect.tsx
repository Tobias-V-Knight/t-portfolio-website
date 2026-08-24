import { useEffect, useRef } from 'react'

// The classic Mac zoom rectangle.
//
// Opening a window in System 7 and Mac OS 8 did not fade anything. It drew a
// series of outlined rectangles stepping outward from the icon to the window,
// and closing ran the same thing in reverse. It is the single most recognisable
// animation of that era, and it is the one T pointed at on charliedean.com.
//
// Two details make it read correctly rather than looking like a modern scale
// transition wearing a border:
//
//   1. It steps. The original redrew a handful of discrete rectangles rather
//      than interpolating smoothly, so the easing here is steps(), not ease.
//   2. It is an outline over the desktop, never a filled shape, and it is gone
//      the instant it arrives.

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export function ZoomRect({ from, to, onDone }: { from: Rect; to: Rect; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone
  const fromRef = useRef(from)
  const toRef = useRef(to)

  // Mount only, and it has to be.
  //
  // The first version listed from, to and onDone as dependencies, which looked
  // careful and was fatal: the parent passes a fresh onDone closure on every
  // render, so the effect re-ran, its own cleanup cancelled the animation it
  // had just started, oncancel fired onDone, and the rectangle disappeared on
  // the frame it was created. The parent keys this component per flight, so a
  // new zoom is always a new instance, which is what makes a mount-only effect
  // correct rather than a shortcut.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const a = fromRef.current
    const b = toRef.current

    // Reduced motion gets no rectangle at all, rather than a fast one.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doneRef.current()
      return
    }

    let unmounted = false
    const anim = el.animate(
      [
        { left: `${a.x}px`, top: `${a.y}px`, width: `${a.w}px`, height: `${a.h}px` },
        { left: `${b.x}px`, top: `${b.y}px`, width: `${b.w}px`, height: `${b.h}px` },
      ],
      { duration: 190, easing: 'steps(7, end)', fill: 'forwards' },
    )
    anim.onfinish = () => {
      if (!unmounted) doneRef.current()
    }
    return () => {
      unmounted = true
      anim.cancel()
    }
  }, [])

  return (
    <div
      className="mac-zoomrect"
      ref={ref}
      aria-hidden
      style={{ left: from.x, top: from.y, width: from.w, height: from.h }}
    />
  )
}
