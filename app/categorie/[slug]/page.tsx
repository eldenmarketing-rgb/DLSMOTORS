import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import {
  Breadcrumb,
  breadcrumbJsonLd,
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Markdown } from "@/components/ui/Markdown";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  getCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/catalog";
import { getCmsPage } from "@/lib/cms";
import { siteConfig } from "@/lib/config";

/**
 * Page catégorie — LA page catalogue qui ranke. Le texte éditorial au-dessus
 * de la grille vient du CMS (`seo_pages` slug `categorie/<slug>`, rédigé et
 * optimisé depuis le dashboard) avec repli sur la description de la
 * catégorie. Les filtres n'existent pas en URL : canonical unique, zéro
 * duplicate programmatique.
 */

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  if (!siteConfig.catalog.enabled) return [];
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  const cms = await getCmsPage(`categorie/${slug}`);
  return {
    title: cms ? { absolute: cms.metaTitle } : category.name,
    description: cms?.metaDescription || category.description,
    alternates: { canonical: `/categorie/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  if (!siteConfig.catalog.enabled) notFound();
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const [products, categories, cms] = await Promise.all([
    getProductsByCategory(category.id),
    getCategories(),
    getCmsPage(`categorie/${slug}`),
  ]);
  const others = categories.filter((c) => c.id !== category.id);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    { label: cms?.h1 || category.name },
  ];

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/categorie/${slug}#collection`,
    name: cms?.h1 || category.name,
    description: cms?.metaDescription || category.description,
    url: `${siteUrl}/categorie/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${siteUrl}/produit/${p.slug}`,
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs, siteUrl)),
        }}
      />

      <Section tone="surface" spacing="compact">
        <Container size="wide">
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-6 max-w-3xl">
            <Badge tone="accent">{siteConfig.catalog.label}</Badge>
            <h1 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
              {cms?.h1 || category.name}
            </h1>
            {(cms?.intro || category.description) && (
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
                {(cms?.intro || category.description)
                  .split(/\n{2,}/)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="compact">
        <Container size="wide">
          {products.length === 0 ? (
            <p className="text-ink-soft">
              Cette catégorie se remplit — appelez-nous au{" "}
              {siteConfig.phoneFormatted} pour connaître les disponibilités.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* Sections éditoriales rédigées dans le dashboard, sous la grille. */}
      {cms?.seoSections.map((section, i) => (
        <Section
          key={i}
          tone={i % 2 === 0 ? "panel" : "surface"}
          spacing="compact"
        >
          <Container size="default">
            <h2 className="font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)]">
              {section.title}
            </h2>
            <Markdown content={section.content} />
          </Container>
        </Section>
      ))}

      {others.length > 0 ? (
        <Section tone="surface" spacing="compact">
          <Container size="wide">
            <h2 className="font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)]">
              Nos autres catégories
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {others.map((c) => (
                <Link
                  key={c.id}
                  href={`/categorie/${c.slug}`}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/40 hover:bg-surface-100"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="ink" spacing="compact">
        <Container size="default" className="text-center">
          <h2 className="mx-auto max-w-2xl font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)]">
            Une question, une commande&nbsp;?
          </h2>
          <div className="mt-8">
            <Button
              href={`tel:${siteConfig.phone}`}
              variant="inverse"
              size="lg"
            >
              Appeler {siteConfig.phoneFormatted}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
