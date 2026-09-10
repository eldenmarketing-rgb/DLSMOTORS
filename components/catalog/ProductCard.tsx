import Image from "next/image";
import Link from "next/link";
import { formatPrice, type CatalogProduct } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";

/** Carte produit — CTA téléphone uniquement (règle conversion : zéro panier, zéro formulaire). */
export function ProductCard({ product }: { product: CatalogProduct }) {
  const telHref = `tel:${siteConfig.phone}`;
  const price = formatPrice(product.price);
  const soldOut = product.status === "sold_out";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-surface-50 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <Link href={`/produit/${product.slug}`} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                soldOut ? "opacity-60 grayscale" : ""
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-ink-soft">
              Photo à venir
            </div>
          )}
          {soldOut ? (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-surface-50">
              {siteConfig.catalog.soldOutLabel}
            </span>
          ) : product.featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-accent shadow-sm">
              Populaire
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/produit/${product.slug}`}>
          <h3 className="font-display text-[15px] leading-snug text-ink transition-colors group-hover:text-primary-700">
            {product.name}
          </h3>
        </Link>
        {product.unit ? (
          <p className="mt-1 text-xs text-ink-soft">{product.unit}</p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {price ? (
            <span className="text-xl font-extrabold text-ink">{price}</span>
          ) : (
            <span />
          )}
          {soldOut ? (
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {siteConfig.catalog.soldOutLabel}
            </span>
          ) : (
            <a
              href={telHref}
              className="flex items-center justify-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-on-accent shadow-sm transition-all hover:bg-accent-600 hover:shadow-md"
            >
              {siteConfig.catalog.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
