import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { DOCS_REGISTRY, type DocEntry } from "./docs-registry.js";

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");

export interface DocPage extends DocEntry {
  content: string;
  description?: string;
}

export async function getDocPage(slug: string): Promise<DocPage | null> {
  const entry = DOCS_REGISTRY.find((d) => d.slug === slug);
  if (!entry) return null;

  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const { content, data } = matter(raw);
  return {
    ...entry,
    content,
    description: typeof data.description === "string" ? data.description : undefined,
  };
}

export function getAllDocSlugs(): string[] {
  return DOCS_REGISTRY.map((d) => d.slug);
}

export function getSortedRegistry(): DocEntry[] {
  return [...DOCS_REGISTRY].sort((a, b) => a.order - b.order);
}
