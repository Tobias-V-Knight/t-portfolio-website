import type { Project } from '../types'

const project: Project = {
  slug: 'skin-care-recommender',
  order: 70,
  title: 'Skin Care Recommender',
  windowTitle: 'SKINCARE.APP',
  oneLiner: 'A recommender system for skin care products.',
  role: 'Built it',
  status: 'Public',
  year: '2026',
  categories: ['ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: false,
  problem:
    '[ Product recommendation with an ingredient constraint is a more interesting problem than film recommendation. Was that the angle? ]',
  built: ['[ What did it recommend on: ingredients, reviews, skin type? ]'],
  architecture: '[ How were recommendations generated? ]',
  stack: ['Python', '[ libraries ]'],
  evidence: ['[ Evaluation metric and score ]'],
  lessons: ['[ What surprised you ]'],
  links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/skin-care-recommender' }],
}

export default project
