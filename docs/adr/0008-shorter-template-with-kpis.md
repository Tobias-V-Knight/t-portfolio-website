# 0008. Eight sections, not eleven, and a KPI strip

Date: 2026-08-27
Status: accepted
Supersedes: parts 2, 5, 10 and 11 of [ADR-0001](0001-case-study-template.md)

## Context

Six case studies now exist and can be read against each other rather than
imagined. Read that way, three of the eleven sections were not earning their
place.

**ML DECISIONS, DEEP DIVE and LESSONS** are the last three things a reader
reaches and the first three that turn a page into an essay. The CSI window ran
to roughly 1,200 words. ADR-0001 sets 400 to 700 for the default view, and the
collapsed deep dive was the mechanism meant to keep it there. It did not: it
became somewhere to put more writing rather than a reason to write less.

Separately, T's reading of his own flagship: too much of it is inferred, and it
has no single source of truth. The CSI material is spread across meeting notes,
three decks, a knowledge transfer document, a resume and this site, and where
they disagree the page had been quietly picking one.

## Decision

**Eight sections.** Hero, at a glance, problem, KPIs, system, evidence,
product, contribution, stack. ML DECISIONS, DEEP DIVE and LESSONS are removed
from the template and from every project that had them.

**The at a glance panel's second cell becomes a key question**, where a project
has one. Situation, complication, key question is how the CSI work was
presented to the client, and a question is a sharper second beat than a
restatement of the approach. `approach` stays available for projects that have
no such question, so five windows are unaffected.

**A KPI strip**, where and only where real measured figures exist. Two to four
figures, each with its unit and its before value where there is one.

**Length: 400 words or fewer of running prose per case study.** Not a target, a
cap. Chips, captions, KPI labels and the at a glance cells do not count against
it: they are not read as prose and shortening them costs information rather than
noise. CSI went from roughly 1,200 words to 358 under this rule.

## Why not keep the deep dive and let it grow

It is collapsed, so it costs a reader nothing. That is the argument, and it is
wrong in one specific way: a section that costs nothing to skip also costs
nothing to fill, so it accumulates. Every one of the six case studies had one
within a day of the template existing. Removing the container is the only
edit that actually shortens anything.

The material is not lost. It is in `docs/extracted/`, cited by path, which is
where evidence belongs, and in git history.

## Why KPIs are not just EVIDENCE with a border

EVIDENCE answers "what is the strongest proof this was real" and takes a
deployment fact or a screenshot as a legitimate answer. A KPI strip answers
"how much did it move" and takes only a number. Most projects have the first
and not the second, so the strip renders only where the figures exist, exactly
as the ML section used to.

## What a KPI may not be

A figure whose arithmetic a reader can disprove. The CSI work replaces a 10 to
20 hour go/no-go workup with a 3 to 5 minute one, across roughly 4,000 plans a
year. Multiplying those gives 40,000 to 80,000 hours saved annually against an
estimating team of twelve, whose entire capacity is roughly 24,000 hours. The
per plan figure is true and the annual one is not, and publishing the second
would discredit the first. **State the unit that survives division.**

## Consequences

- Six project files lose three fields each. `Project` loses `mlDecisions`,
  `deepDive` and `lessons`, and gains `kpis`.
- `AtAGlance` gains `keyQuestion` alongside `approach`; the panel renders
  whichever is present and labels the cell accordingly.
- `ProjectPanel` loses three renderers and gains one.
- ADR-0001 stays as the record of what was tried. This ADR is what to build to.
