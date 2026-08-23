// Every word of copy on this site lives here, so that replacing placeholder
// text with real text never means hunting through components.
//
// PLACEHOLDER is a real flag, not a comment. Anything carrying it renders a
// visible tag in the UI. Rule 9 in CLAUDE.md: never let invented specifics
// pass as final copy.

export type Placeholder = 'PLACEHOLDER' | 'REAL'

export interface ProjectLink {
  label: string
  href: string
}

// ---------------------------------------------------------------------------
// Categories
//
// The filter chips in the WORK window. Borrowed from fabiodicec.ca, which T
// pointed at on 2026-08-23. The point of them is that a recruiter arrives
// looking for one specific thing, and a desktop full of undifferentiated
// icons makes them hunt for it.
// ---------------------------------------------------------------------------

export type Category = 'product' | 'ai-ml' | 'data' | 'hardware' | 'tools'

export const categories: { id: Category; label: string }[] = [
  { id: 'product', label: 'PRODUCT' },
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'data', label: 'DATA SCI' },
  { id: 'hardware', label: 'HARDWARE' },
  { id: 'tools', label: 'TOOLS' },
]

// The twelve section project template from spec section 7. Sections are
// optional on purpose: Gravl is deliberately missing architecture and stack,
// and that omission is a constraint, not an oversight. See CLAUDE.md.
export interface Project {
  slug: string
  title: string
  windowTitle: string
  oneLiner: string
  role: string
  status: string
  year: string
  categories: Category[]
  copyState: Placeholder
  // Whether this project opens a full case study window, or is only a row in
  // the WORK list. Handoff section 6: three complete windows beat six thin
  // ones, and a row in a list is not a thin window, it is a list.
  hasWindow: boolean
  problem?: string
  built?: string[]
  architecture?: string
  stack?: string[]
  media?: { caption: string; tone: 'screenshot' | 'diagram' }[]
  results?: string[]
  lessons?: string[]
  links?: ProjectLink[]
  // Renders nothing to the visitor. It exists so the next agent reads it
  // before adding sections to a project that is under a publishing limit.
  constraint?: string
}

export const projects: Project[] = [
  {
    slug: 'gravl',
    title: 'Gravl',
    windowTitle: 'GRAVL.APP',
    oneLiner: 'Pre bid intelligence for construction.',
    role: 'Founder',
    status: '2026 to now',
    year: '2026',
    categories: ['product', 'ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'Contractors decide whether to bid on work using a fraction of what the documents actually say, because reading all of it costs more than the bid is worth. The decision that sets the margin gets the least information.',
    built: [
      'A product that reads the bid package and tells a contractor what they are walking into before they commit.',
      'Deployed with real contractors on real jobs.',
    ],
    results: ['Placeholder. Replace with the outcome the customer will let you name.'],
    links: [{ label: 'gravl-ai.com', href: 'https://gravl-ai.com' }],
    constraint:
      'OUTCOME ONLY. Never add architecture, pipeline stages, corpus size, unit or marginal compute cost, model details, the five work product method, the phase and gate table, or the pit and haul insight. All of it was deliberately removed from the company site over 2026-08-20 and 21. See CLAUDE.md.',
  },
  {
    slug: 'pickleball-iq',
    title: 'Pickleball IQ',
    windowTitle: 'PICKLEBALL_IQ.APP',
    oneLiner: 'Coaching intelligence for pickleball, built from video nobody else was reading.',
    role: 'Founder, and the person who wrote the pipeline',
    status: 'Active, in use',
    year: '2025 to now',
    categories: ['product', 'ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'Coaching feedback in pickleball is memory based. A coach watches a match, remembers three moments, and the other two hundred rallies are gone. Players get impressions instead of evidence, and the same mistake survives for a season because nobody can point at it.',
    built: [
      'A video ingestion pipeline that turns match footage into structured rally data.',
      'An iOS app where a player or a coach reviews the match as a sequence of decisions rather than a recording.',
      'An analytics layer that surfaces patterns across matches instead of within one.',
      'A dashboard for the coaching side, where the unit of work is a player over a season.',
    ],
    architecture:
      'Footage lands in the pipeline, gets segmented into rallies, and each rally is scored on a small set of decision features. The app reads the derived data, never the raw video, which is what keeps it usable on a phone at a court with bad signal.',
    stack: ['Swift and SwiftUI', 'Node backend', 'Python analytics', 'Streamlit dashboard', 'YouTube ingestion pipeline'],
    media: [
      { caption: 'Rally breakdown, iOS', tone: 'screenshot' },
      { caption: 'Ingestion to analytics path', tone: 'diagram' },
      { caption: 'Coaching dashboard', tone: 'screenshot' },
    ],
    results: [
      'Placeholder. Replace with the real number of matches processed.',
      'Placeholder. Replace with what changed for the coaches actually using it.',
    ],
    lessons: [
      'The hard part was never the model. It was deciding what counts as one rally, because every downstream number inherits that definition.',
      'Shipping the dashboard before the app was correct. Coaches will tolerate a rough interface if the data is real, and players will not.',
    ],
    links: [{ label: 'Read more', href: '#' }],
  },

  // --- Rows in the WORK list. No window until T writes real copy for them. ---
  // One liners are taken from T's own repo descriptions rather than invented.

  {
    slug: 'csi-bid-intelligence',
    title: 'CSI Bid Intelligence',
    windowTitle: 'CSI.APP',
    oneLiner:
      'Bidding intelligence and document risk analysis for a highway paving contractor.',
    role: 'Graduate ELP team',
    status: 'Delivered',
    year: '2026',
    categories: ['data', 'ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    constraint:
      'T cleared this for the site on 2026-08-23, overriding the hold in the handoff, on the condition that it shows what was built and the architecture but never the code. The architecture section is deliberately still empty: CSI is adjacent enough to Gravl that a detailed system description may reveal more about Gravl than the company site does. Do not write that section until T rules on it specifically.',
  },
  {
    slug: 'roleradar',
    title: 'RoleRadar',
    windowTitle: 'ROLERADAR.APP',
    oneLiner: 'Personalised job matcher and scanner. Drop in a target company URL, that simple.',
    role: 'Built it',
    status: 'Public',
    year: '2026',
    categories: ['ai-ml', 'tools'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/roleradar' }],
  },
  {
    slug: 'nlp-material-classifier',
    title: 'NLP Material Classifier',
    windowTitle: 'CLASSIFIER.APP',
    oneLiner:
      'Sequence to sequence material classifier for construction suppliers and general contractors.',
    role: 'Built it',
    status: 'Private repo',
    year: '2026',
    categories: ['ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
  },
  {
    slug: 'pickletrack',
    title: 'PickleTrack',
    windowTitle: 'PICKLETRACK.APP',
    oneLiner:
      'Computer vision for pickleball shot accuracy. YOLOv8, court mapping, performance analytics.',
    role: 'Built it',
    status: 'Public',
    year: '2025',
    categories: ['ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/pickletrackv2' }],
  },
  {
    slug: '4mativ-anomaly-detection',
    title: '4mativ Anomaly Detection',
    windowTitle: '4MATIV.APP',
    oneLiner: 'Anomaly detection on operational data.',
    role: 'Team project',
    status: 'Public',
    year: '2026',
    categories: ['data', 'ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/4mativ-anomaly-detection' }],
  },
  {
    slug: 'film-recommender',
    title: 'Film Recommender',
    windowTitle: 'FILM_REC.APP',
    oneLiner: 'A recommender system for films.',
    role: 'Built it',
    status: 'Public',
    year: '2026',
    categories: ['ai-ml', 'data'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/film-recommender' }],
  },
  {
    slug: 'skin-care-recommender',
    title: 'Skin Care Recommender',
    windowTitle: 'SKINCARE.APP',
    oneLiner: 'A recommender system for skin care products.',
    role: 'Built it',
    status: 'Public',
    year: '2026',
    categories: ['ai-ml', 'data'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/skin-care-recommender' }],
  },
  {
    slug: 'dogs-v-cats',
    title: 'Dogs v Cats',
    windowTitle: 'KAGGLE.APP',
    oneLiner: 'Image classification, Kaggle competition.',
    role: 'Competed',
    status: 'Public',
    year: '2026',
    categories: ['ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/dogs-v-cats_kaggle_comp' }],
  },
  {
    slug: 'mac-mini-homelab',
    title: 'Mac mini Home Lab',
    windowTitle: 'MAC_MINI.APP',
    oneLiner: 'The machine most of this was built on, and everything running on it.',
    role: 'Built it',
    status: 'Running',
    year: '2026',
    categories: ['hardware'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
  },
  {
    slug: 'figviewer',
    title: 'figviewer',
    windowTitle: 'FIGVIEWER.APP',
    oneLiner: 'Spyder style arrow key navigation for Matplotlib plots.',
    role: 'Built it',
    status: 'Public',
    year: '2026',
    categories: ['tools'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/figviewer' }],
  },
  {
    slug: 'this-site',
    title: 'This Website',
    windowTitle: 'THIS_SITE.APP',
    oneLiner: 'The thing you are looking at. Classic Mac desktop, React, no backend.',
    role: 'Built it',
    status: 'You are here',
    year: '2026',
    categories: ['tools'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/t-portfolio-website' }],
  },
]

export const windowProjects = projects.filter((p) => p.hasWindow)

export const about = {
  name: 'TOBIAS KNIGHT',
  positioning: 'technical founder / builder / applied AI',
  location: 'MINNEAPOLIS, MN',
  copyState: 'PLACEHOLDER' as Placeholder,
  lines: [
    'I build software, AI systems, and weird side projects.',
    'Right now that mostly means Gravl, which is pre bid intelligence for construction contractors.',
    'Before that, a pickleball coaching product, a home lab that got out of hand, and a graduate degree that keeps turning into an excuse to build things.',
  ],
  status: 'CURRENTLY: building Gravl',
}

export const contact: ProjectLink[] = [
  { label: 'Email', href: 'mailto:tobias.v.knight@gmail.com' },
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: 'https://github.com/Tobias-V-Knight' },
]

// Photos are files discovered on a computer, so the metadata carries as much
// of the character as the image does. Sizes and dates are part of the design.
export interface Photo {
  file: string
  caption: string
  bytes: number
  date: string
}

export const photos: Photo[] = [
  { file: 'HOMELAB_003.JPG', caption: 'Rack, mid rebuild', bytes: 861184, date: '06/02/26' },
  { file: 'IMG_0837.JPG', caption: 'North shore, second climb', bytes: 1258291, date: '07/19/26' },
  { file: 'ZIPPER_01.JPG', caption: 'Zipper, unimpressed', bytes: 2202009, date: '05/14/26' },
  { file: 'MAC_MINI_ARR.JPG', caption: 'Mac mini, day one', bytes: 640204, date: '04/28/26' },
  { file: 'PICKLEBALL_2026.JPG', caption: 'Courts, Saturday', bytes: 1048576, date: '07/05/26' },
  { file: 'STILLWATER_LOOP.JPG', caption: 'Stillwater loop, turnaround', bytes: 1783296, date: '06/21/26' },
  { file: 'CELLAR_02.JPG', caption: 'Two bottles worth keeping', bytes: 524288, date: '03/09/26' },
  { file: 'DESK_2026.JPG', caption: 'Where most of this happened', bytes: 972800, date: '08/01/26' },
]

export const photosCopyState: Placeholder = 'PLACEHOLDER'
