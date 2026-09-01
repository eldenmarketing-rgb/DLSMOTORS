import type { MetadataRoute } from "next";
import { getAllCmsPages } from "@/lib/cms";
import { getAllProducts, getCategories } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";

// Le sitemap suit le CMS : une page publiée depuis le dashboard y entre sans
// rebuild, avec sa vraie date de modification.
export const revalidate = 3600;

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: Date | string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const now = new Date();

  const staticRoutes: Entry[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    {
      path: `/${siteConfig.sectionRoot}`,
      priority: 0.9,
      changeFrequency: "monthly",
    },
    { path: "/avis", priority: 0.5, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  ];

  const cms = await getAllCmsPages();
  const byPath = new Map(cms.map((p) => [p.path, p]));

  // L'index du blog n'a de raison d'être annoncé que s'il liste quelque chose.
  const articles = cms.filter((p) => p.slug.startsWith("blog/"));
  if (articles.length > 0) {
    staticRoutes.push({
      path: "/blog",
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified: articles
        .map((a) => a.updatedAt)
        .sort()
        .at(-1),
    });
  }

  // Services déclarés dans le code (rendus même sans page CMS).
  const serviceRoutes: Entry[] = siteConfig.services.map((s) => ({
    path: `/${siteConfig.sectionRoot}/${s.slug}`,
    priority: s.featured ? 0.95 : 0.85,
    changeFrequency: "monthly",
    lastModified: byPath.get(s.slug)?.updatedAt,
  }));

  // Toute page CMS qui n'est ni un service du code ni une route statique.
  const taken = new Set([
    ...staticRoutes.map((r) => r.path.replace(/^\//, "")),
    ...siteConfig.services.map((s) => `${siteConfig.sectionRoot}/${s.slug}`),
  ]);
  const cmsRoutes: Entry[] = cms
    .filter((p) => !taken.has(p.slug))
    .map((p) => ({
      path: `/${p.slug}`,
      priority: 0.85,
      changeFrequency: "monthly",
      lastModified: p.updatedAt,
    }));

  // Module catalogue : les catégories sont les pages qui rankent, les
  // produits suivent avec leur vraie date (prix/dispo = fraîcheur réelle).
  const catalogRoutes: Entry[] = [];
  if (siteConfig.catalog.enabled) {
    const [categories, products] = await Promise.all([
      getCategories(),
      getAllProducts(),
    ]);
    for (const c of categories) {
      catalogRoutes.push({
        path: `/categorie/${c.slug}`,
        priority: 0.8,
        changeFrequency: "weekly",
      });
    }
    for (const p of products) {
      catalogRoutes.push({
        path: `/produit/${p.slug}`,
        priority: 0.6,
        changeFrequency: "weekly",
        lastModified: p.updatedAt,
      });
    }
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...cmsRoutes,
    ...catalogRoutes,
  ].map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastModified ?? now,
    changeFrequency,
    priority,
  }));
}
