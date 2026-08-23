import { useCallback, useEffect, useMemo, useState } from 'react'
import { MenuBar, type Menu } from './components/MenuBar'
import { AppIcon, DiskIcon, DocIcon, FolderIcon, TrashIcon } from './components/Icons'
import { Crt } from './components/Crt'
import { MacWindow } from './components/Window'
import { useWindowManager } from './system/windows'
import { projects, windowProjects } from './data/content'
import { AboutPanel, IntroPanel, TrashPanel } from './windows/Panels'
import { ProjectPanel } from './windows/Project'
import { PhotosPanel } from './windows/Photos'
import { WorkPanel } from './windows/Work'
import './styles/system.css'

// Five desktop objects, which is the middle of the four to six the spec asks
// for in phase 1. Every one of them opens something real. An icon that does
// nothing is the fastest way to make the desktop feel like set dressing.
const desktopItems = [
  { id: 'work', label: 'WORK', Art: DiskIcon },
  { id: 'project:gravl', label: 'GRAVL', Art: AppIcon },
  { id: 'project:pickleball-iq', label: 'PICKLEBALL_IQ', Art: AppIcon },
  { id: 'photos', label: 'PHOTOS', Art: FolderIcon },
  { id: 'about', label: 'ABOUT_ME.TXT', Art: DocIcon },
  { id: 'trash', label: 'TRASH', Art: TrashIcon },
]

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

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  return now
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace(' ', '')
    .toUpperCase()
}

export default function App() {
  const { openWindows, topId, open, close, focus, move } = useWindowManager()
  const clock = useClock()
  const [photoStatus, setPhotoStatus] = useState('')
  const [workStatus, setWorkStatus] = useState('')

  const menus: Menu[] = useMemo(
    () => [
      {
        title: '◆',
        items: [
          { label: 'About This Macintosh', onSelect: () => open('intro') },
          { label: 'Control Panels', separatorBefore: true },
          { label: 'Chooser' },
        ],
      },
      {
        title: 'File',
        items: [
          { label: 'Open', shortcut: '⌘O' },
          { label: 'Close Window', shortcut: '⌘W', onSelect: () => topId && close(topId) },
          { label: 'Get Info', shortcut: '⌘I', separatorBefore: true },
        ],
      },
      {
        title: 'Edit',
        items: [
          { label: 'Undo', shortcut: '⌘Z' },
          { label: 'Cut', shortcut: '⌘X', separatorBefore: true },
          { label: 'Copy', shortcut: '⌘C' },
          { label: 'Paste', shortcut: '⌘V' },
        ],
      },
      {
        title: 'View',
        items: [{ label: 'as Icons' }, { label: 'as List' }, { label: 'Clean Up' }],
      },
      {
        // The recruiter path. Handoff section 4: this has to be obvious, and
        // it has to reach every part of the site in one click.
        title: 'Go',
        items: [
          { label: 'Work', onSelect: () => open('work') },
          ...windowProjects.map((p) => ({
            label: p.title,
            onSelect: () => open(`project:${p.slug}`),
          })),
          { label: 'Photos', onSelect: () => open('photos'), separatorBefore: true },
          { label: 'About', onSelect: () => open('about') },
        ],
      },
      {
        title: 'Special',
        items: [
          { label: 'Empty Trash', onSelect: () => open('trash') },
          { label: 'Restart', separatorBefore: true },
          { label: 'Shut Down' },
        ],
      },
    ],
    [open, close, topId],
  )

  const handlePhotoStatus = useCallback((s: string) => setPhotoStatus(s), [])
  const handleWorkStatus = useCallback((s: string) => setWorkStatus(s), [])

  return (
    <>
      <MenuBar menus={menus} clock={clock} />

      <main className="mac-desktop">
        {/* Scenery, and the only object on the desktop that is not a control.
            It sits behind every window and takes no pointer events. */}
        <Crt />

        <div className="mac-icons">
          {desktopItems.map(({ id, label, Art }) => {
            const isOpen = openWindows.some((w) => w.id === id)
            return (
              <button
                className="mac-icon"
                key={id}
                data-active={isOpen}
                onClick={() => open(id)}
                aria-label={`Open ${label}`}
              >
                <Art className="mac-icon-art" />
                <span className="mac-icon-label">{breakableLabel(label)}</span>
              </button>
            )
          })}
        </div>

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
              zIndex={100 + i}
              onClose={() => close(w.id)}
              onFocus={() => focus(w.id)}
              onMove={(x, y) => move(w.id, x, y)}
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
              {w.def.kind === 'intro' && <IntroPanel />}
              {w.def.kind === 'text' && <AboutPanel />}
              {w.def.kind === 'trash' && <TrashPanel />}
              {w.def.kind === 'photos' && <PhotosPanel onStatus={handlePhotoStatus} />}
              {w.def.kind === 'work' && (
                <WorkPanel
                  onOpenProject={(slug) => open(`project:${slug}`)}
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
