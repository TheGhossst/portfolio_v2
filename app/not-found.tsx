import { Frame } from "@/components/frame";
import { TextLink } from "@/components/text-link";

export default function NotFound() {
  return (
    <Frame className="py-20 md:py-28">
      <div className="grid gap-5 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Missing</p>
        <div>
          <h1 className="font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.02em]">
            This page is not in the archive.
          </h1>
          <TextLink href="/" className="mt-6 inline-block">
            Return home
          </TextLink>
        </div>
      </div>
    </Frame>
  );
}
