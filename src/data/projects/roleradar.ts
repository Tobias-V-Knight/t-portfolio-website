import type { Project } from '../types'

const project: Project = {
  slug: 'roleradar',
  order: 40,
  title: 'RoleRadar',
  windowTitle: 'ROLERADAR.APP',
  oneLiner: 'Drop in a target company URL and it finds the roles worth your time. That simple.',
  role: 'Built it',
  status: 'Public',
  year: '2026',
  categories: ['ai-ml', 'tools'],
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  problem:
    'Job boards optimise for volume, and a job search optimises for fit. Searching by keyword returns a hundred roles that share a word and none that share a shape, so the work of a search is mostly reading postings to reject them.',
  built: [
    'A scanner that takes a company URL and pulls its open roles.',
    'A matching layer that scores those roles against a profile rather than against a keyword.',
    'A multi agent setup where the scanning, the parsing and the judging are separate agents with separate jobs.',
  ],
  architecture:
    'Built on AutoGen with Azure AI Foundry behind it. Splitting the work across agents rather than one long prompt was the design decision: a scanner that fails is a different failure from a judge that is wrong, and keeping them apart makes it obvious which one broke.',
  stack: ['Python', 'AutoGen', 'Azure AI Foundry'],
  evidence: [
    '[ Did it actually surface roles you would have missed? ]',
    '[ How many companies have you run it against? ]',
  ],
  lessons: [
    '[ Multi agent setups are often slower and more fragile than one good prompt. Was that true here? ]',
  ],
  links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/roleradar' }],
}

export default project
