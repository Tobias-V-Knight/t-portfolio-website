// Every word of copy on this site that is not a project lives here, so that
// replacing placeholder text with real text never means hunting through
// components.
//
// ADR-0006 moved the projects out to `projects/`, one file each, and the types
// they share to `types.ts`. This file re-exports both, so every importer in
// `src/` still reads one module and none of them changed.
//
// Two conventions, both load bearing:
//
//   copyState: 'PLACEHOLDER'  renders a visible tag on the window. It means
//              nobody has signed off on this text yet.
//
//   [ square brackets ]       inside any string render as a highlighted blank.
//              They are questions aimed at T, and they are deliberately not
//              filled in. CLAUDE.md rule 9: structure can be written from what
//              the repos actually say, specifics cannot be invented. A made up
//              number that survives to the live site is a number T gets asked
//              about in an interview.

export type {
  Placeholder,
  ProjectLink,
  AtAGlance,
  Category,
  DiagramId,
  Project,
} from './types'
import type { AtAGlance, Category, Placeholder, ProjectLink } from './types'

export { projects } from './projects'
import { projects } from './projects'

export const atAGlancePrompts: AtAGlance = {
  problem: '[ who hurts, and how much ]',
  approach: '[ what the system does about it ]',
  output: '[ what somebody ends up in front of ]',
  evidence: '[ the strongest proof it was real ]',
}

// ---------------------------------------------------------------------------
// Categories
//
// The filter chips in the WORK window, from the fabiodicec.ca reference T sent
// on 2026-08-23. Tagging is deliberately tight: a project gets AI / ML only if
// there is a model in it. Tagging generously made the chip return 10 of 13,
// which is not a filter, it is a list with extra steps.
// ---------------------------------------------------------------------------

export const categories: { id: Category; label: string }[] = [
  { id: 'product', label: 'PRODUCT' },
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'data', label: 'DATA SCI' },
  { id: 'hardware', label: 'HARDWARE' },
  { id: 'tools', label: 'TOOLS' },
]

// `caseStudy` is the one switch, and it decides grouping only. Every project
// opens a window; the depth of that window is decided by how much material the
// entry actually has, because the panel renders a section only when its data
// exists. A thin project produces a thin window without needing a second
// template to maintain.
export const caseStudyProjects = projects.filter((p) => p.caseStudy)
export const archiveProjects = projects.filter((p) => !p.caseStudy)

// Every project is routed and openable.
export const windowProjects = projects

export interface Role {
  org: string
  role: string
  when: string
}

// MSBA highlights. Bracketed [ ... ] parts render as blanks (withBlanks) until
// T fills them in with his own notes. The courses are extracted from the
// coursework folders (see the comment on `courses`); the notebook section is
// his to write.
export const msba = {
  title: 'MSBA HIGHLIGHTS',
  lede: 'Carlson School of Management, MSBA. The coursework, the topics I keep coming back to, and a few notes from my own notebook.',

  // P2-06: each course carries its stack as tags rather than as prose. A stack
  // is a list and prose is the wrong shape for a list: nobody reads "built
  // with X, Y and Z" but everybody scans four chips.
  //
  // Rule 9 applies harder here than anywhere else on the site. A tag goes in
  // only where the coursework actually used the tool: an import, a library()
  // call, a requirements file or a course document. Nothing is inferred from
  // the topic, so a course that teaches neural networks does not get a PyTorch
  // chip unless PyTorch is in the work.
  //
  // Filled 2026-08-25 (issue #6) by walking both coursework folders in iCloud.
  // The walk is written up in docs/extracted/msba.md: twelve entries, ten of
  // them with codes, plus the file each fact came from. This panel is
  // HIGHLIGHTS, so it carries four of them. Swapping one in is an edit against
  // that doc, not another extraction.
  //
  // What stays blank: `notes` below, because FROM THE NOTEBOOK is T's voice and
  // no coursework folder can stand in for it.
  courses: [
    {
      code: 'MSBA 6461',
      name: 'Advanced AI for Natural Language Processing',
      note: 'Built a Bahdanau-attention classifier from scratch and fine-tuned a local model to replace a keyword takeoff step, measured on a hand-labeled gold set.',
      stack: ['attention from scratch', 'DistilBERT', 'fine tuning', 'gold set eval', 'local (M4)'],
    },
    {
      code: 'MSBA 6431',
      name: 'Time Series Analysis and Forecasting',
      note: 'Forecast the ready-mix concrete PPI back to 1965: the trend regression fit at R squared 0.96 and was still spurious, so the model was rebuilt on differences.',
      stack: ['R', 'R Markdown', 'forecast', 'TSA', 'SARIMA'],
    },
    {
      code: 'MSBA 6511',
      name: 'Generative AI for Business',
      note: 'Final project RoleRadar: a multi-agent (AutoGen + Azure AI Foundry) job tracker.',
      stack: ['AutoGen', 'Azure AI Foundry', 'Python', 'multi agent'],
    },
    {
      code: 'MSBA 6441',
      name: 'Causal Inference',
      note: 'Matching, difference in differences, synthetic control, regression discontinuity and instrumental variables: five ways to build the counterfactual a regression cannot see.',
      stack: ['R', 'R Markdown', 'MatchIt', 'plm', 'Synth'],
    },
  ],
  topics: [
    'Attention mechanisms, and how far you can get building them by hand',
    'Honest evaluation: gold sets, calibration, and significance over vibes',
    'Causal identification: whether an effect is real, or the design just let it look real',
  ],
  notes: [
    '[ a note from your notebook ]',
    '[ another one ]',
  ],
}

// ---------------------------------------------------------------------------
// The stack
//
// Restructured 2026-08-25 on T's call. The site now splits three ways and the
// split is the point:
//
//   HOME    purely professional. What he does, what he uses, and that he is
//           available. A snapshot, not a document.
//   ABOUT   the person. Minneapolis, hobbies, endurance, photographs.
//   RESUME  the record. History, education, the full skills table, the PDF.
//
// Four groups, because T's first list mixed them and could not be ordered:
//
//   CAPABILITIES  what someone hires him to build
//   TOOLS         what he builds it with
//   TECHNIQUES    what is under the hood
//   SHIPPING      what puts it in production
//
// SHIPPING exists because of a question T asked while deploying CSI: nginx,
// cron, CI/CD, hosted Postgres and a hosted vector store did not fit anywhere
// in the other three. They are not capabilities and they are not techniques,
// they are the difference between a notebook and a system somebody else can
// use. Most analytics graduates never touch them, which is exactly why they
// get their own row rather than being scattered into the others.
//
// ONE list per group, ordered favourites first. HOME renders the first
// `HOME_TAGS` of each and RESUME renders all of them, so the short version can
// never drift from the long one. Reorder to change what HOME shows.
// ---------------------------------------------------------------------------

export interface StackGroup {
  id: string
  label: string
  // One clause, lower case, explaining what the row is. Not a sentence.
  note: string
  items: string[]
}

export const HOME_TAGS = 5

// LEVEL ONE. What he can do, grouped by discipline.
//
// Replaced the four bucket model (capabilities / tools / techniques /
// shipping) on 2026-08-26. That model kept failing the same way: a tool and a
// capability are different kinds of claim, and mixing them meant `Python` and
// `RAG` competed for the same six slots on HOME. The split is now vertical,
// skills here and named technologies in TOOLBOX below, so neither crowds the
// other out.
export const skills: StackGroup[] = [
  {
    id: 'languages',
    label: 'LANGUAGES',
    note: '',
    items: ['Python', 'SQL', 'R', 'TypeScript'],
  },
  {
    id: 'machine-learning',
    label: 'MACHINE LEARNING',
    note: '',
    items: [
      'Supervised Learning',
      'Unsupervised Learning',
      'Feature Engineering',
      'NLP / Text Classification',
      'Recommender Systems',
      'Evaluation',
    ],
  },
  {
    id: 'applied-ai',
    label: 'APPLIED AI / AGENTIC AI',
    note: '',
    items: [
      'RAG',
      'Agent Orchestration',
      'Tool Calling',
      'Open-Source Fine-Tuning',
      'Embeddings',
      'Semantic Search',
      'Human-in-the-Loop',
      'Knowledge Bases',
      'LLM / Agent Evaluation',
    ],
  },
  {
    id: 'statistics',
    label: 'STATISTICS & EXPERIMENTATION',
    note: '',
    items: ['Statistical Modeling', 'Causal Inference', 'Experimental Design', 'A/B Testing'],
  },
  {
    id: 'data-systems',
    label: 'DATA SYSTEMS',
    note: '',
    items: [
      'Data Modeling',
      'Data Pipelines',
      'ETL / ELT',
      'Relational Databases',
      'Vector Databases',
      'Distributed Computing',
    ],
  },
  {
    id: 'software',
    label: 'SOFTWARE ENGINEERING',
    note: '',
    items: [
      'Backend Development',
      'System Integration',
      'Data Applications',
      'Workflow Automation',
    ],
  },
  {
    id: 'deployment',
    label: 'DEPLOYMENT & INFRASTRUCTURE',
    note: '',
    items: [
      'Cloud Deployment',
      'On-Prem Deployment',
      'Containerization',
      'CI/CD',
      'Scheduled / Batch Jobs',
    ],
  },
  {
    id: 'visualization',
    label: 'VISUALIZATION & DATA APPS',
    note: '',
    items: ['Data Visualization', 'Dashboarding', 'Interactive Data Apps'],
  },
]

// LEVEL TWO. The named technologies, visually separate.
//
// This is the answer to the MongoDB question. Those tools are real, they are
// just PB IQ's rather than CSI's, and a flat list could not say so. Here they
// are plainly a toolbox rather than a claim about what he specialises in, so a
// tool used on one project stops reading as padding.
export const toolbox: StackGroup[] = [
  {
    id: 'libraries',
    label: 'LIBRARIES & ML',
    note: '',
    items: ['PyTorch', 'Transformers', 'PEFT', 'scikit-learn', 'XGBoost', 'pandas', 'NumPy'],
  },
  {
    id: 'applications',
    label: 'APPLICATIONS',
    note: '',
    items: ['FastAPI', 'Streamlit', 'Plotly', 'Matplotlib'],
  },
  {
    id: 'platforms',
    label: 'DATA & PLATFORMS',
    note: '',
    items: ['Databricks', 'Spark', 'PostgreSQL', 'SQLite', 'Supabase', 'ChromaDB'],
  },
  {
    id: 'infrastructure',
    label: 'INFRASTRUCTURE & ANALYTICS',
    note: '',
    items: ['AWS', 'Azure', 'Docker', 'Nginx', 'Power BI', 'Tableau', 'Git'],
  },
]

// HOME shows a short slice of the level one groups only. The toolbox lives in
// RESUME: a visitor fifteen seconds in wants to know what he does, not which
// charting library he uses.
export const homeSkills = ['applied-ai', 'machine-learning', 'statistics', 'deployment']

// ---------------------------------------------------------------------------
// Capabilities, the long version
//
// Five blocks, in RESUME rather than on HOME: HOME is a snapshot and these are
// paragraphs. Order is a positioning bet, not a ranking. Whichever sits first
// is what T gets called about, and evaluation leads because it is the thing
// most people selling AI work skip. T owns this order, see P2-15.
// ---------------------------------------------------------------------------

export interface Capability {
  name: string
  // One sentence, in buyer language, no jargon. What the work does for them.
  line: string
  // Which project on this site proves it. Nothing goes in this list without
  // one, CLAUDE.md rule 9.
  proof: string
}

export const capabilitiesCopyState: Placeholder = 'PLACEHOLDER'

// The framing line, and the answer to "what travels outside construction".
// The machine does not know it is looking at a paving bid, so naming the shape
// rather than the industry keeps CSI as proof instead of as a ceiling.
export const capabilitiesLede =
  'The work is the same shape wherever a person reads a document to make a priced decision on a deadline. Construction bids are where I do it today. Underwriting, claims, contract review and RFP response are the same machine with a different vocabulary.'

export const capabilities: Capability[] = [
  {
    name: 'EVALUATION HARNESSES',
    line: 'The part that tells you whether any of the rest of it is good enough to put in front of a customer.',
    proof: 'CSI, material classifier',
  },
  {
    name: 'DOCUMENT INTELLIGENCE',
    line: 'Turning documents somebody currently reads by hand into structured data a system can act on.',
    proof: 'CSI bid intelligence',
  },
  {
    name: 'AGENTIC WORKFLOWS',
    line: 'Multi step LLM systems that finish a job end to end, rather than a chat box that hands the work back.',
    proof: 'RoleRadar',
  },
  {
    name: 'DOMAIN TUNED MODELS',
    line: 'Fine tuning a small model on the vocabulary of one business, for the cases a general model guesses at.',
    proof: 'CSI material classifier',
  },
  {
    name: 'PREDICTIVE MODELLING',
    line: 'Forecasts and decision models built on the operational data a company already has and does not use.',
    proof: 'CSI, MSBA forecasting',
  },
]

// ---------------------------------------------------------------------------
// HOME. Professional only.
// ---------------------------------------------------------------------------

export const home = {
  name: 'TOBIAS KNIGHT',
  // Was 'technical founder / builder / applied AI'. The founder half came off
  // on 2026-08-23: the site's job is getting hired, and a prominent founder
  // title reads to a hiring manager as someone who will leave.
  positioning: 'builder / applied AI',
  location: 'MINNEAPOLIS, MN',
  copyState: 'PLACEHOLDER' as Placeholder,
  // One line. HOME earns its keep by being short.
  line: 'I build software and AI systems: mostly, taking something a person currently reads by hand and finding out whether a machine can read it well enough to be trusted.',
  status: 'CURRENTLY: PUTTING CSI INTO PRODUCTION',

  // PARKED 2026-08-25, T's call: the chip is not rendered on HOME right now.
  // The copy stays because it is approved and the decision may reverse, and
  // because deleting approved copy to re-derive it later is how a voice drifts.
  // IntroPanel in Panels.tsx has the commented block that puts it back.
  availability:
    "AVAILABLE FOR CONTRACT WORK. The messier the input, the more interesting. Let's build together.",

  // Points at a file that is not in public/ yet. The window renders it as an
  // unanswered blank rather than a broken download until it is.
  resume: { file: 'resume.pdf', present: false },
}

// ---------------------------------------------------------------------------
// ABOUT. The person, and deliberately not the resume.
//
// The split T asked for on 2026-08-25: a visitor who wants the record clicks
// RESUME, and a visitor who wants to know who they would be working with clicks
// ABOUT. Putting both in one window was why neither read as either.
// ---------------------------------------------------------------------------

export const about = {
  copyState: 'PLACEHOLDER' as Placeholder,
  lines: [
    'I live in Minneapolis, on the south side.',
    '[ what you actually like about living there ]',
    '[ a hobby that is not endurance sport and not a computer ]',
  ],

  // Endurance sport, which is the thing about T that explains the most about
  // how he works and appears nowhere on a resume.
  endurance: [
    'Twin Cities Marathon, 26.2',
    'Triple Bypass, Colorado',
    'Ironman 70.3, Madison',
  ],

  // PHOTOS is parked (P2-03) and hobby photographs are the thing that would
  // bring it back. Named here so the next agent knows what the window is for.
  photos: '[ pick 4 to 6 photographs: Minneapolis, the bike, the races, the home lab ]',
}

// ---------------------------------------------------------------------------
// RESUME. The record.
// ---------------------------------------------------------------------------

export const resume = {
  copyState: 'PLACEHOLDER' as Placeholder,

  // Extracted from 04_career on 2026-08-25 (issue #5) and confirmed by T on
  // 2026-08-26. Two employer names in this file were wrong and had been live:
  // "Formative Technologies" was 4MATIV Technologies, and "AC Surety" was
  // Accenture. The phrase heard in an early session as "AC Surety Delivery
  // Associates" was two employers said back to back, and "Formative" is how
  // 4MATIV sounds out loud. Neither wrong string appears in any career
  // document; both real names appear in all four.
  //
  // Newest first, because every resume runs newest first and this one used to
  // run oldest first for no reason anyone recorded.
  experience: [
    {
      org: 'Carlson Analytics Lab',
      role: 'Forward Deployed Engineer, Graduate Consultant',
      when: 'Oct 2025 to now',
    },
    { org: 'Pickleball IQ', role: 'Co-Founder & AI Engineer', when: 'May 2025 to now' },
    {
      org: 'Delivery Associates',
      role: 'Solutions Delivery Consultant',
      when: 'Sept 2023 to May 2025',
    },
    { org: 'Accenture', role: 'Technology Strategy Consultant', when: 'Feb 2022 to Aug 2023' },
    {
      org: '4MATIV Technologies',
      role: 'Founding Solutions Lead',
      when: 'Dec 2018 to Dec 2021',
    },
  ] as Role[],

  education: [
    {
      org: 'University of Minnesota, Carlson',
      // Every career document says "Candidate for" and the Aug 2026 date has
      // now passed, so whether this is conferred is a fact only T has.
      role: 'MS Business Analytics [ conferred, or still candidate? ]',
      when: 'Aug 2026',
    },
    { org: 'University of St. Thomas', role: 'BA Finance', when: 'May 2018' },
  ] as Role[],
}

// A fun one, and the only part of the site with no professional purpose at
// all. Ten slots, because a top ten is a stronger statement than a long list.
export const animeCopyState: Placeholder = 'PLACEHOLDER'
export const anime: string[] = Array.from(
  { length: 10 },
  (_, i) => `[ favourite anime ${String(i + 1).padStart(2, '0')} ]`,
)

// The LUFFY.MOV window plays this list in order and starts over at the top.
// Filenames only: the player prefixes BASE_URL, so a clip is one entry here
// plus the converted file in `public/`, and nothing else. The black and white
// look is CSS on the player, never baked into the file, so any clip inherits it.
export const moviePlaylist: string[] = ['luffy.mp4', 'ice.mp4']

export const contact: ProjectLink[] = [
  { label: 'hi@tobiasknight.dev', href: 'mailto:hi@tobiasknight.dev' },
  { label: 'github', href: 'https://github.com/Tobias-V-Knight' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/tobiasknight/' },
]

// Deliberately links and no form. This is a static site with no backend, so a
// form cannot send mail on its own: it would need a third party, which adds a
// dependency and a spam surface without adding a single way to reach T that
// these three buttons do not already cover.

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
