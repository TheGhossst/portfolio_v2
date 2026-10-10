import type { ReactNode } from "react";
import Link from "next/link";
import { ProjectList } from "@/components/project-list";
import { Frame } from "@/components/frame";
import type { ProjectStatus } from "@/content/projects";
import {
  categoryFilters,
  filterProjects,
  padCount,
  readArchiveQuery,
  statusFilters,
  statusLabels,
  workHref,
  type CategoryFilter,
  type StatusFilter,
} from "@/lib/archive";

export async function WorkArchive({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = readArchiveQuery(await searchParams);
  const filtered = filterProjects(query.category, query.status);

  return (
    <Frame className="pb-20">
      <div className="grid gap-8 border-t border-rule pt-10 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12 md:pt-12">
        <p className="font-mono text-[0.72rem] uppercase leading-[1.45] tracking-[0.14em] text-ink-soft">Filter</p>
        <div>
          <FilterGroup label="Category">
            {categoryFilters.map((filter) => {
              const count = filterProjects(filter.id, query.status).length;
              return (
                <FilterLink
                  key={filter.id}
                  href={workHref(filter.id, query.status, query.view)}
                  active={query.category === filter.id}
                >
                  {filter.label}
                  <span className="ml-1.5 font-mono text-[0.72rem] tabular-nums">{padCount(count)}</span>
                </FilterLink>
              );
            })}
          </FilterGroup>
          <FilterGroup label="Status">
            {statusFilters.map((filter) => {
              const count = filterProjects(query.category, filter.id).length;
              return (
                <FilterLink
                  key={filter.id}
                  href={workHref(query.category, filter.id, query.view)}
                  active={query.status === filter.id}
                >
                  {filter.label}
                  <span className="ml-1.5 font-mono text-[0.72rem] tabular-nums">{padCount(count)}</span>
                </FilterLink>
              );
            })}
          </FilterGroup>
          <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-rule pt-5">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
              {padCount(filtered.length)} shown
            </p>
            <nav aria-label="View">
              <ul className="flex gap-5">
                <FilterLink href={workHref(query.category, query.status, "list")} active={query.view === "list"}>
                  List
                </FilterLink>
                <FilterLink
                  href={workHref(query.category, query.status, "compact")}
                  active={query.view === "compact"}
                >
                  Compact
                </FilterLink>
              </ul>
            </nav>
          </div>
          <div className="mt-8">
            {filtered.length === 0 ? (
              <p className="border-t border-rule py-10 text-ink-soft">{emptyMessage(query.category, query.status)}</p>
            ) : (
              <ProjectList projects={filtered} view={query.view} />
            )}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">{label}</p>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2" aria-label={label}>
        {children}
      </ul>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        aria-current={active ? "true" : undefined}
        className={
          active
            ? "text-ink underline decoration-sage decoration-2 underline-offset-[6px]"
            : "text-ink-soft hover:text-ink"
        }
      >
        {children}
      </Link>
    </li>
  );
}

function emptyMessage(category: CategoryFilter, status: StatusFilter) {
  const categoryLabel = categoryFilters.find((item) => item.id === category)?.label ?? "this category";
  if (category === "all" && status === "all") return "The archive is empty.";
  if (status !== "all" && category !== "all") {
    return `Nothing filed under ${statusLabels[status as ProjectStatus]} in ${categoryLabel}.`;
  }
  if (status !== "all") return `Nothing filed under ${statusLabels[status as ProjectStatus]}.`;
  return `Nothing filed in ${categoryLabel}.`;
}
