"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import type { ResumeContact, ResumeContent, ResumeEntry, ResumeLink } from "@/content/resume";

export function ResumeDocument({ resume }: { resume: ResumeContent }) {
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    function onBeforePrint() {
      delete document.documentElement.dataset.resumePrint;
      document.querySelectorAll(".resume-panel").forEach((panel) => {
        panel.removeAttribute("inert");
      });
    }

    function onAfterPrint() {
      delete document.documentElement.dataset.resumePrint;
      document.querySelectorAll<HTMLElement>(".resume-panel").forEach((panel) => {
        if (panel.dataset.collapsed === "true") panel.setAttribute("inert", "");
      });
    }

    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  function toggleField(id: string) {
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const primaryIds = new Set(["email", "phone", "location"]);
  const primaryFields = resume.contact.filter((field) => primaryIds.has(field.id));
  const publicFields = resume.contact.filter((field) => !primaryIds.has(field.id));

  return (
    <article className="resume-sheet mx-auto w-full max-w-[46rem] border border-[var(--resume-rule)] px-6 py-9 sm:px-10 sm:py-11 md:px-14 md:py-12">
      <header>
        <h1 className="font-serif text-[2.35em] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[2.7em]">
          {resume.name}
        </h1>
        <p className="mt-3 text-[1.05em] leading-snug">{resume.headline}</p>
        <p className="text-[1.05em] leading-snug text-[var(--resume-muted)]">{resume.tagline}</p>
        <p className="mt-4 max-w-[38rem] text-[0.98em] leading-[1.5]">{resume.summary}</p>
        <address className="mt-6 not-italic">
          <div className="grid gap-y-4 sm:grid-cols-2 sm:gap-x-12">
            <ul className="flex flex-col gap-1.5">
              {primaryFields.map((field) => (
                <ContactField
                  key={field.id}
                  field={field}
                  shown={revealed.has(field.id)}
                  onToggle={() => toggleField(field.id)}
                />
              ))}
            </ul>
            <ul className="flex flex-col gap-1.5">
              {publicFields.map((field) => (
                <ContactField key={field.id} field={field} shown onToggle={() => undefined} />
              ))}
            </ul>
          </div>
          <p className="resume-print-omitted mt-3 text-[0.92em]">Phone and location omitted.</p>
        </address>
      </header>

      <div className="mt-7 border-t border-[var(--resume-rule)]">
        <ResumeSection id="education" title="Education">
          <EntryList entries={resume.education} />
        </ResumeSection>
        <ResumeSection id="internships" title="Internships">
          <EntryList entries={resume.internships} />
        </ResumeSection>
        <ResumeSection id="experience" title="Experience">
          <EntryList entries={resume.experience} />
        </ResumeSection>
        <ResumeSection id="projects" title="Selected projects">
          <EntryList entries={resume.projects} />
        </ResumeSection>
        <ResumeSection id="skills" title="Technical skills">
          <ul className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline">
            {resume.skills.map((skill) => (
              <li
                key={skill}
                className="sm:after:mx-[0.7rem] sm:after:text-[var(--resume-muted)] sm:after:content-['·'] sm:last:after:content-none"
              >
                {skill}
              </li>
            ))}
          </ul>
        </ResumeSection>
        {resume.achievements.length > 0 || resume.publications.length > 0 ? (
          <ResumeSection id="recognition" title="Achievements and publications">
            <EntryGroup label="Achievements" entries={resume.achievements} />
            <EntryGroup label="Publications" entries={resume.publications} />
          </ResumeSection>
        ) : null}
        {resume.certifications.length > 0 ? (
          <ResumeSection id="certifications" title="Certifications">
            <EntryList entries={resume.certifications} />
          </ResumeSection>
        ) : null}
      </div>
    </article>
  );
}

function ResumeSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const panelId = `${id}-panel`;

  return (
    <section className="py-3.5 first:pt-5" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="resume-heading">
        <button
          type="button"
          className="flex w-full items-center gap-3 py-1 text-left"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="font-serif text-[1.2em] font-medium leading-none tracking-[-0.01em]">{title}</span>
          <span className="min-w-6 flex-1 self-center border-b border-[var(--resume-rule)]" aria-hidden="true" />
          <Mark open={open} />
        </button>
      </h2>
      <Panel id={panelId} open={open}>
        <div className="pt-3">{children}</div>
      </Panel>
    </section>
  );
}

function EntryGroup({ label, entries }: { label: string; entries: ResumeEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="mt-4 first:mt-0">
      <h3 className="font-serif text-[1em] italic leading-snug text-[var(--resume-muted)]">{label}</h3>
      <div className="mt-2">
        <EntryList entries={entries} titleLevel={4} />
      </div>
    </div>
  );
}

function EntryList({ entries, titleLevel = 3 }: { entries: ResumeEntry[]; titleLevel?: 3 | 4 }) {
  return (
    <div>
      {entries.map((entry) => (
        <ResumeEntry key={entry.id} entry={entry} titleLevel={titleLevel} />
      ))}
    </div>
  );
}

function ResumeEntry({ entry, titleLevel }: { entry: ResumeEntry; titleLevel: 3 | 4 }) {
  const points = entry.points ?? [];
  const tools = entry.tools ?? [];
  const links = entry.links ?? [];
  const hasMore = points.length > 0 || tools.length > 0 || links.length > 0;
  const [open, setOpen] = useState(false);
  const panelId = `${entry.id}-details`;
  const Title = titleLevel === 4 ? "h4" : "h3";

  return (
    <article className="resume-entry py-3 first:pt-0">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <Title className="font-serif text-[1.08em] font-medium leading-snug tracking-[-0.01em]">
          {entry.title}
          {entry.placeholder ? (
            <span className="ml-2 align-middle font-sans text-[0.68em] font-normal uppercase tracking-[0.14em] text-[var(--resume-muted)]">
              Placeholder
            </span>
          ) : null}
        </Title>
        {entry.aside ? (
          <p className="shrink-0 text-[0.92em] tabular-nums text-[var(--resume-muted)] sm:text-right">{entry.aside}</p>
        ) : null}
      </div>
      {entry.meta ? <p className="mt-0.5 text-[0.92em] text-[var(--resume-muted)]">{entry.meta}</p> : null}
      <div className="mt-1.5 flex items-start gap-3">
        <p className="min-w-0 flex-1 text-[0.98em] leading-[1.45]">{entry.summary}</p>
        {hasMore ? (
          <button
            type="button"
            className="no-print -mt-0.5 inline-flex size-6 shrink-0 items-center justify-center text-[var(--resume-accent)] hover:text-[var(--resume-ink)]"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? `Hide details for ${entry.title}` : `Show details for ${entry.title}`}
            onClick={() => setOpen((value) => !value)}
          >
            <Mark open={open} decorative />
          </button>
        ) : null}
      </div>
      {hasMore ? (
        <Panel id={panelId} open={open}>
          <div className="pt-2">
            {points.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {points.map((point) => (
                  <li key={point} className="relative pl-3.5 text-[0.96em] leading-[1.45]">
                    <span className="absolute left-0 text-[var(--resume-accent)]" aria-hidden="true">
                      –
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
            {tools.length > 0 ? (
              <p className="mt-2 text-[0.96em] leading-[1.45]">
                <span className="text-[var(--resume-muted)]">Tools. </span>
                {tools.join(", ")}
              </p>
            ) : null}
            {links.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-1">
                {links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <ResumeAnchor link={link} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Panel>
      ) : null}
    </article>
  );
}

function Panel({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  return (
    <div
      id={id}
      className={`resume-panel grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
      data-collapsed={open ? "false" : "true"}
      inert={!open}
    >
      <div className="resume-panel-inner min-h-0 overflow-hidden">
        <div className="px-0.5">{children}</div>
      </div>
    </div>
  );
}

function ContactField({
  field,
  shown,
  onToggle,
}: {
  field: ResumeContact;
  shown: boolean;
  onToggle: () => void;
}) {
  const [shaking, setShaking] = useState(false);
  const [refusal, setRefusal] = useState("");
  const secret = field.sensitive && !shown;
  const locked = Boolean(field.locked);

  function onEye(event: MouseEvent<HTMLButtonElement>) {
    if (!locked) {
      onToggle();
      return;
    }
    const row = event.currentTarget.closest("li");
    if (row) {
      row.classList.remove("resume-shake");
      void row.offsetWidth;
      row.classList.add("resume-shake");
    }
    setRefusal(`${field.label} cannot be shown`);
    setShaking(true);
  }

  return (
    <li className={`flex items-baseline gap-1.5 ${shaking ? "resume-shake" : ""}`}>
      <span className="w-[5.5rem] shrink-0 text-[0.92em] text-[var(--resume-muted)]">{field.label}</span>
      <span className="min-w-0">
        {secret ? <span className="sr-only no-print">{field.label} hidden</span> : null}
        <span className={field.sensitive ? "resume-sensitive-value" : undefined} aria-hidden={secret ? true : undefined}>
          <span className={secret ? "resume-secret" : undefined}>
            {field.href ? (
              <a
                href={field.href}
                tabIndex={secret ? -1 : undefined}
                className="underline decoration-[var(--resume-accent)] decoration-1 underline-offset-[3px] hover:decoration-[var(--resume-ink)]"
                {...(field.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {field.value}
              </a>
            ) : (
              field.value
            )}
          </span>
        </span>
        {field.sensitive ? <span className="resume-sensitive-rule" aria-hidden="true" /> : null}
      </span>
      {field.sensitive ? (
        <button
          type="button"
          className="no-print inline-flex size-6 shrink-0 items-center justify-center self-center text-[var(--resume-muted)] hover:text-[var(--resume-ink)]"
          aria-pressed={locked ? undefined : shown}
          aria-label={shown && !locked ? `Hide ${field.label}` : `Show ${field.label}`}
          onClick={onEye}
        >
          <EyeIcon visible={shown && !locked} />
        </button>
      ) : null}
      {locked ? (
        <span className="sr-only no-print" aria-live="polite">
          {refusal}
        </span>
      ) : null}
    </li>
  );
}

function ResumeAnchor({ link }: { link: ResumeLink }) {
  const external = link.href.startsWith("http");
  return (
    <a
      href={link.href}
      className="text-[0.96em] underline decoration-[var(--resume-accent)] decoration-1 underline-offset-[3px] hover:decoration-[var(--resume-ink)]"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
      {link.hint ? <span className="text-[var(--resume-muted)]"> · {link.hint}</span> : null}
    </a>
  );
}

function Mark({ open, decorative = false }: { open: boolean; decorative?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-6 shrink-0 items-center justify-center font-serif text-[1.15rem] leading-none text-[var(--resume-accent)] ${
        decorative ? "" : "resume-mark no-print"
      }`}
    >
      {open ? "−" : "+"}
    </span>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {visible ? (
        <>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="2.25" />
        </>
      ) : (
        <>
          <path d="M3.5 3.5 20.5 20.5" />
          <path d="M10.4 6.2A11 11 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.2 3.8" />
          <path d="M6.1 6.8C3.6 8.6 2 12 2 12s3.5 6 10 6c1.3 0 2.5-.3 3.5-.8" />
          <path d="M9.9 10a2.25 2.25 0 0 0 3.2 3.3" />
        </>
      )}
    </svg>
  );
}
