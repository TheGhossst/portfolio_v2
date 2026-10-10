import type { ProjectStatus } from "@/content/projects";
import { statusLabels } from "@/lib/archive";

export function StatusMark({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
      <Mark status={status} />
      {statusLabels[status]}
    </span>
  );
}

function Mark({ status }: { status: ProjectStatus }) {
  if (status === "in-progress") {
    return <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />;
  }

  if (status === "paused") {
    return <span className="size-1.5 rounded-full border border-sage" aria-hidden="true" />;
  }

  if (status === "completed") {
    return <span className="size-1.5 bg-sage" aria-hidden="true" />;
  }

  return <span className="h-px w-2 bg-stone" aria-hidden="true" />;
}
