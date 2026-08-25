import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Boot, shouldBoot } from './components/Boot'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MenuBar, type Menu } from './components/MenuBar'

// Video.js is heavy; load it only when the movie window opens so it never sits
// in the initial bundle.
const VideoJsPlayer = lazy(() =>
  import('./components/VideoJsPlayer').then((m) => ({ default: m.VideoJsPlayer })),
)
import {
  DocIcon,
  FilmIcon,
  FolderIcon,
  HomeIcon,
  ImgIcon,
  MailIcon,
  PaddleIcon,
  RoadIcon,
  TrashIcon,
  TvIcon,
} from './components/Icons'
import { MacWindow } from './components/Window'
import { defFor, defSize, plannedRect, useWindowManager } from './system/windows'
import { ZoomRect, type Rect } from './components/ZoomRect'
import { about, projects } from './data/content'
import {
  AboutPanel,
  AnimePanel,
  ContactPanel,
  IntroPanel,
  MsbaPanel,
  TrashPanel,
  ZippyPanel,
} from './windows/Panels'
import { ProjectPanel } from './windows/Project'
import { PhotosPanel } from './windows/Photos'
import { WorkPanel } from './windows/Work'
import './styles/system.css'

// Five desktop objects, which is the middle of the four to six the spec asks
// for in phase 1. Every one of them opens something real. An icon that does
// nothing is the fastest way to make the desktop feel like set dressing.
const ZippyIcon = ({ className }: { className?: string }) => (
  <ImgIcon className={className} src={`${import.meta.env.BASE_URL}zippy-icon.png`} alt="" />
)

// Two identical diamonds for two very different projects was the thing that
// made this read as a template. Every icon is now a different object, which is
// most of why a classic Mac desktop is memorable at all.
// Orientation, T's call: professional on the left, fun on the right. The left
// column is the work you'd hire him for; the right is the person.
const desktopItems = [
  { id: 'work', label: 'PORTFOLIO', Art: FolderIcon, side: 'left' },
  { id: 'project:csi-bid-intelligence', label: 'CSI.APP', Art: RoadIcon, side: 'left' },
  { id: 'project:pickleball-iq', label: 'PICKLEBALL_IQ', Art: PaddleIcon, side: 'left' },
  { id: 'msba', label: 'MSBA.TXT', Art: DocIcon, side: 'left' },
  { id: 'about', label: 'ABOUT_ME.TXT', Art: DocIcon, side: 'left' },
  { id: 'contact', label: 'CONTACT', Art: MailIcon, side: 'left' },
  { id: 'photos', label: 'PHOTOS', Art: FolderIcon, side: 'right' },
  { id: 'anime', label: 'ANIME', Art: TvIcon, side: 'right' },
  { id: 'luffy', label: 'LUFFY.MOV', Art: FilmIcon, side: 'right' },
  { id: 'zippy', label: 'ZIPPY', Art: ZippyIcon, side: 'right' },
  { id: 'trash', label: 'TRASH', Art: TrashIcon, side: 'right' },
] as const

// Filenames have no spaces, so a browser either overflows them or breaks them
// mid word. Neither is acceptable on a desktop icon: PICKLEB / ALL_IQ reads as
// a bug. So the break points are chosen here, after an underscore or a dot,
// which is where a Finder label would have broken anyway.
function breakableLabel(label: string) {
  return label.split(/(?<=[_.])/).map((part, i) => (
    <span key={part + i}>
      {part}
      <wbr />
    </span>
  ))
}

// Every window carries the same icon in its title bar that it has on the
// desktop, which is what makes an icon feel like the file rather than like a
// button that happens to open something.
function titleIconFor(id: string, kind: string) {
  const byId: Record<string, () => React.JSX.Element> = {
    intro: () => <HomeIcon className="mac-title-art" />,
    work: () => <FolderIcon className="mac-title-art" />,
    photos: () => <FolderIcon className="mac-title-art" />,
    about: () => <DocIcon className="mac-title-art" />,
    msba: () => <DocIcon className="mac-title-art" />,
    contact: () => <MailIcon className="mac-title-art" />,
    anime: () => <TvIcon className="mac-title-art" />,
    trash: () => <TrashIcon className="mac-title-art" />,
    zippy: () => <ZippyIcon className="mac-title-art" />,
    luffy: () => <FilmIcon className="mac-title-art" />,
    'project:csi-bid-intelligence': () => <RoadIcon className="mac-title-art" />,
    'project:pickleball-iq': () => <PaddleIcon className="mac-title-art" />,
  }
  const exact = byId[id]
  if (exact) return exact()
  if (kind === 'project') return <DocIcon className="mac-title-art" />
  return <DocIcon className="mac-title-art" />
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  const date = now
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase()
  const time = now
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace(' ', '')
    .toUpperCase()
  return `${date}  ${time}`
}

export default function App() {
  const { openWindows, topId, open, close, focus, move, resize, sizes, closing } =
    useWindowManager()
  const clock = useClock()
  // The desktop mounts underneath the boot curtain, not after it. If this
  // component threw, the site would still be there behind it.
  const [booting, setBooting] = useState(() => shouldBoot(window.location.pathname))
  // The zoom rectangle currently flying between an icon and a window.
  const [zoom, setZoom] = useState<{ from: Rect; to: Rect; key: number } | null>(null)
  const zoomKey = useRef(0)
  const [photoStatus, setPhotoStatus] = useState('')
  const [workStatus, setWorkStatus] = useState('')

  // Functional nav, Charlie Dean style: an Apple dropdown (About Tobias / View
  // Resume) plus Portfolio / About / Contact that open their window on click.
  const menus: Menu[] = useMemo(
    () => [
      {
        title: 'APPLE',
        items: [
          { label: 'About Tobias…', onSelect: () => open('about') },
          {
            label: 'View Resume',
            onSelect: () => {
              const r = about.resume
              if (r?.present && r.file)
                window.open(`${import.meta.env.BASE_URL}${r.file}`, '_blank')
              else open('about')
            },
          },
        ],
      },
      { title: 'Portfolio', onSelect: () => open('work') },
      { title: 'About', onSelect: () => open('about') },
      { title: 'Contact', onSelect: () => open('contact') },
    ],
    [open],
  )

  // The desktop icon for a window, so the rectangle has somewhere to fly from
  // and back to. Falls back to the centre of the screen for anything opened
  // from a menu or a deep link, where there is no icon on screen to zoom from.
  const iconRect = useCallback((id: string): Rect => {
    const label = desktopItems.find((d) => d.id === id)?.label
    const el = label
      ? (document.querySelector(`button[aria-label="Open ${label}"]`) as HTMLElement | null)
      : null
    if (el) {
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, w: r.width, h: r.height }
    }
    return { x: window.innerWidth / 2 - 30, y: window.innerHeight / 2 - 20, w: 60, h: 40 }
  }, [])

  const openZoomed = useCallback(
    (id: string) => {
      const def = defFor(id)
      const already = openWindows.some((w) => w.id === id)
      if (def && !already) {
        zoomKey.current += 1
        setZoom({ from: iconRect(id), to: plannedRect(def), key: zoomKey.current })
      }
      open(id)
    },
    [open, openWindows, iconRect],
  )

  const closeZoomed = useCallback(
    (id: string) => {
      const win = openWindows.find((w) => w.id === id)
      if (win) {
        const size = sizes[id] ?? defSize(win.def)
        zoomKey.current += 1
        setZoom({
          from: { x: win.x, y: win.y, w: size.w, h: size.h },
          to: iconRect(id),
          key: zoomKey.current,
        })
      }
      close(id)
    },
    [close, openWindows, sizes, iconRect],
  )

  const handlePhotoStatus = useCallback((s: string) => setPhotoStatus(s), [])
  const handleWorkStatus = useCallback((s: string) => setWorkStatus(s), [])

  return (
    <>
      {booting && <Boot onDone={() => setBooting(false)} />}

      <MenuBar menus={menus} clock={clock} />

      {zoom && (
        <ZoomRect
          key={zoom.key}
          from={zoom.from}
          to={zoom.to}
          onDone={() => setZoom(null)}
        />
      )}

      <main className="mac-desktop">
        {(['left', 'right'] as const).map((side) => (
          <div className={`mac-icons mac-icons-${side}`} key={side}>
            {desktopItems
              .filter((d) => d.side === side)
              .map(({ id, label, Art }) => {
                const isOpen = openWindows.some((w) => w.id === id)
                return (
                  <button
                    className="mac-icon"
                    key={id}
                    data-active={isOpen}
                    onClick={() => openZoomed(id)}
                    aria-label={`Open ${label}`}
                  >
                    <Art className="mac-icon-art" />
                    <span className="mac-icon-label">{breakableLabel(label)}</span>
                  </button>
                )
              })}
          </div>
        ))}

        {openWindows.map((w, i) => {
          const isTop = w.id === topId
          const project =
            w.def.kind === 'project' ? projects.find((p) => p.slug === w.def.payload) : undefined

          return (
            <MacWindow
              key={w.id}
              def={w.def}
              x={w.x}
              y={w.y}
              active={isTop}
              isTop={isTop}
              closing={closing === w.id}
              zIndex={100 + i}
              onClose={() => closeZoomed(w.id)}
              onFocus={() => focus(w.id)}
              onMove={(x, y) => move(w.id, x, y)}
              onResize={(width, height) => resize(w.id, width, height)}
              width={sizes[w.id]?.w ?? defSize(w.def).w}
              height={sizes[w.id]?.h ?? defSize(w.def).h}
              icon={titleIconFor(w.id, w.def.kind)}
              status={
                w.def.kind === 'photos'
                  ? photoStatus
                  : w.def.kind === 'work'
                    ? workStatus
                  : w.def.kind === 'project' && project
                    ? `${project.status}`
                    : undefined
              }
            >
              {w.def.kind === 'intro' && <IntroPanel onOpen={openZoomed} />}
              {w.def.kind === 'text' && <AboutPanel />}
              {w.def.kind === 'msba' && <MsbaPanel />}
              {w.def.kind === 'trash' && <TrashPanel />}
              {w.def.kind === 'anime' && <AnimePanel />}
              {w.def.kind === 'contact' && <ContactPanel />}
              {w.def.kind === 'zippy' && <ZippyPanel />}
              {w.def.kind === 'video' && (
                <ErrorBoundary fallback={<div style={{ padding: 12 }}>Movie unavailable.</div>}>
                  <Suspense fallback={null}>
                    <VideoJsPlayer src={`${import.meta.env.BASE_URL}luffy.mp4`} />
                  </Suspense>
                </ErrorBoundary>
              )}
              {w.def.kind === 'photos' && <PhotosPanel onStatus={handlePhotoStatus} />}
              {w.def.kind === 'work' && (
                <WorkPanel
                  onOpenProject={(slug) => openZoomed(`project:${slug}`)}
                  onStatus={handleWorkStatus}
                />
              )}
              {w.def.kind === 'project' && project && <ProjectPanel project={project} />}
            </MacWindow>
          )
        })}
      </main>
    </>
  )
}
