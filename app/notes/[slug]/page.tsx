import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Frame } from "@/components/frame";
import { TextLink } from "@/components/text-link";
import { getNote, notes } from "@/content/notes";
import { getProject } from "@/content/projects";

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return { title: "Notes" };
  return {
    title: note.title,
    description: note.body[0],
  };
}

export default function NotePage({ params }: PageProps<"/notes/[slug]">) {
  return (
    <Suspense fallback={<RecordFallback />}>
      <NoteContent params={params} />
    </Suspense>
  );
}

async function NoteContent({ params }: { params: PageProps<"/notes/[slug]">["params"] }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  const project = note.projectSlug ? getProject(note.projectSlug) : undefined;

  return (
    <Frame className="pb-20 pt-12 md:pt-16">
      <TextLink href="/notes">All notes</TextLink>
      <header className="mt-8 grid gap-5 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12">
        <div>
          <time dateTime={note.date} className="font-mono text-sm text-ink-soft">
            {note.dateLabel}
          </time>
          <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">{note.category}</p>
        </div>
        <div className="min-w-0">
          <h1 className="max-w-[18ch] font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.02em] md:text-[2.75rem]">
            {note.title}
          </h1>
          <div className="mt-8 max-w-[38rem] space-y-5">
            {note.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {project ? (
            <p className="mt-8">
              Filed with <TextLink href={`/work/${project.slug}`}>{project.title}</TextLink>
            </p>
          ) : null}
        </div>
      </header>
    </Frame>
  );
}

function RecordFallback() {
  return (
    <Frame className="pb-20 pt-14">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Opening the note…</p>
    </Frame>
  );
}
