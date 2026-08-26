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
green CI. `main` is at `f0eb74b`, working tree clean.

Static Vite + React + TypeScript. The site is a classic Macintosh desktop.

**What a visitor sees:** a boot sequence typing out a real NLP training script,
then a desktop. HOME is professional only. ABOUT is the person. RESUME is the
record. PORTFOLIO lists five case studies plus an ARCHIVE folder that opens its
own window; every row in both opens, and window depth follows how much material
the entry has.

**CSI is the finished reference case study.** The other four follow its shape.

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

The Mini is `tmaxxx@10.0.11.125`, key auth working, repo cloned at
`~/dev/t-portfolio-website`. Worker is `scripts/mini-worker.sh`, run inside
tmux. **It has no browser**, so anything visual is verified on the laptop.

Setting this up in another repo: `~/dev/REPO_BOOTSTRAP.md`.

## What changed this session

Twenty-one PRs merged. The ones that matter:

**Structure.** HOME / ABOUT / RESUME split three ways (the word CV is gone
everywhere). Skills became two levels: eight discipline groups plus a separate
TOOLBOX. PORTFOLIO curated to five case studies plus an ARCHIVE folder.

**The case study system.** ADR-0001's eleven part template, built across #31 to
#38 and #65. Hero chips, the at a glance panel, the editorial grid, ML
decisions, contribution chips, a collapsed deep dive. **CSI is complete and
live.**

**Content.** Six extractions in `docs/extracted/`, every claim cited by path:
career, MSBA, NLP classifier, PB IQ, RoleRadar, EDA 6411. These are what the
remaining case studies get written from.

**Two employer names on the live site were wrong.** "Formative Technologies"
was 4MATIV Technologies and "AC Surety" was Accenture. Fixed, and the two most
recent roles added.

**A client project was removed entirely**, site and repo, 40 mentions across 9
files. T's call: it should not appear anywhere.

**Infrastructure.** CI on every PR. Branch protection. The domain moved to
Cloudflare and the GitHub Pages machinery is retired.

**Docs.** `CONTEXT.md` (the vocabulary), four ADRs, `docs/agents/` (skill
config). Priority labels P0 to P3 and backlog, with #63 carrying the dependency
order.

## Next, in order

**The two infrastructure tickets are done.** #64 the collision guard and #71 the
split both merged on 2026-08-26. `main` is at `f0eb74b`.

**1. The four case studies. #56, #57, #58, #59.** This is the actual goal. All
`agent-ready`, all following CSI's shape, and after #71 they touch no file in
common, so they can run as one Mini batch. A dry run confirms no collisions.
**#57 ships a blank marquee number unless the LoRA eval runs first.**

**2. Worktrees, for parallel tracks.** Now safe, because collisions are caught
by construction. The worker is a serial `for` loop and a four ticket batch takes
roughly 40 minutes that could be 12. Not yet a ticket.

**3. The visual backlog**, after the content: #62 the oversized team photo, #27
the PORTFOLIO columns, #12 the mobile type overrides, #21 mobile as a designed
thing. #28 and #2 collide with nothing and can ride along in any batch.

#63 carries the dependency order and was rewritten on 2026-08-26. The P0 to P3
labels predate the case study system and are not authoritative.

## Blocked on T, and these gate real work

| | |
|---|---|
| **The LoRA eval** | One run of `src/eval_lora.py` in `~/dev/nlp-material-classifier`. The strongest technical project's marquee row reads `[ not recorded ]`. Best recorded macro F1 on the site is 0.546 |
| **#9** | `public/resume.pdf`. The document a recruiter came for renders as a blank |
| **#7** | Three ABOUT lines. What he likes about Minneapolis, a hobby that is not endurance sport or a computer |
| **#60** | Five field questions before the GED entry can be created. That is why PORTFOLIO shows five case studies, not six |
| **Repo private?** | The client name is scrubbed from the working tree and sits in **15 commits of public history**. One command, and he wanted private anyway |

## Known and deliberately not fixed

- **#62** the team photo renders 756x567 at 1900px and dominates the page.
  Against rule 11, and the photo ordering it belongs to is case study work.
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
