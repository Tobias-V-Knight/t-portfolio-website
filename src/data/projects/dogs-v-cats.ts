import type { Project } from '../types'

const project: Project = {
  slug: 'dogs-v-cats',
  order: 80,
  title: 'Dogs v Cats',
  windowTitle: 'KAGGLE.APP',
  oneLiner: 'Image classification, Kaggle competition.',
  role: 'Competed',
  status: 'Public',
  year: '2026',
  categories: ['ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: false,
  problem:
    'The canonical first computer vision problem, which makes it a fair test of technique rather than of novelty. Everyone has the same data, so the only variable is what you do with it.',
  built: ['[ Trained from scratch, fine tuned a pretrained backbone, or both? ]'],
  architecture: '[ Model architecture and augmentation strategy ]',
  stack: ['Python', 'Jupyter', '[ framework ]'],
  evidence: ['[ Leaderboard score and placement ]'],
  links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/dogs-v-cats_kaggle_comp' }],
}

export default project
