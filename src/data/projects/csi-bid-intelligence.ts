import type { Project } from '../types'

// -------------------------------------------------------------------------
// Flagship, T's call on 2026-08-23: the site's job is
// getting hired, and a named client with an architecture he can draw serves
// that better than a startup that has to stay vague.
// -------------------------------------------------------------------------

const project: Project = {
  slug: 'csi-bid-intelligence',
  order: 0,
  title: 'CSI Bid Intelligence',
  windowTitle: 'CSI.APP',
  oneLiner:
    "An estimating copilot that reads a highway paving contractor's bid packages end to end and cites every figure to the page it came from. Live on their own server since August 2026.",
  // Was 'Graduate ELP team, [ your specific role on it ]'. Filled on
  // 2026-08-26 from `04_career/2026-07-13_CSI_project_resume-framing.md`,
  // which is T's own authorship honest inventory and marks all four systems
  // "T owns end to end". The team is still named, in MY CONTRIBUTION, because
  // a role chip on a team project that reads as sole authorship is the exact
  // claim a reference call breaks.
  //
  // No title. The framing doc's own section 6 asks T what his title on the
  // ELP was and never gets an answer, so inventing one here would invent the
  // one fact the source deliberately left open.
  role: 'Built the platform, on a graduate ELP team',
  // Was 'Delivered', which contradicted HOME. The deployment records win over
  // the July framing doc wherever the two disagree: on 2026-08-25 the system
  // went onto the client's own Windows Server as services that start on boot,
  // which is a stronger and more specific claim than either.
  status: "Live on the client's network",
  year: '2026',
  categories: ['data', 'ai-ml'],
  // Drafted from T's own documents on 2026-08-26 and not yet signed off by
  // him. The two questions that blocked this window, what he personally owned
  // and what the evidence is, are answered from cited sources rather than
  // guessed, but a document about T is still T's to confirm.
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  // All four cells written, 2026-08-26. EVIDENCE leads with the deployment
  // fact rather than a metric, which is the whole reason the section was
  // renamed: "running on the client's own server" is a real answer to "what
  // is the strongest proof this was real" where it is not an answer to "what
  // were your results". See CONTEXT.md, Evidence.
  atAGlance: {
    problem: 'Hundreds of pages a package, hundreds of packages a year',
    approach: 'Retrieval and agents over the plan set, cited to the page',
    output: 'A chat product and a one page bid brief',
    evidence: "Live on the client's own server since August 2026",
  },
  // Inside the 150 word cap ADR-0001 sets, no technical detail, and the
  // number before the method, which is the Pyramid Principle applied to a
  // paragraph: a reader who stops after two sentences still has the stake.
  // The $22.3M is the stake that justifies the system and never a result the
  // system produced: T's own change log settles the wording as a mispricing
  // gap being targeted, never as margin recovered.
  problem:
    'Central Specialties bids highway paving work from document packages running 100 to 280 pages. Estimators see hundreds of these a year and bid about a quarter of them, so the reading is triaged: they read what experience says matters and carry the risk in the rest. A prior analysis sized the mispricing gap at $22.3 million, in work won at prices set too low. The decision that sets the margin on a multi million dollar job is made under time pressure, on a fraction of the information.',
  built: [
    'A document pipeline that turns a plan set into structured, queryable content.',
    'A chat product where an estimator drops in a plan set and asks it questions in plain language.',
    'A one page bid brief that fuses the extracted plan with the competitor picture, exportable to markdown, CSV or PDF.',
    'A risk layer that flags the clauses and site conditions that historically cost money, each one quoted with the page it came from.',
  ],
  // ADR-0003, and the sentence at the end is deliberate rather than defensive.
  // What a reader learns from it is how T handles a client's internals, which
  // is worth more to a hiring manager than the stage detail it withholds.
  architecture:
    "The shape is the one every document intelligence system has. A plan set comes in, gets parsed and chunked, the passages that matter are retrieved, an agent with a small set of tools reasons over them, and a structured record comes out for the product to render. What makes one of these different from another is the stage internals, and those belong to the client, so this page draws the shape and stops there.",
  mlDecisions: [
    {
      label: 'Retrieval, not a trained model',
      body: 'The documents are English and the wanted fields are known, so a general model with the right passages in front of it beats a classifier trained on a corpus nobody has built. The work went into retrieval, and into checking the answer.',
    },
    {
      label: 'Every field carries its page and a confidence',
      body: 'A number an estimator cannot trace is a number they will not use. Each field returns as a value, a confidence and the page it was read from, out of one schema that also drives the export and the eval harness.',
    },
    {
      label: 'A gold set gates every change to extraction',
      body: 'Extractions are scored against a hand built gold set, so a prompt edit that improves one field and quietly breaks two others is caught before an estimator finds it.',
    },
    {
      label: 'Bulk extraction runs as a batch job, not a queue of calls',
      body: 'Moving the corpus onto a batch API with prompt caching on the static prefix was the difference between a run that was affordable and one that was not. [ The framing doc puts the saving at about 70 percent and asks you to re verify it against a current run before it is published. ]',
    },
  ],
  // Tools and techniques only. The model vendor is the one genuinely open
  // question: ADR-0003 lists model choices as mechanism, and a vendor name is
  // arguably a tool rather than a choice, but that is T's call and not an
  // agent's, so it renders as a blank until he makes it.
  stack: [
    'Python',
    'FastAPI',
    'Next.js',
    'React',
    'TypeScript',
    'Retrieval augmented generation',
    'Multi tool agent',
    'Server sent events',
    'scikit-learn',
    'Windows Server, as services',
    '[ name the model vendor? ]',
  ],
  media: [
    { caption: 'The CSI ELP team, Alexandria MN', tone: 'screenshot', src: 'csi-team.jpeg' },
    {
      caption: 'The bid brief. [ can a screenshot ship with the client data blanked out? ]',
      tone: 'screenshot',
    },
    {
      caption: 'Document in, decision out. The shape only, by agreement with the client.',
      tone: 'diagram',
      diagram: 'csi-shape',
    },
  ],
  // Ordered by strength, and the strongest thing available is not a metric.
  // Whether anything was measured is T's to say, so the two measured claims
  // that exist in his own resume material are blanks here rather than copy:
  // an agent that cannot verify a number writes the question instead.
  evidence: [
    "Deployed onto the client's own Windows Server on 25 August 2026, as two services that start on boot and need nobody logged in. Anyone on their network opens it in a browser, and every plan is processed on their hardware.",
    '[ Your resume says bid review went from up to 19 hours a plan to a 3 minute brief. Confirm it and it becomes the first line here. ]',
    '[ Any extraction accuracy figure out of the eval harness you are willing to stand behind ]',
  ],
  // Drafted 2026-08-26 from the resume framing doc, which marks all four
  // systems "T owns end to end" and records that the teammate on Plan Reader
  // was project comms and client liaison rather than a code contributor.
  // Its section 6 never gets an answer on team size or title, so that stays a
  // blank. Its section 6 also settles the competitor model: integration, not
  // authorship, and the team line says so in those words.
  contribution: {
    chips: [
      'PLAN READER PIPELINE',
      'RETRIEVAL',
      'EXTRACTION SCHEMA',
      'RISK TAXONOMY',
      'EVAL HARNESS',
      'AGENT BACKEND',
      'CHAT FRONT END',
      'SERVER DEPLOYMENT',
    ],
    team: "A graduate ELP team of [ how many, and who owned what else ]. One teammate ran client communications rather than code. The competitor model is a partner team's work: I built the integration to it, not the model.",
  },
  deepDive: [
    {
      heading: 'Deployment was configuration, not code',
      body: "The application was already service shaped: it resolved its own paths, bound the API to loopback and had a health endpoint. Getting it live meant moving it off a personal user profile onto a machine level path, building the front end for production instead of running the dev server, registering both processes as services that start on boot, and opening exactly one port. The API stays private and the front end proxies to it server side, so the browser never reaches it. Not one line of the application changed.",
    },
    {
      heading: 'The bottleneck was the PDF, not the model',
      body: 'Turning a several hundred page plan set into text was the only genuinely CPU bound stage and it dominated every run. Embedding took seconds and was never the bottleneck. Most of what looked like slow inference was the machine sitting idle waiting on network calls, which means the faster hardware everyone kept asking for would not have fixed it. The real argument for more cores was workload isolation rather than speed, and making the weaker honest case was better than winning the stronger wrong one.',
    },
    {
      heading: 'The headline metric everyone quoted was wrong',
      body: "The win rate the analysis was built on came from a summary sheet rather than from the bid rows. Recomputing it row by row moved it enough to change what the analysis recommended. The corrected figure is the client's own business data and stays with them. The transferable part is that a number nobody has re derived is not a measurement, it is a rumour with a decimal point.",
    },
    {
      heading: 'Most of the data work was the join',
      body: 'Bid records lived across several source systems with no shared key, so the first real deliverable was one master table: composite key joins with conflict tracking, and a repair pass for text that had been through two different code pages and come out doubly encoded. Only then came the models, deliberately split in two, one asking whether the contractor bids a job at all and one asking whether the bids they win are won well, both guarded so that nothing knowable only after a bid could enter a feature.',
    },
  ],
  lessons: [
    'A service that reports Running is not an application that is working. On deployment day the process manager showed both services healthy while the front end sat idle, its arguments silently dropped by the wrapper. A success signal at the wrong layer is not evidence: the process is a fact about the operating system, a listening socket is the fact about the app.',
    'A pilot that only runs while its author is in the room has not been delivered. The app worked for weeks before it was deployed, and every session began with somebody opening two terminal windows. Closing that gap was unglamorous configuration, and it was the difference between a demo and a system the client owns.',
  ],
  constraint:
    "T cleared this for the site on 2026-08-23, overriding the hold in the handoff, on the condition that it shows what was built and never the code. Per ADR-0003 this window carries the pipeline shape only, never stage internals, corpus size, cost per unit, model choices or method. Three things were read for this page and deliberately left off it: the client's hostnames, addresses, accounts and install paths, the open authentication gap on a host that also runs their ERP, and every count and dollar figure attached to the corpus. The first two because publishing a live weakness in a client's network is indefensible whatever the confidentiality rules say, the third because ADR-0003 names it outright. Client confidentiality, and not negotiable without T saying so.",
}

export default project
