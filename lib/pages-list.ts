import { SECTION_PREFIX, getAllCmsPages } from "@/lib/cms";
import { siteConfig, type ImageRef } from "@/lib/config";

/**
 * La liste des services telle que le site l'affiche — hub `/<sectionRoot>`,
 * accueil, footer.
 *
 * Deux sources, une seule liste : les services écrits dans le code
 * (`lib/config.ts`, utiles au lancement) et les pages publiées depuis le SEO
 * Dashboard sous `<sectionRoot>/`. Sans ce regroupement, une page publiée
 * depuis le dashboard existerait à son URL mais n'apparaîtrait dans aucune
 * liste : orpheline pour le visiteur comme pour Google.
 *
 * La carte d'une page CMS vient de `content.card` (dashboard) ; chaque champ
 * vide retombe sur le H1 et la meta description.
 */
export interface ServiceCard {
  /** Segment sous `/<sectionRoot>`. */
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  /** Ligne d'étiquettes (« Tout le 66 · Devis gratuit »). */
  badges: string;
  featured: boolean;
  source: "code" | "cms";
  /** Visuel, prix et pastille — portés par le code seulement (lib/config.ts). */
  image?: ImageRef;
  price?: string;
  highlight?: string;
}

export async function listServices(): Promise<ServiceCard[]> {
  const fromCode: ServiceCard[] = siteConfig.services.map((s) => ({
    slug: s.slug,
    href: `/${siteConfig.sectionRoot}/${s.slug}`,
    title: s.title,
    shortTitle: s.shortTitle,
    tagline: s.tagline,
    description: s.description,
    badges: `${s.badgeLeft} · ${s.badgeRight}`,
    featured: s.featured === true,
    source: "code",
    image: s.image,
    price: s.price,
    highlight: s.highlight,
  }));

  const known = new Set(fromCode.map((s) => s.slug));
  const fromCms: ServiceCard[] = (await getAllCmsPages())
    .filter((p) => p.slug.startsWith(SECTION_PREFIX) && !known.has(p.path))
    .map((p) => ({
      slug: p.path,
      href: `/${p.slug}`,
      title: p.card.title || p.h1,
      shortTitle: p.card.title || p.h1,
      tagline: p.card.tagline,
      description: p.card.description || p.metaDescription,
      badges: p.card.badges.join(" · "),
      featured: p.card.featured,
      source: "cms",
    }));

  return [...fromCode, ...fromCms];
}
