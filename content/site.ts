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
    "An MTech student’s archive of blockchain systems, applications, and backend work in Go.",
  statusLabel: "Learning Go",
  statusHref: "/now",
  currentlyExploring: "MTech — learning Go and backend",
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
  { id: "focus", label: "Focus", href: "/#focus" },
  { id: "recent", label: "Recently", href: "/#recent" },
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
    hint: "Study, work, and selected projects",
    external: false,
  },
] as const;

export const homeCopy = {
  headlineLead: "I like understanding",
  headlineRest: "how things work.",
  supporting: "And occasionally, building something to find out.",
  introduction:
    "I’m an MTech student learning Go and backend systems. I’ve worked in blockchain, application development, full-stack software, and machine learning.",
  workLink: "Explore my work",
  allWorkLink: "All work",
  aboutLink: "A little about me",
  noteLabel: "A small thought, left here.",
  noteDate: "12 Mar 2026",
  noteCategory: "Note",
  note: "The interesting part is usually figuring out why it doesn’t work.",
  contactHeadline: "Have something interesting in mind?",
  recentTitle: "Recently, I’ve been…",
} as const;

export const nowCopy = {
  title: "Now",
  lede: "What this archive is currently circling. Updated with the site, not as a status feed.",
  updated: "10 Oct 2026",
  items: [
    {
      label: "Go",
      text: "Learning Go, and the backend work an application has to call.",
    },
    {
      label: "Blockchain",
      text: "E-voting and patient consent, filed as records someone else can check after the fact.",
      href: "/work/e-voting",
    },
    {
      label: "Applications",
      text: "Episode Alerts, for the next episode of a show, and eFHUB, for planning an eFootball squad.",
      href: "/work/episode-alerts",
    },
  ],
} as const;

export const workCopy = {
  label: "Archive",
  title: "Work",
  lede: "Blockchain systems, mobile applications, and full-stack software. Go and backend work is what this archive is learning now.",
} as const;

export const notesCopy = {
  label: "Notes",
  title: "Notes",
  lede: "Short observations kept next to the work they came from. These are thoughts, not findings.",
} as const;

export const cvCopy = {
  label: "CV",
  title: "Résumé",
  lede: "Study, internships, selected work, and technical skills.",
} as const;

/** The only lines on the site that are allowed to have a little personality. */
export const asides = {
  missing: "Well, this wasn’t where I expected to end up either.",
  searchMiss: "I checked the margins, too.",
  copied: "Copied. Try not to lose it in there.",
  copyFailed: "The clipboard wouldn’t take it.",
} as const;
