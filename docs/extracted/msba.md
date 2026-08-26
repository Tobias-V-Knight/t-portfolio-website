# MSBA coursework, extracted

Issue #6. Walked on 2026-08-25 from the Mac Mini, against the two source roots:

```
00 MSBA + Coding/01_spring 2026/
00 MSBA + Coding/00_summer 2026/
```

Every course found in those folders appears below with the folder it came from.
The rule for the stack lists: **a tool goes in only if the coursework actually
used it**, evidenced by a `library()` call, an `import`, a requirements file or
a course document. Nothing is inferred from the topic. Where a stack cannot be
determined, the section says so instead of guessing.

Two limits on this pass, both worth knowing before you trust a line:

* **No PDF reader on this machine.** `pdftotext` is not installed and the Read
  tool needs poppler, so syllabi, lecture decks and Plaud summaries were read by
  filename only. Everything below comes from text files, notebooks, scripts, R
  Markdown and the course notes that are already markdown.
* **The "what stuck" lines are drafted from artifacts, not from T.** They state
  what the work shows. The opinion layer, the topics he keeps coming back to and
  the notebook lines, is his and is still blank on the site.

---

## Spring 2026

### MSBA 6421, Predictive Analytics

Source: `01_spring 2026/01_Predictive_6421/`
Code and name from `Midterm_Study_Materials/MSBA6421_Midterm_Study_Guide.md`.

Covered: decision trees, KNN, measurement, cross validation, cost sensitive
metrics, ROC and PR curves, regularization (L1, L2, elastic net), SVM and SVR,
ensembles (bagging, boosting, stacking), feedforward networks, CNNs, RNNs,
transfer learning, an introduction to transformers.

Work on disk: HW1 (bank marketing classification and real estate regression,
tuned with GridSearchCV), HW2 (shallow versus deep, then the Kaggle dogs versus
cats CNN with ResNet transfer learning), and the M5 Walmart team project.

**What stuck:** on the M5 private leaderboard the LSTM won at 0.759 WRMSSE using
nine features while XGBoost needed thirty four hand crafted ones to reach 0.821,
so the architecture that matched the shape of the data beat the feature
engineering.
Source for the numbers: `PDA_team project/ts_talking_points.md`.

**Stack (5):** Python, Jupyter, scikit-learn, TensorFlow/Keras, XGBoost.
Evidence: `tensorflow`, `keras`, `sklearn` imports in the team notebooks and
`t_hw2_q2_kaggle_dog vs cat.ipynb`; XGBoost is one of the three M5 models.

### MSBA 6411, Exploratory Data Analytics

Source: `01_spring 2026/02_Exploratory Data Analytics_6411/`
Code from the folder name, course name from `EDA_Course Modules_Slybus_.pdf`
(filename only, the PDF was not readable here).

Covered: data manipulation and visualization, PCA, clustering including advanced
methods, anomaly detection, topic modeling, LLM applications, autoencoders.

Two live cases sit in this folder. The GED Testing Service case worked 304,137
candidates, using the phi coefficient as a first pass and then a logistic
regression over eleven prep methods as the weighting engine for segmentation
(`EDA_GED Project/final materials + data/current/GED_Analysis_Summary.md`). The
4mativ case is a four layer school bus GPS pipeline: connection health with
Isolation Forest, active window detection, DBSCAN anomaly detection, composite
vendor scoring, delivered as a seven page Streamlit dashboard
(`EDA_live case_4mativ/README.md`).

**What stuck:** the GED case had no engagement variable in the data, so prep
method choice was built into a proxy for it and the segmentation was run on that.

**Stack (5):** Python, scikit-learn, gensim, NLTK, Streamlit.
Evidence: imports across `EDA_labs/` (gensim and NLTK in the topic modeling lab,
`openai` in the LLM applications lab, sklearn throughout) and the Streamlit
dashboard under `EDA_live case_4mativ/deliverables/dashboard/`.

### MSBA 6441, Causal Inference

Source: `01_spring 2026/03_Causal Inference/`
Code and name from the YAML title of `CI_wk 7_midterm/CI_Midterm_Study_Guide.Rmd`.
Instructor: Kartik Ganju.

Covered: potential outcomes, experimental design (SUTVA, spillovers,
randomization strategies, power analysis), endogeneity and selection bias,
matching (exact, propensity score, coarsened exact), panel data and fixed
effects, difference in differences across three weeks including Card and
Krueger, synthetic control on German COVID district data, regression
discontinuity, and instrumental variables on Angrist and Krueger 1991.

Homework on disk: the Star Digital advertising experiment, a difference in
differences study of sponsored ads, and a matching, RD and IV assignment.

**What stuck:** the course is one long argument that a fitted model is not an
effect, and every method in it (matching, DiD, synthetic control, RD, IV) is a
different way of building the counterfactual the regression cannot see.

**Stack (5):** R, R Markdown, MatchIt, plm, Synth.
Evidence: `library()` counts across the folder's `.R` and `.Rmd` files, dplyr 36,
ggplot2 14, plm 9, MatchIt 8, Synth 2, rdrobust 2, AER 2. Everything knits to PDF.

### MSBA 6331, Big Data Analytics

Source: `01_spring 2026/04_Big Data Analytics/`
Code and name from
`Syllabus for MSBA 6331 (001) Big Data Analytics (Spring 2026).pdf`.

Covered: Linux and the shell, Hadoop, Hive, Spark SQL, Spark architecture and
optimization, Spark MLlib pipelines, Spark structured streaming, AWS cloud
computing, Bedrock, and MLOps with MLflow. The course study guide
(`EXAM_STUDY_GUIDE.md`) is organised as Linux, Hive, Spark SQL, Spark MLlib.

**What stuck:** the same job written three ways, Hive, Spark SQL and MLlib, is
the cheapest way to feel where the cost of a distributed query actually lives.

**Stack (5):** Linux, Hive, PySpark, Spark MLlib, MLflow.
Evidence: `pyspark.sql`, `pyspark.ml` and `mlflow` imports in `labs/`, the Hive
lab `lab3-1-hiveIntro.ipynb`, the streaming labs, and `lab13-2-mlflow.ipynb`.

### MSBA 6351, Recommender Systems

Source: `01_spring 2026/06_AI_reccs/`
Course name from T's own `Rec_final project/PROJECT_PLAN.md` ("Course:
Recommender Systems, Spring 2026"). **The code is probable, not confirmed:** the
only occurrence anywhere in the folder is the instructor's own data path inside
`Rec_wk_5_networking/Week 5 - Link Prediction.ipynb`, which reads
`.../Teaching/MSBA6351 2025/Week 5/facebook_data.txt`. Confirm before it goes
anywhere public.

Covered: content based filtering, data sparsity, collaborative filtering and
cold start, matrix factorization, neural collaborative filtering, social networks
and link prediction, and a personalization workday on Twitch data. MovieLens
100k is the running dataset.

Final project: a demographic aware skincare recommender on the Sephora reviews
dataset, 1.09M interactions, 503K users, 2,351 products, built as matrix
factorization for the baseline and neural collaborative filtering for the
ceiling, then read for demographic equity across skin tone and skin type
(`Rec_final project/RECOMMENDER_HANDOFF.md`).

**What stuck:** NCF replaces the dot product with dense layers, so it earns its
keep only where preference is nonlinear, and the demographic prior is what
carries a cold start user before there is any history to factorize.

**Stack (4):** Python, Jupyter, scikit-learn, TensorFlow/Keras.
Evidence: imports in the final project notebook and the week 4 deep learning
notebooks, plus `Rec_wk_4.../requirements.txt` (pandas, numpy, scikit-learn,
xgboost, requests).

### MSBA 6335, Effective Communication

Source: `01_spring 2026/99_effective_comms_6335/`
Code and name from the folder and its `CLAUDE.md`.

Covered: SCKQ openings (situation, complication, key question, outcome), the V6
visual principles, declarative headlines under twelve words that pass the "so
what" test, active voice and parallel bullets, plus the HBS and McKinsey
readings on visualization and business writing.

**Stack: cannot be determined, and that is the honest answer.** The folder's own
`CLAUDE.md` states it outright: "It is not a software project, there is no code,
build, test, or git." The one thing built here is `deck_framework_llm_v3.md`, a
system prompt that turns an assistant into a deck builder targeting Gamma export.
If this course ever gets a chip row, the chips are frameworks, not tools.

### Not courses, in the same folder

* `05_live case/` holds only `4mativ_2026 Project Definition.pdf`. The 4mativ
  work itself lives under the EDA course above.
* `97_building teams/` is a single February session deck.
* `98_hackaton/` is the Celonis hackathon: a carbon budget and green ROI
  analysis in Python with its own decision framework documents.
* `layer1_5_outputs/` and `layer2_outputs/` are 4mativ pipeline outputs.

---

## Summer 2026

### MSBA 6431, Time Series Analysis and Forecasting

Source: `00_summer 2026/01_Time Series Forecasting/`
Code and name from
`Syllabus for MSBA 6431 (001) Time Series Analysis and Forecasting (Summer 2026).pdf`
and the course `CLAUDE.md`. Instructor: Xuan Bi.

Covered: sample paths and stochastic processes, stationarity, white noise,
random walks, ACF, MA and AR and ARMA, characteristic polynomials, ARIMA and
seasonal ARIMA, model selection by AIC and BIC, forecasting. Homework banned
`arima.sim()`, so the random walks and the AR(3) paths are built by hand.

Final project: monthly ready mix concrete PPI from FRED, 737 observations back
to 1965, last ten held out. Log transform, ADF, a trend regression, then
differencing, then a grid over ARIMA orders. Final model ARIMA(1,1,1)(1,0,1)[12]
on the log series, test RMSE about 2.27 against an NNAR baseline of about 9.5.
The appendix checks the lag 12 seasonal term against CSI's own monthly mix
tonnage.

**What stuck:** the trend regression fit at R squared 0.96 and was still
spurious, and the ADF test on its residuals was the only thing that said so, so
the model was rebuilt on differences.
Source: `01_Time Series Forecasting/CLAUDE.md`, final project summary.

**Stack (5):** R, R Markdown, forecast, TSA, SARIMA.
Evidence: `library()` counts in the folder, TSA 23, forecast 22, ggplot2 21,
dplyr 17, tseries 8, lmtest 3. SARIMA is the technique the final project ships,
carried as a chip the way the NLP entry carries "fine tuning".

### MSBA 6511, Generative AI for Business

Source: `00_summer 2026/02_Gen AI for Business/`
Code from `Final project/roleradar/README.md`, which names the course twice,
including the rubric alignment section.

Covered: embeddings and attention, a local model setup tutorial, RAG through
Dify, Azure AI Foundry, agentic design patterns and multi agent design patterns.

Work on disk: HW1 prompted a BAC trading strategy out to a spreadsheet, HW2 built
an AutoGen Studio newsroom team, and the final project is RoleRadar, a job
posting tracker with three AutoGen agents in a GroupChat (scraper, fuzzy matcher,
resume analyst) orchestrated through Azure AI Foundry, about 9,800 jobs in the
shared dataset, live GPT-4o resume gap analysis, running in Docker.

**What stuck:** the app is stub safe, so with no Azure credentials the agents are
still constructed and the whole scrape, match, store and render path runs
locally, and adding the key turns the LLM on with no code change.

**Stack on the site (4):** AutoGen, Azure AI Foundry, Python, multi agent.
The fuller build stack, for reference: FastAPI, APScheduler, SQLite, httpx,
Playwright, rapidfuzz, Docker, GPT-4o. Week one also used Streamlit against a
local OpenAI compatible endpoint on `localhost:8080`.

### MSBA 6341, Responsible AI

Source: `00_summer 2026/04_responsible_ai/`
Code and name from the header of
`hw_1/01_deliverables/2026-07-28_TK_hw1_report.md`. Note that
`hw_2/00_assignment/hw_2_instructions.txt` mentions MSBA 6131, but that is the
instructor pointing back at a clustering homework from an earlier course, not
this course's code.

Covered: a conceptual framework for responsible AI, algorithmic fairness and
bias metrics, the COMPAS case, interpretable machine learning, and AI and
privacy.

HW1 replicated both sides of the ProPublica versus Northpointe argument on the
5,278 defendant Broward sample: false positive rate 42.3 percent for Black
defendants against 22.0 percent for white defendants, precision 65.0 against
59.5, and a regression controlling for priors, age, charge degree and sex still
leaving 1.63 times the odds of a not low label. HW2 is bankruptcy prediction
from accounting ratios.

**What stuck:** error balance and predictive parity cannot both hold, so the
fairness question is settled when the outcome variable is chosen, not by picking
the metric that flatters the model after it is built.

**Stack (5):** Python, scikit-learn, statsmodels, SHAP, LIME.
Evidence: imports in the HW1 appendix, the HW2 deliverable and the module demo
notebooks (`shap`, `lime.lime_tabular`, `sklearn.inspection`,
`statsmodels.formula.api`).

### MSBA 6461, Advanced AI for Natural Language Processing

Source: `00_summer 2026/05_NLP/`
Code and name from
`Syllabus for MSBA 6461 (001) Advanced AI for Natural Language Processing (Summer 2026).pdf`
and `2026-08-13_hw-1_project-architecture-and-summary.md`. Instructor: Mochen Yang.

Modules: neural network refresher, text preprocessing and representation (bag of
words, TF-IDF, word2vec), RNN, LSTM, GRU and BiRNN, sequence to sequence with
encoder decoder attention and teacher forcing, transformer architecture, large
language models, wrap up. RAG was explicitly out of scope.

The course long project is the CSI extraction engine: a bake off between the
keyword baseline, TF-IDF with logistic regression, a hand built attention
classifier in raw PyTorch, a fine tuned DistilBERT, and local Qwen through
Ollama against Claude, evaluated on a hand adjudicated gold set and on a train
on Minnesota, test on the Dakotas split.

**What stuck:** already on the site, and it holds up against the source doc.

**Stack on the site (5):** attention from scratch, DistilBERT, fine tuning, gold
set eval, local (M4). Unchanged by this pass.
The project doc's own stack block, for reference: Python 3.11, PyTorch on MPS,
scikit-learn, HuggingFace transformers, Ollama with Qwen2.5 7B, the Anthropic
SDK, pandas.

### Agile Project Management

Source: `00_summer 2026/03_agile/`
No course code appears anywhere in the folder. The school tracker
(`00_school_tracker.md`) lists it as a one off Friday session, 29 May, nine to
four.

The folder holds the 2020 Scrum Guide and one homework: two STAR interview
stories written against the ELP experience.

**Stack: cannot be determined.** There is no code and no tool artifact. Jira
appears only inside the wording of an interview prompt T was answering, which is
not evidence he used it, so it does not go in a stack.

### Experiential Learning Project, CSI

Source: `00_summer 2026/00_CSI_ELP/`
On the class schedule as Experiential Learning, Monday and Wednesday through 21
August. No course code appears in the folder, only
`Student_Summer_2026_ELP_PDS.pdf`.

CSI is cleared for the site by outcome and role, but the detailed architecture
question is still open as Q-06 in `TICKETS.md`, so no stack is listed here and
none goes on the site until T answers it. The CSI work is already represented on
the site as a project, not as a course.

---

## What this filled in `src/data/content.ts`

| Was | Now |
|---|---|
| MSBA 6431, `[ your favorite idea from this course ]` | the spurious trend regression line, from the course `CLAUDE.md` final project summary |
| MSBA 6431, `[ the stack for this course ]` | R, R Markdown, forecast, TSA, SARIMA |
| `[ code ]`, Generative AI for Business | MSBA 6511, from the RoleRadar README |
| `[ a spring 2026 course ]` | MSBA 6441, Causal Inference |
| third `topics` entry | the causal inference line, evidenced below |

Causal Inference took the spring slot for two reasons. It is the only course in
either term that answers "did this actually work", which is the question behind
the evaluation capability the site already leads with, and it brings R, which
nothing else in the courses list carries. Predictive Analytics 6421 is the
strongest runner up and its M5 line is written above, ready to drop in if T
would rather lead with that.

The third topic entry is evidenced, not invented: T wrote four separate versions
of the causal inference midterm study guide (`v1`, `v3_conceptually`, `v4_code`
and the base file), which is the closest thing in the folders to proof of a
topic he keeps returning to.

## Still blank on purpose

* **`msba.notes`**, both entries. The heading is FROM THE NOTEBOOK and the
  bracket says "a note from your notebook". That is T's voice and nothing in the
  coursework folders can stand in for it. Rule 9.
* **Every other course.** The panel is MSBA HIGHLIGHTS, not a transcript, and it
  holds four courses by design. The other eight entries are written up above
  with their stacks ready, so promoting one is an edit, not another extraction.
* **CSI ELP architecture.** Blocked on Q-06.
