# CONTEXT

The vocabulary this repo uses when it talks about itself. Written during the
grilling of issue #26 on 2026-08-26 and added to whenever a term is settled.

Read this before writing copy or naming a component. If a term here conflicts
with what you were about to say, this file wins or this file changes; do not
quietly use both.

Decisions live in `docs/adr/`.

---

## Case study

A project window that follows the full template in
[ADR-0001](docs/adr/0001-case-study-template.md): hero, at a glance, problem,
system, ML decisions, evidence, product, contribution, stack, deep dive,
lessons.

Six projects get one: **CSI, PB IQ, NLP material classifier, 4MATIV anomaly
detection, RoleRadar, EDA GED.** In that order, which is T's ranking of what he
wants a hiring manager to open first.

Not a synonym for "project". Most projects are not case studies.

## Archive entry

A project that appears in the ARCHIVE folder rather than in the PORTFOLIO list.
**It still opens.** Clicking it opens a project window like any other; that
window is simply shorter, because the entry has less material in it.

The distinction is prominence, not access. A Finder list makes a promise on
every row, and a file that does nothing when clicked reads as broken rather
than as unimportant.

Depth is decided by the data. `ProjectPanel` renders a section only when the
project has it, so a thin entry produces a short window without a second
template existing anywhere.

The grouping exists because a Finder list puts every row at equal visual
weight, so eight coursework projects beside CSI drag CSI down. That is a
statement about billing, not about worth.

## Evidence

The section that replaced RESULTS on 2026-08-26.

**The rename is the decision.** A section called RESULTS demands results, so a
project that never measured anything looks like a project that failed. A
section called EVIDENCE asks a different question, "what is the strongest proof
this was real", and a screenshot of the thing running in production is a
legitimate answer to that question where it is not an answer to "what were your
results".

Ordered by strength: a measured number, a deployment fact, a screenshot of the
real thing, a client outcome. Never three empty boxes reading DELIVERED.

## The shape, and the mechanism

The distinction that unblocked CSI. See
[ADR-0003](docs/adr/0003-csi-architecture-shape-only.md).

**The shape** is the pipeline every system in a category has:
`document in → parse → retrieve → reason → structure → out`. It is generic,
it is in every vendor's marketing, and publishing it reveals nothing.

**The mechanism** is what makes one system different from another: the stage
internals, the corpus, the cost per unit, the model choices, the method.

CSI may publish its shape. It may never publish its mechanism, because CSI's
mechanism describes the client's by proxy and the client's is withheld deliberately.

## Measure

The 66 character cap on any line of running text, set as `--measure` in
`system.css`.

An invariant, not a preference. When a layout technique and the measure
conflict, the measure wins or it was never an invariant. See
[ADR-0004](docs/adr/0004-measure-over-grid.md).

Applies to running text only. Tag rows, role lists, tables and diagrams take
the full width of the window.

## Contribution chip

A short label in MY CONTRIBUTION naming work T personally did.

**A chip is a first person claim.** `RETRIEVAL PIPELINE` on a team project
means he built the retrieval pipeline, not that the team had one. Team work
gets chips for his part plus one sentence naming the team, because the test a
chip has to pass is a reference call.

## Blank

Copy in `[ square brackets ]` that renders as a visible highlighted slot rather
than as prose. The mechanism that makes unfinished copy impossible to mistake
for finished copy.

A blank is correct output, not a failure. An agent that cannot find a fact
writes a blank; an agent that invents one has broken CLAUDE.md rule 9.

## Set dressing

Content that is deliberately not a claim: the boot sequence's loss curve and
its F1, the Finder window's file sizes, the clock in the menu bar.

**Set dressing may be invented. A claim may not.** The line is whether a
reasonable visitor would read it as a statement about T's work. The boot
sequence is an animation of a training run that is not happening; a number in a
case study window is a statement about what he built.

## Placeholder copy

Copy nobody has signed off, flagged with `copyState: 'PLACEHOLDER'`, which
renders a visible tag on the window. Distinct from a blank: a blank is one
missing fact, a placeholder is a whole section awaiting approval.

## Collision

Two branches that rewrite the same file and cannot both merge, even though both
are correct and both are green.

Not a race. The worker pulls fresh `main` before every ticket, but merging is
human gated, so the second ticket branches from a `main` that does not contain
the first and will not until somebody clicks merge. Serial execution does not
prevent a collision, it only delays finding one.

`OWNS: path` in a ticket body declares the files that ticket expects to rewrite.
The worker refuses to queue two tickets claiming one file, and separately
refuses to open a PR whose real diff overlaps an open PR. See
[ADR-0005](docs/adr/0005-collision-guard.md), and
[ADR-0006](docs/adr/0006-one-file-per-project.md) for the split that removes the
contention rather than arbitrating it.
