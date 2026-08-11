import DocPage from "./[slug]/page";

export default async function DocsIndexPage() {
  return <DocPage params={Promise.resolve({ slug: "introduction" })} />;
}
