import { useCallback, useRef, type ReactNode } from 'react'
import type { WindowDef } from '../system/windows'

interface WindowProps {
  def: WindowDef
  x: number
  y: number
  active: boolean
  isTop: boolean
  closing: boolean
  zIndex: number
  onClose: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  onResize: (w: number, h: number) => void
  onZoom: () => void
  // Whether this window is currently zoomed. Drives `aria-pressed` on the
  // zoom box, so the toggle's state is readable without seeing the screen.
  zoomed: boolean
  width: number
  height: number
  // The little icon at the left of the title, as every Mac OS 8 window had.
  icon?: ReactNode
  status?: ReactNode
  children: ReactNode
}

export function MacWindow({
  def,
  x,
  y,
  active,
  isTop,
  closing,
  zIndex,
  onClose,
  onFocus,
  onMove,
  onResize,
  onZoom,
  zoomed,
  width,
  height,
  icon,
  status,
  children,
}: WindowProps) {
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null)
  const growFrom = useRef<{ x: number; y: number; w: number; h: number } | null>(null)

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

  // The grow box. Same pointer capture pattern as the title bar drag, and
  // like the drag it is desktop only, because the mobile layout pins windows
  // full bleed and a resize there would fight the CSS and lose.
  const onGrowDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (window.innerWidth <= 768) return
      e.stopPropagation()
      growFrom.current = { x: e.clientX, y: e.clientY, w: width, h: height }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [width, height],
  )

  const onGrowMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const from = growFrom.current
      if (!from) return
      onResize(from.w + (e.clientX - from.x), from.h + (e.clientY - from.y))
    },
    [onResize],
  )

  const endGrow = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    growFrom.current = null
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
      data-closing={closing}
      style={{ left: x, top: y, width, height, zIndex }}
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
        <h2 className="mac-title">
          {icon && <span className="mac-title-icon">{icon}</span>}
          {def.title}
        </h2>
        {/* The zoom box. Present on every Mac OS 8 window, on the right, and
            it toggles: out to fill the desktop, back to exactly where the
            window was. It shipped as an `aria-hidden` span with no handler,
            which made the chrome look complete and lie about it. A control
            that does something is a button, so it is one. The name stays put
            and `aria-pressed` carries the state, which is the toggle button
            pattern: a label that flips between Zoom and Restore renames the
            control under anyone reading it and is harder to follow, not
            easier. The title bar drag skips anything inside a button, so
            clicking it will not also start dragging the window. */}
        <button
          type="button"
          className="mac-zoombox"
          onClick={onZoom}
          aria-pressed={zoomed}
          aria-label={`Zoom ${def.title}`}
        />
      </div>

      <div className="mac-window-body">{children}</div>

      {status ? <div className="mac-statusbar">{status}</div> : null}

      <div
        className="mac-growbox"
        role="separator"
        aria-label="Resize window"
        onPointerDown={onGrowDown}
        onPointerMove={onGrowMove}
        onPointerUp={endGrow}
        onPointerCancel={endGrow}
      />
    </section>
  )
}
