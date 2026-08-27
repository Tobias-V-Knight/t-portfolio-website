import type { Project } from '../types'

// -------------------------------------------------------------------------
// The sixth case study, and the one that tested ADR-0007 within an hour of it
// being written. GED Testing Service supplied the data and is not what these
// findings are about: the subject is three hundred thousand adult learners.
// See the ADR's 2026-08-26 amendment and CONTEXT.md, Subject and source.
//
// What that clears, and what it does not:
//   ships    odds ratios on prep methods, segment shares and mean ages,
//            relative gaps, the method throughout, the model selection
//   withheld anything characterising GEDTS itself, absolute credential
//            rates per segment, and every county, borough or state name
//            paired with a rate or a gap
//
// Written from `docs/extracted/eda-6411.md` on 2026-08-26. Every figure below
// is in that file with its source cited. No mobile app p value appears here:
// two sources disagree on it and nothing in the folder settles it, so the
// decision it drove is stated and the number is not.
// -------------------------------------------------------------------------

const project: Project = {
  slug: 'ged-candidate-segmentation',
  // 45 rather than 50. The archive runs 50 to 120 and `pickletrack` holds 50,
  // and two projects sharing an order leave the sort undefined. See #88.
  order: 45,
  title: 'GED Candidate Segmentation',
  windowTitle: 'GED.APP',
  // T's choice from three drafts, 2026-08-26. It states the finding rather
  // than the problem, which the other one liners on this site do not, and it
  // is the one thing this project has that nothing else here does.
  oneLiner:
    'Segmenting three hundred thousand GED candidates on behaviour rather than demographics, and finding that where you live outweighs how you prepare.',
  // The hero meta row renders each value as a chip, and a chip is a label
  // rather than a sentence. T's full wording, chosen on 2026-08-26, is a
  // paragraph and rendered as one: two wrapped lines in a box that sits beside
  // three word chips. It is not cut, it is moved. The chip carries the short
  // form and `contribution.team` below carries T's sentence intact, which is
  // the section built for exactly that claim.
  //
  // What the sentence claims and why: two of the five steps are evidenced as
  // his. The R credential analysis carries his name in its YAML header and the
  // geocoding write up is in the first person. Who ran the K means and who
  // built the deck is not recorded, and silence is not evidence of absence, so
  // it claims the two it can and does not reach for the rest.
  role: 'Credential analysis and geocoding, on a five person team',
  // Presented to the client, which is what Delivered means on this site.
  status: 'Delivered',
  year: '2026',
  // Two models, so ai-ml as well as data. Matches 4MATIV, which ships the
  // same pair.
  categories: ['data', 'ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  // EVIDENCE is writable here where the extraction expected a blank, because
  // the finding is about candidates rather than about the client. It leads
  // with the relative gap, which is the strongest publishable statement this
  // project can make.
  atAGlance: {
    problem: 'No engagement variable existed anywhere in the data',
    approach: 'Weight prep methods by their own log odds, then segment on it',
    output: 'Four segments, a geographic priority map, a sequenced playbook',
    evidence: '19 points between best and worst segment, and demographics do not explain it',
  },
  // The analytical problem, not the client's framing, because the analytical
  // problem is the interesting one and it is what the method was built for.
  problem:
    'GED Testing Service wanted to know which of its candidates are most engaged, so it could put resources where they would move the most people to a credential. There is no engagement variable in the data. All that exists is which preparation methods each candidate ticked on a survey and whether they eventually credentialed. Confidence is a named barrier in the client\'s own framing: a large share of candidates say they are worried they will not pass, or want to study more, even when their scores say they are ready. So the question underneath the brief is whether a binary survey checkbox can stand in for an unmeasured construct well enough to segment three hundred thousand people on.',
  built: [
    'A credential analysis in R that ranks eleven preparation methods, then separates each one\'s contribution from the others.',
    'A weighted engagement score per candidate, learned from the outcome rather than assigned by opinion.',
    'A four segment clustering over 304,137 candidates, with the number of segments chosen rather than assumed.',
    'A geocoded county level layer, built because the source data had city, state and county but no candidate postcode.',
    'A sequenced playbook: four levers ordered by what blocks what, not by what is biggest.',
  ],
  architecture:
    'Five steps, and each one exists because the previous one was not enough. A phi coefficient establishes that the eleven methods are not equally informative, and cannot handle candidates using several at once. A logistic regression separates each method\'s contribution from the others. The log odds behind those coefficients become weights, which turns a survey checkbox into one continuous score. K means segments on that score plus age, demographics and motivation. Then the whole thing is rolled up to county, against a reliability floor. Presenting it as five steps each answering the last one\'s limitation is the difference between a method and a list of techniques.',
  stack: [
    'R',
    'R Markdown',
    'dplyr',
    'ggplot2',
    'broom',
    'Python',
    'pandas',
    'scikit-learn',
    'K means',
    'Logistic regression',
    'Google Geocoding API',
    'matplotlib',
  ],
  media: [
    {
      caption:
        'Odds ratios per preparation method, with confidence intervals. [ pull forest_plot.png from the figures folder ]',
      tone: 'screenshot',
    },
    {
      caption:
        'Elbow and silhouette across k, which is the argument for four. [ pull elbow_silhouette.png from the figures folder ]',
      tone: 'screenshot',
    },
  ],
  // Ordered by strength per CONTEXT.md. Every one of these is a statement
  // about candidates or about method, and none is a statement about GEDTS.
  evidence: [
    'The spread between the best and worst segment is 19 points, and demographics do not explain it. Age, race and gender alone do not produce that gap. What produces it is what a candidate uses to prepare and where they live.',
    'Engagement quality beats engagement quantity: GED Ready carries 34 percent higher odds of credentialing and online study 22 percent, while a TV study programme carries 30 percent lower and an Adult Ed class 17 percent lower, each controlling for the others. Using more methods is not the same as using better ones.',
    'Presented to the C suite and data practitioners at GED Testing Service in March 2026, after an interim submission.',
    'What GEDTS did next is [ not recorded ].',
  ],
  contribution: {
    chips: ['CREDENTIAL ANALYSIS IN R', 'LOGISTIC REGRESSION', 'ENGAGEMENT SCORE', 'GEOCODING'],
    team: 'Five person team. Built the credential analysis in R, the logistic regression that weighted the eleven prep methods and the engagement score the segmentation runs on, plus the geocoding that made the county level layer possible. Through the Carlson Analytics Lab. The clustering, the deck and the presentation are not attributed to anyone in the delivered material, so this page claims the four pieces the documents evidence and none of the rest.',
  },
  // No links. No repo was found for this project in the extraction walk, and
  // a client engagement's code may not belong in a public one anyway. That is
  // T's question rather than a formatting gap, tracked as Q-18.
  constraint:
    "GED Testing Service is a real client. ADR-0007's 2026-08-26 amendment is what makes this page writable: the client is the SOURCE of the data and is not the SUBJECT of the findings, which are about three hundred thousand adult learners. Candidate behaviour ships, GEDTS's own performance does not. Withheld and one path lookup away in `docs/extracted/eda-6411.md`: absolute credential rates per segment, every county, borough and state name paired with a rate or a gap, the client's funnel and population figures, and state and county level candidate counts. No mobile app p value appears here, because two sources disagree on it and nothing in the folder settles it.",
}

export default project
