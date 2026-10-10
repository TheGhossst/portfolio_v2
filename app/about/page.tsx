import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { PageIntro } from "@/components/page-intro";
import { TextLink } from "@/components/text-link";
import profile from "@/content/profile.json";
import { padCount } from "@/lib/archive";

export const metadata: Metadata = {
  title: "About",
  description: profile.summary[0],
};

export default function AboutPage() {
  const education = profile.education.filter(hasEducation);
  const experience = profile.experience.filter(hasExperience);
  const focus = profile.focus.filter(filled);

  return (
    <>
      <PageIntro label="About" title={profile.name}>
        <p className="font-serif text-[1.35rem] italic leading-snug">{profile.role}</p>
        {filled(profile.location) || filled(profile.currently) ? (
          <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
            {[profile.location, profile.currently].filter(filled).join(" · ")}
          </p>
        ) : null}
        <div className="mt-6 space-y-5">
          {profile.summary.filter(filled).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </PageIntro>
      <Frame className="pb-20">
        {education.length > 0 ? (
          <Section label="Education">
            {education.map((item) => {
              const title = firstFilled(item.credential, item.field, item.school);
              return (
                <Record
                  key={`${item.credential}-${item.school}-${item.period}`}
                  title={title}
                  aside={joinFilled(
                    item.school !== title ? item.school : "",
                    item.credential !== title ? item.credential : "",
                    item.field !== title ? item.field : "",
                    item.period,
                  )}
                  detail={item.detail}
                />
              );
            })}
          </Section>
        ) : null}
        {experience.length > 0 ? (
          <Section label="Experience">
            {experience.map((item) => {
              const title = firstFilled(item.role, item.organization);
              return (
                <Record
                  key={`${item.role}-${item.organization}-${item.period}`}
                  title={title || "Experience"}
                  aside={joinFilled(item.organization !== title ? item.organization : "", item.period)}
                  detail={item.summary}
                  points={item.points.filter(filled)}
                />
              );
            })}
          </Section>
        ) : null}
        {focus.length > 0 ? (
          <Section label={profile.focusLabel}>
            <ol className="flex max-w-[32rem] flex-col gap-4">
              {focus.map((item, index) => (
                <li key={item} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
                  <span className="font-mono text-sm text-ink-soft">{padCount(index + 1)}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </Section>
        ) : null}
        <Section label="Elsewhere">
          <div className="flex flex-col items-start gap-3">
            <TextLink href="/now">What I’m exploring now</TextLink>
            <TextLink href="/work">The work</TextLink>
            <TextLink href="/notes">Notes</TextLink>
          </div>
        </Section>
      </Frame>
    </>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-rule py-10 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12 md:py-12">
      <h2 className="font-mono text-[0.72rem] font-normal uppercase leading-[1.45] tracking-[0.14em] text-ink-soft">
        {label}
      </h2>
      <div className="min-w-0 max-w-[40rem]">{children}</div>
    </section>
  );
}

function Record({
  title,
  aside,
  detail,
  points = [],
}: {
  title: string;
  aside?: string;
  detail?: string;
  points?: string[];
}) {
  return (
    <article className="border-b border-rule py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
        <h3 className="font-serif text-[1.45rem] font-medium leading-snug tracking-[-0.02em]">{title}</h3>
        {aside ? (
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">{aside}</p>
        ) : null}
      </div>
      {filled(detail) ? <p className="mt-3 max-w-[38rem] text-pretty">{detail}</p> : null}
      {points.length > 0 ? (
        <ul className="mt-4 flex max-w-[38rem] flex-col gap-2.5">
          {points.map((point) => (
            <li key={point} className="border-l border-sage pl-4">
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function hasEducation(item: (typeof profile.education)[number]) {
  return filled(item.credential) || filled(item.school) || filled(item.field) || filled(item.detail);
}

function hasExperience(item: (typeof profile.experience)[number]) {
  return filled(item.role) || filled(item.organization) || filled(item.summary) || item.points.some(filled);
}

function filled(value: string | undefined) {
  return Boolean(value && value.trim());
}

function firstFilled(...values: string[]) {
  return values.find(filled) ?? "";
}

function joinFilled(...values: string[]) {
  return values.filter(filled).join(" · ");
}
