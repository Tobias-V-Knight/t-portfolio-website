// The vocabulary the data speaks, and nothing else.
//
// ADR-0006 split the projects out of `content.ts` into one file each, so that
// two case study tickets stop rewriting one file. A project file needs these
// types and must not import the module that imports it, which is the whole
// reason this file exists.
//
// Copy lives in `content.ts` and in `projects/`. Nothing here renders.

export type Placeholder = 'PLACEHOLDER' | 'REAL'

export interface ProjectLink {
  label: string
  href: string
}

// ---------------------------------------------------------------------------
// At a glance
//
// ADR-0001 section 2, and the centerpiece of a case study rather than the
// architecture diagram: every project can be summarised in four phrases, and
// not every project has a diagram worth drawing.
//
// Each field is one short phrase, not a sentence. If it reads as a sentence it
// is too long, and a panel of four sentences is prose, which is what the
// section under it is for.
//
// The order PROBLEM, APPROACH, OUTPUT, EVIDENCE is fixed and it is the whole
// contract: it is the shape of every claim on this site, from what hurt, to
// what was done, to what exists, to why anyone should believe it.
// ---------------------------------------------------------------------------

export interface AtAGlance {
  problem: string
  approach: string
  output: string
  evidence: string
}

// What a cell says when nobody has written it yet. A case study always renders
// four cells, so an unwritten one has to be a visible question rather than an
// empty box: an empty box reads as a layout bug, and a collapsed panel hides
// the fact that the most scannable part of the page is missing.
//
// These are questions aimed at T, in the same square bracket convention as
// every other blank in this file.

// ---------------------------------------------------------------------------
// Categories
//
// The filter chips in the WORK window, from the fabiodicec.ca reference T sent
// on 2026-08-23. Tagging is deliberately tight: a project gets AI / ML only if
// there is a model in it. Tagging generously made the chip return 10 of 13,
// which is not a filter, it is a list with extra steps.
// ---------------------------------------------------------------------------

export type Category = 'product' | 'ai-ml' | 'data' | 'hardware' | 'tools'

// ---------------------------------------------------------------------------
// Diagrams
//
// ADR-0002: architecture diagrams are hand authored inline SVG, drawn with the
// same tokens as the rest of the chrome. The drawing lives in
// `components/Diagrams.tsx`, which globs that directory and keys the registry
// on the filename, so a case study ships its diagram without editing any file
// another case study edits.
//
// ADR-0006 widened this from a closed union to a string. The compile error for
// naming a diagram that does not exist is the price of that, and the guard
// against it is that a project and its drawing now ship in the same ticket.
// ---------------------------------------------------------------------------

export type DiagramId = string

export interface Project {
  slug: string
  // Sorted on by `projects/index.ts`. It lives on the project rather than in a
  // list in the index, because an index listing every slug is a file every case
  // study ticket would have to edit, which is what ADR-0006 removes.
  order: number
  title: string
  windowTitle: string
  oneLiner: string
  role: string
  status: string
  year: string
  categories: Category[]
  copyState: Placeholder
  // Whether this project is one of the case studies, which decides which
  // Finder list it appears in and how much material it has. It does NOT decide
  // whether it opens: every project opens. A file you cannot open is a broken
  // file, and the Finder metaphor makes that promise on every row.
  caseStudy: boolean
  // ADR-0001 section 2. Partial on purpose: a case study renders all four cells
  // whatever is here, and a field left out falls back to its prompt in
  // `atAGlancePrompts`. Omitting the whole object is a valid state and it is
  // what four of the five case studies do today.
  atAGlance?: Partial<AtAGlance>
  problem?: string
  built?: string[]
  architecture?: string
  stack?: string[]
  // Three ways a tile can be filled, in descending order of how much it is
  // worth: `diagram` draws a real SVG from the registry, `src` shows a real
  // image out of /public, and neither renders a labelled placeholder box so the
  // page shows where the evidence is going to go.
  media?: { caption: string; tone: 'screenshot' | 'diagram'; src?: string; diagram?: DiagramId }[]
  // ADR-0001 section 5, and the section that shows he did not wire APIs
  // together. Omitted entirely where there is no model: an empty ML heading on
  // a project that never had one is worse than no heading.
  //
  // The label is an action title, not a container label. "Retrieval, not a
  // trained model" states the decision; "Approach" labels a box and makes the
  // reader do the work. T's own communications coursework is the standard here,
  // not general taste.
  mlDecisions?: { label: string; body: string }[]
  // ADR-0001 section 8, and CONTEXT.md, Contribution chip. A chip is a first
  // person claim: `RETRIEVAL` means he built the retrieval, not that the
  // project had some. The test a chip has to pass is a reference call, so on a
  // team project `team` names the team and says plainly what somebody else
  // owned. Writing chips without the team line is the failure mode.
  contribution?: { chips: string[]; team: string }
  // The name is the decision, and it is not a synonym for the one it replaced
  // on 2026-08-26: this section asks what the strongest proof is that the work
  // was real, so a deployment fact or a screenshot belongs here. Do not rename
  // it back. See CONTEXT.md, Evidence.
  evidence?: string[]
  // ADR-0001 section 10. Collapsed, and it is what makes the 400 to 700 word
  // budget on the default view survivable: without somewhere for the data prep,
  // the failed approaches and the deployment detail to go, the only choices are
  // a shallow page or a long one.
  deepDive?: { heading: string; body: string }[]
  lessons?: string[]
  links?: ProjectLink[]
  // Renders nothing to the visitor. It exists so the next agent reads it
  // before adding sections to a project that is under a publishing limit.
  constraint?: string
}
