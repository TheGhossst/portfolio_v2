/**
 * Placeholder investigations. Summaries describe questions, not measured outcomes.
 * Replace the fields in this file when a real record exists.
 */

export type ProjectCategory = "research" | "systems" | "experiments" | "tools" | "apps";

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
  recordNote?: string;
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

const builtRecord = "Built system · Filed without a separate study";

export const projects: Project[] = [
  {
    slug: "e-voting",
    number: "01",
    title: "E-Voting",
    categoryLabel: "Blockchain",
    categories: ["systems"],
    summary: "An election system that writes each cast ballot to a blockchain, so the tally is not kept on one server.",
    status: "completed",
    featured: true,
    dateLabel: "10 Oct 2026",
    question: "How can a vote be cast and checked later, with the record held by more than one party?",
    context:
      "A blockchain system for an election. A voter casts a ballot, the ballot is written to a shared ledger, and the count is read back from that record.",
    motivation:
      "A voting server can be altered, or simply disappear. The property worth keeping is a ballot that more than one party can see after it is cast.",
    approach: [
      "Separate the person who votes from the ballot that is stored, so reading the ledger is a different act from learning who voted.",
      "Write the cast ballot to a blockchain, and keep that copy as the one the tally uses.",
      "Count from the ledger. A result that cannot be read back from it is unfinished.",
    ],
    decision: "The record of the vote is the system. The screen is only how a person casts it.",
    figureCaption:
      "Figure 1. A voter, the ballot they cast, and the ledger that holds it. A schematic of the record — not a deployment diagram.",
    recordNote: builtRecord,
    challenges:
      "A ledger people can audit and a ballot that stays private pull in opposite directions. Storing the vote carelessly can reveal the voter. This page does not include a formal privacy proof.",
    learned: "The difficult part is what the ledger is allowed to show, once the transaction that writes the ballot already exists.",
    future: "A receipt a voter can check, and a tally the public can read, kept as two different views of the same record.",
    evidence: [
      { kind: "published", label: "Published claims", note: "No paper is filed with this record." },
      {
        kind: "reproduced",
        label: "Reproduced results",
        note: "This is an original system, built for the election problem, rather than a reimplementation of a published result.",
      },
      {
        kind: "original",
        label: "Original results",
        note: "The voting flow was built: cast a ballot, write it to the chain, and count from that record. No separate measurement study is stored here.",
      },
      {
        kind: "future",
        label: "Future ideas",
        note: "Split the voter’s receipt from the public tally, so checking your own vote does not expose anyone else’s.",
      },
    ],
    links: [],
  },
  {
    slug: "patient-consent",
    number: "02",
    title: "Patient Consent",
    categoryLabel: "Blockchain",
    categories: ["systems"],
    summary: "A consent record on a blockchain, so a patient’s permission can be granted, read, and withdrawn.",
    status: "completed",
    featured: true,
    dateLabel: "10 Oct 2026",
    question: "Where should a patient’s permission live, when more than one system needs to see that it was given?",
    context:
      "A consent system for care. The patient grants or withdraws permission, and that act is stored where it can be checked later.",
    motivation:
      "Consent that exists only inside one organisation’s database is difficult to show to anyone else, and difficult to take back in a way the other party can see.",
    approach: [
      "Treat consent as its own record: who it concerns, what it allows, and whether it is still in force.",
      "Write grants and withdrawals to a blockchain, in order, so a later reader can see which one came last.",
      "Keep the clinical chart off the ledger. The chain stores the permission, and the care system stores the medicine.",
    ],
    decision: "The chain holds the permission. It does not hold the medical record.",
    figureCaption:
      "Figure 1. A patient, the consent they give or withdraw, and the record that keeps those acts in order. Schematic, not a hospital deployment.",
    recordNote: builtRecord,
    challenges:
      "A consent record can outlive the reason it was given. Withdrawal has to be as visible as the original grant. This page does not claim a clinical deployment or a regulatory approval.",
    learned: "Consent is a sequence. The last entry is the one a reader has to trust.",
    future: "A view for the patient of the permissions still in force, without asking them to read the whole ledger.",
    evidence: [
      { kind: "published", label: "Published claims", note: "No paper is filed with this record." },
      {
        kind: "reproduced",
        label: "Reproduced results",
        note: "This is an original consent system, rather than a reimplementation of a published protocol.",
      },
      {
        kind: "original",
        label: "Original results",
        note: "Grant and withdrawal were built as ordered records on a blockchain. No clinical trial is stored here.",
      },
      {
        kind: "future",
        label: "Future ideas",
        note: "Show the patient the current state of each permission, derived from the latest entry.",
      },
    ],
    links: [],
  },
  {
    slug: "episode-alerts",
    number: "03",
    title: "Episode Alerts",
    categoryLabel: "Mobile",
    categories: ["apps"],
    summary: "A mobile app for following television shows and hearing when a new episode is out.",
    status: "completed",
    featured: true,
    dateLabel: "16 Apr 2026",
    question: "How does a person keep a list of shows without opening each one to see whether something new has aired?",
    context:
      "A mobile application. The person follows shows, and the app is responsible for saying when the next episode is available.",
    motivation:
      "Shows sit on different services. The missing piece is one list, and a notice when that list changes.",
    approach: [
      "Keep the shows a person follows, and the episode they are waiting on.",
      "Watch the schedule, so the person does not have to open every title.",
      "Send the alert when a new episode is out, and leave the rest of the app quiet.",
    ],
    decision: "The product is the alert. A catalogue to browse is the supporting screen.",
    figureCaption:
      "Figure 1. A show, the schedule it belongs to, and the alert when the next episode is out. Schematic of the app, not a store listing.",
    recordNote: builtRecord,
    challenges:
      "Air dates move, and an alert for the wrong night is worse than a late one. This record does not include a user count or a store rating.",
    learned: "The useful screen is the next episode. The whole catalogue can wait behind it.",
    future: "A clearer place for shows that are between seasons, so the list stays about what is actually next.",
    evidence: [
      { kind: "published", label: "Published claims", note: "No paper is filed with this record." },
      {
        kind: "reproduced",
        label: "Reproduced results",
        note: "The app was built to track shows the person follows. It is a product, not a reproduced experiment.",
      },
      {
        kind: "original",
        label: "Original results",
        note: "Follow a show, keep the next episode, and raise an alert when it is out. No usage study is stored here.",
      },
      {
        kind: "future",
        label: "Future ideas",
        note: "Hold between-season shows apart from the ones with an episode actually coming.",
      },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/TheGhossst/EpisodeAlerts-MobileApp",
        external: true,
      },
    ],
  },
  {
    slug: "efhub",
    number: "04",
    title: "eFHUB",
    categoryLabel: "Mobile",
    categories: ["apps"],
    summary:
      "A mobile companion for eFootball: player and manager databases, a squad builder, and a way to read tactics.",
    status: "completed",
    featured: true,
    dateLabel: "10 Oct 2026",
    question: "What does a player need beside the game, when building a squad means comparing stats, managers, and cost?",
    context:
      "eFHUB is a companion app for eFootball on iOS and Android. It is a planning tool — player cards, managers, squads, and tactics — and it is not part of the game itself.",
    motivation:
      "The game shows a player as they are when you have them. Planning a squad needs the stats at max level, the manager’s shape, and what the squad costs to keep.",
    approach: [
      "Search a player database on max-level stats, and show the main strengths on the card.",
      "Keep a manager database for formation and tactics, including managers who change shape through a season.",
      "Build a squad that totals team strength and contract cost, and that can be assembled from the limits you set.",
    ],
    decision: "The app is for the decision before the match: who is in the squad, under which manager, at what cost.",
    figureCaption:
      "Figure 1. A player, the squad they join, and the plan that tests the shape. Schematic of the companion, not an in-game screen.",
    recordNote: builtRecord,
    challenges:
      "The data has to follow a game that changes every season. eFHUB is an unofficial companion and is not affiliated with the game’s publisher. This page does not file download counts or ratings.",
    learned: "A companion earns its place when it answers the question the match screen is poor at: what this player becomes, and what the squad costs.",
    future: "Keep the season’s data current, including evolutions, without turning the planner into another copy of the game.",
    evidence: [
      { kind: "published", label: "Published claims", note: "No paper is filed with this record." },
      {
        kind: "reproduced",
        label: "Reproduced results",
        note: "The app is a product for planning squads. It is not a reproduced experiment.",
      },
      {
        kind: "original",
        label: "Original results",
        note: "Players, managers, a squad builder, a game plan, hidden-gem search, and skill tutorials are part of the app. No usage study is stored here.",
      },
      {
        kind: "future",
        label: "Future ideas",
        note: "Carry evolutions and the new season’s cards in the same planner.",
      },
    ],
    links: [
      {
        label: "eFHUB app",
        href: "https://efhub.com/app",
        external: true,
      },
    ],
  },
  {
    slug: "uav-digital-twin",
    number: "05",
    title: "UAV Digital Twin",
    categoryLabel: "Optimization / Research",
    categories: ["research", "systems"],
    summary:
      "Exploring resource allocation, wireless communication, and optimization under network constraints.",
    status: "in-progress",
    featured: false,
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
    number: "06",
    title: "ECG JEPA",
    categoryLabel: "Machine Learning",
    categories: ["research", "experiments"],
    summary:
      "Investigating whether a joint-embedding predictor can keep the structure of a heartbeat when part of the ECG is withheld.",
    status: "in-progress",
    featured: false,
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
    number: "07",
    title: "Tools Worth Building",
    categoryLabel: "Software Engineering",
    categories: ["tools"],
    summary:
      "Practical software, backend systems, and experiments that start with a problem worth solving.",
    status: "paused",
    featured: false,
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
