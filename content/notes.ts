export type Note = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  body: string[];
  projectSlug?: string;
};

export const notes: Note[] = [
  {
    slug: "why-the-twin-is-not-the-system",
    title: "Why the twin is not the system",
    date: "2026-10-02",
    dateLabel: "02 Oct 2026",
    category: "Systems",
    projectSlug: "uav-digital-twin",
    body: [
      "A diagram of vehicles and links is not a network. It is a claim about which parts of the network are allowed to matter.",
      "If that claim leaves out the constraint that actually binds allocation, the twin will answer confidently and still be about something else.",
      "I want the first version to be able to fail in a way I can point at. Detail can come after that, if it still seems necessary.",
    ],
  },
  {
    slug: "what-the-mask-is-for",
    title: "What the mask is for",
    date: "2026-09-28",
    dateLabel: "28 Sep 2026",
    category: "Machine learning",
    projectSlug: "ecg-jepa",
    body: [
      "On an ECG, hiding a stretch of the trace is not preprocessing. It chooses which part of the heartbeat the context is not allowed to see.",
      "A window over the QRS asks the representation to account for depolarization. A window over the flat baseline asks it to account for almost nothing.",
      "The JEPA demand is more specific than inpainting: predict an embedding of the hidden patch. Drawing the missing samples back in would be a different question.",
      "If I cannot name the patch, I do not have an experiment yet. I have a diagram of one.",
    ],
  },
  {
    slug: "a-tool-is-a-refusal",
    title: "A tool is a refusal",
    date: "2026-09-02",
    dateLabel: "02 Sep 2026",
    category: "Software",
    projectSlug: "tools-worth-building",
    body: [
      "The useful sentence is often the one that says what the tool will not do.",
      "This note is filed while that work is paused, so the next experiment has to start from a problem rather than from an empty repository.",
    ],
  },
];

export function getNote(slug: string) {
  return notes.find((note) => note.slug === slug);
}

export function notesForProject(slug: string) {
  return notes.filter((note) => note.projectSlug === slug);
}
