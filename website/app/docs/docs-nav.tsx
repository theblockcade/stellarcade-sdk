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
    <nav aria-label="Documentation" className="docs-nav-root">
      {/* Real-time search filter */}
      <div className="docs-search-wrapper">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search docs..."
          className="docs-search-input"
          aria-label="Filter documentation chapters"
        />
      </div>

      <div className="docs-nav-sections">
        {filteredSections.map((section) => (
          <div key={section.title} className="docs-nav-group">
            <div className="docs-nav-group-title">{section.title}</div>
            <ul className="docs-nav-list">
              {section.items.map((item) => {
                const href = `/docs/${item.slug}`;
                const active = pathname === href;

                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      prefetch={true}
                      className={`docs-nav-link${active ? " active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="docs-nav-link-text">{item.title}</span>
                      {item.tag && (
                        <span className="docs-nav-tag">{item.tag}</span>
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
