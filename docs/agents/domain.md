# Domain Docs

**Single context.** One `CONTEXT.md` at the repo root, one `docs/adr/`
alongside it. No `CONTEXT-MAP.md`, because there is one domain here: a personal
portfolio site. If this ever becomes a monorepo, add the map then.

```
/
├── CONTEXT.md          the vocabulary
└── docs/
    └── adr/            the decisions
        ├── 0001-case-study-template.md
        ├── 0002-diagrams-are-inline-svg.md
        ├── 0003-csi-architecture-shape-only.md
        └── 0004-measure-over-grid.md
```

## Reading them

**`CONTEXT.md` before writing copy or naming a component.** It defines what
this repo means by case study, archive entry, evidence, the shape versus the
mechanism, measure, contribution chip, blank and set dressing. Several of those
are ordinary English words used in a specific way here, which is exactly why
they are written down.

If a term you were about to use conflicts with what is in there, one of the two
is wrong. Say which, and change it. Do not quietly use both.

**`docs/adr/` before reopening a decision.** Each one records what was chosen,
why, and what was rejected on what grounds. The rejected alternatives are the
valuable part: they stop the same argument being had twice, and they explain
why the obvious option was not taken.

## Writing them

Create files lazily. A term goes in `CONTEXT.md` when it is settled, not when
it is first said. An ADR gets written when a decision is made, not when it is
being discussed.

**ADRs are append only.** Numbered sequentially, and not edited after they are
accepted. A decision that changes gets a new ADR that says `Supersedes 0003`.
Editing an accepted ADR destroys the record of what was believed at the time,
which is the only reason the file exists.

Both were seeded on 2026-08-26 by a `grill-with-docs` session on issue #26.
