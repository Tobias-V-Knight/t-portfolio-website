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
| P1-15 | WORK window: category chips, every project as a row | SHOW | review | Chips filter, status bar counts, rows without a case study are not links |
| P1-16 | iMac G3 on the desktop, Blueberry, drawn in SVG | SHOW | review | Sits behind windows, takes no clicks, moves to the bottom of the column on mobile. Replaced the CRT on T's call |
| P1-18 | Boot sequence, ML training run, once per session, skippable | SHOW | review | Verified: renders, sets the session flag, and a keypress skips it while the timer still had minutes left |
| P1-19 | First pass copy for all thirteen projects | SHOW | review | Structure from the real repos, every unknown left as a visible blank |
| P1-20 | CSI promoted to flagship, Gravl demoted to a row | AFK | done | Gravl has no window, no founder title on the homepage, one row and a link |
| P1-21 | Landing scene: real 3D iMac G3, boot log on its own screen | SHOW | review | three.js, procedural geometry, real transmission and a procedural room. Enter pushes the camera through the glass into the desktop |
| P1-22 | The bezel stays around the desktop after entry | SHOW | review | CSS frame with the drive slot and power light. Everything inside is inset by it rather than clipped |
| P1-23 | Mac OS 8 authenticity pass on the inside | SHOW | review | Apple menu, classic scrollbars, zoom box, working grow box |
| P1-24 | Remove the SVG iMac from the desktop | AFK | done | Once you are through the glass you are inside the machine, so a computer on its own desktop reads as a duplicate |
| P1-17 | Desktop icons move to the left to give the CRT the right side | AFK | done | No overlap at 1440px or 390px |

## Backlog

Things T has decided he wants but has deliberately parked.

| ID | Item | Mode | Notes |
|---|---|---|---|
| B-01 | What plays on the iMac screen | ASK | T, 2026-08-23: a mix of old PickleTrack clips, product building, and the funnier parts of the MSBA program. All tech and building related. Placeholder NO SIGNAL card until then |
| B-02 | Full case study windows for the projects that are only rows today | ASK | Blocked on Q-01. Each one needs a paragraph from T before it can become a window |
| B-03 | CSI architecture section | ASK | See Q-06. The window exists, the architecture is a blank prompt |
| B-06 | Susan Kare style icon set | ASK | The icons are the weakest remaining part of the illusion. The reference T sent has hand drawn 32x32 icons and ours are geometric |
| B-07 | Sound: startup chime, window open, click | ASK | Spec section 13. Never autoplay, global mute, and it should reward exploration rather than punish it |
| B-04 | Upgrade the iMac to a pre-rendered rotation sequence | ASK | Only if the SVG does not carry enough weight. Real 3D via Three.js was considered and rejected for bundle size, model licensing and mobile performance, all of which fight spec section 19 |
| B-05 | Objects around the iMac as portals: CD for music, camera for photos | ASK | From T's concept note. Strong idea, deliberately deferred until the copy is real, because it multiplies the surface before there is anything behind it |

## Blocked on T, not on code

| ID | Question | Why it matters |
|---|---|---|
| Q-01 | One paragraph per project: what it is, who it is for, what was hard, what happened | Handoff section 6. Content is the blocker for pass 2, not design. Five case studies cannot be invented |
| Q-02 | T-Max has no definition at all. What is it | Spec section 8 literally says TODO |
| Q-03 | Can the CSI work appear on the site | Built inside a university ELP, IP release still open |
| Q-04 | Real photos, and consent for any face that is not T's | Handoff rule 7. Placeholders are in place until then |
| Q-05 | DNS cutover timing at Namecheap | P1-12 cannot finish without it |
| Q-06 | How much CSI architecture can be published | T cleared CSI for the site on 2026-08-23, overriding the handoff hold, on the condition it shows what was built and not the code. Open question is narrower: CSI is bid intelligence for paving contractors and Gravl is pre bid intelligence for construction, so a detailed CSI architecture may describe Gravl's mechanism by proxy. The section stays empty until T rules |
| Q-08 | Every blank in the copy | Thirteen project articles now exist with every unknown marked as a visible yellow slot. Each one is a question with a specific answer only T has |
| Q-07 | The category taxonomy is too generous | AI / ML currently returns 10 of 13 projects, so the chip barely filters. Gravl, Pickleball IQ and CSI are tagged both product and AI / ML. T should decide whether a project gets one primary category or many |

## Log

Closed tickets keep their row above rather than moving to an archive file. The
board is short by design and a second file would only split the history.
