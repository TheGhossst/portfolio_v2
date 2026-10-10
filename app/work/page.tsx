import { Suspense } from "react";
import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { PageIntro } from "@/components/page-intro";
import { WorkArchive } from "@/components/work-archive";
import { workCopy } from "@/content/site";

export const metadata: Metadata = {
  title: workCopy.title,
  description: workCopy.lede,
};

export default function WorkPage({ searchParams }: PageProps<"/work">) {
  return (
    <>
      <PageIntro label={workCopy.label} title={workCopy.title}>
        <p>{workCopy.lede}</p>
      </PageIntro>
      <Suspense fallback={<ArchiveFallback />}>
        <WorkArchive searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function ArchiveFallback() {
  return (
    <Frame className="pb-20">
      <p className="border-t border-rule pt-10 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
        Opening the archive…
      </p>
    </Frame>
  );
}
