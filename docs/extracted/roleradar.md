# Extracted: roleradar

Source material for a case study window. **Not site copy yet.** Every claim
below is traceable to a file in the RoleRadar project folder, cited by path.
Paths are relative to:

```
~/Library/Mobile Documents/com~apple~CloudDocs/00 MSBA + Coding/00_summer 2026/
  02_Gen AI for Business/Final project/roleradar/
```

Walked 2026-08-26 for issue #46. Read only: nothing in that folder was modified.

**Four rules held while writing this.**

1. No credentials. No key, endpoint, connection string or resource name appears
   here. `.env` and `env_team_share.txt` were not opened. The only environment
   variable *names* used below are the ones the project's own public `README.md`
   already prints.
2. Nothing was reconstructed. Where a figure was never written down, the entry
   reads `[ not recorded ]`, which is itself a finding.
3. **The target company list is redacted.** `docs/` in this repo says named
   target companies stay out of it (`README.md`, the `docs/` section). RoleRadar
   is built around a list of 45 companies Tobias wants to work for, so this
   document gives the count and the tier structure and never the names. One
   exception, Anthropic, which is hard coded into the app's own validation
   endpoint and printed on a button, so it cannot be described without being
   named. See the open threads at the bottom: the list is already public in the
   source repo, so this is T's call and not a fact.
4. **Nothing here was executed.** No Python was run, no server was started, no
   database was queried during this walk. Every mechanism below is read out of
   the source. Where that distinction matters, the entry says so.

---

## What it is

A job posting tracker. It scrapes the careers pages of a fixed list of target
companies on a schedule, decides which of the scraped titles are roles Tobias
would actually apply for, stores everything in SQLite, and serves a dashboard
that never scrapes on page load. On top of that sits one genuinely generative
feature: paste a resume against a stored posting and GPT-4o returns a structured
fit analysis with a score, gaps, strengths and three rewritten bullets.

Course project for MSBA 6511, Gen AI for Business, final project (`README.md`
line 7, `CLAUDE.md` line 10). Public repo:
`https://github.com/Tobias-V-Knight/roleradar`.

It is fifth in the case study order (`CONTEXT.md` in this repo, "Case study"),
and it is the project the site leans on for `Agent Orchestration` and
`Tool Calling` in the applied AI skill group (`src/data/content.ts` lines 649 to
650) and for the `AGENTIC WORKFLOWS` capability (`src/data/content.ts` line 787).
That makes the section below the load bearing one.

---

## End to end, from a posting to the screen

Three flows, and they are deliberately not connected to each other in real time
(`ARCHITECTURE.md` lines 12 to 22).

**1. Serve.** Browser to FastAPI to SQLite to dashboard. The UI reads stored
rows and never triggers a scrape. `main.py` lines 228 to 241 are plain selects;
the dashboard's four tabs are Dashboard, Companies, Roles and Locations, and Run
History (`static/index.html` lines 38 to 41).

**2. Scrape.** APScheduler fires on an interval, default 168 hours, weekly
(`config.py` line 19), or a human posts `/api/scrape` (`main.py` lines 187 to
191). Either way it lands in `RoleRadarOrchestrator.run_full_scrape`
(`foundry/orchestrator.py` lines 151 to 184), which loops the active companies
with a two second politeness delay between them (`config.py` line 22), and for
each one runs `scrape_one`: fetch, match, upsert, record. A failure is caught,
written to that company's `last_error` column, and the loop continues
(`foundry/orchestrator.py` lines 124 to 129), which the Companies tab renders as
a warning glyph with the error text in its tooltip (`static/index.html` line
241). One dead careers page never kills a run.

**3. Analyse.** The user clicks Analyze on a row, pastes resume text into a
modal, and posts to `/api/jobs/{id}/analyze` (`static/index.html` lines 322 to
326). The endpoint lazily fetches the full job description if it has never been
fetched before, caches it in the `description` column, and then calls the model
(`main.py` lines 251 to 262, `foundry/orchestrator.py` lines 133 to 149).

What the user finally sees for a match: company, title as a link out, normalised
location, which target keyword it matched, the match score, first seen date, a
NEW badge for 48 hours, and an Analyze button (`static/index.html` lines 208 to
219). What they see after analysing: a 0 to 100 fit score coloured green above
75 and red below 55, a two sentence summary, a gaps list, a strengths list, and
three bullet rewrites shown as before and after (`static/index.html` lines 326
to 338).

---

## The agent architecture

This is the section the issue asked for, and the finding is not the one the
project's own documents advertise.

### The fleet, concretely

Four AutoGen objects are constructed in `RoleRadarOrchestrator.__init__`
(`foundry/orchestrator.py` lines 38 to 48):

| Object | AutoGen class | Built in | Owns |
|---|---|---|---|
| `Orchestrator` | `UserProxyAgent`, `human_input_mode="NEVER"`, `max_consecutive_auto_reply=3` | `foundry/orchestrator.py` lines 51 to 62 | driving the conversation |
| `JobScraperAgent` | `AssistantAgent` | `agents/scraper_agent.py` lines 46 to 65 | fetching listings from one careers URL |
| `FuzzyMatchAgent` | `AssistantAgent` | `agents/matcher_agent.py` lines 37 to 50 | scoring titles against target roles, normalising locations |
| `ResumeAnalysisAgent` | `AssistantAgent` | `agents/resume_agent.py` lines 121 to 135 | resume against job description analysis via GPT-4o |

All four go into `autogen.GroupChat(agents=[...], messages=[], max_round=12)`
wrapped in a `GroupChatManager` with a 60 second timeout
(`foundry/orchestrator.py` lines 64 to 77). That is the topology the README
diagram draws (`README.md` lines 13 to 27): a star, with the UserProxy as hub
and three specialists as spokes, mediated by AutoGen's group chat speaker
selection.

### How they actually hand off

They do not. The GroupChat is built and never driven.

* `self.groupchat` is assigned at `foundry/orchestrator.py` line 46 and is never
  read again anywhere in the project. A grep for `initiate_chat` across
  `foundry/`, `agents/` and `main.py` returns nothing. No conversation is ever
  started, so `max_round=12` and `max_consecutive_auto_reply=3` guard a loop that
  never runs.
* No tool is bound to any agent. A grep for `register_function`,
  `register_for_llm` and `register_for_execution` across the same paths returns
  nothing. The system messages instruct the agents to call tools by name, "You
  call the scrape_company tool to do the actual fetching"
  (`agents/scraper_agent.py` lines 21 to 26) and "You call the fuzzy_match tool"
  (`agents/matcher_agent.py` lines 19 to 24), but no schema is registered, so no
  model could call either one.
* The real execution path is a fixed function pipeline.
  `RoleRadarOrchestrator.scrape_one` calls `scraper_agent.run_scrape_tool(name,
  url)`, parses its JSON return, passes the list to
  `matcher_agent.run_match_tool(jobs, keywords)`, and writes each row with
  `database.upsert_job` (`foundry/orchestrator.py` lines 93 to 122). The handoff
  medium is a Python list of dicts, not a message.

**The project says this itself.** `foundry/orchestrator.py` lines 14 to 19: in
live mode "real GroupChat with LLM turn taking is available; we still execute
the deterministic tools directly for speed and reliability, but the agents are
real and registered." `agents/scraper_agent.py` lines 8 to 11 says the agent
object is built "so the AutoGen architecture is genuinely present for the demo
plus grading". So the divergence is documented, in the code, in comments written
at the time. It is not something the extraction caught the project hiding.

### So what is the honest description

Two of the three agents wrap deterministic Python and would behave identically
with the AutoGen import removed:

* `run_scrape_tool` is a print, a call to `scraper.scrape_company`, an
  `ImportError` guard for a missing Playwright, and `json.dumps`
  (`agents/scraper_agent.py` lines 29 to 43).
* `run_match_tool` is a print and a call to `matcher.enrich_jobs`
  (`agents/matcher_agent.py` lines 27 to 34).

One agent genuinely calls a model, and it does not go through AutoGen either.
`resume_agent.analyze` instantiates `openai.AzureOpenAI` directly and calls
`chat.completions.create` with the deployment name as `model`, temperature 0.4,
`response_format={"type": "json_object"}`, and both the job description and the
resume truncated to 12,000 characters each (`agents/resume_agent.py` lines 93 to
109). Its output contract is fixed in the prompt: `fit_score` 0 to 100,
`fit_summary`, three `gaps`, two `strengths`, three `bullet_rewrites` as original
and rewritten pairs, and `apply_recommendation` from a four value enumeration
(`agents/resume_agent.py` lines 34 to 46). Any exception, including a JSON parse
failure, degrades to a stub whose every string is prefixed `[STUB]` and whose
summary carries the exception text, so the endpoint never returns a 500 during a
demo (`agents/resume_agent.py` lines 114 to 118).

**The accurate sentence for the site is therefore something like: three named
agents with separate system prompts and one shared orchestrator, of which one
calls a model and two wrap deterministic tools, run as a fixed pipeline rather
than as a conversation.** That is a real and defensible architecture. It is not
"agents that hand off to each other", and the site should not say it is.

### Why this is worth saying rather than hiding

The reason given in the code is a good one, and it is the same instinct that
runs through the rest of the project: deterministic where determinism is
correct, generative only where judgement is actually needed. Scraping a
Greenhouse JSON endpoint and running a token gate over 9,800 titles are not
judgement tasks. Handing them to a language model would be slower, more
expensive and less reliable, and would produce exactly the multi agent failure
modes the issue asked about. Reading a job description against a resume is a
judgement task, and that is the one place a model runs.

Stated that way it is a positioning strength for the `AGENTIC WORKFLOWS`
capability rather than an embarrassment. Stated as "multi agent orchestration"
it is a claim a technical interviewer will open the repo and disprove in about
ninety seconds.

---

## Stub mode, which is the other half of the architecture

`foundry/client.py` is the single place that decides live or stubbed, and other
modules import its flags rather than reading environment variables themselves
(lines 10 to 14).

* `FOUNDRY_STUB_MODE` is on unless `AZURE_AI_PROJECT_CONNECTION_STRING` is set
  (line 24).
* `OPENAI_STUB_MODE` is on unless both an Azure OpenAI key and endpoint are set
  (lines 28 to 30).
* `real_agents_enabled()` requires live credentials **and** an importable
  `autogen` package (lines 42 to 46).

With no credentials the agent objects are not built at all: each `build_agent`
prints a `[STUB]` line describing what would have been created and returns
`None` (`agents/scraper_agent.py` lines 52 to 55, `agents/matcher_agent.py` lines
38 to 41, `agents/resume_agent.py` lines 123 to 126). The full scrape, match,
store and serve flow still runs, because none of it needed the agents. Only the
resume analysis returns mock data.

That is the cleanest evidence for the finding above: the pipeline is unchanged
whether the agents exist or not.

---

## Why AutoGen, and what else was tried

The recorded reason, verbatim in substance from `LESSONS.md` line 13: multi
agent `GroupChat` with a very simple `AssistantAgent` API, runs locally, and
**the course required an agent framework**.

What else was evaluated: `[ not recorded ]`. No comparison against LangChain,
LangGraph, CrewAI, Semantic Kernel or a hand rolled loop appears anywhere in the
project. There is no ADR, no decision log entry and no paragraph in `LESSONS.md`
weighing alternatives. The framework was a course constraint, and the honest
case study line is that one, not a shootout that never happened.

What AutoGen cost, which *is* recorded: `pip install pyautogen` on Python 3.13
silently installs version 0.10, a restructured API with no `import autogen`
module, and every agent breaks. The fix was pinning `pyautogen==0.2.35` and
documenting Python 3.9 to 3.12 as a hard requirement, in the requirements file
itself (`requirements.txt` lines 8 to 12), in the README setup warning
(`README.md` lines 38 to 41), and in the project's `CLAUDE.md` (lines 37 to 39).
The Docker base image was then chosen partly to freeze that: Ubuntu 22.04 ships
Python 3.10 (`Dockerfile` lines 8 to 11).

---

## The Azure AI Foundry side

The question in the issue was what Foundry provides that a plain API call would
not. On this project, at runtime, **nothing**, and the project says so.

* The Foundry client is stubbed. `get_foundry_client()` returns `None` and prints
  two `[STUB]` lines unless a project connection string is set
  (`foundry/client.py` lines 49 to 54).
* The public README instructs teammates to leave that variable blank: the
  comment on that line reads "leave blank, full Foundry deploy is stubbed"
  (`README.md` line 73).
* `deploy_to_foundry()` prints and returns `{"status": "stubbed",
  "agents_registered": 3}`. It never calls the SDK (`foundry/client.py` lines 66
  to 77). It is called once at orchestrator construction
  (`foundry/orchestrator.py` line 48), so the only thing "registered in Foundry"
  in this system is a line of console output.
* The live model call bypasses Foundry entirely and uses the plain
  `openai.AzureOpenAI` client (`agents/resume_agent.py` lines 93 to 99).

What Foundry *would* have provided is written down as an explicit stub in the
README (lines 171 to 178): provision a Foundry project, register the three
agents as a hosted GroupChat through `azure-ai-projects`, attach a compute
session, and schedule the scrape through Foundry's job runner instead of the in
process APScheduler. Named integration point: `foundry/client.deploy_to_foundry()`.
The SDKs are already in the dependency list (`requirements.txt` lines 13 to 14).

What Azure OpenAI, as distinct from Foundry, did provide and a call to the
OpenAI API would not:

* Enterprise hosting and data residency, which is the stated reason for choosing
  it (`LESSONS.md` line 14).
* Structured JSON output mode, used as `response_format={"type": "json_object"}`
  (`agents/resume_agent.py` line 108), which is what lets the dashboard render
  the analysis as fields rather than parse prose.
* A deployment name indirection: `model` is an Azure deployment, not a model id,
  overridable per environment (`foundry/client.py` lines 88 to 89).

And one thing it provided that nobody asked for: the course tenant policy
blocked the *Global Standard* deployment type, so GPT-4o had to be deployed as
*Standard*, regional (`LESSONS.md` lines 108 to 110, `CLAUDE.md` lines 40 to 43,
`WORKLOG.md` lines 25 to 26). The related finding is that the Cognitive Services
form of the endpoint works with the standard SDK at its deployments route, so
the other endpoint form is not required (`LESSONS.md` lines 111 to 113).

---

## Evaluation

**Nothing in this system has ever been scored against anything.** That is the
answer, and it should be stated plainly rather than softened.

* There is no test directory, no test file and no evaluation script anywhere in
  the project. A full recursive listing, 29 files excluding caches and virtual
  environments, contains nothing named for a test or a benchmark.
* No accuracy, precision or recall figure for the matcher exists. The 45 company
  run recorded roughly 1,100 matches out of roughly 9,800 jobs (`WORKLOG.md`
  line 11), which is a count, not a score: how many of those 1,100 were roles
  Tobias would actually apply for is `[ not recorded ]`, and so is how many real
  matches the gate rejected.
* The resume analysis has never been evaluated. There is no gold set of postings,
  no second opinion, no human rating of a `fit_score`, no before and after on a
  rewritten bullet.
* `match_score` is not a correctness measure. It is `fuzz.token_sort_ratio`
  between the keyword and the title, and the code comment is explicit that it
  exists only to choose which keyword to credit when several pass the gate
  (`matcher.py` lines 91 to 102). It is displayed in the dashboard's Score
  column (`static/index.html` line 216), where a visitor will reasonably read it
  as a confidence.
* `fit_score` is the model's own opinion of itself. The README proposes it as
  the project KPI, "resume-JD fit score before/after rewrites" (`README.md` line
  190), which would mean scoring the model with the model.
* The other proposed KPI, "job-board checking 120 min/day to about 0"
  (`README.md` line 190), has no recorded measurement either. Both the 120
  minutes and the zero are `[ not recorded ]`.

The closest thing to a test is a smoke test, and it is a genuinely good one:
`POST /api/scrape/test` scrapes one company synchronously and returns jobs found
and matches, wired to a "Test Anthropic Only" button so the pipeline is proven
on one company before the full run (`main.py` lines 194 to 207,
`static/index.html` lines 294 to 299, `README.md` lines 82 to 95). It answers
"does this run" and not "is this right".

For a site whose lead capability is `EVALUATION HARNESSES` (`src/data/content.ts`
line 775), this is the sharpest available contrast: the material classifier
project built a hand adjudicated gold set before it trained anything, and
RoleRadar built none. That is a real lesson and worth writing as one.

---

## What broke

### The multi agent failure modes did not happen, and that is the finding

Loops, speaker selection deadlock, agents talking past each other, runaway token
spend inside a group chat: none of these appear in `WORKLOG.md`, `LESSONS.md` or
the code comments, because the group chat never ran. The guards against them,
`max_round=12` and `max_consecutive_auto_reply=3`, sit unexercised. If the site
wants a war story about multi agent fragility, this project does not have one,
and inventing one would break rule 9.

What broke instead was everything around the agents.

### 1. Fuzzy matching over matched, badly

The first matcher scored titles with `partial_ratio` alone, and "AI Engineer"
matched "Electrical Engineer" (`WORKLOG.md` lines 12 to 13). The rebuild is the
best piece of engineering in the project: a required token gate that runs
*before* the score. Every significant token of the keyword must be present in
the title, tokens of three characters or fewer must match exactly because fuzzy
matching an abbreviation is noise, and longer tokens may match fuzzily so that
plurals and typos still count (`matcher.py` lines 50 to 88). "Electrical
Engineer" fails because the title has no `ai` token, and the shared head noun
`engineer` is not enough. The pattern is named and carried forward as reusable
in `LESSONS.md` line 96.

### 2. Eager fetching turned a three minute run into forty five

Fetching each matched posting's full description inside the scrape loop took the
45 company run from about 3 minutes to about 45 (`WORKLOG.md` line 14,
`LESSONS.md` line 119). The fix is lazy fetch and cache, on the first Analyze
click, and it is defended in a comment at the exact line where the eager fetch
used to be so nobody puts it back (`foundry/orchestrator.py` lines 117 to 119),
plus a design invariant in the project's `CLAUDE.md` lines 52 to 55.

### 3. Eight scrapers return zero jobs

Recorded as still open: "fix the 8 zero-job scrapers (some bot-blocked 403s)"
(`WORKLOG.md` line 33). The seed list marks 20 of the 45 URLs with a `# VERIFY`
comment, meaning the URL was never confirmed to return jobs (`config.py` lines
40 to 96). The generic parser warns below three jobs, which flags the case but
does not fix it (`foundry/orchestrator.py` lines 103 to 105).

### 4. The aggregator was written and never wired up

`scraper.scrape_yc` exists (`scraper.py` lines 287 to 311) and is called from
nowhere. The dispatcher routes by hostname and company name and has no branch
for it (`scraper.py` lines 317 to 352), so the YC board falls through to the
generic link scanner. The `is_aggregator: True` flag on that seed row
(`config.py` line 95) is read by nothing: `database._seed_if_empty` inserts only
name, URL and tier (`database.py` lines 125 to 130), and the companies table has
no column for it (`database.py` lines 48 to 56). This is the mechanism behind
the recorded symptom, "the YC aggregator parser grabs category pages, not
individual postings" (`WORKLOG.md` lines 33 to 34).

### 5. Location normalisation silently misfiles US cities

Found by reading `matcher.py` lines 162 to 189 during this walk, not by running
the code, and not recorded anywhere in the project.

The alias test is a substring test, `alias in loc`, and `"la"` is an alias for
Los Angeles (`matcher.py` line 145). So any location whose lowercased string
contains the letters `la` normalises to Los Angeles. By hand, against the alias
dictionary in insertion order: "Atlanta, GA", "Dallas, TX", "Portland, OR" and
"Philadelphia, PA" all reach the Los Angeles branch and return before anything
else can correct them.

The same substring rule applies to the non US marker list, where `"uk"` is an
entry (`matcher.py` line 151). "Milwaukee, WI" contains `uk`, so it is flagged
as not US based. That matters more than it sounds, because `us_only` defaults to
true on the jobs query (`main.py` line 230) and the dashboard's US only checkbox
ships checked (`static/index.html` line 58). A Milwaukee posting is not
mislabelled on screen, it is absent from it.

This is the same shape as the silent miss the material classifier project built
a whole metric around: a wrong answer that produces no visible error. Worth
saying so on the site, because the pattern recurring across two projects is a
better story than either instance alone. **Not executed. Someone should run
`matcher.normalize_location` over a list of US cities before this appears as a
claim.**

### 6. The match threshold does not do what the config says

`config.FUZZY_MATCH_THRESHOLD` is documented as "A job title must score at least
this high against one of the target-role keywords to count as a match"
(`config.py` lines 25 to 26). It is not used that way. It is passed in as
`fuzz_floor`, the per token floor for tokens longer than three characters
(`matcher.py` lines 62 to 84), and the match decision is `best_score > 0.0`,
which is simply "did any keyword clear the gate" (`matcher.py` lines 118 to
119). Raising the threshold to 100 would not tighten matching, it would tighten
per token spelling tolerance.

The dashboard compounds this by rendering a "Fuzzy threshold" slider that
adjusts nothing. Its own caption admits it: "Display-only slider, server default
is set in config.py" (`static/index.html` lines 121 to 125).

### 7. The gate fixes distinguishing tokens, not extra ones

Also from reading `matcher.py` lines 78 to 88, not recorded in the project. The
gate requires every keyword token to be present, and says nothing about adjacency
or about extra tokens. "Product Marketing Manager" contains both `product` and
`manager`, so it clears the "Product Manager" gate and is stored as a match.
This is the intended cost of a precision gate on presence, and it is a good
lesson to write down beside the win, because the same gate is proposed for reuse
on CSI bid and entity matching (`LESSONS.md` line 96).

### 8. Playwright cannot be installed on a locked runtime

Playwright needs Chromium plus a long list of Linux system libraries, and Azure
App Service's standard Python runtime lets you `pip install` but not install
system libraries, so Chromium cannot launch (`LESSONS.md` lines 63 to 72). This
is the reason the project is containerised at all: the Dockerfile starts from
Microsoft's Playwright Python image, which already ships the browser and its
libraries (`Dockerfile` lines 1 to 11). The three things Docker bought are
written down: Playwright in the cloud, a frozen Python 3.10 that cannot hit the
pyautogen trap, and teammates who run one command with no Python installed at
all (`LESSONS.md` lines 77 to 84).

### 9. Two smaller traps, both recorded

`docker --env-file` is stricter than `python-dotenv`: no spaces around the
equals sign, where dotenv tolerates them, so a working local `.env` fails inside
the container (`LESSONS.md` lines 114 to 115, `README.md` lines 136 to 137). And
never put a virtual environment inside an iCloud synced folder, because iCloud
thrashes on thousands of small files; the venv for this project lives at
`~/venvs/roleradar`, outside iCloud (`LESSONS.md` lines 116 to 117, `CLAUDE.md`
lines 32 to 33).

### 10. The architecture diagram does not render

`ARCHITECTURE.md` line 9 points at `docs/architect1ure.png`. The file on disk is
`docs/architecture.png`. The image is broken in the only document that shows the
system as a picture, and it has presumably been broken since it was written.

---

## Numbers, and which ones to trust

| Figure | Value | Where it comes from |
|---|---|---|
| Seed companies | **45** entries: 11 tier 1, 13 tier 2, 9 tier 3, 11 tier 4, 1 aggregator | counted in `config.py` lines 40 to 96 during this walk |
| Companies with an unverified URL | 20 of 45 carry a `# VERIFY` comment | `config.py` lines 40 to 96 |
| Target role keywords | **13** | `config.py` lines 101 to 115 |
| Target locations seeded | **7**, six cities plus Remote | `config.py` lines 121 to 128 |
| Jobs in the shipped dataset | about **9,800** | `WORKLOG.md` line 11, `README.md` line 53, `LESSONS.md` line 147 |
| Matches in that dataset | about **1,100** | `WORKLOG.md` line 11, `LESSONS.md` line 147 |
| Full run time | about **3 minutes** | `WORKLOG.md` line 11 |
| Anthropic validation run | **398 jobs, 37 matched** | `WORKLOG.md` line 10 |
| Before the lazy fetch fix | **45 minutes** | `WORKLOG.md` line 14 |
| Companies reachable without a browser | roughly **65 to 75 percent** | `LESSONS.md` lines 55 to 58 |
| Scrapers returning zero jobs | **8** | `WORKLOG.md` line 33 |
| Scrape schedule | 168 hours, weekly, env overridable | `config.py` line 19 |
| Match rate of the resume analysis against any ground truth | `[ not recorded ]` | no evaluation exists |
| Time saved, the stated KPI | `[ not recorded ]` | `README.md` line 190 proposes it and nothing measures it |

**Three cautions before any of these reach the site.**

*The company count is inconsistent across the project's own documents.*
`README.md` line 3 says "35+", `ARCHITECTURE.md` line 3 and the project's
`CLAUDE.md` line 8 say "40+", `WORKLOG.md` and `LESSONS.md` say 45. The seed
list has 45 entries. Use 45 and cite `config.py`, or use "more than 40", but do
not repeat "35+".

*The 9,800 and 1,100 figures were not verified in this walk.* They come from the
written record. `seed.db` is on disk and could be queried to confirm both
exactly, and this machine could not run the query. That is a five second job for
anyone with a shell.

*The httpx against Playwright split is an estimate.* `LESSONS.md` line 55 labels
it "rough split" and gives ranges. It is not instrumented anywhere: the fetch
path is returned by `fetch_smart` as a string and printed, never counted
(`scraper.py` lines 83 to 101). Quote it as an impression or not at all.

---

## What the site says today that the source does not support

`src/data/content.ts` lines 267 to 296, currently flagged
`copyState: 'PLACEHOLDER'`.

| Line | Current copy | Status against the source |
|---|---|---|
| 271 | "Drop in a target company URL and it finds the roles worth your time." | **Supported.** Companies tab, Add Company, any careers URL, with ATS auto detection (`README.md` lines 99 to 105, `scraper.py` lines 317 to 352) |
| 281 | "A scanner that takes a company URL and pulls its open roles." | **Supported** |
| 282 | "A matching layer that scores those roles against a profile rather than against a keyword." | **Wrong.** The matcher scores titles against a list of 13 keywords (`config.py` lines 101 to 115, `matcher.py` lines 91 to 124). The resume is used later, per posting, on demand, by a different component. As written it inverts the actual design |
| 283 | "the scanning, the parsing and the judging are separate agents" | **Half right.** The three are scraping, matching and resume analysis. Parsing is not an agent, it lives inside `scraper.py`. And they are separate modules called in sequence, not agents that hand off |
| 286 | "Built on AutoGen with Azure AI Foundry behind it." | **Overstated on Foundry.** Foundry is stubbed and the README tells users to leave its connection string blank (`foundry/client.py` lines 49 to 77, `README.md` line 73). "Azure OpenAI" is the accurate phrase for what runs |
| 286 | "a scanner that fails is a different failure from a judge that is wrong, and keeping them apart makes it obvious which one broke" | **True of the modules, and worth keeping**, but it is a consequence of the module boundaries and the per company error capture (`foundry/orchestrator.py` lines 124 to 129), not of the agent framework |
| 289 | blank: "Did it actually surface roles you would have missed?" | `[ not recorded ]`. Only T can answer this |
| 290 | blank: "How many companies have you run it against?" | **Answerable now:** 45, about 9,800 jobs, about 1,100 matches, roughly a 3 minute run |
| 293 | blank: "Multi agent setups are often slower and more fragile than one good prompt. Was that true here?" | **Answerable now, and the answer is better than the question.** The multi agent layer was never on the execution path, so it cost nothing at runtime and bought nothing either. The deterministic pipeline is what shipped |

One more, outside the project object: `LESSONS.md` line 143 describes RoleRadar
as "deployed live on Azure". `WORKLOG.md` lines 31 to 32 list the App Service
deploy as still open, and the project's `CLAUDE.md` line 22 says the next step is
to deploy the container. **Nothing in the source says it was ever deployed.** The
site's current `status: 'Public'` is correct and should not become "Deployed"
without T confirming it out of band. Docker running locally with the dashboard,
GPT-4o and Playwright verified is what is recorded (`WORKLOG.md` lines 16 to 17).

---

## Filling the case study template

Against the eleven sections in ADR-0001, with the At a glance cells from
`CONTEXT.md`.

| Slot | What the source supports |
|---|---|
| PROBLEM cell | Checking job boards by hand, and keyword search returning roles that share a word rather than a shape |
| APPROACH cell | Scrape on a schedule, gate on required tokens, generate only where judgement is needed |
| OUTPUT cell | A dashboard over about 9,800 stored postings with resume against posting analysis per row |
| EVIDENCE cell | Weakest of the four. The honest entries are the dataset size and the run time. There is no measured quality number, see Evaluation |
| Problem | `README.md` lines 3 to 5, plus the KPI framing at line 190 stated as an intention rather than a result |
| System | The three flows above. The diagram in `ARCHITECTURE.md` is the right shape and its image link is broken |
| ML decisions | The token gate over pure fuzzy scoring. httpx first, browser only on evidence that the page is empty. Deterministic where determinism is correct, model only for the resume read |
| Evidence | Dataset size, run time, the Anthropic validation run. Say plainly that quality was never measured |
| Product | The four tabs, the NEW badge, the warning glyph per failing company, the Analyze modal |
| Contribution | Sole build. `WORKLOG.md` line 3 covers 2026-06-27 to 07-01 end to end, though it does record sharing a key with teammates, so a team sentence may be owed. See open threads |
| Stack | Python, FastAPI, SQLite, AutoGen (`pyautogen` 0.2.35), Azure OpenAI GPT-4o, Docker, Playwright, httpx, BeautifulSoup, rapidfuzz, APScheduler, vanilla JS with Tailwind from a CDN (`LESSONS.md` lines 11 to 23, `requirements.txt`) |
| Deep dive | The agent architecture section above, written honestly, is the strongest deep dive material in the project |
| Lessons | httpx against Playwright as a mental model (`LESSONS.md` lines 27 to 58), why Docker (lines 63 to 84), the eight reusable patterns (lines 89 to 98), and the four gotchas (lines 104 to 119) |

---

## A note on what is actually public

`.gitignore` lines 27 to 32 exclude `LESSONS.md`, `CLAUDE.md`, `ARCHITECTURE.md`,
`WORKLOG.md` and the whole `docs/` folder from the repo. So the GitHub link the
site already carries (`src/data/content.ts` line 295) leads to `README.md`, the
code, `seed.db`, the Dockerfile, `setup.sh` and the dashboard, and to none of the
architecture writing quoted above. The architecture diagram is not published
anywhere.

Two consequences. A visitor who follows the link sees the code and can verify
every claim in the agent architecture section, which is an argument for writing
that section honestly rather than a reason to worry. And if the case study wants
to show a system diagram, one has to be redrawn for the site, because
`docs/architecture.png` is local only and, per finding 10, the document that
embeds it points at the wrong filename.

Secrets hygiene held: `.env`, `env_team_share.txt`, `*secret*` and `*credentials*`
are all gitignored (`.gitignore` lines 1 to 7) and the Dockerfile comment
confirms `.dockerignore` keeps them out of the image (`Dockerfile` lines 24 to
25). No credential was opened during this walk.

---

## Open threads for Tobias

Not blockers on this document, but they gate the case study window.

1. **Rule on the target company list.** It is public in `config.py` in the
   source repo, and this repo's own `docs/` rule says target companies stay out.
   The names are also a live job search. Redacted here as the conservative
   reading. If the case study may name the tier 1 companies, say so and the
   window gains a much more concrete opening.
2. **Decide what the architecture sentence says.** The recommendation in this
   document is to describe the fixed pipeline and the one generative agent
   accurately, and to keep AutoGen and Foundry in the stack list without
   claiming the group chat ran. That is a positioning call, not a fact, so it is
   T's.
3. **Confirm it was never deployed.** `LESSONS.md` line 143 says deployed,
   `WORKLOG.md` says the deploy is still next. If it went to App Service or
   Railway after 2026-07-01, the project folder does not know about it.
4. **Query `seed.db` and confirm the counts** for jobs, matches and companies,
   so 9,800 and 1,100 stop being approximations from a worklog. This machine
   could not run the query.
5. **Run `matcher.normalize_location` over a list of US cities** before finding 5
   is stated anywhere public. It is a code reading, not an executed test.
6. **Was this a solo build or a team project?** `WORKLOG.md` line 3 reads as
   sole authorship, but the same file and the README describe distributing a
   shared key, `setup.sh` and Windows instructions to teammates. The
   contribution chips have to pass a reference call (`CONTEXT.md`,
   "Contribution chip"), so the team sentence needs to be right.
7. **Decide whether the site claims the time saved.** The 120 minutes a day in
   the README is a course rubric estimate, not a measurement. It reads as a
   result on a portfolio page.
