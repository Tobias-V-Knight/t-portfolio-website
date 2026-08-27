# HANDOFF — tobiasknight.dev

**Read this first on any resume.** Rewritten at the end of each session, so it
describes the state now rather than the history.

Read order: `CLAUDE.md`, this file, `README.md` → Taxonomy, `CONTEXT.md`, then
`gh issue list --label P0,P1`. Cross-repo conventions are in
`~/dev/AGENT_RULES.md`, §6 and §7 especially.

Last rewritten **2026-08-26**.

---

## State

**Live at `tobiasknight.dev`**, Cloudflare Workers, deploying on every merge to
`main`. `main` is protected: no direct push from anyone including T, PR plus
green CI. `main` is at `ab5229a`, 64 commits, working tree clean, no open PRs.

Static Vite + React + TypeScript. The site is a classic Macintosh desktop.

**What a visitor sees:** a boot sequence typing out a real NLP training script,
then a desktop. HOME is professional only. ABOUT is the person. RESUME is the
record. PORTFOLIO lists **six case studies** plus an ARCHIVE folder that opens its
own window; every row in both opens, and window depth follows how much material
the entry has.

**All six case studies are written and none is signed off.** CSI, PB IQ, NLP
material classifier, 4MATIV fleet analytics, RoleRadar and GED candidate
segmentation. CSI is the reference for the template's *shape*, not for finished
copy: it renders six blanks, one of which is the flagship's headline number
waiting on T. Every project on the site still carries `copyState: 'PLACEHOLDER'`
and shows the tag. That is #83, and it is a reading job.

## Where the work happens

```
LAPTOP (T in the loop)     spec, grill, decide
        v  gh issue create
GITHUB ISSUES              the board. TICKETS.md is history, not a queue
        v  --label agent-ready
MAC MINI (AFK)             one issue per branch, opens a PR
        v  CI green, a human looks
LAPTOP                     review, merge
```

**The Mini is LAN only and it went unreachable mid session on 2026-08-26**,
when the laptop moved from `10.0.11.x` to `192.168.0.x`. There is no fallback:
the tailnet has two nodes and neither is the Mini, and `mac-mini.local` does not
resolve across subnets. **Run `ipconfig getifaddr en0` before queueing a batch.**
If it does not start `10.0.11`, the worker cannot be reached. #90 fixes it with
one `brew install tailscale` on the Mini.

The Mini is `tmaxxx@10.0.11.125`, key auth working, repo cloned at
`~/dev/t-portfolio-website`. Worker is `scripts/mini-worker.sh`, run inside
tmux. **It has no browser**, so anything visual is verified on the laptop.

Setting this up in another repo: `~/dev/REPO_BOOTSTRAP.md`.

## What changed this session

**Twenty three PRs merged after 20:00.** Three things happened, in this order,
and the order is the point.

**1. The collision guard, #64.** Grilled before building, and the grilling
changed the design three times. #64 contradicted itself: it rejects blocking on
a human merge, then specifies refuse-the-batch, which on that night's queue
would have refused everything. It skips the later ticket instead. `OWNS:` is a
prediction and the incident it was written for was not predicted, so a second
check compares the branch's real files against every open PR. A collided branch
is discarded rather than held, because holding it holds the stale base.
ADR-0005.

**2. #71, which removed most of what the guard arbitrates.** Thirteen projects
became one file each under `data/projects/`, collected by a glob and sorted on
`order`. Diagrams register the same way. Types moved to `data/types.ts`.
`content.ts` re-exports everything, so all seven importers are unchanged.
ADR-0006. **The diagram half was not optional**: `DiagramId` was a closed union
and the registry an object literal, so two case studies would have collided
there instead.

**3. The content, which was the goal.** The Mini worked #56 to #59 in one batch
and **each PR touched exactly one file**, which is ADR-0006 working. #60 was
written on the laptop after the Mini dropped off the network.

**ADR-0007 and its amendment, taken the same night.** Client pages are shape
only, on every client and not just CSI. Then, within the hour, the GED case
tested it: the client is the **source** of data and is not always the
**subject** of the finding. Candidate behaviour ships, the client's own
performance does not. Both readings are in the ADR with the reasoning.

**Corrections.** CSI was documented in two files as having no blanks and renders
six. The 4MATIV slug was renamed to `4mativ-fleet-analytics` hours after going
live, while the cost was one edit rather than a dead link.

## Next, in order

**1. Sign off the copy, #83.** Six case studies are written from cited
extractions and every one of them announces itself as unapproved on the live
site. It is a reading job, not a writing job, and it is the single largest gap
between what the site is and what it looks like.

**2. #90, the Mini's reachability.** One command, and until it is run the AFK
pipeline only works from one network.

**3. The small agent-ready bugs**, which collide with nothing and can ride in
any batch: #85 the menu bar date at 390px, #88 duplicate `order` values, #28 the
zoom box, #2 the inline font size.

**4. Mobile, properly.** Only PB IQ and the GED window have been looked at
below desktop width. #21 is the designed version, #12 the type overrides.

**5. Worktrees.** Safe now that collisions are caught, and still not a ticket.
The worker is a serial `for` loop; the four ticket batch took roughly 40 minutes
that could have been 12.

#63 carries the dependency order. The P0 to P3 labels predate the case study
system and are not authoritative.

## Blocked on T, and these gate real work

| | |
|---|---|
| **The LoRA eval** | One run of `src/eval_lora.py` in `~/dev/nlp-material-classifier`. The strongest technical project's marquee row reads `[ not recorded ]`. Best recorded macro F1 on the site is 0.546 |
| **#9** | `public/resume.pdf`. The document a recruiter came for renders as a blank |
| **#7** | Three ABOUT lines. What he likes about Minneapolis, a hobby that is not endurance sport or a computer |
| **#83** | Read the six case study windows and sign each one off, or say what has to change. Until then every project on the live site shows the PLACEHOLDER COPY tag, including the ones written from cited sources |
| **CSI's headline** | `[ Your resume says bid review went from up to 19 hours a plan to a 3 minute brief. Confirm it and it becomes the first line here. ]` It is the flagship's strongest claim and it sat inside a window two documents called finished |
| **Repo private?** | The client name is scrubbed from the working tree and sits in **15 commits of public history**. One command, and he wanted private anyway |

## Known and deliberately not fixed

- **#62** the team photo renders 756x567 at 1900px and dominates the page.
  Against rule 11, and the photo ordering it belongs to is case study work.
- **The post flight half of the collision guard has never fired for real.** It
  did not need to: ADR-0006 removed the contention before it could. Its join
  logic was tested in isolation and one bug was already found and fixed in it,
  #81, where `git diff` could not see a file that did not exist yet.
- **#43** a deep link to `/work/archive` opens the folder with no PORTFOLIO
  behind it. The routing model maps one URL to one window and a nested folder
  is the first thing wanting two.
- **Three skills have nothing on the site backing them.** `CAUSAL INFERENCE`,
  `DIFFERENCE IN DIFFERENCES` and `EXPERIMENTAL DESIGN`. An extraction searched
  both EDA 6411 projects for eleven related terms: six hits, none a method that
  was run. T's call: leave them, the site need not evidence every skill.
- **Mobile is on the backlog.** T 2026-08-26: it is fine, it is a resize job,
  the Mac OS 8 feel stays.

## Two rules that cost time to learn

**The knowledge base is in iCloud, the code is in `~/dev`.** An extraction
ticket names both or gets half an answer. `04_career` in particular holds T
describing his own work, and it answered a question that had blocked a ticket
for a day.

**Git history is evidence of presence, never of absence.** A ticket once told
an agent to settle who built what on a joint venture from commit counts. Two of
three repos belong to the co-founder and T had done substantial work offline.
The counts understated him, and that run was killed before it published.
