import { useCallback, useEffect, useRef, useState } from 'react'

// The boot sequence, in three stages.
//
//   1. SOURCE   train.py in an editor, imports appearing line by line.
//   2. RUN      Enter runs it. Terminal output, thirty epochs, a loss that
//               jitters the way a real one does.
//   3. DESKTOP  Enter again and you are in.
//
// The two stage split is T's, and it is better than what it replaced: the
// import list and the training log were the same green wall of text, so the
// libraries read as decoration. Showing the file first, in an editor, means
// the stack is a thing you read rather than a thing that scrolls past, and
// pressing Enter to run it is a beat rather than a wait.
//
// Rules that survive every rewrite: it plays once per session, any key
// advances, it only plays on the homepage so a shared project link goes
// straight to the work, it never runs under reduced motion, and it never
// blocks content because the desktop is mounted underneath the whole time.

const SESSION_KEY = 'tk-booted'
const EPOCHS = 30
const EPOCH_MS = 52
const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth <= 768
const VISIBLE_EPOCHS = isSmallScreen() ? 5 : 9

// Time multiplier, 1 in production. The sequence runs faster than a
// screenshot round trip, so verifying it by eye means slowing it down.
const SPEED = 1

// train.py. T's actual stack, from his repos, laid out the way he writes it:
// standard library, then data, then sklearn, then the deep learning half.
const SOURCE = [
  '# ---------- IMPORTS ----------',
  'import os',
  'import numpy as np',
  'import pandas as pd',
  'import matplotlib.pyplot as plt',
  'import seaborn as sns',
  '',
  'from sklearn.model_selection import train_test_split',
  'from sklearn.metrics import log_loss',
  '',
  'import torch',
  'import torch.nn as nn',
  'from transformers import AutoModel, AutoTokenizer',
]

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

type Stage = 'source' | 'run'

export function Boot({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<Stage>('source')
  const [shownLines, setShownLines] = useState(0)
  const [rows, setRows] = useState<EpochRow[]>([])
  const [runHead, setRunHead] = useState<string[]>([])
  const [runDone, setRunDone] = useState(false)
  const [done, setDone] = useState(false)

  const stageRef = useRef(stage)
  const shownRef = useRef(0)
  const runDoneRef = useRef(false)
  const finished = useRef(false)

  useEffect(() => {
    stageRef.current = stage
    shownRef.current = shownLines
    runDoneRef.current = runDone
  }, [stage, shownLines, runDone])

  const sourceReady = shownLines >= SOURCE.length

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

  // One handler for every key, and what it does depends on where you are.
  // Mid animation it completes the current stage instantly rather than being
  // ignored, which is the difference between a skip that works and a skip
  // that feels broken.
  const advance = useCallback(() => {
    if (stageRef.current === 'source') {
      if (shownRef.current < SOURCE.length) {
        setShownLines(SOURCE.length)
        return
      }
      setStage('run')
      return
    }
    if (!runDoneRef.current) {
      setRows(
        Array.from({ length: VISIBLE_EPOCHS }, (_, i) => {
          const epoch = EPOCHS - VISIBLE_EPOCHS + 1 + i
          return { epoch, loss: lossAt(epoch), best: false }
        }),
      )
      setRunHead(RUN_HEAD)
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

  // Stage 1: the file types itself in.
  useEffect(() => {
    if (stage !== 'source') return
    const timers = SOURCE.map((_, i) =>
      window.setTimeout(() => setShownLines((n) => Math.max(n, i + 1)), (140 + i * 78) * SPEED),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [stage])

  // Stage 2: it runs.
  useEffect(() => {
    if (stage !== 'run') return
    const timers: number[] = []
    RUN_HEAD.forEach((line, i) => {
      timers.push(window.setTimeout(() => setRunHead((prev) => [...prev, line]), (120 + i * 150) * SPEED))
    })

    const start = 120 + RUN_HEAD.length * 150 + 120
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
    timers.push(
      window.setTimeout(() => setRunDone(true), (start + EPOCHS * EPOCH_MS + 220) * SPEED),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [stage])

  return (
    <div className="mac-boot" data-done={done} data-stage={stage} role="status" aria-live="polite">
      <div className="mac-boot-inner">
        <h1 className="mac-boot-title">TOBIASKNIGHT.DEV</h1>

        {stage === 'source' ? (
          <>
            <div className="mac-editor">
              <div className="mac-editor-bar">train.py</div>
              <div className="mac-editor-body">
                {SOURCE.slice(0, shownLines).map((line, i) => (
                  <div className="mac-editor-line" key={i}>
                    <span className="mac-editor-num">{i + 1}</span>
                    <code>{line ? highlight(line, i) : ' '}</code>
                  </div>
                ))}
              </div>
            </div>

            <p className="mac-boot-prompt" data-ready={sourceReady}>
              &gt; {sourceReady ? 'PRESS ENTER TO RUN' : 'loading imports'}
              <span className="mac-boot-caret" aria-hidden />
            </p>
          </>
        ) : (
          <>
            <div className="mac-boot-log">
              {runHead.map((l, i) => (
                <div className="mac-boot-line" key={i} data-dim={i > 0}>
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
              <span className="mac-boot-caret" aria-hidden />
            </div>

            <p className="mac-boot-prompt" data-ready={runDone}>
              &gt; {runDone ? 'PRESS ENTER TO CONTINUE' : 'running'}
              <span className="mac-boot-caret" aria-hidden />
            </p>
          </>
        )}
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
