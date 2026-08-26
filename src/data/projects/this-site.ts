import type { Project } from '../types'

const project: Project = {
  slug: 'this-site',
  order: 110,
  title: 'This Website',
  windowTitle: 'THIS_SITE.APP',
  oneLiner: 'The thing you are looking at. A classic Macintosh desktop, no backend, no framework.',
  role: 'Built it',
  status: 'You are here',
  year: '2026',
  categories: ['tools'],
  copyState: 'PLACEHOLDER',
  caseStudy: false,
  problem:
    'A portfolio has about fifteen seconds to be worth reading, and every portfolio looks the same, so the fifteen seconds go to whoever is memorable rather than whoever is best. The risk in solving that with a gimmick is that the gimmick becomes the thing people remember instead of the work.',
  built: [
    'A window manager where the URL owns the active window, so every project has a real shareable address and the browser Back button closes the window on top.',
    'A mobile layout that keeps the Macintosh chrome and drops the desktop metaphor entirely, because a desktop simulated on a phone is worse than no metaphor at all.',
    'A boot sequence, a filtered project index, and a photo viewer, none of which are required to reach anything.',
  ],
  architecture:
    'Static Vite and React with no backend. Every colour comes from one stylesheet, every word of copy comes from one data file, and the whole thing deploys to GitHub Pages as flat files.',
  stack: ['Vite', 'React', 'TypeScript', 'React Router', 'No CSS framework, no component library'],
  lessons: [
    'Navigating to a window that is already open means two opposite things. Back onto it means close everything above it, clicking a buried one means raise it and leave the rest. Same URL, opposite intent, and only the navigation type tells them apart.',
  ],
  links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/t-portfolio-website' }],
}

export default project
