import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Stars } from "@/components/blocks/ReviewsBlock";
import { siteConfig } from "@/lib/config";
import { averageRating, gbpLink, reviews } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Avis clients",
  description: siteConfig.avis.metaDescription,
  alternates: { canonical: "/avis" },
};

/**
 * Page avis — uniquement de vrais avis (data/reviews.ts). Le schema
 * AggregateRating n'est émis QUE si des avis existent : le simuler est le
 * meilleur moyen de perdre les étoiles en SERP et la confiance de Google.
 */
export default function AvisPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const avg = averageRating();

  const ratingSchema =
    avg !== null
      ? {
          "@context": "https://schema.org",
          "@type": siteConfig.schema.type,
          "@id": `${siteUrl}/#business`,
          name: siteConfig.name,
          url: siteUrl,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg,
            bestRating: 5,
            reviewCount: reviews.length,
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
            },
            reviewBody: r.text,
            ...(r.date ? { datePublished: r.date } : {}),
          })),
        }
      : null;

  return (
    <main>
      {ratingSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingSchema) }}
        />
      ) : null}
      <Section tone="surface" spacing="default">
        <Container size="wide">
          <Badge tone="surface">Avis clients</Badge>
          <h1 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
            {siteConfig.avis.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            {siteConfig.avis.intro}
          </p>
          {avg !== null ? (
            <p className="mt-6 text-lg text-ink">
              <Stars value={avg} />{" "}
              <span className="font-semibold">
                {String(avg).replace(".", ",")}/5
              </span>{" "}
              <span className="text-ink-soft">sur {reviews.length} avis</span>
            </p>
          ) : null}

          {reviews.length > 0 ? (
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <li
                  key={`${r.author}-${r.text.slice(0, 20)}`}
                  className="flex flex-col rounded-2xl border border-ink/8 bg-surface-50 p-8"
                >
                  <Stars value={r.rating} />
                  <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    {r.text}
                  </p>
                  <p className="mt-5 text-sm font-semibold text-ink">
                    {r.author}
                  </p>
                  {r.date ? (
                    <time
                      dateTime={r.date}
                      className="mt-1 text-xs text-ink-soft"
                    >
                      {new Date(r.date).toLocaleDateString("fr-FR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-12 rounded-2xl border border-ink/10 bg-panel p-10">
            <p className="text-sm leading-relaxed text-ink-soft">
              Nous avons travaillé pour vous&nbsp;? Votre avis aide les
              prochains clients — et nous fait toujours plaisir.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {gbpLink ? (
                <Button
                  href={gbpLink}
                  variant="primary"
                  size="md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Laisser un avis Google
                </Button>
              ) : (
                <Button
                  href={`tel:${siteConfig.phone}`}
                  variant="primary"
                  size="md"
                >
                  Appeler
                </Button>
              )}
              <Button
                href={`mailto:${siteConfig.email}`}
                variant="secondary"
                size="md"
              >
                Envoyer un email
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
