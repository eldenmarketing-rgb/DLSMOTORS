import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { siteConfig } from "@/lib/config";

/**
 * Lecture du contenu des pages depuis Supabase — la source de vérité éditée
 * dans le SEO Dashboard.
 *
 * La clé anon est protégée par RLS : elle ne voit que les pages `published`
 * (et les lignes `redirected` pour servir les redirections), en lecture seule.
 *
 * Un site instancié depuis ce template est 100 % générique : toute page CMS
 * porte la forme intro / sections markdown / FAQ / maillage et se rend par
 * `CmsArticle`. (Les gabarits typés par site — « pillar » sur les sites
 * historiques — sont volontairement absents du template : c'est un point
 * d'extension par site, pas du tronc commun.)
 */

const SITE_KEY = siteConfig.siteKey;

/**
 * Les pages service vivent sous `/<sectionRoot>` ; toute autre page CMS est
 * servie à la racine (app/[...slug]).
 */
export const SECTION_PREFIX = `${siteConfig.sectionRoot}/`;

export interface CmsImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  position?: string;
}

export interface CmsSection {
  title: string;
  content: string;
  image?: CmsImage | null;
}

export interface CmsCard {
  title: string;
  tagline: string;
  description: string;
  badges: string[];
  featured: boolean;
}

export interface CmsPage {
  /** Slug complet en base = chemin d'URL sans le « / » initial. */
  slug: string;
  /** Segment sous `/<sectionRoot>` quand la page y vit, sinon le slug entier. */
  path: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  pageType: string;
  createdAt: string;
  updatedAt: string;
  updatedDate: string | null;
  heroImage: CmsImage | null;
  intro: string;
  seoSections: CmsSection[];
  faq: { question: string; answer: string }[];
  highlights: string[];
  internalLinks: { url: string; anchor: string; context?: string }[];
  gallery: CmsImage[];
  /**
   * La carte de la page dans la liste de son parent (hub, accueil, footer),
   * éditée dans le dashboard. Chaque champ vide retombe sur le H1 / la meta.
   */
  card: CmsCard;
}

interface RawPage {
  slug: string;
  h1: string | null;
  meta_title: string | null;
  meta_description: string | null;
  page_type: string | null;
  created_at: string;
  updated_at: string;
  content: Record<string, unknown> | null;
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquantes — le contenu des pages vient de Supabase",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function asImage(v: unknown): CmsImage | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.src !== "string" || !o.src) return null;
  return {
    src: o.src,
    alt: typeof o.alt === "string" ? o.alt : "",
    width: typeof o.width === "number" ? o.width : undefined,
    height: typeof o.height === "number" ? o.height : undefined,
    position: typeof o.position === "string" ? o.position : undefined,
  };
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function asCard(v: unknown): CmsCard {
  const o = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  return {
    title: typeof o.title === "string" ? o.title.trim() : "",
    tagline: typeof o.tagline === "string" ? o.tagline.trim() : "",
    description: typeof o.description === "string" ? o.description.trim() : "",
    badges: asArray<unknown>(o.badges)
      .map((b) => (typeof b === "string" ? b.trim() : ""))
      .filter(Boolean),
    featured: o.featured === true,
  };
}

function normalize(row: RawPage): CmsPage {
  const c = (row.content || {}) as Record<string, unknown>;
  const h1 = row.h1 || "";
  return {
    slug: row.slug,
    path: row.slug.startsWith(SECTION_PREFIX)
      ? row.slug.slice(SECTION_PREFIX.length)
      : row.slug,
    h1,
    metaTitle: row.meta_title || h1,
    metaDescription: row.meta_description || "",
    pageType: row.page_type || "service",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    updatedDate:
      typeof c.updatedDate === "string" && c.updatedDate ? c.updatedDate : null,
    heroImage: asImage(c.heroImage),
    intro: typeof c.intro === "string" ? c.intro : "",
    seoSections: asArray<Record<string, unknown>>(c.seoSections).map((s) => ({
      title: String(s.title ?? ""),
      content: String(s.content ?? ""),
      image: asImage(s.image),
    })),
    faq: asArray<Record<string, unknown>>(c.faq)
      .map((f) => ({
        question: String(f.question ?? ""),
        answer: String(f.answer ?? ""),
      }))
      .filter((f) => f.question && f.answer),
    highlights: asArray<unknown>(c.highlights)
      .map((h) =>
        typeof h === "string"
          ? h
          : String((h as Record<string, unknown>)?.text ?? ""),
      )
      .filter(Boolean),
    internalLinks: asArray<Record<string, unknown>>(c.internalLinks)
      .map((l) => ({
        url: String(l.url ?? ""),
        anchor: String(l.anchor ?? ""),
        context: l.context ? String(l.context) : undefined,
      }))
      .filter((l) => l.url && l.anchor),
    gallery: asArray<unknown>(c.gallery)
      .map(asImage)
      .filter((i): i is CmsImage => !!i),
    card: asCard(c.card),
  };
}

const SELECT =
  "slug, h1, meta_title, meta_description, page_type, created_at, updated_at, content";

/** À incrémenter dès que la forme de `CmsPage` change (entrées de cache sérialisées avec l'ancienne). */
const CACHE_VERSION = "v1";

/** Toutes les pages publiées du site. Tag `pages:<siteKey>`, invalidé à chaque publication depuis le dashboard. */
export const getAllCmsPages = unstable_cache(
  async (): Promise<CmsPage[]> => {
    const { data, error } = await client()
      .from("seo_pages")
      .select(SELECT)
      .eq("site_key", SITE_KEY)
      .eq("status", "published")
      .order("slug");
    if (error) throw new Error(`Lecture des pages échouée : ${error.message}`);
    return (data as RawPage[]).map(normalize);
  },
  ["cms-pages", SITE_KEY, CACHE_VERSION],
  { tags: [`pages:${SITE_KEY}`], revalidate: 3600 },
);

/** Une page par son slug complet. Tag `page:<siteKey>:<slug>`. */
export async function getCmsPage(slug: string): Promise<CmsPage | null> {
  const load = unstable_cache(
    async (s: string): Promise<CmsPage | null> => {
      const { data, error } = await client()
        .from("seo_pages")
        .select(SELECT)
        .eq("site_key", SITE_KEY)
        .eq("status", "published")
        .eq("slug", s)
        .maybeSingle();
      if (error)
        throw new Error(`Lecture de la page "${s}" échouée : ${error.message}`);
      return data ? normalize(data as RawPage) : null;
    },
    ["cms-page", SITE_KEY, slug, CACHE_VERSION],
    {
      tags: [`page:${SITE_KEY}:${slug}`, `pages:${SITE_KEY}`],
      revalidate: 3600,
    },
  );
  return load(slug);
}

/**
 * Les redirections posées depuis le dashboard : ancien slug → chemin cible
 * (`seo_pages.status = 'redirected'`, `redirect_to`). Lues seulement quand
 * aucune page publiée ne répond, avant le 404. Les 301 de next.config passent
 * avant. Tag `pages:<siteKey>` : purgées à chaque publication ou renommage.
 */
export const getRedirects = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const { data, error } = await client()
      .from("seo_pages")
      .select("slug, redirect_to")
      .eq("site_key", SITE_KEY)
      .eq("status", "redirected")
      .not("redirect_to", "is", null);
    if (error)
      throw new Error(`Lecture des redirections échouée : ${error.message}`);
    const rows = data as { slug: string; redirect_to: string }[];
    return Object.fromEntries(rows.map((r) => [r.slug, r.redirect_to]));
  },
  ["cms-redirects", SITE_KEY, "v1"],
  { tags: [`pages:${SITE_KEY}`], revalidate: 3600 },
);

/** La cible d'une redirection posée depuis le dashboard pour ce slug, ou null. */
export async function getRedirect(slug: string): Promise<string | null> {
  return (await getRedirects())[slug] ?? null;
}
