import { useEffect, useRef, useState } from 'react'

// The boot sequence.
//
// T asked for an ML training run rather than a Happy Mac: epochs counting
// down, loss falling, then the desktop. It is the first thing anyone sees, so
// three rules govern it and none of them are negotiable:
//
//   1. It runs once per session. Spec section 22 bans a mandatory boot
//      animation, and the fastest way to lose a returning visitor is to make
//      them watch the same two seconds again.
//   2. Any key, any click, any tap skips it immediately.
//   3. It never blocks content. The desktop is already mounted underneath;
//      this is a curtain, not a loading gate. If the JavaScript for this
//      component failed entirely, the site would still work.
//
// Under prefers-reduced-motion it does not run at all.

// Time multiplier, 1 in production. It exists because the whole sequence runs
// faster than a screenshot round trip, so verifying it by eye means slowing it
// down. Set it to 60, reload, and the boot lasts long enough to test the skip
// deterministically. Never commit anything but 1.
const SPEED = 1

const SESSION_KEY = 'tk-booted'
const EPOCHS = 30

interface Line {
  text: string
  dim?: boolean
}

// Loss curve. Values are decorative, but they decay the way a real one does,
// fast at first and then grudgingly, because a linear loss curve looks wrong
// to exactly the people this site is aimed at.
function lossAt(epoch: number) {
  const base = 0.94 * Math.exp(-epoch / 7) + 0.037
  return base.toFixed(4)
}

function accAt(epoch: number) {
  return (0.62 + 0.353 * (1 - Math.exp(-epoch / 6))).toFixed(3)
}

export function Boot({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<Line[]>([])
  const [done, setDone] = useState(false)
  const finished = useRef(false)

  // One exit path for every way out of this: the timer finishing, a key, a
  // click, or the reduced motion check. Two exit paths would mean two chances
  // to leave the curtain up forever.
  const finish = useRef(() => {
    if (finished.current) return
    finished.current = true
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Private browsing throws on write. Losing the flag only means the boot
      // plays again, which is not worth failing over.
    }
    setDone(true)
    window.setTimeout(onDone, 260)
  })

  useEffect(() => {
    const skip = (e: Event) => {
      e.preventDefault()
      finish.current()
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)

    const timers: number[] = []
    const push = (line: Line, at: number) => {
      timers.push(window.setTimeout(() => setLines((prev) => [...prev, line]), at))
    }

    push({ text: '$ ./boot --target tobiasknight.dev', dim: true }, 0)
    push({ text: 'loading weights ................ ok' }, 220 * SPEED)
    push({ text: 'mounting MACINTOSH_HD .......... ok' }, 380 * SPEED)
    push({ text: `training: ${EPOCHS} epochs`, dim: true }, 520 * SPEED)

    // Six sampled epochs rather than thirty lines. A real log scrolls, a
    // legible one does not, and this has under two seconds to be read.
    const sampled = [1, 7, 14, 21, 27, EPOCHS]
    sampled.forEach((epoch, i) => {
      push(
        {
          text: `epoch ${String(epoch).padStart(2, '0')}/${EPOCHS}   loss ${lossAt(epoch)}   acc ${accAt(epoch)}`,
        },
        (640 + i * 150) * SPEED,
      )
    })

    push({ text: 'converged. entering desktop.', dim: true }, (640 + sampled.length * 150 + 180) * SPEED)
    timers.push(window.setTimeout(() => finish.current(), (640 + sampled.length * 150 + 620) * SPEED))

    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      timers.forEach(window.clearTimeout)
    }
  }, [])

  return (
    <div className="mac-boot" data-done={done} role="status" aria-live="polite">
      <div className="mac-boot-inner">
        <pre className="mac-boot-log">
          {lines.map((l, i) => (
            <span key={i} data-dim={l.dim}>
              {l.text}
              {'\n'}
            </span>
          ))}
          <span className="mac-boot-caret" aria-hidden />
        </pre>
        <p className="mac-boot-skip">[ press any key to skip ]</p>
      </div>
    </div>
  )
}

// Whether the curtain should be drawn at all. Checked before Boot mounts, so
// a returning visitor never renders it.
export function shouldBoot() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  } catch {
    return true
  }
}
