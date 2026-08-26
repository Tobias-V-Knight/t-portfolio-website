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
| `assets_src/` | Raw source media | Original videos/photos (gitignored); the converted, served copies live in `public/` |
| `docs/` | Extractor output | Raw material gathered from other repos, one file per project. See its own section below |
| `index.html` | Page shell | Title, description, the Open Graph tags that drive the LinkedIn preview, and the Google Fonts link for Silkscreen and Inter |
| `vite.config.ts` | Build config | Sets the base path from `VITE_BASE`, which is what differs between the custom domain and the github.io preview URL |
| `package.json` | Manifest | React 19, React Router 7, Vite 8, TypeScript. No UI library and no CSS framework |
| `.gitignore` | Ignore list | `node_modules`, `dist`, editor and OS noise |

### `docs/`

| File | What it is | What it does |
|---|---|---|
| `extracted/msba.md` | The MSBA coursework extraction (issue #6) | Every course found in the two iCloud coursework folders: code, name, what the work shows, a 3 to 5 item stack, and the file each fact came from. Four of them are on the site, the rest are staged here. Read it before editing `msba` in `data/content.ts` |

### `src/`

| File | What it is | What it does |
|---|---|---|
| `main.tsx` | Entry point | Mounts the app inside a `BrowserRouter`. Every route renders the same desktop, because the desktop has to survive the navigation |
| `App.tsx` | The desktop | Owns the five desktop icons, builds the menus, renders the open windows, and runs the menu bar clock |
| `scripts/mini-worker.sh` | The Mac Mini worker | Pulls `agent-ready` issues off GitHub, works one per branch, opens a PR, comments on the issue. Never touches main. Run it inside tmux |
| `data/content.ts` | All copy and data | Every word on the site. Split three ways since 2026-08-25: `home` (professional), `about` (the person), `cv` (the record), plus `stack` (the four skill buckets) and `capabilities` (the long form). Placeholder copy is flagged here and the flag renders on screen |
| `system/windows.ts` | Window manager | The window registry and the hook that reconciles open windows with the URL. The routing model is documented in `CLAUDE.md` and in the file itself |
| `components/Window.tsx` | Window chrome | Title bar, close box, pointer dragging, focus and z order. Drag is desktop only |
| `components/MenuBar.tsx` | Menu bar | The menus, including the Go menu, which is the fast path to the work for anyone who does not want to explore |
| `components/Icons.tsx` | Desktop icons | OG-Mac SVGs: folder, document, 3.5" floppy, ridged trash, road, paddle, TV, film (movie), drawn crisp-edged |
| `components/ErrorBoundary.tsx` | Crash guard | Catches a component error and renders a message instead of blanking the whole app |
| `components/VideoJsPlayer.tsx` | Movie player | StrictMode-safe Video.js player used by the LUFFY.MOV window (B&W via CSS). Cycles the `moviePlaylist` clips in order and repeats |
| `windows/Panels.tsx` | Small windows | HOME (professional snapshot + stack rows), ABOUT (the person), CV (capabilities, full skills, history), Contact, Anime, Zippy, the MSBA panel, the Trash Easter egg, the placeholder tag + blank renderer |
| `windows/Work.tsx` | PORTFOLIO window | Finder list view (Name / Date Modified / Kind / Size), one icon row per project; case-study rows open a window |
| `components/ZoomRect.tsx` | The zoom rectangle | The classic Mac open and close animation: an outlined rectangle stepping from an icon out to a window and back. Its effect is mount only, and the comment in it explains why that is load bearing rather than lazy |
| `components/Boot.tsx` | Boot sequence | A full screen ML training run: the import stack, then epochs with a jittering loss, then a prompt that waits for Enter. Plays once per session, skips on any key, homepage only. Never blocks content, because the desktop is already mounted underneath it |
| `windows/Project.tsx` | Project window | The twelve section project template. Sections render only when the data has them, which is how Gravl stays outcome only |
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
| `04_career/05_portfolio_site/2026-08-23_tk-portfolio-handoff_v1.md` (iCloud) | The brief. Constraints, the Gravl stealth posture, the DNS record, and the traps |
| `~/dev/gravl/README.md` | The custom domain writeup. Read before touching DNS |

---

## Current state

Pass 1 is spec phase 1: the desktop, the menu bar, five icons, the intro
window, two project windows, the photo viewer, the mobile adaptation and the
Open Graph card. It exists to validate the aesthetic, not to be the portfolio.

**All copy is placeholder and says so on screen.** The blocker for pass 2 is
content, not design. See the questions at the bottom of `TICKETS.md`.
