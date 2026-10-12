import Link from "next/link";
import { ActivityList } from "@/components/activity-list";
import { ContactBlock } from "@/components/contact-block";
import { FeaturedWork } from "@/components/featured-work";
import { Frame, Meta } from "@/components/frame";
import { TextLink } from "@/components/text-link";
import { activity } from "@/content/activity";
import { projects } from "@/content/projects";
import profile from "@/content/profile.json";
import { homeCopy, site } from "@/content/site";
import { featuredProjects, padCount } from "@/lib/archive";

export default function Home() {
  const featured = featuredProjects();
  const focus = profile.focus.filter((item) => item.trim());

  return (
    <>
      <section id="intro">
        <Frame>
          <div className="grid gap-12 pb-12 pt-12 md:pb-16 md:pt-16 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start lg:gap-16 lg:pt-20">
            <div>
              <p className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase leading-[1.45] tracking-[0.14em] text-ink-soft">
                <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
                {profile.role}
              </p>
              <h1
                className="mt-5 w-fit cursor-pull font-serif text-[3.4rem] font-medium leading-[0.92] tracking-[-0.035em] sm:text-[4.6rem] lg:text-[5.4rem]"
                data-pull="14"
              >
                {profile.name}
              </h1>
              <p
                className="mt-6 w-fit max-w-[16ch] cursor-pull font-serif text-[1.7rem] font-medium leading-[1.12] tracking-[-0.02em] text-pretty sm:text-[2.05rem]"
                data-pull="8"
              >
                {homeCopy.headlineLead} {homeCopy.headlineRest}
              </p>
              <p
                className="mt-4 w-fit max-w-[26rem] cursor-pull font-serif text-[1.25rem] italic leading-snug text-pretty text-ink-soft"
                data-pull="4"
              >
                {homeCopy.supporting}
              </p>
              <p className="mt-6 max-w-[36rem] text-pretty">{homeCopy.introduction}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/work"
                  className="group inline-flex items-center gap-3 bg-ink px-4 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-paper"
                >
                  {homeCopy.workLink}
                  <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center border border-ink px-4 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-150 hover:border-sage hover:text-sage"
                >
                  Contact
                </Link>
                <TextLink href="/cv" className="px-2 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
                  Résumé
                </TextLink>
              </div>
            </div>

            <aside id="focus" className="cursor-field border border-rule">
              <div className="border-b border-rule px-5 py-5">
                <Meta>Now</Meta>
                <p className="mt-3 font-serif text-[1.45rem] font-medium leading-snug tracking-[-0.02em]">
                  {profile.currently}
                </p>
                <TextLink href={site.statusHref} className="mt-4 inline-block">
                  {site.statusLabel}
                </TextLink>
              </div>
              <div className="px-5 py-5">
                <Meta>{profile.focusLabel}</Meta>
                <ol className="mt-4">
                  {focus.map((item, index) => (
                    <li
                      key={item}
                      className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-2 border-t border-rule py-2.5 first:border-t-0 first:pt-0"
                    >
                      <span className="font-mono text-sm text-sage">{padCount(index + 1)}</span>
                      <span className="text-[0.98rem] leading-snug">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>

          <dl className="border-t border-rule sm:grid sm:grid-cols-3">
            <div className="cursor-field flex items-baseline justify-between gap-4 border-b border-rule py-4 sm:block sm:border-b-0 sm:border-r sm:py-6 sm:pr-6">
              <dt className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Selected</dt>
              <dd className="font-serif text-[1.85rem] leading-none tracking-[-0.03em] sm:mt-2 md:text-[2.15rem]">
                {padCount(featured.length)}
              </dd>
            </div>
            <div className="cursor-field flex items-baseline justify-between gap-4 border-b border-rule py-4 sm:block sm:border-b-0 sm:border-r sm:px-6 sm:py-6">
              <dt className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">On file</dt>
              <dd className="font-serif text-[1.85rem] leading-none tracking-[-0.03em] sm:mt-2 md:text-[2.15rem]">
                {padCount(projects.length)}
              </dd>
            </div>
            <div className="cursor-field flex items-baseline justify-between gap-4 py-4 sm:block sm:py-6 sm:pl-6">
              <dt className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Updated</dt>
              <dd className="font-serif text-[1.35rem] leading-none tracking-[-0.02em] sm:mt-2 md:text-[1.7rem]">
                {site.lastUpdated}
              </dd>
            </div>
          </dl>
        </Frame>
      </section>

      <section id="work" className="border-t border-rule">
        <Frame>
          <div className="py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <Meta>Work</Meta>
                <h2 className="mt-3 font-serif text-[2rem] font-medium leading-tight tracking-[-0.02em] md:text-[2.35rem]">
                  Selected work
                </h2>
              </div>
              <TextLink href="/work">{homeCopy.allWorkLink}</TextLink>
            </div>
            <div className="mt-8 md:mt-10">
              <FeaturedWork projects={featured} />
            </div>
          </div>
        </Frame>
      </section>

      <section id="recent" className="border-t border-rule">
        <Frame>
          <div className="grid gap-8 py-14 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-16 md:py-20">
            <div>
              <Meta>Recent</Meta>
              <h2 className="mt-3 font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em]">
                {homeCopy.recentTitle}
              </h2>
              <TextLink href="/about" className="mt-6 inline-block">
                {homeCopy.aboutLink}
              </TextLink>
            </div>
            <ActivityList items={activity} />
          </div>
        </Frame>
      </section>

      <section id="contact" className="border-t border-rule">
        <Frame>
          <div className="grid gap-10 py-14 md:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] md:gap-16 md:py-20">
            <div>
              <Meta>Contact</Meta>
              <h2 className="mt-3 max-w-[14ch] font-serif text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] md:text-[2.5rem]">
                {homeCopy.contactHeadline}
              </h2>
            </div>
            <ContactBlock showHeading={false} />
          </div>
        </Frame>
      </section>
    </>
  );
}
