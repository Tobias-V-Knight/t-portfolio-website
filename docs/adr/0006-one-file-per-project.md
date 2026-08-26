# 0006. One file per project, and diagrams register themselves

Date: 2026-08-26
Status: accepted

## Context

Every word on the site lives in `src/data/content.ts`, 1091 lines, of which the
`projects` array is 487. The four remaining case studies, #56 to #59, each add
one project object to that array. All four therefore rewrite the same file, and
by ADR-0005 only one of them can be in flight at a time.

ADR-0005 arbitrates that contention. This ADR removes most of it.

## Decision

**One file per project.** `src/data/projects/<slug>.ts` exports a single
`Project`. `src/data/projects/index.ts` collects them with Vite's
`import.meta.glob('./*.ts', { eager: true })` and sorts on a new required
`order` field, which carries the ranking already fixed in `CONTEXT.md`: CSI, PB
IQ, NLP material classifier, 4MATIV, RoleRadar, EDA GED, then the archive.

The shared types move to `src/data/types.ts`, because a project file needs
`Project`, `Category`, `AtAGlance`, `ProjectLink`, `Placeholder` and `DiagramId`
and must not import the module that imports it.

`content.ts` stays and re-exports `projects`, `caseStudyProjects`,
`archiveProjects` and `windowProjects` unchanged. All seven importers in `src/`
go through `data/content`, so none of them change.

**Diagrams register themselves the same way.** `src/components/diagrams/<id>.tsx`
default exports one component. `Diagrams.tsx` globs that directory and keys the
registry on the filename. `DiagramId` widens from a closed union to `string`,
and an unknown id renders nothing rather than throwing.

## Why the diagram half is not optional

A split that stops at the copy buys less than it looks. `DiagramId` is a closed
union at `content.ts:89` and the registry at `Diagrams.tsx:172` is one object
literal. NLP and RoleRadar both want a diagram, so both tickets edit both of
those lines and the collision reappears one file over, with the four case
studies still serialised. Glob registration is what makes a case study ticket
touch nothing any other case study ticket touches.

## Rejected

**An explicit list of slugs in `index.ts`.** Readable, and it puts the ordering
in one obvious place. It is also a shared file that every case study ticket
edits, which is the thing being removed. `order` on the project itself moves
that line into the file the ticket already owns.

**Leaving `content.ts` whole and relying on ADR-0005.** Correct, and slower:
four case studies at one per human merge cycle. It also leaves the file growing
past 1500 lines with six case studies in it.

**Splitting all of `content.ts`**, including `home`, `about`, `resume`, skills
and toolbox. Those are edited by one ticket at a time and are not contended.
Splitting them would be tidying, and CLAUDE.md rule 2 says consolidate before
creating files.

## Consequences

- A case study ticket owns exactly two paths: its project file and, where it has
  one, its diagram file. `OWNS:` lines become short and true.
- #56 to #59 can run in one batch, and in parallel worktrees once those exist.
- **Type safety on diagram ids is traded away.** A project naming a diagram that
  does not exist used to be a compile error and now renders nothing. The
  mitigation is that the project file and its diagram now ship in the same
  ticket, so the two cannot drift apart across branches.
- This refactor touches every project and must land alone, before #56 to #59.
