# 0004. The measure wins, the grid is how it is achieved

Date: 2026-08-26
Status: accepted

## Context

The case study layout proposal is an editorial grid: text roughly 55 percent on
the left, visuals and metadata 45 percent on the right, alternating, with
diagrams spanning full width. The aim is to fix a real problem, that the
current single column uses about 65 percent of a wide window and feels
simultaneously too long and too empty.

But P2-08 introduced `--measure: 66ch` and capped running text at it, because a
900px window was setting roughly 110 characters to the line, about twice what
is comfortable to read.

At 900px these agree by accident: 55 percent is around 60 characters. At 1440
they disagree, and at 1600 the grid alone would set about 100 characters per
line, which is the exact bug P2-08 fixed.

## Decision

**The measure is the rule. The grid is a technique for using the space the
measure frees.**

Running text stays capped at `--measure` at every width. The grid places
visuals and metadata in the space to its right rather than letting text expand
into it.

## Consequences

At 1440 a case study is a text column plus a real visual column, which is the
fix for "too long and too empty". At 900 the visual column collapses beneath
the text and nothing breaks. One layout, one set of screenshots, no breakpoint
to maintain.

Diagrams, tag rows, role lists and the at a glance panel are **not** running
text and take the full width. The measure applies to prose only.

## Why this way round

These are different kinds of rule and it is worth being explicit about it,
because the same argument will come up again.

The measure is a **readability invariant**: 66 characters is comfortable at any
window size, on any display, indefinitely. The grid is a **layout technique**
for arranging things in available space.

When a technique conflicts with an invariant, the invariant wins, or it was
never an invariant. Choosing the other way round would have meant
reintroducing a max width on the text column within a week, which is the
measure again with extra steps.
