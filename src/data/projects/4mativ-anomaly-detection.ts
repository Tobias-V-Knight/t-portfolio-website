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
  slug: '4mativ-anomaly-detection',
  order: 30,
  // Was '4mativ Anomaly Detection'. The company is '4MATIV Technologies' in
  // RESUME and '4MATIV.APP' in the window title, so the lower case spelling
  // here was the only one of the three that disagreed. Casing only: the
  // slug, the route and the file name are untouched.
  title: '4MATIV Anomaly Detection',
  windowTitle: '4MATIV.APP',
  oneLiner:
    'Sixteen school bus vendors, sixteen kinds of GPS, and no way to tell a broken device from a driver who skipped the route. Scoring those two things separately is the whole design.',
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
    '4mativ coordinates school transport to two schools across sixteen vendors, each running its own GPS hardware on its own polling standard. When a route underperforms, nobody can say why. A bus that reports almost nothing might have a dead device or a driver who never ran the route, and the raw feed reads the same either way. That answer decides the intervention: a performance warning, a hardware audit, or a benchmark worth copying. Getting it backwards sends a driver warning to a vendor whose drivers are fine. Sixteen vendors, 640 routes, six months of pings, and no defensible way to say which of them was failing.',
  built: [
    'A four layer Python pipeline, with per layer notebooks and rerun flags so the slowest layer can be skipped.',
    "A Streamlit dashboard on the client's own cloud, whose scorecard carries live weight sliders so an operations manager can reweight the axes and watch the vendors move.",
    'Scored outputs per vendor and per route, across three stakeholder lenses.',
    'A knowledge transfer document, so their technical team can maintain all of it without us.',
  ],
  architecture:
    "Four layers, and the reason there are four is that two of them measure different things on purpose. Layer 1 scores GPS connection health per trip. Layer 2 finds the window in which the bus was actually in service, geofencing the first and last planned stop at 100 metres. Layer 3 learns each route's normal corridor and labels every ping against it. Layer 4 rolls trip level scores up to route and vendor. Signal quality and route execution stay on separate axes to the last step, which is what turns a ranking into a diagnosis.",
  // Three methods, three reasons. The point of naming all three is that each
  // one answers a question the others cannot, which is method selection
  // rather than reaching for the first thing that fits.
  mlDecisions: [
    {
      label: 'One Isolation Forest per provider, not one for the fleet',
      body: 'Two providers poll every 60 seconds and two every 20, which at 30 mph is 804 metres between pings against 268. A fleet wide model would score the slow vendors worse for being slow, so each forest fits one provider group and normalises within it.',
    },
    {
      label: "DBSCAN learns each route's corridor rather than reading the one on file",
      body: 'Normal is where the buses actually drove. DBSCAN at 150 metres over historical pings, grouped by route and by trip type, with morning and afternoon runs trained separately so that opposite direction corridors do not contaminate each other. Below three trips, a route falls back to a global model.',
    },
    {
      label: 'Local Outlier Factor asks the question a ping cannot answer',
      body: 'Ping level labels say where the bus was, not whether the trip as a whole was normal. Local Outlier Factor over eight trip level features flags those, above a score of 3.0.',
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
    '14,859 trips, 640 routes, 16 vendors, 2 schools and about 2.35 million GPS pings, September 2025 to February 2026.',
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
      body: 'DETOUR and WRONG_ROUTE go to vendor operations, FROZEN_DEVICE and GPS_JUMP to the GPS provider, DATA_GAP to driver training or cellular coverage. Each is a threshold anybody can check: a ping more than 150 metres off the learned corridor, an implied speed above 80 mph between consecutive pings, near zero variance across consecutive coordinates, a gap over five minutes. A DBSCAN label of minus one is noise and goes to nobody, because it is a mathematical byproduct and not a failure. Sorting the flags into behavioural, hardware and coverage faults is the part of this the client can act on without a data scientist in the room.',
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
      body: 'Five components score at trip level: completion, corridor, coverage, data quality and on time. A parent asks whether the bus came, so the parent facing lens weights completion at 70 percent. A vendor scorecard has to be arguable, so completion drops to 45 and corridor rises. Real time dispatch cares where the bus is now, so corridor and coverage carry it. Route execution, the Y axis of every matrix, is completion at 0.60 plus corridor at 0.40. The dashboard ships the weights as sliders, which is the difference between handing over a ranking and handing over an argument.',
    },
    {
      heading: 'On time shipped at 2 percent weight, with the reason written down',
      body: 'Nobody had confirmed whether the scheduled pickup time in the export meant arrival at the first student stop or departure from the depot, and per stop scheduled times were not in the data at all. Dropping the component would have hidden a real dimension of service. Weighting it properly would have scored vendors against a definition nobody could vouch for. It went in at 2 percent, on the vendor lens only, with the ambiguity recorded in the handoff as a question for the client.',
    },
    {
      heading: 'Two stop identifiers, and only one of them is a place',
      body: 'A stop instance on one route and a physical location shared across routes are different identifiers in the source data. Join on the wrong one and a bus running the wrong route earns credit for visiting a stop it happened to drive past, which inflates exactly the completion metric the whole analysis rests on. Most of the accuracy in this project came from data decisions like that one rather than from anything the models did.',
    },
  ],
  lessons: [
    'Comparing sixteen vendors on one axis meant first proving the axis was fair. The slow polling vendors looked worse on every raw signal metric while being no worse at all, so normalising within provider group came first. Skip that and the leaderboard ranks procurement decisions and calls it performance.',
    'The deliverable worth having was not the ranking. A blended score would have buried the vendors whose drivers execute and whose hardware cannot prove it, and sent them a driver warning instead of a hardware audit. Splitting the axes gave those vendors a quadrant of their own, and each flag names who has to act on it.',
  ],
  constraint:
    "4mativ is a real client and this analysis scores its own transport vendors, which makes it one company's assessment of other companies. This page is method and outcome only. `docs/extracted/eda-6411.md` draws the line and holds it: method, algorithm, parameters, pipeline shape, dataset scale and relative deltas may ship, while absolute performance levels, per vendor scores, quadrant assignments and the names of the teammates may not. Each withheld figure is one path lookup away in that file rather than lost. The 7 point correction is cleared as a delta; the figures it moved are not, and no sentence here states a level. Q-15 in the extraction asks whether T clears 4mativ the way he cleared CSI on 2026-08-23. Until he answers it, nothing withheld there gets backfilled here.",
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
