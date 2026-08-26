import type { Project } from '../data/content'
import { PlaceholderTag, withBlanks } from './Panels'

// Spec section 7. The homepage is world-building, the project page is
// communication, and this is where the site stops being strange. Mac chrome
// stays on the outside, everything inside is editorial: Inter, real line
// height, real measure. No pixel font touches a paragraph in this file.
//
// Sections render only when the data has them. Gravl is missing architecture
// and stack on purpose. Read the constraint note in content.ts before adding
// anything to it.

export function ProjectPanel({ project }: { project: Project }) {
  return (
    <article className="mac-doc">
      <h1>{project.title}</h1>
      <p className="mac-lede">{withBlanks(project.oneLiner)}</p>

      <p className="mac-meta">
        {withBlanks(project.role)}
        <br />
        {withBlanks(project.status)}
      </p>

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

      {project.links && (
        <>
          <h2>LINKS</h2>
          <ul>
            {project.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {project.copyState === 'PLACEHOLDER' && <PlaceholderTag />}
    </article>
  )
}
