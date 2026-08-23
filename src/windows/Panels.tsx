import { about, contact } from '../data/content'

// Placeholder copy is allowed. Passing placeholder copy off as final is not,
// so anything still carrying the flag says so on screen. CLAUDE.md rule 9.
export function PlaceholderTag() {
  return <p className="mac-tag">PLACEHOLDER COPY</p>
}

// Anything in [ square brackets ] in the copy is a question aimed at T, not
// text meant for a visitor. Rendering it as a visible highlighted slot rather
// than as ordinary prose is the whole safety mechanism: an unanswered blank is
// impossible to mistake for finished copy, so none of them can quietly ship.
export function withBlanks(text: string) {
  return text.split(/(\[[^\]]*\])/g).map((part, i) =>
    part.startsWith('[') && part.endsWith(']') ? (
      <mark className="mac-blank" key={i}>
        {part.slice(1, -1).trim()}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export function IntroPanel() {
  return (
    <div className="mac-doc" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div
          className="mac-sunken"
          style={{
            width: 86,
            height: 104,
            flex: '0 0 auto',
            display: 'grid',
            placeItems: 'center',
          }}
          aria-hidden
        >
          <span className="mac-meta">IMG</span>
        </div>

        <div>
          <h1 style={{ fontFamily: 'var(--mac-chrome)', fontSize: 22, margin: '2px 0 10px' }}>
            {about.name}
          </h1>
          <p className="mac-lede" style={{ marginBottom: 10 }}>
            {about.positioning}
          </p>
          <p className="mac-meta">{about.location}</p>
          <p className="mac-meta">{about.status}</p>
        </div>
      </div>

      <p style={{ margin: 0 }}>{about.lines[0]}</p>
      {about.copyState === 'PLACEHOLDER' && <PlaceholderTag />}
    </div>
  )
}

export function AboutPanel() {
  return (
    <div className="mac-doc">
      <h1>{about.name}</h1>
      <p className="mac-lede">{about.positioning}</p>
      {about.lines.map((line) => (
        <p key={line}>{line}</p>
      ))}

      <h2>CONTACT</h2>
      <ul>
        {contact.map((c) => (
          <li key={c.label}>
            <a href={c.href}>{c.label}</a>
          </li>
        ))}
      </ul>

      {about.copyState === 'PLACEHOLDER' && <PlaceholderTag />}
    </div>
  )
}

// Spec section 14: Easter eggs are encouraged and must never hold anything a
// visitor needs. This one holds a joke and a link that goes nowhere important.
export function TrashPanel() {
  return (
    <div className="mac-doc">
      <p className="mac-meta" style={{ marginBottom: 14 }}>
        3 items, 412 KB
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>RESUME_final_FINAL_v7.DOC</li>
        <li>portfolio_ideas_2019.TXT</li>
        <li>the_first_version_of_this_site.SIT</li>
      </ul>
      <p className="mac-meta" style={{ marginTop: 18 }}>
        Emptying the trash is not undoable.
      </p>
    </div>
  )
}
