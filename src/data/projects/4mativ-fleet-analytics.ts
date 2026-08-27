import type { Project } from '../types'

// -------------------------------------------------------------------------
// Written 2026-08-26 for issue #59, from `docs/extracted/eda-6411.md` and
// from nothing else. The delivered deck the ticket names,
// `4MATIV Live Case_draft_4.12.2026 .pdf`, sits outside this session's
// allowed directories and could not be opened, so every claim below traces
// to the extraction, which traces to the knowledge transfer document.
//
// The slug and the title say anomaly detection. Anomaly detection is one
// layer of four, and the extraction is right that M1's own framing is
// better: telling a broken device apart from a driver who skipped the
// route. Renaming the entry is Q-17 and belongs to T, so the copy widens
// instead and the slug stays where the routing already points.
//
// Budget, counted by hand: 65 words above the fold against ADR-0001's 50
// to 100, and about 660 in the body sections against its 400 to 700. Six
// beats that wanted to be in the body are in the collapsed deep dive
// instead, which is the job the deep dive exists to do.
// -------------------------------------------------------------------------

const project: Project = {
  // Renamed from 4mativ-anomaly-detection on 2026-08-26, hours after it went
  // live and while the cost was still one edit rather than a dead link. Anomaly
  // detection is layer three of four. The page also covers signal quality
  // scoring, the in service window, corridor learning and the rollup, and the
  // slug is the one part of a case study a reader sees before the copy.
  slug: '4mativ-fleet-analytics',
  order: 30,
  // Was '4mativ Anomaly Detection'. The company is '4MATIV Technologies' in
  // RESUME and '4MATIV.APP' in the window title, so the lower case spelling
  // here was the only one of the three that disagreed. Casing only: the
  // slug, the route and the file name are untouched.
  title: '4MATIV Fleet Analytics',
  windowTitle: '4MATIV.APP',
  oneLiner:
    'Every school bus vendor with its own GPS, and no way to tell a broken device from a driver who skipped the route. Scoring those two things separately is the whole design.',
  // Nothing in the delivered folder attributes a layer, a script or a chart
  // to a person, and the two labels it uses for the team disagree with each
  // other. Five people is the one fact the material settles, so it is the
  // only fact this chip states. Q-14. Do not infer a role from the fact that
  // these files are in T's iCloud.
  role: 'Five person team, [ T to confirm your part ]',
  // Was 'Public'. It is a client engagement and none of it is public: it was
  // presented and handed over, which is what 'Delivered' means on this site.
  status: 'Delivered',
  year: '2026',
  // Was ['data'] only. The comment on `Category` in types.ts sets the test,
  // a project gets AI / ML only if there is a model in it, and there are
  // three: an Isolation Forest, DBSCAN and Local Outlier Factor. Q-07 is
  // open on this taxonomy generally; this is the existing rule applied, not
  // a new one written.
  categories: ['data', 'ai-ml'],
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  // EVIDENCE is a delivery fact and never a performance figure, because
  // every performance figure this project produced is the client's own
  // operating data. See `constraint` at the foot of this file.
  atAGlance: {
    problem: 'A dead device and a skipped route looked identical',
    approach: 'Score signal quality and route execution on separate axes',
    output: 'A four layer pipeline, vendor scorecards and a dashboard',
    evidence: 'Handed over with the document needed to maintain it',
  },
  problem:
    '4mativ coordinates school transport across a set of vendors, each running its own GPS hardware on its own polling standard. When a route underperforms, nobody can say why. A bus that reports almost nothing might have a dead device or a driver who never ran the route, and the raw feed reads the same either way. That answer decides the intervention: a performance warning, a hardware audit, or a benchmark worth copying. Getting it backwards sends a driver warning to a vendor whose drivers are fine. A fleet of vendors, six months of pings, and no defensible way to say which of them was failing.',
  built: [
    'A four layer Python pipeline, with per layer notebooks and rerun flags so the slowest layer can be skipped.',
    "A Streamlit dashboard on the client's own cloud, whose scorecard carries live weight sliders so an operations manager can reweight the axes and watch the vendors move.",
    'Scored outputs per vendor and per route, across three stakeholder lenses.',
    'A knowledge transfer document, so their technical team can maintain all of it without us.',
  ],
  architecture:
    "Four layers, and the reason there are four is that two of them measure different things on purpose. Layer 1 scores GPS connection health per trip. Layer 2 finds the window in which the bus was actually in service, geofencing the first and last planned stop. Layer 3 learns each route's normal corridor and labels every ping against it. Layer 4 rolls trip level scores up to route and vendor. Signal quality and route execution stay on separate axes to the last step, which is what turns a ranking into a diagnosis.",
  // Three methods, three reasons. The point of naming all three is that each
  // one answers a question the others cannot, which is method selection
  // rather than reaching for the first thing that fits.
  mlDecisions: [
    {
      label: 'One Isolation Forest per provider, not one for the fleet',
      body: 'Providers poll at different intervals, so at road speed the gap between consecutive pings differs by hundreds of metres between one vendor and the next. A fleet wide model would score the slow pollers worse for being slow rather than for being late, so each forest fits one provider group and normalises within it.',
    },
    {
      label: "DBSCAN learns each route's corridor rather than reading the one on file",
      body: 'Normal is where the buses actually drove, not where the route file says they should have. DBSCAN over historical pings, grouped by route and by trip type, with morning and afternoon runs trained separately so that opposite direction corridors do not contaminate each other. A route with too little history falls back to a global model rather than to a confident wrong answer.',
    },
    {
      label: 'Local Outlier Factor asks the question a ping cannot answer',
      body: 'Ping level labels say where the bus was, not whether the trip as a whole was normal. Local Outlier Factor over trip level features asks the second question.',
    },
  ],
  stack: [
    'Python',
    'pandas',
    'NumPy',
    'scikit-learn',
    'Isolation Forest',
    'DBSCAN',
    'Local Outlier Factor',
    'Haversine geofencing',
    'Streamlit',
    'Plotly',
  ],
  media: [
    {
      caption:
        'The vendor scorecard and its weight sliders. [ can this ship with the vendor names and scores blanked out? ]',
      tone: 'screenshot',
    },
    {
      caption:
        'Four layers, two of them measuring different things on purpose. [ diagram ticket ]',
      tone: 'diagram',
    },
  ],
  // Ordered by strength, and the first is a measured delta rather than a
  // level: the correction is publishable, the figures it moved are not.
  // Nothing here is a vendor score.
  evidence: [
    'Correcting for depot pings moved fleet completion down 7 points. Devices start pinging when the engine starts, so pings from the yard were earning credit at stops near it. We shipped the corrected figure and told the client in writing not to use the old one.',
    'Delivered to 4mativ as a running pipeline, a deployed dashboard, and the maintenance document their technical team works from.',
  ],
  // A chip is a first person claim and the test it has to pass is a
  // reference call, so this project has no chips yet. The blank is the
  // correct output here, not a gap in the work. CONTEXT.md, Contribution
  // chip, and Q-14 in the extraction.
  contribution: {
    chips: ['[ which layers were yours? ]'],
    team: 'A five person team, through the Carlson Analytics Lab. [ Nothing in the delivered folder attributes a layer or a script to a person, so this page claims nothing. Name your part and the chips write themselves. ]',
  },
  deepDive: [
    {
      heading: 'Every flag routes to the person who has to pick up the phone',
      body: 'DETOUR and WRONG_ROUTE go to vendor operations, FROZEN_DEVICE and GPS_JUMP to the GPS provider, DATA_GAP to driver training or cellular coverage. Each is a threshold anybody can check without a model: a ping too far off the learned corridor, an implied speed no bus reaches, near zero variance across consecutive coordinates, a reporting gap. A DBSCAN label of minus one is noise and goes to nobody, because it is a mathematical byproduct and not a failure. Sorting the flags into behavioural, hardware and coverage faults is the part of this the client can act on without a data scientist in the room.',
    },
    {
      heading: 'Completion is bimodal, and the average hides it completely',
      body: 'Several high volume vendors show a dumbbell distribution rather than a spread: trips complete either none of their stops or all of them, with very little in between. Drivers are not skipping a stop or two. Whole routes are either run or not run. An average completion rate reports a middling number that describes almost none of the actual trips, and it changes the intervention from tighten up to find out why entire routes are going unrun.',
    },
    {
      heading: 'The detour finding names the thing that could invalidate it',
      body: 'Detour dominates the anomaly mix, which reads as drivers leaving planned corridors rather than devices failing. It could equally mean the official route definitions are out of date, and off corridor detections appearing across many vendors at once is exactly what that would look like. So the handoff tells the client to verify the route definitions before using detour rates in a contract review. A finding that cannot survive its own caveat being stated out loud was not a finding. Five further questions went back open rather than closed by assumption, including whether a wrong route trip should trigger an automatic dispatch review.',
    },
    {
      heading: 'One set of components, three stakeholders, three sets of weights',
      body: 'Five components score at trip level: completion, corridor, coverage, data quality and on time. A parent asks whether the bus came, so their lens leans almost entirely on completion. A vendor scorecard has to be arguable, so completion gives ground to corridor. Real time dispatch cares where the bus is now, so corridor and coverage carry it. The dashboard ships the weights as sliders rather than baking them in, which is the difference between handing over a ranking and handing over an argument.',
    },
    {
      heading: 'On time shipped at almost no weight, with the reason written down',
      body: 'Nobody had confirmed whether the scheduled pickup time in the export meant arrival at the first student stop or departure from the depot, and per stop scheduled times were not in the data at all. Dropping the component would have hidden a real dimension of service. Weighting it properly would have scored vendors against a definition nobody could vouch for. It went in at almost no weight, on the vendor lens only, with the ambiguity recorded in the handoff as a question for the client.',
    },
    {
      heading: 'Two stop identifiers, and only one of them is a place',
      body: 'A stop instance on one route and a physical location shared across routes are different identifiers in the source data. Join on the wrong one and a bus running the wrong route earns credit for visiting a stop it happened to drive past, which inflates exactly the completion metric the whole analysis rests on. Most of the accuracy in this project came from data decisions like that one rather than from anything the models did.',
    },
  ],
  lessons: [
    'Comparing vendors on one axis meant first proving the axis was fair. The slow polling vendors looked worse on every raw signal metric while being no worse at all, so normalising within provider group came first. Skip that and the leaderboard ranks procurement decisions and calls it performance.',
    'The deliverable worth having was not the ranking. A blended score would have buried the vendors whose drivers execute and whose hardware cannot prove it, and sent them a driver warning instead of a hardware audit. Splitting the axes gave those vendors a quadrant of their own, and each flag names who has to act on it.',
  ],
  constraint:
    "4mativ is a real client and a live prospect, and this analysis scores its own transport vendors, which makes it one company's assessment of other companies. **Shape only.** T answered Q-15 on 2026-08-26 with the stricter of the two rules that were in play: the extraction would have allowed parameters, dataset scale and relative deltas, and CLAUDE.md's client rule does not, so CLAUDE.md wins. Cut on that basis: the fleet and corpus counts, the polling intervals and the metre distances they imply, the DBSCAN and geofence radii, the Local Outlier Factor threshold and feature count, the flag thresholds, and every scoring weight. What stays is the pipeline shape, why each model was chosen over the others, the data decisions, and the delivery. Per vendor scores, quadrant assignments, absolute performance levels and the teammates' names were never in scope. Every withheld figure is one path lookup away in `docs/extracted/eda-6411.md` rather than lost.",
  // Was a hard link to github.com/Tobias-V-Knight/4mativ-anomaly-detection.
  // Nothing in the extraction evidences that repo: the code sits in iCloud
  // with the client data directory gitignored as privacy sensitive, and
  // whether a public repo of a client pipeline should exist at all is a
  // confidentiality question rather than a formatting one. A blank href
  // renders as a dead chip that says so, which keeps the question visible
  // instead of quietly shipping a link that may 404.
  links: [{ label: 'GitHub', href: '[ is there a public repo for this, and should there be? ]' }],
}

export default project
