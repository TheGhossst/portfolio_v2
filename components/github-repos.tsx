import { TextLink } from "@/components/text-link";
import { getPublicRepos } from "@/lib/github";

export async function GitHubRepos() {
  const result = await getPublicRepos();

  if ("error" in result) {
    return <p>{result.error}</p>;
  }

  if (result.repos.length === 0) {
    return <p>No public repositories were returned.</p>;
  }

  return (
    <div>
      <p>
        Public repositories
        {result.login ? (
          <>
            {" "}
            on <TextLink href={result.profileUrl}>{result.login}</TextLink>
          </>
        ) : null}
        , with the most recently updated first.
      </p>
      <ul className="mt-6 border-t border-rule">
        {result.repos.map((repo) => (
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
    </div>
  );
}
