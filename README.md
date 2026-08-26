# t-portfolio-website

Personal site for Tobias Knight at **tobiasknight.dev**. It presents as a
classic Macintosh desktop: projects, photos and personal artifacts are files on
someone's computer rather than sections of a portfolio.

Static Vite + React + TypeScript, deployed to Cloudflare Workers at `tobiasknight.dev`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type checks, then builds to dist/
npm run lint
```

**Working rules and every decision already taken live in `CLAUDE.md`. Read it
before changing anything.** The design spec is not in this repo, it is in
iCloud, and it is not duplicated here. `CLAUDE.md` has the path.

---

## Taxonomy

Every file in this repo, what it is, and what it does. Anything added, removed
or repurposed gets recorded here in the same commit. This table is the index
that gets consulted before a new file is ever created.

### Root

| File | What it is | What it does |
|---|---|---|
| `README.md` | This file | Setup, and the taxonomy of everything in the repo |
| `CLAUDE.md` | Working rules | Decisions taken, constraints, traps, and the rules for how work happens here. The first thing any session reads |
| `HANDOFF.md` | The map | State, what changed last session, next-up (bugs/enhancements/agents), open decisions, links. Read after CLAUDE.md |
| `TICKETS.md` | The board | Every unit of work, its mode (AFK, SHOW, ASK) and its status. Also the list of what is blocked on T |
| `CONTEXT.md` | The vocabulary | What this repo means by case study, archive entry, evidence, the shape, the measure, set dressing, blank. Read before writing copy or naming a component |
| `docs/agents/` | Skill configuration | Where issues live, how the triage labels map, and the domain doc layout. Written by `setup-matt-pocock-skills`; the engineering skills read these |
| `docs/adr/` | Decisions, with reasoning | One file per architectural decision: what was chosen, why, and what was rejected on what grounds. Numbered, append only, not edited after acceptance |
| `assets_src/` | Raw source media | Original videos/photos (gitignored); the converted, served copies live in `public/` |
| `docs/` | Extractor output | Raw material gathered from other repos, one file per project. See its own section below |
| `index.html` | Page shell | Title, description, the Open Graph tags that drive the LinkedIn preview, and the Google Fonts link for Silkscreen and Inter |
| `vite.config.ts` | Build config | Sets the base path from `VITE_BASE`, which is what differs between the custom domain and the github.io preview URL |
| `package.json` | Manifest | React 19, React Router 7, Vite 8, TypeScript. No UI library and no CSS framework |
| `.gitignore` | Ignore list | `node_modules`, `dist`, editor and OS noise |

### `docs/`

Extraction output. Facts pulled out of the source material in iCloud and in
other repos, so that `content.ts` can be filled in from a document rather than
from memory. Nothing in here is rendered by the site, and nothing in here is
private career material: this repo is public, so salary, offers, rejections and
interview content stay out, and named recruiters and target companies are
redacted.

| File | What it is | What it does |
|---|---|---|
| `extracted/career.md` | Career extraction (issue #5) | Role, employer, dates and one line per position, every claim citing the file it came from. Resolved the "AC Surety Delivery Associates" ambiguity: two employers, and two names in the repo were mis-transcriptions. Wired into `resume.experience` on 2026-08-26 |
| `extracted/msba.md` | MSBA coursework extraction (issue #6) | Every course found in the two iCloud coursework folders: code, name, what the work shows, a 3 to 5 item stack, and the file each fact came from. Four are on the site, the rest are staged here. Read before editing `msba` in `data/content.ts` |
| `extracted/nlp-material-classifier.md` | Material classifier extraction (issue #4) | The full accuracy table from that repo, every figure cited by path, blanks left as `[ not recorded ]`. The source for the NLP case study window |
| `extracted/eda-6411.md` | The two EDA 6411 live cases (issue #47) | 4mativ GPS fleet analytics and the GED Testing Service segmentation, one file because they share a course and a folder. Method, architecture and T's role in full; both clients' performance figures withheld and cited by path, because both were real engagements and this repo is public. Answers the causal inference question with a no. Carries the proposed `projects` entry for the GED case, which is the missing sixth case study |
| `extracted/roleradar.md` | RoleRadar extraction (issue #46) | The agent topology described concretely, the Foundry integration read honestly, and the finding that the AutoGen GroupChat is built and never driven. No credentials, and the target company list is redacted to a count. The source for the RoleRadar case study window |
| `extracted/pickleball-iq.md` | Pickleball IQ extraction (issue #45) | The joint venture with Kameron Lymon, walked across the iCloud knowledge base and all three repos. What it is, the system, the honest stack (MongoDB, Pinecone and Firebase are all real here), the two different video pipelines, what was measured and what was not, and the product story. Contribution is drawn from what Tobias has written about his own work, never from commit counts |

### `src/`

| File | What it is | What it does |
|---|---|---|
| `main.tsx` | Entry point | Mounts the app inside a `BrowserRouter`. Every route renders the same desktop, because the desktop has to survive the navigation |
| `App.tsx` | The desktop | Owns the five desktop icons, builds the menus, renders the open windows, and runs the menu bar clock |
| `.github/workflows/ci.yml` | CI | Install, typecheck, build, on every PR and push to main. The `verify` job is the required check on the protected `main` branch |
| `scripts/mini-worker.sh` | The Mac Mini worker | Pulls `agent-ready` issues off GitHub, works one per branch, opens a PR, comments on the issue. Never touches main. Run it inside tmux |
| `data/content.ts` | All copy and data | Every word on the site. Split three ways: `home` (professional), `about` (the person), `resume` (the record). Skills are two levels, `skills` (eight discipline groups) and `toolbox` (named technologies), plus `capabilities` (the long form). Placeholder copy is flagged here and the flag renders on screen |
| `system/windows.ts` | Window manager | The window registry and the hook that reconciles open windows with the URL. The routing model is documented in `CLAUDE.md` and in the file itself |
| `components/Window.tsx` | Window chrome | Title bar, close box, pointer dragging, focus and z order. Drag is desktop only |
| `components/MenuBar.tsx` | Menu bar | The menus, including the Go menu, which is the fast path to the work for anyone who does not want to explore |
| `components/Icons.tsx` | Desktop icons | OG-Mac SVGs: folder, document, 3.5" floppy, ridged trash, road, paddle, TV, film (movie), drawn crisp-edged |
| `components/Diagrams.tsx` | Architecture diagrams | Hand authored inline SVG per ADR-0002, drawn with the same bevel and the same tokens as the window chrome. One registry keyed by the `DiagramId` in `content.ts`. Each diagram ships in two orientations, wide and tall, because Silkscreen in a 848 unit drawing renders at four pixels on a phone; system.css picks one on a container query. The CSI drawing is the ADR-0003 shape word for word, and adding a label to it is a client confidentiality decision |
| `components/ErrorBoundary.tsx` | Crash guard | Catches a component error and renders a message instead of blanking the whole app |
| `components/VideoJsPlayer.tsx` | Movie player | StrictMode-safe Video.js player used by the LUFFY.MOV window (B&W via CSS). Cycles the `moviePlaylist` clips in order and repeats |
| `windows/Panels.tsx` | Small windows | HOME (professional snapshot + skill rows), ABOUT (the person), RESUME (capabilities, core skills, toolbox, history), Contact, Anime, Zippy, the MSBA panel, the Trash Easter egg, the placeholder tag + blank renderer |
| `windows/Work.tsx` | PORTFOLIO and ARCHIVE | Finder list view (Name / Date Modified / Kind / Size). PORTFOLIO lists the case studies plus one ARCHIVE folder row; ARCHIVE opens its own window listing everything else. Every row in both opens a project window, and its depth follows the data |
| `components/ZoomRect.tsx` | The zoom rectangle | The classic Mac open and close animation: an outlined rectangle stepping from an icon out to a window and back. Its effect is mount only, and the comment in it explains why that is load bearing rather than lazy |
| `components/Boot.tsx` | Boot sequence | A full screen ML training run: the import stack, then epochs with a jittering loss, then a prompt that waits for Enter. Plays once per session, skips on any key, homepage only. Never blocks content, because the desktop is already mounted underneath it |
| `windows/Project.tsx` | Project window | The ADR-0001 case study template, all eleven sections. Sections render only when the data has them, which is how the client project stays outcome only, and how a project with no model gets no ML heading rather than an empty one. ML DECISIONS, MY CONTRIBUTION and the collapsed DEEP DIVE landed 2026-08-26 with the CSI window |
| `windows/Photos.tsx` | Photo gallery, parked | Built, then taken off the desktop on 2026-08-25 (P2-03) because `public/photos/` has nothing real in it. Unreferenced by design; one entry in `windowDefs` puts it back |
| `styles/system.css` | The entire visual language | Palette tokens, bevels, window chrome, menu bar, type scale, focus states, and the mobile layout. Every colour in the codebase comes from here |

### `docs/extracted/`

One markdown file per project walked in another repo. These are **not site
copy**. They are the evidence a case study window gets written from: every
number cited by path back to the source repo, and anything that was never
recorded written as a visible `[ not recorded ]` rather than reconstructed. Read
one before writing project copy, never instead of it.

| File | What it is | What it does |
|---|---|---|
| `nlp-material-classifier.md` | The marquee technical project | Walked from `~/dev/nlp-material-classifier` on 2026-08-25. The problem quantified, the hand adjudicated gold set, the five lane accuracy table, the two versions of the eval harness, the lessons, and the nine charts worth generating with what produces each. Three lanes have real numbers, three are blank on purpose |
| `eda-6411.md` | The two live cases from MSBA 6411 | Walked from the EDA 6411 and MSBA Student Consultant folders in iCloud on 2026-08-26. **Read its publishing line before copying any number out of it:** these were paid client engagements, this repo is public, and every performance figure for either client is deliberately withheld and cited by path instead. What is in it is method, architecture, dataset scale, findings stated as relative gaps, and T's role where a document names him. Ends with the proposed `projects` values for the GED entry and six questions only T can answer |
| `roleradar.md` | The agent orchestration project | Walked from the MSBA 6511 final project folder in iCloud on 2026-08-26. The four agent objects and what each owns, the handoff that is a function call rather than a conversation, why AutoGen, what Foundry actually provides here, an evaluation section whose answer is that nothing was ever scored, and ten failure modes. Also checks nine lines of current `content.ts` copy against the source: one is contradicted outright, two overstate, three are supported, and three are blanks, two of which the walk can now fill |
| `pickleball-iq.md` | Second in the case study order | Walked on 2026-08-26 across the iCloud PB IQ knowledge base and all three repos in `~/dev/pbiq`. Reads the knowledge base first, because the code holds none of the intent. Covers the joint venture with Kameron Lymon, the three repo system and the one architecture decision that explains how they relate, the stack as it actually is, the two different things called the video pipeline, and the measured numbers. Retention, latency and recommender accuracy are `[ not recorded ]`, which is a finding. No player or member data |

### `public/`

| File | What it is | What it does |
|---|---|---|
| `wallpaper.jpg` | The desktop | T's own beach photograph. Cropped at 90.5 percent width, which removes the person on the towel at the right edge |
| `home-bg.jpg` | Inside the HOME window | T's photograph of a 911 Targa, cropped to a band that holds the car with no other vehicles in frame. The panel of text sits on it and is capped in width so the car still reads |
| `t-profile.jpg` | Portrait | 640px square, cropped from T's photo. The other person in the original frame is outside the crop |
| `zippy.png` | Zippy, large | 256px cutout with transparency, shown in the ZIPPY window |
| `zippy-icon.png` | Zippy, icon size | 64px, used as an actual desktop icon rather than a drawing |
| `og.png` | Link preview card | 1200x630. The actual front door, because almost every visitor sees this on LinkedIn before they see the site |
| `favicon.svg` | Favicon | A small beige computer |
| `luffy.mp4` · `ice.mp4` | Movie clips | The LUFFY.MOV playlist (B&W via player CSS), cycled in the order set by `moviePlaylist` in `data/content.ts`. A new clip is one entry there plus the file here |
| `csi-team.jpeg` | CSI ELP team photo | Shown on the CSI.APP project page |
| `photos/*.JPG` | Placeholder photographs | Eight generated stand ins. The Photos window is queued for removal |

### `scripts/`

| File | What it is | What it does |
|---|---|---|
| `make-placeholders.mjs` | Asset generator | Writes the eight placeholder JPEGs. Dithered, mixed sizes, no dependencies. Delete it when real photographs arrive |

### `.github/workflows/`

| File | What it is | What it does |
|---|---|---|
| `wrangler.toml` | Cloudflare deploy config | Static assets from `dist/`, and the SPA rule that makes deep links return 200 instead of 404. Replaces the old Pages workflow and its `404.html` mirror hack |

### Not in this repo, but load bearing

| Path | What it is |
|---|---|
| `04_career/05_portfolio_site/2026-08-23_tk-portfolio-spec_v1.md` (iCloud) | The design document. 1070 lines. The source of truth for visual direction, information architecture and the mobile rules |
| `04_career/05_portfolio_site/2026-08-23_tk-portfolio-handoff_v1.md` (iCloud) | The brief. Constraints, the the client project stealth posture, the DNS record, and the traps |
| `~/dev/the client project/README.md` | The custom domain writeup. Read before touching DNS |

---

## Current state

Pass 1 is spec phase 1: the desktop, the menu bar, five icons, the intro
window, two project windows, the photo viewer, the mobile adaptation and the
Open Graph card. It exists to validate the aesthetic, not to be the portfolio.

**All copy is placeholder and says so on screen.** The blocker for pass 2 is
content, not design. See the questions at the bottom of `TICKETS.md`.
