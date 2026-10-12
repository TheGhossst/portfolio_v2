import type { ReactNode } from "react";
import { Frame } from "@/components/frame";

export function PageIntro({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <header>
      <Frame>
        <div className="grid gap-5 py-16 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-12 md:py-24">
          <p className="font-mono text-[0.72rem] uppercase leading-[1.45] tracking-[0.14em] text-ink-soft">{label}</p>
          <div className="min-w-0">
            <h1 className="w-fit cursor-pull font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.02em] md:text-[2.75rem]">
              {title}
            </h1>
            {children ? <div className="mt-6 max-w-[38rem] leading-[1.7]">{children}</div> : null}
          </div>
        </div>
      </Frame>
    </header>
  );
}
