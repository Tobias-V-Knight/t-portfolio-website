// The window manager.
//
// The model, settled 2026-08-23 and written up in CLAUDE.md: every routed
// window has a URL, the open windows are a stack, and the URL always points at
// whatever is on top of that stack. Opening pushes, closing goes back, and the
// browser Back button therefore closes the top window for free.
//
// Positions and z order deliberately stay in memory. Putting them in the URL
// was considered and rejected: it makes every share link ugly and it is the
// kind of state nobody actually wants restored.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { projects } from '../data/content'

export type WindowKind = 'intro' | 'project' | 'photos' | 'text' | 'trash'

export interface WindowDef {
  id: string
  title: string
  kind: WindowKind
  // null means the window is not routed. Only the intro window is, because it
  // opens on load and closing it should not put an entry in history.
  route: string | null
  payload?: string
  width: number
  height: number
  // Spawn position on the desktop, as a fraction of the viewport, so windows
  // land somewhere sensible on a laptop and on a large display alike.
  spawn: { x: number; y: number }
}

export const windowDefs: WindowDef[] = [
  {
    id: 'intro',
    title: 'WELCOME.TXT',
    kind: 'intro',
    route: null,
    width: 460,
    height: 330,
    spawn: { x: 0.08, y: 0.14 },
  },
  {
    id: 'about',
    title: 'ABOUT_ME.TXT',
    kind: 'text',
    route: '/about',
    width: 460,
    height: 360,
    spawn: { x: 0.3, y: 0.2 },
  },
  {
    id: 'photos',
    title: 'PHOTOS',
    kind: 'photos',
    route: '/photos',
    width: 620,
    height: 460,
    spawn: { x: 0.24, y: 0.1 },
  },
  {
    id: 'trash',
    title: 'TRASH',
    kind: 'trash',
    route: '/trash',
    width: 380,
    height: 240,
    spawn: { x: 0.42, y: 0.34 },
  },
  ...projects.map((p, i) => ({
    id: `project:${p.slug}`,
    title: p.windowTitle,
    kind: 'project' as const,
    route: `/projects/${p.slug}`,
    payload: p.slug,
    width: 640,
    height: 520,
    spawn: { x: 0.2 + i * 0.04, y: 0.08 + i * 0.05 },
  })),
]

const byId = new Map(windowDefs.map((w) => [w.id, w]))
const byRoute = new Map(windowDefs.filter((w) => w.route).map((w) => [w.route as string, w.id]))

export function defFor(id: string): WindowDef | undefined {
  return byId.get(id)
}

export interface OpenWindow {
  id: string
  x: number
  y: number
}

// Windows must never end up somewhere the visitor cannot reach them. Spec
// section 12 calls this out specifically. We clamp on spawn and on every drag
// frame, and we always leave the title bar reachable.
const MENU_BAR = 24
const KEEP_VISIBLE = 96

function clamp(x: number, y: number, def: WindowDef) {
  const maxX = Math.max(0, window.innerWidth - KEEP_VISIBLE)
  const maxY = Math.max(MENU_BAR, window.innerHeight - 40)
  return {
    x: Math.min(Math.max(x, KEEP_VISIBLE - def.width), maxX),
    y: Math.min(Math.max(y, MENU_BAR), maxY),
  }
}

function spawnPosition(def: WindowDef): { x: number; y: number } {
  const vw = typeof window === 'undefined' ? 1280 : window.innerWidth
  const vh = typeof window === 'undefined' ? 800 : window.innerHeight
  return clamp(Math.round(vw * def.spawn.x), Math.round(vh * def.spawn.y), def)
}

export function useWindowManager() {
  const location = useLocation()
  const navigate = useNavigate()
  const navType = useNavigationType()

  // The routed stack. Index 0 is furthest back, last item is on top and is the
  // window the URL currently points at.
  const [stack, setStack] = useState<OpenWindow[]>([])
  const [introOpen, setIntroOpen] = useState(true)
  const [introPos, setIntroPos] = useState(() => spawnPosition(byId.get('intro') as WindowDef))

  const routeId = byRoute.get(location.pathname) ?? null

  // One effect owns the whole relationship between the URL and the stack.
  // Anything that wants to open or close a window navigates, and this reacts.
  // Keeping it in a single place is what stops open, close, Back and a pasted
  // deep link from each growing their own slightly different code path.
  //
  // The one subtlety worth reading: a POP and a PUSH onto a window that is
  // already open mean opposite things. Back onto an open window means close
  // everything above it. Clicking an open window that is buried means raise
  // it and leave the rest alone. Same destination, different intent, so the
  // navigation type is what tells them apart. Getting this wrong makes
  // clicking a background window silently close the windows on top of it.
  useEffect(() => {
    setStack((prev) => {
      if (!routeId) return []
      const existing = prev.findIndex((w) => w.id === routeId)
      if (existing >= 0) {
        if (navType === 'POP') return prev.slice(0, existing + 1)
        const raised = prev[existing]
        return [...prev.slice(0, existing), ...prev.slice(existing + 1), raised]
      }
      const def = byId.get(routeId)
      if (!def) return prev
      return [...prev, { id: routeId, ...spawnPosition(def) }]
    })
  }, [routeId, navType])

  const open = useCallback(
    (id: string) => {
      const def = byId.get(id)
      if (!def) return
      if (!def.route) {
        setIntroOpen(true)
        return
      }
      if (location.pathname === def.route) return
      navigate(def.route)
    },
    [location.pathname, navigate],
  )

  const close = useCallback(
    (id: string) => {
      if (id === 'intro') {
        setIntroOpen(false)
        return
      }
      // Going back is what closes a window, so that the Back button and the
      // close box are the same action and can never disagree.
      const idx = stack.findIndex((w) => w.id === id)
      if (idx < 0) return
      const stepsBack = stack.length - idx
      // Someone who followed a link straight to /projects/pickleball-iq has no
      // history behind them. Going back would walk them off the site, which is
      // the worst possible response to clicking a close box.
      const historyIdx = (window.history.state as { idx?: number } | null)?.idx ?? 0
      if (historyIdx - stepsBack < 0) navigate('/', { replace: true })
      else navigate(-stepsBack)
    },
    [navigate, stack],
  )

  const focus = useCallback(
    (id: string) => {
      if (id === 'intro') return
      const def = byId.get(id)
      if (def?.route && location.pathname !== def.route) navigate(def.route)
    },
    [location.pathname, navigate],
  )

  const move = useCallback((id: string, x: number, y: number) => {
    if (id === 'intro') {
      const def = byId.get('intro') as WindowDef
      setIntroPos(clamp(x, y, def))
      return
    }
    setStack((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        const def = byId.get(id)
        if (!def) return w
        return { ...w, ...clamp(x, y, def) }
      }),
    )
  }, [])

  const openWindows = useMemo(() => {
    const list = stack.map((w) => ({ ...w, def: byId.get(w.id) as WindowDef }))
    if (introOpen) {
      // The intro window sits underneath anything routed. It is scenery on
      // first load, and it should never fight a project window for attention.
      return [{ id: 'intro', ...introPos, def: byId.get('intro') as WindowDef }, ...list]
    }
    return list
  }, [stack, introOpen, introPos])

  const topId = openWindows.length ? openWindows[openWindows.length - 1].id : null

  // Escape closes the window on top. Keyboard reachable close is an
  // accessibility requirement, not a nicety, because the close box is 12px.
  const topRef = useRef(topId)
  topRef.current = topId
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      const id = topRef.current
      if (id) close(id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return { openWindows, topId, open, close, focus, move }
}
