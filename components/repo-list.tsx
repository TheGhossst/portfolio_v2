"use client";

import { useId, useState } from "react";
import { TextLink } from "@/components/text-link";
import type { PublicRepo } from "@/lib/github";

const previewCount = 5;

export function RepoList({ repos }: { repos: PublicRepo[] }) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const shown = expanded ? repos : repos.slice(0, previewCount);
  const canToggle = repos.length > previewCount;

  return (
    <>
      <ul id={listId} className="mt-6 border-t border-rule">
        {shown.map((repo) => (
          <li key={repo.id} className="border-b border-rule py-4">
            <TextLink href={repo.url} className="font-serif text-[1.35rem] leading-snug">
              {repo.name}
            </TextLink>
            {repo.description ? <p className="mt-2 max-w-[38rem] text-pretty">{repo.description}</p> : null}
            <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
              {repo.language ?? "No language listed"}
              {" · "}
              Updated {repo.updatedLabel}
              {repo.stars > 0 ? ` · ${repo.stars} ${repo.stars === 1 ? "star" : "stars"}` : ""}
            </p>
          </li>
        ))}
      </ul>
      {canToggle ? (
        <button
          type="button"
          className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft underline decoration-sage underline-offset-[3px] hover:text-ink"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </>
  );
}
