import type { ReactNode } from 'react'
import { atAGlancePrompts, categories, type AtAGlance, type Project } from '../data/content'
import { PlaceholderTag, withBlanks } from './Panels'

// Spec section 7. The homepage is world-building, the project page is
// communication, and this is where the site stops being strange. Mac chrome
// stays on the outside, everything inside is editorial: Inter, real line
// height, real measure. No pixel font touches a paragraph in this file.
//
// Sections render only when the data has them. A project may be missing architecture
// and stack on purpose. Read the constraint note in content.ts before adding
// anything to it.

type Media = NonNullable<Project['media']>[number]

// The hero, ADR-0001 section 1. Name, one sentence, the metadata row, then the
// ways out, and nothing else above the fold.
//
// The metadata was a two line block of prose. It is four short labels, and a
// set of short labels is a list: the site already has one way of drawing that,
// the chip, so this reuses it rather than inventing a second one.
function HeroMeta({ project }: { project: Project }) {
  // FOCUS is the project's own `categories`, read through the vocabulary in
  // content.ts, so the word on this chip is the word on the filter chip in
  // PORTFOLIO. A second taxonomy for the same idea is how the two drift apart.
  const focus = project.categories
    .map((id) => categories.find((c) => c.id === id)?.label)
    .filter((label): label is string => Boolean(label))

  // FOCUS · YEAR · ROLE · STATUS, and the order is the whole contract. There is
  // no "FOCUS:" in front of each chip because a label per chip roughly doubles
  // the word count of the one part of the page that has a 50 to 100 word budget,
  // and the values already say what they are.
  //
  // An empty field renders no chip rather than an empty one. No project with a
  // window has an empty one today, so this is a guard rather than a fix: a
  // project may carry a deliberately empty `role`.
  const fields = [
    { key: 'year', value: project.year },
    { key: 'role', value: project.role },
    { key: 'status', value: project.status },
  ].filter((f) => f.value.trim().length > 0)

  if (!focus.length && !fields.length) return null

  return (
    <div className="mac-hero-meta">
      {focus.map((label) => (
        <span className="mac-stack-tag" key={`focus-${label}`}>
          {label}
        </span>
      ))}
      {fields.map((f) => (
        <span className="mac-stack-tag" key={f.key}>
          {withBlanks(f.value)}
        </span>
      ))}
    </div>
  )
}

// Action chips, generated from the `links` a project already has. A project
// with no links renders nothing here: an empty row of chips is worse than no
// row, because it reads as something that failed to load.
//
// A link whose href is still an unanswered blank renders as a dead chip that
// says so, the same guard ContactPanel uses. An unanswered blank is never
// allowed to look like a working button.
function HeroActions({ project }: { project: Project }) {
  const links = project.links ?? []
  if (!links.length) return null

  return (
    <div className="mac-hero-actions">
      {links.map((l) =>
        l.href.startsWith('[') ? (
          <span className="mac-hero-action" key={l.label} data-blank="true">
            {withBlanks(l.href)}
          </span>
        ) : (
          <a className="mac-hero-action" key={l.label} href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ),
      )}
    </div>
  )
}

// At a glance, ADR-0001 section 2. Four cells, and a visitor who reads nothing
// else on the page still knows what the project was.
//
// The order is fixed here rather than driven by the data, because the order is
// the argument: what hurt, what was done about it, what exists, why anyone
// should believe it. A project cannot reorder it and a project cannot drop a
// cell, which is why this renders unconditionally and falls back to the prompts
// in content.ts. An at a glance panel that disappears when the data is thin is
// a panel that is missing on exactly the pages that need it most.
const GLANCE_CELLS: { key: keyof AtAGlance; label: string }[] = [
  { key: 'problem', label: 'PROBLEM' },
  { key: 'approach', label: 'APPROACH' },
  { key: 'output', label: 'OUTPUT' },
  { key: 'evidence', label: 'EVIDENCE' },
]

function AtAGlancePanel({ project }: { project: Project }) {
  // A description list is what this is: four terms, four definitions. The div
  // per pair is valid inside a dl and it is what makes each pair one grid cell.
  return (
    <dl className="mac-glance mac-doc-full">
      {GLANCE_CELLS.map(({ key, label }) => {
        const value = project.atAGlance?.[key]?.trim()
        return (
          <div className="mac-glance-cell" key={key}>
            <dt className="mac-glance-label">{label}</dt>
            <dd className="mac-glance-value">{withBlanks(value || atAGlancePrompts[key])}</dd>
          </div>
        )
      })}
    </dl>
  )
}

// One picture, one caption. Was three inline style objects repeated per media
// item; it is a class now because the same figure is drawn in two different
// slots (the side column and the full width diagram band) and an inline style
// cannot be told which slot it is in.
function Figure({ item }: { item: Media }) {
  return (
    <figure className="mac-figure">
      {item.src ? (
        <img className="mac-sunken" src={`${import.meta.env.BASE_URL}${item.src}`} alt={item.caption} />
      ) : (
        <div className="mac-sunken mac-figure-box" data-tone={item.tone}>
          <span className="mac-meta">{item.tone === 'diagram' ? 'DIAGRAM' : 'SCREENSHOT'}</span>
        </div>
      )}
      <figcaption>{item.caption}</figcaption>
    </figure>
  )
}

interface Block {
  key: string
  node: ReactNode
}

// The editorial grid, ADR-0004 and issue #34.
//
// The rule is that the measure wins and the grid is how it is achieved. Running
// text stays capped at --measure at every width, and the grid puts the
// visuals and the metadata in the space that cap frees rather than letting the
// prose stretch into it. At 1600 a text column at "55 percent of the window"
// would set about 100 characters to the line, which is the bug P2-08 fixed.
//
// The arrangement is done here rather than in CSS because CSS can only place
// what the markup gives it. Three kinds of block go into one flat grid:
//
//   .mac-doc-text   running text, column one, capped at the measure
//   .mac-doc-side   a visual or a metadata panel, column two, beside the text
//   .mac-doc-full   spans both columns: the hero, at a glance, the diagrams
//
// A side block lands beside a text block because it is emitted immediately
// after it and grid auto placement puts an explicitly placed column two item on
// the row the cursor is already on. That pairing is the reason this zips two
// lists together instead of rendering two long columns: two independent columns
// need the markup to be two containers, and two containers on a phone means the
// pictures all end up below the prose. One flat list collapses into one column
// in source order, so narrow gets picture, prose, picture, prose, which is the
// same page rather than a second one. Acceptance criterion: one layout, not two.
export function ProjectPanel({ project }: { project: Project }) {
  const media = project.media ?? []
  // Diagrams are not visuals in the same sense as a screenshot. ADR-0004 says
  // they take the full width, because a system diagram squeezed into a 260px
  // rail communicates nothing.
  const diagrams = media.filter((m) => m.tone === 'diagram')
  const shots = media.filter((m) => m.tone !== 'diagram')

  // Column one, in the order ADR-0001 sets.
  const text: Block[] = []

  if (project.problem) {
    text.push({
      key: 'problem',
      node: (
        <>
          <h2>THE PROBLEM</h2>
          <p>{withBlanks(project.problem)}</p>
        </>
      ),
    })
  }

  if (project.built) {
    text.push({
      key: 'built',
      node: (
        <>
          <h2>WHAT WAS BUILT</h2>
          <ul>
            {project.built.map((b) => (
              <li key={b}>{withBlanks(b)}</li>
            ))}
          </ul>
        </>
      ),
    })
  }

  if (project.architecture) {
    text.push({
      key: 'architecture',
      node: (
        <>
          <h2>ARCHITECTURE</h2>
          <p>{withBlanks(project.architecture)}</p>
        </>
      ),
    })
  }

  if (project.evidence) {
    text.push({
      key: 'evidence',
      node: (
        <>
          <h2>EVIDENCE</h2>
          <ul>
            {project.evidence.map((e) => (
              <li key={e}>{withBlanks(e)}</li>
            ))}
          </ul>
        </>
      ),
    })
  }

  if (project.lessons) {
    text.push({
      key: 'lessons',
      node: (
        <>
          <h2>WHAT I LEARNED</h2>
          <ul>
            {project.lessons.map((l) => (
              <li key={l}>{withBlanks(l)}</li>
            ))}
          </ul>
        </>
      ),
    })
  }

  // Column two. Screenshots first, so a picture sits beside the opening prose
  // rather than at the foot of the page, and the stack last, which is roughly
  // where ADR-0001 puts it.
  const side: Block[] = shots.map((m, i) => ({ key: `shot-${i}`, node: <Figure item={m} /> }))

  if (project.stack?.length) {
    // ADR-0001 section 9: chips, reusing the toolbox styling so the tools on a
    // project page are drawn the same way as the tools in the skills taxonomy.
    // It was one line of dot separated prose, which is readable across a whole
    // window and unreadable down a 260px rail.
    side.push({
      key: 'stack',
      node: (
        <>
          <h3 className="mac-doc-side-label">STACK</h3>
          <div className="mac-stack-tags">
            {project.stack.map((s) => (
              <span className="mac-stack-tag" key={s}>
                {withBlanks(s)}
              </span>
            ))}
          </div>
        </>
      ),
    })
  }

  const diagramBand = diagrams.length ? (
    <div className="mac-doc-full mac-doc-diagrams" key="diagrams">
      {diagrams.map((m) => (
        <Figure item={m} key={m.caption} />
      ))}
    </div>
  ) : null

  const hasArchitecture = text.some((t) => t.key === 'architecture')
  const flow: ReactNode[] = []

  text.forEach((t, i) => {
    flow.push(
      <section className="mac-doc-text" key={t.key}>
        {t.node}
      </section>,
    )

    // The side block goes immediately after its text block, which is what puts
    // the two on the same grid row. Anything between them costs the pairing.
    const s = side[i]
    if (s) {
      flow.push(
        <aside className="mac-doc-side" key={s.key}>
          {s.node}
        </aside>,
      )
    }

    // The diagram belongs under the paragraph that describes the system, so it
    // is placed after ARCHITECTURE rather than in a section of its own.
    if (t.key === 'architecture' && diagramBand) flow.push(diagramBand)
  })

  // More pictures than sections. They stack down column two on their own rows
  // rather than being dropped, which is not beautiful but is honest: the fix is
  // to write the missing sections, not to hide the material.
  side.slice(text.length).forEach((s) => {
    flow.push(
      <aside className="mac-doc-side" key={s.key}>
        {s.node}
      </aside>,
    )
  })

  // A project with diagrams and no ARCHITECTURE paragraph still shows them.
  if (diagramBand && !hasArchitecture) flow.push(diagramBand)

  return (
    <article className="mac-doc mac-doc-grid">
      <header className="mac-hero mac-doc-full">
        <h1>{project.title}</h1>
        <p className="mac-lede">{withBlanks(project.oneLiner)}</p>

        <HeroMeta project={project} />
        <HeroActions project={project} />
      </header>

      <AtAGlancePanel project={project} />

      {flow}

      {/* There is no LINKS section at the foot any more. The same links are the
          action chips in the hero, and printing them twice on one page is a
          worse answer to "where do I go next" than printing them once, high up,
          where somebody who is not going to scroll can still see them. */}

      {project.copyState === 'PLACEHOLDER' && (
        <div className="mac-doc-text">
          <PlaceholderTag />
        </div>
      )}
    </article>
  )
}
