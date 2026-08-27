import type { Project } from '../types'

const project: Project = {
  slug: 'figviewer',
  order: 100,
  title: 'figviewer',
  windowTitle: 'FIGVIEWER.APP',
  oneLiner: 'Arrow key navigation for Matplotlib plots, the way Spyder does it.',
  role: 'Built it',
  status: 'Public',
  year: '2026',
  categories: ['tools'],
  copyState: 'PLACEHOLDER',
  caseStudy: false,
  problem:
    'Matplotlib opens every figure in its own window and gives you no way to step between them. Anyone who has generated forty plots in a loop has then closed forty windows one at a time. Spyder solved this years ago and nothing outside Spyder did.',
  built: ['A viewer that collects the figures and lets you arrow through them.'],
  stack: ['Python', 'Matplotlib'],
  evidence: ['[ Do you still use it? That is the only metric a tool like this has. ]'],
  links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/figviewer' }],
}

export default project
