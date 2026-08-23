import { useEffect, useMemo, useState } from 'react'
import { categories, projects, type Category } from '../data/content'
import { PlaceholderTag } from './Panels'

// The WORK window. Filter chips across the top, every project as a row.
//
// The reason this exists rather than a desktop full of project icons: a
// recruiter arrives looking for one specific thing, usually a role family, and
// a grid of undifferentiated icons makes them hunt. Chips let them answer
// "does he do ML" in one click, which is the whole job of this window.
//
// Rows are not windows. Only a project with a real case study written for it
// opens one, which is what keeps the handoff's fewer and fuller rule intact
// while still showing the full range of what T has built.

export function WorkPanel({
  onOpenProject,
  onStatus,
}: {
  onOpenProject: (slug: string) => void
  onStatus: (s: string) => void
}) {
  const [active, setActive] = useState<Category | 'all'>('all')

  const shown = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.categories.includes(active))),
    [active],
  )

  // The status bar is the one place a Finder window told you how much was in
  // it, so it reports the filter result rather than a fixed count. It goes
  // through an effect because writing to a parent's state during render is
  // how you get an infinite loop rather than a status bar.
  const label = active === 'all' ? 'ALL' : categories.find((c) => c.id === active)?.label
  useEffect(() => {
    onStatus(`${shown.length} of ${projects.length} items, ${label}`)
  }, [shown.length, label, onStatus])

  return (
    <div className="mac-doc">
      <div className="mac-chips" role="group" aria-label="Filter projects by category">
        <button
          className="mac-chip"
          data-on={active === 'all'}
          onClick={() => setActive('all')}
          aria-pressed={active === 'all'}
        >
          ALL
        </button>
        {categories.map((c) => (
          <button
            className="mac-chip"
            key={c.id}
            data-on={active === c.id}
            onClick={() => setActive(c.id)}
            aria-pressed={active === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="mac-worklist">
        {shown.map((p) => (
          <li className="mac-workrow" key={p.slug}>
            <div className="mac-workrow-head">
              {p.hasWindow ? (
                <button className="mac-workrow-title" onClick={() => onOpenProject(p.slug)}>
                  {p.title}
                </button>
              ) : (
                <span className="mac-workrow-title" data-static="true">
                  {p.title}
                </span>
              )}
              <span className="mac-meta">{p.year}</span>
            </div>

            <p className="mac-workrow-line">{p.oneLiner}</p>

            <p className="mac-meta">
              {p.categories.map((c) => categories.find((x) => x.id === c)?.label).join(' / ')}
              {p.links?.length ? ' · ' : ''}
              {p.links?.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
              {p.hasWindow ? ' · CASE STUDY' : ''}
            </p>
          </li>
        ))}
      </ul>

      <PlaceholderTag />
    </div>
  )
}
