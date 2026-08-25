# HANDOFF — tobiasknight.dev (portfolio site)

**Read this first on any resume.** It is the map: what the site is, what state it's in, where every
file lives, and what's queued. Deepest rules live in `CLAUDE.md`; the work board is `TICKETS.md`;
the 1070-line design spec lives in iCloud (see CLAUDE.md "Source of truth"). Last updated 2026-08-25.

## What this is
A personal portfolio for Tobias Knight (`tobiasknight.dev`), built as a **classic Macintosh desktop**.
Static **Vite + React + TypeScript**, React Router, deployed to **Cloudflare Workers**, live at `tobiasknight.dev` since 2026-08-25. Projects, photos, a movie,
and personal artifacts live on the desktop as files/windows. Run: `npm run dev` (→ localhost:5173).
Verify a change: `npx tsc --noEmit && npm run build`.

## The three Cs (design north star — added 2026-08-24)
**Continuity · Consistency · Conciseness.** Charlie Dean's site is the reference: natural editorial
colors, photos centered and right-sized (never overwhelming), one consistent font system, prose that is
concise. Every visual choice is judged against these + spec §25 ("more like an interesting person's old
computer, or just more complicated?"). Now also written into `CLAUDE.md`.

## Provenance clearance (resolved 2026-08-24) — important
**CSI + Gravl work CAN be shown publicly.** No NDA was signed; the Gravl code is a clean room; CSI
explicitly said Tobias may post the work publicly to get jobs. So the classifier, CSI.APP, and Gravl can
be featured by outcome/role. Still: no client's private bid data, and keep to what was built, not raw code.

---

## Session 2026-08-25 — contract positioning + the Pass 2 bug sweep

Two threads. **Positioning:** the site never answered "what would I hire him for", so there is now a
`capabilities` model in `content.ts` (five blocks, each with buyer-language copy, technique chips and a
`proof` field naming the project behind it) rendered in BACKGROUND, plus a short `focus` label strip on
HOME and an availability chip that opens CONTACT. The data model separates three altitudes that were
mixed in the first draft: **capability** (what a buyer buys), **technique** (`evidence[]`), **tool**
(`runsOn`). Clustering, KNN and EDA were deliberately cut, and CI/version control demoted from headline
to one sentence, with the reasoning written into the file so nobody re-adds them.

**Still open on Tobias, both marked in `content.ts`:** the capability *order* (a positioning bet;
evaluation currently leads) and the availability line, left as a visible blank because it is his voice.

**Bugs:** P2-01…05 all fixed, see above.

## Where the work lives (2026-08-25) — read this before looking for a queue

**GitHub Issues are the board.** `TICKETS.md` is now the index and the history.
Open work: `gh issue list` or the repo's Issues tab.

```
LAPTOP (Tobias in the loop)     spec, scope, design, docs
        v  gh issue create
GITHUB ISSUES                   the handoff medium
        v  gh issue list --label agent-ready
MAC MINI (AFK)                  pulls, works, opens a PR
        v
LAPTOP                          Tobias reviews and merges
```

Nothing goes to the Mini until it is specced on the laptop. **Branch and PR,
never main**, no exceptions: a bad commit on main is live on the site until
somebody notices.

**The Mac Mini** is `tmaxxx@10.0.11.125`, key auth working as of 2026-08-25, all
tooling installed and authed (Claude Code, gh, tmux, node, brew, ollama), the
full iCloud workspace synced and materialised, and `sleep 0` already set. The
one gotcha that wasted time: a non-interactive `ssh host 'cmd'` does not read
`~/.zprofile`, so Homebrew is not on PATH and every tool reports as missing.
Export `PATH=/opt/homebrew/bin:$PATH` in anything you send it. Machine details
in `~/dev/MAC_MINI_HANDOFF.md`; the operating principle there still stands, so
system level changes are Tobias's to make.

Worker: `scripts/mini-worker.sh`, run inside tmux.

## The three way split (2026-08-25) — read before touching copy

**HOME is professional. ABOUT is the person. CV is the record.** T's call, and the reason the earlier
single ABOUT window read as neither one thing nor the other.

- **HOME** — name, positioning, status, the availability chip, one line of prose, and the four stack
  rows in short form. No history, no hobbies.
- **ABOUT** — Minneapolis, hobbies, endurance, photographs. `/about`.
- **CV** — capabilities long form, the full skills table, work history, education, the PDF. `/cv`, its
  own icon and its own menu title so a visitor can tell it apart from ABOUT before clicking.

**The stack model.** Four buckets: CAPABILITIES (what he gets hired to build), TOOLS (what he builds it
with), TECHNIQUES (what is under the hood), SHIPPING IT (what puts it in production). The fourth exists
because nginx, cron, CI/CD, hosted Postgres and hosted Chroma fit none of the other three, and because
most analytics graduates never touch them. **One array per group, favourites first.** HOME slices the
first `HOME_TAGS`, CV renders all: never fork these into two lists.

## File map — what this session touched
The **canonical, always-current file index is `README.md` → Taxonomy** (update it every session; that is
the rule). The table below is just the record of what the 2026-08-24 session changed, so the next agent
knows where the recent work landed. `★` = created/edited this session.

**Root**
| Path | Purpose |
|---|---|
| `CLAUDE.md` | Working rules (read before touching anything). ★ rules + three Cs added |
| `TICKETS.md` | The board (AFK/SHOW/ASK modes). ★ queue below added |
| `HANDOFF.md` | This file — the map. ★ new |
| `package.json` · `vite.config.ts` · `tsconfig*.json` | build config |
| `assets_src/` | ★ raw source media (gitignored); converted copies live in `public/` |

**`src/`**
| Path | Purpose |
|---|---|
| `main.tsx` | React root; ★ wrapped in `ErrorBoundary` so no component can blank the whole app |
| `App.tsx` | The desktop: menu bar, desktop icons (left=professional / right=fun), window rendering, zoom, clock. ★ menu→nav, icons split, PORTFOLIO rename, MSBA + video render, ErrorBoundary |
| `components/Boot.tsx` | ★ Boot screen: imports type out char-by-char, then a fake train.py run; one Enter to enter |
| `components/ErrorBoundary.tsx` | ★ new — catches a component crash, shows a message instead of blanking |
| `components/VideoJsPlayer.tsx` | ★ new — Video.js player (StrictMode-safe), used by the LUFFY.MOV window |
| `components/Icons.tsx` | SVG desktop icons. ★ OG-Mac redraws: FolderIcon, floppy DiskIcon, ridged TrashIcon, new FilmIcon |
| `components/MenuBar.tsx` | ★ now supports dropdown menus AND direct nav actions (Portfolio/About/Contact) |
| `components/Window.tsx` | Mac window chrome (title bar, close/zoom boxes, resize) |
| `components/ZoomRect.tsx` | icon→window zoom animation |
| `system/windows.ts` | ★ window manager + window defs. PORTFOLIO rename + larger project windows + MSBA def + LUFFY non-routed auto-open (`video` kind) |
| `data/content.ts` | ALL copy + project data (single source of truth). ★ `msba` object, `media.src` real images, CSI photo entry |
| `windows/Work.tsx` | ★ PORTFOLIO window — rewritten as a Finder list (Name/Date/Kind/Size + icons) |
| `windows/Project.tsx` | project case-study pages. ★ real-image `media` support |
| `windows/Panels.tsx` | About / Anime / Contact / Zippy / Intro panels. ★ new `MsbaPanel` |
| `windows/Photos.tsx` | photos window (queued for removal — see TICKETS) |
| `styles/system.css` | ALL styles. ★ Mac scrollbar (lavender thumb + arrows), Finder list, Video.js fill, HOME position, boot sizing |

**`public/`** (served assets)
| Path | Purpose |
|---|---|
| `luffy.mp4` · `ice.mp4` | ★ the movie clips (B&W applied by player CSS). `ice.mp4` ready to add to the loop |
| `csi-team.jpeg` | ★ CSI ELP team photo (on the CSI.APP page) |
| `home-bg.jpg` | the Porsche behind the HOME window |
| `wallpaper.jpg` · `favicon.svg` · `og.png` · `t-profile.jpg` · `zippy*.png` | desktop + branding |
| `photos/` | photo-window images (window queued for removal) |

---

## Next up (queued work) — details in `TICKETS.md`
### Bugs (SHOW) — all five fixed 2026-08-25, sitting in `review`
P2-01 through P2-05 are built and verified in a browser; they stay `review` until Tobias looks.
Per-ticket detail and root causes are in `TICKETS.md`. The two worth knowing about:

- **P2-01 (pinstripes) was not cosmetic.** Stripes paint on the active window, and HOME and LUFFY could
  never *become* active: `focus()` returned early for both, so clicking them did nothing. They were not
  really windows. Fixed with a `raised` state in `useWindowManager`.
- **P2-04 (mobile) was worse than reported.** LUFFY is top of the stack, and on mobile every window is
  fixed and full bleed, so **the phone site opened on a full screen silent cartoon** covering HOME and
  every icon. LUFFY is desktop scenery now and never opens below 768px.

### Bugs still open
None from Pass 2. New ones go on GitHub Issues, with the record in `TICKETS.md`.

**Issue #1 (fixed, in `review`).** HOME opened inactive on `/`: the default
window order made LUFFY the top of the stack, and the top of that stack is both
the front of the z order and the active window, so the movie held focus on the
one screen everybody lands on. Order is LUFFY, HOME, routed stack now. If you
touch `openWindows` in `src/system/windows.ts`, that ordering is load bearing.

### Enhancements (SHOW / ASK)
- **MSBA window stack tags** — render each course's stack as tag/hashtag/code blocks (like the placeholder
  "your favorite idea" blocks), more scannable than prose.
- **Add `ice.mp4` to a multi-clip LUFFY loop** (B&W). More clips coming; loop should cycle them.
- **Article/typography pass** toward Charlie Dean (the three Cs) — fonts, centered right-sized photos.
- **Explore the Mac OS 9 Figma UI kit** (link below) for authentic chrome/icons.
- **Mac Mini AFK** — set up background jobs (tmux + `claude -p`). Operating principle: **Tobias hooks up
  the machine manually**; the agent proposes exact commands, never autonomously installs/reconfigures.
  See `~/dev/MAC_MINI_HANDOFF.md`.

### Agents to build (context/portfolio/background/scrapers) — ASK to launch
The recurring pattern: **go through a project, review + run the code, pull the stack, and TAKE SCREENSHOTS
(point-and-shoot from localhost) into a labelled folder**, then we talk. Launch list:
1. **Material classifier extractor** (marquee) — `~/dev/nlp-material-classifier`: key lessons, the full
   accuracy table (keyword / TF-IDF / attention-from-scratch / LoRA-Qwen / the deployed CSI model), the
   **eval-harness** story (what V2 is building), and generate the real chart images. It's the spinoff of
   CSI Bid Intelligence — "could I build my own model from scratch and beat it?" Get images.
2. **Resume + About extractor** — read `04_career/00_Resume and Cover Letter/` (final copies) + `pbiq.ai`,
   produce a clean LinkedIn-style About + the HOME **skills / current stack / key projects** snapshot.
   NOT a verbatim resume — the essence.
3. **MSBA extractor** — walk the MSBA folder, list every class taken, rough outline + key topics per
   course. Tobias fills gaps.
4. **Per-project reviewers + screenshot agent** — PB IQ, RoleRadar, 4mativ, Gravl, CSI.APP: run locally,
   screenshot the real UI, save to a labelled folder. Some (iOS) can't run headless.

## Open decisions (need Tobias) — ASK tickets
- **Resume download gate:** how to capture name+email (form service vs small backend vs Google Form).
- **Portfolio cleanup:** confirm remove PickleTrack, dogs-vs-cats, fig-viewer, this-website; keep 4mativ;
  add Gravl.
- **PB IQ:** link `https://www.pbiq.ai/` in + extract photos; one-liner "a pickleball app for players and
  coaches to …".

---

## Reference links
- Charlie Dean's "about this website" (the model): https://charliedean.com/about-this-website
- Gravl: https://gravl-ai.com/
- Pickleball IQ: https://www.pbiq.ai/
- Databricks workspace: https://dbc-8a8f9500-4a79.cloud.databricks.com/ (knigh618@umn.edu)
- Mac OS 9 Figma UI kit: https://www.figma.com/community/file/966779730364082883/mac-os-9-ui-kit

## Rules
Full working rules: **`CLAUDE.md`** (this repo) + **`~/dev/AGENT_RULES.md`** (cross-project). Non-negotiables:
read docs first, no redundant files (check the file map above before creating anything, archive don't
accumulate), TDD, wayfinder + grill (AskUserQuestion often), test-with-Tobias, Matt-Pocock-clean code,
the three Cs, honest measurement, client-data confidentiality.
