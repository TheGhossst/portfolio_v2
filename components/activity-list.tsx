import type { Activity } from "@/content/activity";
import { TextLink } from "@/components/text-link";

export function ActivityList({ items }: { items: Activity[] }) {
  return (
    <ol className="border-t border-rule">
      {items.map((item) => (
        <li
          key={item.date + item.text}
          className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-8 sm:py-5"
        >
          <time dateTime={item.date} className="font-mono text-sm text-ink-soft">
            {item.dateLabel}
          </time>
          {item.href ? <TextLink href={item.href}>{item.text}</TextLink> : <p>{item.text}</p>}
        </li>
      ))}
    </ol>
  );
}
