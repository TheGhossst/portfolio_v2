import Link from "next/link";
import { ProjectDiagram } from "@/components/project-diagram";
import { projectHref } from "@/components/project-list";
import { StatusMark } from "@/components/status-mark";
import type { Project } from "@/content/projects";

export function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => {
        const titleId = `featured-${project.slug}`;
        return (
          <li key={project.slug} className="min-w-0">
            <Link
              href={projectHref(project.slug)}
              aria-labelledby={titleId}
              className="cursor-field group flex h-full flex-col border border-rule bg-paper transition-colors duration-150 hover:border-sage"
            >
              <div className="cursor-field border-b border-rule bg-sage-light px-6 py-7">
                <ProjectDiagram slug={project.slug} className="mx-auto h-auto w-full max-w-[15.5rem]" />
              </div>
              <div className="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-sm text-sage">{project.number}</span>
                  <span className="text-right font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
                    {project.categoryLabel}
                  </span>
                </div>
                <h3
                  id={titleId}
                  className="mt-3 font-serif text-[1.65rem] font-medium leading-[1.15] tracking-[-0.02em] underline decoration-transparent underline-offset-[4px] group-hover:decoration-ink"
                >
                  {project.title}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-snug text-pretty text-ink">{project.summary}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <StatusMark status={project.status} />
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft transition-colors duration-150 group-hover:text-ink">
                    View
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
