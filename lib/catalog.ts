import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { siteConfig } from "@/lib/config";

/**
 * Module catalogue — lecture des tables Supabase `product_categories` et
 * `products` (migration `migration-products.sql` du repo seo-automation).
 * Même mécanique que le CMS : clé anon + RLS lecture seule (`published` et
 * `sold_out` visibles, `hidden` invisible), cache par tag `catalog:<siteKey>`
 * purgeable via /api/revalidate.
 *
 * Un produit épuisé (`sold_out`) RESTE servi : sa page affiche un bandeau et
 * le schema passe en OutOfStock — jamais de 404 sur une URL indexée. Le
 * retrait définitif se fait côté dashboard (redirection `seo_pages.redirect_to`).
 */

const SITE_KEY = siteConfig.siteKey;

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  displayOrder: number;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  categoryId: string | null;
  name: string;
  description: string;
  price: number | null;
  unit: string;
  /** Caractéristiques libres par niche (année, km, contenance…). */
  attributes: Record<string, string | number | boolean>;
  images: string[];
  status: "published" | "sold_out";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquantes — le catalogue vient de Supabase",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

const CACHE_VERSION = "v1";

export const getCategories = unstable_cache(
  async (): Promise<CatalogCategory[]> => {
    if (!siteConfig.catalog.enabled) return [];
    const { data, error } = await client()
      .from("product_categories")
      .select("id, slug, name, description, display_order")
      .eq("site_key", SITE_KEY)
      .order("display_order")
      .order("name");
    if (error)
      throw new Error(`Lecture des catégories échouée : ${error.message}`);
    return (data ?? []).map((r) => ({
      id: r.id as string,
      slug: r.slug as string,
      name: r.name as string,
      description: (r.description as string | null) ?? "",
      displayOrder: (r.display_order as number | null) ?? 0,
    }));
  },
  ["catalog-categories", SITE_KEY, CACHE_VERSION],
  { tags: [`catalog:${SITE_KEY}`], revalidate: 3600 },
);

/** Tous les produits visibles (published + sold_out) — les catalogues du réseau sont petits, une seule lecture cachée suffit. */
export const getAllProducts = unstable_cache(
  async (): Promise<CatalogProduct[]> => {
    if (!siteConfig.catalog.enabled) return [];
    const { data, error } = await client()
      .from("products")
      .select(
        "id, slug, category_id, name, description, price, unit, attributes, images, status, featured, created_at, updated_at",
      )
      .eq("site_key", SITE_KEY)
      .in("status", ["published", "sold_out"])
      .order("featured", { ascending: false })
      .order("name");
    if (error)
      throw new Error(`Lecture des produits échouée : ${error.message}`);
    return (data ?? []).map((r) => ({
      id: r.id as string,
      slug: r.slug as string,
      categoryId: (r.category_id as string | null) ?? null,
      name: r.name as string,
      description: (r.description as string | null) ?? "",
      price: (r.price as number | null) ?? null,
      unit: (r.unit as string | null) ?? "",
      attributes:
        r.attributes && typeof r.attributes === "object"
          ? (r.attributes as Record<string, string | number | boolean>)
          : {},
      images: Array.isArray(r.images) ? (r.images as string[]) : [],
      status: r.status === "sold_out" ? "sold_out" : "published",
      featured: r.featured === true,
      createdAt: r.created_at as string,
      updatedAt: r.updated_at as string,
    }));
  },
  ["catalog-products", SITE_KEY, CACHE_VERSION],
  { tags: [`catalog:${SITE_KEY}`], revalidate: 3600 },
);

export async function getCategory(
  slug: string,
): Promise<CatalogCategory | null> {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getProduct(slug: string): Promise<CatalogProduct | null> {
  return (await getAllProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(
  categoryId: string,
): Promise<CatalogProduct[]> {
  return (await getAllProducts()).filter((p) => p.categoryId === categoryId);
}

/** Produits liés (même catégorie d'abord, puis le reste), pour la fiche produit. */
export async function getRelatedProducts(
  product: CatalogProduct,
  limit: number,
): Promise<CatalogProduct[]> {
  const all = (await getAllProducts()).filter((p) => p.id !== product.id);
  const same = all.filter(
    (p) => p.categoryId && p.categoryId === product.categoryId,
  );
  const rest = all.filter(
    (p) => !p.categoryId || p.categoryId !== product.categoryId,
  );
  return [...same, ...rest].slice(0, limit);
}

/** Prix affiché (« 29,90 € », « 129 € ») — null si non renseigné. */
export function formatPrice(price: number | null): string | null {
  if (price === null) return null;
  const s = Number.isInteger(price)
    ? String(price)
    : price.toFixed(2).replace(".", ",");
  return `${s} €`;
}
