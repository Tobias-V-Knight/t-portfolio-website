# CLAUDE.md

Working rules for this repo. Read before touching anything.

## What this is

Personal portfolio site for Tobias Knight at `tobiasknight.dev`. Static Vite +
React, deployed to GitHub Pages. The site presents as a classic Macintosh
desktop: projects, photos, music and personal artifacts live on it as files.

## Source of truth

The design spec is **not in this repo**. It lives in iCloud and is not
duplicated here:

```
/Users/t/Library/Mobile Documents/com~apple~CloudDocs/00 MSBA + Coding/04_career/05_portfolio_site/
  2026-08-23_tk-portfolio-spec_v1.md      the design document, 1070 lines, read first
  2026-08-23_tk-portfolio-handoff_v1.md   the brief, constraints and traps
```

Two lines from the spec are load bearing and everything follows from them:

* **Spec section 4.** Desktop simulates a computer. Mobile simulates the software.
* **Spec section 7.** Homepage is world-building. Project pages are communication.

Spec section 25 is the filter for every feature, including your own ideas:
does this make the site feel more like an interesting person's old computer, or
does it just make the interface more complicated?

## Decisions already taken. Do not reopen.

| Decision | Value | Where it came from |
|---|---|---|
| Stack | Vite + React + TypeScript, static output | handoff, confirmed |
| Deploy | GitHub Pages, custom domain `tobiasknight.dev` | handoff section 10 |
| Repo | `~/dev/t-portfolio-website`, never iCloud | T, 2026-08-23 |
| Aesthetic | Classic Mac as specced. Y2K stays about 10 percent | T, 2026-08-23 |
| Routing | URL owns the active window. See below | T, 2026-08-23 |
| Fonts | Silkscreen for chrome, Inter for body | T, 2026-08-23 |
| Pass 1 scope | Spec phase 1 plus the Open Graph card | T, 2026-08-23 |
| First project window | Pickleball IQ | T, 2026-08-23 |

## The routing model

Every routed window has a URL. The set of open windows is a stack in React
state. The URL always points at the window on top of that stack.

* Opening a window calls `navigate(route)`, which pushes onto the stack.
* Closing the top window calls `navigate(-1)`.
* The browser Back button pops the stack, so Back closes the top window.
* Landing on `/projects/pickleball-iq` renders the whole desktop with that
  window already open and focused.
* Window positions and z-order live in memory only, never in the URL.
* The intro window is not routed. It opens on load and closes without
  touching history.

Retrofitting routing into a window manager is a rewrite. This model is settled.

## Gravl constraint. Not negotiable without T saying so.

The Gravl window is **outcome only**. What it is, who it serves, what changed,
screenshots of gravl-ai.com, and a link out.

Never publish on this site: architecture, pipeline stages, corpus size, unit
or marginal compute cost, model details, the five work product method, the
phase and gate table, or the pit and haul insight. All of that was
deliberately removed from the company site over 2026-08-20 and 21. A personal
site is exactly where competitors look for what the company site withholds.

Every other project on this site can be as technically open as T likes.

## Rules for working

1. **No dashes in prose.** Not in this repo's docs, not in site copy, not in
   messages to T. Use commas, colons and full stops.
2. **Do not create files casually.** Before adding one, check whether it
   belongs in a file that already exists. Archive, reduce and consolidate
   first. Every file that exists is listed in the taxonomy in `README.md`.
3. **Update the taxonomy in `README.md`** whenever you add, remove or
   repurpose a file. It is the index, it is not optional, and it goes stale
   fast if you skip it.
4. **Work through `TICKETS.md`.** Nothing gets built that is not a ticket.
   Tickets marked AFK close themselves. Tickets marked HITL stop and ask T.
5. **Show, do not describe.** Anything visual gets a screenshot before it is
   called done. On the Gravl build T caught a slider whose headline number
   never moved and a timeline broken by a CSS name collision. Neither was
   found by reading code.
6. **Verify in a browser.** Load it, screenshot it, check the console. Test at
   390px as well as desktop. The mobile specification is as demanding as the
   desktop one.
7. **Edit with literal replacements that you assert match exactly once.**
   Never compute string bounds by index arithmetic.
8. **Grep before naming a CSS class.**
9. **Never invent facts about T or his projects.** Placeholder copy is fine
   and must be visibly marked as placeholder. Invented specifics are not.
10. **Photographs of identifiable people need T's explicit yes** before they
    go on the internet.

## Traps that already bit this stack

* Client side routing on GitHub Pages needs `public/404.html` mirroring
  `index.html`, or every deep link 404s on refresh.
* A custom domain needs `public/CNAME`. Vite will not create it.
* Ship the `CNAME` file only once DNS resolves. Pages redirects the working
  `github.io` URL the moment it sees that file. This took gravl-ai.com down
  for two minutes on 2026-08-21. The full record is in `~/dev/gravl/README.md`
  under *The custom domain*.
* Chicago and Geneva are Apple typefaces and cannot be redistributed. Silkscreen
  is the licensed substitute in use here.
* Pixel fonts never set long-form copy. Bitmap for chrome, labels, filenames
  and status readouts. Inter for anything anyone actually reads.
