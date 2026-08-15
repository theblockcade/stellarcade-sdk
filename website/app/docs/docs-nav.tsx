"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_SECTIONS, type DocSection } from "../../lib/docs-registry";

export function DocsNav({ sections = DOCS_SECTIONS }: { sections?: DocSection[] }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();

    return sections
      .map((sec) => ({
        ...sec,
        items: sec.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.slug.toLowerCase().includes(query)
        ),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [sections, searchQuery]);

  return (
    <nav aria-label="Documentation">
      {/* Real-time search filter */}
      <div className="mb-5 px-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search docs..."
          className="w-full rounded-lg border border-line-strong bg-surface2 px-3 py-2 text-[13px] text-white outline-none transition-colors duration-150 focus:border-signal"
          aria-label="Filter documentation chapters"
        />
      </div>

      <div>
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="mb-2 px-3 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-muted2">
              {section.title}
            </div>
            <ul className="m-0 list-none p-0">
              {section.items.map((item) => {
                const href = `/${item.slug}`;
                const active = pathname === href;

                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      prefetch={true}
                      className={`mb-0.5 flex items-center justify-between gap-2 rounded-lg px-3 py-1.75 text-[13.5px] font-medium transition-colors duration-150 ${
                        active
                          ? "bg-signal/8 font-semibold text-signal"
                          : "text-muted hover:bg-surface2 hover:text-ink"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.tag && (
                        <span className="rounded-sm bg-signal/12 px-1.5 py-px text-[0.625rem] font-bold uppercase tracking-[0.03em] text-signal">
                          {item.tag}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default DocsNav;
