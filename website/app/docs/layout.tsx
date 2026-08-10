import Link from "next/link";
import type { ReactNode } from "react";
import { getSortedRegistry } from "../../lib/docs.js";
import { DocsNav } from "./docs-nav.js";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const entries = getSortedRegistry();

  return (
    <div>
      <header className="docs-topbar">
        <Link href="/" className="docs-brand">
          stellarcade<span className="g">-sdk</span>
        </Link>
      </header>
      <div className="docs-body">
        <aside className="docs-sidebar">
          <DocsNav entries={entries} />
        </aside>
        <main className="docs-content">{children}</main>
      </div>
    </div>
  );
}
