import { useEffect, useRef, useState } from 'react'

// The boot sequence. Full screen, then the desktop.
//
// This is the third shape it has had and the one T kept. A photograph of an
// iMac G3 with this log running inside its screen was built and then removed:
// it was real, but the machine was solving a problem the terminal did not
// have, and it cost the log most of its legibility to do it. The terminal on
// its own says the same thing about the person, faster.
//
// Only the EPOCHS roll. The header stays put.
//
// Rolling everything was tried and it was wrong: thirty epochs pushed the
// import list off the top, so by the time the screen settles, which is when
// people actually read it, the stack was gone. The libraries are half the
// point of this screen. So the header is fixed, the epoch log scrolls under
// it in a fixed height window, and the final state holds everything worth
// reading.
//
// Rules that still hold: it plays once per session, any key or tap continues,
// it never runs under reduced motion, and it only plays on the homepage so a
// shared deep link goes straight to the work.

const SESSION_KEY = 'tk-booted'
const EPOCHS = 30
const EPOCH_MS = 58

const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth <= 768

// How many epoch rows are on screen at once. The header above them is always
// fully visible, so this is the only thing that scrolls.
const VISIBLE_EPOCHS = isSmallScreen() ? 5 : 9

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

interface Line {
  text: string
  dim?: boolean
}

interface EpochRow {
  epoch: number
  loss: number
  best: boolean
}

export function Boot({ onDone }: { onDone: () => void }) {
  const [head, setHead] = useState<Line[]>([])
  const [rows, setRows] = useState<EpochRow[]>([])
  const [tail, setTail] = useState<Line[]>([])
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
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
    setDone(true)
    // Long enough for the curtain to fade, short enough that nobody waits.
    window.setTimeout(onDone, 280)
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
      timers.push(window.setTimeout(() => setHead((prev) => [...prev, line]), at * SPEED))
    }

    push({ text: '$ python train.py', dim: true }, 0)
    IMPORTS.forEach((imp, i) => push({ text: imp }, 170 + i * 74))

    const afterImports = 170 + IMPORTS.length * 74 + 80
    push({ text: 'loading weights ......... ok', dim: true }, afterImports)
    push({ text: 'mounting MACINTOSH_HD ... ok', dim: true }, afterImports + 140)
    push({ text: `training: ${EPOCHS} epochs, batch 32, lr 3e-4`, dim: true }, afterImports + 270)

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
            setRows((prev) => [...prev, { epoch, loss, best: improved }].slice(-VISIBLE_EPOCHS))
          },
          (start + epoch * EPOCH_MS) * SPEED,
        ),
      )
    }

    const endAt = start + EPOCHS * EPOCH_MS + 240
    timers.push(
      window.setTimeout(
        () => setTail([{ text: 'converged. checkpoint saved.', dim: true }]),
        endAt * SPEED,
      ),
    )
    timers.push(window.setTimeout(() => setReady(true), endAt * SPEED))

    return () => {
      window.removeEventListener('keydown', advance)
      window.removeEventListener('pointerdown', advance)
      timers.forEach(window.clearTimeout)
    }
  }, [])

  return (
    <div className="mac-boot" data-done={done} role="status" aria-live="polite">
      <div className="mac-boot-inner">
        <h1 className="mac-boot-title">TOBIASKNIGHT.DEV</h1>

        <div className="mac-boot-log">
          {head.map((l, i) => (
            <div className="mac-boot-line" key={`h${i}`} data-dim={l.dim}>
              {l.text}
            </div>
          ))}

          {/* Fixed height, so the header above does not shuffle up and down
              as rows arrive. A log that makes the whole page jump reads as a
              bug rather than as a machine working. */}
          {rows.length > 0 && (
            <div className="mac-boot-rows">
              {rows.map((r) => (
                <div className="mac-boot-row" key={r.epoch}>
                  <span className="mac-boot-epoch">
                    {String(r.epoch).padStart(2, '0')}/{EPOCHS}
                  </span>
                  <span className="mac-boot-bar">
                    <i style={{ width: `${(r.epoch / EPOCHS) * 100}%` }} />
                  </span>
                  <span className="mac-boot-num">loss {r.loss.toFixed(4)}</span>
                  <span className="mac-boot-best">{r.best ? '*' : ''}</span>
                </div>
              ))}
            </div>
          )}

          {tail.map((l, i) => (
            <div className="mac-boot-line" key={`t${i}`} data-dim={l.dim}>
              {l.text}
            </div>
          ))}

          <span className="mac-boot-caret" aria-hidden />
        </div>

        {ready ? (
          <p className="mac-boot-prompt">
            &gt; PRESS ENTER TO CONTINUE
            <span className="mac-boot-caret" aria-hidden />
          </p>
        ) : (
          <p className="mac-boot-skip">[ press any key to skip ]</p>
        )}
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
