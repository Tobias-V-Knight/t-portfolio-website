# t-portfolio-website

Personal site for Tobias Knight at **tobiasknight.dev**. It presents as a
classic Macintosh desktop: projects, photos and personal artifacts are files on
someone's computer rather than sections of a portfolio.

Static Vite + React + TypeScript, deployed to GitHub Pages.

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
| `TICKETS.md` | The board | Every unit of work, its mode (AFK, SHOW, ASK) and its status. Also the list of what is blocked on T |
| `index.html` | Page shell | Title, description, the Open Graph tags that drive the LinkedIn preview, and the Google Fonts link for Silkscreen and Inter |
| `vite.config.ts` | Build config | Sets the base path from `VITE_BASE`, which is what differs between the custom domain and the github.io preview URL |
| `package.json` | Manifest | React 19, React Router 7, Vite 8, TypeScript. No UI library and no CSS framework |
| `.gitignore` | Ignore list | `node_modules`, `dist`, editor and OS noise |

### `src/`

| File | What it is | What it does |
|---|---|---|
| `main.tsx` | Entry point | Mounts the app inside a `BrowserRouter`. Every route renders the same desktop, because the desktop has to survive the navigation |
| `App.tsx` | The desktop | Owns the five desktop icons, builds the menus, renders the open windows, and runs the menu bar clock |
| `data/content.ts` | All copy and data | Every word on the site, both projects, the about text and the photo manifest. Placeholder copy is flagged here and the flag renders on screen |
| `system/windows.ts` | Window manager | The window registry and the hook that reconciles open windows with the URL. The routing model is documented in `CLAUDE.md` and in the file itself |
| `components/Window.tsx` | Window chrome | Title bar, close box, pointer dragging, focus and z order. Drag is desktop only |
| `components/MenuBar.tsx` | Menu bar | The menus, including the Go menu, which is the fast path to the work for anyone who does not want to explore |
| `components/Icons.tsx` | Desktop icons | Folder, document, application, disk and trash, drawn as crisp edged SVG rather than bitmaps |
| `windows/Panels.tsx` | Small windows | The intro card, the about window, the trash Easter egg, and the placeholder tag component |
| `windows/Panels.tsx` also holds | Small windows | The intro card, about, contact, anime, Zippy, the trash Easter egg, the placeholder tag, and the blank renderer |
| `windows/Work.tsx` | WORK window | Category filter chips and the full project list. Projects with a case study open a window, the rest are rows with a link |
| `components/ZoomRect.tsx` | The zoom rectangle | The classic Mac open and close animation: an outlined rectangle stepping from an icon out to a window and back. Its effect is mount only, and the comment in it explains why that is load bearing rather than lazy |
| `components/Boot.tsx` | Boot sequence | A full screen ML training run: the import stack, then epochs with a jittering loss, then a prompt that waits for Enter. Plays once per session, skips on any key, homepage only. Never blocks content, because the desktop is already mounted underneath it |
| `windows/Project.tsx` | Project window | The twelve section project template. Sections render only when the data has them, which is how Gravl stays outcome only |
| `windows/Photos.tsx` | Photo viewer | Contact sheet, single image view, next and previous, and the byte formatter for the status bar |
| `styles/system.css` | The entire visual language | Palette tokens, bevels, window chrome, menu bar, type scale, focus states, and the mobile layout. Every colour in the codebase comes from here |

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
| `photos/*.JPG` | Placeholder photographs | Eight generated stand ins at mixed resolutions and compression levels. Replaced the day real photos land |

### `scripts/`

| File | What it is | What it does |
|---|---|---|
| `make-placeholders.mjs` | Asset generator | Writes the eight placeholder JPEGs. Dithered, mixed sizes, no dependencies. Delete it when real photographs arrive |

### `.github/workflows/`

| File | What it is | What it does |
|---|---|---|
| `deploy.yml` | Pages deploy | Builds on push to main, copies `index.html` to `404.html` so deep links survive a refresh, and publishes to GitHub Pages |

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
