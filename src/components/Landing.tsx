import { useEffect, useRef } from 'react'
import { Boot } from './Boot'
import { createImacScene, SCREEN_PIXELS, type ImacScene } from '../scene/imacScene'

// The landing scene: a real iMac G3 on a desk, with the boot log running on
// its own screen. Press Enter and the camera pushes into the glass, which is
// how you get inside the computer.
//
// The two halves T asked for were separate before this: a black terminal boot,
// and a small machine sitting on the desktop doing nothing. They are one
// moment now. Outside the computer is the object, inside it is the work.

export function Landing({ onEnter }: { onEnter: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<ImacScene | null>(null)

  useEffect(() => {
    if (!hostRef.current || !screenRef.current) return
    // WebGL context creation can fail: old drivers, a blocked context, a
    // headless environment. If it does, the visitor goes straight to the
    // desktop rather than staring at an empty page.
    try {
      sceneRef.current = createImacScene(hostRef.current, screenRef.current)
    } catch (err) {
      console.warn('[landing] scene failed, skipping to desktop', err)
      onEnter()
      return
    }
    return () => sceneRef.current?.dispose()
  }, [onEnter])

  return (
    <div className="mac-landing" ref={hostRef}>
      {/* This element is reparented into the CSS3D layer by the scene, which
          is what puts it on the screen plane in 3D. Its pixel size has to
          match SCREEN_PIXELS or the screen renders at the wrong scale. */}
      <div
        className="mac-screen"
        ref={screenRef}
        style={{ width: SCREEN_PIXELS.w, height: SCREEN_PIXELS.h }}
      >
        <Boot
          onDone={() => {
            const scene = sceneRef.current
            if (!scene) return onEnter()
            scene.enter(onEnter)
          }}
        />
      </div>
    </div>
  )
}
