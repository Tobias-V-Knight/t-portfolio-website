import type { Project } from '../types'

// -------------------------------------------------------------------------
// Flagship, T's call on 2026-08-23: the site's job is getting hired, and a
// named client with an architecture he can draw serves that better than a
// startup that has to stay vague.
//
// Rewritten 2026-08-27 from the final deliverables rather than from the
// accumulated notes, which is what T asked for: one source of truth.
//   final deck 8/12        situation, complication, key question; ~5 minutes
//                          against the manual read; 12 estimators
//   KTD_CSI.pdf            deliverables, the two agents, the handoff boundary
//   Deliverables Statement the CSI VM, PostgreSQL and ChromaDB, IT handoff
//   T, 2026-08-27          10 to 20 hour go/no-go workup; ~4,000 plans a year;
//                          reported to the CEO and CFO
//
// ADR-0008: eight sections, no ML decisions, no deep dive, no lessons, and a
// KPI strip. Under 400 words.
//
// ADR-0003 still holds and is why there are no corpus counts here. The KTD
// carries the project, bid, competitor and pit row counts, the candidate pool
// logic and the model comparison. None of that ships: shape, never mechanism.
//
// The Winner Hit Rate is deliberately absent. KTD 9.4 and 11.4 call it an open
// experimental question that was never validated against CSI's stated ~90%,
// so it is not a result and it is not going on a page as one.
// -------------------------------------------------------------------------

const project: Project = {
  slug: 'csi-bid-intelligence',
  order: 0,
  title: 'CSI Bid Intelligence',
  windowTitle: 'CSI.APP',
  oneLiner:
    'Two agents that read a highway contractor’s bid documents end to end, pull the traps out of 200 page plan sets, and say who is likely to bid against them.',
  role: 'Built the plan reader and the app, on a four person team',
  // The deliverables statement is the source: the repo was installed on CSI's
  // own VM with PostgreSQL and ChromaDB configured, and their IT director owns
  // it. KTD 11.1 is equally clear that this is a handoff and not ongoing
  // support, so "deployed and handed over" is the claim and "in production" is
  // not one anybody has made.
  status: 'Deployed on the client’s server',
  year: '2026',
  categories: ['data', 'ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  // Situation, complication, key question, which is how this was put to CSI in
  // the final presentation. The key question is the deck's, near verbatim.
  atAGlance: {
    problem: 'Around 4,000 plan sets a year, twelve estimators, and the traps buried at page 180',
    keyQuestion:
      'Can plan reading and competitor context be automated well enough that estimators spend their time deciding rather than hunting?',
    output: 'A chat product that reads a plan set and returns a bid brief',
    evidence: 'Running on CSI’s own server, handed to their IT director',
  },
  problem:
    'Central Specialties reviews around 4,000 road construction plan sets a year with twelve estimators. Before anyone can judge a job, someone has to read a 200 page document for scope, quantities, location and the clauses that quietly cost money: night work, phasing, liquidated damages, tribal employment rules. That read, plus the competitor and win rate work around it, is a ten to twenty hour go/no-go workup. It is done under deadline, on a fraction of the document, and the things that get missed are exactly the ones nobody was looking for.',
  // Only figures that survive division. 4,000 plans times ten hours is 40,000
  // hours against an estimating team whose whole year is about 24,000, so the
  // annual saving is not stated: the per plan figure is the true one.
  kpis: [
    { label: 'Go/no-go workup', value: '3 to 5 minutes', before: '10 to 20 hours' },
    { label: 'Plan sets a year', value: '~4,000', note: 'Across twelve estimators' },
    { label: 'Agents in production', value: '2', note: 'Plan reader and competitor intelligence' },
    { label: 'Reported to', value: 'CEO and CFO', note: 'Carlson Analytics Lab engagement' },
  ],
  built: [
    'A plan reader agent: PDF in, structured project record out, every field carrying its page and a confidence.',
    'A human in the loop step, because a wrong extraction that looks confident is worse than a missing one.',
    'A competitor intelligence agent that ranks who is likely to bid, from CSI’s own bid history rather than a bought list.',
    'One chat product over both, plus the registries that keep the data current after we left.',
  ],
  architecture:
    'Document in, decision out. A plan set is parsed and chunked, the passages that matter are retrieved, an agent with a small tool set reasons over them, and a structured record comes out for the product to render. Built from scratch on the model vendor’s SDK rather than on an agent framework, so that a maintainer inheriting it reads Python and not somebody else’s abstraction. What makes one of these different from another is the stage internals, and those belong to the client.',
  stack: [
    'Python',
    'FastAPI',
    'Next.js',
    'TypeScript',
    'Claude',
    'Retrieval augmented generation',
    'Multi tool agent',
    'ChromaDB',
    'Sentence Transformers',
    'PostgreSQL',
    'Server sent events',
    'scikit-learn',
    'Windows Server, as services',
  ],
  media: [
    {
      caption:
        'The human in the loop step. Ten of twelve fields confirmed, each cited to its page, and the one the extractor could not find handed back to the estimator. Project identity blurred.',
      tone: 'screenshot',
      src: 'csi-verify.jpg',
    },
    {
      caption: 'Document in, decision out. The shape only, by agreement with the client.',
      tone: 'diagram',
      diagram: 'csi-shape',
    },
    {
      caption: 'A plan set dropped into the chat. [ screenshot to capture from localhost ]',
      tone: 'screenshot',
    },
    {
      caption: 'The finished bid brief. [ screenshot to capture from localhost ]',
      tone: 'screenshot',
    },
    { caption: 'The CSI ELP team, Alexandria MN', tone: 'screenshot', src: 'csi-team.jpeg' },
  ],
  evidence: [
    'A ten to twenty hour go/no-go workup returns in three to five minutes.',
    'Installed on CSI’s own virtual machine with both databases configured, handed to their IT director, and supported through the end of the engagement.',
    'Presented to the CEO and CFO at the close of the engagement.',
  ],
  contribution: {
    chips: [
      'PLAN READER AGENT',
      'PDF INGESTION',
      'RETRIEVAL PIPELINE',
      'GOTCHA TAXONOMY',
      'THE CHAT PRODUCT',
      'HUMAN IN THE LOOP',
      'DATA SOURCE OF TRUTH',
    ],
    team: 'A four person Carlson Analytics Lab team. Two teammates owned the competitor intelligence model; I built the plan reader, the data spine underneath it and the product both agents are used through.',
  },
  constraint:
    'ADR-0003. CSI may publish the shape of its pipeline and never the mechanism. No corpus counts, no candidate pool logic, no model comparison, no Winner Hit Rate: KTD 9.4 and 11.4 call that one an open experimental question rather than a validated result. All of it is in the knowledge transfer document, which is not public.',
  links: [],
}

export default project
