# Issue Tracker

Issues for this repo live in **GitHub Issues** on
`Tobias-V-Knight/t-portfolio-website`, reached with the `gh` CLI.

```bash
gh issue list --label agent-ready --state open
gh issue view <n>
gh issue create --title "..." --label "..." --body-file <path>
gh issue comment <n> --body "..."
gh issue edit <n> --add-label ... --remove-label ...
```

## Why here

The board moved from `TICKETS.md` to GitHub Issues on 2026-08-25. Two boards
holding the same work drift apart within weeks, and the Mac Mini worker can
read an issue while it cannot read a markdown file's intent. `TICKETS.md`
survives as an index and a historical record, not as a queue.

## Pull requests are not a triage surface

Every PR on this repo is either T's or the Mac Mini worker's, which makes them
in flight work rather than incoming requests. `/triage` should read issues
only.

## What reads this tracker

- **`scripts/mini-worker.sh`** on the Mac Mini polls
  `gh issue list --label agent-ready`, works one issue per branch, opens a PR
  and comments back on the issue. It is the main consumer.
- An issue may grant the agent read access to paths outside the repo by
  declaring them in its body:

  ```
  ADD_DIR: /Users/tmaxxx/dev/nlp-material-classifier
  ```

  The worker turns each into a `--add-dir` argument. Access is per issue and
  declared in public rather than granted globally.

## Two sources, and an extraction ticket needs both

**The knowledge base is in iCloud. The code is in `~/dev`.** They answer
different questions and a ticket that names only one gets half an answer.

```
~/Library/Mobile Documents/com~apple~CloudDocs/00 MSBA + Coding/
    PBIQ/                       status, worklog, product, business, coaching ops
    00_summer 2026/00_CSI_ELP/  spec sheets, transcripts, deployment records
    01_spring 2026/             coursework, live cases, final decks
    04_career/                  resumes, the master CV, experience write ups

~/dev/
    pbiq/, nlp-material-classifier/, csi-client/, csi-t/
```

The code says what was built. **The knowledge base says why, what was tried and
dropped, and what T thinks he did.** For anything about intent, product history
or contribution, iCloud is the source and the repo cannot substitute.

This was learned by getting it wrong: issue #45 originally pointed only at
`~/dev/pbiq` and missed `PBIQ/` in iCloud entirely, including a worklog and a
file of T's own resume bullets for that project.

## Git history is evidence of presence, never of absence

A commit under someone's name proves they wrote that. **The absence of commits
proves nothing.** Work gets done offline, pairing, in someone else's repo, or on
a machine that never pushed.

Also learned by getting it wrong, on the same ticket: it instructed an agent to
settle who built what on PB IQ from commit counts. Two of the three repos are
the co-founder's and carry none of T's commits, and T had done a substantial
part of that work offline. The counts understated his contribution.

**Never compute a contribution split from a commit log.** For who did what, use
what T has written about his own work, and where that does not settle it, write
`[ T to confirm ]`.

## What makes an issue `agent-ready`

Not a vibe. All four of:

1. **Acceptance criteria** a machine can check.
2. **Files or modules in scope.**
3. **An explicit out of scope line**, so the agent opens a new issue instead of
   widening this one.
4. **How to verify.** The Mac Mini has no browser, so anything visual says who
   checks it and where.

An issue missing any of those is `needs-spec`. Labelling it `agent-ready`
anyway produces sprawl, and the agent will do exactly what was written.
