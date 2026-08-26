import type { Project } from '../types'

const project: Project = {
  slug: 'nlp-material-classifier',
  order: 20,
  title: 'NLP Material Classifier',
  windowTitle: 'CLASSIFIER.APP',
  oneLiner:
    'A sequence to sequence classifier that reads construction bid line items and says what material they are.',
  role: 'Built it',
  status: 'Private repo',
  year: '2026',
  categories: ['ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  problem:
    'Bid items in construction documents are written by humans in a hurry, so the same material appears a dozen different ways across a dozen contractors. Anything that wants to compare prices, estimate quantities or spot an unusual line first has to agree on what the line actually is, and that agreement does not exist in the source data.',
  built: [
    'An attention mechanism written from scratch, to understand the machinery rather than to import it.',
    'A fine tuned DistilBERT classifier trained on real bid item text.',
    'A comparison between the two, which is the actual point of doing both.',
  ],
  architecture:
    'Everything runs locally on a Mac mini rather than in a hosted environment, which was a constraint worth accepting: it forced the model small enough to be practical and made the whole thing reproducible on one machine.',
  stack: ['Python', 'PyTorch', 'DistilBERT', 'Trained locally on a Mac mini'],
  evidence: [
    '[ Accuracy from scratch versus fine tuned, and on how many classes ]',
    '[ Where the from scratch version held up, and where it did not ]',
  ],
  lessons: [
    '[ Writing attention by hand teaches something specific. What was it? ]',
  ],
}

export default project
