import { useEffect, useState } from 'react'
import { photos, photosCopyState } from '../data/content'
import { PlaceholderTag } from './Panels'

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} K`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

// Spec section 9. Photos are files someone found on a computer, so the
// filename, the size and the date are part of what is being shown, not
// chrome around it. The viewer is a contact sheet that opens into a single
// image, which is how an old photo browser worked and also happens to be the
// pattern that survives contact with a phone.

export function PhotosPanel({ onStatus }: { onStatus: (s: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null)

  const total = photos.reduce((sum, p) => sum + p.bytes, 0)

  useEffect(() => {
    if (selected === null) {
      onStatus(`${photos.length} items, ${formatBytes(total)}`)
    } else {
      const p = photos[selected]
      onStatus(`${p.file}   ${formatBytes(p.bytes)}   ${p.date}`)
    }
  }, [selected, onStatus, total])

  if (selected !== null) {
    const p = photos[selected]
    const go = (delta: number) => setSelected((selected + delta + photos.length) % photos.length)

    return (
      <div className="mac-viewer">
        <div className="mac-viewer-stage">
          <img src={`${import.meta.env.BASE_URL}photos/${p.file}`} alt={p.caption} />
        </div>
        <div className="mac-viewer-bar">
          <button className="mac-btn" onClick={() => setSelected(null)}>
            SHEET
          </button>
          <span className="mac-meta" style={{ flex: 1 }}>
            {p.caption}
          </span>
          <button className="mac-btn" onClick={() => go(-1)} aria-label="Previous photo">
            PREV
          </button>
          <button className="mac-btn" onClick={() => go(1)} aria-label="Next photo">
            NEXT
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mac-sheet">
        {photos.map((p, i) => (
          <button
            className="mac-thumb"
            key={p.file}
            onClick={() => setSelected(i)}
            aria-label={`Open ${p.file}, ${p.caption}`}
          >
            <img src={`${import.meta.env.BASE_URL}photos/${p.file}`} alt={p.caption} loading="lazy" />
            <span className="mac-thumb-name">{p.file}</span>
          </button>
        ))}
      </div>
      {photosCopyState === 'PLACEHOLDER' && (
        <div style={{ padding: '0 10px 12px' }}>
          <PlaceholderTag />
        </div>
      )}
    </>
  )
}
