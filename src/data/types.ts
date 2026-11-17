// The vocabulary the data speaks, and nothing else.
//
// Copy lives in `content.ts`. Nothing here renders.
//
// Pared back on 2026-11-16. The case study types (`Project`, `AtAGlance`,
// `Category`, `DiagramId`) went with the case studies themselves: the public
// site now shows each project as a glance and nothing more. The full template
// and every case study are on the `staging` branch and in history.

export type Placeholder = 'PLACEHOLDER' | 'REAL'

export interface ProjectLink {
  label: string
  href: string
}

// A project, at a glance: a title and one line. Deliberately nothing else. No
// slug, because a glance is not a window and has no route; no metrics, because
// a number on the public site is a claim and the claims went with the case
// studies.
// A glance is in progress unless it says otherwise.
export type GlanceStatus = 'In progress' | 'Shipped'

export interface Glance {
  title: string
  line: string
  status?: GlanceStatus
}
