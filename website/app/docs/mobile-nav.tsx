"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { DocSection } from "../../lib/docs-registry";
import { DocsNav } from "./docs-nav";

const QUICK_LINKS = [
  { href: "/quickstart", label: "Quickstart" },
  { href: "/fairness", label: "Fairness Spec" },
  { href: "/api-reference", label: "API" },
];

/**
 * Below the 840px breakpoint the header's link row and the docs <aside>
 * both disappear (see docs/layout.tsx) — this is the only way to reach
 * another doc page on mobile, so it has to cover both header links and
 * the full section tree, not just one or the other.
 */
export function MobileNav({ sections }: { sections: DocSection[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open documentation menu"
        aria-expanded={open}
        className="hidden items-center justify-center rounded-lg border border-line-strong bg-surface2 p-2 text-ink transition-colors hover:border-signal hover:text-signal max-[840px]:flex"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] hidden max-[840px]:block">
          <button
            type="button"
            aria-label="Close documentation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 left-0 flex w-[85vw] max-w-80 flex-col border-r border-line bg-bg2 shadow-2xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <span className="text-[13px] font-bold uppercase tracking-wider text-muted">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close documentation menu"
                className="rounded-lg border border-line-strong bg-surface2 p-1.5 text-ink transition-colors hover:border-signal hover:text-signal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8">
              <ul className="m-0 mb-6 list-none space-y-0.5 border-b border-line p-0 pb-6">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-surface2 hover:text-signal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://github.com/theblockcade/stellarcade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg px-3 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-surface2 hover:text-signal"
                  >
                    GitHub ↗
                  </a>
                </li>
              </ul>

              <DocsNav sections={sections} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNav;
