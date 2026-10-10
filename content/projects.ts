/**
 * Placeholder investigations. Summaries describe questions, not measured outcomes.
 * Replace the fields in this file when a real record exists.
 */

export type ProjectCategory = "research" | "systems" | "experiments" | "tools";

export type ProjectStatus = "in-progress" | "completed" | "paused" | "archived";

export type EvidenceKind = "published" | "reproduced" | "original" | "future";

export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  categoryLabel: string;
  categories: ProjectCategory[];
  summary: string;
  status: ProjectStatus;
  featured: boolean;
  dateLabel: string;
  question: string;
  context: string;
  motivation: string;
  approach: string[];
  decision: string;
  figureCaption: string;
  challenges: string;
  learned: string;
  future: string;
  evidence: { kind: EvidenceKind; label: string; note: string }[];
  links: ProjectLink[];
};

const unrecorded = {
  published: "Not yet recorded. This entry does not cite a result as established.",
  reproduced: "Not yet recorded. No external result has been reimplemented here.",
  original: "Not yet recorded. No experimental measurements are stored in this archive.",
} as const;

export const projects: Project[] = [
  {
    slug: "uav-digital-twin",
    number: "01",
    title: "UAV Digital Twin",
    categoryLabel: "Optimization / Research",
    categories: ["research", "systems"],
    summary:
      "Exploring resource allocation, wireless communication, and optimization under network constraints.",
    status: "in-progress",
    featured: true,
    dateLabel: "02 Oct 2026",
    question:
      "How should resources be allocated across a UAV network when the wireless links are part of the problem, not a detail beside it?",
    context:
      "A student research exploration, still open. Nothing on this page is a published claim, a completed system, or a measured result.",
    motivation:
      "A digital twin is easy to draw and easy to overtrust. The interesting constraint is whatever would actually bind the system: shared spectrum, limited energy, and links that do not behave like wires.",
    approach: [
      "State allocation as an optimization problem whose feasible set includes the network, not only the vehicles.",
      "Sketch the system as a small graph: vehicles, links, and a shared resource.",
      "Ask what changes when a constraint tightens, before adding fidelity the question does not need.",
    ],
    decision:
      "Model the communication constraint in the first sketch. A twin that flies accurately and communicates ideally is answering a different question.",
    figureCaption:
      "Figure 1. Three vehicles, dashed radio links, a ground station, and a shared band under one limit. A schematic of the question — not a measured topology.",
    challenges:
      "The twin can drift from the network it is meant to describe, and extra detail makes that drift easier to hide. No failed experiment has been logged yet. The limitation is already visible in the setup: a diagram is not a link budget.",
    learned:
      "The useful version of the model is the one that can be wrong in a specific way. Geometry without a constraint is not that model.",
    future:
      "Write down one comparison worth running — two allocation rules under the same constraint — and record the outcome, including a negative one.",
    evidence: [
      { kind: "published", label: "Published claims", note: unrecorded.published },
      { kind: "reproduced", label: "Reproduced results", note: unrecorded.reproduced },
      { kind: "original", label: "Original results", note: unrecorded.original },
      {
        kind: "future",
        label: "Future ideas",
        note: "Compare two allocation rules under one explicit network constraint, once a measurement exists. This is an intention, not a result.",
      },
    ],
    links: [],
  },
  {
    slug: "ecg-jepa",
    number: "02",
    title: "ECG JEPA",
    categoryLabel: "Machine Learning",
    categories: ["research", "experiments"],
    summary:
      "Investigating whether a joint-embedding predictor can keep the structure of a heartbeat when part of the ECG is withheld.",
    status: "in-progress",
    featured: true,
    dateLabel: "28 Sep 2026",
    question:
      "What should a mask hide on an electrocardiogram, if the model is meant to keep the heartbeat rather than redraw the trace?",
    context:
      "An investigation in progress. Not a benchmark, and not a clinical claim. The object is one lead — P wave, QRS complex, T wave — and a predictor that works in representation space. No accuracy is stated here.",
    motivation:
      "A joint-embedding predictive architecture learns by predicting embeddings of held-out patches, not by reconstructing samples. On an ECG the patch is physiological: a mask over the QRS asks about depolarization, and a mask over the flat baseline asks about almost nothing.",
    approach: [
      "Treat one cardiac cycle as the unit: P wave, QRS complex, and T wave, rather than a generic row of numbers.",
      "Withhold a contiguous patch, drawn here as the QRS, and ask for an embedding of that patch from the visible context.",
      "Keep the comparison between the predicted embedding and the target embedding, so filling the waveform back in is not the goal.",
    ],
    decision:
      "Name the part of the heartbeat the mask removes before choosing an architecture. Otherwise a training run answers whatever the mask happened to hide.",
    figureCaption:
      "Figure 1. One lead, with P and T kept as context and the QRS withheld. The context path predicts an embedding; the target path encodes the hidden complex. Schematic, not a recording or a result.",
    challenges:
      "Lead, gain, and baseline wander change what a patch contains. A clean drawing of one cycle is not a dataset, and a mask over quiet baseline would flatter any model. No training run is recorded here.",
    learned:
      "On an ECG the mask is the hypothesis. It decides whether the representation has to account for depolarization, repolarization, or only the line between them.",
    future:
      "Fix one lead, one description of the samples, and one masking rule tied to a named part of the cycle. Run it, and write down what the embedding preserved — including a failure.",
    evidence: [
      { kind: "published", label: "Published claims", note: unrecorded.published },
      { kind: "reproduced", label: "Reproduced results", note: unrecorded.reproduced },
      { kind: "original", label: "Original results", note: unrecorded.original },
      {
        kind: "future",
        label: "Future ideas",
        note: "One lead, one mask on a named part of the cycle, and one property the embedding should preserve. Not yet run, and not a result.",
      },
    ],
    links: [],
  },
  {
    slug: "tools-worth-building",
    number: "03",
    title: "Tools Worth Building",
    categoryLabel: "Software Engineering",
    categories: ["tools"],
    summary:
      "Practical software, backend systems, and experiments that start with a problem worth solving.",
    status: "paused",
    featured: true,
    dateLabel: "02 Sep 2026",
    question:
      "Which problems are worth a piece of software, and which only feel urgent because a tool would be satisfying to build?",
    context:
      "Paused on purpose. There is no product behind this title. The entry keeps a criterion for tools that might be built later.",
    motivation:
      "A lot of software starts from a stack looking for a job. This is a place to keep the opposite habit: name the problem, decide what the tool is allowed to do, and stop when that is enough.",
    approach: [
      "Write the problem in one sentence that does not mention a framework.",
      "Name the interface a person would actually use, and the system that would have to exist behind it.",
      "Prefer a smaller tool that resolves the problem over a platform that describes it.",
    ],
    decision:
      "If the problem statement needs the tool to make sense, the tool is probably the point, and the work can wait.",
    figureCaption:
      "Figure 1. The problem as a sentence, the interface a person would actually touch, and only the system behind that. Not a diagram of a shipped product.",
    challenges:
      "Scope drifts toward the interesting subsystem. The paused status is the current response to that drift. There is no postmortem of a finished system to file here.",
    learned:
      "A tool is a decision about what not to build, written down early enough to be binding.",
    future:
      "Unpause only for a problem that can be stated without referring to the implementation.",
    evidence: [
      {
        kind: "published",
        label: "Published claims",
        note: "Not applicable yet. This entry is a criterion, not a paper.",
      },
      {
        kind: "reproduced",
        label: "Reproduced results",
        note: "Not yet recorded. Nothing has been rebuilt from someone else’s system.",
      },
      {
        kind: "original",
        label: "Original results",
        note: "Not yet recorded. No tool from this list has been built or measured.",
      },
      {
        kind: "future",
        label: "Future ideas",
        note: "A problem stated in one sentence, with an interface and a refusal. Still a note, not a build.",
      },
    ],
    links: [],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
