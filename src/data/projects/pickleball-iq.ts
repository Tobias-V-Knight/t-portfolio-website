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
  // Three decisions, each labelled with what was decided rather than with the
  // name of a box. The third is the honest one and it stays: the July resume
  // bullets cut the BERT claim outright, and no trained model exists here. An
  // ML section that implies a fitted model on a project that never fitted one
  // is the exact claim rule 9 forbids.
  mlDecisions: [
    {
      label: 'Enums constrain the model, code computes the timestamps',
      body: 'Extraction runs against a fixed schema, with shot type, category, court position and DUPR band constrained to the canonical taxonomy. Timestamps are computed from the transcript in code rather than asked of the model, which removes a formatting failure mode instead of catching it later.',
    },
    {
      label: 'The eval chose dense retrieval, and a second model graded the answers',
      body: 'Recall@6 reached 1.00 on a golden question set with dense retrieval alone, beating hybrid search plus reranking on this corpus, so hybrid stays behind a flag. A second model grades the output, Sonnet judging an Opus generator, because grading a model with itself measures agreement rather than quality.',
    },
    {
      label: 'No trained recommender, and this page does not claim one',
      body: 'The matrix factorisation recommender exists as a specification with a cold start design and an evaluation framework, never as a fitted model, and notes to tags is rule based. What actually runs is embedding, retrieval and structured extraction.',
    },
  ],
  // Ordered by strength: a deployment fact, a pilot, the one thing that was
  // properly measured, and then the honest absence. The last bullet is not an
  // apology. Retention, latency and recommender accuracy are genuinely not
  // recorded anywhere in the knowledge base, and a blank is correct output.
  evidence: [
    'Live on the App Store as PBIQ v2.0 since 19 June 2026, with pbiq.ai behind it. PB IQ, LLC was formed on 3 June 2026.',
    'A 30 player pilot at Life Time, in weekly use.',
    'The retrieval system is the one part that was properly measured: recall@6 of 1.00, faithfulness and citation 5.0 of 5, refusal accuracy 1.0 on questions the corpus cannot answer.',
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
  deepDive: [
    {
      heading: 'YouTube rate limited the pipeline at about 70 transcripts',
      body: 'Transcript fetching died partway through the playlist with a clean positional cutoff in the video list, which is what identified it as rate limiting rather than bad data. Recovery meant rotating the VPN exit node per batch and re running the stage, which was cheap because every stage is idempotent and skips what already exists. Final coverage was 145 of 151 videos. The remaining 6 are music or text shorts with no speech in them, so there was nothing to transcribe.',
    },
    {
      heading: 'Deduplication was a coaching judgement, so the stage came out',
      body: 'A dedup stage looked obvious on a 586 drill catalog and it over merged. At a 0.40 threshold it collapsed the forehand and backhand halves of the same drill into one, and separate progression levels of one drill into one. Deciding whether two drills are the same drill turned out to be a coaching call rather than a similarity score, so the stage was deleted and replaced with an overlaps_existing flag that routes the pair to a human.',
    },
    {
      heading: 'A drill with no clip does not ship',
      body: 'The 81 authored V1 drills were text only and were dropped from the shipped catalog in favour of a video only rule. Video is shown through the official YouTube embedded player, deep linked to the drill timestamp, and never downloaded or re hosted. That was a legal decision before it was a product one, and it holds because the value is in the curation layer rather than in the video.',
    },
    {
      heading: 'Prompt caching cut roughly 90 percent of the tokens',
      body: 'The taxonomy and the drill index are large, static and needed by every call, so they sit in cached system blocks with the cache marker on the last one. Verified live: the second and subsequent calls read 9403 cached tokens. A content hash on the payload skips the model call entirely when nothing has changed. On top of that, scoring all 586 drills for fun and skill transfer ran as 21 parallel agents, one per shot type, roughly 889k tokens in two and a half minutes.',
    },
    {
      heading: 'The drill count is four different numbers, and this page uses 586',
      body: '81 is the authored V1 matrix. 93 was the DUPR mapped set in the April TestFlight build. 136 is the full authored taxonomy across 14 modules. 586 is the built, video backed master catalog the pipeline produces, and it is the number used everywhere on this page because it is the one with the pipeline behind it. The in app subset differs, and it differs by exactly one open pull request: the exporter turns the master catalog into backend seed JSON, and the seeding scripts exist on the receiving side. [ Did PR #290 merge, so is the built catalog live in the app? ] An older 330 figure was wrong and is retired.',
    },
    {
      heading: 'The paper trail found bugs that only running it finds',
      body: 'Turning scanned scorecards and rubric cards into data surfaced a run of failures no test would have caught. An ingest guard sat unmerged, so the rubric page still keyed on league plus player with a delete then insert, which had already destroyed 14 assessments. The card extractor assumed two cards to a page, correct for the old card and wrong for the new one, so it silently dropped the first two players of every batch. A missing shot row scored as seen and fine, quietly crediting every historical player with a clean groundstroke. A migration dry run wrote to the database, because sqlite3 runs DDL in autocommit and the schema change survived the rollback.',
    },
    {
      heading: 'The rubric knows it is currently wrong and says so',
      body: 'The league rubric card went through three versions in a month because of how coaches actually filled it in. The current version splits one NOT SEEN box into did not see it and looked good, after the ambiguity of the single box produced two conflicting scoring rules that are both still live and both inflate apparent week over week improvement. That sits in the status board as an open decision flagged red, waiting on the coach to rule, rather than being quietly resolved by whoever noticed it.',
    },
    {
      heading: 'What the pilot changed',
      body: 'A fourteen item walkthrough of the TestFlight build in April 2026 is visibly what several shipped features came from. The skill assessment became universal rather than being skipped for players who enter a DUPR rating, because a 4.0 with weak resets is the variance the product exists to find, and every rated signup now builds a calibration set against a real number. A shot picker with 19 flat options was reorganised into six categories. The session planner, flagged then as the best part of the app and buried, is now the home screen hero.',
    },
  ],
  lessons: [
    'An evaluation is only worth building if it can change your mind. Mine picked dense retrieval over hybrid search plus reranking, which is not what I would have chosen, and the same harness is what lets the assistant decline a question rather than invent an answer.',
    'A form that two coaches fill in differently is a broken data model, not a training problem. One ambiguous box on the league rubric produced two live scoring rules at once, both flattering the numbers, and the fix was to split the box.',
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
