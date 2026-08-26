# 0001. One template for every case study

Date: 2026-08-26
Status: accepted

## Context

The project windows read like essays. A reviewer hiring for Applied AI, MLE or
FDE work scans a project page in 60 to 90 seconds and then decides whether to
go deeper. The CSI window fails that test in both directions at once: too long
to scan, and too empty to reward the reading, using about 65 percent of a very
wide window with a single column of prose.

The existing window already has eight sections (problem, what was built,
architecture, stack, screens, results, lessons, links), so this is a
restructure rather than an invention.

## Decision

Every case study follows the same eleven part template.

1. **Hero.** Name, one sentence, a metadata row `FOCUS · YEAR · ROLE · STATUS`,
   then action chips.
2. **At a glance.** PROBLEM / APPROACH / OUTPUT / EVIDENCE in one panel.
   Understandable in ten seconds. **This is the centerpiece**, not the diagram,
   because every project can have one and not every project can have a diagram.
3. **Problem.** 100 to 150 words. Who has it, what they do today, why it
   matters. No technical detail.
4. **System.** One architecture diagram, then three to five bullets on the
   decisions that mattered.
5. **ML / AI decisions.** Approach, baseline, evaluation, why. **Omitted
   entirely** where there is no model. This is where it shows he did not simply
   wire APIs together.
6. **Evidence.** See CONTEXT.md. Real numbers where they exist, the strongest
   available proof where they do not.
7. **Product.** Two to four visuals with captions: diagram, real screenshot,
   evaluation chart, human context. In that order of priority.
8. **My contribution.** Chips for work he owned, plus one line naming the team.
9. **Stack.** Chips, reusing the toolbox styling so it ties to the skills
   taxonomy. Tools on one line, techniques on the next.
10. **Deep dive.** Collapsed. Data prep, failed approaches, hyperparameters,
    evaluation methodology, deployment.
11. **Lessons.** Two bullets. One technical, one product or domain.

Length: 50 to 100 words above the fold, 400 to 700 for the default view.
Everything else collapsed or on GitHub.

**Website is story plus evidence. GitHub is implementation.** Neither replaces
the other, and long code blocks do not belong on a project page.

## Consequences

Sections 2, 5, 8 and 10 do not exist yet and need building. The `Project`
interface in `content.ts` gains fields for each, all optional, so a project
without ML simply omits that section rather than rendering an empty heading.

Six projects get the full treatment: CSI, PB IQ, NLP material classifier,
4MATIV anomaly detection, RoleRadar, EDA GED. The rest become archive entries.
That curation is the point rather than a shortcut: a Finder list puts every row
at equal weight, so undifferentiated coursework drags down the work that
matters.

The collapsed deep dive is what makes the length target survivable. Without it
the choice is a shallow page or a long one.

## Alternatives considered

**Keep the essay form and shorten it.** Rejected: the problem is structure, not
word count. A shorter essay is still an essay, and a reviewer still cannot find
the model, the baseline or the outcome without reading all of it.

**One template per project type.** Rejected: three templates is three things to
maintain and the differences between them are already expressible as optional
sections.
