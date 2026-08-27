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

// ---------------------------------------------------------------------------
// The cost of the glob, and the guard on it
//
// Nothing coordinates `order` between files, which is the point of ADR-0006 and
// also its one sharp edge. The live values run 0 to 120 in tens, so the next
// entry reaches for a round number that is usually already taken.
//
// A tie leaves the sort undefined. `Array.prototype.sort` is stable in every
// engine this site runs in, so the winner would be whatever order
// `import.meta.glob` returned, which is alphabetical by filename and has
// nothing to do with intent. It would not crash and it would not look wrong.
// PORTFOLIO would just quietly list two projects the wrong way round.
//
// A duplicate `slug` is worse: two projects claim one URL, and one of them
// becomes a file that cannot be opened.
//
// Development only. Vite replaces `import.meta.env.DEV` with `false` at build
// time and the block is dropped, so a build that already passed can never
// start throwing at a visitor over a data problem that is visible the moment
// an author saves the file. The limit that comes with that: CI runs the
// typecheck and the build, neither of which evaluates this module, so the
// check fires when somebody loads `npm run dev`, not on the pull request.
// ---------------------------------------------------------------------------
if (import.meta.env.DEV) {
  const named = Object.entries(modules).map(([path, m]) => ({
    file: path.replace('./', ''),
    project: m.default,
  }))

  // Report every clash at once rather than the first one. An author fixing a
  // batch of new entries should not have to reload for each collision.
  const clashes = (['order', 'slug'] as const).flatMap((field) => {
    const groups = new Map<number | string, string[]>()
    for (const { file, project } of named) {
      const owners = groups.get(project[field]) ?? []
      // The filename is named as well as the slug, because when it is `slug`
      // that collides the slug alone cannot tell the two files apart.
      owners.push(`${project.slug} (${file})`)
      groups.set(project[field], owners)
    }
    return [...groups]
      .filter(([, owners]) => owners.length > 1)
      .map(([value, owners]) => `${field} ${JSON.stringify(value)}: ${owners.join(', ')}`)
  })

  if (clashes.length > 0) {
    throw new Error(
      'Two projects cannot share an `order` or a `slug`. ' +
        'Give each of these its own value in src/data/projects/.\n  ' +
        clashes.join('\n  '),
    )
  }
}
