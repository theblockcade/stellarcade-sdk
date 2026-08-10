export interface DocEntry {
  slug: string;
  title: string;
  order: number;
}

/**
 * Static ordered registry of docs pages. Kept separate from the filesystem
 * read (see `docs.ts`) so sidebar order is an explicit, reviewable decision
 * rather than alphabetical-by-accident.
 */
export const DOCS_REGISTRY: DocEntry[] = [
  { slug: "introduction", title: "Introduction", order: 0 },
  { slug: "installation", title: "Installation", order: 1 },
  { slug: "quickstart", title: "Quickstart", order: 2 },
  { slug: "how-it-works", title: "How It Works", order: 3 },
  { slug: "games", title: "Games", order: 4 },
  { slug: "fairness", title: "Fairness Verification", order: 5 },
  { slug: "prizes", title: "Prize Pools", order: 6 },
  { slug: "quests", title: "Quests & Leaderboards", order: 7 },
  { slug: "tournaments", title: "Tournaments", order: 8 },
  { slug: "wallet-connectors", title: "Wallet Connectors", order: 9 },
  { slug: "api-reference", title: "API Reference", order: 10 },
  { slug: "security", title: "Security", order: 11 },
  { slug: "advanced", title: "Advanced", order: 12 },
];

export function getAdjacent(slug: string): { prev: DocEntry | null; next: DocEntry | null } {
  const sorted = [...DOCS_REGISTRY].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? sorted[index - 1]! : null,
    next: index < sorted.length - 1 ? sorted[index + 1]! : null,
  };
}
