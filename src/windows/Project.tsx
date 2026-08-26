import { categories, type Project } from '../data/content'
import { PlaceholderTag, withBlanks } from './Panels'

// Spec section 7. The homepage is world-building, the project page is
// communication, and this is where the site stops being strange. Mac chrome
// stays on the outside, everything inside is editorial: Inter, real line
// height, real measure. No pixel font touches a paragraph in this file.
//
// Sections render only when the data has them. Gravl is missing architecture
// and stack on purpose. Read the constraint note in content.ts before adding
// anything to it.

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
  // window has an empty one today, so this is a guard and not a fix: Gravl is
  // the one with a deliberately empty `role`, and Gravl has no window.
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

export function ProjectPanel({ project }: { project: Project }) {
  return (
    <article className="mac-doc">
      <header className="mac-hero">
        <h1>{project.title}</h1>
        <p className="mac-lede">{withBlanks(project.oneLiner)}</p>

        <HeroMeta project={project} />
        <HeroActions project={project} />
      </header>

      {project.problem && (
        <>
          <h2>THE PROBLEM</h2>
          <p>{withBlanks(project.problem)}</p>
        </>
      )}

      {project.built && (
        <>
          <h2>WHAT WAS BUILT</h2>
          <ul>
            {project.built.map((b) => (
              <li key={b}>{withBlanks(b)}</li>
            ))}
          </ul>
        </>
      )}

      {project.architecture && (
        <>
          <h2>ARCHITECTURE</h2>
          <p>{withBlanks(project.architecture)}</p>
        </>
      )}

      {project.stack && (
        <>
          <h2>STACK</h2>
          <p className="mac-meta">{withBlanks(project.stack.join('  ·  '))}</p>
        </>
      )}

      {project.media && (
        <>
          <h2>SCREENS</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {project.media.map((m) => (
              <figure key={m.caption} style={{ margin: 0 }}>
                {m.src ? (
                  <img
                    className="mac-sunken"
                    src={`${import.meta.env.BASE_URL}${m.src}`}
                    alt={m.caption}
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                ) : (
                  <div
                    className="mac-sunken"
                    style={{ height: m.tone === 'diagram' ? 132 : 168, display: 'grid', placeItems: 'center' }}
                  >
                    <span className="mac-meta">{m.tone === 'diagram' ? 'DIAGRAM' : 'SCREENSHOT'}</span>
                  </div>
                )}
                <figcaption className="mac-meta" style={{ marginTop: 6 }}>
                  {m.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      )}

      {project.evidence && (
        <>
          <h2>EVIDENCE</h2>
          <ul>
            {project.evidence.map((e) => (
              <li key={e}>{withBlanks(e)}</li>
            ))}
          </ul>
        </>
      )}

      {project.lessons && (
        <>
          <h2>WHAT I LEARNED</h2>
          <ul>
            {project.lessons.map((l) => (
              <li key={l}>{withBlanks(l)}</li>
            ))}
          </ul>
        </>
      )}

      {/* There is no LINKS section at the foot any more. The same links are the
          action chips in the hero, and printing them twice on one page is a
          worse answer to "where do I go next" than printing them once, high up,
          where somebody who is not going to scroll can still see them. */}

      {project.copyState === 'PLACEHOLDER' && <PlaceholderTag />}
    </article>
  )
}
