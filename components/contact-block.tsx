import { contactLinks, homeCopy } from "@/content/site";

export function ContactBlock({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <div>
      {showHeading ? (
        <h2 className="max-w-[16ch] font-serif text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] md:text-[2.25rem]">
          {homeCopy.contactHeadline}
        </h2>
      ) : null}
      <ul className={`${showHeading ? "mt-8" : ""} border-t border-rule`}>
        {contactLinks.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.label} className="border-b border-rule">
              <a
                href={link.href}
                className="flex items-baseline justify-between gap-6 py-3"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="underline decoration-sage decoration-1 underline-offset-[3px]">{link.label}</span>
                <span className="max-w-[60%] text-right font-mono text-[0.78rem] leading-snug text-ink-soft">
                  {link.hint}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
