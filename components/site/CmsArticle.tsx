import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  Breadcrumb,
  breadcrumbJsonLd,
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Markdown } from "@/components/ui/Markdown";
import { siteConfig } from "@/lib/config";
import { getAllCmsPages, type CmsPage } from "@/lib/cms";

/**
 * Rendu d'une page créée dans le SEO Dashboard : intro, sections markdown,
 * points forts, galerie, FAQ, maillage. Le gabarit s'adapte au type de page
 * (`page_type` du dashboard) : un article porte un schema BlogPosting signé
 * du site et sa date visible ; le reste est un Service.
 */

/** Libellés des rubriques écrites dans le code, pour le fil d'Ariane. */
const CODE_SECTIONS: Record<string, string> = Object.fromEntries([
  ...siteConfig.navigation
    .filter((n) => n.href !== "/")
    .map((n) => [n.href.slice(1), n.label]),
  [siteConfig.sectionRoot, siteConfig.sectionLabel],
  ["blog", "Blog"],
]);

/**
 * Fil d'Ariane qui suit l'URL, mais ne pointe que vers des pages qui existent
 * — une rubrique du code ou une page CMS publiée. Un niveau sans page est
 * sauté : un lien vers un 404 dans le breadcrumb serait pire que rien.
 */
function crumbsFor(page: CmsPage, published: CmsPage[]): BreadcrumbItem[] {
  const bySlug = new Map(published.map((p) => [p.slug, p]));
  const parts = page.slug.split("/");
  const items: BreadcrumbItem[] = [{ label: "Accueil", href: "/" }];
  for (let i = 1; i < parts.length; i++) {
    const parent = parts.slice(0, i).join("/");
    const label = CODE_SECTIONS[parent] ?? bySlug.get(parent)?.h1;
    if (label) items.push({ label, href: `/${parent}` });
  }
  items.push({ label: page.h1 });
  return items;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function CmsArticle({ page }: { page: CmsPage }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const telHref = `tel:${siteConfig.phone}`;
  const pageUrl = `${siteUrl}/${page.slug}`;
  const modified = page.updatedDate || page.updatedAt;
  // Un contenu importé peut porter une date de mise à jour antérieure à sa
  // ligne en base : la publication est alors la plus ancienne des deux.
  const published = [page.createdAt, modified].sort()[0];
  const isArticle = page.pageType === "article";
  const absolute = (src: string) =>
    /^https?:\/\//.test(src) ? src : `${siteUrl}${src}`;

  const breadcrumbs = crumbsFor(page, await getAllCmsPages());

  const provider = {
    "@type": siteConfig.schema.type,
    name: siteConfig.name,
    telephone: `+33${siteConfig.phone.slice(1)}`,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      postalCode: siteConfig.address.postalCode,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      addressCountry: siteConfig.address.addressCountry,
    },
  };

  const mainSchema = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        headline: page.h1,
        description: page.metaDescription,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        datePublished: published,
        dateModified: modified,
        inLanguage: "fr-FR",
        ...(page.heroImage ? { image: absolute(page.heroImage.src) } : {}),
        author: {
          "@type": siteConfig.schema.type,
          name: siteConfig.name,
          url: siteUrl,
        },
        publisher: {
          "@type": siteConfig.schema.type,
          name: siteConfig.name,
          url: siteUrl,
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: page.h1,
        description: page.metaDescription,
        url: pageUrl,
        dateModified: modified,
        category: siteConfig.labels.serviceCategory,
        ...(page.heroImage ? { image: absolute(page.heroImage.src) } : {}),
        provider,
        areaServed: {
          "@type": "AdministrativeArea",
          name: siteConfig.schema.areaServed,
        },
      };

  const faqSchema =
    page.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs, siteUrl)),
        }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}

      {/* ─── Hero ────────────────────────────────────────── */}
      <Section tone="surface" spacing="default">
        <Container size="wide">
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-6 max-w-3xl">
            <Badge tone="primary">
              {isArticle
                ? siteConfig.labels.articleBadge
                : siteConfig.labels.serviceBadge}
            </Badge>
            <h1 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
              {page.h1}
            </h1>
            {isArticle ? (
              <p className="mt-4 text-sm text-ink-soft">
                Par {siteConfig.name} ·{" "}
                <time dateTime={modified}>
                  Mis à jour le {formatDate(modified)}
                </time>
              </p>
            ) : null}
            {page.intro ? (
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
                {page.intro.split(/\n{2,}/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={telHref} variant="primary" size="lg">
                Appeler {siteConfig.phoneFormatted}
              </Button>
              <Button
                href={siteConfig.labels.ctaSecondaryHref}
                variant="secondary"
                size="lg"
              >
                {siteConfig.labels.ctaSecondaryLabel}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {page.heroImage ? (
        <section className="bg-surface-50 pb-16">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-primary-100 shadow-[var(--shadow-lift)]">
              <Image
                src={page.heroImage.src}
                alt={page.heroImage.alt}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, (min-width: 640px) 90vw, 100vw"
                className={`object-cover ${page.heroImage.position ?? ""}`}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Sections — nombre et ordre pilotés depuis le dashboard ─── */}
      {page.seoSections.map((section, i) => (
        <Section
          key={i}
          tone={i % 2 === 0 ? "panel" : "surface"}
          spacing="default"
        >
          <Container size="default">
            <h2 className="font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)]">
              {section.title}
            </h2>
            <Markdown content={section.content} />
            {section.image ? (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-primary-100">
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className={`object-cover ${section.image.position ?? ""}`}
                />
              </div>
            ) : null}
            {i === 1 ? (
              <div className="mt-10">
                <Button href={telHref} variant="primary" size="md">
                  Appeler {siteConfig.phoneFormatted}
                </Button>
              </div>
            ) : null}
          </Container>
        </Section>
      ))}

      {page.highlights.length > 0 ? (
        <Section tone="primary" spacing="compact">
          <Container size="default">
            <ul className="grid gap-4 md:grid-cols-2">
              {page.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[0.95rem] leading-relaxed text-surface-100/95"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-surface-50"
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {page.gallery.length > 0 ? (
        <Section tone="surface" spacing="compact">
          <Container size="wide">
            <div className="grid gap-6 sm:grid-cols-2">
              {page.gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-primary-100"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 640px) 45vw, 100vw"
                    className={`object-cover ${img.position ?? ""}`}
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {page.faq.length > 0 ? (
        <Section tone="panel" spacing="default">
          <Container size="default">
            <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <Badge tone="surface">Questions fréquentes</Badge>
                <h2 className="mt-5 font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)]">
                  {siteConfig.labels.faqTitle}
                </h2>
                <p className="mt-5 text-ink-soft">
                  {siteConfig.labels.faqText}
                </p>
                <div className="mt-6">
                  <Button href={telHref} variant="secondary" size="md">
                    {siteConfig.phoneFormatted}
                  </Button>
                </div>
              </div>
              <dl className="space-y-8">
                {page.faq.map((item) => (
                  <div
                    key={item.question}
                    className="border-b border-ink/10 pb-6"
                  >
                    <dt className="font-display text-lg text-ink">
                      {item.question}
                    </dt>
                    <dd className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </Section>
      ) : null}

      {page.internalLinks.length > 0 ? (
        <Section tone="surface" spacing="compact">
          <Container size="wide">
            <h2 className="font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)]">
              {siteConfig.labels.relatedTitle}
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {page.internalLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-ink/8 bg-surface-50 p-8 transition-shadow hover:shadow-[var(--shadow-lift)]"
                  >
                    <div>
                      <h3 className="font-display text-xl text-ink">
                        {link.anchor}
                      </h3>
                      {link.context ? (
                        <p className="mt-3 text-sm text-ink-soft">
                          {link.context}
                        </p>
                      ) : null}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-transform group-hover:translate-x-1">
                      Découvrir <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </main>
  );
}
