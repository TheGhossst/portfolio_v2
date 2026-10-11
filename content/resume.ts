/**
 * Résumé layout copy. Personal blanks live in content/resume-details.json.
 *
 * Every string here is sent to anyone who can open the page. Hiding a field
 * on screen is visual only — it is not access control. Do not put secrets here.
 *
 * Unknown facts stay in brackets. Nothing in this file invents an employer,
 * date, phone number, award, paper, or tool.
 */

import { type Project } from "@/content/projects";
import profile from "@/content/profile.json";
import details from "@/content/resume-details.json";
import { contactLinks } from "@/content/site";
import { featuredProjects } from "@/lib/archive";

export type ResumeLink = {
  label: string;
  href: string;
  hint?: string;
};

export type ResumeContact = {
  id: string;
  label: string;
  value: string;
  href?: string;
  sensitive: boolean;
  /** Stays blurred. The eye control refuses instead of revealing the value. */
  locked?: boolean;
};

export type ResumeEntry = {
  id: string;
  title: string;
  meta?: string;
  aside?: string;
  summary: string;
  points?: string[];
  tools?: string[];
  links?: ResumeLink[];
  placeholder?: boolean;
};

export type ResumeContent = {
  name: string;
  headline: string;
  tagline: string;
  summary: string;
  contact: ResumeContact[];
  education: ResumeEntry[];
  experience: ResumeEntry[];
  projects: ResumeEntry[];
  skills: string[];
  achievements: ResumeEntry[];
  publications: ResumeEntry[];
  internships: ResumeEntry[];
  certifications: ResumeEntry[];
};

type DetailRow = {
  title: string;
  dates: string;
  summary: string;
};

type InternshipRow = {
  title: string;
  organization: string;
  dates: string;
  summary: string;
  points: string[];
};

const datesPlaceholder = "[Dates — placeholder]";
const organizationPlaceholder = "[Organization — placeholder]";

function requireContact(label: string) {
  const link = contactLinks.find((item) => item.label === label);
  if (!link) throw new Error(`Résumé is missing the ${label} contact link.`);
  return link;
}

const resumeTools: Record<string, string[]> = {
  "e-voting": ["Blockchain"],
  efhub: ["iOS", "Android"],
};

function selectedProject(project: Project): ResumeEntry {
  const links = project.links.map((link) => ({ label: link.label, href: link.href }));
  const tools = resumeTools[project.slug];
  return {
    id: project.slug,
    title: project.title,
    meta: project.categoryLabel,
    summary: project.summary,
    points: project.approach,
    tools,
    links: links.length > 0 ? links : undefined,
  };
}

function filled(value: string | undefined) {
  return value?.trim() ?? "";
}

function text(value: string | undefined, placeholder: string) {
  const valueText = filled(value);
  return valueText.length > 0 ? valueText : placeholder;
}

function detailEntries(
  items: DetailRow[],
  empty: { id: string; title: string; summary: string },
): ResumeEntry[] {
  const rows = items.flatMap((item, index) => {
    const title = filled(item.title);
    const summary = filled(item.summary);
    const dates = filled(item.dates);
    if (!title && !summary && !dates) return [];
    return [
      {
        id: `${empty.id}-${index + 1}`,
        title: title || empty.title,
        aside: dates || undefined,
        summary: summary || empty.summary,
        placeholder: !title,
      },
    ];
  });

  if (rows.length > 0) return rows;
  return [{ id: empty.id, title: empty.title, summary: empty.summary, placeholder: true }];
}

function internshipEntries(items: InternshipRow[]): ResumeEntry[] {
  const rows = items.flatMap((item, index) => {
    const title = filled(item.title);
    const organization = filled(item.organization);
    const dates = filled(item.dates);
    const summary = filled(item.summary);
    const points = item.points.map((point) => point.trim()).filter((point) => point.length > 0);
    if (!title && !organization && !dates && !summary && points.length === 0) return [];
    return [
      {
        id: `internship-${index + 1}`,
        title: title || "[Role — placeholder]",
        meta: organization || organizationPlaceholder,
        aside: dates || datesPlaceholder,
        summary: summary || "No internship is on file.",
        points: points.length > 0 ? points : undefined,
        placeholder: !title,
      },
    ];
  });

  if (rows.length > 0) return rows;
  return [
    {
      id: "internship-placeholder",
      title: "[Role — placeholder]",
      meta: organizationPlaceholder,
      aside: datesPlaceholder,
      summary: "No internship is on file.",
      placeholder: true,
    },
  ];
}

const github = requireContact("GitHub");
const linkedin = requireContact("LinkedIn");
const email = filled(details.email);

export const resume: ResumeContent = {
  name: profile.name,
  headline: profile.role,
  tagline: "Blockchain, applications, and backend systems",
  summary:
    "I’m an MTech student learning Go and backend systems. I’ve worked in blockchain, application development, full-stack software, and machine learning.",
  contact: [
    {
      id: "email",
      label: "Email",
      value: text(email, "[Email — placeholder]"),
      href: email.includes("@") ? `mailto:${email.replace(/^mailto:/, "")}` : undefined,
      sensitive: false,
    },
    {
      id: "phone",
      label: "Phone",
      value: text(details.phone, "[Phone — placeholder]"),
      sensitive: true,
      locked: true,
    },
    {
      id: "location",
      label: "Location",
      value: text(details.location, "[Location — placeholder]"),
      sensitive: true,
      locked: true,
    },
    {
      id: "github",
      label: github.label,
      value: github.hint,
      href: github.href,
      sensitive: false,
    },
    {
      id: "linkedin",
      label: linkedin.label,
      value: linkedin.hint,
      href: linkedin.href,
      sensitive: false,
    },
  ],
  education: [
    {
      id: "mtech",
      title: "MTech",
      meta: `${text(details.education.field, "[Field — placeholder]")} · ${text(details.education.institution, "[Institution — placeholder]")}`,
      aside: text(details.education.dates, datesPlaceholder),
      summary: "Currently a student, learning Go and the backend work an application has to call.",
    },
  ],
  experience: [
    {
      id: "blockchain",
      title: "Blockchain",
      meta: text(details.experience.blockchain.organization, organizationPlaceholder),
      aside: text(details.experience.blockchain.dates, datesPlaceholder),
      summary: "Systems where a record has to be checkable after the fact.",
      points: [
        "E-voting — a cast ballot written to a blockchain and counted from that ledger.",
        "Patient consent — permission granted and withdrawn, kept apart from the medical chart.",
      ],
    },
    {
      id: "application-development",
      title: "Application development",
      meta: text(details.experience["application-development"].organization, organizationPlaceholder),
      aside: text(details.experience["application-development"].dates, datesPlaceholder),
      summary: "Mobile products with one job each.",
      points: [
        "Episode Alerts — follow television shows and hear when a new episode is out.",
        "eFHUB — an eFootball companion for players, managers, squads, and tactics.",
      ],
    },
    {
      id: "full-stack",
      title: "Full-stack software",
      meta: text(details.experience["full-stack"].organization, organizationPlaceholder),
      aside: text(details.experience["full-stack"].dates, datesPlaceholder),
      summary: "Applications that need both the screen a person uses and the system behind it.",
    },
    {
      id: "machine-learning",
      title: "Machine learning",
      meta: text(details.experience["machine-learning"].organization, organizationPlaceholder),
      aside: text(details.experience["machine-learning"].dates, datesPlaceholder),
      summary: "Part of the work, kept with the systems and applications.",
    },
  ],
  projects: featuredProjects().map(selectedProject),
  skills: [
    "Go and backend systems",
    "Blockchain",
    "App development",
    "Full-stack software",
    "Machine learning",
  ],
  internships: internshipEntries(details.internships),
  achievements: detailEntries(details.achievements, {
    id: "achievement-placeholder",
    title: "[Achievement — placeholder]",
    summary: "No award or distinction is on file.",
  }),
  publications: detailEntries(details.publications, {
    id: "publication-placeholder",
    title: "[Title — placeholder]",
    summary: "No paper is filed with this résumé.",
  }),
  certifications: detailEntries(details.certifications, {
    id: "certification-placeholder",
    title: "[Certification — placeholder]",
    summary: "No certificate is on file.",
  }),
};
