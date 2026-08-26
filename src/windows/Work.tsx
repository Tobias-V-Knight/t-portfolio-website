import { useEffect } from 'react'
import { archiveProjects, caseStudyProjects, categories, projects } from '../data/content'
import { DocIcon, FolderIcon, PaddleIcon, RoadIcon } from '../components/Icons'

// The PORTFOLIO window, as a classic Mac Finder list: Name / Date Modified /
// Kind / Size, one row per project, each with its own icon.
//
// Only the case studies are listed here. Everything else lives in an ARCHIVE
// folder, which is one row that opens its own window. Everything in that folder
// opens too: the archive is about prominence, not about access.
//
// The curation is the point rather than a shortcut. A Finder list puts every
// row on identical footing, which is exactly why the metaphor works and
// exactly what was flattening the portfolio: CSI BID INTELLIGENCE and DOGS V
// CATS read as peers. A folder is the Finder's own idiom for "these exist and
// are not the point", and it also solves what a divider could not, since nine
// archived rows took more vertical space than five case studies.

const ICON: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  'csi-bid-intelligence': RoadIcon,
  'pickleball-iq': PaddleIcon,
}
const iconFor = (slug: string) => ICON[slug] ?? DocIcon

// A stable, made-up file size so the Size column is not empty. Deterministic,
// and set dressing per CONTEXT.md: nobody reads it as a claim.
const sizeFor = (seed: string) => `${((seed.length * 37) % 900) + 24} K`

const kindFor = (p: (typeof projects)[number]) =>
  p.caseStudy ? 'Case Study' : categories.find((c) => c.id === p.categories[0])?.label ?? 'Document'

function FinderHead() {
  return (
    <div className="mac-finder-head" aria-hidden>
      <span>Name</span>
      <span>Date Modified</span>
      <span>Kind</span>
      <span>Size</span>
    </div>
  )
}

function ProjectRow({
  project,
  onOpen,
}: {
  project: (typeof projects)[number]
  onOpen: (slug: string) => void
}) {
  const Icon = iconFor(project.slug)

  // Every row opens, archived or not. A Finder list makes a promise on every
  // row, and a file that does nothing when you click it reads as broken rather
  // than as unimportant. The archive says these are not the headline; it does
  // not say they are off limits.
  //
  // Depth is decided by the data, not here. `ProjectPanel` renders a section
  // only when the project has it, so a thin entry opens a short window on its
  // own and there is no second template to keep in step.
  return (
    <button
      className="mac-finder-row"
      role="listitem"
      onClick={() => onOpen(project.slug)}
      title={`Open ${project.title}`}
    >
      <span className="mac-finder-name">
        <Icon className="mac-finder-icon" />
        {project.title}
      </span>
      <span className="mac-finder-cell">{project.year}</span>
      <span className="mac-finder-cell">{kindFor(project)}</span>
      <span className="mac-finder-cell">{sizeFor(project.slug)}</span>
    </button>
  )
}

export function WorkPanel({
  onOpenProject,
  onOpenArchive,
  onStatus,
}: {
  onOpenProject: (slug: string) => void
  onOpenArchive: () => void
  onStatus: (s: string) => void
}) {
  // The folder counts as one item, the way a folder does in a Finder window.
  useEffect(() => {
    onStatus(`${caseStudyProjects.length + 1} items`)
  }, [onStatus])

  return (
    <div className="mac-finder">
      <FinderHead />

      <div role="list">
        {caseStudyProjects.map((p) => (
          <ProjectRow key={p.slug} project={p} onOpen={onOpenProject} />
        ))}

        <button
          className="mac-finder-row"
          role="listitem"
          onClick={onOpenArchive}
          title="Open ARCHIVE"
        >
          <span className="mac-finder-name">
            <FolderIcon className="mac-finder-icon" />
            Archive
          </span>
          <span className="mac-finder-cell">2026</span>
          <span className="mac-finder-cell">Folder</span>
          <span className="mac-finder-cell">{archiveProjects.length} items</span>
        </button>
      </div>
    </div>
  )
}

// The ARCHIVE window. Same Finder chrome, and everything in it opens.
export function ArchivePanel({
  onOpenProject,
  onStatus,
}: {
  onOpenProject: (slug: string) => void
  onStatus: (s: string) => void
}) {
  useEffect(() => {
    onStatus(`${archiveProjects.length} items`)
  }, [onStatus])

  return (
    <div className="mac-finder">
      <FinderHead />
      <div role="list">
        {archiveProjects.map((p) => (
          <ProjectRow key={p.slug} project={p} onOpen={onOpenProject} />
        ))}
      </div>
    </div>
  )
}
