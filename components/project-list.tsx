import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectDiagram } from "@/components/project-diagram";
import { StatusMark } from "@/components/status-mark";
import { TextLink } from "@/components/text-link";

export function ProjectList({
  projects,
  view = "list",
}: {
  projects: Project[];
  view?: "list" | "compact";
}) {
  if (projects.length === 0) {
    return (
      <p className="border-t border-rule py-10 text-ink-soft">Nothing in the archive matches this filter.</p>
    );
  }

  if (view === "compact") {
    return (
      <ol className="border-t border-rule">
        {projects.map((project) => (
          <li key={project.slug} className="border-b border-rule">
            <Link
              href={projectHref(project.slug)}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 py-3 md:grid-cols-[3rem_minmax(0,1fr)_12rem_8.5rem]"
            >
              <span className="font-mono text-sm text-ink">{project.number}</span>
              <span className="font-serif text-xl leading-snug underline decoration-transparent underline-offset-[3px] group-hover:decoration-ink">
                {project.title}
              </span>
              <span className="col-start-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft md:col-start-auto">
                {project.categoryLabel}
              </span>
              <span className="col-start-2 md:col-start-auto">
                <StatusMark status={project.status} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="border-t border-rule">
      {projects.map((project) => (
        <li key={project.slug} className="border-b border-rule py-8 md:py-10">
          <article className="grid gap-6 md:grid-cols-[3.25rem_minmax(0,1fr)_14rem] md:gap-8">
            <div className="flex items-baseline justify-between md:block">
              <p className="font-serif text-2xl leading-none text-sage">{project.number}</p>
              <div className="md:hidden">
                <StatusMark status={project.status} />
              </div>
            </div>
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
                {project.categoryLabel}
              </p>
              <h3 className="mt-2 font-serif text-[1.65rem] font-medium leading-[1.2] tracking-[-0.02em] md:text-[1.75rem]">
                <Link
                  href={projectHref(project.slug)}
                  className="underline decoration-transparent underline-offset-[3px] transition-colors duration-150 hover:decoration-ink"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-[36rem] text-pretty">{project.summary}</p>
              <div className="mt-5 hidden md:block">
                <StatusMark status={project.status} />
              </div>
              <TextLink href={projectHref(project.slug)} className="mt-5 inline-block">
                Explore this project
              </TextLink>
            </div>
            <figure className="font-mono md:pt-1">
              <div className="border border-rule px-3 py-3">
                <ProjectDiagram slug={project.slug} />
              </div>
              <figcaption className="mt-2 text-[0.7rem] leading-relaxed text-ink-soft">
                Fig. {project.number} — Schematic, not a measurement.
              </figcaption>
            </figure>
          </article>
        </li>
      ))}
    </ol>
  );
}

function projectHref(slug: string) {
  return slug === "tools-worth-building" ? `/work/${slug}#repositories` : `/work/${slug}`;
}
