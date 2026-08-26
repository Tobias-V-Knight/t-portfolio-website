# 0005. The worker guards collisions in two places, and skips rather than refuses

Date: 2026-08-26
Status: accepted

## Context

On 2026-08-26 the Mac Mini worker produced two PRs that were individually
correct, individually green, and could not both merge. #34 rewrote
`src/windows/Project.tsx`, 349 lines. One second later #37 rewrote the same
file, 287 lines, from a base that had never seen #34.

The obvious diagnosis is wrong. The worker does refresh before every ticket:
`git checkout main`, `git pull origin main`, `git checkout -b`. The bug is that
**merging is asynchronous and human gated**. The worker opens a PR and moves on
immediately, so the next ticket pulls a `main` that does not contain the
previous ticket's work and never will until a human clicks merge. Serial
execution does not prevent this. It only makes the collision slower to find.

The next batch is worse. #56 to #59 are the four remaining case studies, all
`agent-ready`, and all of them write `src/data/content.ts`.

## Decision

Two checks, in two places, because one place cannot see everything.

**Pre-flight, from declarations.** A ticket names the files it expects to own:

```
OWNS: src/data/projects/pickleball-iq.ts
```

Before starting any ticket, the worker reads every `OWNS:` line across the
whole queue. Where two tickets claim one file, the later one is **skipped by
number, named in the log, and left `agent-ready`** for the next batch. The rest
of the queue runs.

**Post-flight, from the real diff.** After the agent has edited and before the
PR is opened, the worker compares `git diff --name-only main` against the file
list of every open PR, from `gh pr list --json files`. Any overlap and the
branch is discarded, the issue gets a comment naming the PR it collides with and
the file, the ticket stays `agent-ready`, and the worker continues.

A ticket with no `OWNS:` lines is allowed and logged, so the convention can be
adopted gradually.

## Why both

`OWNS:` is a prediction written by whoever filed the ticket. The incident was
not predicted: #37 is titled "CSI as the reference case study", so its honest
declaration reads `content.ts`, and it rewrote the renderer because that is
what the work turned out to need. Declarations catch the collisions somebody
already anticipated. The diff catches the ones nobody did.

`OWNS:` also only sees inside one invocation. The real condition is not "two
tickets in this batch" but "this branch's base is missing an open PR's work".
Run the worker twice in an evening and every ticket passes a batch scan while
reproducing the bug exactly. The post-flight check is the one that is actually
correct, and the pre-flight check is the one that is cheap.

## Rejected

**Refuse the whole batch and exit**, as issue #64 originally specified. #64
rejects "wait for the merge before the next ticket" on the grounds that an
overnight batch would complete one ticket, then specifies a guard that produces
exactly that on the next batch: four case studies claim `content.ts`, the batch
is refused, and the two unrelated tickets in the queue do not run either. The
guard's first act would have been to stop the work it exists to protect.

**Wait for the merge before the next ticket.** Blocks a machine on a human.

**Chain each branch off the previous one.** Builds a stack where one rejected
PR strands everything behind it, and every diff contains its predecessors.

**Holding the collided branch on origin for a human to rebase.** Preserves the
run, and preserves the stale base along with it. See the consequence below.

**Worktrees.** Wanted, and irrelevant here. Isolating two working directories
does not make two rewrites of one file compatible. This was a stale base, not a
concurrent write. Worktrees come after this, not instead of it, and that
ordering is the point.

## Consequences

- A skipped ticket must be visible. A silent skip is how a ticket goes missing,
  which is the failure this ADR exists to end.
- **A collided branch is discarded rather than held**, and that is deliberate.
  Holding the branch holds the stale base with it, so merging it later
  reintroduces the exact problem. Re-running the ticket against a merged `main`
  is the only thing that actually resolves it, and on 2026-08-26 re-running #37
  that way produced a better result than any hand resolution would have. The
  cost is one agent run, roughly ten minutes.
- `docs/agents/issue-tracker.md` documents `OWNS:` beside `ADD_DIR:`.
- Once collisions are impossible by construction, parallel worktrees become
  safe. See ADR-0006, which removes most of the contention rather than
  arbitrating it.
