import {
  about,
  anime,
  animeCopyState,
  capabilities,
  capabilitiesCopyState,
  capabilitiesLede,
  contact,
  cv,
  home,
  HOME_TAGS,
  msba,
  stack,
  type Role,
} from '../data/content'

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

// HOME.
//
// The layout T pointed at on charliedean.com: a photograph filling the window,
// a translucent panel of text sitting on it, and a row of buttons underneath.
// The photo is his own, from the same roll as the desktop, with the person on
// the towel cropped out.
//
// It is the first window a visitor sees, so the four buttons are the whole
// site in one row: the work, the background behind it, how to reach him, and
// the document a recruiter came for.
export function IntroPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const buttons: { label: string; id?: string; blank?: boolean }[] = [
    { label: 'PORTFOLIO', id: 'work' },
    { label: 'CV', id: 'cv' },
    { label: 'ABOUT', id: 'about' },
    { label: 'CONTACT', id: 'contact' },
  ]

  return (
    <div
      className="mac-home"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}home-bg.jpg)` }}
    >
      <div className="mac-home-panel">
        <div className="mac-home-head">
          <img
            className="mac-portrait"
            src={`${import.meta.env.BASE_URL}t-profile.jpg`}
            alt="Tobias Knight"
          />

          <div>
            <h1 className="mac-home-name">{home.name}</h1>
            <p className="mac-home-sub">{home.positioning}</p>
            <p className="mac-meta">{home.location}</p>
            <p className="mac-meta">{home.status}</p>

            {/* The availability chip is parked, T 2026-08-25. The copy and the
                styling both stay in the tree (`home.availability`, `.mac-avail`)
                so putting it back is uncommenting this block. */}
          </div>
        </div>

        <p className="mac-home-line">{home.line}</p>

        {/* The snapshot. Labels only, first `HOME_TAGS` of each group, because
            HOME is a desk and not a document. CV renders the same lists in
            full, which is what stops the two from drifting apart. */}
        <StackSnapshot />

        <div className="mac-home-actions">
          {buttons.map((b) =>
            b.blank ? (
              <span className="mac-btn" key={b.label} data-blank="true">
                {b.label}
              </span>
            ) : (
              <button className="mac-btn" key={b.label} onClick={() => b.id && onOpen(b.id)}>
                {b.label}
              </button>
            ),
          )}
        </div>

        {home.copyState === 'PLACEHOLDER' && <PlaceholderTag />}
      </div>
    </div>
  )
}

// The four rows, short form. One row per group, label on the left so the eye
// can skip a row it does not care about, which is the whole reason these are
// grouped rather than being one long wall of tags.
export function StackSnapshot() {
  return (
    <div className="mac-stack">
      {stack.map((g) => (
        <div className="mac-stack-row" key={g.id}>
          <p className="mac-stack-label">{g.label}</p>
          <div className="mac-stack-tags">
            {g.items.slice(0, HOME_TAGS).map((item) => (
              <span className="mac-stack-tag" key={item}>
                {item}
              </span>
            ))}
            {g.items.length > HOME_TAGS && (
              <span className="mac-stack-more">+{g.items.length - HOME_TAGS}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function RoleList({ rows }: { rows: Role[] }) {
  return (
    <ul className="mac-rolelist">
      {rows.map((r) => (
        <li key={r.org}>
          <span className="mac-role-org">{r.org}</span>
          <span className="mac-meta">
            {withBlanks(r.role)} · {withBlanks(r.when)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function MsbaPanel() {
  return (
    <div className="mac-doc">
      <h1>{msba.title}</h1>
      <p className="mac-lede">{msba.lede}</p>

      {/* P2-06. A course is a header, a line and a stack, and the stack is
          tags: it is a list, and prose is the wrong shape for a list. Same
          chip as the HOME and CV stack rows, deliberately, so the site has one
          way of showing "these are the things it was built with". */}
      <h2>COURSEWORK</h2>
      <ul className="mac-courses">
        {msba.courses.map((c) => (
          <li className="mac-course" key={c.name}>
            <p className="mac-course-head">
              {withBlanks(c.code)} · {withBlanks(c.name)}
            </p>
            <p className="mac-course-note">{withBlanks(c.note)}</p>
            <div className="mac-stack-tags">
              {c.stack.map((tag) =>
                tag.startsWith('[') ? (
                  <span key={tag}>{withBlanks(tag)}</span>
                ) : (
                  <span className="mac-stack-tag" key={tag}>
                    {tag}
                  </span>
                ),
              )}
            </div>
          </li>
        ))}
      </ul>

      <h2>TOPICS I KEEP COMING BACK TO</h2>
      <ul>
        {msba.topics.map((t) => (
          <li key={t}>{withBlanks(t)}</li>
        ))}
      </ul>

      <h2>FROM THE NOTEBOOK</h2>
      <ul>
        {msba.notes.map((n) => (
          <li key={n}>{withBlanks(n)}</li>
        ))}
      </ul>
    </div>
  )
}

// WHAT I CONTRACT IN. Lives in CV, not on HOME: these are paragraphs and HOME
// is a snapshot. The four stack rows are the HOME version of this idea.
export function CapabilityList() {
  return (
    <>
      <p className="mac-lede">{capabilitiesLede}</p>

      <ul className="mac-caps">
        {capabilities.map((c) => (
          <li className="mac-cap" key={c.name}>
            <h3 className="mac-cap-name">{c.name}</h3>
            <p className="mac-cap-line">{c.line}</p>
            <p className="mac-cap-proof">PROOF: {c.proof}</p>
          </li>
        ))}
      </ul>

      {capabilitiesCopyState === 'PLACEHOLDER' && <PlaceholderTag />}
    </>
  )
}

// ABOUT. The person.
//
// Split off from the resume on 2026-08-25. A visitor who wants the record
// clicks CV; a visitor who wants to know who they would be working with clicks
// ABOUT. One window trying to be both was why it read as neither.
export function AboutPanel() {
  return (
    <div className="mac-doc">
      <h1>{home.name}</h1>
      <p className="mac-lede">{home.positioning}</p>

      {about.lines.map((line, i) => (
        <p key={i}>{withBlanks(line)}</p>
      ))}

      {/* Endurance sport goes first among the lists on purpose. It is the
          thing that explains the most about how he works and the thing a
          resume has no room for, which is the reason this window exists at
          all rather than being a link to a PDF. */}
      <h2>ENDURANCE</h2>
      <ul>
        {about.endurance.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>

      <h2>PHOTOGRAPHS</h2>
      <p>{withBlanks(about.photos)}</p>

      <h2>ELSEWHERE</h2>
      <ul>
        {contact.map((c) => (
          <li key={c.label}>
            {c.href.startsWith('[') ? withBlanks(c.href) : <a href={c.href}>{c.label}</a>}
          </li>
        ))}
      </ul>

      <h2>COLOPHON</h2>
      <p className="mac-meta">
        Built with Vite and React. Silkscreen and Inter. No backend, no
        framework, no analytics.
      </p>

      {about.copyState === 'PLACEHOLDER' && <PlaceholderTag />}
    </div>
  )
}

// CV. The record: what he contracts in, the full skills table, the history,
// and the PDF a recruiter came for.
export function CvPanel() {
  return (
    <div className="mac-doc">
      <h1>{home.name}</h1>
      <p className="mac-lede">{home.positioning}</p>

      <h2>WHAT I CONTRACT IN</h2>
      <CapabilityList />

      {/* The full lists. HOME shows the first few of each; this is the same
          arrays rendered whole, so the short version cannot drift. */}
      <h2>TECHNICAL SKILLS</h2>
      {stack.map((g) => (
        <div className="mac-stack-full" key={g.id}>
          <p className="mac-stack-label">
            {g.label} <span className="mac-stack-note">{g.note}</span>
          </p>
          <div className="mac-stack-tags">
            {g.items.map((item) => (
              <span className="mac-stack-tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}

      <h2>PROFESSIONAL BACKGROUND</h2>
      <RoleList rows={cv.experience} />

      <h2>EDUCATION</h2>
      <RoleList rows={cv.education} />

      <h2>RESUME</h2>
      {home.resume.present ? (
        <p>
          <a href={`${import.meta.env.BASE_URL}${home.resume.file}`} download>
            RESUME.PDF
          </a>
        </p>
      ) : (
        <p>{withBlanks(`[ drop resume.pdf into public/ and flip present to true ]`)}</p>
      )}

      {cv.copyState === 'PLACEHOLDER' && <PlaceholderTag />}
    </div>
  )
}

// Fabio Di Cecca's contact window, which T pointed at, minus the form. A form
// on a static site cannot send anything without a third party, and these three
// buttons already cover every way anyone actually gets in touch.
export function ContactPanel() {
  return (
    <div className="mac-doc">
      <p className="mac-meta" style={{ marginBottom: 16 }}>
        Get in touch:
      </p>
      <div className="mac-contact-links">
        {contact.map((c) =>
          c.href.startsWith('[') ? (
            <span className="mac-contact-link" key={c.label} data-blank="true">
              &gt; {withBlanks(c.href)}
            </span>
          ) : (
            <a
              className="mac-contact-link"
              key={c.label}
              href={c.href}
              target={c.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
            >
              &gt; {c.label}
            </a>
          ),
        )}
      </div>
    </div>
  )
}

// No professional purpose whatsoever, which is the point. A site that is only
// a portfolio tells you what someone can do; the odd corner that is just a
// list of things they like is what makes it theirs.
// Every desktop in 1999 had one icon that was somebody's dog.
export function ZippyPanel() {
  return (
    <div className="mac-doc" style={{ textAlign: 'center' }}>
      <img
        className="mac-zippy-photo"
        src={`${import.meta.env.BASE_URL}zippy.png`}
        alt="Zippy, a grey and white dog with one blue eye"
      />
      <h1 style={{ fontSize: 22, marginTop: 12 }}>ZIPPY</h1>
      <p className="mac-meta">Good dog. No further comment.</p>
    </div>
  )
}

export function AnimePanel() {
  return (
    <div className="mac-doc">
      <h1 style={{ fontSize: 22 }}>TOP TEN</h1>
      <p className="mac-meta" style={{ marginBottom: 18 }}>
        No particular order. Arguments accepted by email.
      </p>
      <ol className="mac-ranked">
        {anime.map((a, i) => (
          <li key={i}>
            <span className="mac-rank">{String(i + 1).padStart(2, '0')}</span>
            {withBlanks(a)}
          </li>
        ))}
      </ol>
      {animeCopyState === 'PLACEHOLDER' && <PlaceholderTag />}
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
