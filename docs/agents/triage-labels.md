# Triage Labels

The skills speak in five canonical triage roles. This maps them to the label
strings this repo actually uses.

| Canonical role | Label here | Meaning |
|---|---|---|
| `needs-triage` | `needs-spec` | Not ready for an agent. Scope it on the laptop first |
| `needs-info` | `needs-info` | Waiting on an answer from T. One decision and an agent proceeds |
| `ready-for-agent` | `agent-ready` | Fully specified. The Mac Mini may run it unattended |
| `ready-for-human` | `ready-for-human` | Fully specified, and the work itself needs T |
| `wontfix` | `wontfix` | Will not be actioned |

When a skill asks for a role, use the right hand column.

## The one that was split

`blocked-on-t` was retired on 2026-08-26. It carried both `needs-info` and
`ready-for-human`, and its eight open issues divided evenly between them.

The distinction is operational, not pedantic. **`needs-info` is what blocks the
queue**: an agent is standing still until T answers, and the answer usually
takes seconds. #8, the order of the capability list, was one line of his
judgement. **`ready-for-human` blocks nothing.** It is T's own queue: #9 needs
a PDF only he has, #15 needed a GitHub token, #17 needs an Apple ID login.

Conflated, the board could not answer "what is stopping the agents", because
the answer was buried among jobs that were merely waiting for T to find an
evening. Separated, `gh issue list --label needs-info` is that answer.

## Labels that are not triage states

These describe a ticket rather than positioning it in the state machine, and
they sit **alongside** a triage label rather than instead of one.

| Label | Means |
|---|---|
| `show` | Visual. A human looks at it before it closes. The Mac Mini has no browser |
| `content` | Copy about T. CLAUDE.md rule 9 applies with full force: never invent, leave a visible blank |
| `bug`, `enhancement` | Ordinary GitHub kind labels |

A ticket is commonly `agent-ready` **and** `show`: the machine writes it, a
human confirms it looks right. Those are not in conflict.
