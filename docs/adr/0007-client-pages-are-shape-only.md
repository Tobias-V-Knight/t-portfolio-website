# 0007. Every client page is shape only, not just CSI

Date: 2026-08-26
Status: accepted
Supersedes: the publishing line in `docs/extracted/eda-6411.md`

## Context

Two documents disagreed, and the disagreement was only found when the 4MATIV
case study was written from one of them.

`docs/extracted/eda-6411.md` set its own publishing rule for the two live client
engagements in MSBA 6411: method, algorithm, parameters, pipeline shape, dataset
scale and relative deltas may ship, while absolute performance levels, per
vendor scores and quadrant assignments may not. The 4MATIV page written from it
was scrupulous about that line and published the corpus counts, the polling
intervals, the DBSCAN and geofence radii, the outlier threshold, the flag
thresholds and every scoring weight.

`CLAUDE.md` and [ADR-0003](0003-csi-architecture-shape-only.md) say something
stricter, and say it about client work generally: the **shape** of a pipeline is
generic to its category and safe, the **mechanism** is stage internals, corpus
size, unit or marginal compute cost, model details and method, and the mechanism
never ships.

The extraction's rule was written to protect the clients' performance figures.
It was not written as a ruling on mechanism, and it quietly became one.

## Decision

**CLAUDE.md wins, and it applies to every client on this site rather than to CSI
alone.** A client page carries the problem, the pipeline shape, why each choice
was made over the alternatives, the data decisions, the outcome and the
delivery. It does not carry corpus counts, parameters, thresholds, radii or
weights.

The extraction files keep every withheld figure, cited by path. Nothing is lost,
it is one lookup away, and the lookup is not public.

## Why the looser rule was rejected

The argument for it is that parameters and dataset scale are what make a case
study technical rather than promotional, and a hiring manager reading a page
with no numbers in it learns less.

That is true and it is not the trade being made. What survives the cut is the
part that actually evidences judgement: three models chosen for three different
reasons, the two stop identifiers that only one of which is a place, a finding
published with the caveat that could invalidate it. None of those needed a
radius to land. The parameters were the least persuasive part of the page and
the only part that carried a confidentiality cost.

The specific cost is not paranoid. 4MATIV is a live prospect. A page describing
how their vendor scoring works, published by the person who built it, is exactly
where a competitor looks for what the company's own site does not say.

## Amendment, 2026-08-26: the client is not always the subject

Written for 4MATIV, where the analysis scores the client's own vendors, and then
immediately tested by the GED case, where it does not.

The GED work segments roughly three hundred thousand adult learners on which
preparation methods carry weight and on where they live. **GED Testing Service
supplied the data and is not what the findings are about.** Reading this ADR to
cover them would withhold a finding about adult education because of who owned
the spreadsheet.

So the line is the **subject**, not the source:

* **The client's own performance, operations and mechanism** stay withheld. For
  GEDTS that is pass rates, volumes, revenue, anything characterising how the
  organisation itself performs.
* **Findings about a population the client merely observed** may ship: the odds
  ratios on prep methods, the geographic result, the model selection plot.

T ruled this on 2026-08-26. It does not loosen anything for 4MATIV, where the
subject is the client's vendor network and the client's own scoring of it.

## Consequences

- The 4MATIV page was cut back on this basis before it merged.
- **#60, the GED case study, is the other client in the same extraction and
  inherits this ADR**, not the extraction's line.
- `docs/extracted/eda-6411.md` gets a pointer at the top of its publishing
  section saying this ADR overrides it. The extraction stays as written, because
  its job is to hold what was withheld, not to decide what ships.
- Q-15, whether T clears 4MATIV the way he cleared CSI on 2026-08-23, is
  answered: yes as to the work existing on the site, no as to its mechanism.
