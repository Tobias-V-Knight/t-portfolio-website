// Every word of copy on this site lives here, so that replacing placeholder
// text with real text never means hunting through components.
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

export type Placeholder = 'PLACEHOLDER' | 'REAL'

export interface ProjectLink {
  label: string
  href: string
}

// ---------------------------------------------------------------------------
// Categories
//
// The filter chips in the WORK window, from the fabiodicec.ca reference T sent
// on 2026-08-23. Tagging is deliberately tight: a project gets AI / ML only if
// there is a model in it. Tagging generously made the chip return 10 of 13,
// which is not a filter, it is a list with extra steps.
// ---------------------------------------------------------------------------

export type Category = 'product' | 'ai-ml' | 'data' | 'hardware' | 'tools'

export const categories: { id: Category; label: string }[] = [
  { id: 'product', label: 'PRODUCT' },
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'data', label: 'DATA SCI' },
  { id: 'hardware', label: 'HARDWARE' },
  { id: 'tools', label: 'TOOLS' },
]

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
  // the WORK list.
  hasWindow: boolean
  problem?: string
  built?: string[]
  architecture?: string
  stack?: string[]
  // `src` is a real image in /public; without it the tile renders as a labelled
  // placeholder box (screenshot/diagram) until a real screen exists.
  media?: { caption: string; tone: 'screenshot' | 'diagram'; src?: string }[]
  // The name is the decision, and it is not a synonym for the one it replaced
  // on 2026-08-26: this section asks what the strongest proof is that the work
  // was real, so a deployment fact or a screenshot belongs here. Do not rename
  // it back. See CONTEXT.md, Evidence.
  evidence?: string[]
  lessons?: string[]
  links?: ProjectLink[]
  // Renders nothing to the visitor. It exists so the next agent reads it
  // before adding sections to a project that is under a publishing limit.
  constraint?: string
}

export const projects: Project[] = [
  // -------------------------------------------------------------------------
  // Flagship. T moved CSI ahead of Gravl on 2026-08-23: the site's job is
  // getting hired, and a named client with an architecture he can draw serves
  // that better than a startup that has to stay vague.
  // -------------------------------------------------------------------------
  {
    slug: 'csi-bid-intelligence',
    title: 'CSI Bid Intelligence',
    windowTitle: 'CSI.APP',
    oneLiner:
      'An AI agent platform that reads bid documents for a highway paving contractor and tells them what the job actually contains.',
    role: 'Graduate ELP team, [ your specific role on it ]',
    status: 'Delivered',
    year: '2026',
    categories: ['data', 'ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'A paving contractor bids on highway work from document packages that run to hundreds of pages. Estimators cannot read all of it, so they read the parts experience says matter and accept the risk in the rest. The result is that the decision setting the margin on a multi million dollar job is made on a fraction of the available information, under time pressure, every time.',
    built: [
      'A document ingestion pipeline that turns a bid package into structured, queryable content.',
      'Agents that pull the bid items, the specifications and the risk language out of that content and put them somewhere an estimator can actually use.',
      'A risk analysis layer that flags the clauses and conditions that historically cost money.',
      '[ what did the contractor actually get handed at the end: a dashboard, a report, a spreadsheet? ]',
    ],
    architecture:
      '[ Draw the path from a PDF landing in the system to an estimator reading an answer. Name the retrieval approach, the model, and where the structured output lands. Q-06 in TICKETS.md: keep this at the level of what was built, not how Gravl works. ]',
    stack: ['Python', '[ retrieval and vector store ]', '[ model, and why that one ]', '[ how it was served ]'],
    media: [
      { caption: 'The CSI ELP team, Alexandria MN', tone: 'screenshot', src: 'csi-team.jpeg' },
      { caption: 'Bid item extraction', tone: 'screenshot' },
      { caption: 'Document to answer path', tone: 'diagram' },
    ],
    evidence: [
      '[ How much estimator time did this take out of a bid? ]',
      '[ What did the contractor say, or do differently, after using it? ]',
      '[ Any accuracy number you are willing to stand behind ]',
    ],
    lessons: [
      '[ The interesting technical decision. What did you try that did not work, and what did you switch to? ]',
      '[ The domain lesson. What did you learn about paving contracts that no model would have told you? ]',
    ],
    constraint:
      'T cleared this for the site on 2026-08-23, overriding the hold in the handoff, on the condition that it shows what was built and never the code. The architecture section stays a blank prompt until T rules on Q-06: CSI is adjacent enough to Gravl that a detailed system description may describe Gravl by proxy.',
  },
  {
    slug: 'pickleball-iq',
    title: 'Pickleball IQ',
    windowTitle: 'PICKLEBALL_IQ.APP',
    oneLiner: 'Coaching intelligence for pickleball, built from video nobody else was reading.',
    role: 'Built the pipeline, the app and the analytics',
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
    evidence: [
      '[ How many matches have gone through it? ]',
      '[ What changed for the coaches actually using it? ]',
    ],
    lessons: [
      'The hard part was never the model. It was deciding what counts as one rally, because every downstream number inherits that definition.',
      'Shipping the dashboard before the app was correct. Coaches will tolerate a rough interface if the data is real, and players will not.',
    ],
  },
  {
    slug: 'pickletrack',
    title: 'PickleTrack',
    windowTitle: 'PICKLETRACK.APP',
    oneLiner: 'Computer vision that tracks pickleball shot accuracy from ordinary match video.',
    role: 'Built it',
    status: 'Public',
    year: '2025',
    categories: ['ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'Shot accuracy is the number every player wants and nobody measures, because measuring it by hand means watching the same rally four times with a notepad. The data exists in every phone video ever shot from the fence, it is just locked in pixels.',
    built: [
      'Ball and player detection on match footage.',
      'Court mapping that turns image coordinates into real positions on a real court, which is what makes a bounce location mean something.',
      'A performance analytics layer over the tracked shots.',
    ],
    architecture:
      'Detection runs frame by frame with YOLOv8. A homography maps the detected court corners onto a known court geometry, so every detection becomes a position in feet rather than pixels. Shot events come out of the position and velocity series, and the analytics run on those events.',
    stack: ['Python', 'YOLOv8', 'OpenCV', '[ anything else worth naming ]'],
    media: [{ caption: 'Tracked rally with court overlay', tone: 'screenshot' }],
    evidence: [
      '[ Detection accuracy, and on what footage ]',
      '[ What it got wrong, and where it broke down ]',
    ],
    lessons: [
      '[ Court mapping is usually the hard part. Was it here? ]',
      'This became the groundwork for Pickleball IQ, which is the same problem approached as a product rather than as a model.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/pickletrackv2' }],
  },
  {
    slug: 'nlp-material-classifier',
    title: 'NLP Material Classifier',
    windowTitle: 'CLASSIFIER.APP',
    oneLiner:
      'A sequence to sequence classifier that reads construction bid line items and says what material they are.',
    role: 'Built it',
    status: 'Private repo',
    year: '2026',
    categories: ['ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'Bid items in construction documents are written by humans in a hurry, so the same material appears a dozen different ways across a dozen contractors. Anything that wants to compare prices, estimate quantities or spot an unusual line first has to agree on what the line actually is, and that agreement does not exist in the source data.',
    built: [
      'An attention mechanism written from scratch, to understand the machinery rather than to import it.',
      'A fine tuned DistilBERT classifier trained on real bid item text.',
      'A comparison between the two, which is the actual point of doing both.',
    ],
    architecture:
      'Everything runs locally on a Mac mini rather than in a hosted environment, which was a constraint worth accepting: it forced the model small enough to be practical and made the whole thing reproducible on one machine.',
    stack: ['Python', 'PyTorch', 'DistilBERT', 'Trained locally on a Mac mini'],
    evidence: [
      '[ Accuracy from scratch versus fine tuned, and on how many classes ]',
      '[ Where the from scratch version held up, and where it did not ]',
    ],
    lessons: [
      '[ Writing attention by hand teaches something specific. What was it? ]',
    ],
  },
  {
    slug: 'roleradar',
    title: 'RoleRadar',
    windowTitle: 'ROLERADAR.APP',
    oneLiner: 'Drop in a target company URL and it finds the roles worth your time. That simple.',
    role: 'Built it',
    status: 'Public',
    year: '2026',
    categories: ['ai-ml', 'tools'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'Job boards optimise for volume, and a job search optimises for fit. Searching by keyword returns a hundred roles that share a word and none that share a shape, so the work of a search is mostly reading postings to reject them.',
    built: [
      'A scanner that takes a company URL and pulls its open roles.',
      'A matching layer that scores those roles against a profile rather than against a keyword.',
      'A multi agent setup where the scanning, the parsing and the judging are separate agents with separate jobs.',
    ],
    architecture:
      'Built on AutoGen with Azure AI Foundry behind it. Splitting the work across agents rather than one long prompt was the design decision: a scanner that fails is a different failure from a judge that is wrong, and keeping them apart makes it obvious which one broke.',
    stack: ['Python', 'AutoGen', 'Azure AI Foundry'],
    evidence: [
      '[ Did it actually surface roles you would have missed? ]',
      '[ How many companies have you run it against? ]',
    ],
    lessons: [
      '[ Multi agent setups are often slower and more fragile than one good prompt. Was that true here? ]',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/roleradar' }],
  },
  {
    slug: '4mativ-anomaly-detection',
    title: '4mativ Anomaly Detection',
    windowTitle: '4MATIV.APP',
    oneLiner: 'Anomaly detection on operational data.',
    role: 'Team project',
    status: 'Public',
    year: '2026',
    categories: ['data'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      '[ What was the operational problem, and who was feeling it? Anomaly detection is a method, not a problem, and the article needs the problem. ]',
    built: ['[ What did you build and hand over? ]'],
    architecture: '[ What detected the anomalies, and how were they surfaced? ]',
    stack: ['[ language and libraries ]'],
    evidence: ['[ What did it catch? ]'],
    lessons: ['[ The interesting part ]'],
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
    categories: ['ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      '[ Every recommender demo looks the same. What made this one worth building: the dataset, the approach, or the question you were testing? ]',
    built: ['[ Collaborative filtering, content based, or a hybrid? ]'],
    architecture: '[ How were recommendations generated and served? ]',
    stack: ['Python', '[ libraries ]'],
    evidence: ['[ Evaluation metric and score ]'],
    lessons: ['[ What surprised you ]'],
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
    categories: ['ai-ml'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      '[ Product recommendation with an ingredient constraint is a more interesting problem than film recommendation. Was that the angle? ]',
    built: ['[ What did it recommend on: ingredients, reviews, skin type? ]'],
    architecture: '[ How were recommendations generated? ]',
    stack: ['Python', '[ libraries ]'],
    evidence: ['[ Evaluation metric and score ]'],
    lessons: ['[ What surprised you ]'],
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
    hasWindow: true,
    problem:
      'The canonical first computer vision problem, which makes it a fair test of technique rather than of novelty. Everyone has the same data, so the only variable is what you do with it.',
    built: ['[ Trained from scratch, fine tuned a pretrained backbone, or both? ]'],
    architecture: '[ Model architecture and augmentation strategy ]',
    stack: ['Python', 'Jupyter', '[ framework ]'],
    evidence: ['[ Leaderboard score and placement ]'],
    lessons: ['[ What moved the score most ]'],
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
    hasWindow: true,
    problem:
      'Training a model on a laptop means the laptop is gone for the afternoon, and renting a GPU for every experiment means paying to find out an idea was bad. A machine that sits in the corner and takes jobs solves both, and it is cheaper than either over a year.',
    built: [
      '[ The hardware, and why that configuration ]',
      '[ What runs on it: training jobs, services, storage, anything hosted ]',
      '[ How you reach it from elsewhere ]',
    ],
    architecture: '[ Network, storage and service layout. This one deserves a diagram. ]',
    stack: ['[ OS, container runtime, anything orchestrating it ]'],
    media: [{ caption: 'The machine, in situ', tone: 'screenshot' }],
    evidence: ['[ What it has actually run. The NLP classifier trained on it, what else? ]'],
    lessons: ['[ What you would do differently on the next build ]'],
  },
  {
    slug: 'figviewer',
    title: 'figviewer',
    windowTitle: 'FIGVIEWER.APP',
    oneLiner: 'Arrow key navigation for Matplotlib plots, the way Spyder does it.',
    role: 'Built it',
    status: 'Public',
    year: '2026',
    categories: ['tools'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'Matplotlib opens every figure in its own window and gives you no way to step between them. Anyone who has generated forty plots in a loop has then closed forty windows one at a time. Spyder solved this years ago and nothing outside Spyder did.',
    built: ['A viewer that collects the figures and lets you arrow through them.'],
    stack: ['Python', 'Matplotlib'],
    evidence: ['[ Do you still use it? That is the only metric a tool like this has. ]'],
    lessons: [
      'The smallest tools are the ones you actually keep, because they solve a problem you hit weekly rather than a problem you found interesting once.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/figviewer' }],
  },
  {
    slug: 'this-site',
    title: 'This Website',
    windowTitle: 'THIS_SITE.APP',
    oneLiner: 'The thing you are looking at. A classic Macintosh desktop, no backend, no framework.',
    role: 'Built it',
    status: 'You are here',
    year: '2026',
    categories: ['tools'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'A portfolio has about fifteen seconds to be worth reading, and every portfolio looks the same, so the fifteen seconds go to whoever is memorable rather than whoever is best. The risk in solving that with a gimmick is that the gimmick becomes the thing people remember instead of the work.',
    built: [
      'A window manager where the URL owns the active window, so every project has a real shareable address and the browser Back button closes the window on top.',
      'A mobile layout that keeps the Macintosh chrome and drops the desktop metaphor entirely, because a desktop simulated on a phone is worse than no metaphor at all.',
      'A boot sequence, a filtered project index, and a photo viewer, none of which are required to reach anything.',
    ],
    architecture:
      'Static Vite and React with no backend. Every colour comes from one stylesheet, every word of copy comes from one data file, and the whole thing deploys to GitHub Pages as flat files.',
    stack: ['Vite', 'React', 'TypeScript', 'React Router', 'No CSS framework, no component library'],
    lessons: [
      'Navigating to a window that is already open means two opposite things. Back onto it means close everything above it, clicking a buried one means raise it and leave the rest. Same URL, opposite intent, and only the navigation type tells them apart.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/t-portfolio-website' }],
  },
  {
    slug: 'make-28th-safe',
    title: 'MAKE 28TH SAFE!',
    windowTitle: 'MAKE_28TH_SAFE.APP',
    oneLiner:
      'Measuring how fast cars actually take my street, so the case for a crosswalk is evidence instead of complaints.',
    role: 'Neighbour with a camera',
    status: 'In progress',
    year: '2026',
    categories: ['data', 'tools'],
    copyState: 'PLACEHOLDER',
    hasWindow: true,
    problem:
      'The intersection of 15th and 28th has no crosswalk and a lot of traffic moving faster than it should. Everyone on the street knows it. Nobody can prove it, and "the neighbours think it is dangerous" is the weakest possible thing to bring to a city that has to prioritise between a hundred streets making the same claim.',
    built: [
      'A camera setup that records vehicles passing the intersection.',
      'Speed estimation from the footage, so every pass has a number attached to it.',
      'A public site that shows the distribution of speeds and the times of day it gets worst.',
      'A neighbourhood survey, so the measured data has lived experience next to it.',
    ],
    architecture:
      '[ How does a frame become a speed? Two line crossings and a timestamp, or something learned? Worth writing up, because it is the part that decides whether anyone believes the numbers. ]',
    stack: ['[ camera and mount ]', 'Python', '[ detection and tracking ]', '[ how the site is served ]'],
    evidence: [
      '[ How many vehicles measured so far, and over how many days ]',
      '[ The number that matters: what share are over the limit, and how far over ]',
      '[ What the city said when it was shared with them ]',
    ],
    lessons: [
      '[ The interesting part: what turned out to be harder than expected? ]',
      'The point was never the model. It was turning a thing everyone already knew into a thing a city representative can act on.',
    ],
    constraint:
      'Shared with a city council representative by role only. T confirmed on 2026-08-24 that the official is not to be named on the public site: this is an advocacy page about a named intersection, and the person on the other side of it did not choose to be part of it.',
  },
  // -------------------------------------------------------------------------
  // Gravl, deliberately last and deliberately without a window.
  //
  // T's call on 2026-08-23: the site's job is getting hired, and a prominent
  // startup reads to a hiring manager as someone who will leave. It stays as
  // one row so the 2026 timeline has no unexplained gap. Flip this the day the
  // goal becomes raising money instead of getting hired.
  // -------------------------------------------------------------------------
  {
    slug: 'gravl',
    title: 'Gravl',
    windowTitle: 'GRAVL.APP',
    oneLiner: 'Pre bid intelligence for construction.',
    role: '',
    status: '2026 to now',
    year: '2026',
    categories: ['product'],
    copyState: 'PLACEHOLDER',
    hasWindow: false,
    links: [{ label: 'gravl-ai.com', href: 'https://gravl-ai.com' }],
    constraint:
      'OUTCOME ONLY, and as of 2026-08-23 not even that: no window, no founder title, one row. Never add architecture, pipeline stages, corpus size, unit or marginal compute cost, model details, the five work product method, the phase and gate table, or the pit and haul insight. See CLAUDE.md.',
  },
]

export const windowProjects = projects.filter((p) => p.hasWindow)

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
  // on 2026-08-23 for the same reason Gravl lost its window.
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
