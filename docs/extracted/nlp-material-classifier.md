# Extracted: nlp-material-classifier

Source material for a case study window. **Not site copy yet.** Every number
below is traceable to a file in `~/dev/nlp-material-classifier`, cited by path.
Paths in this document are relative to that repo unless stated otherwise.

Walked 2026-08-25 for issue #4. Read only: nothing in that repo was modified.

**Two rules held while writing this.** No client bid data appears here: no
project names, no quantities off a real bid, no line items beyond the two
generic pay item strings the project's own public facing docs already use as
examples. And no number was reconstructed. Where a figure was never written
down, the entry reads `[ not recorded ]`, which is itself a finding.

---

## What it is

CSI and the client project read highway bid documents and have to decide what material every
line item is, because those categories add up into the tonnage totals a paving
contractor bids on. This project replaces the hand tuned keyword list that made
that call with a model trained on the labels, scored honestly against a test set
Tobias hand adjudicated himself, and run locally so it costs nothing per item
and the bid data never leaves the machine.

Source: `README.md` lines 3 to 14, `docs/ONE_PAGER.md` lines 3 to 19.

Course project for MSBA 6461 Advanced AI for NLP, Prof. Mochen Yang, deadline
2026-08-20 (`SPEC.md` line 7). Input and output, verbatim from the repo:
`"Aggregate Base Cl 5, TON"` becomes `base_tons` (`README.md` line 11).

---

## The problem, quantified

The number that starts the story is not an accuracy, it is a defect. Measured
against 2,434 labeled items:

| Finding | Value | Cited in |
|---|---|---|
| Distinct descriptions the keyword matcher gave a category | 681 of 2,434 = **28%** | `docs/ARCHITECTURE.md` §3, `docs/JOURNAL.md` |
| Escalated to a paid LLM call because keywords had no answer | 1,608 = **66%** | `docs/ARCHITECTURE.md` §3 |
| Categories the keyword vocabulary structurally cannot emit | **12 of 24** | `docs/ARCHITECTURE.md` §3, `docs/ONE_PAGER.md` |
| Silent misses, predicts `other` when the truth is a real category | **1,626** | `docs/ARCHITECTURE.md` §3 |
| Worst single project error, hot mix tonnage under reported | **605×** (121,221 tons reported as 200) | `docs/ARCHITECTURE.md` §3 |

The 605× miss is the whole pitch in one fact. North Dakota's pay item says
"Superpave FAA 43" and the Minnesota written keywords looked for "hot mix", so
the tonnage was never counted and nothing anywhere said so. A contractor could
bid off that number and never know (`docs/JOURNAL.md`, "The problem,
quantified").

So the old path was expensive **and** wrong: two thirds of items hit a paid API,
and what the keywords did answer failed silently.

---

## The honest yardstick

The existing labels could not be used as a test set. Of the 2,434 crosswalk
rows, 681 were labeled by the keyword matcher itself, which is circular, and
1,608 are LLM guesses on the residual (`SPEC.md` §2, `docs/ARCHITECTURE.md` §3).

So step zero was a hand adjudicated gold set:

- **331 rows**, human labeled, frozen, never trained on. `data/gold/gold_test_labeled.csv`
  holds 332 lines including the header; `CLAUDE.md` line 15 calls it "331 human labels".
- Stratified by category with a cap of **15 rows per category** and a fixed seed
  of 42, so rare classes actually appear instead of drowning under `noise`
  (`src/build_gold_sample.py` lines 26 to 45).
- Shuffled before labeling to reduce anchoring, and shown with the database's
  suggested label so the pass was adjudication rather than blind labeling
  (`src/build_gold_sample.py` lines 12 to 15).
- **8.8% of the silver labels turned out to be wrong**, with informative error
  clusters: plan sheet titles labeled as work, "BITUMINOUS" over firing to hot
  mix on saw and salvage lines, sign legends labeled as the thing they name
  (`docs/JOURNAL.md`, "An honest yardstick").

This is the first hand labeled accuracy benchmark this step has ever had. CSI
production never had one, only coverage of roughly 64 to 66% extraction and the
known failures (`docs/JOURNAL.md`, "Framing vs. CSI production").

Leakage is enforced in code, not by good intentions: training loads
`data.load_train_excluding_gold()`, which drops every crosswalk row whose
description appears in gold (`src/data.py` lines 123 to 132), and `CLAUDE.md`
lines 13 to 16 make it a standing rule.

---

## The accuracy table

All rows scored on the same gold set, n=331, through the same harness
(`src/eval.py`). Blank cells are blank because the run was never recorded, not
because the run went badly.

| Lane | Accuracy | Macro F1 | Silent miss | Marginal cost | Recorded in | Produced by |
|---|---|---|---|---|---|---|
| Keyword matcher (`SPEC_MAP`) | **0.308** | **0.328** | **0.635** | $0 keyword plus a paid LLM call on the two thirds it misses | `docs/JOURNAL.md` scoreboard; also hard coded as `KEYWORD_GOLD_ACCURACY` / `KEYWORD_GOLD_MACRO_F1` in `src/baseline_tfidf.py` lines 32 to 33 | `src/eval_baseline_gold.py` |
| TF-IDF plus logistic regression | **0.628** | **0.546** | **0.161** | about $0, local | `docs/JOURNAL.md` scoreboard | `src/baseline_tfidf.py` |
| Attention from scratch | **0.396** | **0.346** | **0.144** | about $0, local | `docs/JOURNAL.md` scoreboard | `src/train_attention.py` |
| LoRA Qwen2.5 1.5B | `[ not recorded ]` | `[ not recorded ]` | `[ not recorded ]` | about $0, local | `docs/JOURNAL.md` scoreboard says TBD | `src/eval_lora.py` |
| The model deployed to CSI | `[ not recorded ]` | `[ not recorded ]` | `[ not recorded ]` | see below | nothing from this repo is deployed | see below |
| Claude Sonnet reference | `[ not recorded ]` | not applicable | not applicable | paid per call | `docs/JOURNAL.md` scoreboard says TBD | lane not built |

### On the two blank model rows

**LoRA Qwen.** The lane is built and the adapter exists. What is missing is one
recorded score. `results/lora_adapter/adapters.safetensors` is on disk, and
`results/lora_adapter/adapter_config.json` records the run that made it: base
model `mlx-community/Qwen2.5-1.5B-Instruct-4bit`, LoRA rank 8, scale 20, dropout
0, 8 layers, batch size 8, 400 iterations, learning rate 1e-4, max sequence
length 128, seed 0, checkpoints every 100 steps. The training data is 1,874
train rows and 209 validation rows of silver labels, with all 331 gold rows held
out as the test file (`data/lora/train.jsonl`, `valid.jsonl`, `test.jsonl` line
counts; built by `src/lora_data.py`). The scorer `src/eval_lora.py` prints
accuracy, macro F1, silent miss, per state, the bucket level view and a parse
robustness count. Its output is not written to any file in the repo, and no
number from it appears in `docs/JOURNAL.md`. **Someone has to run it and paste
the result before this row can be filled.**

**The model deployed to CSI.** As of this walk, no model from this repo is
deployed. `SPEC.md` §7 specifies `src/serve.py` exposing
`classify(description) -> category` as the deployable wrapper. That file does
not exist in `src/`, and its ticket `T6.3` in `TICKETS.md` is unchecked. What
runs in CSI production today is the thing the project set out to replace: the
`SPEC_MAP` keyword matcher with a Claude fallback for everything it misses
(`docs/ARCHITECTURE.md` §3, `docs/JOURNAL.md`). Its gold accuracy is therefore
the keyword row above, **0.308**, plus an unmeasured LLM fallback. The fallback
has never been scored: `TICKETS.md` T5.1 and T5.2 are both unchecked and no
source file for that lane exists.

This is worth saying plainly on the site rather than hiding. The finished claim
is "TF-IDF doubles the accuracy of the thing in production, for free", and that
claim is fully supported. The claim "and it shipped" is not, yet.

### Numbers underneath the headline

- **North Dakota is where the keyword matcher dies.** Per state, the keyword
  baseline scores **0.267** on ND, its worst state, which is exactly the
  Minnesota only keyword failure (`docs/JOURNAL.md`, "Baselines").
- **Character n grams are what close the gap.** They lift TF-IDF on ND to
  **0.64**, because a shared substring carries the signal even when the exact
  token was never seen in training (`docs/JOURNAL.md`;
  `src/baseline_tfidf.py` lines 8 to 14 explain the vectorizer choice).
- **TF-IDF cuts the silent miss rate about fourfold**, 0.635 down to 0.161
  (`docs/JOURNAL.md` scoreboard). For this product that matters more than
  accuracy: a silent miss is tonnage that vanishes without a warning.
- **The attention model's later checkpoint has no score.**
  `results/2026-08-22_attn_classifier_full.pt` is newer than the run the 0.396
  figure came from (`results/2026-08-21_attn_classifier_full.pt`). No gold
  numbers for the 2026-08-22 run are recorded anywhere: `[ not recorded ]`.
- **No dollar figure exists for any lane.** `SPEC.md` §5 asks for a cost per
  1,000 items table. No such table is in the repo. The cost column above is the
  qualitative one from the journal scoreboard: `[ not recorded ]` in dollars.

---

## The eval harness

The repo never uses the literal label "V2", so this section names the two
versions by what changed.

**V1, `src/eval.py`.** One function, `evaluate(y_true, y_pred, states=)`, that
every lane is scored through, so the lanes are comparable by construction. It
returns accuracy, macro F1, per class F1 for all 24 categories, a per state
breakdown, and one metric that is not standard anywhere:

> **silent miss rate.** The share of rows whose truth is a real category but
> whose prediction lands in `{other, noise, None}` (`src/eval.py` line 29).

That metric is the Dunn bug turned into a number. An ordinary accuracy score
treats "I said base and it was hot mix" and "I said nothing at all" as the same
one point of loss. For a tonnage rollup they are not the same: the first is a
number in the wrong column where somebody may notice it, the second is money
that silently is not there. Two design details make it honest. Rows whose truth
is itself `other` or `noise` are excluded, so answering "other" for a genuinely
other row is correct rather than punished (`src/eval.py` lines 92 to 104). And a
`None` prediction is mapped to a sentinel that can never match a truth, so a non
answer counts as wrong instead of crashing sklearn (`src/eval.py` lines 31 to
39).

Macro F1 is the selection metric, not accuracy, because the 24 classes run from
roughly 801 rows of `noise` down to 2 of `stockpile` and an accuracy optimizer
would just learn to say `noise` (`CLAUDE.md` line 18, `docs/MODEL_PLAN.md` §7).

**V2, `src/eval_buckets.py`, plus its wiring into the two model lanes.** Same
metric code, coarser label space. Every one of the 24 categories rolls up
through `data.category_to_bucket()`, and the roughly 17 categories that carry no
tonnage collapse into a single `non_material` class, which turns the problem
into an 8 way task: the 7 money buckets plus `non_material`
(`src/eval_buckets.py` lines 1 to 18). It deliberately reuses
`eval.evaluate()` for the arithmetic so the coarse score is computed by exactly
the same code as the fine one, and only the labels differ
(`src/eval_buckets.py` lines 33 to 42).

**Why V2 mattered.** The 24 way task is the honest labeled task, but it is not
the product's task. `src/eval_baseline_gold.py` lines 6 to 9 states the reason
better than a summary can: an error on hot mix or base corrupts a tonnage total
a contractor reads first, while an admin versus testing_qc mixup costs macro F1
and no dollars. V1 scored the model. V2 scores the product. Both are printed,
one under the other, so neither can be quoted without the other being visible:
`src/train_attention.py` lines 230 to 237 and `src/eval_lora.py` lines 134 to
139 both print a `[BUCKET LEVEL]` block below the 24 category report, and
`src/eval_buckets.py` `main()` prints a direct coarse versus fine comparison
table with a `lift` column for the two cheap lanes.

**What V2 has not produced yet.** No bucket level number is recorded anywhere in
the repo: `[ not recorded ]` for every lane. `src/eval_buckets.py` is present in
the working tree and is not yet in a commit, and the two wiring edits to
`src/train_attention.py` and `src/eval_lora.py` are likewise uncommitted, so the
harness exists but has not been run and written down.

**What V2 is building toward.** The data side, `src/load_specbook.py`, is the
other half and is also uncommitted. State DOTs publish their canonical pay item
lists publicly, which is free vocabulary for the starved classes. The design
choice worth quoting on the site is the discipline around it
(`src/load_specbook.py` lines 6 to 20):

- Spec book rows land in **their own table**, never appended into
  `material_crosswalk`, because crosswalk rows are observed items from real plans
  and carry frequency, while spec book rows are dictionary vocabulary with no
  frequency at all. Mixing them corrupts those columns and makes the A/B
  impossible to measure.
- `spec_category` stays **NULL on ingest**. The scraper never guesses, because a
  bad guess here silently poisons the training data. Labeling is a separate
  auditable pass.
- Columns mirror the crosswalk on purpose, so the training loader can union the
  two behind a source flag: train on crosswalk only, train on crosswalk plus
  spec book, rescore on the same frozen gold set, and watch macro F1 move on the
  starved classes.

That is the experiment the harness was built to make possible. Its result is
`[ not recorded ]`.

---

## Lessons: what was tried that did not work

**1. The from scratch model lost to TF-IDF, and the reason was data, not
architecture.** Attention scored 0.396 against TF-IDF's 0.628
(`docs/JOURNAL.md` scoreboard). Diagnosed with real counts: five categories,
`milling`, `mobilization`, `admin`, `water_dust` and `stockpile`, had **zero
training rows** after gold removal. They are globally rare, 15 rows or fewer in
the whole dataset, and the stratified gold sample drained them into the test
set. The model literally cannot predict a class it never saw, which guarantees
0 F1 on 5 of 24 classes and caps macro F1 by roughly 0.21 on its own
(`docs/JOURNAL.md`, "Attention from scratch"). Short keyword like text also
suits TF-IDF's character n grams better than a data hungry recurrent net trained
from random weights.

**2. Going to look for more data did not rescue it.** The fuller `materials`
table recovered only `milling`, about 25 examples. The rest are exhausted
everywhere in the dataset. The conclusion the repo draws is the useful one: the
fix is not a bigger RNN, it is a model that already knows what "guardrail" and
"field office" mean, which is the entire argument for the LoRA lane
(`docs/JOURNAL.md`; `src/lora_data.py` lines 12 to 21 states the same bet from
the other side).

**3. The labels could not be trusted, and checking cost 8.8%.** Training on the
crosswalk without adjudicating it would have scored the model against the
keyword matcher's own opinion (`SPEC.md` §2). The gold pass found 8.8% of silver
labels wrong (`docs/JOURNAL.md`).

**4. `noise` doing double duty is a trap in the metric itself.** `noise` is both
a real class the model should predict for OCR junk and a member of the silent
miss set. So predicting `noise` for a real item is a silent miss, while
predicting it for genuine junk is correct. Class weighting can quietly turn it
into a dumping ground (`docs/MODEL_PLAN.md` §7).

**5. Micro classes cannot be measured at all.** `stockpile` has 2 rows in the
whole corpus. The splitter routes classes that cannot be stratified entirely
into train, so they have zero validation and test support and their F1 is
undefined or 0. The repo's own instruction is to report them as "train only,
unmeasurable" rather than quote a number (`docs/MODEL_PLAN.md` §7).

**6. The shipped model changed identity mid project.** `docs/ARCHITECTURE.md` §5
names a fine tuned DistilBERT as lane 4 and the shipped model, with a whole
comparison table arguing the specialist encoder is the right tool for short
string classification (`docs/ARCHITECTURE.md` §4.3). The professor steered
toward LoRA as the learning focus (`SPEC.md` line 7), DistilBERT became optional
(`SPEC.md` §4, `README.md` bake off table), and it was never built. The reasoning
in §4.3 stands on its own and is worth keeping as a written judgement that got
overridden for a good reason.

**7. Apple Silicon quirks shaped the model code.** `pack_padded_sequence` has
been flaky on the MPS backend, so the model avoids packing entirely and handles
padding with a boolean mask and `masked_fill` before the softmax instead
(`docs/MODEL_PLAN.md` §7, `src/model_attention.py` lines 49 to 51).
`PYTORCH_ENABLE_MPS_FALLBACK=1` is set at import time, before torch initializes
the backend, because setting it later is too late (`src/train_attention.py`
lines 26 to 28).

**8. The LoRA runner's defaults do not reproduce the LoRA run that exists.**
`src/finetune_lora.sh` defaults `MAX_SEQ_LENGTH` to 96 (line 33) and its "for
the record" comment block repeats 96 (line 79), but the adapter that is actually
on disk records `"max_seq_length": 128` (`results/lora_adapter/adapter_config.json`).
Whoever fills in the LoRA row should reconcile these two before quoting a
number, or the published figure will not be reproducible from the published
command.

---

## Charts worth generating

There is **no plotting code anywhere in this repo**. A search for `matplotlib`,
`plt.` and `savefig` across `src/` and `tests/` returns nothing, and `notebooks/`
is empty. So every entry below names the script that produces the *numbers* and
states what still has to be written to produce the *image*. `results/` holds
model artifacts only: three `.pt` checkpoints and the LoRA adapter directory.

| # | Chart | The numbers come from | To draw it |
|---|---|---|---|
| 1 | **The bake off.** Accuracy and macro F1 per lane on gold, four bars. The headline image. | `src/eval_baseline_gold.py` (keyword), `src/baseline_tfidf.py` (TF-IDF), `src/train_attention.py` (attention), `src/eval_lora.py` (LoRA) | No script exists. Two of four lanes also have no recorded number yet. |
| 2 | **Silent miss rate per lane.** The metric that carries the argument, 0.635 down to 0.161. Arguably the better headline. | the `silent_miss_rate` field of `eval.evaluate()`, `src/eval.py` lines 92 to 104, via the same four scripts | No script exists. |
| 3 | **Per class F1, 24 categories, worst first.** Shows the five zero F1 classes as a flat run at the bottom, which is the data exhaustion story in one picture. | `per_class_f1` from `src/eval.py`; `format_report` already sorts worst first (`src/eval.py` lines 153 to 158) | No script exists. The print version is already there, so this is a rendering job. |
| 4 | **Training rows per category against per class F1.** A scatter. The point of the whole project's central lesson: F1 tracks row count, and five classes sit at the origin. | counts from `data.load_train_excluding_gold()` (`src/data.py`); the zero row list is already printed by `src/lora_data.py` lines 118 to 121; F1 from `src/eval.py` | No script exists. |
| 5 | **Per state accuracy, MN against ND against SD, per lane.** The cross state vocabulary gap. Keyword ND 0.267 against TF-IDF ND 0.64. | the `per_state` block of `src/eval.py` lines 113 to 136, which every lane already passes `states=` into | No script exists. |
| 6 | **Coarse against fine.** Money bucket accuracy next to 24 category accuracy, with the lift. The chart that says "this is the number the customer reads". | `src/eval_buckets.py` `main()` already prints exactly this table, `lift` column included | No script exists, and no bucket number has been recorded yet. |
| 7 | **The attention model's training curve.** Train loss and validation macro F1 per epoch, with the early stop marked. | printed per epoch by `src/train_attention.py` line 205 | Not persisted anywhere. The loop would have to log per epoch metrics to a file first. |
| 8 | **Attention weights over one bid item.** A one row heat map showing the model concentrating on the head noun. The single most legible "I built the mechanism" image. | `alpha` inside `AttnClassifier.forward`, `src/model_attention.py` line 51. `docs/MODEL_PLAN.md` §3 calls it out as plottable for error analysis | **Needs a code change.** `forward` computes `alpha` and returns only logits, so nothing can currently read it out. |
| 9 | **Cost per 1,000 items per lane.** Asked for by `SPEC.md` §5. | nothing. No cost figure is recorded in the repo | Cannot be built from the repo today. Both API priced lanes are `[ not recorded ]`. |

If only two get made, make 2 and 4. Chart 2 is the business case and chart 4 is
the intellectual honesty, and between them they carry the argument without a
single number needing explanation.

---

## Open threads for Tobias

Not blockers on this document, but they gate the case study window.

1. **Run `src/eval_lora.py` and record the result**, or the marquee lane stays a
   blank on the site. Command is in `src/finetune_lora.sh` lines 82 to 85.
2. **Score the 2026-08-22 attention checkpoint**, or drop it and quote the
   2026-08-21 numbers only.
3. **Decide what the deployment sentence says.** Today the honest one is "not
   deployed yet, `serve.py` is specced and unwritten". If that changed outside
   this repo, the repo does not know about it.
4. **Reconcile the 96 against 128 sequence length** before publishing the LoRA
   hyperparameters.
5. **The Claude Sonnet reference lane was never built.** If the site wants to
   say "free and local matches the paid API", that comparison does not exist
   yet.
