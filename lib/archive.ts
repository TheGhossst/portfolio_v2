import { projects, type ProjectCategory, type ProjectStatus } from "@/content/projects";
import { notes } from "@/content/notes";
import { contactLinks, homepageSections, navLinks, nowCopy } from "@/content/site";

export const categoryFilters = [
  { id: "all", label: "All" },
  { id: "research", label: "Research" },
  { id: "systems", label: "Systems" },
  { id: "experiments", label: "Experiments" },
  { id: "tools", label: "Tools" },
] as const;

export const statusFilters = [
  { id: "all", label: "Any status" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
  { id: "paused", label: "Paused" },
  { id: "archived", label: "Archived" },
] as const;

export type CategoryFilter = (typeof categoryFilters)[number]["id"];
export type StatusFilter = (typeof statusFilters)[number]["id"];
export type ArchiveView = "list" | "compact";

export const statusLabels: Record<ProjectStatus, string> = {
  "in-progress": "In progress",
  completed: "Completed",
  paused: "Paused",
  archived: "Archived",
};

const categoryIds = categoryFilters.map((item) => item.id);
const statusIds = statusFilters.map((item) => item.id);

export function readFilter<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && (allowed as readonly string[]).includes(raw)) return raw as T;
  return fallback;
}

export function readArchiveQuery(params: Record<string, string | string[] | undefined>) {
  const category = readFilter(params.category, categoryIds, "all");
  const status = readFilter(params.status, statusIds, "all");
  const view = readFilter(params.view, ["list", "compact"] as const, "list");
  return { category, status, view };
}

export function filterProjects(category: CategoryFilter, status: StatusFilter) {
  return projects.filter((project) => {
    const categoryOk = category === "all" || project.categories.includes(category as ProjectCategory);
    const statusOk = status === "all" || project.status === status;
    return categoryOk && statusOk;
  });
}

export function workHref(category: CategoryFilter, status: StatusFilter, view: ArchiveView) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (status !== "all") params.set("status", status);
  if (view === "compact") params.set("view", "compact");
  const query = params.toString();
  return query ? `/work?${query}` : "/work";
}

export function padCount(value: number) {
  return String(value).padStart(2, "0");
}

export type PaletteItem = {
  id: string;
  group: "Projects" | "Notes" | "On this page" | "Go to";
  label: string;
  hint: string;
  href: string;
  external?: boolean;
  keywords: string;
};

export function paletteItems(): PaletteItem[] {
  const projectItems: PaletteItem[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    group: "Projects",
    label: project.title,
    hint: `${project.number} · ${project.categoryLabel}`,
    href: `/work/${project.slug}`,
    keywords: `${project.summary} ${project.categories.join(" ")} ${statusLabels[project.status]}`,
  }));

  const noteItems: PaletteItem[] = notes.map((note) => ({
    id: `note-${note.slug}`,
    group: "Notes",
    label: note.title,
    hint: note.dateLabel,
    href: `/notes/${note.slug}`,
    keywords: `${note.category} ${note.body.join(" ")}`,
  }));

  const sectionItems: PaletteItem[] = homepageSections.map((section) => ({
    id: `section-${section.id}`,
    group: "On this page",
    label: section.label,
    hint: "Homepage",
    href: section.href,
    keywords: "home section jump",
  }));

  const goTo: PaletteItem[] = [
    ...navLinks.map((link) => ({
      id: `goto-${link.href}`,
      group: "Go to" as const,
      label: link.label,
      hint: link.href,
      href: link.href,
      keywords: "page",
    })),
    {
      id: "goto-now",
      group: "Go to",
      label: "Now",
      hint: nowCopy.title,
      href: "/now",
      keywords: "currently exploring status",
    },
    ...contactLinks.map((link) => ({
      id: `goto-${link.label.toLowerCase()}`,
      group: "Go to" as const,
      label: link.label,
      hint: link.hint,
      href: link.href,
      external: link.external || link.href.startsWith("mailto:") || link.href.startsWith("http"),
      keywords: "contact",
    })),
  ];

  return [...projectItems, ...noteItems, ...sectionItems, ...goTo];
}

export function filterPalette(items: PaletteItem[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) =>
    `${item.label} ${item.hint} ${item.keywords} ${item.group}`.toLowerCase().includes(needle),
  );
}

export function featuredProjects() {
  return projects.filter((project) => project.featured);
}
