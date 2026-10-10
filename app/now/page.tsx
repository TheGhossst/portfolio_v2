import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { PageIntro } from "@/components/page-intro";
import { TextLink } from "@/components/text-link";
import { nowCopy } from "@/content/site";

export const metadata: Metadata = {
  title: nowCopy.title,
  description: nowCopy.lede,
};

export default function NowPage() {
  return (
    <>
      <PageIntro label="Now" title={nowCopy.title}>
        <p>{nowCopy.lede}</p>
        <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
          Updated {nowCopy.updated}
        </p>
      </PageIntro>
      <Frame className="pb-20">
        <ol className="border-t border-rule">
          {nowCopy.items.map((item) => (
            <li
              key={item.label}
              className="grid gap-3 border-b border-rule py-8 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12"
            >
              <h2 className="font-mono text-[0.72rem] font-normal uppercase tracking-[0.14em] text-ink-soft">
                {item.label}
              </h2>
              <div className="max-w-[38rem]">
                <p>{item.text}</p>
                <TextLink href={item.href} className="mt-4 inline-block">
                  Open the record
                </TextLink>
              </div>
            </li>
          ))}
        </ol>
      </Frame>
    </>
  );
}
