# Pickleball IQ extraction

Produced 2026-08-26 for issue #45. This is the material a PB IQ case study
window gets written from. **It is not site copy.** Nothing here has been wired
into `src/data/content.ts`, and `content.ts` was deliberately not touched.

**Extract, never generate.** Every claim below cites the file or repo path it
came from. Anything the sources do not record is written as `[ not recorded ]`,
which is itself a finding. Anything only Tobias can settle is written as
`[ T to confirm ]`.

**On authorship.** PB IQ is a joint venture between Tobias Knight and Kameron
Lymon. Git commit authorship was **not** used to apportion work, in either
direction. Tobias did a substantial amount of the iOS work offline, so a commit
log understates rather than measures him. No commit counts were taken and no
split was computed. The contribution section below is drawn only from documents
in which Tobias describes his own work.

**What is deliberately not here.** No API keys, no App Store credentials, no
`.env` contents. No player or member data: the roster, league and rubric work
runs on real Life Time members and league players by name, and none of those
names, ratings, emails or assessments appear in this file. Counts of people
appear, people do not. Life Time is named because Tobias's own resume and the
public MN Cup application both name it.

---

## Sources

**Knowledge base**, paths relative to:

```
~/Library/Mobile Documents/com~apple~CloudDocs/00 MSBA + Coding/PBIQ/
```

| Path | What it is |
|---|---|
| `00_STATUS.md` | The living status board, last updated 2026-08-04. Every workstream and its state |
| `00_WORKLOG.md` | Append only session history, newest on top. The product story lives here |
| `2026-07-13 - PB IQ resume bullets.md` | How Tobias describes this work himself, refreshed 2026-07-13, with an accuracy notes section that cuts his own overclaims. **The closest thing to a statement of his contribution** |
| `CLAUDE.md` | The workspace guide: repo map, product layers, architecture, run commands |
| `01_product/PBIQ_Product_Strategy.md` | 2026-04-25, author line reads "Tobias Knight (+ Claude Code)". The strategy and the data moat argument |
| `01_product/Kam_Update.md` | The living Tobias to Kam handoff doc. Written in Tobias's first person |
| `02_business/admin/PB IQ Internal notes/PB IQ Technical Deck — Gamma v2.md` | The technical blueprint, including a section titled "Update for Kam: What Tobias Has Built" |
| `02_business/admin/mn cup/MN_CUP_APPLICATION_FINAL_SUBMISSION.md` | April 2026, the MN Cup application as submitted |
| `02_business/admin/PB IQ Internal notes/PBIQ_STRATEGIC_QA_SHORT_ANSWERS.md` | Copy ready strategic answers, grounded in the two above |
| `02_business/admin/App feedback/PBIQ_App_Feedback_for_Kam.md.pdf` | 2026-04-13. Bylined "From: Tobias Knight (Co-founder), To: Kameron Lymon (Co-founder / Lead Engineer)". Tobias's own TestFlight walkthrough, 14 numbered items |
| `2026-08-20-PB-IQ-Mike-Ricketts-Connect-transcript.txt` | 2026-08-20 call transcript. Tobias describing PB IQ out loud, in his own words |

**Code**, paths relative to `~/dev/pbiq/`. Three private repos, listed in
`CLAUDE.md` under "Where things live".

| Repo | What | Owner of the GitHub remote, per `CLAUDE.md` |
|---|---|---|
| `pickleballios/` | The iOS app | `github.com/KamLymon/pickleballios` |
| `pickleball-backend-nodejs/` | The API and the agent | `github.com/KamLymon/pickleball-backend-nodejs` |
| `pbiq-analytics/` | The Python data and ML side | `github.com/Tobias-V-Knight/pbiq-analytics` |

---

## What it is, in two sentences

Pickleball players know their DUPR rating, the sport's skill number, but not
what to practise next, and coaches run privates, clinics and leagues with no
shared place to record who needs what. PB IQ is an iOS app plus a coach
platform that maps a library of drills to skill level, uses an AI assistant
grounded in the player's own data to say what to work on, and gives the coach
the notes, plans and client view underneath it.

Sources: the framing is `02_business/admin/mn cup/MN_CUP_APPLICATION_FINAL_SUBMISSION.md`,
executive summary and value proposition sections. Tobias says the same thing
more plainly in `2026-08-20-PB-IQ-Mike-Ricketts-Connect-transcript.txt` at
02:17: the original idea "was that we just wanted a way to find better drills",
and it is now on the App Store, used for "coaching, CRM analytics, and applying
some of what I've learned in school, specifically predictive analytics to
better match drills and techniques to different levels".

`01_product/PBIQ_Product_Strategy.md` states the positioning more ambitiously:
PB IQ as "a structured intelligence layer that sits between raw data sources
(DUPR ratings, video analytics, coach notes) and the people who need them".

**Three product layers**, from `CLAUDE.md` and the technical deck:

1. **PB Roadmap**, iOS, business to consumer. Player drill queue, mapped to DUPR.
2. **PB IQ Coach**, web and backend, business to business. Client management,
   note to tag to drill pipeline, lesson plans.
3. **PB IQ Manager**, club analytics. Future, not built.

---

## The venture, and who did what

**Roles as the documents state them.**

| Person | Role | Source |
|---|---|---|
| Tobias Knight | Co-founder | Byline of `02_business/admin/App feedback/PBIQ_App_Feedback_for_Kam.md.pdf`, 2026-04-13 |
| Tobias Knight | "Co-Founder & AI Engineer", May 2025 to current | Current resume, per `docs/extracted/career.md` in this repo. The older master CV says "Founder & AI Engineer", and `2026-07-13 - PB IQ resume bullets.md` carries the same "Founder & AI Engineer" header line. Which title he uses is his call, tracked as an open question in `career.md` |
| Kameron Lymon | Co-founder, Lead Engineer | Same byline, and `02_business/admin/mn cup/MN_CUP_APPLICATION_FINAL_SUBMISSION.md`: "Kam Lymon is our lead engineer and owns the iOS build" |

**The LLC exists.** `01_product/Kam_Update.md` records "2026-06-03: LLC formed;
SOS + EIN confirmations saved". Filing documents sit in `02_business/legal/`.

**What Tobias says he built.** These are the statements in which he describes
his own contribution. They are the basis for anything the case study says about
his role.

* `02_business/admin/PB IQ Internal notes/PB IQ Technical Deck — Gamma v2.md`
  closes with a section headed "Update for Kam: What Tobias Has Built (ML +
  Content Side)". It lists, as done and ready to integrate: the V1 drill matrix
  (81 drills across six shot types, tagged by DUPR band, player count, court
  zone, lesson phase and limiter flag), the finalised JSON schema for the
  drills collection, the mobile navigation model, and the matrix factorisation
  model spec with its cold start design and evaluation framework. The same
  section then lists what the app must capture and what Tobias will do next,
  and ends with "The short-term ask for Kam". The division of labour in that
  document is content and ML on Tobias, app and data layer on Kam.
* `2026-07-13 - PB IQ resume bullets.md`, the four recommended bullets, all
  marked code verified against `~/dev/pbiq/`: shipping the app and running the
  pilot sessions himself, the in app AI coaching assistant, the production AI
  operations layer, and the measured retrieval and refusal system.
* `01_product/Kam_Update.md` is written in Tobias's first person and shows him
  owning legal formation, App Store compliance prep, the onboarding survey
  system, the drill matrix and its V2 build, and the routine engine design,
  while explicitly handing the in app onboarding funnel to Kam ("yours to
  build") and naming in app account deletion "an engineering task on you".
* `2026-08-20-PB-IQ-Mike-Ricketts-Connect-transcript.txt`: "Cam and I have been
  working on it", then his own work on the league rubric, the roll up of
  player deficits across a cohort, and the coach side analytics.

**One inconsistency in the sources, unresolved.**
`02_business/admin/mn cup/MN_CUP_APPLICATION_FINAL_SUBMISSION.md` is written in
a first person that names *both* founders in the third person: the narrator
says "I lead go-to-market from the court" and then "Tobias Knight, also in the
Carlson MSBA program, leads data science and the recommendation side. Kam Lymon
is our lead engineer and owns the iOS build." The coaching biography in that
narrator's voice (three years teaching, more than five hundred students, mostly
Life Time, Twin Cities, Carlson MSBA) matches what every other document says
about Tobias, so the third person "Tobias Knight" reads like a drafting
artefact. It is not resolvable from the file. `[ T to confirm ]` whether the
MN Cup application is in his voice.

**The one thing an agent cannot settle.** How the iOS build divides between the
two of them. The MN Cup application says Kam owns it. Tobias did substantial
iOS work offline that the repo does not show. No document in the knowledge base
states a split. `[ T to confirm ]`, and until he does, the case study should
describe PB IQ as a joint venture and describe Tobias by what he demonstrably
owns rather than by a percentage.

---

## The system: three repos and how they connect

```
        pickleballios  (Swift, SwiftUI, MVVM)
                 |  every call goes through Core/Network/APIClient
                 v
  pickleball-backend-nodejs  (TypeScript, Express, Mongoose)
     Firebase Auth  ·  MongoDB  ·  Redis  ·  Pinecone + Voyage  ·  RevenueCat
                 ^
                 |  build time seeding, not a runtime dependency
        pbiq-analytics  (Python)
     taxonomy · youtube_pipeline · dashboard · roster · rag
```

### `pickleballios`, the iOS app

Native SwiftUI, MVVM, consuming a remote REST API
(`pickleballios/CLAUDE.md`). Two products: the `pbiq` app and a `pbiqWidget`
home screen widget. Feature folders under `Views/`: Achievements, Auth, Chat,
Coach, Dashboard, Drills, League, Onboarding, Paywall, Player, Roadmap, Root,
Social, Workout. Cross cutting infrastructure lives in `Core/`: Auth, Network,
Theme, Notifications, Payments, Telemetry, Haptics, Audio, Calendar, Review.

Hard conventions from `pickleballios/CLAUDE.md`: all networking goes through
`APIClient`, never raw `URLSession` in feature code; colours, fonts and radii
come from `Core/Theme/` and are never hardcoded in a View; deep link routing is
centralised in `RemoteNotificationHandler`.

Scale, counted from the working tree on 2026-08-26: 460 Swift files under
`pbiq/`, 4 under `pbiqWidget/`, 60 test files under `pbiqTests/`.

Testing, per `pickleballios/CLAUDE.md`: `scripts/unit-tests.sh` is the gate,
480 passing tests, 0 crashes. 23 test classes are quarantined because
instantiating an `@Observable` view model crashes the Swift runtime on dealloc
under `SWIFT_DEFAULT_ACTOR_ISOLATION = MainActor`, a synthesized isolated
deinit with no app code to fix. A Maestro end to end suite lives in
`pickleballios/maestro/flows/` with 9 flows: launch, tab sweep, home today's
session, feed post detail, library, play, PB IQ chat, You segments, session
detail. `pickleballios/docs/TESTING/` holds roughly 170 per slice test plans,
one per shipped feature.

Integrations, from `pickleballios/pbiq/pbiq/pbiqApp.swift`: Firebase, Firebase
App Check, RevenueCat, and a HealthKit observer that watches for pickleball
workouts.

### `pickleball-backend-nodejs`, the API and the agent

TypeScript, Express, Mongoose, with Firebase Auth and MongoDB
(`pickleball-backend-nodejs/CLAUDE.md`). Deployed on Railway
(`pickleball-backend-nodejs/railway.toml`, Nixpacks builder, health check on
`/health`), with a separate `firebase-functions/` directory.

Scale, counted from the working tree on 2026-08-26: 1273 TypeScript files under
`src/`, of which 606 are tests; 76 Mongoose models; 75 architecture decision
records in `docs/adr/`; 5 eval fixtures in `evals/fixtures/`.

The agent architecture is the substantial piece, and it is documented as
vocabulary rather than as code comments.
`pickleball-backend-nodejs/CONTEXT.md` is a 750 line binding glossary. Its
shape, per ADR-0052 and the CONTEXT.md entries:

* **Three entry ways.** A **Direct Call** that can never reach an LLM, an
  **Intent Call** that names its task, and **Chat**, free text. Each endpoint's
  designation is fixed at design time and never inferred at runtime. Runtime
  classification of an endpoint's kind is explicitly named as the anti pattern
  the term exists to forbid.
* **Sub agents.** `PlayerCoaching` and `CoachAssistant`, each with its own
  model, token budget and write policy. A sub agent does no work beyond
  reasoning; all functionality lives in tools (`src/tools/`, `src/agent/`).
* **A supervisor** that routes free text chat turns to a destination sub agent
  with an advisory skill hint, and can politely decline off topic input.
* **Two retrieval surfaces, deliberately separated.** The **Knowledge Base**
  explains, returning passages from static coaching content in Pinecone.
  **Catalog Search** prescribes, returning drills, skills and routines the
  player can act on.
* **Three rubrics** for grading generated output: a **Response Rubric** per
  agent skill for chat turns, an **Intent Rubric** per intent, and a **Door
  Rubric** for a contextual door's opening turn. In each case one dimension
  array generates both the judge prompt and the writing rules in the
  generation's own system prompt, so instruction and grading cannot drift.
* **Evals split by entry way, not by depth** (`src/evals/chat/`,
  `src/evals/intent/`, `src/evals/door/`). Chat has three rungs: routing, tool
  selection, answer quality.
* **A production quality judge**, Conversation Review, which stores a verdict
  of `ok`, `degraded` or `failed` plus a closed failure kind, and never
  persists conversation text.

The domain vocabulary is unusually disciplined and is worth showing in a case
study on its own terms: every identity type is branded
(`src/lib/identity.ts`, ADR-0057) because a User Id, a Firebase uid, a Coach Id
and a Client Id are all the same shape at runtime and mixing them never throws,
it just returns an empty account.

`pickleball-backend-nodejs/CLAUDE.md` also names a **fourth repo**,
`pbiq-webapp` (`KamLymon/pbiq-webapp`, currently the marketing site with product
development ramping up), and a retired one, `pbroadmap-frontend`. `pbiq-webapp`
is not cloned under `~/dev/pbiq/`, so nothing about it was read for this file.

### `pbiq-analytics`, the Python side

Tobias's own repo. Five folders, per `pbiq-analytics/CLAUDE.md`:

| Folder | What it does |
|---|---|
| `taxonomy/` | Canonical source of truth for every drill and tag. `drill_matrix/schema.json` plus modules `00..14_*.md`, and `tag_taxonomy/skill_limiter_tags_v1_csv.md`. All code validates against exact strings from here |
| `youtube_pipeline/` | Staged, idempotent pipeline: YouTube playlist to transcripts to Claude drill extraction to a master catalog |
| `dashboard/` | Streamlit coach analytics dashboard plus a Claude coaching agent. Two lens reconciliation |
| `roster/` | Coach command center, a 13 page Streamlit app over a SQLite roster |
| `rag/` | Staged scraper plus local embedding RAG over coaching document corpora |

**The connection to the product, stated as an architecture decision.**
`00_WORKLOG.md`, 2026-07-06: "Architecture (with Kam): `pbiq-analytics` is
build time only; runtime RAG lives in the Node backend." That is the honest
description of how the three repos relate. The Python repo produces the drill
catalog, the taxonomy and the coaching analysis; the Node backend serves the
product. They are not wired together at runtime.

The one concrete handoff is documented in `00_WORKLOG.md`, 2026-06-23:
`youtube_pipeline/export_for_backend.py` converts the master catalog and the
routines into backend seed JSON (586 drills, 20 routines), landing as PR #290
on `KamLymon/pickleball-backend-nodejs` off branch
`tk/drills-v2-routines-migration`. `00_STATUS.md` still lists that PR as open
as of its 2026-08-04 update, with "Merge #290, then run `seed-drills` and
`seed-routines` on deploy" as the next step. `package.json` in the backend does
carry both `seed-drills` and `seed-routines` scripts, so the receiving side
exists. Whether #290 has since merged is `[ not recorded ]` in any file read
here.

**Data boundary.** `pbiq-analytics/CLAUDE.md`: client data, corpora and media
never enter git. They live in the iCloud workspace and are symlinked in at
`dashboard/data`, `roster/db`, `roster/outputs` and `rag/data`. The PCI corpus
is licensed member content and is explicitly never committed.

---

## The stack, honestly

The issue asks specifically about MongoDB, Pinecone and Firebase, which came
off this site's tool list because CSI does not use them. **PB IQ uses all
three, and they are load bearing rather than incidental.**

| Technology | Used | Where, with the path |
|---|---|---|
| **MongoDB** | Yes, it is the primary datastore | `pickleball-backend-nodejs/package.json` depends on `mongoose@^8.4.0`; 76 model files in `src/models/`. `CLAUDE.md` in the PBIQ workspace: "PB IQ Coach API, TS/Express, Firebase, Mongo". ADR-0047 is titled "admin dashboard: Mongo is the source of truth for catalog content" |
| **Pinecone** | Yes, and it is live now | `pickleball-backend-nodejs/package.json` depends on `@pinecone-database/pinecone@^3.0.0`. `src/services/ragService.ts` constructs a client at module load with no feature gate, embeds with Voyage `voyage-3.5`, and sets `SCORE_THRESHOLD = 0.40`. `CONTEXT.md`: the Knowledge Base "Lives in Pinecone". ADR-0070 and ADR-0071 govern vector ids and what Pinecone does and does not hold |
| **Firebase** | Yes, three separate uses | Auth: `firebase-admin@^12.0.0`, and `CONTEXT.md` defines the Firebase uid as "a credential, not an identity", translated to a User Id at the auth boundary. App Check: registered before `FirebaseApp.configure()` in `pickleballios/pbiq/pbiq/pbiqApp.swift`, and `NEXT_STEPS.md` documents the Apple App Attest rollout. Storage: ADR-0070 makes Firebase Storage the durable source corpus that Pinecone is derived from |

**A correction the sources make on themselves.**
`2026-07-13 - PB IQ resume bullets.md` has an accuracy notes section that says,
as of that date, "Pinecone RAG: say architected, not serving. The backend
Voyage + Pinecone vector RAG is coded but disabled (until Pinecone is wired
up); the live agent is grounded in MongoDB." That caveat is now stale.
`src/services/ragService.ts` and `src/services/knowledge/` contain a complete
ingestion and retrieval path with no disable flag, and ADR-0070 and ADR-0071
treat Pinecone as the shipped knowledge store. The case study should describe
Pinecone as in use and cite the code, not the July note.

**The rest of the stack, by repo.**

*iOS* (`pickleballios/CLAUDE.md`, `pbiqApp.swift`): Swift, SwiftUI, MVVM,
WidgetKit, Firebase, Firebase App Check, RevenueCat, APNs push, HealthKit,
XCTest, Maestro for end to end flows.

*Backend* (`pickleball-backend-nodejs/package.json`): TypeScript 5.5, Express
4.19, Mongoose 8.4, `@anthropic-ai/sdk` 0.30, `@pinecone-database/pinecone` 3.0,
`voyageai`, `firebase-admin` 12, `redis` 4.6, `resend` for email, `zod` for
validation, Jest with `ts-jest`. Railway for deploy, Firebase Functions
alongside. RevenueCat entitlements are handled in
`src/services/revenueCatEntitlement.ts`.

*Analytics* (`pbiq-analytics/CLAUDE.md`, `rag/README.md`,
`youtube_pipeline/README.md`): Python, Streamlit, SQLite, pandas, ChromaDB,
`sentence-transformers` with `bge-small-en-v1.5` embeddings, `rank_bm25`,
Playwright for authenticated scraping, the YouTube Data API v3,
`youtube-transcript-api`, and the Anthropic SDK. Default model for the coaching
agent is `claude-opus-4-8`, with Sonnet for bulk extraction.

**Databricks.** `2026-07-13 - PB IQ resume bullets.md` lists a central data
platform on Databricks under "Roadmap / in-progress", with the explicit
instruction to "frame as designing or standing up, not built, until real". No
Databricks code exists in any of the three repos. It is not a stack item.

**A trained model.** There is not one. The same file cuts the BERT claim
outright: "No trained model exists; notes to tags is rule or keyword based
(`parse_notes.py`)." The matrix factorisation recommender in the technical deck
is a designed model with an evaluation plan, not a fitted one, and the resume
file marks the learned recommender as "building, not shipped", noting "a
trained neural net does not exist yet, so don't claim one". The real machine
learning in the stack is the embedding and retrieval layer, plus the LLM
extraction and grading pipelines.

---

## The video pipelines. There are two, and they are different things

This is the single most confusable part of the project. A case study that
merges them will be wrong.

### 1. The YouTube drill extraction pipeline. Built, and it is Tobias's

Source: `pbiq-analytics/youtube_pipeline/README.md` and
`pbiq-analytics/CLAUDE.md`.

**In:** a YouTube playlist of saved coaching videos.
**Out:** a structured, level mapped drill catalog with per drill timestamps.
**What the model does:** Claude reads each video's timed transcript and extracts
drills as structured JSON against a fixed schema, constrained by enums drawn
from the canonical taxonomy.

Stages, each idempotent and skip if exists:

| Stage | File | What it does |
|---|---|---|
| 1 | `stage1_fetch_videos.py` | YouTube Data API v3, playlist to `videos.csv` |
| 2 | `stage2_fetch_transcripts.py` | Timed transcripts to `data/transcripts/*.json` |
| 3 | `stage3_extract_drills.py` | Claude structured extraction with `thinking:adaptive`, one JSON per video |
| 4 | `stage4_map_to_matrix.py` | Maps to the canonical schema, emits `drill_corpus.json`, a flat `drill_corpus.csv`, and `REVIEW.md` as a human gate |
| tag | `routine_role.py` | Tags every drill `warm_up`, `isolation` or `game_applied` |
| build | `build_drills_master.py` plus `enrich_durations.py` and `enrich_display_names.py` | Produces `data/00_drills_master.csv/.json`, the deliverable |

Three design decisions worth showing:

* **Enums constrain generation, timestamps are derived in code.**
  `youtube_pipeline/README.md`: `shot_type`, `category`, `court_position` and
  `dupr_band` are constrained at generation, while `start_hms` and `end_hms`
  are computed rather than asked of the model, "to remove a formatting failure
  mode".
* **A `validate()` that drops rather than fails.** Non canonical skill tags are
  dropped and flagged; category is corrected from shot type; prerequisite tags
  are guaranteed never to overlap the tags a drill treats.
* **Prompt caching.** Cached system blocks hold the vocabulary and the drill
  index, with `cache_control:ephemeral` on the last block. Verified live:
  `cache_read=9403` on the second and subsequent calls.

Verified counts from the repo: `data/00_drills_master.csv` has 587 lines, so
**586 drills**, matching the README's "586 drills from 145 videos". The
transcript recovery story is in `00_WORKLOG.md`, 2026-06-23 and in the README:
YouTube rate limited the IP after roughly 70 consecutive transcript requests,
with a clean positional cutoff in `videos.csv`, and recovery required rotating
the VPN exit node per batch. Final recovery reached 145 of 151 videos, the
remaining 6 being music or text shorts with no speech.

**The legal decision that shaped it**, from `01_product/Kam_Update.md`,
2026-06-03: show drills through the official YouTube embedded player deep linked
to the drill timestamp, never by downloading or re-hosting video. "Our moat is
the curation layer, not the video."

### 2. Match video analysis. Bought, not built

Source: `pbiq-analytics/dashboard/README.md`,
`pbiq-analytics/dashboard/scripts/download_pbv.py`,
`01_product/PBIQ_Product_Strategy.md`.

PB IQ does **not** do its own computer vision. Match video is processed by **PB
Vision**, a third party product, and PB IQ consumes the resulting statistics.

**In:** a match video, uploaded to PB Vision by Tobias as a paying Premium
member.
**Out:** per game `stats.json` and `insights.json`, fetched in bulk by
`dashboard/scripts/download_pbv.py` from the public per game JSON URLs exposed
by that account, not the paid partner API. The README says so explicitly.
**What happens next:** `utils/parse_pbv.py` and `utils/rollup.py` roll the
statistics into z scores per DUPR band; that is one lens. The other lens is the
coach's own written observations, parsed into tags by `utils/parse_notes.py`.
A Claude agent (`dashboard/agent/precompute_recommendations.py`) reconciles the
two into a prioritised development plan with drill recommendations.

`01_product/PBIQ_Product_Strategy.md` names the intended business shape: PB
Vision as wholesale infrastructure, invisible in the user interface, with PB IQ
capturing the margin. It also states plainly why both lenses are needed: "PB
Vision tells you what happened. Coach notes tell you why and what to do about
it."

**Status, and this matters.** A repo wide search on 2026-08-26 for PB Vision
references found hits only inside `pbiq-analytics` (the dashboard, its scripts
and utils, and the docs). There are none in `pickleball-backend-nodejs/src`,
none in its `docs/`, and none in `pickleballios/pbiq`. So the video path is a
build time analysis tool Tobias runs locally, not a shipped product feature.
`01_product/PBIQ_Product_Strategy.md` is consistent with that: the PB Vision
stat to note agent is explicitly "Phase 2, activates with video integration",
and player self serve upload is Phase 3. `01_product/Kam_Update.md` lists
"PB Vision rights" as an open question, whether their terms allow commercial
use and AI training.

One useful engineering detail from `dashboard/README.md`: PB Vision labels
players only as slots 0 to 3 with no names, and slot order does not match
filename order, so the dashboard has a one time confirmation step that binds
slots to people before any roll up is trusted.

---

## Anything measured

Every number below is copied from a file. Where nothing was measured, the row
says so.

### Shipping

| Fact | Value | Source |
|---|---|---|
| App Store status | Live. PBIQ v2.0, initial release 2026-06-19, listing `apps.apple.com/us/app/pbiq/id6761266107` | `2026-07-13 - PB IQ resume bullets.md` |
| Site | `pbiq.ai` | `pickleball-backend-nodejs/CONTEXT.md`, brand entry |
| Prior distribution | TestFlight, superseded by the App Store release | `2026-07-13 - PB IQ resume bullets.md`, "Before to after" section |
| Company | PB IQ, LLC, formed 2026-06-03 | `01_product/Kam_Update.md` |

### The pilot

| Fact | Value | Source |
|---|---|---|
| Pilot size, as Tobias states it | 30 player pilot at Life Time, weekly use | `2026-07-13 - PB IQ resume bullets.md`, bullet 1, and the current resume via `docs/extracted/career.md` |
| Pilot target, as planned | 30 to 50 active testers over a stable 4 to 6 week TestFlight period | `02_business/admin/PB IQ Internal notes/PBIQ_STRATEGIC_QA_SHORT_ANSWERS.md`, risk table |
| Discovery interviews | 62 total: 50 players, 10 coaches, 2 facility managers, in one Google Sheet | `02_business/admin/mn cup/MN_CUP_APPLICATION_FINAL_SUBMISSION.md` |
| Coaching base | More than 500 students taught, roughly 30 coach relationships | Same file. Note the voice ambiguity flagged above |
| Revenue | Pre revenue, by design | Same file, and `PBIQ_STRATEGIC_QA_SHORT_ANSWERS.md` |
| **Retention** | **`[ not recorded ]`** | A grep of the whole knowledge base for retention, churn, day 2, active users, installs and downloads returns only *plans* to measure retention and *reasons* it matters. No measured retention figure exists in any file. `MN_CUP_APPLICATION_FINAL_SUBMISSION.md` says so itself: "We have not finished a long, controlled pilot with full quantitative results" and "we are still wiring basic engagement metrics such as opens, drill views, and return visits" |
| **Latency** | **`[ not recorded ]`** | No latency, p95 or response time figure appears in the knowledge base or in the repo docs read here |
| **Accuracy of the recommender** | **`[ not recorded ]`**, because the model was never fitted. RMSE, HR@K, NDCG@K and a Life Time A/B test are all specified as an evaluation framework in the technical deck, with no results attached | `PB IQ Technical Deck — Gamma v2.md`, "Evaluation Framework" |

### The RAG system, which is the one thing that was properly measured

From `pbiq-analytics/rag/README.md`. This is the strongest measured claim in
the project.

| Metric | Value | How |
|---|---|---|
| Retrieval, recall@6 | 1.00 | `rag_eval.py` over a golden question set at `eval/golden_questions.jsonl`, also reporting hit@1 and MRR |
| Retrieval mode chosen | Dense only, because the eval found it beat hybrid plus reranking on this corpus | Same. Hybrid and rerank remain available behind flags for exact term queries or a larger corpus |
| Answer faithfulness | 5.0 out of 5 | `rag_answer_eval.py`, judged by Sonnet, deliberately a different model from the Opus generator |
| Citation quality | 5.0 out of 5 | Same |
| Refusal accuracy on out of corpus controls | 1.0 | Same, using `eval/absent_questions.jsonl` |

`2026-07-13 - PB IQ resume bullets.md` describes the same system for a non
technical reader as a 25 question test graded by a separate AI judge, with a
perfect record of declining questions outside its knowledge. The retrieval
stack is `bge-small-en-v1.5`, 384 dimensions, 512 token chunks, into ChromaDB.

### Cost and scale

| Fact | Value | Source |
|---|---|---|
| Prompt caching saving | Roughly 90 percent token saving after the first player, from cached system blocks holding the taxonomy and drill catalog | `pbiq-analytics/CLAUDE.md`, `dashboard/README.md`, `dashboard/agent/prompts.py` |
| Staleness skip | `input_hash()` SHA256s the payload; a fresh cache skips the Claude call entirely | `pbiq-analytics/CLAUDE.md`, `dashboard/agent/schema.py` |
| Drill scoring run | 586 drills scored on fun and skill transfer by 21 parallel agents, one per shot type, roughly 889k tokens in 2.5 minutes | `00_WORKLOG.md`, 2026-06-24 |
| Backend test suite | 606 of 1273 TypeScript files under `src/` are tests | Counted from the tree, 2026-08-26 |
| iOS test gate | 480 passing, 0 crashes, 23 classes quarantined | `pickleballios/CLAUDE.md` |

### The coach side data work

All from `00_STATUS.md` and `00_WORKLOG.md`. Counts of records and people only,
no names.

| Fact | Value | Source |
|---|---|---|
| Roster built from coaching photos | 175 images to 85 players and 36 sessions, cross walked against the club's own Domo exports | `CLAUDE.md`, coach command center note |
| Resume phrasing of the same pipeline | 350 clinic photos to 85 players, 36 sessions, 127 attendance records, surfaced to run outreach across a 159 member league | `2026-07-13 - PB IQ resume bullets.md`. The two image counts differ; treat 175 as the roster build input and `[ T to confirm ]` what the 350 counts |
| League scoring | 23 scanned handwritten pages to 19 rounds, 57 games, 228 player game rows, 21 player standings, in the first pass | `00_WORKLOG.md`, 2026-07-17 |
| League scoring, weeks 1 to 6 | 39 rounds, 436 player game rows, 109 games, 21 players | `00_STATUS.md`, 2026-08-04 |
| Round validation | 15 of 19 rounds clean on the self checksum; the 4 failures were scorekeeper arithmetic slips with the underlying scores corroborated | `00_WORKLOG.md`, 2026-07-17 |
| Rubric assessments | 56 assessments over 4 sessions, 18 players with more than one date | `00_STATUS.md`, 2026-08-04 |
| Emailable league players | 82 of a 159 member league | `CLAUDE.md`, coach command center note |
| Drill scoring findings | Average fun 2.65 against average skill 3.39; only 43 of 586 drills are true games; 56 demand weighted empty cells; 29 glut cells; 79 drills score 4 or above on both | `00_WORKLOG.md`, 2026-06-24 |

### The drill count, which is genuinely four different numbers

A case study must pick one and say what it counts. All four are real.

| Number | What it counts | Source |
|---|---|---|
| **81** | The authored V1 matrix, six shot types, DUPR mapped. Also the number the iOS repo still documents for the in app hierarchy, alongside 81 limiter tags | `PB IQ Technical Deck — Gamma v2.md`; `pickleballios/CLAUDE.md` |
| **93** | DUPR mapped drills in the TestFlight build as of April 2026 | `MN_CUP_APPLICATION_FINAL_SUBMISSION.md`, and `PBIQ_STRATEGIC_QA_SHORT_ANSWERS.md` says to use 93 for the current product and reserve 81+ for unchanged deck slides |
| **136** | The authored taxonomy matrix, 81 V1 plus 55 V2, across 14 modules | `pbiq-analytics/CLAUDE.md` and `taxonomy/drill_matrix/00_index.md` |
| **586** | The built video backed master catalog, the pipeline deliverable, and the number seeded to the backend in PR #290 | `youtube_pipeline/data/00_drills_master.csv`, verified 587 lines including the header |

`2026-07-13 - PB IQ resume bullets.md` rules on this directly: "Drill count is
586 (pipeline catalog); the in-app subset differs. Use 586 for the
corpus/pipeline bullets. Old 330 drills figure was inaccurate."

Skill tags carry the same problem. The pipeline's `taxonomy.py` parses **74**
skill tags from the canonical file and the resume bullets say "74-tag skill
system"; `pickleballios/CLAUDE.md` says 81 limiter tags; the league rubric
vocabulary is 67 rows after a 2026-07-29 migration (`00_WORKLOG.md`,
2026-08-04); and `PB IQ Technical Deck — Gamma v2.md` plans "~100 standardized
tags". 74 is the number with code behind it.

---

## The product story: what was tried, what was dropped, what changed

From `00_WORKLOG.md`, `00_STATUS.md`, `pickleball-backend-nodejs/CONTEXT.md`
and the App feedback PDF. These are the decisions that show judgement, which is
what a case study is for.

### Dropped, with the reason

| Dropped | Why | Source |
|---|---|---|
| The de-duplication stage (`stage5_dedup.py`) | It over merged: at a 0.40 threshold it collapsed forehand and backhand halves of the same drill, and separate progression levels, into one. Drill level de-duplication was reclassified as a coaching judgement call and replaced by an `overlaps_existing` flag for human review | `00_WORKLOG.md`, 2026-06-23 |
| The 81 text only V1 drills, from the shipped catalog | A video only rule was adopted: if a drill has no clip, it does not ship. The built master became the app catalog | `00_WORKLOG.md`, 2026-06-23; `CLAUDE.md` |
| The BERT topic modelling claim | No trained model ever existed. Notes to tags is rule and keyword based | `2026-07-13 - PB IQ resume bullets.md`, accuracy notes |
| The Netlify HTML survey form | Replaced by Google Forms generated from a markdown master via an Apps Script generator, so the form is reproducible | `00_WORKLOG.md`, 2026-07-16 |
| Two separate onboarding surveys, beginner and experienced | Rejected in favour of one adaptive flow, the same questions weighted differently | `pickleball-backend-nodejs/CONTEXT.md`, Onboarding entry |
| An LLM generated roadmap at onboarding | Retired at that point. The onboarding plan is now deterministic for everyone, so every new user lands non empty; the LLM only refreshes later, once real gameplay data exists | `CONTEXT.md`, Onboarding entry, and ADR-0037 |
| The `DevelopmentArea` model | Removed from iOS, with an instruction not to reintroduce it or write migration code for it | `pickleballios/CLAUDE.md` |
| The daily brief | Became the Pulse. The artefact is no longer daily, and facts are computed live on every read with only the headline cached, keyed by a hash of those facts, so nothing is re-worded without a real change | `CONTEXT.md`, Pulse entry |
| The client supplied agent `mode` parameter | Retired in favour of server designated entry ways | `CONTEXT.md`, Sub-agent entry |
| The DUPR tab in Add Client | Hidden, not fixed, because it is blocked externally on DUPR API credentials that do not exist | `pickleball-backend-nodejs/docs/launch-triage.md` |

### Changed after real use

**Tobias's own TestFlight walkthrough is the clearest instance.** The App
feedback PDF, 2026-04-13, is 14 numbered items from him walking his own app,
with annotated screenshots. Several of them are visibly what later shipped:

| What he wrote in April | What the system says now |
|---|---|
| Item 4, "Rate Your Skills" screen needs clarity: is self assessment redundant if the user enters DUPR? The value is capturing sub skill variance, for example a 4.0 player with weak resets | The Skill Assessment became **universal**, taken by everyone including DUPR holders, whose real number is kept as ground truth so every rated signup builds the calibration dataset. `CONTEXT.md`, Skill Assessment; ADR-0037; `00_WORKLOG.md` 2026-07-16 |
| Item 7, the shot picker has 19 overlapping options with no organisation, causing decision fatigue | Reorganised by mobile category, with the six category tree drawn out in the PDF itself |
| Item 2 and item 12, no per drill star rating, and no post drill feedback, marked "critical for the recommendation model" | Both are data collection the utility matrix requires. Whether they shipped is `[ not recorded ]` in the files read here |
| Item 10, on the session planner: "This feature is the coolest part of the app. In my opinion. This needs to be on the front page" | Today's Session is a Home hero with its own test plans (`pickleballios/docs/TESTING/home-todays-session.md`, `next-session-hero-contract.md`, `todays-session-e2e.md`) and a Maestro flow |
| Item 14, the roadmap shows drills below the user's level, for example 2.5 drills for a 4.7 player | `pickleballios/docs/TESTING/roadmap-active-plan-ux-fixes-ios.md` exists; the specific fix is `[ T to confirm ]` |

**A second instance, from the coach side.** The league rubric card went through
three versions in a month because of how coaches actually filled it in
(`00_WORKLOG.md`, 2026-08-04). Card v3.2 split a single NOT SEEN box into
"didn't see it" and "looked good", after the ambiguity of the single box
produced two conflicting scoring rules that are still live at once and inflate
apparent week over week improvement. `00_STATUS.md` carries that as an open red
flagged decision rather than quietly picking one. That is a good detail: the
system knows it is currently wrong and refuses to resolve it without the
coach's ruling.

**A third, on data trust.** `00_WORKLOG.md` records a rule that games scores are
the source of truth and the handwritten Games Won, Total Points and Rank boxes
are recomputed and used only as a self checksum, because they are derivable. It
also records that checksum coverage collapsed as the season went on, week 5
having tally boxes on 4 of 6 rounds and week 6 on 1 of 6, and that the
validation report still called a round with no checksum `CLEAN`. That is
recorded as a known defect, not hidden.

### Bugs worth showing, because they are the kind only running the thing finds

All from `00_WORKLOG.md`, 2026-08-04, unless noted.

* A dated key ingest guard sat on an unmerged branch, so the rubric page still
  keyed assessments on league plus player with a delete then insert. That is
  the bug that destroyed 14 assessments on 2026-07-23. Ingesting week 5 through
  it would have been the second occurrence.
* `extract_rubric.py` skipped pages 1 and 2 and assumed two cards per page,
  correct for the old card and wrong for v3.1, which prints one card per page
  from page 1. It was silently dropping the first two players of every batch.
* A missing shot row scored as seen and fine, so the absence of a Groundstroke
  row was silently crediting every historical player with a clean groundstroke.
* A migration's own dry run wrote to the database, because Python's `sqlite3`
  runs DDL in autocommit and the `ALTER TABLE` survived the rollback. Fixed
  with `isolation_level=None` and an explicit `BEGIN`.
* Page 13 averaged ratings and ignored faults, so a card with 30 checked faults
  and no filled bubbles scored as though nothing had been observed.
* From `00_WORKLOG.md`, 2026-07-17: the printed QR code for the player survey
  pointed at the owner only `/edit` URL, which would have hit a permission wall
  for every member who scanned it. Caught by decoding the QR codes before
  printing.

---

## Open questions for Tobias

| # | Question | Why an agent cannot close it |
|---|---|---|
| 1 | Founder or Co-Founder on PB IQ | The current resume says Co-Founder, the older master CV and the July resume bullets say Founder. Already tracked as item 5 in `docs/extracted/career.md` |
| 2 | How the iOS work divides between him and Kam | No document states a split. Commit history cannot answer it, and the issue withdraws it as evidence |
| 3 | Is the MN Cup application written in his voice | The document names both founders in the third person while using "I". See the inconsistency section above |
| 4 | Did PR #290 merge, and is the 586 drill catalog live in the app | `00_STATUS.md` still lists it open at its last update, 2026-08-04 |
| 5 | Which drill number the case study should use | Four defensible numbers, listed above. The resume bullets say 586 for pipeline claims, but the in app number is a separate question |
| 6 | Did per drill star rating and post drill feedback ship | He flagged both as critical for the recommender in April. Not confirmed in any file read here |
| 7 | 175 images or 350 photos in the roster build | Two of his own documents give different counts for what may be two different inputs |
| 8 | How much of the coach side league and rubric work belongs on the site at all | It is unambiguously his, it is the most measured work in the project, and it runs entirely on named real people. The counts are safe, the artefacts are not |
| 9 | Whether to show `pbiq.ai` and the App Store listing | Both are public. `HANDOFF.md` in this repo already carries an open item to link `pbiq.ai` and pull photos |

## What a case study should probably lead with

Not a ranking, an observation about where the evidence is strongest. The three
things in this project that are both demonstrably Tobias's and actually
measured are:

1. **The YouTube extraction pipeline.** 145 videos to 586 structured, level
   mapped, timestamped drills, with enum constrained generation, a validate
   step that drops rather than fails, a human review gate before anything
   merges into the canonical taxonomy, and roughly 90 percent token saving from
   prompt caching. It has a real engineering story in the rate limiting
   recovery and a real product decision in embed rather than re-host.
2. **The RAG system with its own evaluation harness.** Recall@6 of 1.00,
   faithfulness and citation both 5.0 of 5, refusal accuracy 1.0, judged by a
   different model from the generator, with retrieval mode chosen *by* the eval
   rather than by preference.
3. **Turning handwritten paper into a working system.** Scanned scorecards and
   rubric cards to a validated standings and assessment pipeline, with a
   checksum rule, a hard failing alias resolver so a typo stops the build
   rather than inventing a phantom player, and an honest log of every place the
   data lied.

The fourth thing, and it is the one his own resume leads with, is that he
shipped it: a live App Store app in weekly use with a pilot he ran himself,
turning what customers said each week into product changes.
