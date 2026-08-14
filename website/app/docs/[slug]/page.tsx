import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacent } from "../../../lib/docs-registry";
import { getAllDocSlugs, getDocPage } from "../../../lib/docs";
import { Markdown } from "../markdown";

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getDocPage(slug);
  if (!page) notFound();

  const { prev, next } = getAdjacent(slug);

  return (
    <article>
      <Markdown content={page.content} />
      <nav
        className="mt-16 flex justify-between gap-4 border-t border-line pt-6"
        aria-label="Docs pagination"
      >
        {prev ? (
          <Link
            className="flex min-w-45 flex-col rounded-xl border border-line bg-surface px-5 py-3.5 transition-all duration-200 hover:border-signal hover:bg-surface2"
            href={`/docs/${prev.slug}`}
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            className="flex min-w-45 flex-col rounded-xl border border-line bg-surface px-5 py-3.5 text-right transition-all duration-200 hover:border-signal hover:bg-surface2"
            href={`/docs/${next.slug}`}
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
