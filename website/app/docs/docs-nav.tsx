"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocEntry } from "../../lib/docs-registry.js";

export function DocsNav({ entries }: { entries: DocEntry[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation">
      {entries.map((entry) => {
        const href = `/docs/${entry.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={entry.slug}
            href={href}
            className={`docs-nav-link${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {entry.title}
          </Link>
        );
      })}
    </nav>
  );
}
