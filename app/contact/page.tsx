import type { Metadata } from "next";
import { ContactBlock } from "@/components/contact-block";
import { Frame } from "@/components/frame";
import { PageIntro } from "@/components/page-intro";
import { homeCopy } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: homeCopy.contactHeadline,
};

export default function ContactPage() {
  return (
    <>
      <PageIntro label="Contact" title={homeCopy.contactHeadline}>
        <p>The addresses below are placeholders until real ones are added in the site file.</p>
      </PageIntro>
      <Frame className="pb-20">
        <div className="grid gap-4 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Reach</p>
          <ContactBlock showHeading={false} />
        </div>
      </Frame>
    </>
  );
}
