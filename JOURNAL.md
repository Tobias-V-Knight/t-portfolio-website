# Build Journal — tobiasknight.dev

A running log of decisions, findings and reversals. **Append dated entries at
the bottom.** Keep the arc at the top current.

Written to double as the source for a case study about the site itself, and as
the record of *why* things are the way they are. `HANDOFF.md` says what the
state is; this says how it got there. When they disagree, HANDOFF is current
and this is history.

---

## One line story

A portfolio that presents as a classic Macintosh desktop, built almost entirely
by agents working from GitHub issues, with a human doing the judgement and a
Mac Mini doing the typing.

## The arc

1. **A desktop, not a page.** Projects as files on someone's computer.
2. **Placeholder discipline.** Unfinished copy renders as a visible blank, so it
   cannot quietly ship. This turned out to matter more than any feature.
3. **The AFK pipeline.** Issues as the handoff medium, a worker on the Mini,
   branch and PR, CI as the gate.
4. **Extraction before writing.** Six walks over repos and iCloud produced cited
   material, which is what made the case studies writable at all.
5. **The template.** Eleven parts, at a glance as the centrepiece, evidence
   rather than results.

---

## 2026-08-25: the pipeline gets built, and mostly fails

The night's real work was infrastructure, and almost all of it broke first.

**Three variants of one failure.** An agent asked to do something its
environment forbids. `--permission-mode acceptEdits` accepts file edits and
still gates Bash, so the agent edited correctly and could not build or commit.
A `.claude/settings.json` allowlist did not help, because headless mode does
not load project settings for an untrusted directory. The Mini's GitHub token
was fine grained: it cloned happily and 403'd on the first write.

**The fix was structural, not incremental.** Stop negotiating with the sandbox.
The agent edits files, which it can always do. The script builds, commits,
pushes and opens the PR, because it has a shell that works.

**Then my own bug.** The worker pointed git at `COMMIT_MSG.md`, deleted the file
to keep it out of the commit, and asked git to read the message from the path
it had just removed. `set -e` killed the batch. The agent's reasoning was
destroyed by the thing meant to preserve it.

**Lesson.** Scaffolding is where AFK pipelines break, not the model. Scaffolding
bugs are quiet, because the agent politely reports what happened and moves on.

**Also shipped:** the site went live on Cloudflare at `tobiasknight.dev`, and an
unsupported F1 of 0.914 reached production within a minute of being written,
which is the argument for the branch protection added the next day.

## 2026-08-26: content, and two corrections that mattered

**Branch protection and CI.** `main` protected for everyone including T. The
agent already could not reach `main`; the hole was the human.

**Six extractions.** Career, MSBA, NLP classifier, PB IQ, RoleRadar, EDA 6411.
Every claim cited by path, every unrecorded figure written `[ not recorded ]`
rather than reconstructed.

**Two employer names on the live site were wrong.** "Formative Technologies"
was 4MATIV Technologies; "AC Surety" was Accenture. Both had been live. The
career extraction found it by noticing neither string appears in any career
document while both real names appear in all four.

**The PB IQ correction, and it is the one worth remembering.** A ticket told an
agent to check T's resume line against commit authorship and "report plainly"
if the work belonged to someone else. Two of three repos belong to his
co-founder and carry none of his commits. He had done substantial iOS work
offline. The instruction was pointed at one conclusion, and the metric could
only ever move one direction: commits can prove you did something and can never
prove you did not. **The run was killed before it published.** Rule written
into `docs/agents/issue-tracker.md`: git history is evidence of presence, never
of absence.

**The knowledge base rule, learned the same way.** An extraction ticket named
`~/dev/pbiq` and missed `PBIQ/` in iCloud entirely, including a worklog and a
file of T's own resume bullets. Code says what was built; the knowledge base
says why and what he thinks he did. A ticket names both or gets half an answer.

**Two reversals, same cause.** An archived project row was built as an inert
`div` so it would not look like a broken button. T: it should still open. The
observation was right and the conclusion backwards, because a Finder list
promises every row opens. Earlier the same day, the archive was a divider until
T said folder, which is the Finder's own idiom for "these exist and are not the
point". Both times the metaphor already had the answer and the implementation
argued with it.

**A client project was removed entirely.** Removing the row was the small half:
the repo is public and the name appeared 40 times across 9 files, including a
CLAUDE.md section enumerating exactly what had been withheld from the company's
own site. Written to protect them, that list read as a roadmap.

**Two green PRs that could not both merge.** #34 and #37 ran back to back and
both rewrote `Project.tsx`. The worker pulls fresh `main` before each ticket,
but merging is human gated, so ticket two branched from a `main` without ticket
one. Serial execution does not prevent this; it only makes it slower to
discover. Re-running #37 on the merged grid produced a better result than any
hand resolution would have.

**CSI shipped as the reference case study**, and it is the first window on the
site with no blanks in it.

**Scoreboard, end of day.** 48 commits on `main`. 21 PRs merged. 12 tickets
worked by the Mini, 11 shipped. Six extractions. One P0 open: the collision
guard.

## 2026-08-26, later: the guard, and removing the thing it guards

**Grilled #64 before building it, and the grilling changed the design three
times.**

The sharpest finding was that #64 contradicted itself. It rejects "wait for the
merge before the next ticket" because an overnight batch would complete one
ticket, then specifies refuse-the-batch, which on the very next queue does
exactly that: all four case studies claim `content.ts`, so the batch is refused
and the two tickets that collide with nothing do not run either. The guard's
first act would have been to stop the work it exists to protect. It skips the
later ticket instead.

**`OWNS:` alone is not enough, and the incident proves it.** #37 rewrote
`Project.tsx` while being titled "CSI as the reference case study", so its
honest declaration would have read `content.ts` and the guard would have waved
it through. A declaration catches what somebody anticipated. The real diff,
checked against every open PR before one is opened, catches what nobody did, and
catches collisions with PRs left open by an earlier run of the script, which a
per invocation scan structurally cannot.

**A collided branch is discarded, not held.** Holding the branch holds the stale
base with it, so merging it later reintroduces the same problem. Re-running is
the only thing that resolves it, and re-running #37 that way is what produced
the better result earlier in the day.

**Then the better move, which was not to arbitrate the contention at all.** The
four case studies collide only because every word on the site lived in one 1091
line file. Thirteen projects are now one file each, collected by a glob and
sorted on `order`. Order lives on the project rather than in an index listing
every slug, because that index would be a file every case study ticket edits,
which is the thing being removed.

**The diagram half was the part worth catching.** `DiagramId` was a closed union
and the registry was one object literal, so NLP and RoleRadar would both have
edited both lines and the four would still have been serialised. A split that
stops at the copy buys less than it looks. Diagrams now register by existing as
a file.

Both landed. A dry run over #56 to #59 now reports no collisions, where the same
four tickets an hour earlier produced three skips.

**Also found: #36 had been done for hours and was still open and still
`agent-ready`.** `csi-shape` shipped inside #65. An unchanged worker run would
have handed a finished ticket to an agent. A ticket that ships inside another
ticket's PR does not close itself.

## 2026-08-26, night: four case studies, and a rule that had quietly forked

The Mini worked #56 to #59 in one batch. **Four tickets, four PRs, each touching
exactly one file**, which is ADR-0006 doing the job it was written for. The same
four an hour earlier would have produced one mergeable PR.

**The NLP page refused the number that caused all of this.** An unsupported F1
of 0.914 reached the live site on 2026-08-25 and is the reason `main` is
protected. Writing the NLP case study, the agent found it in the boot sequence,
identified it as set dressing per CONTEXT.md, and left a comment saying it must
never be borrowed to fill the empty LoRA row. Every other figure on that page
traces to the extraction.

**Then the one that had to stop.** The 4MATIV page was written from
`docs/extracted/eda-6411.md`, which sets its own publishing rule: method,
parameters, dataset scale and relative deltas may ship, performance levels and
per vendor scores may not. The page followed it exactly and published corpus
counts, polling intervals, DBSCAN and geofence radii, an outlier threshold and
every scoring weight.

`CLAUDE.md` and ADR-0003 say something stricter about client work, and say it
generally: mechanism, defined there as stage internals, corpus size, model
details and method, never ships. **Two documents had forked, and nobody noticed
until a page was written from the wrong one.** The extraction's rule was written
to protect performance figures and quietly became a ruling on mechanism.

T took the stricter rule. ADR-0007 makes it general rather than CSI specific,
and #60, the GED case study, is the other client in the same extraction and now
inherits it.

**What the cut cost was almost nothing, which is the finding.** Out went the
radii, the thresholds and the weights. What stayed was three models chosen for
three different reasons, the two stop identifiers of which only one is a place,
and a finding published with the caveat that could invalidate it. The
parameters were the least persuasive part of the page and the only part that
carried a confidentiality cost.

**The agent had already flagged it.** Its `constraint` field named Q-15 and said
the clearance question was unanswered. Contribution stayed a blank because
nothing in the delivered folder attributes a layer to a person. The GitHub link
stayed a blank asking whether a public repo of a client pipeline should exist.
Placeholder discipline is what made the problem visible rather than shipped.

**Scoreboard.** Five case studies live. Six PRs merged tonight, plus the two
infrastructure ones. Board at 18.

## 2026-08-26, correction: CSI was never blank free

The entry above says CSI is "the first window on the site with no blanks in it".
It is not, and it never was. A census on the same night found six rendered
blanks in it, including `[ Your resume says bid review went from up to 19 hours
a plan to a 3 minute brief. Confirm it and it becomes the first line here. ]`,
which is the flagship's headline number.

Left in place above rather than edited, because this file is append only and a
wrong entry with a correction under it is more useful than a quietly fixed one.

**The cost is the lesson, not the error.** `HANDOFF.md` repeated the claim as
"complete and live", and a blocker inside something two documents call finished
is a blocker nobody goes looking for. The number sat there through a full
session of work that never opened the file.

A window is finished when it renders no blanks and a person has signed off the
copy. Nothing on this site meets that yet: all thirteen projects still carry
`copyState: 'PLACEHOLDER'`, which is #83.

## 2026-08-26, late: the sixth window, and a rule that forked twice in one night

**The Mini worked #56 to #59 in one batch and every PR touched exactly one
file.** That is the whole return on ADR-0006 in one line: the same four tickets
that morning would have produced one mergeable PR and three wasted runs.

**Two documents had forked, and it took writing a page to find out.** The
4MATIV case study was written from `docs/extracted/eda-6411.md`, which sets its
own publishing rule allowing method, parameters, dataset scale and relative
deltas. `CLAUDE.md` and ADR-0003 say a client's mechanism never ships and name
corpus size and model details explicitly. The page followed the extraction
exactly and published radii, thresholds and every scoring weight. The
extraction's rule had been written to protect performance figures and had
quietly become a ruling on mechanism that nobody had taken.

T took the stricter rule and ADR-0007 made it general. **The cut cost almost
nothing, which is the finding.** Out went the parameters. What stayed was three
models chosen for three different reasons, the two stop identifiers of which
only one is a place, and a finding published with the caveat that could
invalidate it. The parameters were the least persuasive part of the page and the
only part carrying a confidentiality cost.

**Then the same ADR broke the next case study, within the hour.** GED's findings
are about three hundred thousand adult learners. GED Testing Service supplied
the data and is not what the findings are about. Reading ADR-0007 as written
would have withheld a result about adult education because of who owned the
spreadsheet, and would have shipped a case study whose EVIDENCE section was a
blank by construction. The amendment is the distinction: **the client is the
source, and is not always the subject.** A rule written for one client and
tested against a second within the hour is a rule that got cheap early.

**Placeholder discipline is what made all of this visible.** The 4MATIV page
flagged its own clearance question in a `constraint` field, left contribution a
blank because nothing attributed a layer to a person, and left the repo link a
blank asking whether a public repo of client code should exist. None of that was
prompted. An agent that invents is a problem you find in an interview; an agent
that blanks is a problem you find in a diff.

**A census found the thing nobody had looked for.** All thirteen projects carry
`copyState: 'PLACEHOLDER'`, so the site shows six sourced case studies while
announcing that none are approved. Underneath it, CSI renders six blanks and two
documents called it finished, one of them saying "the first window on the site
with no blanks in it". **The cost of that error is the lesson: a blocker inside
something described as complete is a blocker nobody goes looking for.** The
flagship's headline claim, 19 hours of bid review down to a 3 minute brief, had
been sitting unconfirmed inside it through a full session that never opened the
file.

**Two bugs in tonight's own work.** The collision guard read `git diff
--name-only main`, which sees tracked changes only, so a ticket that adds a file
passed with an empty file list. Since ADR-0006 that is the normal shape of a
case study ticket. And nothing stops two projects sharing an `order` value: the
GED entry nearly shipped at 50, which `pickletrack` holds, and the tie would
have resolved by glob order and been quietly wrong.

**The pipeline went down at the end and it is worth writing down why.** The
laptop changed subnet, the Mini answers on one LAN only, and there is no
fallback: the tailnet has two nodes and neither is the Mini. It failed as a bare
`ssh` timeout, which looks exactly like a sleeping machine. An AFK pipeline that
requires the human to be on one specific network is not AFK, and the fix is one
`brew install` that has never been run.

**Scoreboard.** 64 commits. Six case studies written, none signed off. Twenty
three PRs merged after 20:00. Three ADRs, 0005 to 0007, plus one amendment.
Board at 22.
