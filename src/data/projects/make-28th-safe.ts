import type { Project } from '../types'

const project: Project = {
  slug: 'make-28th-safe',
  order: 120,
  title: 'MAKE 28TH SAFE!',
  windowTitle: 'MAKE_28TH_SAFE.APP',
  oneLiner:
    'Measuring how fast cars actually take my street, so the case for a crosswalk is evidence instead of complaints.',
  role: 'Neighbour with a camera',
  status: 'In progress',
  year: '2026',
  categories: ['data', 'tools'],
  copyState: 'PLACEHOLDER',
  caseStudy: false,
  problem:
    'The intersection of 15th and 28th has no crosswalk and a lot of traffic moving faster than it should. Everyone on the street knows it. Nobody can prove it, and "the neighbours think it is dangerous" is the weakest possible thing to bring to a city that has to prioritise between a hundred streets making the same claim.',
  built: [
    'A camera setup that records vehicles passing the intersection.',
    'Speed estimation from the footage, so every pass has a number attached to it.',
    'A public site that shows the distribution of speeds and the times of day it gets worst.',
    'A neighbourhood survey, so the measured data has lived experience next to it.',
  ],
  architecture:
    '[ How does a frame become a speed? Two line crossings and a timestamp, or something learned? Worth writing up, because it is the part that decides whether anyone believes the numbers. ]',
  stack: ['[ camera and mount ]', 'Python', '[ detection and tracking ]', '[ how the site is served ]'],
  evidence: [
    '[ How many vehicles measured so far, and over how many days ]',
    '[ The number that matters: what share are over the limit, and how far over ]',
    '[ What the city said when it was shared with them ]',
  ],
  constraint:
    'Shared with a city council representative by role only. T confirmed on 2026-08-24 that the official is not to be named on the public site: this is an advocacy page about a named intersection, and the person on the other side of it did not choose to be part of it.',
}

export default project
