import { useEffect } from 'react'
import { archiveProjects, caseStudyProjects, categories, projects } from '../data/content'
import type { Project } from '../data/content'
import { DocIcon, PaddleIcon, RoadIcon } from '../components/Icons'

// The PORTFOLIO window, as a classic Mac Finder list: Name / Date Modified /
// Kind / Size, one row per project, each with its own icon.
//
// The list is in two groups (issue #38). The case studies come first and open a
// window. Below an ARCHIVE divider sit the rest, which open nothing: a Finder
// list gives every row the same visual weight, so eight coursework projects
// listed beside CSI drag CSI down to their level.

const ICON: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  'csi-bid-intelligence': RoadIcon,
  'pickleball-iq': PaddleIcon,
}
const iconFor = (slug: string) => ICON[slug] ?? DocIcon

// A stable, made-up file size so the Size column is not empty. Deterministic.
// Set dressing, per CONTEXT.md: nobody reads it as a claim about the work.
const sizeFor = (seed: string) => `${((seed.length * 37) % 900) + 24} K`

const kindFor = (p: Project) =>
  p.hasWindow ? 'Case Study' : categories.find((c) => c.id === p.categories[0])?.label ?? 'Document'

// `alt` is passed in rather than left to :nth-child because the divider sits
// between the two lists and would otherwise flip the stripe parity halfway
// down. The Finder stripes the folder, not each group inside it.
function FinderRow({ project, alt, onOpen }: { project: Project; alt: boolean; onOpen?: () => void }) {
  const Icon = iconFor(project.slug)
  const cells = (
    <>
      <span className="mac-finder-name">
        <Icon className="mac-finder-icon" />
        {project.title}
      </span>
      <span className="mac-finder-cell">{project.year}</span>
      <span className="mac-finder-cell">{kindFor(project)}</span>
      <span className="mac-finder-cell">{sizeFor(project.slug)}</span>
    </>
  )

  // An archive entry is a plain row, never a disabled button. A greyed out
  // control that does nothing when clicked reads as a case study that is
  // broken; a row that was never a control reads as a file that is simply
  // listed, which is what it is.
  if (!onOpen) {
    return (
      <div className="mac-finder-row" role="listitem" data-alt={alt ? 'true' : undefined}>
        {cells}
      </div>
    )
  }

  return (
    <button
      className="mac-finder-row"
      role="listitem"
      data-alt={alt ? 'true' : undefined}
      onClick={onOpen}
      title={`Open ${project.title}`}
    >
      {cells}
    </button>
  )
}

export function WorkPanel({
  onOpenProject,
  onStatus,
}: {
  onOpenProject: (slug: string) => void
  onStatus: (s: string) => void
}) {
  useEffect(() => {
    // The footer counts the folder, not the openable part of it. An archive
    // entry is still an item.
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

      <div role="list" aria-label="Case studies">
        {caseStudyProjects.map((p, i) => (
          <FinderRow
            key={p.slug}
            project={p}
            alt={i % 2 === 1}
            onOpen={() => onOpenProject(p.slug)}
          />
        ))}
      </div>

      <div className="mac-finder-divider">ARCHIVE</div>

      <div role="list" aria-label="Archive">
        {archiveProjects.map((p, i) => (
          <FinderRow key={p.slug} project={p} alt={(caseStudyProjects.length + i) % 2 === 1} />
        ))}
      </div>
    </div>
  )
}
