import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { PageIntro } from "@/components/page-intro";
import { TextLink } from "@/components/text-link";
import { aboutCopy } from "@/content/site";
import { padCount } from "@/lib/archive";

export const metadata: Metadata = {
  title: "About",
  description: aboutCopy.paragraphs[0],
};

export default function AboutPage() {
  return (
    <>
      <PageIntro label="About" title={aboutCopy.title}>
        <div className="space-y-5">
          {aboutCopy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </PageIntro>
      <Frame className="pb-20">
        <div className="grid gap-4 border-t border-rule py-10 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12">
          <h2 className="font-mono text-[0.72rem] font-normal uppercase tracking-[0.14em] text-ink-soft">
            {aboutCopy.interestsLabel}
          </h2>
          <ol className="flex max-w-[32rem] flex-col gap-4">
            {aboutCopy.interests.map((interest, index) => (
              <li key={interest} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
                <span className="font-mono text-sm text-ink-soft">{padCount(index + 1)}</span>
                <span>{interest}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-4 border-t border-rule py-10 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12">
          <h2 className="font-mono text-[0.72rem] font-normal uppercase tracking-[0.14em] text-ink-soft">Elsewhere</h2>
          <div className="flex flex-col items-start gap-3">
            <TextLink href="/now">What I’m exploring now</TextLink>
            <TextLink href="/work">The work</TextLink>
            <TextLink href="/notes">Notes</TextLink>
          </div>
        </div>
      </Frame>
    </>
  );
}
