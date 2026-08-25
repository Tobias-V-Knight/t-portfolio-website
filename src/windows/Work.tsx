import { useEffect } from 'react'
import { categories, projects } from '../data/content'
import { DocIcon, PaddleIcon, RoadIcon } from '../components/Icons'

// The PORTFOLIO window, as a classic Mac Finder list: Name / Date Modified /
// Kind / Size, one row per project, each with its own icon. Clicking a project
// that has a case study opens its window; the rest are files you can see but
// not open, which is how a Finder folder behaves.

const ICON: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  'csi-bid-intelligence': RoadIcon,
  'pickleball-iq': PaddleIcon,
}
const iconFor = (slug: string) => ICON[slug] ?? DocIcon

// A stable, made-up file size so the Size column is not empty. Deterministic.
const sizeFor = (seed: string) => `${((seed.length * 37) % 900) + 24} K`

const kindFor = (p: (typeof projects)[number]) =>
  p.hasWindow ? 'Case Study' : categories.find((c) => c.id === p.categories[0])?.label ?? 'Document'

export function WorkPanel({
  onOpenProject,
  onStatus,
}: {
  onOpenProject: (slug: string) => void
  onStatus: (s: string) => void
}) {
  useEffect(() => {
    onStatus(`${projects.length} items`)
  }, [onStatus])

  return (
    <div className="mac-finder">
      <div className="mac-finder-head" aria-hidden>
        <span>Name</span>
        <span>Date Modified</span>
        <span>Kind</span>
        <span>Size</span>
      </div>

      <div role="list">
        {projects.map((p) => {
          const Icon = iconFor(p.slug)
          return (
            <button
              key={p.slug}
              className="mac-finder-row"
              role="listitem"
              disabled={!p.hasWindow}
              onClick={() => p.hasWindow && onOpenProject(p.slug)}
              title={p.hasWindow ? `Open ${p.title}` : undefined}
            >
              <span className="mac-finder-name">
                <Icon className="mac-finder-icon" />
                {p.title}
              </span>
              <span className="mac-finder-cell">{p.year}</span>
              <span className="mac-finder-cell">{kindFor(p)}</span>
              <span className="mac-finder-cell">{sizeFor(p.slug)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
