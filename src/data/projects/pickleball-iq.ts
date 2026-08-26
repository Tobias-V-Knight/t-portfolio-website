import type { Project } from '../types'

const project: Project = {
  slug: 'pickleball-iq',
  order: 10,
  title: 'Pickleball IQ',
  windowTitle: 'PICKLEBALL_IQ.APP',
  oneLiner: 'Coaching intelligence for pickleball, built from video nobody else was reading.',
  role: 'Built the pipeline, the app and the analytics',
  status: 'Active, in use',
  year: '2025 to now',
  categories: ['product', 'ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  problem:
    'Coaching feedback in pickleball is memory based. A coach watches a match, remembers three moments, and the other two hundred rallies are gone. Players get impressions instead of evidence, and the same mistake survives for a season because nobody can point at it.',
  built: [
    'A video ingestion pipeline that turns match footage into structured rally data.',
    'An iOS app where a player or a coach reviews the match as a sequence of decisions rather than a recording.',
    'An analytics layer that surfaces patterns across matches instead of within one.',
    'A dashboard for the coaching side, where the unit of work is a player over a season.',
  ],
  architecture:
    'Footage lands in the pipeline, gets segmented into rallies, and each rally is scored on a small set of decision features. The app reads the derived data, never the raw video, which is what keeps it usable on a phone at a court with bad signal.',
  stack: ['Swift and SwiftUI', 'Node backend', 'Python analytics', 'Streamlit dashboard', 'YouTube ingestion pipeline'],
  media: [
    { caption: 'Rally breakdown, iOS', tone: 'screenshot' },
    { caption: 'Ingestion to analytics path', tone: 'diagram' },
    { caption: 'Coaching dashboard', tone: 'screenshot' },
  ],
  evidence: [
    '[ How many matches have gone through it? ]',
    '[ What changed for the coaches actually using it? ]',
  ],
  lessons: [
    'The hard part was never the model. It was deciding what counts as one rally, because every downstream number inherits that definition.',
    'Shipping the dashboard before the app was correct. Coaches will tolerate a rough interface if the data is real, and players will not.',
  ],
}

export default project
