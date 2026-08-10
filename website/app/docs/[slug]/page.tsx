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
      <h1>{page.title}</h1>
      <Markdown content={page.content} />
      <nav className="docs-pager" aria-label="Docs pagination">
        {prev ? (
          <Link className="docs-pager-link" href={`/docs/${prev.slug}`}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="docs-pager-link" href={`/docs/${next.slug}`}>
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
