import { useCallback, useRef, type ReactNode } from 'react'
import type { WindowDef } from '../system/windows'

interface WindowProps {
  def: WindowDef
  x: number
  y: number
  active: boolean
  isTop: boolean
  zIndex: number
  onClose: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  status?: ReactNode
  children: ReactNode
}

export function MacWindow({
  def,
  x,
  y,
  active,
  isTop,
  zIndex,
  onClose,
  onFocus,
  onMove,
  status,
  children,
}: WindowProps) {
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null)

  // Pointer events rather than mouse events, so a trackpad, a mouse and a
  // stylus all behave the same. Dragging is desktop only: the mobile layout
  // pins windows full bleed, so a drag there would fight the CSS and lose.
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onFocus()
      if (window.innerWidth <= 768) return
      if ((e.target as HTMLElement).closest('button')) return
      dragOffset.current = { dx: e.clientX - x, dy: e.clientY - y }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [onFocus, x, y],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const off = dragOffset.current
      if (!off) return
      onMove(e.clientX - off.dx, e.clientY - off.dy)
    },
    [onMove],
  )

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragOffset.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }, [])

  return (
    <section
      className="mac-window"
      data-active={active}
      data-top={isTop}
      data-kind={def.kind}
      style={{ left: x, top: y, width: def.width, height: def.height, zIndex }}
      aria-label={def.title}
      onPointerDownCapture={onFocus}
    >
      <div
        className="mac-titlebar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <button className="mac-closebox" onClick={onClose} aria-label={`Close ${def.title}`} />
        <h2 className="mac-title">{def.title}</h2>
        {/* Keeps the title optically centred against the close box. */}
        <span aria-hidden style={{ width: 13, flex: '0 0 auto' }} />
      </div>

      <div className="mac-window-body">{children}</div>

      {status ? <div className="mac-statusbar">{status}</div> : null}
    </section>
  )
}
