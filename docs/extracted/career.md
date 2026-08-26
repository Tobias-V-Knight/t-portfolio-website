# Career extraction

Produced 2026-08-25 for issue #5. This exists to seed the blank fields in
`cv.experience` and `cv.education` in `src/data/content.ts`. **Nothing here has
been wired into `content.ts`.** Tobias reads this first, a follow up wires it in.

**Extract, never generate.** Every title, employer and date below is copied from
a document and cites the document. Anything the documents do not settle is
marked `[ blank ]` or sits under "Still open on Tobias". Nothing was inferred
into a fact.

**What is deliberately not here.** This repo is public, so no salary, no offers,
no rejections, no interview content, and no named recruiters or named target
companies. Two source files are interview and networking material. They are
cited with the company and person names replaced by `[redacted]`, because the
sentence quoted from them is about employment history and the filename is about
a live job search.

## Sources

Every path below is relative to:

```
~/Library/Mobile Documents/com~apple~CloudDocs/00 MSBA + Coding/04_career/
```

| Key | Path | What it is |
|---|---|---|
| S1 | `00_Resume and Cover Letter/00_Final — ready to send/Tobias Knight_Resume_2026.pdf` | The current resume. Newest final, file modified 2026-07-14. **Where two sources disagree, this one wins.** |
| S2 | `00_Resume and Cover Letter/01_Source/master_cv_source.yaml` | The structured master CV. Every position, including the ones cut from S1 |
| S3 | `00_Resume and Cover Letter/01_Source/master_cv_source.md` | Readable render of S2, last sync 2026-06-02. Marked "do not edit, edit the YAML" |
| S4 | `00_Resume and Cover Letter/T_master_resume.md` | Working draft, June 2026, plus a bullet bank |
| S5 | `03_Interview Prep/2026-07-21_[redacted]_interview_prep.md` | Prep notes. Used only for the employer sequence |
| S6 | `networking/2026-07-21-[redacted]-recruiter-call-transcript.txt` | Call transcript. Used only for one sentence Tobias says about where he used a tool |
| S7 | `networking/networking outreach emails/2026-06-04_[redacted]-Databricks-intro.txt` | Outreach note. Used only for one list of employers |

---

## The ambiguity in the issue, resolved

The issue asks whether "AC Surety Delivery Associates" is one employer or two.

**It is two, and neither is called AC Surety.** The repo currently carries three
employer names that no career document contains:

| In `content.ts` today | What the documents actually say | Confidence |
|---|---|---|
| Formative Technologies | **4MATIV Technologies** | High, see evidence below |
| AC Surety | **Accenture** | High, see evidence below |
| Delivery Associates | **Delivery Associates**, correct as is | Certain, S1 S2 S3 S4 |

The evidence, in order of weight:

1. `Formative` and `Surety` return zero hits as employer names across the whole
   `04_career` tree. `4MATIV Technologies` and `Accenture` are in every resume
   and CV in it: S1, S2, S3, S4.
2. Tobias, in his own words in S6: "I did Power BI at Accenture and at
   Formative." His employers in that period were Accenture and 4MATIV, so
   "Formative" is how he says 4MATIV out loud. 4MATIV reads as "formativ".
3. S7 names the same three companies as one group: "Accenture, Delivery
   Associates, 4MATIV".
4. S5 gives the sequence directly: "Finance degree, then 4MATIV ... Then
   Accenture ... Then Delivery Associates".

So the phrase that was heard as "AC Surety Delivery Associates" is two
employers, Accenture and Delivery Associates, said back to back. The third
entry, "Formative Technologies", is 4MATIV Technologies.

**This is an identification, not a quotation.** No document contains the string
"AC Surety" for anyone to match against, so the last step is Tobias saying yes.
Rule 9: until he does, this stays in this file and out of the site.

---

## Positions

Newest first, exactly as S1 orders them. One line each, condensed from that
position's own bullets.

### Carlson Analytics Lab

* **Role:** Applied AI & Data Science Graduate Consultant `S1 S2 S3`
* **Dates:** Oct 2025 to Current `S1 S2 S3`
* **Location:** Minneapolis, MN `S1 S2`
* **One line:** Designed and deployed an agentic bid intelligence platform for a
  $250M highway construction contractor, and ran the discovery sessions behind
  its bid decision logic. `S1`

This is the CSI work. It also answers the blank in the CSI project entry, which
currently reads `Graduate ELP team, [ your specific role on it ]`.

### Pickleball IQ (PB IQ)

* **Role:** Co-Founder & AI Engineer `S1`. S2 and S3 say "Founder & AI Engineer"
* **Dates:** May 2025 to Current `S1 S2 S3`
* **Location:** Minneapolis, MN `S1`. S2 says Remote
* **One line:** Shipped PB IQ to the Apple App Store and into weekly use with a
  30 player pilot, building the extraction pipeline, the skill development
  engine and the data platform behind it. `S1`

### Delivery Associates

* **Role:** Solutions Delivery Consultant, Data Consultant `S1`. S2 adds a third,
  Strategy Consultant
* **Dates:** September 2023 to May 2025 `S1 S2 S3 S4`
* **Location:** Minneapolis, MN `S1 S2`
* **One line:** Public sector delivery consultancy, where he classified 41K job
  postings to project a 77K talent shortfall that informed a $41M Tech Hubs
  grant, and modelled charter school performance for two philanthropic
  foundations. `S1`

### Accenture

* **Role:** Technology Strategy Consultant `S1 S2 S3 S4`
* **Dates:** February 2022 to August 2023 `S1 S2 S3 S4`
* **Location:** Minneapolis, MN `S1 S2`
* **One line:** Quantified contact centre automation potential into a $25M
  business case that secured executive buy in for a virtual assistant
  deployment. `S1`

### 4MATIV Technologies

* **Role:** Founding Solutions Lead, Data Analyst `S1`. S2 is longer: Founding
  Customer Solutions Lead, Operations Lead, Data Analyst
* **Dates:** December 2018 to December 2021 `S1 S2 S3 S4`
* **Location:** Minneapolis, MN `S1 S2`
* **Descriptor on the resume:** K-12 Transportation SaaS Platform `S1`
* **One line:** Early employee at a K-12 transportation platform, where he
  automated vendor billing audits across eight providers and scaled the managed
  services line from $0 to $6M. `S1` for the audits, `S2 S3` for the revenue
  growth

---

## Positions on the master CV but not on the current resume

These are real and sourced. They are listed because the follow up needs to know
they exist, not because they belong on the site. Both were cut from S1, which is
a decision Tobias already made once.

### U.S. Bank

* **Role:** Portfolio Manager, Private Wealth Management `S2 S3`
* **Dates:** July 2018 to December 2018 `S2 S3`
* **One line:** Investment thesis and portfolio construction support across a
  $450M AUM book. `S3`

### Stone Arch Capital

* **Role:** Private Equity Intern `S2 S3`
* **Dates:** January 2018 to June 2018 `S2 S3`
* **One line:** Due diligence and financial modelling on lower middle market
  transactions. `S3`

---

## Education

### University of Minnesota, Carlson School of Management

* **Degree:** Candidate for Master of Science in Business Analytics `S1 S2 S3`
* **Date:** Aug 2026 `S1 S2 S3 S4`
* **Location:** Minneapolis, MN `S1 S2`

Note the word **Candidate**. Every source says candidate or expected, and today
is 2026-08-25, so whether the degree is now conferred is a fact only Tobias has.
The site currently states it flat as "MS Business Analytics, Aug 2026".

### University of St. Thomas

* **Degree:** Bachelor of Arts, Finance `S1 S2 S3 S4`
* **Date:** May 2018 `S2 S3 S4`. **S1, the current resume, carries no date for
  this one**, so the May 2018 comes from the three older sources, which agree
* **Location:** St. Paul, MN `S1 S2 S3 S4`

---

## Ready to wire, once Tobias confirms the two names

For the follow up ticket. `content.ts` was not touched here.

| Field in `cv` | Today | From this extraction |
|---|---|---|
| `experience[0].org` | Formative Technologies | 4MATIV Technologies, **pending confirmation** |
| `experience[0].role` | `[ title ]` | Founding Solutions Lead, Data Analyst |
| `experience[0].when` | `[ dates ]` | Dec 2018 to Dec 2021 |
| `experience[1].org` | AC Surety | Accenture, **pending confirmation** |
| `experience[1].role` | `[ title ]` | Technology Strategy Consultant |
| `experience[1].when` | `[ dates ]` | Feb 2022 to Aug 2023 |
| `experience[2].org` | Delivery Associates | unchanged |
| `experience[2].role` | `[ title ]` | Solutions Delivery Consultant |
| `experience[2].when` | `[ dates ]` | Sept 2023 to May 2025 |
| `education[1].role` | `[ degree ]` | BA Finance |
| `education[1].when` | `[ years ]` | May 2018 |

**The list is also incomplete, which is a separate question from the blanks.**
`cv.experience` holds three employers. The current resume holds five, and the
two missing ones are the two most recent: Carlson Analytics Lab and Pickleball
IQ. They are on the site as projects, CSI.APP and PICKLEBALL_IQ.APP, but not as
work history. Ordering also needs a decision: the array today runs oldest first
and every resume runs newest first.

## Still open on Tobias

| # | What | Why an agent cannot close it |
|---|---|---|
| 1 | Are the two employers 4MATIV Technologies and Accenture | The identification is strong and it is still an identification. No document contains "AC Surety" or "Formative Technologies" to match on |
| 2 | Is the MSBA conferred or still expected | Every source says candidate. The date has now passed |
| 3 | Do Carlson Analytics Lab and Pickleball IQ join the CV work history | A positioning call, not a fact |
| 4 | Do U.S. Bank and Stone Arch Capital appear at all | He already cut both from the current resume |
| 5 | Founder or Co-Founder on PB IQ | The current resume says Co-Founder, the older master CV says Founder. Titles about a company with other people in it are his to state |
| 6 | Which job title variant to use where a source lists two or three | Listed above per position, no invention either way |

## One conflict worth knowing about, outside this ticket

S2, dated May 2026, gives his location as San Francisco, CA, and so does S4.
S1, the newest resume, says Minneapolis, MN, which is what the site says. The
newest document agrees with the site, so nothing needs changing. It is recorded
here so nobody re reads the older files later and thinks the site is wrong.
