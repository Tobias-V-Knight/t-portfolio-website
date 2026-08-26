# 0003. CSI publishes its shape, never its mechanism

Date: 2026-08-26
Status: accepted
Supersedes: Q-06, open since 2026-08-23

## Context

CSI is the flagship project and the first row in the PORTFOLIO window. ADR-0001
puts an architecture diagram in every case study.

But CSI is bid intelligence for asphalt paving contractors and Gravl is pre bid
intelligence for construction. A detailed CSI system description is adjacent
enough to describe Gravl's mechanism by proxy, and the Gravl constraint in
CLAUDE.md exists precisely to prevent that: architecture, pipeline stages,
corpus size, unit or marginal compute cost, model details, the five work
product method, the phase and gate table and the pit and haul insight were all
deliberately removed from the company site over 2026-08-20 and 21. A personal
site is exactly where a competitor looks for what the company site withholds.

So the flagship project was blocked from the template's most valuable section,
and had been since 2026-08-23.

## Decision

Split the thing being protected in two.

**The shape** is the pipeline every system in this category has:

```
bid PDF → parse and chunk → retrieval → agents / LLM → structured extraction → estimator UI
```

This is generic. It appears in every document intelligence vendor's marketing.
Publishing it tells a competitor nothing they could not write down themselves,
and it tells a hiring manager exactly what they need: that T has built a real
retrieval and agent pipeline end to end.

**The mechanism** is what makes one such system different from another: stage
internals, the corpus, cost per unit, model choices, the method, the gates.

**CSI publishes its shape. CSI never publishes its mechanism.**

## Consequences

CSI gets a diagram, deliberately generic and concise, and the flagship is
unblocked without touching the Gravl constraint, which stands unchanged.

The diagram must be reviewed against this rule before it ships. The test is
specific: **could a competitor build something meaningfully closer to Gravl
having seen this?** If the answer is anything but a confident no, cut detail
until it is.

Everything currently withheld stays withheld. This ADR narrows an open
question, it does not loosen a constraint.

## Alternatives considered

**Ship CSI with no diagram and a visible note about client confidentiality.**
Honest, and arguably flattering about how T handles client work. Rejected
because it was unnecessary once the shape and mechanism split was available,
and because the flagship losing the best section is a real cost.

**Demote the diagram from the template.** Rejected: it solved CSI's problem by
weakening all six case studies. The diagram earned its place; the conflict was
specific to one project.

**Lead with the NLP classifier instead.** Rejected as a reordering, though it
remains true that the classifier has real numbers and no confidentiality
constraint and is therefore the easier one to build first.
