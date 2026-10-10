import { ActivityList } from "@/components/activity-list";
import { ContactBlock } from "@/components/contact-block";
import { Meta, Spread } from "@/components/frame";
import { ProjectList } from "@/components/project-list";
import { TextLink } from "@/components/text-link";
import { activity } from "@/content/activity";
import { aboutCopy, homeCopy, site } from "@/content/site";
import { featuredProjects, padCount } from "@/lib/archive";

export default function Home() {
  const featured = featuredProjects();

  return (
    <>
      <Spread
        id="intro"
        rule={false}
        label={
          <div>
            <span className="mb-4 block h-px w-8 bg-sage" aria-hidden="true" />
            <Meta>{site.currentlyExploring}</Meta>
          </div>
        }
      >
        <h1 className="font-serif text-[2.05rem] font-medium leading-[1.12] tracking-[-0.02em] text-pretty sm:text-[2.5rem] lg:text-[2.75rem]">
          {homeCopy.headlineLead}
          <br className="hidden md:block" /> {homeCopy.headlineRest}
        </h1>
        <p className="mt-5 max-w-[20rem] font-serif text-[1.3rem] italic leading-snug text-pretty sm:text-[1.45rem]">
          {homeCopy.supporting}
        </p>
        <p className="mt-8 max-w-[38rem] text-pretty">{homeCopy.introduction}</p>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <TextLink href="/work">{homeCopy.workLink}</TextLink>
          <TextLink href="/about">{homeCopy.aboutLink}</TextLink>
        </div>
      </Spread>

      <Spread
        id="work"
        label={
          <div>
            <h2 className="font-mono text-[0.72rem] font-normal uppercase leading-[1.45] tracking-[0.14em] text-ink-soft">
              Selected work
            </h2>
            <p className="mt-2 font-mono text-sm text-ink-soft">{padCount(featured.length)}</p>
          </div>
        }
      >
        <ProjectList projects={featured} />
      </Spread>

      <Spread
        id="note"
        label={<Meta>Note</Meta>}
      >
        <div className="border-l border-sage pl-5 md:pl-6">
          <h2 className="font-mono text-[0.72rem] font-normal uppercase leading-[1.45] tracking-[0.14em] text-ink-soft">
            {homeCopy.noteLabel}
          </h2>
          <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
            <time dateTime="2026-03-12">{homeCopy.noteDate}</time>
          </p>
          <blockquote className="mt-4 max-w-[28rem]">
            <p className="font-serif text-[1.65rem] font-medium italic leading-snug text-pretty md:text-[1.85rem]">
              {homeCopy.note}
            </p>
          </blockquote>
        </div>
      </Spread>

      <Spread id="recent" label={<Meta>Recent</Meta>}>
        <h2 className="font-serif text-[1.75rem] font-medium leading-tight tracking-[-0.02em]">
          {homeCopy.recentTitle}
        </h2>
        <div className="mt-8">
          <ActivityList items={activity} />
        </div>
      </Spread>

      <Spread
        id="about"
        label={
          <h2 className="font-mono text-[0.72rem] font-normal uppercase leading-[1.45] tracking-[0.14em] text-ink-soft">
            About
          </h2>
        }
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <div>
            <p className="max-w-[38rem] text-pretty">{aboutCopy.paragraphs[0]}</p>
            <TextLink href="/about" className="mt-6 inline-block">
              More about this archive
            </TextLink>
          </div>
          <div>
            <Meta>{aboutCopy.interestsLabel}</Meta>
            <ol className="mt-4 flex flex-col gap-3">
              {aboutCopy.interests.map((interest, index) => (
                <li key={interest} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 text-[0.98rem] leading-snug">
                  <span className="font-mono text-sm text-ink-soft">{padCount(index + 1)}</span>
                  <span>{interest}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Spread>

      <Spread id="contact" label={<Meta>Contact</Meta>}>
        <ContactBlock />
      </Spread>
    </>
  );
}
