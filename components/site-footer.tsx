import { SearchTrigger } from "@/components/command-palette";
import { Frame } from "@/components/frame";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <Frame className="flex flex-col gap-4 py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-lg">{site.title}</p>
          <p className="mt-1 font-mono text-[0.72rem] text-ink-soft">
            © {site.year} {site.name} · {site.identityNote}
          </p>
        </div>
        <div className="flex flex-col gap-2 font-mono text-[0.72rem] text-ink-soft md:items-end">
          <p>Last updated {site.lastUpdated}</p>
          <SearchTrigger className="w-fit uppercase tracking-[0.12em] underline decoration-sage underline-offset-[3px]">
            Search
          </SearchTrigger>
        </div>
      </Frame>
    </footer>
  );
}
