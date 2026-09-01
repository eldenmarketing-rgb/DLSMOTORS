import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb, breadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getAllCmsPages } from "@/lib/cms";
import { siteConfig } from "@/lib/config";

// La liste suit le CMS : un article publié depuis le dashboard apparaît sans
// rebuild (le cache de cette route est purgé par /api/revalidate).
export const revalidate = 3600;

const articlesOf = async () =>
  (await getAllCmsPages())
    .filter((p) => p.slug.startsWith("blog/"))
    .sort((a, b) =>
      (b.updatedDate || b.updatedAt).localeCompare(
        a.updatedDate || a.updatedAt,
      ),
    );

export async function generateMetadata(): Promise<Metadata> {
  const articles = await articlesOf();
  return {
    title: siteConfig.blog.title,
    description: siteConfig.blog.metaDescription,
    alternates: { canonical: "/blog" },
    // Une liste vide n'a rien à offrir à l'index ; elle sort aussi du sitemap.
    robots: articles.length === 0 ? { index: false, follow: true } : undefined,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const articles = await articlesOf();
  const breadcrumbs = [{ label: "Accueil", href: "/" }, { label: "Blog" }];

  return (
    <main>
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
            <Badge tone="primary">{siteConfig.labels.articleBadge}</Badge>
            <h1 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
              {siteConfig.blog.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {siteConfig.blog.intro}
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="default">
        <Container size="wide">
          {articles.length === 0 ? (
            <p className="text-ink-soft">
              Les premiers articles arrivent bientôt.
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => {
                const date = a.updatedDate || a.updatedAt;
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/${a.slug}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border border-ink/8 bg-surface-50 p-8 transition-shadow hover:shadow-[var(--shadow-lift)]"
                    >
                      <div>
                        <time
                          dateTime={date}
                          className="text-xs uppercase tracking-[0.14em] text-ink-soft"
                        >
                          {formatDate(date)}
                        </time>
                        <h2 className="mt-3 font-display text-xl text-ink">
                          {a.card.title || a.h1}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                          {a.card.description || a.metaDescription}
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-transform group-hover:translate-x-1">
                        Lire l&apos;article <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </Section>
    </main>
  );
}
