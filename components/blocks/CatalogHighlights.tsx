import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getAllProducts, getCategories } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";

/**
 * Vitrine catalogue sur l'accueil : les produits mis en avant + les liens
 * vers les pages catégorie (ce sont elles qui rankent). Rien ne s'affiche si
 * le module est désactivé ou le catalogue vide.
 */
export async function CatalogHighlights() {
  if (!siteConfig.catalog.enabled) return null;
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);
  if (products.length === 0) return null;

  const highlighted = products.filter((p) => p.featured).slice(0, 4);
  const shown = highlighted.length > 0 ? highlighted : products.slice(0, 4);

  return (
    <Section tone="surface" spacing="default">
      <Container size="wide">
        <div className="max-w-2xl">
          <Badge tone="accent">{siteConfig.catalog.label}</Badge>
          <h2 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)]">
            {siteConfig.catalog.sectionTitle}
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            {siteConfig.catalog.sectionText}
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>

        {categories.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/categorie/${c.slug}`}
                className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/40 hover:bg-surface-100"
              >
                {c.name}
              </Link>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
