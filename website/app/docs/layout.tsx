import Link from "next/link";
import type { ReactNode } from "react";
import { DOCS_SECTIONS } from "../../lib/docs-registry";
import { DocsNav } from "./docs-nav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="docs-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" className="docs-brand">
            stellarcade<span className="g">-sdk</span>
          </Link>
          <span className="docs-badge">Docs</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/docs/quickstart" className="docs-nav-link" style={{ fontSize: "13px" }}>
            Quickstart
          </Link>
          <Link href="/docs/fairness" className="docs-nav-link" style={{ fontSize: "13px" }}>
            Fairness Spec
          </Link>
          <Link href="/docs/api-reference" className="docs-nav-link" style={{ fontSize: "13px" }}>
            API
          </Link>
          <a
            href="https://github.com/theblockcade/stellarcade"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
            style={{ padding: "6px 14px", fontSize: "12px" }}
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <div className="docs-body">
        <aside className="docs-sidebar">
          <DocsNav sections={DOCS_SECTIONS} />
        </aside>
        <main className="docs-content">{children}</main>
      </div>
    </div>
  );
}
