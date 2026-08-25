import { useCallback, useEffect, useRef, useState } from 'react'

// The boot sequence, on one page.
//
//   train.py's imports TYPE THEMSELVES OUT character by character, the way you
//   would write the file. Then it runs itself: thirty epochs, a loss that
//   jitters the way a real one does. One Enter at the end and you are in.
//
// The imports are the clean data + TensorFlow stack. The typing is the point:
// it reads as someone writing code, not a wall of text that appears. The run
// starts on its own once the file is typed; the training output prints (output
// is printed, not typed), so the two halves read differently on purpose.
//
// Rules that survive every rewrite: it plays once per session, any key
// advances, it only plays on the homepage so a shared project link goes
// straight to the work, it never runs under reduced motion, and it never
// blocks content because the desktop is mounted underneath the whole time.

const SESSION_KEY = 'tk-booted'
const EPOCHS = 30
const EPOCH_MS = 52
const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth <= 768
const VISIBLE_EPOCHS = isSmallScreen() ? 4 : 6

// Time multiplier, 1 in production. The sequence runs faster than a
// screenshot round trip, so verifying it by eye means slowing it down.
const SPEED = 1

// Milliseconds per typed character, and the pause before the run kicks off.
const TYPE_MS = 13
const RUN_DELAY_MS = 480

// train.py's imports: stdlib, data, sklearn, then the TensorFlow/Keras half
// (transfer learning on ResNet50 + callbacks). Blank strings are group breaks.
const SOURCE = [
  'import os',
  'import numpy as np',
  'import pandas as pd',
  'import matplotlib.pyplot as plt',
  '',
  'from sklearn.model_selection import train_test_split',
  'from sklearn.metrics import log_loss',
  '',
  'import tensorflow as tf',
  'from tensorflow import keras',
  'from tensorflow.keras import layers',
  'from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input',
  'from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint',
]
const SOURCE_TEXT = SOURCE.join('\n')

function lossAt(epoch: number) {
  return 0.94 * Math.exp(-epoch / 6.5) + 0.036
}

interface EpochRow {
  epoch: number
  loss: number
  best: boolean
}

// A very small Python tokenizer. It only has to handle import statements and
// comments, which is all this file contains, so it is thirty lines rather
// than a highlighting library.
function highlight(line: string, key: number) {
  if (line.trim().startsWith('#')) {
    return (
      <span key={key} className="mac-py-comment">
        {line}
      </span>
    )
  }
  const parts = line.split(/(\s+)/)
  return (
    <span key={key}>
      {parts.map((part, i) => {
        if (/^(import|from|as)$/.test(part)) {
          return (
            <span key={i} className="mac-py-kw">
              {part}
            </span>
          )
        }
        if (/^[a-zA-Z_][\w.]*$/.test(part)) {
          return (
            <span key={i} className="mac-py-mod">
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

export function Boot({ onDone }: { onDone: () => void }) {
  const [typed, setTyped] = useState(0)
  const [runStarted, setRunStarted] = useState(false)
  const [rows, setRows] = useState<EpochRow[]>([])
  const [runHead, setRunHead] = useState<string[]>([])
  const [runDone, setRunDone] = useState(false)
  const [done, setDone] = useState(false)

  const typedRef = useRef(0)
  const runStartedRef = useRef(false)
  const runDoneRef = useRef(false)
  const finished = useRef(false)

  useEffect(() => {
    typedRef.current = typed
    runStartedRef.current = runStarted
    runDoneRef.current = runDone
  }, [typed, runStarted, runDone])

  const sourceReady = typed >= SOURCE_TEXT.length

  const exit = useCallback(() => {
    if (finished.current) return
    finished.current = true
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Private browsing throws on write. Losing the flag only means the boot
      // plays again, which is not worth failing over.
    }
    setDone(true)
    window.setTimeout(onDone, 280)
  }, [onDone])

  // One handler for every key. Mid animation it completes the current beat
  // instantly rather than being ignored: finish typing, then finish the run,
  // then leave. A skip that works instead of one that feels broken.
  const advance = useCallback(() => {
    if (typedRef.current < SOURCE_TEXT.length) {
      setTyped(SOURCE_TEXT.length)
      return
    }
    if (!runStartedRef.current) {
      setRunStarted(true)
      return
    }
    if (!runDoneRef.current) {
      setRunHead(RUN_HEAD)
      setRows(
        Array.from({ length: VISIBLE_EPOCHS }, (_, i) => {
          const epoch = EPOCHS - VISIBLE_EPOCHS + 1 + i
          return { epoch, loss: lossAt(epoch), best: false }
        }),
      )
      setRunDone(true)
      return
    }
    exit()
  }, [exit])

  useEffect(() => {
    const onKey = (e: Event) => {
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onKey)
    }
  }, [advance])

  // The file types itself out, one character at a time.
  useEffect(() => {
    const id = window.setInterval(() => {
      setTyped((n) => Math.min(n + 1, SOURCE_TEXT.length))
    }, TYPE_MS * SPEED)
    return () => window.clearInterval(id)
  }, [])

  // Once the file is typed, the run starts on its own after a short beat.
  useEffect(() => {
    if (!sourceReady) return
    const t = window.setTimeout(() => setRunStarted(true), RUN_DELAY_MS * SPEED)
    return () => window.clearTimeout(t)
  }, [sourceReady])

  // It runs: the head lines, then thirty epochs with a jittering loss.
  useEffect(() => {
    if (!runStarted) return
    const timers: number[] = []
    RUN_HEAD.forEach((line, i) => {
      timers.push(
        window.setTimeout(() => {
          if (runDoneRef.current) return
          setRunHead((prev) => (prev.length > i ? prev : [...prev, line]))
        }, (120 + i * 150) * SPEED),
      )
    })

    const start = 120 + RUN_HEAD.length * 150 + 120
    let best = Infinity
    for (let epoch = 1; epoch <= EPOCHS; epoch++) {
      timers.push(
        window.setTimeout(
          () => {
            if (runDoneRef.current) return
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
    timers.push(
      window.setTimeout(() => setRunDone(true), (start + EPOCHS * EPOCH_MS + 220) * SPEED),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [runStarted])

  const sourceLines = SOURCE_TEXT.slice(0, typed).split('\n')

  return (
    <div className="mac-boot" data-done={done} role="status" aria-live="polite">
      <div className="mac-boot-inner">
        <h1 className="mac-boot-title">TOBIASKNIGHT.DEV</h1>

        <div className="mac-boot-log">
          {sourceLines.map((line, i) => (
            <div className="mac-boot-line" key={`src-${i}`}>
              {line ? highlight(line, i) : <>&nbsp;</>}
              {!sourceReady && i === sourceLines.length - 1 && (
                <span className="mac-boot-caret" aria-hidden />
              )}
            </div>
          ))}

          {runStarted && (
            <>
              <div className="mac-boot-line">&nbsp;</div>
              {runHead.map((l, i) => (
                <div className="mac-boot-line" key={`head-${i}`} data-dim={i > 0}>
                  {l}
                </div>
              ))}

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

              {runDone && <div className="mac-boot-line" data-dim>converged. checkpoint saved.</div>}
            </>
          )}
        </div>

        <p className="mac-boot-prompt" data-ready={runDone}>
          &gt; {runDone ? 'PRESS ENTER TO CONTINUE' : sourceReady ? 'running' : 'typing'}
          {runStarted && <span className="mac-boot-caret" aria-hidden />}
        </p>
      </div>
    </div>
  )
}

const RUN_HEAD = [
  '$ python train.py',
  'loading weights ......... ok',
  'mounting MACINTOSH_HD ... ok',
  `training: ${EPOCHS} epochs, batch 32, lr 3e-4`,
]

// Whether the boot should be drawn at all.
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
