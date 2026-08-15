import Link from "next/link";
import type { ReactNode } from "react";
import { DOCS_SECTIONS } from "../../lib/docs-registry";
import { DocsNav } from "./docs-nav";
import { MobileNav } from "./mobile-nav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-line bg-bg/85 px-5 backdrop-blur-lg max-[840px]:px-4 min-[841px]:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-extrabold tracking-[-0.01em]"
          >
            stellarcade<span className="text-signal">-sdk</span>
          </Link>
          <span className="rounded-sm bg-surface2 px-1.75 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted max-[520px]:hidden">
            Docs
          </span>
        </div>

        <div className="flex items-center gap-4 max-[840px]:hidden">
          <Link href="/quickstart" className="text-[13px] text-muted transition-colors hover:text-ink">
            Quickstart
          </Link>
          <Link href="/fairness" className="text-[13px] text-muted transition-colors hover:text-ink">
            Fairness Spec
          </Link>
          <Link href="/api-reference" className="text-[13px] text-muted transition-colors hover:text-ink">
            API
          </Link>
          <a
            href="https://github.com/theblockcade/stellarcade"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface2 px-3.5 py-1.5 text-xs font-bold text-ink transition-all duration-200 hover:border-signal hover:bg-surface3 hover:text-signal"
          >
            GitHub ↗
          </a>
        </div>

        <MobileNav sections={DOCS_SECTIONS} />
      </header>

      <div className="mx-auto flex max-w-325 items-start">
        <aside className="sticky top-16 h-[calc(100vh-64px)] w-72.5 shrink-0 overflow-y-auto border-r border-line px-4 pt-6 pb-12 max-[840px]:hidden">
          <DocsNav sections={DOCS_SECTIONS} />
        </aside>
        <main className="min-w-0 flex-1 max-w-205 px-[clamp(20px,6vw,64px)] pt-11 pb-30 max-[840px]:px-5 max-[840px]:pt-6 max-[840px]:pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
