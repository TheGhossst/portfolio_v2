import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/frame";
import { PageIntro } from "@/components/page-intro";
import { notes } from "@/content/notes";
import { getProject } from "@/content/projects";
import { notesCopy } from "@/content/site";

export const metadata: Metadata = {
  title: notesCopy.title,
  description: notesCopy.lede,
};

export default function NotesPage() {
  return (
    <>
      <PageIntro label={notesCopy.label} title={notesCopy.title}>
        <p>{notesCopy.lede}</p>
      </PageIntro>
      <Frame className="pb-20">
        <ol className="border-t border-rule">
          {notes.map((note) => {
            const project = note.projectSlug ? getProject(note.projectSlug) : undefined;
            return (
              <li
                key={note.slug}
                className="grid gap-3 border-b border-rule py-8 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12 md:py-10"
              >
                <time dateTime={note.date} className="font-mono text-sm text-ink-soft">
                  {note.dateLabel}
                </time>
                <div>
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">{note.category}</p>
                  <h2 className="mt-2 font-serif text-[1.65rem] font-medium leading-tight">
                    <Link
                      href={`/notes/${note.slug}`}
                      className="underline decoration-transparent underline-offset-[3px] hover:decoration-ink"
                    >
                      {note.title}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-[38rem]">{note.body[0]}</p>
                  {project ? (
                    <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
                      With {project.title}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Frame>
    </>
  );
}
