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
