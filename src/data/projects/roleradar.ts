import type { Project } from '../types'

// -------------------------------------------------------------------------
// Written 2026-08-26 for issue #58, from `docs/extracted/roleradar.md`. Every
// number below traces to that document, which traces to a file in the source
// repo cited by path.
//
// The lead is the finding, not the advertisement. The extraction established
// that the AutoGen GroupChat is constructed and never driven: `self.groupchat`
// is assigned once and never read, a grep for `initiate_chat` returns nothing,
// and no tool is registered to any agent. The site said "a multi agent setup
// where the scanning, the parsing and the judging are separate agents". A
// technical interviewer opens the public repo and disproves that in about
// ninety seconds, so it is gone.
//
// Of the nine copy lines the extraction checked, three are replaced rather than
// edited: the matcher line was contradicted outright, the Foundry line
// overstated, and the multi agent line was half right. The three blanks are
// filled where the walk could fill them and left as blanks where only T can.
//
// Length: the default view is prose only, roughly 650 words, inside the 400 to
// 700 ADR-0001 sets. The output contract and the failure modes are in the
// collapsed deep dive, which is what the deep dive is for.
// -------------------------------------------------------------------------

const project: Project = {
  slug: 'roleradar',
  order: 40,
  title: 'RoleRadar',
  windowTitle: 'ROLERADAR.APP',
  oneLiner:
    'A job tracker for a fixed list of target companies. One run covers 45 careers pages and gates about 9,800 postings down to about 1,100, in roughly three minutes.',
  // Was 'Built it'. The worklog reads as sole authorship end to end, but the
  // same file records distributing a shared key and setup instructions to
  // teammates, so teammates existed. A chip has to survive a reference call and
  // so does a role line: 'Built it' alone claims more than the source supports.
  role: 'Built it, on a course team',
  // Stays 'Public' deliberately. `LESSONS.md` calls it "deployed live on Azure"
  // and `WORKLOG.md` lists the App Service deploy as still open. Nothing in the
  // source says it shipped, so this does not become 'Deployed' without T.
  status: 'Public',
  year: '2026',
  categories: ['ai-ml', 'tools'],
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  atAGlance: {
    problem: 'Keyword search returns roles that share a word, not a shape',
    approach: 'Scrape weekly, gate on required tokens, generate only where judgement is needed',
    output: 'A dashboard over about 9,800 stored postings, with resume analysis per row',
    evidence: 'About 9,800 postings in a three minute run. Quality was never measured',
  },
  problem:
    'Job boards optimise for volume and a job search optimises for fit. Keyword search returns a hundred roles that share a word and none that share a shape, so most of the work is reading postings in order to reject them. The alternative is opening every careers page by hand, every week, which is the same work moved somewhere quieter. RoleRadar points at a fixed list of 45 target companies instead, on the bet that a search aimed at the companies that matter beats searching every company that exists.',
  built: [
    'A scraper that takes any careers URL, routes on the applicant tracking system behind it, and pulls the open roles.',
    'A matcher that gates every title on the tokens of 13 target role keywords before it scores anything.',
    'A dashboard over stored rows that never scrapes on page load, with a warning glyph on any company whose page failed.',
    'One generative feature: paste a resume against a stored posting and GPT-4o returns a fit score, gaps, strengths and three rewritten bullets.',
  ],
  // The honest sentence, and the one the ticket asked to lead with. The
  // extraction's own recommendation, in its words: three named agents with
  // separate system prompts and one shared orchestrator, of which one calls a
  // model and two wrap deterministic tools, run as a fixed pipeline rather than
  // as a conversation.
  architecture:
    'I built the AutoGen group chat and then never drove it. Four agent objects exist, a user proxy and three specialists with their own system prompts, wired into a GroupChat that no conversation ever starts and no tool is ever registered to. What runs instead is a fixed pipeline, scrape then match then upsert then record, handing off a Python list of dicts rather than a message. That is the right shape. Fetching a JSON endpoint and gating 9,800 titles are not judgement tasks, and a model would do both slower, dearer and less reliably. Reading a job description against a resume is, and that is the one place a model runs.',
  mlDecisions: [
    {
      label: 'A required token gate runs before the fuzzy score',
      body: 'Fuzzy similarity alone matched "AI Engineer" to "Electrical Engineer". The rebuild requires every significant token of the keyword to be present in the title before any score is computed, with short tokens matched exactly because fuzzy matching an abbreviation is noise, and longer ones matched fuzzily so plurals and typos still count. "Electrical Engineer" now fails: no ai token, and a shared head noun is not enough.',
    },
    {
      label: 'Nothing in this system has ever been scored',
      body: 'No test file, no evaluation script, no gold set. The 1,100 matches out of 9,800 postings are a count and not a precision figure: how many were worth applying for, and how many good roles the gate rejected, are both unrecorded. The match score picks which keyword to credit and is not a confidence, and the fit score is the model grading its own homework.',
    },
  ],
  stack: [
    'Python',
    'FastAPI',
    'SQLite',
    'AutoGen, pyautogen 0.2.35',
    'Azure OpenAI GPT-4o',
    'Azure AI Foundry, stubbed',
    'Docker',
    'Playwright',
    'httpx',
    'BeautifulSoup',
    'rapidfuzz',
    'APScheduler',
    'Vanilla JS and Tailwind',
  ],
  // No screenshot of this project exists in the repo yet. A media tile with
  // neither a src nor a diagram renders a labelled box, so the page shows where
  // the evidence is going rather than pretending it is there. The captions are
  // the shot list, and they are blanks so they read as unanswered.
  media: [
    {
      caption:
        '[ Screenshot the matches table: the Score column, a NEW badge, a warning glyph on a failed company. ]',
      tone: 'screenshot',
    },
    {
      caption:
        '[ Screenshot the Analyze result: fit score, gaps, strengths, the three bullet rewrites. Blank the resume. ]',
      tone: 'screenshot',
    },
  ],
  // Ordered by strength, and the strongest available thing is a run rather than
  // a metric. See CONTEXT.md, Evidence. The two blanks are the two questions the
  // walk could not answer: one needs a shell, one needs T.
  evidence: [
    'One run covered 45 careers pages and stored about 9,800 postings in about three minutes, of which about 1,100 cleared the gate.',
    'A single company validation run, wired to its own button so the pipeline is proven before the full sweep, scraped 398 postings and matched 37.',
    'The container runs locally with the dashboard, GPT-4o and Playwright verified working. It has never been deployed.',
    '[ Query seed.db and confirm the 9,800 and the 1,100. Both come from the worklog and neither has been re derived. ]',
    '[ Did it surface a role you would have missed? Nothing in the project records it. ]',
  ],
  contribution: {
    chips: [
      'SCRAPER AND ATS ROUTING',
      'TOKEN GATE MATCHER',
      'FASTAPI BACKEND',
      'SQLITE SCHEMA',
      'AGENT LAYER',
      'RESUME ANALYSIS PROMPT',
      'DASHBOARD',
      'DOCKER PACKAGING',
    ],
    team:
      '[ Who else was on the course team, and what did they own? The worklog reads as a sole build, and the same file records handing teammates a shared key and setup instructions. A chip has to survive a reference call. ]',
  },
  deepDive: [
    {
      heading: 'Stub mode is the proof that the agents were never load bearing',
      body: 'With no credentials set, every agent builder prints a line describing what it would have created and returns nothing at all. The scrape, match, store and serve flow runs unchanged, because none of it needed an agent. Only the resume analysis falls back to mock data. That is the cleanest evidence available for the finding above: the pipeline behaves identically whether the agent objects exist or not. The divergence was documented at the time, in comments in the code, which is why this reads as a design decision rather than as something being admitted under pressure.',
    },
    {
      heading: 'The one model call returns a contract, not prose',
      body: 'The resume read is the only generative step, and its shape is fixed in the prompt and enforced by JSON output mode: a fit score from 0 to 100, a two sentence summary, three gaps, two strengths, three bullet rewrites as before and after pairs, and an apply recommendation from four allowed values. That is what lets the dashboard render fields instead of parsing paragraphs. Any exception, a parse failure included, degrades to a stub whose every string is visibly marked as one, so the endpoint never returns a 500 in the middle of a demo.',
    },
    {
      heading: 'Fetching each description eagerly turned a three minute run into forty five',
      body: 'The scrape loop originally pulled the full job description for every match as it went, and the 45 company run went from about 3 minutes to about 45. The fix is to fetch lazily on the first Analyze click and cache the result in the row, and the comment defending it sits at the exact line where the eager fetch used to be so nobody puts it back. Fetching is where this project actually lives: plain HTTP first, a real browser only on evidence that the page came back empty. That browser is also why the whole thing is a container, because the deploy target allowed pip installs but not the system libraries Chromium needs.',
    },
    {
      heading: 'Eight of the forty five scrapers still return nothing',
      body: 'Some are bot blocked, and 20 of the 45 seed URLs were never confirmed to return jobs at all. The generic parser warns when a page yields fewer than three, which flags the case without fixing it. One is worse than unfixed: a dedicated parser for an aggregator board was written and is called from nowhere, because the dispatcher routes on hostname and company name and has no branch for it, and the flag on that seed row meant to select it is read by nothing and has no column in the schema. So the aggregator falls through to the generic link scanner and returns category pages instead of postings.',
    },
    {
      heading: 'The threshold in the config does not do what its own comment says',
      body: 'The config documents its match threshold as the score a title must reach to count as a match. It is not used that way. It is passed in as the per token spelling floor, and the actual match decision is whether any keyword cleared the gate at all. Raising it to 100 would not tighten matching, it would tighten typo tolerance. The dashboard compounds this with a threshold slider that adjusts nothing, which its own caption admits. Both are the same failure: a control whose name promises an effect it does not have is worse than no control, because it invites somebody to turn it.',
    },
  ],
  lessons: [
    'Build the orchestration, then check whether you need it. The group chat was constructed, guarded and documented before anything asked it to run, and the pipeline behaved identically with the agents switched off. A framework you can remove without changing behaviour was never load bearing.',
    'A count is not a score. This reports 1,100 matches out of 9,800 postings and cannot say how many were worth reading or how many good roles it threw away. Building the gold set is the boring half nobody schedules.',
  ],
  links: [{ label: 'GitHub', href: 'https://github.com/Tobias-V-Knight/roleradar' }],
  // Renders nothing. It is here so the next agent reads it before adding to
  // this window.
  constraint:
    "Two things are held back on purpose. The target company list stays a count: the 45 names are a live job search and this repo's own rule keeps target companies off the site, even though the list is public in the source repo. Reverse that only if T says so, and the window gains a much more concrete opening if he does. And no credential, endpoint, deployment name or connection string appears here. One finding was left off deliberately rather than held back: on a code reading, the location normaliser looks like it misfiles several US cities and drops one metro out of the default view entirely, because its alias test is a substring test. That is a read of the source and not an executed test, so it is not a claim yet. Run the normaliser over a list of US cities and it becomes the strongest deep dive section in this file.",
}

export default project
