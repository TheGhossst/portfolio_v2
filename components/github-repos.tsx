import { RepoList } from "@/components/repo-list";
import { TextLink } from "@/components/text-link";
import { getPublicRepos } from "@/lib/github";

const loadingRows = [
  { title: "w-40", body: "w-[min(100%,18rem)]", meta: "w-36" },
  { title: "w-56", body: "w-[min(100%,14rem)]", meta: "w-32" },
  { title: "w-44", body: "w-[min(100%,16rem)]", meta: "w-40" },
];

export function GitHubReposFallback() {
  return (
    <div aria-busy="true">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">Reading GitHub…</p>
      <div className="mt-6 border-t border-rule" aria-hidden="true">
        {loadingRows.map((row, index) => (
          <div key={row.title} className="border-b border-rule py-4">
            <span
              className={`block h-5 max-w-full bg-sage-light motion-safe:animate-pulse ${row.title}`}
              style={{ animationDelay: `${index * 180}ms` }}
            />
            <span
              className={`mt-3 block h-4 max-w-full bg-sage-light motion-safe:animate-pulse ${row.body}`}
              style={{ animationDelay: `${index * 180}ms` }}
            />
            <span
              className={`mt-3 block h-3 max-w-full bg-sage-light motion-safe:animate-pulse ${row.meta}`}
              style={{ animationDelay: `${index * 180}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <RepoList repos={result.repos} />
    </div>
  );
}
