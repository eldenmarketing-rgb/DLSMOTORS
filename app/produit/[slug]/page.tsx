import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import {
  Breadcrumb,
  breadcrumbJsonLd,
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  formatPrice,
  getAllProducts,
  getCategories,
  getProduct,
  getRelatedProducts,
} from "@/lib/catalog";
import { siteConfig } from "@/lib/config";

/**
 * Fiche produit — schema Product + Offer, CTA téléphone. Un produit épuisé
 * (`sold_out`) reste servi avec un bandeau et `OutOfStock` : jamais de 404
 * sur une URL indexée (le retrait définitif = redirection posée côté
 * dashboard via seo_pages.redirect_to).
 */

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  if (!siteConfig.catalog.enabled) return [];
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} — disponible chez ${siteConfig.name}. Appelez le ${siteConfig.phoneFormatted}.`,
    alternates: { canonical: `/produit/${slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  if (!siteConfig.catalog.enabled) notFound();
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const telHref = `tel:${siteConfig.phone}`;
  const [categories, related] = await Promise.all([
    getCategories(),
    getRelatedProducts(product, 4),
  ]);
  const category = categories.find((c) => c.id === product.categoryId) ?? null;
  const price = formatPrice(product.price);
  const soldOut = product.status === "sold_out";
  const pageUrl = `${siteUrl}/produit/${product.slug}`;
  const absolute = (src: string) =>
    /^https?:\/\//.test(src) ? src : `${siteUrl}${src}`;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    ...(category
      ? [{ label: category.name, href: `/categorie/${category.slug}` }]
      : []),
    { label: product.name },
  ];

  const attributeEntries = Object.entries(product.attributes);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: product.name,
    description: product.description || undefined,
    url: pageUrl,
    ...(product.images.length > 0
      ? { image: product.images.map(absolute) }
      : {}),
    ...(category ? { category: category.name } : {}),
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            url: pageUrl,
            priceCurrency: "EUR",
            price: product.price,
            availability: soldOut
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
            seller: {
              "@type": siteConfig.schema.type,
              name: siteConfig.name,
              url: siteUrl,
            },
          },
        }
      : {}),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs, siteUrl)),
        }}
      />

      <Section tone="surface" spacing="default">
        <Container size="wide">
          <Breadcrumb items={breadcrumbs} />

          <div className="mt-8 grid gap-12 md:grid-cols-2 md:items-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-100">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={`object-cover ${soldOut ? "opacity-60 grayscale" : ""}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-ink-soft">
                  Photo à venir
                </div>
              )}
            </div>

            <div>
              {category ? <Badge tone="accent">{category.name}</Badge> : null}
              <h1 className="mt-4 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
                {product.name}
              </h1>
              {product.unit ? (
                <p className="mt-2 text-ink-soft">{product.unit}</p>
              ) : null}

              {soldOut ? (
                <p className="mt-6 inline-block rounded-md bg-ink px-4 py-2 text-sm font-semibold text-surface-50">
                  {siteConfig.catalog.soldOutLabel} — appelez-nous pour une
                  alternative.
                </p>
              ) : null}

              {price ? (
                <p className="mt-6 font-display text-4xl text-ink">{price}</p>
              ) : (
                <p className="mt-6 text-lg text-ink-soft">Prix sur demande</p>
              )}

              {product.description ? (
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
                  {product.description.split(/\n{2,}/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : null}

              {attributeEntries.length > 0 ? (
                <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 rounded-2xl border border-ink/10 bg-panel p-6">
                  {attributeEntries.map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                        {key}
                      </dt>
                      <dd className="mt-1 text-ink">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href={telHref} variant="primary" size="lg">
                  {soldOut
                    ? `Appeler ${siteConfig.phoneFormatted}`
                    : `${siteConfig.catalog.ctaLabel} — ${siteConfig.phoneFormatted}`}
                </Button>
                {category ? (
                  <Button
                    href={`/categorie/${category.slug}`}
                    variant="secondary"
                    size="lg"
                  >
                    Voir la catégorie
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="surface" spacing="compact">
          <Container size="wide">
            <h2 className="font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)]">
              {soldOut ? "Nos alternatives disponibles" : "Vous aimerez aussi"}
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </main>
  );
}
