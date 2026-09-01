import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CmsArticle } from "@/components/site/CmsArticle";
import { HubPage } from "@/components/site/HubPage";
import { ServiceFallback } from "@/components/site/ServiceFallback";
import {
  SECTION_PREFIX,
  getAllCmsPages,
  getCmsPage,
  getRedirect,
} from "@/lib/cms";
import { siteConfig } from "@/lib/config";

/**
 * Routeur unique des pages de contenu :
 *   1. une page CMS publiée répond → CmsArticle (le CMS gouverne toujours) ;
 *   2. le chemin est le hub `/<sectionRoot>` → liste des services ;
 *   3. le chemin est un service déclaré dans lib/config.ts sans page CMS
 *      → rendu minimal, le temps que la page soit produite dans le dashboard ;
 *   4. une redirection posée depuis le dashboard répond → 308 ;
 *   5. sinon 404.
 *
 * Next fait passer les routes écrites dans le code (/contact, /avis,
 * /categorie/…, /produit/…) avant celle-ci : une page CMS dont le slug est
 * déjà pris par le code n'est pas servie — elle apparaît en `external` dans
 * le dashboard, qui refuse de la publier.
 */

type Params = { slug: string[] };

export async function generateStaticParams(): Promise<Params[]> {
  const pages = await getAllCmsPages();
  const paths = new Set<string>([
    siteConfig.sectionRoot,
    ...siteConfig.services.map((s) => `${SECTION_PREFIX}${s.slug}`),
    ...pages.map((p) => p.slug),
  ]);
  return [...paths].map((p) => ({ slug: p.split("/") }));
}

// Une page publiée depuis le dashboard doit s'afficher sans rebuild ;
// le cache de route se purge à la publication (app/api/revalidate), 1 h en filet.
export const dynamicParams = true;
export const revalidate = 3600;

function findService(path: string) {
  if (!path.startsWith(SECTION_PREFIX)) return undefined;
  const slug = path.slice(SECTION_PREFIX.length);
  return siteConfig.services.find((s) => s.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const page = await getCmsPage(path);

  if (page) {
    return {
      title: { absolute: page.metaTitle },
      description: page.metaDescription,
      alternates: { canonical: `/${page.slug}` },
      openGraph: {
        title: page.metaTitle,
        description: page.metaDescription,
        url: `/${page.slug}`,
        type: "article",
      },
    };
  }

  if (path === siteConfig.sectionRoot) {
    return {
      title: siteConfig.hub.metaTitle,
      description: siteConfig.hub.metaDescription,
      alternates: { canonical: `/${siteConfig.sectionRoot}` },
    };
  }

  const service = findService(path);
  if (service) {
    return {
      title: service.title,
      description: service.description,
      alternates: { canonical: `/${path}` },
    };
  }

  return {};
}

export default async function CmsRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const path = slug.join("/");

  const page = await getCmsPage(path);
  if (page && path === siteConfig.sectionRoot)
    return <HubPage cmsPage={page} />;
  if (page) return <CmsArticle page={page} />;

  if (path === siteConfig.sectionRoot) return <HubPage cmsPage={null} />;

  const service = findService(path);
  if (service) return <ServiceFallback service={service} />;

  // Une redirection posée depuis le dashboard (renommage, page retirée) passe avant le 404.
  const to = await getRedirect(path);
  if (to) permanentRedirect(to);
  notFound();
}
