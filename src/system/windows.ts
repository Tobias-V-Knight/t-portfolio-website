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
import { windowProjects } from '../data/content'

export type WindowKind =
  | 'intro'
  | 'project'
  | 'photos'
  | 'text'
  | 'trash'
  | 'work'
  | 'archive'
  | 'anime'
  | 'contact'
  | 'zippy'
  | 'video'
  | 'msba'
  | 'resume'

export interface WindowDef {
  id: string
  title: string
  kind: WindowKind
  // Ignore spawn and open in the middle of the screen instead.
  center?: boolean
  // Size as a fraction of the viewport rather than fixed pixels. HOME uses
  // this because it is the composition rather than a note: a window that is
  // 780px on every screen is large on a laptop and lost on a 27 inch display.
  sizeFrac?: { w: number; h: number; maxW: number; maxH: number; minW: number; minH: number }
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
    title: 'HOME',
    kind: 'intro',
    center: true,
    route: null,
    // Moderate and centered, with real margin above and below rather than
    // filling the screen. The background-position (in .mac-home) is what shows
    // the houses over the street, so the window no longer has to be huge.
    width: 940,
    height: 720,
    sizeFrac: { w: 0.58, h: 0.78, maxW: 1080, maxH: 800, minW: 320, minH: 460 },
    spawn: { x: 0.1, y: 0.1 },
  },
  {
    id: 'about',
    title: 'ABOUT_ME.TXT',
    kind: 'text',
    route: '/about',
    width: 500,
    height: 520,
    spawn: { x: 0.26, y: 0.12 },
  },
  {
    // Its own window and its own menu title, T 2026-08-25. ABOUT is the person
    // and RESUME is the record, and a visitor should be able to tell which one
    // they are clicking before they click it.
    id: 'resume',
    title: 'RESUME.TXT',
    kind: 'resume',
    route: '/resume',
    width: 560,
    height: 620,
    spawn: { x: 0.3, y: 0.08 },
  },
  {
    id: 'work',
    title: 'PORTFOLIO',
    kind: 'work',
    route: '/work',
    width: 720,
    height: 520,
    sizeFrac: { w: 0.52, h: 0.72, maxW: 920, maxH: 740, minW: 480, minH: 400 },
    spawn: { x: 0.14, y: 0.1 },
  },
  {
    // The ARCHIVE folder, opened from inside PORTFOLIO.
    //
    // T's call on 2026-08-26, and a better idea than the divider the ticket
    // asked for. A divider is a decoration on a list; a folder is the Finder's
    // own way of saying "these exist and are not the point". It also fixes
    // something a divider cannot: nine archived rows take more vertical space
    // than five case studies, so the thing being played down was dominating
    // the window. One folder row makes the case studies the whole visible list.
    id: 'archive',
    title: 'ARCHIVE',
    kind: 'archive',
    route: '/work/archive',
    width: 660,
    height: 460,
    // Offset from PORTFOLIO's own spawn so the parent stays visible behind it,
    // the way a Finder folder opens beside the window it came from.
    spawn: { x: 0.22, y: 0.2 },
  },
  {
    id: 'msba',
    title: 'MSBA_HIGHLIGHTS',
    kind: 'msba',
    route: '/msba',
    width: 560,
    height: 560,
    spawn: { x: 0.3, y: 0.1 },
  },
  // PHOTOS is parked, not deleted. P2-03: the window and its icon came off on
  // 2026-08-25 because `public/photos/` has nothing real in it yet, and an
  // empty gallery is worse than no gallery. `windows/Photos.tsx` and the
  // `photos` kind stay in the tree so putting it back is one entry here.
  {
    id: 'zippy',
    title: 'ZIPPY',
    kind: 'zippy',
    route: '/zippy',
    width: 360,
    height: 400,
    spawn: { x: 0.52, y: 0.2 },
  },
  {
    id: 'contact',
    title: 'CONTACT',
    kind: 'contact',
    route: '/contact',
    width: 400,
    height: 300,
    spawn: { x: 0.36, y: 0.26 },
  },
  {
    id: 'anime',
    title: 'ANIME',
    kind: 'anime',
    route: '/anime',
    width: 420,
    height: 420,
    spawn: { x: 0.44, y: 0.16 },
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
  {
    // Non-routed like the intro: it opens on load (a movie already playing in
    // the corner) and closing it should not touch the URL or history.
    id: 'luffy',
    title: 'LUFFY.MOV',
    kind: 'video',
    route: null,
    width: 260,
    height: 286,
    spawn: { x: 0.75, y: 0.58 },
  },
  // Only projects with a full case study get a window. Everything else is a
  // row in the WORK list, which is not the same thing as a thin window.
  ...windowProjects.map((p, i) => ({
    id: `project:${p.slug}`,
    title: p.windowTitle,
    kind: 'project' as const,
    route: `/projects/${p.slug}`,
    payload: p.slug,
    // Case-study windows open large, taking a real portion of the screen the
    // way Charlie Dean's project pages do, not a thin note.
    width: 900,
    height: 720,
    sizeFrac: { w: 0.64, h: 0.84, maxW: 1120, maxH: 880, minW: 420, minH: 480 },
    spawn: { x: 0.16 + i * 0.03, y: 0.07 + i * 0.04 },
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

// The one breakpoint, matching the 768px in system.css. Kept as a function
// rather than a constant because it is read on resize, not just on load.
export const isSmallScreen = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768
const KEEP_VISIBLE = 96

function clamp(x: number, y: number, def: WindowDef) {
  const maxX = Math.max(0, window.innerWidth - KEEP_VISIBLE)
  const maxY = Math.max(MENU_BAR, window.innerHeight - 40)
  return {
    x: Math.min(Math.max(x, KEEP_VISIBLE - def.width), maxX),
    y: Math.min(Math.max(y, MENU_BAR), maxY),
  }
}

// Where a zoomed window goes. Every number here is read off a bound that
// already existed rather than chosen fresh, because a zoom that lands outside
// what `clamp` and `resize` allow just gets clamped back and looks like a bug.
//
// `resize` caps width at innerWidth - 24, so a 12px inset each side is exactly
// that cap. `clamp` refuses to put any window's top above MENU_BAR, so that
// floor is the top margin whether we ask for it or not, and the height is what
// is left once the same 12px is kept at the bottom. Windows are positioned
// inside `.mac-desktop`, which already starts below the menu bar, so the menu
// bar stays visible by construction.
const ZOOM_INSET = 12

function zoomRect() {
  return {
    x: ZOOM_INSET,
    y: MENU_BAR,
    w: window.innerWidth - ZOOM_INSET * 2,
    h: window.innerHeight - MENU_BAR * 2 - ZOOM_INSET,
  }
}

// Where a window WILL be, computed before it renders.
//
// The zoom rectangle has to animate from an icon to a window, and it has to
// start on the same frame as the click. Waiting for the window to mount and
// measuring it means a frame of nothing, which is exactly the stutter the
// animation exists to hide. Since position and size are both deterministic,
// the destination can simply be calculated.
export function plannedRect(def: WindowDef) {
  const size = defSize(def)
  const pos = spawnPosition(def)
  return { x: pos.x, y: pos.y, w: size.w, h: size.h }
}

export function defSize(def: WindowDef): { w: number; h: number } {
  if (!def.sizeFrac || typeof window === 'undefined') return { w: def.width, h: def.height }
  const f = def.sizeFrac
  return {
    w: Math.round(Math.min(f.maxW, Math.max(f.minW, window.innerWidth * f.w))),
    h: Math.round(Math.min(f.maxH, Math.max(f.minH, window.innerHeight * f.h))),
  }
}

function spawnPosition(def: WindowDef): { x: number; y: number } {
  const vw = typeof window === 'undefined' ? 1280 : window.innerWidth
  const vh = typeof window === 'undefined' ? 800 : window.innerHeight
  if (def.center) {
    const size = defSize(def)
    return clamp(
      Math.round((vw - size.w) / 2),
      Math.round((vh - MENU_BAR - size.h) / 2) + MENU_BAR,
      def,
    )
  }
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
  // Sizes live outside the window defs because a resize is per instance, not
  // per kind. A classic Mac window had a grow box in the corner and it worked,
  // so ours works too rather than being decoration that lies about itself.
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({})
  // The zoom box, per instance and next to `sizes` for the same reason. A key
  // in here means that window is currently zoomed, and its value is the rect
  // the window had immediately before it was zoomed. It is remembered rather
  // than re-derived on restore, because re-deriving gives the window's default
  // size back and silently throws away wherever the visitor had dragged and
  // grown it to, which is not a restore.
  const [zoomFrom, setZoomFrom] = useState<
    Record<string, { x: number; y: number; w: number; h: number }>
  >({})
  // The window that is currently playing its close animation. It stays
  // mounted for the length of the animation and only then actually closes,
  // because a window that vanishes the instant you click the box reads as a
  // crash rather than as a close.
  const [closing, setClosing] = useState<string | null>(null)
  const [introPos, setIntroPos] = useState(() => spawnPosition(byId.get('intro') as WindowDef))
  // Luffy is a second non-routed window that also opens on load: a movie already
  // playing in the corner. Managed like the intro (own open + position state).
  // Not on a phone. On mobile every window is fixed and full bleed, and Luffy
  // was the top of the stack on load, so it covered HOME and every icon behind
  // it: the mobile site opened on a silent cartoon and nothing else. Luffy is
  // desktop scenery, a movie playing in the corner of somebody's computer, and
  // a corner is exactly what a phone does not have. P2-04.
  const [luffyOpen, setLuffyOpen] = useState(() => !isSmallScreen())
  const [luffyPos, setLuffyPos] = useState(() => spawnPosition(byId.get('luffy') as WindowDef))

  // Which non-routed window has been clicked to the front, if any.
  //
  // P2-01 was reported as "HOME and LUFFY.MOV are missing their title bar
  // pinstripes", but the pinstripes are painted on the active window and these
  // two could never become active: they sat permanently under the routed stack
  // and clicking them did nothing. So the missing stripes were the symptom and
  // the real bug was that two of the windows on the desktop were not really
  // windows. Raising them fixes both at once.
  const [raised, setRaised] = useState<'intro' | 'luffy' | null>(null)

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
    // A routed window always arrives in front. `open` and `focus` already
    // clear this, but the Forward button and a pasted deep link reach the
    // stack through here without touching either, and a project window that
    // opens underneath HOME is the same bug as HOME opening underneath the
    // movie.
    if (routeId) setRaised(null)
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
        if (id === 'luffy') setLuffyOpen(true)
        else setIntroOpen(true)
        return
      }
      setRaised(null)
      if (location.pathname === def.route) return
      navigate(def.route)
    },
    [location.pathname, navigate],
  )

  const close = useCallback(
    (id: string) => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const CLOSE_MS = reduced ? 0 : 150

      // Going back is what closes a window, so that the Back button and the
      // close box are the same action and can never disagree. Someone who
      // followed a link straight to /projects/pickleball-iq has no history
      // behind them, and going back would walk them off the site, which is the
      // worst possible response to clicking a close box.
      const finish = () => {
        setClosing(null)
        // Closing a zoomed window unzooms it. `sizes` outlives a close, so
        // without this the window reopens at its full desktop size but at its
        // small spawn position, and still marked zoomed, so the first click on
        // the zoom box would shrink it. Restoring the remembered size here
        // means it comes back the way the visitor last sized it.
        const wasZoomed = zoomFrom[id]
        if (wasZoomed) {
          setSizes((prev) => ({ ...prev, [id]: { w: wasZoomed.w, h: wasZoomed.h } }))
          setZoomFrom((prev) => {
            const next = { ...prev }
            delete next[id]
            return next
          })
        }
        if (id === 'luffy') {
          setLuffyOpen(false)
          return
        }
        if (id === 'intro') {
          setIntroOpen(false)
          return
        }
        const idx = stack.findIndex((w) => w.id === id)
        if (idx < 0) return
        const stepsBack = stack.length - idx
        const historyIdx = (window.history.state as { idx?: number } | null)?.idx ?? 0
        if (historyIdx - stepsBack < 0) navigate('/', { replace: true })
        else navigate(-stepsBack)
      }

      if (CLOSE_MS === 0) return finish()
      if (closing) return
      setClosing(id)
      window.setTimeout(finish, CLOSE_MS)
      return
    },
    [navigate, stack, closing, zoomFrom],
  )

  const focus = useCallback(
    (id: string) => {
      if (id === 'intro' || id === 'luffy') {
        setRaised(id)
        return
      }
      setRaised(null)
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
    if (id === 'luffy') {
      const def = byId.get('luffy') as WindowDef
      setLuffyPos(clamp(x, y, def))
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

  const resize = useCallback((id: string, w: number, h: number) => {
    const def = byId.get(id)
    if (!def) return
    setSizes((prev) => ({
      ...prev,
      [id]: {
        w: Math.max(280, Math.min(w, window.innerWidth - 24)),
        h: Math.max(180, Math.min(h, window.innerHeight - MENU_BAR - 24)),
      },
    }))
  }, [])

  // The zoom box. Mac OS 8 toggled a window between its own size and one that
  // fitted the screen, and both halves of that are load bearing: a control that
  // only grows is half a control. Going out runs through `move` and `resize` so
  // the zoomed rect obeys exactly the same bounds as a drag and a grow, and
  // coming back writes the remembered rect so the restore is exact.
  //
  // Desktop only. Below 768px every window is pinned full bleed by CSS, so
  // there is nothing for a zoom to do and the box is hidden there.
  const toggleZoom = useCallback(
    (id: string) => {
      if (isSmallScreen()) return
      const def = byId.get(id)
      if (!def) return

      const previous = zoomFrom[id]
      if (previous) {
        setZoomFrom((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        move(id, previous.x, previous.y)
        setSizes((prev) => ({ ...prev, [id]: { w: previous.w, h: previous.h } }))
        return
      }

      const pos =
        id === 'intro' ? introPos : id === 'luffy' ? luffyPos : stack.find((w) => w.id === id)
      if (!pos) return
      const size = sizes[id] ?? defSize(def)
      const rect = zoomRect()

      setZoomFrom((prev) => ({
        ...prev,
        [id]: { x: pos.x, y: pos.y, w: size.w, h: size.h },
      }))
      move(id, rect.x, rect.y)
      resize(id, rect.w, rect.h)
    },
    [zoomFrom, introPos, luffyPos, stack, sizes, move, resize],
  )

  const openWindows = useMemo(() => {
    const list = stack.map((w) => ({ ...w, def: byId.get(w.id) as WindowDef }))
    const luffyWin = luffyOpen
      ? [{ id: 'luffy', ...luffyPos, def: byId.get('luffy') as WindowDef }]
      : []
    const introWin = introOpen
      ? [{ id: 'intro', ...introPos, def: byId.get('intro') as WindowDef }]
      : []

    // Default order, back to front: Luffy, then HOME, then anything routed.
    //
    // Focus and z order are the same thing here, the way they are on a real
    // desktop: the last entry is on top and is the window that draws its
    // pinstripes. So the order below decides what has focus on a cold load,
    // and Luffy used to win it by construction. That put a silent cartoon in
    // front of the site's own front door and left HOME greyed out on the one
    // screen every visitor lands on. HOME sits above the movie now, and both
    // still sit under anything routed, because a project window a visitor
    // asked for outranks scenery that opened by itself.
    const base = [...luffyWin, ...introWin, ...list]

    // Unless one of them was clicked, in which case it comes to the front like
    // any other window would. Clicking a window and watching nothing happen is
    // the single most broken-feeling thing a desktop can do.
    if (!raised) return base
    const idx = base.findIndex((w) => w.id === raised)
    if (idx < 0) return base
    return [...base.slice(0, idx), ...base.slice(idx + 1), base[idx]]
  }, [stack, introOpen, introPos, luffyOpen, luffyPos, raised])

  const topId = openWindows.length ? openWindows[openWindows.length - 1].id : null

  // Crossing the breakpoint mid session has to behave like loading there. A
  // desktop visitor who narrows the browser was the other half of P2-04: the
  // movie window stayed open and went full bleed on top of everything.
  useEffect(() => {
    function onResize() {
      if (isSmallScreen()) setLuffyOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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

  // P2-02. Closing windows one box at a time is fiddly, and by the time a
  // visitor has opened four projects the desk is buried. This is the Finder's
  // option-click-the-close-box, promoted to a menu item because nobody
  // discovers a modifier key on a website.
  //
  // It navigates rather than clearing the stack directly, because the URL owns
  // the stack. Pushing / rather than replacing means Back still walks a
  // visitor's history the way it did before they hit it.
  const closeAll = useCallback(() => {
    setRaised(null)
    setIntroOpen(false)
    setLuffyOpen(false)
    if (location.pathname !== '/') navigate('/')
  }, [location.pathname, navigate])

  return {
    openWindows,
    topId,
    open,
    close,
    closeAll,
    focus,
    move,
    resize,
    sizes,
    closing,
    toggleZoom,
    zoomFrom,
  }
}
