import type { ReactElement } from 'react'
import type { DiagramId } from '../data/content'

// ADR-0002 says what a diagram is: hand authored inline SVG, drawn with the
// same tokens as the window chrome. The drawings live in `./diagrams/`, one
// file each, default exporting one component. The shared primitives are in
// `./diagram-primitives.tsx`.
//
// ADR-0006 says why the registry is a glob rather than an object literal: an
// object literal is one line every case study ticket has to edit, and two
// tickets editing one line is the collision the guard exists to catch. A
// drawing is registered by being a file, and its id is its filename.
const modules = import.meta.glob<{ default: () => ReactElement }>('./diagrams/*.tsx', {
  eager: true,
})

const DIAGRAMS: Record<string, () => ReactElement> = Object.fromEntries(
  Object.entries(modules).map(([path, m]) => [
    path.replace('./diagrams/', '').replace('.tsx', ''),
    m.default,
  ]),
)

// An id with no drawing renders nothing rather than throwing. That is the cost
// of widening DiagramId to a string, and it is bounded by a project and its
// drawing now shipping in the same ticket.
export function Diagram({ id }: { id: DiagramId }) {
  const Drawing = DIAGRAMS[id]
  if (!Drawing) return null
  return (
    <div className="mac-sunken mac-diagram-plate">
      <Drawing />
    </div>
  )
}
