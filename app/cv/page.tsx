import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { PageIntro } from "@/components/page-intro";
import { TextLink } from "@/components/text-link";
import { cvCopy } from "@/content/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: cvCopy.lede,
};

export default function CvPage() {
  return (
    <>
      <PageIntro label={cvCopy.label} title={cvCopy.title}>
        <p>{cvCopy.lede}</p>
      </PageIntro>
      <Frame className="pb-20">
        <div className="grid gap-4 border-t border-rule py-10 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Meanwhile</p>
          <TextLink href="/contact">Contact</TextLink>
        </div>
      </Frame>
    </>
  );
}
