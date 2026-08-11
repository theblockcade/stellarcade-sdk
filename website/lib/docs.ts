import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DOCS_REGISTRY, type DocEntry } from "./docs-registry";

export interface DocPage extends DocEntry {
  content: string;
  description?: string;
}

function resolveDocFilePath(slug: string): string | null {
  const candidateDirs = [
    path.join(process.cwd(), "content", "docs"),
    path.join(process.cwd(), "website", "content", "docs"),
    path.resolve(__dirname, "..", "content", "docs"),
    path.resolve(__dirname, "..", "..", "content", "docs"),
    path.resolve(__dirname, "..", "..", "website", "content", "docs"),
    path.resolve(__dirname, "..", "..", "..", "website", "content", "docs"),
  ];

  for (const dir of candidateDirs) {
    const targetFile = path.join(dir, `${slug}.md`);
    if (existsSync(targetFile)) {
      return targetFile;
    }
  }
  return null;
}

export async function getDocPage(slug: string): Promise<DocPage | null> {
  const entry = DOCS_REGISTRY.find((d) => d.slug === slug);
  if (!entry) return null;

  const filePath = resolveDocFilePath(slug);
  if (!filePath) {
    console.error(`[Docs] Unable to locate markdown file for slug: "${slug}". Checked cwd: ${process.cwd()}`);
    return null;
  }

  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (err) {
    console.error(`[Docs] Error reading markdown file at ${filePath}:`, err);
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
