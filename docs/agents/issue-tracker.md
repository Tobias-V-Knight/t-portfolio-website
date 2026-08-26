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
