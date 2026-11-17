import { useEffect } from 'react'
import { glances, glanceStatus, now } from '../data/content'

// The PORTFOLIO window, pared back on 2026-11-16.
//
// What I am working on now, then every project as a glance: a title, one line
// and a status pill. No row opens. The case study windows, the ARCHIVE folder
// and the Finder list that led to them are on the `staging` branch and in
// history; the public site shows the CV and current work only.
//
// It reuses the MSBA coursework list (`.mac-courses`) on purpose. A glance is
// the same shape as a course, a header, a line and a chip, and the site keeps
// one way of drawing that rather than two.
export function WorkPanel({ onStatus }: { onStatus: (s: string) => void }) {
  useEffect(() => {
    onStatus(`${glances.length} items`)
  }, [onStatus])

  return (
    <div className="mac-doc">
      <h2>{now.heading}</h2>
      <p>{now.line}</p>

      <h2>PROJECTS</h2>
      <ul className="mac-courses">
        {glances.map((g) => (
          <li className="mac-course" key={g.title}>
            <p className="mac-course-head">{g.title}</p>
            <p className="mac-course-note">{g.line}</p>
            <div className="mac-stack-tags">
              <span className="mac-stack-tag">{glanceStatus}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
