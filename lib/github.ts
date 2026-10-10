import { connection } from "next/server";

export type PublicRepo = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  updatedLabel: string;
  stars: number;
};

export type PublicRepoList = {
  login: string;
  profileUrl: string;
  repos: PublicRepo[];
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatUpdated(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

type GitHubRepoResponse = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  private: boolean;
  pushed_at: string;
  owner?: { login?: string; html_url?: string };
};

export async function getPublicRepos(): Promise<PublicRepoList | { error: string }> {
  await connection();
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { error: "A GitHub token is not configured on the server." };

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "personal-archive",
  };

  try {
    const collected: GitHubRepoResponse[] = [];
    let nextUrl: string | null =
      "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner&visibility=public";

    for (let page = 0; page < 3 && nextUrl; page += 1) {
      const response = await fetch(nextUrl, { headers, cache: "no-store" });
      if (!response.ok) {
        return { error: "GitHub did not return the repository list." };
      }
      const body: unknown = await response.json();
      if (!Array.isArray(body)) return { error: "GitHub did not return the repository list." };
      collected.push(...(body as GitHubRepoResponse[]));
      nextUrl = nextLink(response.headers.get("link"));
    }

    const visible = collected.filter((repo) => !repo.private && !repo.fork);
    const login = visible[0]?.owner?.login ?? collected[0]?.owner?.login ?? "";
    const profileUrl = visible[0]?.owner?.html_url ?? (login ? `https://github.com/${login}` : "https://github.com");

    return {
      login,
      profileUrl,
      repos: visible.map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        updatedLabel: formatUpdated(repo.pushed_at),
        stars: repo.stargazers_count,
      })),
    };
  } catch {
    return { error: "The repository list could not be read." };
  }
}

function nextLink(header: string | null) {
  if (!header) return null;
  const match = header.split(",").find((part) => part.includes('rel="next"'));
  const url = match?.match(/<([^>]+)>/)?.[1];
  return url ?? null;
}
