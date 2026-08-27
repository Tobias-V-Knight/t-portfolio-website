import type { Project } from '../types'

// -------------------------------------------------------------------------
// PB IQ, second in T's order, rewritten on 2026-08-26 for issue #56.
//
// Everything here comes from `docs/extracted/pickleball-iq.md`, which cites a
// file path for every claim. What was here before did not: it described a
// video ingestion pipeline turning match footage into rally data, an app that
// reads derived rally data, and lessons about defining a rally. None of that
// is what PB IQ is. It merged the two different things called the video
// pipeline into one invented third thing, which is exactly the failure the
// extraction warns about.
//
// Two things the sources settle, and one they do not.
//
// SETTLED. The division of labour is stated in the technical deck's closing
// section, "Update for Kam: What Tobias Has Built (ML + Content Side)", and in
// `Kam_Update.md`, which is written in T's first person. Content and ML on T,
// app and data layer on Kam. Every contribution chip below traces to one of
// those two documents or to the July resume bullets, which are marked code
// verified.
//
// NOT SETTLED, and deliberately not resolved here. How the iOS build divides
// between the two of them. The MN Cup application says Kam owns it; T did iOS
// work offline that no repo shows; no document states a split. So this page
// describes a joint venture and describes T by what he demonstrably owns,
// never by a percentage, and it makes no iOS claim at all.
//
// The MN Cup application is also not quoted as T's voice. It is written in a
// first person that refers to "Tobias Knight" in the third person, which reads
// like a drafting artefact and is open question 3 in the extraction. Its
// counts are used, its sentences are not.
// -------------------------------------------------------------------------

const project: Project = {
  slug: 'pickleball-iq',
  order: 10,
  title: 'Pickleball IQ',
  windowTitle: 'PICKLEBALL_IQ.APP',
  // Answer first. The App Store fact is the strongest thing in the project and
  // a reader who stops after one sentence should already have it.
  oneLiner:
    "An iOS app on the App Store that turns a player's rating into the next drill to run, over a catalog of 586 drills extracted from 145 coaching videos.",
  // The current resume says Co-Founder, which is what RESUME on this site
  // already shows, so this matches it. Whether he prefers Founder is open
  // question 1 in the extraction and item 5 in `career.md`; it is one word and
  // it is his, not an agent's.
  role: 'Co-founder, on the content and ML side',
  status: 'Live on the App Store',
  year: '2025 to now',
  categories: ['product', 'ai-ml'],
  // Nine open questions sit behind this page. See `constraint` at the foot of
  // this file for which were resolved how, and which were left alone.
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  atAGlance: {
    problem: 'Players know their rating, not what to practise',
    approach: 'An LLM extracts drills from coaching video into one taxonomy',
    output: 'An iOS app, a coach platform, 586 drills',
    evidence: 'On the App Store since June 2026, 30 player pilot',
  },
  // Inside the 150 word cap, no technical detail, and the two complaints are
  // sourced to the 62 discovery interviews rather than asserted. DUPR is
  // explained on first use because a hiring manager does not play pickleball.
  problem:
    "Pickleball players know their DUPR rating, the sport's skill number, and nothing about what to practise next. One number covers a game made of a dozen separate skills, so a player with weak resets and a player with a weak serve read the same on paper. Coaches have the mirrored problem: privates, clinics and leagues each generate notes with nowhere shared to keep them, so a coach carrying thirty client relationships holds most of what they know in their head. That pair of complaints came out of 62 discovery interviews.",
  // ADR-0008. Four measured figures, and none of them is a growth number,
  // because retention and engagement are genuinely [ not recorded ] and a
  // strip is not the place to imply otherwise.
  //
  // The recall figure carries its denominator on purpose. A recall of 1.00 with
  // no n reads as either a triumph or a rigged test, and a reader cannot tell
  // which. T's own resume note calls it a 25 question test judged by a separate
  // model, so the tile says so and the claim gets stronger rather than weaker.
  kpis: [
    {
      label: 'Drills extracted',
      value: '586',
      note: 'From 145 coaching videos, each tagged and deep linked to its own timestamp',
    },
    { label: 'Discovery interviews', value: '62', note: 'The problem came from these, not from a hunch' },
    { label: 'Pilot', value: '30 players', note: 'At Life Time, in weekly use' },
    {
      label: 'Retrieval recall@6',
      value: '1.00',
      note: 'Across a 25 question golden set, graded by a different model from the one that answers',
    },
  ],
  built: [
    'A YouTube extraction pipeline: 145 coaching videos in, 586 drills out, each one tagged by shot type, DUPR band and court position against one canonical taxonomy, and deep linked to its own timestamp.',
    'An iOS app where a player gets a drill queue mapped to their rating and an assistant grounded in their own data, plus a coach platform running clients, notes and lesson plans.',
    'A coach command center that turns scanned paper into a system: handwritten league scorecards into validated standings, with a self checksum on every round.',
  ],
  // The two video pipelines are the single most confusable part of this
  // project and a case study that merges them is wrong. The build time seam is
  // T's own words in `00_WORKLOG.md`, 2026-07-06: "pbiq-analytics is build time
  // only; runtime RAG lives in the Node backend."
  architecture:
    'Three repos, and the seam between them is deliberate. A Python analytics repo builds the drill catalog and the taxonomy. A TypeScript backend on Railway serves the product over MongoDB, Firebase Auth and a Pinecone knowledge base, and the SwiftUI app talks only to that backend. Analytics is build time only: it exports a seed file the backend loads, so a long extraction run can never make the app slow. PB IQ runs no computer vision of its own: match statistics come from PB Vision, a third party product, and feed the coach analytics locally rather than the app.',
  // Ordered by strength: a deployment fact, a pilot, the one thing that was
  // properly measured, and then the honest absence. The last bullet is not an
  // apology. Retention, latency and recommender accuracy are genuinely not
  // recorded anywhere in the knowledge base, and a blank is correct output.
  evidence: [
    'Live on the App Store as PBIQ v2.0 since 19 June 2026, with pbiq.ai behind it. PB IQ, LLC was formed on 3 June 2026.',
    'A 30 player pilot at Life Time, in weekly use.',
    'The retrieval system is the one part that was properly measured, over a 25 question golden set graded by a different model from the one that answers: recall@6 of 1.00, faithfulness and citation 5.0 of 5, and a perfect record of refusing questions the corpus cannot answer. The eval also chose the retrieval mode: dense only beat hybrid plus reranking on this corpus.',
    'Retention, latency and recommender accuracy are [ not recorded ]: engagement metrics were still being wired at the last status update, and the recommender was never fitted.',
  ],
  // Every chip traces to a document in which T describes his own work. There
  // is no iOS chip, because the one thing an agent cannot settle here is how
  // the iOS build divides, and a chip is a first person claim that has to
  // survive a reference call.
  contribution: {
    chips: [
      'DRILL TAXONOMY',
      'YOUTUBE EXTRACTION PIPELINE',
      'DRILL MATRIX V1 AND V2',
      'RAG EVAL HARNESS',
      'COACH ANALYTICS',
      'LEAGUE DATA PIPELINE',
      'ONBOARDING SURVEY SYSTEM',
      'RECOMMENDER SPEC',
      'THE PILOT',
    ],
    team: 'PB IQ is a joint venture with Kameron Lymon, co-founder and lead engineer, who owns the iOS build. The technical deck splits it as content and ML on me, app and data layer on him.',
  },
  // MongoDB, Pinecone and Firebase came off this site's global toolbox because
  // CSI does not use them. They are load bearing here, so here is where they
  // belong. Pinecone is listed as in use, not as architected: the July resume
  // note that said "architected, not serving" is stale, and `ragService.ts`
  // constructs its client at module load with no feature gate.
  stack: [
    'Swift and SwiftUI',
    'TypeScript and Express',
    'Python',
    'MongoDB',
    'Pinecone',
    'Firebase',
    'ChromaDB',
    'Streamlit',
    'SQLite',
    'Railway',
    'Retrieval augmented generation',
    'LLM structured extraction',
    'Embedding retrieval and eval',
  ],
  media: [
    {
      caption:
        'The App Store listing. [ pull a screenshot from apps.apple.com/us/app/pbiq/id6761266107 ]',
      tone: 'screenshot',
    },
    {
      caption: "Today's Session, the app home. [ needs a screenshot from a build ]",
      tone: 'screenshot',
    },
    {
      caption:
        'The coach command center. [ can a screenshot ship with every player name blanked out? ]',
      tone: 'screenshot',
    },
    // No `diagram` id yet on purpose. Issue #56 puts the drawing out of scope
    // and gives each case study its own diagram ticket once the prose is
    // settled, so this renders the labelled placeholder box until that ticket
    // adds `src/components/diagrams/pickleball-iq.tsx` and points the entry at
    // it. The registry is a glob, so that is the only edit it needs.
    {
      caption: 'Three repos, one build time seam. [ diagram ticket to follow ]',
      tone: 'diagram',
    },
  ],
  links: [
    { label: 'APP STORE', href: 'https://apps.apple.com/us/app/pbiq/id6761266107' },
    { label: 'PBIQ.AI', href: 'https://pbiq.ai' },
  ],
  // Renders nothing. It is here so the next agent reads it before adding to
  // this window.
  //
  // NO PLAYER OR MEMBER DATA. The roster, league and rubric work runs on real
  // Life Time members and league players by name. Counts of people may appear
  // on this page, people may not, and no artefact that carries a name may
  // ship as a screenshot. Life Time is named only because T's own resume and
  // the public MN Cup application both name it.
  //
  // Three of the extraction's open questions were resolved here and T can
  // overturn any of them. Q8, how much of the coach side league and rubric
  // work belongs on a public site: included, as counts and outcomes only,
  // because it is unambiguously his and it is the most measured work in the
  // project. Q9, whether to show pbiq.ai and the App Store listing: both are
  // public and both are linked. Q5, which drill number to use: 586, the
  // pipeline catalog, with the deep dive saying what the other three count.
  //
  // Q2 is not resolved and must not be. Nothing on this page divides the iOS
  // work between T and Kam.
  constraint:
    'No player or member data. Counts of people only, never names, and no screenshot of a roster, a scorecard or a rubric card until every name on it is blanked. Nothing here divides the iOS build between the two founders, because no document does.',
}

export default project
