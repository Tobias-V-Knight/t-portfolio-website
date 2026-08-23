import { useEffect, useRef, useState } from 'react'

// The boot sequence, running on the iMac's own screen.
//
// It is a single rolling buffer, not a page. That is the fix for the log being
// clipped: a fixed block of text has to fit the glass, so either the type
// shrinks until it cannot be read or the content gets cut off. A terminal
// scrolls. The imports appear, scroll up and away as training starts, and the
// screen only ever holds the last dozen lines. Nothing is ever cut off, and
// the type can be large enough to read from across the room.
//
// The site name and the prompt live OUTSIDE the machine, in Landing, for the
// same reason: they are the two things a visitor must be able to read, and the
// screen is the smallest surface on the page.
//
// Rules that still hold: it plays once per session, any key or tap continues,
// it never runs under reduced motion, and it only plays on the homepage so a
// shared deep link goes straight to the work.

const SESSION_KEY = 'tk-booted'
const EPOCHS = 30
const EPOCH_MS = 58

const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth <= 768

// How many lines the glass holds. A phone's screen is physically smaller, so
// its type is larger and fewer lines fit.
const MAX_LINES = isSmallScreen() ? 8 : 12

// Time multiplier, 1 in production. It exists because the sequence runs faster
// than a screenshot round trip, so verifying it by eye means slowing it down.
// Never commit anything but 1.
const SPEED = 1

// T's actual stack, taken from his repos rather than made up. All of them get
// shown now: they scroll away rather than competing for space.
const IMPORTS = [
  'import numpy as np',
  'import pandas as pd',
  'import matplotlib.pyplot as plt',
  'import seaborn as sns',
  'from sklearn.model_selection import train_test_split',
  'import torch',
  'import torch.nn as nn',
  'from transformers import AutoModel, AutoTokenizer',
]

function lossAt(epoch: number) {
  return 0.94 * Math.exp(-epoch / 6.5) + 0.036
}

type Line =
  | { kind: 'text'; text: string; dim?: boolean }
  | { kind: 'epoch'; epoch: number; loss: number; best: boolean }

export function Boot({ onDone, onReady }: { onDone: () => void; onReady: () => void }) {
  const [lines, setLines] = useState<Line[]>([])
  const finished = useRef(false)

  const finish = useRef(() => {
    if (finished.current) return
    finished.current = true
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Private browsing throws on write. Losing the flag only means the boot
      // plays again, which is not worth failing over.
    }
    onDone()
  })

  useEffect(() => {
    // Before training finishes a keypress skips, after it finishes the same
    // keypress means go. One handler, because they are the same intent.
    const advance = (e: Event) => {
      e.preventDefault()
      finish.current()
    }
    window.addEventListener('keydown', advance)
    window.addEventListener('pointerdown', advance)

    const timers: number[] = []
    const push = (line: Line, at: number) => {
      timers.push(
        window.setTimeout(() => setLines((prev) => [...prev, line].slice(-MAX_LINES)), at * SPEED),
      )
    }

    push({ kind: 'text', text: '$ python train.py', dim: true }, 0)
    IMPORTS.forEach((imp, i) => push({ kind: 'text', text: imp }, 170 + i * 74))

    const afterImports = 170 + IMPORTS.length * 74 + 80
    push({ kind: 'text', text: 'loading weights ......... ok', dim: true }, afterImports)
    push({ kind: 'text', text: 'mounting MACINTOSH_HD ... ok', dim: true }, afterImports + 140)
    push({ kind: 'text', text: `training: ${EPOCHS} epochs`, dim: true }, afterImports + 270)

    const start = afterImports + 380
    let best = Infinity
    for (let epoch = 1; epoch <= EPOCHS; epoch++) {
      timers.push(
        window.setTimeout(
          () => {
            // Jitter, plus a rarer larger spike. Loss genuinely does back up.
            const noise = (Math.random() - 0.46) * 0.055
            const spike = Math.random() < 0.12 ? Math.random() * 0.07 : 0
            const loss = Math.max(0.004, lossAt(epoch) + noise + spike)
            const improved = loss < best
            if (improved) best = loss
            setLines((prev) =>
              [...prev, { kind: 'epoch' as const, epoch, loss, best: improved }].slice(-MAX_LINES),
            )
          },
          (start + epoch * EPOCH_MS) * SPEED,
        ),
      )
    }

    const endAt = start + EPOCHS * EPOCH_MS + 240
    push({ kind: 'text', text: 'converged. checkpoint saved.', dim: true }, endAt)
    timers.push(window.setTimeout(onReady, endAt * SPEED))

    return () => {
      window.removeEventListener('keydown', advance)
      window.removeEventListener('pointerdown', advance)
      timers.forEach(window.clearTimeout)
    }
  }, [onReady])

  return (
    <div className="mac-boot" role="status" aria-live="polite">
      <div className="mac-boot-log">
        {lines.map((l, i) =>
          l.kind === 'text' ? (
            <div className="mac-boot-line" key={i} data-dim={l.dim}>
              {l.text}
            </div>
          ) : (
            <div className="mac-boot-row" key={i}>
              <span className="mac-boot-epoch">
                {String(l.epoch).padStart(2, '0')}/{EPOCHS}
              </span>
              {/* A real bar that fills, not hash marks retyped every tick. */}
              <span className="mac-boot-bar">
                <i style={{ width: `${(l.epoch / EPOCHS) * 100}%` }} />
              </span>
              <span className="mac-boot-num">loss {l.loss.toFixed(4)}</span>
              <span className="mac-boot-best">{l.best ? '*' : ''}</span>
            </div>
          ),
        )}
        <span className="mac-boot-caret" aria-hidden />
      </div>
    </div>
  )
}

// Whether the landing should be drawn at all. Checked before it mounts, so a
// returning visitor, a deep link, or anyone who asked for reduced motion never
// renders it.
export function shouldBoot(pathname: string) {
  if (typeof window === 'undefined') return false
  if (pathname !== '/') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  } catch {
    return true
  }
}
