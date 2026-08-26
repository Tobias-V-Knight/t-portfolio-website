# 0002. Architecture diagrams are hand authored inline SVG

Date: 2026-08-26
Status: accepted

## Context

ADR-0001 puts an architecture diagram in every case study. Six case studies
means six diagrams, and how they are made decides the schedule more than any
other choice in the template. Nothing else in the spec depends on the answer.

## Decision

Hand authored inline SVG, committed to the repo as JSX.

## Consequences

**What this buys.** The diagrams match the Mac OS 8 chrome exactly, because
they are drawn with the same tokens as everything else: the same 1px black
rule, the same bevel highlights, the same Silkscreen labels. They scale to any
window size without going soft, they work in both themes because their colours
come from CSS variables rather than being baked into pixels, and they are text
in the repo, so an agent can edit one without a design tool.

**What it costs.** It is the slowest option per diagram. A diagram is a
morning, not a minute, and six of them is the bulk of the work in ADR-0001.

## Alternatives considered

**Mermaid.** Fastest to author, and the diagram is text an agent can write
unaided. Rejected on appearance: Mermaid looks like Mermaid, which is to say
like every engineering doc written since 2020, and it would visibly not belong
inside a Macintosh window. The whole argument for this site is that it does not
look like everyone else's.

**Exported images from Figma or Excalidraw.** Full design control and the
fastest route to something that looks good. Rejected on maintenance: an
exported PNG goes stale the moment the system changes, cannot be edited by an
agent, needs two versions for light and dark, and adds weight to a page that
currently ships nothing but text and two videos.

**ASCII or box drawing in the Mac font.** Genuinely period correct, since a
1997 technical document drew its diagrams in monospace, and it costs nothing.
Rejected as the default because it constrains every diagram to boxes and
straight lines, and the difference between brilliant and lazy is entirely in
the execution. **Still the right answer for a simple pipeline**, and a case
study may use it where the shape is a straight line of four boxes.

## Notes for whoever draws the first one

Use the palette tokens, never hex values. Label with `--mac-chrome` at
`--type-chrome-sm`. Give the `<svg>` a `viewBox` and no fixed width so it
scales. Diagrams span the full width of the window and are exempt from the
measure, per CONTEXT.md.
