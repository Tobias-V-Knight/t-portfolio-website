# TICKETS

**GitHub Issues are the board now** (2026-08-25). This file is the index and the
history, not the queue. Open work lives at
[github.com/Tobias-V-Knight/t-portfolio-website/issues](https://github.com/Tobias-V-Knight/t-portfolio-website/issues).

Two boards holding the same work drift apart within weeks, which is the same
reason HOME and CV render one array rather than two lists. Issues won because
the Mac Mini can read them and cannot read this file's intent.

## How work flows now

```
LAPTOP (Tobias in the loop)     spec, scope, design, docs
        v  gh issue create
GITHUB ISSUES                   the handoff medium
        v  gh issue list --label agent-ready
MAC MINI (AFK)                  pulls, works, opens a PR
        v
LAPTOP                          Tobias reviews and merges
```

Nothing reaches the Mini until it is specced here. A fully specced issue is
safe to hand to a machine; "make the About page better" is not, and the gap
between those two is where AFK agents go wrong.

## Labels

| Label | Means |
|---|---|
| `agent-ready` | Fully specced. The Mini may run it unattended. |
| `needs-spec` | Not ready. Scope it on the laptop first. |
| `blocked-on-t` | Needs a fact, a judgement call or a decision no agent can make. |
| `show` | Visual. Screenshot required in the PR before it closes. |
| `content` | Copy about Tobias. Rule 9: never invent, leave a visible blank. |

## The rule the Mini cannot break

**Branch and PR, never main.** Every issue gets its own branch, a PR, and a
comment on the issue. Tobias reviews and merges. A bad commit on main is live
on the site until somebody notices, and no throughput is worth that.

Modes below predate the labels and still describe the intent behind them.

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
| P1-20 | CSI promoted to flagship, the client project demoted to a row | AFK | done | the client project has no window, no founder title on the homepage, one row and a link |
| P1-36 | Classic Mac zoom rectangle on open and close | SHOW | review | Steps rather than eases, because the original redrew discrete rectangles. Verified in flight: starts at the icon, arrives at the window |
| P1-37 | Screen frame removed, menu bar is the only chrome | AFK | done | The desktop runs edge to edge now |
| P1-38 | Menu bar shows date and time only | AFK | done | SYSTEM ONLINE and the location were decoration, not information |
| P1-39 | Every window carries its icon in the title bar | SHOW | review | Same icon as the desktop, which is what makes an icon feel like the file |
| P1-33 | Boot becomes two stages: train.py in an editor, then the run | SHOW | review | Enter runs the file, Enter again enters the site. The import list stops being green wall and becomes a thing you read |
| P1-34 | HOME sized as a fraction of the viewport, Porsche background | SHOW | review | 66 by 72 percent, capped at 1040x740, so it is large on a laptop and not lost on a 27 inch display |
| P1-35 | Window open and close animation, one window per file | SHOW | review | Verified: three clicks on an icon produce one window, and a closing window stays mounted for its animation before it goes |
| P1-31 | WELCOME becomes HOME: bigger, photo background, four buttons | SHOW | review | The charliedean.com layout T pointed at. PORTFOLIO, BACKGROUND, CONTACT and CV, which is the whole site in one row |
| P1-32 | Person cropped out of the wallpaper, portrait enlarged | AFK | done | Wallpaper cut at 90.5 percent width. Portrait is wider and larger, keeping the blurred person in frame per T |
| P1-27 | Wallpaper, portrait, Zippy, and per project icons | SHOW | review | T's own beach photo as the desktop, his portrait in the welcome window, Zippy as a cutout icon, and a different object for every icon rather than two identical diamonds |
| P1-28 | ANIME and CONTACT windows, welcome window opens centred | SHOW | review | Contact is links only, no form: a static site cannot send mail without a third party |
| P1-29 | About rebuilt: endurance, professional background, education, resume slot | SHOW | review | Resume renders as an unanswered blank until `public/resume.pdf` exists |
| P1-30 | MAKE 28TH SAFE! added as an in progress project | SHOW | review | Official referred to by role only, per T on 2026-08-24 |
| P1-26 | Revert the hero to the full screen terminal boot | AFK | done | T, 2026-08-24. The machine was solving a problem the terminal did not have, and it cost the log its legibility. Header is fixed and only the epochs scroll, so the import stack is still on screen when it settles |
| P1-25 | Landing hero as a real photograph, reverted by P1-26 | SHOW | done | Recoverable from git if the desk scene ever comes back. The three quarters transparent PNG is in the session scratchpad |
| P1-21 | Landing scene: 3D iMac G3, superseded twice | SHOW | done | three.js, procedural geometry, real transmission and a procedural room. Enter pushes the camera through the glass into the desktop |
| P1-22 | The bezel stays around the desktop after entry | SHOW | review | CSS frame with the drive slot and power light. Everything inside is inset by it rather than clipped |
| P1-23 | Mac OS 8 authenticity pass on the inside | SHOW | review | Apple menu, classic scrollbars, zoom box, working grow box |
| P1-24 | Remove the SVG iMac from the desktop | AFK | done | Once you are through the glass you are inside the machine, so a computer on its own desktop reads as a duplicate |
| P1-17 | Desktop icons move to the left to give the CRT the right side | AFK | done | No overlap at 1440px or 390px |

## Pass 2 — 2026-08-24 queue

New work from the 2026-08-24 session. Fresh `P2-` ids so they don't collide with the backlog above;
cross-refs noted where an existing ticket already covers part of it.

**Bugs (SHOW)**
| ID | Item | Detail |
|---|---|---|
| P2-01 | HOME + LUFFY title bars miss the pinstripe lines | **`review` 2026-08-25.** Root cause was deeper than the stripes: pinstripes paint on the active window, and these two could never become active because `focus()` bailed out for them, so clicking them did nothing at all. Added a `raised` state in `useWindowManager`, so both behave like windows and get their stripes when in front. |
| P2-02 | Close All button | **`review` 2026-08-25.** Menu bar item, last position, only rendered when something is open, hidden below 768px (one window on a phone, close box right there). Navigates to `/` rather than clearing the stack, so the URL stays the owner and Back still works. |
| P2-03 | Remove the Photos window | **`review` 2026-08-25.** Icon, window def, title icon and status wiring removed. `windows/Photos.tsx` and the `photos` kind stay in the tree, parked: putting it back is one entry in `windowDefs`. |
| P2-04 | Responsive/resize bug | **`review` 2026-08-25.** Two separate causes. Icons: a wrapping column pinned to the right edge lays its second column further right, i.e. off screen, fixed with `flex-wrap: wrap-reverse`. LUFFY: on mobile every window is fixed and full bleed and LUFFY was top of the stack, so **the phone site opened on a full screen silent cartoon covering HOME and every icon** (worse than the ticket said). It now never opens below 768px, closes on a resize across the breakpoint, and is hidden in CSS as a second lock. |
| P2-05 | Boot: faster typing + Enter-only | **`review` 2026-08-25.** `TYPE_MS` 13→6, `EPOCH_MS` 52→34, `RUN_DELAY_MS` 480→320. Keyboard advance is Enter only (Tab, Cmd or an arrow key used to skip the whole sequence). Tap still advances, since a phone has no key to press. |

**Enhancements (SHOW / ASK)**
| ID | Item | Detail |
|---|---|---|
| P2-06 | MSBA stack tags | **`review` 2026-08-25.** Each course is a header, one line and its stack as chips, reusing `.mac-stack-tag` so the site has one way of saying "built with". Rule 9 bites hardest here: a tag went in only where the repo or handoff says so (6461 and RoleRadar), and the two unwalked courses carry visible blanks instead of plausible guesses. P2-13 fills them. |
| P2-07 | Multi-clip LUFFY loop | **`review` 2026-08-25, issue #3.** The player took one `src` and set `loop: true`; it now takes `sources` and cycles them, wrapping back to the first, so the sequence repeats rather than the clip. The list is `moviePlaylist` in content.ts (`luffy.mp4`, `ice.mp4`), filenames only, and a third clip is one entry plus the file in `public/`. The effect keys off the joined list, not the array identity, so the StrictMode-safe create-and-dispose cycle is untouched. Distinct from B-01 (iMac screen). |
| P2-08 | Typography/article pass toward Charlie Dean | **`review` 2026-08-25.** The real problem was that there was no scale: Silkscreen appeared at 16/15/13/11px and Inter at 17/15/14, each chosen locally. Added seven tokens (`--type-display`, three body, three chrome, plus leadings and `--measure`) and routed **every** declaration in the file through them, except `.mac-editor-body`, which belongs to the boot curtain and is its own system. Also added a 66ch measure to running text, and deleted the dead `.mac-cap-tag*` and `.mac-runs*` rules left behind by P2-17. |
| P2-09 | Explore the Mac OS 9 Figma UI kit | Authentic chrome/icons. Advances B-06 (Susan Kare icons). Link in HANDOFF.md. |
| P2-16 | FOCUS RIGHT NOW snapshot on HOME | **`review` 2026-08-25.** T's call: the verticals belong on HOME, short. Six labels (`focus` in content.ts), no sentences, above the button row. The five long capability blocks stay in BACKGROUND. Two lists that say the same thing in two registers, so **do not let them drift**. |
| P2-17 | HOME / ABOUT / CV three way split | **`review` 2026-08-25.** T's call: HOME is purely professional, ABOUT is the person (Minneapolis, hobbies, endurance, photographs), CV is the record (capabilities long form, full skills, history, the PDF). CV is its own window, its own route `/cv`, its own desktop icon and its own menu title, so a visitor can tell ABOUT and CV apart before clicking. `about` in content.ts split into `home` / `about` / `cv`. |
| P2-18 | The four bucket stack model | **`review` 2026-08-25.** CAPABILITIES / TOOLS / TECHNIQUES / SHIPPING IT, seeded from T's resume screenshot plus the CSI deployment list. SHIPPING exists because nginx, cron, CI/CD, hosted Postgres and hosted Chroma fit none of the other three. One array per group, favourites first: HOME renders `HOME_TAGS` (6) of each with a `+n` count, CV renders all, so the short version cannot drift from the long one. |
| P2-19 | Menu bar overflow at 433px | **`review` 2026-08-25.** Adding the CV title made the bar 474px of content in a 433px window and the clock fell off the edge. Clock split into date + time spans so the narrow rule can drop the date, and title padding tightened below 460px. Every title is a route into the site, so padding gives way before a title does. |
| P2-15 | Contract verticals in BACKGROUND + availability chip | **`review` 2026-08-25.** Five capability blocks in `capabilities` (content.ts), rendered in BACKGROUND above the endurance list, plus the RUNS ON strip and the practice line. Availability chip in HOME opens CONTACT. **Open on T:** the block order (a positioning bet, evaluation currently leads) and the availability line, left as a visible blank in his voice. Related: P2-06 (tag rendering), P2-12 (About extractor overlaps this). |
| P2-10 | Mac Mini AFK setup | tmux + `claude -p`. **T hooks up the machine manually**; agent proposes commands, never auto-installs. See `~/dev/MAC_MINI_HANDOFF.md`. |

**Agents to build, and the open decisions** — moved to GitHub Issues on
2026-08-25 as #4, #5, #6 (extractors) and #7 through #11 (decisions). P2-11
through P2-14 and Q-13 through Q-16 are superseded by those issue numbers. The
rows above stay because they are the record of what was built and why.

## Backlog

Things T has decided he wants but has deliberately parked.

| ID | Item | Mode | Notes |
|---|---|---|---|
| B-01 | What plays on the iMac screen | ASK | T, 2026-08-23: a mix of old PickleTrack clips, product building, and the funnier parts of the MSBA program. All tech and building related. Placeholder NO SIGNAL card until then |
| B-02 | Full case study windows for the projects that are only rows today | ASK | Blocked on Q-01. Each one needs a paragraph from T before it can become a window |
| B-03 | CSI architecture section | ASK | See Q-06. The window exists, the architecture is a blank prompt |
| B-08 | MSBA section: every course, an overview, and T's favourite concepts | ASK | The degree was hard and deserves more than a line on a resume. **Blocked on B-09**: it cannot be written from memory, it has to come from the materials |
| B-09 | Archive every MSBA lecture before university access is revoked | ASK | **This one has a real deadline.** Recordings, slides, notes, syllabi and feedback, per lecture rather than per course. Handoff note and a paste-able prompt for a fresh session live at `00_summer 2026/2026-08-24_tk-msba-archive-handoff_v1.md` in iCloud |
| B-10 | Real PBIQ and CSI app icons | ASK | The icons are hand drawn shapes standing in for the real products. If PBIQ has an app icon, drop the PNG in and it becomes the desktop icon, which is the Charlie Dean move T pointed at |
| B-06 | Susan Kare style icon set | ASK | The icons are the weakest remaining part of the illusion. The reference T sent has hand drawn 32x32 icons and ours are geometric |
| B-07 | Sound: startup chime, window open, click | ASK | Spec section 13. Never autoplay, global mute, and it should reward exploration rather than punish it |
| B-04 | A physical object somewhere on the site | ASK | The iMac is out of the entrance, but the desk scene idea from T's concept note, with the CD and camera as portals, is still a good one for a later phase |
| B-05 | Objects around the iMac as portals: CD for music, camera for photos | ASK | From T's concept note. Strong idea, deliberately deferred until the copy is real, because it multiplies the surface before there is anything behind it |

## Blocked on T, not on code

| ID | Question | Why it matters |
|---|---|---|
| Q-01 | One paragraph per project: what it is, who it is for, what was hard, what happened | Handoff section 6. Content is the blocker for pass 2, not design. Five case studies cannot be invented |
| Q-02 | T-Max has no definition at all. What is it | Spec section 8 literally says TODO |
| Q-03 | ~~Can the CSI work appear on the site~~ | **Answered.** T cleared it on 2026-08-23, and CSI confirmed on 2026-08-24 that he may post the work publicly to get jobs, with no NDA signed. The narrower architecture question that outlived this is Q-06, and ADR-0003 closed that too |
| Q-04 | Real photos, and consent for any face that is not T's | Handoff rule 7. Placeholders are in place until then |
| Q-05 | DNS cutover timing at Namecheap | P1-12 cannot finish without it |
| Q-06 | ~~How much CSI architecture can be published~~ | **Answered by ADR-0003, 2026-08-26, and the diagram shipped with issue #37.** The split is shape and mechanism: the shape is the pipeline every system in the category has and is safe, the mechanism is stage internals, corpus, cost per unit, model choices and method and never ships. The diagram in `components/Diagrams.tsx` is that shape word for word, and the test before adding a label to it is the ADR's, not a design one |
| Q-18 | **Five confirmations on the CSI window, all drafted and none signed off** | The window is `copyState: 'PLACEHOLDER'` until T rules on these. (1) The $22.3M mispricing gap is in PROBLEM as the stake that justifies the system, worded as T's own change log settles it, but it is a named client's money on a public page. (2) EVIDENCE carries a blank asking him to confirm the "up to 19 hours a plan to a 3 minute brief" figure from his own resume; confirmed, it becomes the first line. (3) A second blank asks for any extraction accuracy figure out of the eval harness. (4) ML DECISIONS carries the framing doc's own instruction to re verify the batch saving against a current run before it is published. (5) STACK has a blank asking whether the model vendor may be named: ADR-0003 lists model choices as mechanism, a vendor name is arguably a tool, and that call is his. Team size and his ELP title are a sixth blank, in MY CONTRIBUTION, and the framing doc never answers it either |
| Q-12 | The fifth home button | T listed "contact, portfolio, background, csv, cv". Four are built. "csv" is either a mis-dictation of CV or a fifth thing nobody has identified yet |
| Q-09 | The ten anime | Ten empty slots are sitting in the ANIME window waiting for T. Nobody else can fill these |
| Q-10 | Employer names | **Answered by the extraction, 2026-08-25, issue #5. Needs T's yes, then a wire up ticket.** It is two employers, and the documents call them Accenture and Delivery Associates. "Formative Technologies" is 4MATIV Technologies, which is how 4MATIV sounds spoken aloud. Neither "AC Surety" nor "Formative Technologies" appears anywhere in `04_career`, while 4MATIV and Accenture are in every resume and CV in it. Titles, dates and the sources are in `docs/extracted/career.md`. It stays an identification until T confirms, because there is no document string to match "AC Surety" against |
| Q-11 | LinkedIn URL | The contact window has a dashed placeholder where the link goes |
| Q-08 | Every blank in the copy | Thirteen project articles now exist with every unknown marked as a visible yellow slot. Each one is a question with a specific answer only T has |
| Q-15 | **Can the 4mativ and GED Testing Service work be published, and to what depth** | Both were real client engagements and this repo is public, so `docs/extracted/eda-6411.md` withheld every performance figure for either client and cited the path instead. 4mativ's vendor scores and fleet completion levels, GEDTS's credential rates and its named counties and boroughs. The method, the architecture and the findings stated as relative gaps are all in the file and are safe. This is the same call T made for CSI on 2026-08-23 and it gates most of both case studies. Nothing else in that file can be wired in until he rules |
| Q-13 | Three skills on the public list that no project backs | `CAUSAL INFERENCE`, `DIFFERENCE IN DIFFERENCES` and `EXPERIMENTAL DESIGN` sit in `content.ts` line 663. Issue #47 searched both EDA live cases for them and found nothing: no design, no counterfactual, no test. Both projects go further and explicitly disclaim causation, which is good method and is not evidence of the skill. MSBA 6441 backs all three as coursework at line 558. Leave it, move the three into the coursework section where the evidence is, or go find the 6441 project, which would be a better sixth case study than either of these if it exists |
| Q-14 | T's role on 4mativ | Nothing in the delivered folder attributes a layer, a script or a chart to any individual, and no script header carries an author. Five person team. `role: 'Team project'` is the whole of what the documents support. Contrast the GED case, where an R Markdown header names him outright |
| Q-16 | The GED entry: title, one liner, status, categories, role | `docs/extracted/eda-6411.md` proposes all five with the reasoning and the alternatives. They are facts about his work, so they stay proposals. The entry was deliberately not created |
| Q-17 | 4mativ is named after one of its four layers | Both the slug and the `oneLiner` say anomaly detection. The knowledge transfer document frames the project as telling a broken GPS device apart from a driver who skipped the route, which is better and is what the architecture is actually for. Rename, or widen the copy and leave the slug |
| Q-07 | The category taxonomy is too generous | AI / ML currently returns 10 of 13 projects, so the chip barely filters. the client project, Pickleball IQ and CSI are tagged both product and AI / ML. T should decide whether a project gets one primary category or many |

## Log

Closed tickets keep their row above rather than moving to an archive file. The
board is short by design and a second file would only split the history.

**2026-08-26, issue #37.** CSI in the finished template, and the three template
sections plus the diagram it needed, because #35 and #36 were not on `main` when
this ran. `Project.tsx` gains ML DECISIONS, MY CONTRIBUTION and a collapsed DEEP
DIVE; `components/Diagrams.tsx` is new and holds the ADR-0002 inline SVG.

The two questions that had blocked the window since 2026-08-23 are answered from
`04_career`, not guessed. MY CONTRIBUTION is drawn from
`2026-07-13_CSI_project_resume-framing.md`, which is T's own code grounded
inventory and marks all four systems "T owns end to end"; the team line names
what a teammate and a partner team owned, because a chip has to survive a
reference call. EVIDENCE leads with the deployment on 2026-08-25 rather than a
metric, which is the whole reason the section is not called RESULTS. Where the
July framing doc and the August deployment records disagree, the records win:
"client piloted, ran locally" is the older state.

Every number T's own documents flag as unverified stayed a blank rather than
becoming copy. Four of them, listed in Q-18.

ADR-0003 was applied to the prose and not only to the diagram, and it cut two
things that were written and then removed: a sentence naming where in a plan set
the useful sheet sits, which is a parse stage internal and a directly reusable
one, and a decision headed "batching cut the cost per document", because
ADR-0003 names cost per unit outright. The engineering survives in both cases,
the internal does not. Also left off deliberately: the client's hostnames,
accounts and paths, and the open authentication gap on their network, which is
not a confidentiality question so much as a basic one.

Fixed in passing: `TICKETS.md` had a committed merge conflict between the #46
and #47 log entries, markers and all. Both sides were complete and both are kept.

**2026-08-26, issue #47.** Extractor, both MSBA 6411 live cases in one file,
`docs/extracted/eda-6411.md`. 4mativ GPS fleet analytics, which is already a
`projects` entry with every prose field blank, and the GED Testing Service
segmentation, which is not an entry at all and is why PORTFOLIO lists five case
studies rather than six. `content.ts` untouched and the GED entry deliberately
not created, per the issue: a title and a status are facts about T's work.

The issue asked for an explicit answer on causal inference and the answer is no.
Every `.md`, `.py`, `.R`, `.Rmd`, `.txt`, `.sh` and `.ipynb` file in both project
folders, searched for difference in differences, counterfactual, randomised,
experimental design, instrumental variable, regression discontinuity, treatment
effect and control group. Six hits, none of them a method that was run: three are
the teams stopping to say the finding is associational rather than causal, and
three are the interim GED deck proposing a propensity model and A/B tests as
future work. So `CAUSAL INFERENCE`, `DIFFERENCE IN DIFFERENCES` and
`EXPERIMENTAL DESIGN` are live on the public skills list with nothing but MSBA
6441 coursework behind them. Q-13.

Three things worth carrying forward. **The publishing line is the real finding,
Q-15.** Both of these are real client engagements and this repo is public, so
the file withholds every performance figure for either client and cites the path
instead: 4mativ's vendor scores and fleet completion levels, GEDTS's credential
rates and its named counties. Method, architecture, dataset scale and findings
stated as relative gaps are all in and are safe. It reads better than expected,
because in both projects the strongest beats are judgement rather than numbers:
the 4mativ team found its own headline completion figure was inflated by depot
pings and corrected it downward in front of the client, shipped an unvalidated
on time component at 2% weight with the reason written down, and named the thing
that could invalidate its own detour finding. **T is named on the GED project and
nowhere on 4mativ.** `mar_21_credential_analysis.Rmd` carries
`author: "Tobias Knight"` and it is the logistic regression and weighted prep
score that the whole segmentation runs on, plus the geocoding writeup is in his
first person. The 4mativ folder attributes nothing to anybody, Q-14. **And two
delivered 4mativ handoff documents disagree about the project's headline
number**, two days apart, with the later one and the plan file agreeing against
the earlier one. Anyone reusing the stale file quotes the wrong figure.

No PDF tooling on this machine, so neither final deck was read, nor the client
kickoff, nor the data dictionaries. What the decks say and no markdown repeats is
not in the file, and the file says so.

**2026-08-26, issue #46.** RoleRadar extractor. `docs/extracted/roleradar.md`,
walked read only out of the MSBA 6511 final project folder in iCloud. Nothing is
wired into the site, per the issue: `content.ts` was deliberately not touched.

The finding is the agent architecture itself. RoleRadar builds four AutoGen
objects, a `UserProxyAgent` orchestrator plus JobScraperAgent, FuzzyMatchAgent
and ResumeAnalysisAgent, assembles them into a `GroupChat` with a
`GroupChatManager`, and then never starts a conversation. `self.groupchat` is
assigned once and never read; there is no `initiate_chat` anywhere; and no tool
is registered with any agent, so the system prompts that say "you call the
scrape_company tool" describe a binding that does not exist. What actually runs
is a fixed function pipeline calling deterministic Python, and exactly one agent
reaches a model, through the plain Azure OpenAI SDK rather than through AutoGen.
The code says all of this in its own comments, so it was documented rather than
hidden.

That matters here because RoleRadar is what backs Agent Orchestration and Tool
Calling on the skills list and the AGENTIC WORKFLOWS capability. The honest
framing is a positioning strength, deterministic where determinism is correct
and generative only where judgement is needed, and the extraction argues for
writing it that way rather than for the phrase "multi agent". A technical
interviewer can open the repo and check.

Two lines of current copy do not survive the walk. `content.ts` line 282 says
the matcher scores roles against a profile: it scores titles against thirteen
keywords, and the resume is only used later, per posting, on demand. And Azure
AI Foundry is stubbed, with the project's own README telling users to leave the
connection string blank, so "Azure OpenAI" is the accurate phrase. Also worth
carrying forward: nothing in that project was ever evaluated, no test file, no
gold set, no rating of any model output, which is a sharp contrast to the
material classifier and reads well as a lesson rather than a gap.

Two bugs were found by reading rather than by running, and both are flagged as
unexecuted in the file: the location normaliser matches aliases by substring, so
`"la"` sends Atlanta, Dallas and Portland to Los Angeles and `"uk"` marks
Milwaukee as not US based, which the default US only filter then hides. Same
shape as the silent miss the classifier project built a metric for. Seven open
threads for T at the bottom of the file, including whether the case study may
name his target companies. They are redacted to a count here, because this repo
is public and the list is a live job search.

**2026-08-26, issue #34.** The editorial grid, ADR-0004. A case study was one
column using about two thirds of a 1440px window, which is what made it read as
too long and too empty at the same time. It is a two column grid now: running
text stays capped at `--measure`, and the grid spends the space that cap frees
on the screenshots and the stack instead of widening the prose into it. The hero,
the at a glance panel and the diagrams span both columns.

Three decisions worth carrying forward. **Container queries, not media
queries**: a case study window is resizable, so a layout that asks the viewport
how wide the window is answers confidently and wrongly, and the container is
`.mac-window-body` on project windows only. **The threshold is arithmetic, not
taste**: at 1440 the window is 922px, which leaves the body about 905px, and 66ch
of Inter plus the padding and the gutter leaves a side column near 270px, so 860
is where the second column stops being able to hold a picture. **One flat list,
not two columns of markup**: `Project.tsx` zips a list of text blocks against a
list of side blocks and emits them interleaved, because two container elements
would put every picture below every paragraph on a phone. The flat list collapses
into one column in source order, so narrow reads prose, picture, prose, picture.
That is the "one layout, not two" criterion.

Two things came off the page on the way. `SCREENS` and `STACK` lost their `h2`
headings: the screenshots are captioned figures in the side column now and no
longer form a block for a heading to name, and `STACK` became the chips
ADR-0001 section 9 asks for rather than a line of dot separated prose, which is
readable across a window and unreadable down a 270px rail. Not verified in a
browser, the Mini has no browser tool, so 1900, 1440 and 390 screenshots are
owed on the PR, and the one measurement that matters is a paragraph at 1440 and
at 1900 staying at the measure.

**2026-08-26, issue #33.** At a glance, ADR-0001 section 2, the four cell panel
under the hero. PROBLEM, APPROACH, OUTPUT, EVIDENCE, in that fixed order, drawn
as a table on the window face rather than as chips, because four labelled values
have to line up as a set. It renders on every case study whether the data exists
or not: a cell nobody has written falls back to a prompt in
`atAGlancePrompts` and shows as a yellow blank, since a panel that vanishes when
the data is thin is missing on exactly the pages that need it. Four columns on
desktop, two by two at 768 and below, chosen over stacked because four cells
down a phone is a list and a list is read one item at a time.

CSI is the only project with real content, per the issue, and only two of its
four cells are written. OUTPUT and EVIDENCE stayed blanks on purpose. `built`
already asks what the contractor was handed, so naming a deliverable in OUTPUT
would have contradicted an open question in the same file. And EVIDENCE ran into
something worth carrying forward: the project says `status: 'Delivered'` while
HOME says CSI is being put into production. Those are two different claims about
the same work and only T can say which is true, so the cell asks him. Not
verified in a browser, the Mini has no browser tool, so 1440 and 390 screenshots
are owed on the PR.

**2026-08-26, issue #32.** The case study hero, ADR-0001 section 1. The
metadata was two lines of `mac-meta` prose and is now a chip row in a fixed
order, FOCUS then YEAR then ROLE then STATUS, reusing the toolbox chip so the
site keeps one way of drawing a set of short labels. FOCUS reads the project's
own `categories`, so it inherits Q-07: CSI is tagged both data and AI / ML and
shows two chips today, and the day T rules on one primary category per project
the hero narrows on its own with no code change. The `links` a project already
has became action chips in the hero, and the LINKS section at the foot came out
rather than printing the same two links twice on one page. Not verified in a
browser: this ran on the Mini with no browser tool, so the screenshots at 1440
and 390 that the `show` label requires are still owed on the PR.

**2026-08-25.** Pass 2 bug sweep: P2-01 through P2-05 all in `review`, plus
P2-15 (contract verticals) and P2-16 (the HOME focus snapshot). Verified in a
browser at 1440 and 390, and at 1000x290 for the icon wrap specifically. Two
things worth carrying forward: P2-01 and P2-04 were both reported as cosmetic
and both turned out to be structural, and the P2-04 mobile half was materially
worse than described. Still open on T: the capability order, marked in
`content.ts`.

**2026-08-25, issue #5.** Career extractor. `docs/extracted/career.md` now holds
role, employer, dates and one line per position, each citing its source file,
walked out of the `04_career` folder in iCloud. It answers Q-10 above and fills
every blank in `cv.experience` and `cv.education` on paper. `content.ts` was
deliberately not touched: T reads the extraction first. Two findings beyond the
brief. The CV list is not just blank, it is short, missing the two most recent
employers, Carlson Analytics Lab and Pickleball IQ, which exist on the site as
projects but not as work history. And every source calls the MSBA a candidacy
expected Aug 2026, which the site states flat, so whether it is conferred is now
a live question rather than a formatting one.

**2026-08-25, issue #1.** HOME opened inactive on a cold load. P2-01 gave HOME
and LUFFY the ability to take focus but not the right to start with it: the
default order in `openWindows` was intro, then luffy, then the routed stack,
and the top of that list is both the front of the z order and the active
window, so the movie held focus on `/` and HOME rendered greyed with no
pinstripes. The order is luffy, intro, routed now, and the route effect clears
`raised` whenever a routed window arrives, which also covers the Forward button
and a pasted deep link, neither of which goes through `open` or `focus`. Worth
carrying forward: P2-01 was the second half of this bug and it looked fixed
because it was tested on the screens where a routed window was already open.

**2026-08-25, second pass.** The HOME / ABOUT / CV restructure (P2-17), the four
bucket stack (P2-18) and the menu bar overflow it caused (P2-19). The
availability line is answered and is real copy now. What is still blank and
only T can fill: the ABOUT personal lines (what he likes about Minneapolis, a
hobby that is not endurance sport and not a computer), the photograph
selection, every job title and date in CV, the St Thomas degree, and
`public/resume.pdf` itself.

**2026-08-25, issue #4.** First extractor run. Walked
`~/dev/nlp-material-classifier` read only and wrote
`docs/extracted/nlp-material-classifier.md`, which starts a new folder for
extractor output. Nothing is wired into the site: that is a separate ticket once
T has read it. Three of the five accuracy rows are real numbers from the repo
(keyword 0.308, TF-IDF 0.628, attention 0.396, all on the 331 row gold set) and
three are `[ not recorded ]`, which turned out to be the finding rather than a
gap in the walk. The LoRA adapter exists and has never been scored, and nothing
from that repo is deployed to CSI: `serve.py` is specced in `SPEC.md` and does
not exist, so what runs in CSI production is still the keyword matcher the
project set out to replace. There is also no plotting code in that repo at all,
so the chart list names what produces each number and what still has to be
written to produce each image. Worth carrying forward: the extractor's value was
mostly in what it refused to fill in, and five open threads for T are listed at
the bottom of the file.
