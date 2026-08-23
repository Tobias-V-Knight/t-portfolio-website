# TICKETS

The board. Nothing gets built that is not a ticket. Opened 2026-08-23.

## Modes

| Mode | Meaning | Closing rule |
|---|---|---|
| **AFK** | Build it and close it alone. No visual judgement, no facts about T, nothing public facing. | Closes itself the moment its acceptance line passes. |
| **SHOW** | Build it alone, but T has to look at it. Anything that changes what the site looks like. | Screenshot goes to T. Stays `review` until T says yes. |
| **ASK** | Cannot start without T. Real copy about T or his projects, DNS, deploy to the live domain, photos of identifiable people. | T answers first, then it becomes AFK or SHOW. |

Status values: `todo`, `doing`, `review`, `done`, `blocked`.

An AFK ticket that turns out to need a judgement call gets promoted to SHOW or
ASK on the spot. Never guess and close.

## Pass 1

Spec section 24 phase 1, plus the Open Graph card the spec omits. Goal is to
validate the aesthetic, not to ship the portfolio. Placeholder copy throughout.

| ID | Ticket | Mode | Status | Acceptance |
|---|---|---|---|---|
| P1-01 | Repo scaffold, Vite React TS, router, three doc files | AFK | done | `npm run dev` serves, `npm run build` passes |
| P1-02 | Theme layer: platinum palette, Silkscreen and Inter, bevel primitives | SHOW | review | Tokens in one file, no hardcoded colours elsewhere |
| P1-03 | Window manager and routing. URL owns the active window | AFK | done | Deep link opens focused window, Back closes top window |
| P1-04 | Window chrome: title bar, close box, drag, focus, z-order | SHOW | review | Drags on desktop, never lands off screen, single click only |
| P1-05 | Menu bar with a working Go menu, clock, system readouts | SHOW | review | Go menu reaches every section in one click |
| P1-06 | Desktop with five icons, selection and open behaviour | SHOW | review | Single click opens, keyboard reachable |
| P1-07 | Intro window, opens on load, placeholder copy | SHOW | review | Marked as placeholder, closes without touching history |
| P1-08 | Project window: Pickleball IQ, full twelve section template | SHOW | review | Editorial inside Mac chrome, Inter body, no pixel font in copy |
| P1-09 | Photo viewer, contact sheet, generated placeholder JPEGs | SHOW | review | Real filenames, sizes and dates. Next and previous work |
| P1-10 | Mobile adaptation at 390px, one window at a time, no drag | SHOW | review | No horizontal scroll, tap targets 44px or larger |
| P1-11 | Open Graph card, 1200x630, looks like the desktop | SHOW | review | Renders in a LinkedIn preview checker |
| P1-12 | Pages deploy: 404.html mirror, build workflow, CNAME held back | ASK | todo | Live on github.io. CNAME only once DNS resolves |
| P1-13 | Accessibility: focus states, keyboard nav, alt text, reduced motion | AFK | done | Tab reaches every control, no motion when reduced |
| P1-14 | Browser verification at 390px and desktop, console clean | AFK | done | Screenshots captured, zero console errors |

## Blocked on T, not on code

| ID | Question | Why it matters |
|---|---|---|
| Q-01 | One paragraph per project: what it is, who it is for, what was hard, what happened | Handoff section 6. Content is the blocker for pass 2, not design. Five case studies cannot be invented |
| Q-02 | T-Max has no definition at all. What is it | Spec section 8 literally says TODO |
| Q-03 | Can the CSI work appear on the site | Built inside a university ELP, IP release still open |
| Q-04 | Real photos, and consent for any face that is not T's | Handoff rule 7. Placeholders are in place until then |
| Q-05 | DNS cutover timing at Namecheap | P1-12 cannot finish without it |

## Log

Closed tickets keep their row above rather than moving to an archive file. The
board is short by design and a second file would only split the history.
