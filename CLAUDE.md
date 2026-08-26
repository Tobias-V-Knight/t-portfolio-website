# CLAUDE.md

Working rules for this repo. Read before touching anything.

## What this is

Personal portfolio site for Tobias Knight at `tobiasknight.dev`. Static Vite +
React, deployed to Cloudflare. The site presents as a classic Macintosh
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
| Deploy | **Cloudflare Workers**, custom domain `tobiasknight.dev`, live 2026-08-25 | T, superseding the GitHub Pages plan |
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

## CSI, and the override T made on 2026-08-23

The handoff says do not write a word about the CSI work until the university
IP release lands. **T overrode that on 2026-08-23 and cleared CSI for the
site**, framed as: the highway contractor, what was built, the architecture,
and never the code.

**Further cleared 2026-08-24.** CSI told T he may post the work publicly to get
jobs, no NDA was signed, and the Gravl code is a clean room. So CSI and Gravl
work can be featured by outcome and role. The Gravl constraint below still
stands, to protect the company from competitors reading its internals here.

One narrower question is still open and the CSI architecture section stays
empty until T answers it. CSI is bid intelligence for asphalt paving
contractors. Gravl is pre bid intelligence for construction. A detailed CSI
system description is adjacent enough that it may describe Gravl's mechanism
by proxy, which is the exact thing the Gravl constraint below exists to
prevent. Tracked as Q-06 in `TICKETS.md`.

## Gravl constraint. Not negotiable without T saying so.

The Gravl window is **outcome only**. What it is, who it serves, what changed,
screenshots of gravl-ai.com, and a link out.

Never publish on this site: architecture, pipeline stages, corpus size, unit
or marginal compute cost, model details, the five work product method, the
phase and gate table, or the pit and haul insight. All of that was
deliberately removed from the company site over 2026-08-20 and 21. A personal
site is exactly where competitors look for what the company site withholds.

Every other project on this site can be as technically open as T likes.

## How work reaches the live site (2026-08-26)

**`main` is production.** Cloudflare deploys it within a minute of a merge.
`main` is protected: no direct pushes from anyone, including Tobias and
including any agent. Every change goes branch, PR, green CI, merge.

```
feat/<issue>-<slug>   or   issue-<n> from the Mac Mini worker
        v  PR
CI: npm ci, tsc -b --noEmit, npm run build     must be green
        v  merge
main  ->  tobiasknight.dev
```

This exists because it did not, and on 2026-08-25 an unsupported number reached
the live site inside a minute of being written. The protection is not about
distrusting the agent, which already could not touch `main`. It is about the
fact that the human had no gate at all.

* CI is `.github/workflows/ci.yml`. The required check is the `verify` job.
* Reviews are not required, so a solo PR can be merged by its author. The gate
  is CI, not a second pair of eyes that does not exist.
* Cloudflare builds non production branches too, so **every PR has a live
  preview URL**. That is how a `show` labelled ticket gets looked at.

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
   Never compute string bounds by index arithmetic. And never open a file for
   writing until the replacement string is fully built and verified: opening
   for write truncates immediately, so a script that throws between the open
   and the write leaves an empty file. That happened to `system.css` on
   2026-08-23 and hot reload wiped the browser's copy before it could be
   recovered. Build the new content first, assert it, then write.
8. **Grep before naming a CSS class.**
9. **Never invent facts about T or his projects.** Placeholder copy is fine
   and must be visibly marked as placeholder. Invented specifics are not.
10. **Photographs of identifiable people need T's explicit yes** before they
    go on the internet.
11. **The three Cs: continuity, consistency, conciseness** (added 2026-08-24).
    The visual north star. Charlie Dean's site is the reference: natural
    editorial colours, photos centred and right sized (never overwhelming), one
    consistent font system, concise prose. Judge every visual choice against these.
12. **Read `HANDOFF.md` right after this file.** Cross-project agent rules live
    in `~/dev/AGENT_RULES.md`. The full file index is the taxonomy in `README.md`.

## Traps that already bit this stack

* **The two Pages traps below no longer apply to this repo** (Cloudflare since
  2026-08-25) and are kept because Gravl is still on GitHub Pages and will hit
  them during its own migration.
  * Client side routing on GitHub Pages needs `public/404.html` mirroring
    `index.html`, or every deep link 404s on refresh. Cloudflare solves this
    properly with `not_found_handling = "single-page-application"` in
    `wrangler.toml`, so no mirror file is needed here.
  * A custom domain on Pages needs `public/CNAME`, and shipping that file
    before DNS resolves redirects the working `github.io` URL at once. This
    took gravl-ai.com down for two minutes on 2026-08-21. The full record is in
    `~/dev/gravl/README.md` under *The custom domain*.
* **Cloudflare refuses to overwrite existing DNS records** when you attach a
  custom domain to a Worker. The imported registrar records (a parking A record
  and a `www` CNAME) have to be deleted by hand first, or the dialog just
  errors. Leaving the stale proxied A record in place is what produced a 522 on
  2026-08-25: Cloudflare was fine, the origin it pointed at was dead.
* Chicago and Geneva are Apple typefaces and cannot be redistributed. Silkscreen
  is the licensed substitute in use here.
* Pixel fonts never set long-form copy. Bitmap for chrome, labels, filenames
  and status readouts. Inter for anything anyone actually reads.
