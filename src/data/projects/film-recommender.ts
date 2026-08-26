import type { Project } from '../types'

const project: Project = {
  slug: 'film-recommender',
  order: 60,
  title: 'Film Recommender',
  windowTitle: 'FILM_REC.APP',
  oneLiner: 'A recommender system for films.',
  role: 'Built it',
  status: 'Public',
  year: '2026',
  categories: ['ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: false,
  problem:
    '[ Every recommender demo looks the same. What made this one worth building: the dataset, the approach, or the question you were testing? ]',
  built: ['[ Collaborative filtering, content based, or a hybrid? ]'],
  architecture: '[ How were recommendations generated and served? ]',
  stack: ['Python', '[ libraries ]'],
  evidence: ['[ Evaluation metric and score ]'],
  lessons: ['[ What surprised you ]'],
  links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/film-recommender' }],
}

export default project
