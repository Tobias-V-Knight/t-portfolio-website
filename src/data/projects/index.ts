// Every project in `./` becomes an entry, sorted on `order`.
//
// ADR-0006. The glob is what makes a new case study a new file and nothing
// else: no list of slugs to edit, so two case study tickets touch no file in
// common and can run in the same batch.
import type { Project } from '../types'

const modules = import.meta.glob<{ default: Project }>('./*.ts', { eager: true })

export const projects: Project[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order)
