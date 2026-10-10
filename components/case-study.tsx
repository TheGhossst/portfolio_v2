import { Suspense, type ReactNode } from "react";
import { GitHubRepos } from "@/components/github-repos";
import { ProjectDiagram } from "@/components/project-diagram";
import { StatusMark } from "@/components/status-mark";
import { TextLink } from "@/components/text-link";
import { Frame } from "@/components/frame";
import { notesForProject } from "@/content/notes";
import type { Project } from "@/content/projects";
import { site } from "@/content/site";

export function CaseStudy({ project }: { project: Project }) {
  const related = notesForProject(project.slug);

  return (
    <article>
      <p className="hidden px-6 pt-6 font-serif print:block">{site.title}</p>
      <Frame className="pb-8 pt-10 md:pt-14">
        <TextLink href="/work">All work</TextLink>
        <header className="mt-8 grid gap-5 pb-12 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12">
          <div>
            <p className="font-serif text-3xl leading-none text-sage">{project.number}</p>
            <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Rev. 0</p>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
              {project.categoryLabel}
            </p>
            <h1 className="mt-3 max-w-[16ch] font-serif text-[2.25rem] font-medium leading-[1.12] tracking-[-0.02em] md:text-[2.75rem]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-[36rem] text-pretty font-serif text-[1.35rem] italic leading-snug md:text-[1.5rem]">
              {project.question}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <StatusMark status={project.status} />
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
                Last noted {project.dateLabel}
              </span>
            </div>
            <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
              Placeholder record · No measurements filed
            </p>
          </div>
        </header>

        {project.slug === "tools-worth-building" ? (
          <StudyBlock id="repositories" label="Repositories">
            <Suspense
              fallback={
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
                  Reading GitHub…
                </p>
              }
            >
              <GitHubRepos />
            </Suspense>
          </StudyBlock>
        ) : null}

        {project.slug === "tools-worth-building" ? null : (
          <>
            <StudyBlock label="Context">
              <div className="space-y-5">
                <p>{project.motivation}</p>
                <p>{project.context}</p>
              </div>
            </StudyBlock>

            <StudyBlock label="Approach">
              <ol className="flex flex-col gap-4">
                {project.approach.map((step, index) => (
                  <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
                    <span className="font-mono text-sm text-ink-soft">{String(index + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <aside className="mt-8 border-l border-sage pl-5">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Decision</p>
                <p className="mt-2 font-serif text-xl italic leading-snug">{project.decision}</p>
              </aside>
            </StudyBlock>

            <StudyBlock label="Figure">
              <figure className="max-w-[28rem] font-mono">
                <div className="border border-rule p-4">
                  <ProjectDiagram slug={project.slug} />
                </div>
                <figcaption className="mt-3 text-[0.72rem] leading-relaxed text-ink-soft">
                  {project.figureCaption}
                </figcaption>
              </figure>
            </StudyBlock>

            <StudyBlock label="Evidence">
              <p>
                Published claims, reproduced results, original experiments, and future ideas are kept apart, so a
                later measurement is not mistaken for something already shown.
              </p>
              <dl className="mt-6 border-t border-rule">
                {project.evidence.map((item) => (
                  <div
                    key={item.kind}
                    className="grid gap-2 border-b border-rule py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
                  >
                    <dt className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
                      {item.label}
                    </dt>
                    <dd>{item.note}</dd>
                  </div>
                ))}
              </dl>
            </StudyBlock>

            <StudyBlock label="Limits">
              <p>{project.challenges}</p>
            </StudyBlock>

            <StudyBlock label="Learned">
              <p>{project.learned}</p>
            </StudyBlock>

            <StudyBlock label="Future">
              <p>{project.future}</p>
            </StudyBlock>

            <StudyBlock label="Resources">
              {project.links.length === 0 ? (
                <p>
                  Source code and papers are not linked yet. When a repository or a paper exists, it will be listed
                  here rather than implied.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <TextLink href={link.href} external={link.external}>
                        {link.label}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              )}
            </StudyBlock>
          </>
        )}

        {related.length > 0 ? (
          <StudyBlock label="Notes">
            <ul className="flex flex-col gap-3">
              {related.map((note) => (
                <li key={note.slug} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <TextLink href={`/notes/${note.slug}`}>{note.title}</TextLink>
                  <span className="font-mono text-[0.72rem] text-ink-soft">{note.dateLabel}</span>
                </li>
              ))}
            </ul>
          </StudyBlock>
        ) : null}

        <div className="border-t border-rule py-10">
          <TextLink href="/work">All work</TextLink>
        </div>
      </Frame>
    </article>
  );
}

function StudyBlock({ id, label, children }: { id?: string; label: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="study-block grid gap-4 border-t border-rule py-10 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12 md:py-12"
    >
      <h2 className="font-mono text-[0.72rem] font-normal uppercase leading-[1.45] tracking-[0.14em] text-ink-soft">
        {label}
      </h2>
      <div className="max-w-[40rem] min-w-0 leading-[1.7]">{children}</div>
    </section>
  );
}
