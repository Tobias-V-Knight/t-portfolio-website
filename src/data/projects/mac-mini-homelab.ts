import type { Project } from '../types'

const project: Project = {
  slug: 'mac-mini-homelab',
  order: 90,
  title: 'Mac mini Home Lab',
  windowTitle: 'MAC_MINI.APP',
  oneLiner: 'The machine most of this was built on, and everything running on it.',
  role: 'Built it',
  status: 'Running',
  year: '2026',
  categories: ['hardware'],
  copyState: 'PLACEHOLDER',
  caseStudy: false,
  problem:
    'Training a model on a laptop means the laptop is gone for the afternoon, and renting a GPU for every experiment means paying to find out an idea was bad. A machine that sits in the corner and takes jobs solves both, and it is cheaper than either over a year.',
  built: [
    '[ The hardware, and why that configuration ]',
    '[ What runs on it: training jobs, services, storage, anything hosted ]',
    '[ How you reach it from elsewhere ]',
  ],
  architecture: '[ Network, storage and service layout. This one deserves a diagram. ]',
  stack: ['[ OS, container runtime, anything orchestrating it ]'],
  media: [{ caption: 'The machine, in situ', tone: 'screenshot' }],
  evidence: ['[ What it has actually run. The NLP classifier trained on it, what else? ]'],
}

export default project
