import type { Project } from '../types'

// -------------------------------------------------------------------------
// Issue #57. Written 2026-08-26 from `docs/extracted/nlp-material-classifier.md`,
// which cites every figure to a file in `~/dev/nlp-material-classifier`.
//
// Three things decide the shape of this page.
//
// The opening is the defect, not the accuracy. The extraction's own line is
// "the number that starts the story is not an accuracy, it is a defect", and
// it is right: an F1 of 0.546 is unremarkable on its own and becomes the story
// only once a reader knows the thing it replaced categorized 28 percent of
// items and under reported one tonnage by 605x.
//
// The LoRA row is a blank and stays one. The adapter is on disk, `eval_lora.py`
// exists, and nobody has run it. The boot sequence's 0.914 is set dressing per
// CONTEXT.md and must never be borrowed to fill this. See `constraint` below.
//
// The deployment sentence is "not deployed yet". It costs nothing, because the
// project's finding is about the baseline being broken and the baseline is the
// part that is measured.
// -------------------------------------------------------------------------

const project: Project = {
  slug: 'nlp-material-classifier',
  order: 20,
  title: 'NLP Material Classifier',
  windowTitle: 'CLASSIFIER.APP',
  // The lede is the defect. Was a description of the architecture, which asked
  // a reader to care about a sequence model before knowing why anyone needed
  // one.
  oneLiner:
    'The keyword matcher this replaced read 121,221 tons of hot mix as 200. The project rebuilt that step as a local model and scored it against 331 labels adjudicated by hand.',
  role: 'Built it',
  // Was 'Private repo'. Status is the deployment fact, and the honest one is
  // that nothing from this repo runs anywhere yet.
  status: 'Not deployed yet',
  year: '2026',
  categories: ['ai-ml'],
  // Drafted from the extraction, not signed off by T, and one row of the
  // accuracy table is a blank waiting on a run only he can start.
  copyState: 'PLACEHOLDER',
  caseStudy: true,
  atAGlance: {
    problem: '28 percent of line items categorized, one tonnage miss of 605x',
    approach: '331 labels adjudicated by hand, every lane through one harness',
    output: 'A local classifier, and the first score this step has ever had',
    evidence: "0.546 macro F1 against the keyword matcher's 0.328, same 331 rows",
  },
  // Inside ADR-0001's 150 word cap, no technical detail, and the defect before
  // the method. A reader who stops after two sentences still has the stake.
  problem:
    'Every line item in a highway bid document has to be assigned a material, because those categories add up into the tonnage a paving contractor prices the job on. The step that made the call was a hand tuned keyword list. Measured against 2,434 labeled items, it categorized 681 of them, 28 percent, and sent two thirds of the rest to a paid model call. Twelve of the 24 categories were missing from its vocabulary entirely. None of that is visible while it happens. On one project it read 121,221 tons of hot mix as 200, a 605x under report, because the pay item used North Dakota wording and the keywords were written in Minnesota. A contractor could bid off that number and never know.',
  built: [
    'A gold test set of 331 rows, adjudicated by hand, stratified across all 24 categories and frozen before any model saw it.',
    'One eval harness every lane is scored through, so the comparison is fair by construction.',
    'Three lanes: TF-IDF over character n grams, attention written from scratch, and a LoRA fine tune of Qwen2.5 1.5B, all local.',
  ],
  architecture:
    'A line item string goes in, one of 24 material categories comes out, and it all runs on one machine, so classification costs nothing per item and no bid data leaves. The lanes differ only in the middle.',
  mlDecisions: [
    {
      label: 'The existing labels could not be the test set',
      body: "Of the 2,434 crosswalk rows, 681 carried the keyword matcher's own opinion and 1,608 were guesses on what it missed, so scoring against them measures agreement with the thing being replaced. Step zero was 331 rows adjudicated by hand and frozen, and training drops any row that appears in gold, in code rather than by intention.",
    },
    {
      label: 'A wrong answer and no answer are different failures',
      body: 'Silent miss rate is the share of rows whose truth is a real category and whose prediction lands in other, noise or nothing. Accuracy charges one point for both. A number in the wrong column is one somebody may query; a non answer is tonnage that is silently not there.',
    },
  ],
  stack: [
    'Python',
    'scikit-learn',
    'PyTorch',
    'MLX',
    'Qwen2.5 1.5B Instruct',
    'LoRA',
    'TF-IDF, character n grams',
    'Attention written from scratch',
    'Apple Silicon, local',
  ],
  media: [
    {
      caption:
        'Line item in, material category out. [ Diagram not drawn yet, it has its own ticket. ]',
      tone: 'diagram',
    },
  ],
  // Ordered by strength, per CONTEXT.md. The measured number leads, the
  // deployment fact is stated rather than hidden, and the unrun lane is a
  // blank instead of a plausible sentence.
  evidence: [
    'TF-IDF plus logistic regression scores 0.546 macro F1 and 0.628 accuracy on the gold set, against 0.328 and 0.308 for the keyword matcher in production. Same harness, no marginal cost.',
    'Silent misses fall fourfold, 0.635 to 0.161, which for a tonnage rollup matters more than the accuracy does.',
    'The first hand labeled accuracy benchmark this step has ever had. Adjudicating the old labels found 8.8 percent of them wrong.',
    'Not deployed yet. The serving wrapper is specified and unwritten, and what runs in CSI production is the keyword matcher this set out to replace.',
    '[ The LoRA lane has never been scored. The adapter is on disk and src/eval_lora.py prints every number this row needs. ]',
  ],
  // Chips are first person claims and this project is one person's, so the
  // list is long and the team line says so. The course is named because it is
  // the honest frame: this is coursework that measured a production system,
  // not a production deliverable.
  contribution: {
    chips: [
      'GOLD SET ADJUDICATION',
      'EVAL HARNESS',
      'SILENT MISS METRIC',
      'LEAKAGE CONTROL',
      'TF-IDF BASELINE',
      'ATTENTION FROM SCRATCH',
      'LORA FINE TUNE',
      'ERROR ANALYSIS',
    ],
    team:
      'A course project for MSBA 6461, Advanced AI for NLP. [ Confirm nobody else worked on it and this line can say solo. ]',
  },
  deepDive: [
    {
      heading: 'The gold set, and the 8.8 percent it caught',
      body: "The 331 rows were sampled stratified by category with a cap of 15 rows each and a fixed seed, so classes with two examples in the whole corpus appear instead of drowning under noise. They were shuffled before labeling to reduce anchoring, and shown alongside the database's existing suggestion, which made the pass adjudication rather than blind labeling. It found 8.8 percent of the old labels wrong, and the errors clustered informatively: plan sheet titles labeled as work, the word bituminous over firing to hot mix on saw and salvage lines, sign legends labeled as the thing the sign names.",
    },
    {
      heading: 'The LoRA lane is built, and it has never been scored',
      body: 'The adapter exists. Its config records the run that made it: Qwen2.5 1.5B Instruct at 4 bit, rank 8, scale 20, 8 layers, batch size 8, 400 iterations, learning rate 1e-4, sequence length 128, seed 0. Training used 1,874 rows with 209 held for validation, and all 331 gold rows held out. The scorer prints accuracy, macro F1, silent miss, a per state split and a parse robustness count, and writes none of it to a file, so no number from it exists anywhere in the repo. One thing to reconcile before publishing the hyperparameters: the runner script defaults sequence length to 96 in two places while the adapter on disk records 128, so the published figure would not reproduce from the published command.',
    },
    {
      heading: 'Macro F1 selects the model, accuracy does not',
      body: 'The 24 classes run from roughly 801 rows of noise down to 2 of stockpile, so an accuracy optimizer learns to answer noise and scores well doing it. Macro F1 is the selection metric everywhere in the project for that reason. The tail costs something in return: a class with 2 rows in the whole corpus cannot be split into train, validation and test at all, so it lands entirely in train and its F1 is undefined rather than low. Those are reported as train only and unmeasurable rather than quoted as a zero.',
    },
    {
      heading: 'Two details keep the silent miss rate honest',
      body: 'Rows whose truth is itself other or noise are excluded from the metric, so answering other for a genuinely other row is correct rather than punished. And a non answer is mapped to a sentinel that can never match any truth, so a model that returns nothing scores as wrong instead of crashing the scorer. Without the first, the metric would punish the correct answer on the most common class in the corpus.',
    },
    {
      heading: 'A second scoreboard scores the product rather than the model',
      body: 'The 24 way task is the honest labeled task, but it is not the task the customer reads. A second pass rolls every category into the 7 that carry tonnage plus one non_material class, turning it into an 8 way problem, and reuses the same arithmetic so only the labels differ. The reason is that an error between hot mix and base corrupts a total an estimator reads first, while an admin against testing_qc mixup costs macro F1 and no money. Both are printed, one under the other, so neither can be quoted without the other being visible. [ No bucket level number has been recorded for any lane. ]',
    },
    {
      heading: 'The from scratch model lost, and the data says why, not the architecture',
      body: "Attention scored 0.396 against TF-IDF's 0.628. The diagnosis was counts, not intuition: five of the 24 categories had zero training rows left after the gold rows were held out, because they are globally rare and the stratified sample drained them into the test set. A model cannot predict a class it never saw, which guarantees 0 F1 on five classes and caps macro F1 by roughly 0.21 before training starts. Going to look for more data recovered one of them, about 25 examples. The rest are exhausted everywhere in the dataset, which is the entire argument for the fine tuned lane: the fix is not a bigger network, it is a model that already knows what a guardrail is. Short keyword like text also suits character n grams, where a shared substring carries the signal even when the exact token was never seen in training, and that is what lifts North Dakota from 0.267 to 0.64.",
    },
    {
      heading: 'A judgement that was written down and then overridden',
      body: 'The architecture document names a fine tuned DistilBERT as the shipped model and argues, at length and correctly, that a specialist encoder is the right tool for classifying short strings. The professor steered the course toward LoRA as the learning focus, DistilBERT became optional, and it was never built. The reasoning still stands and is worth keeping as a judgement that lost to a good reason rather than to a better argument.',
    },
    {
      heading: 'Apple Silicon shaped the model code',
      body: 'Packed sequences have been flaky on the MPS backend, so the model avoids packing entirely and handles padding with a boolean mask before the softmax instead. The MPS fallback environment variable is set at import time, before torch initializes the backend, because setting it afterwards is too late to have any effect.',
    },
    {
      heading: 'Nothing from this repo is deployed',
      body: 'The serving wrapper is specified as a single function, classify a description and return a category, and that file does not exist. Its ticket is unchecked. What runs in production today is the keyword matcher plus a paid model call on everything it misses, so production accuracy on the gold set is the keyword row, 0.308, plus a fallback lane that has never been scored at all. The supported claim is that a free local model doubles the accuracy of the thing in production. The claim that it shipped is not supported, yet.',
    },
  ],
  lessons: [
    'A model that loses can still be the finding. The attention network written from scratch lost to a linear model, and the reason was the data, not the architecture: five categories had no training rows at all, which caps macro F1 by about 0.21 whatever sits in the middle. Counting the rows was worth more than another epoch.',
    'The yardstick outlasts the model. This step had no accuracy number in any form before, only coverage and known failures, so nobody could say whether a change helped. Doubling the accuracy is the headline; the 331 frozen labels are what the next attempt gets judged on.',
  ],
  // Renders nothing. Read it before adding to this page.
  //
  // Confidentiality. The extraction held two rules and this page holds them
  // too: no client bid data, no project names, no quantities off a real bid
  // beyond the single 605x figure, which issue #57 cleared explicitly as the
  // opening of the case study. CSI is named once, in the deployment sentence,
  // because "what runs in production is the thing this replaced" cannot be
  // said without it. Q-06 in TICKETS.md is still open on how much CSI system
  // detail is safe, so if the answer narrows, the sentence to revisit is that
  // one and the number to revisit is the 28 percent coverage figure.
  //
  // Blanks. Two rows of the accuracy table are unrecorded, not bad: the LoRA
  // lane and every bucket level score. The boot sequence's 0.914 is set
  // dressing per CONTEXT.md and must never be used to fill either. The command
  // that fills the LoRA row is in the repo's finetune script.
  //
  // Charts. No plotting code exists in that repo. If this page gets a chart,
  // the extraction recommends two: silent miss rate per lane, which carries the
  // business case, and training rows per category against per class F1, which
  // carries the intellectual honesty. Between them they make the argument with
  // no number needing explanation.
  constraint:
    'Written from docs/extracted/nlp-material-classifier.md, which cites every figure to a file. No client bid data, no project names, no quantities beyond the one 605x figure issue #57 cleared. The LoRA row stays blank until somebody runs the scorer, and the boot sequence F1 is set dressing that may never fill it.',
}

export default project
