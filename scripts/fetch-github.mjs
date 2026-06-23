import fs from "node:fs/promises";
import https from "node:https";
import path from "node:path";

const USER = process.env.GITHUB_USER || "vaibhavrai-smartjoules";
const TOKEN = process.env.GITHUB_TOKEN;
const OUT = path.resolve("src/data/github.json");

const post = (body, headers) =>
  new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.github.com",
        path: "/graphql",
        method: "POST",
        headers: { ...headers, "Content-Length": Buffer.byteLength(body) },
      },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => resolve({ ok: res.statusCode === 200, status: res.statusCode, body: raw }));
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      login
      name
      bio
      avatarUrl
      followers { totalCount }
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage { name color }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount color }
          }
        }
      }
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        nodes { stargazerCount }
      }
    }
  }
`;

const main = async () => {
  if (!TOKEN) {
    console.warn("[fetch-github] GITHUB_TOKEN not set — keeping existing JSON.");
    return;
  }

  const res = await post(JSON.stringify({ query: QUERY, variables: { login: USER } }), {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "portfolio-fetch",
  });

  if (!res.ok) {
    console.warn(`[fetch-github] HTTP ${res.status} — keeping existing JSON.`);
    return;
  }

  const { data, errors } = JSON.parse(res.body);
  if (errors || !data?.user) {
    console.warn("[fetch-github] GraphQL error — keeping existing JSON.", errors);
    return;
  }

  const u = data.user;
  const totalStars = u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);

  const normalized = {
    user: {
      login: u.login,
      name: u.name,
      bio: u.bio,
      avatar: u.avatarUrl,
      followers: u.followers.totalCount,
      totalStars,
    },
    pinned: u.pinnedItems.nodes.map((n) => ({
      name: n.name,
      description: n.description,
      url: n.url,
      stars: n.stargazerCount,
      forks: n.forkCount,
      language: n.primaryLanguage?.name ?? null,
      languageColor: n.primaryLanguage?.color ?? null,
    })),
    contributions: {
      total: u.contributionsCollection.contributionCalendar.totalContributions,
      weeks: u.contributionsCollection.contributionCalendar.weeks.map((w) => ({
        days: w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          color: d.color,
        })),
      })),
    },
  };

  await fs.writeFile(OUT, JSON.stringify(normalized, null, 2) + "\n");
  console.log(`[fetch-github] wrote ${OUT}`);
};

main().catch((err) => {
  console.warn("[fetch-github] unexpected error — keeping existing JSON.", err);
});
