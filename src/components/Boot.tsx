import { useEffect, useRef, useState } from 'react'

// The boot sequence.
//
// An ML training run rather than a Happy Mac, per T. Four corrections came
// after seeing it, all of them right, and all of them are why it looks like
// this now:
//
//   1. The loss has to move up and down. A curve that only ever falls is the
//      tell that nobody involved has watched one.
//   2. It waits for Enter. No timeout. The visitor decides when to go in.
//   3. The imports are the real stack T works in, because the libraries a
//      person actually reaches for say more about them than a bio does.
//   4. The epoch progress is a real bar that fills, drawn as elements rather
//      than typed out of hash marks.
//
// The cost of waiting for input is real and worth stating: a boot that waits
// is a gate, and spec section 22 bans a mandatory boot animation. Three things
// keep it honest. It plays once per session. Any key, click or tap continues,
// not only Enter, so a phone works. And it only plays on the homepage, so a
// shared deep link goes straight to the work.
//
// It also never blocks content. The desktop is mounted underneath the whole
// time, so if this component threw, the site would still be there.

const SESSION_KEY = 'tk-booted'
const EPOCHS = 30
const EPOCH_MS = 58
const VISIBLE_EPOCHS = 7

// Time multiplier, 1 in production. It exists because the sequence runs faster
// than a screenshot round trip, so verifying it by eye means slowing it down.
// Never commit anything but 1.
const SPEED = 1

// T's actual stack. Not a generic list: these are the libraries in his repos.
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

function accAt(epoch: number) {
  return 0.61 + 0.362 * (1 - Math.exp(-epoch / 5.5))
}

interface Line {
  text: string
  dim?: boolean
}

interface EpochRow {
  epoch: number
  loss: number
  acc: number
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
    window.setTimeout(onDone, 260)
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
    IMPORTS.forEach((imp, i) => push({ text: imp }, 180 + i * 78))

    const afterImports = 180 + IMPORTS.length * 78 + 90
    push({ text: 'loading weights ................ ok', dim: true }, afterImports)
    push({ text: 'mounting MACINTOSH_HD .......... ok', dim: true }, afterImports + 150)
    push(
      { text: `training: ${EPOCHS} epochs, batch 32, lr 3e-4`, dim: true },
      afterImports + 290,
    )

    const start = afterImports + 400
    let best = Infinity
    for (let epoch = 1; epoch <= EPOCHS; epoch++) {
      timers.push(
        window.setTimeout(
          () => {
            // Jitter, plus a rarer larger spike. Loss genuinely does back up.
            const noise = (Math.random() - 0.46) * 0.055
            const spike = Math.random() < 0.12 ? Math.random() * 0.07 : 0
            const loss = Math.max(0.004, lossAt(epoch) + noise + spike)
            const acc = Math.min(0.999, Math.max(0.4, accAt(epoch) + (Math.random() - 0.5) * 0.022))
            const improved = loss < best
            if (improved) best = loss
            setRows((prev) => [...prev, { epoch, loss, acc, best: improved }].slice(-VISIBLE_EPOCHS))
          },
          (start + epoch * EPOCH_MS) * SPEED,
        ),
      )
    }

    const endAt = start + EPOCHS * EPOCH_MS + 260
    timers.push(
      window.setTimeout(
        () => setTail([{ text: 'converged. checkpoint saved to MACINTOSH_HD.', dim: true }]),
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

          {rows.map((r) => (
            <div className="mac-boot-row" key={r.epoch}>
              <span className="mac-boot-epoch">
                epoch {String(r.epoch).padStart(2, '0')}/{EPOCHS}
              </span>
              {/* A real bar rather than typed hash marks, so it fills rather
                  than being redrawn as text on every tick. */}
              <span className="mac-boot-bar">
                <i style={{ width: `${(r.epoch / EPOCHS) * 100}%` }} />
              </span>
              <span className="mac-boot-num">loss {r.loss.toFixed(4)}</span>
              <span className="mac-boot-num">acc {r.acc.toFixed(3)}</span>
              <span className="mac-boot-best">{r.best ? 'best' : ''}</span>
            </div>
          ))}

          {tail.map((l, i) => (
            <div className="mac-boot-line" key={`t${i}`} data-dim={l.dim} style={{ marginTop: 14 }}>
              {l.text}
            </div>
          ))}
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

// Whether the curtain should be drawn at all. Checked before Boot mounts, so
// a returning visitor, a deep link, or anyone who asked for reduced motion
// never renders it.
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
