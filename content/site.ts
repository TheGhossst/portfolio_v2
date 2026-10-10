/**
 * Editable site copy and placeholder destinations.
 * Change the name, email, and profile URLs here — layout reads from this file.
 */

export const site = {
  name: "Riley",
  wordmarkLead: "riley",
  wordmarkRest: "personal archive",
  title: "The Personal Archive",
  description:
    "A personal archive of investigations in systems, machine learning, and software.",
  statusLabel: "Exploring research",
  statusHref: "/now",
  currentlyExploring: "Currently exploring — research, systems & software",
  lastUpdated: "10 Oct 2026",
  year: "2026",
  identityNote: "Placeholder identity",
} as const;

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/notes", label: "Notes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const homepageSections = [
  { id: "intro", label: "Introduction", href: "/#intro" },
  { id: "work", label: "Selected work", href: "/#work" },
  { id: "note", label: "A small thought", href: "/#note" },
  { id: "recent", label: "Recently", href: "/#recent" },
  { id: "about", label: "About", href: "/#about" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;

export const contactLinks = [
  {
    label: "Email",
    href: "mailto:placeholder@example.com",
    hint: "placeholder@example.com",
    external: false,
  },
  {
    label: "GitHub",
    href: "https://example.com",
    hint: "example.com — placeholder",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://example.com",
    hint: "example.com — placeholder",
    external: true,
  },
  {
    label: "CV",
    href: "/cv",
    hint: "Not published yet",
    external: false,
  },
] as const;

export const homeCopy = {
  headlineLead: "I like understanding",
  headlineRest: "how things work.",
  supporting: "And occasionally, building something to find out.",
  introduction:
    "I’m a software engineering student interested in systems, machine learning, and the ideas that sit between theory and something real.",
  workLink: "Explore my work",
  aboutLink: "A little about me",
  noteLabel: "A small thought, left here.",
  noteDate: "12 Mar 2026",
  noteCategory: "Note",
  note: "The interesting part is usually figuring out why it doesn’t work.",
  contactHeadline: "Have something interesting in mind?",
  recentTitle: "Recently, I’ve been…",
} as const;

export const aboutCopy = {
  title: "A little about me",
  paragraphs: [
    "I’m a software engineering student interested in systems, machine learning, and the ideas that sit between theory and something real.",
    "This site is a personal archive of that work: projects still being figured out, notes from the middle of a problem, and the occasional record of a decision. It is not a résumé in disguise.",
  ],
  interestsLabel: "Interests",
  interests: [
    "Systems",
    "Machine learning",
    "The space between a theory and something that runs",
  ],
} as const;

export const nowCopy = {
  title: "Now",
  lede: "What this archive is currently circling. Updated with the site, not as a status feed.",
  updated: "10 Oct 2026",
  items: [
    {
      label: "Research",
      text: "Resource allocation and wireless constraints, through a UAV digital twin. No measurements are filed yet.",
      href: "/work/uav-digital-twin",
    },
    {
      label: "Machine learning",
      text: "ECG JEPA — what a mask on one heartbeat asks a representation to keep. No training run is filed.",
      href: "/work/ecg-jepa",
    },
    {
      label: "Software",
      text: "Which tools are worth building, paused until a problem can be stated without a stack attached.",
      href: "/work/tools-worth-building",
    },
  ],
} as const;

export const workCopy = {
  label: "Archive",
  title: "Work",
  lede: "Investigations filed while they are still open. The descriptions are placeholders, not claims about finished systems.",
} as const;

export const notesCopy = {
  label: "Notes",
  title: "Notes",
  lede: "Short observations kept next to the work they came from. These are thoughts, not findings.",
} as const;

export const cvCopy = {
  label: "CV",
  title: "Résumé",
  lede: "A résumé file is not published yet. This page is here so the contact link has somewhere to go.",
} as const;
