export interface DocEntry {
  slug: string;
  title: string;
  order: number;
  tag?: string;
  description?: string;
}

export interface DocSection {
  title: string;
  items: DocEntry[];
}

export const DOCS_SECTIONS: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      { slug: "introduction", title: "Introduction & Overview", order: 0, tag: "Start" },
      { slug: "installation", title: "Installation & Setup", order: 1 },
      { slug: "quickstart", title: "5-Minute Quickstart", order: 2, tag: "Hot" },
      { slug: "how-it-works", title: "Protocol Architecture", order: 3 },
    ],
  },
  {
    title: "Core Protocols & Fairness",
    items: [
      { slug: "fairness", title: "Provable Fairness Spec", order: 4, tag: "Core" },
      { slug: "contracts", title: "Soroban Smart Contracts", order: 5 },
      { slug: "entropy", title: "Entropy Mixing & RNG", order: 6 },
      { slug: "audit-arbiter", title: "Audit Logs & Arbiter", order: 7 },
    ],
  },
  {
    title: "Arcade Games",
    items: [
      { slug: "games", title: "Games Catalog", order: 8 },
      { slug: "coinflip-duel", title: "Coinflip Duel Engine", order: 9 },
      { slug: "custom-games", title: "Building Custom Games", order: 10, tag: "Rust" },
    ],
  },
  {
    title: "Economics & Rewards",
    items: [
      { slug: "prizes", title: "Prize Pools & Vaults", order: 11 },
      { slug: "quests", title: "Quests, XP & Badges", order: 12 },
      { slug: "tournaments", title: "Tournaments & Brackets", order: 13 },
    ],
  },
  {
    title: "SDK & Integration",
    items: [
      { slug: "wallet-connectors", title: "Wallet Connectors", order: 14 },
      { slug: "api-reference", title: "TypeScript API Reference", order: 15, tag: "API" },
      { slug: "bot-sdk", title: "Telegram & Discord Bot", order: 16 },
      { slug: "security", title: "Security & Threat Model", order: 17 },
      { slug: "advanced", title: "Advanced Recipes", order: 18 },
    ],
  },
];

export const DOCS_REGISTRY: DocEntry[] = DOCS_SECTIONS.flatMap((s) => s.items);

export function getAdjacent(slug: string): { prev: DocEntry | null; next: DocEntry | null } {
  const sorted = [...DOCS_REGISTRY].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? sorted[index - 1]! : null,
    next: index < sorted.length - 1 ? sorted[index + 1]! : null,
  };
}
