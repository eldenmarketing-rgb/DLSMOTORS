import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/config";
import { listServices } from "@/lib/pages-list";

/**
 * Blocs de l'accueil (hors hero, catalogue et avis) — contenu depuis
 * `siteConfig.home`, ordre depuis `siteConfig.home.blocks` (app/page.tsx).
 */

const telHref = `tel:${siteConfig.phone}`;

export function Usps() {
  const { usps } = siteConfig.home;
  if (usps.length === 0) return null;
  return (
    <Section tone="panel" spacing="compact">
      <Container size="wide">
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((item) => (
            <li key={item.title}>
              <p className="font-display text-xl text-ink">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function Intro() {
  const { intro } = siteConfig.home;
  return (
    <Section tone="surface" spacing="compact">
      <Container size="default">
        <div className="max-w-3xl">
          <Badge tone="primary">{intro.badge}</Badge>
          <h2 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
            {intro.title}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            {intro.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export async function ServicesShowcase() {
  const services = await listServices();
  if (services.length === 0) return null;
  const featured = services.filter((s) => s.featured);
  const others = services.filter((s) => !s.featured);
  const { servicesSection } = siteConfig.home;
  const sectionHref = `/${siteConfig.sectionRoot}`;

  return (
    <>
      {featured.length > 0 ? (
        <Section tone="surface">
          <Container size="wide">
            <div className="max-w-2xl">
              <Badge tone="accent">{servicesSection.badge}</Badge>
              <h2 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
                {servicesSection.title}
              </h2>
              <p className="mt-5 text-lg text-ink-soft">
                {servicesSection.text}
              </p>
            </div>

            <div
              className={`mt-14 grid gap-6 md:grid-cols-2 ${
                featured.length >= 4 ? "lg:grid-cols-4" : ""
              }`}
            >
              {featured.map((s) => (
                <Link
                  key={s.slug}
                  href={s.href}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-panel transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  {s.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-primary-800">
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {s.highlight ? (
                        <span className="absolute right-3 top-3 rounded-md bg-accent-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-on-accent shadow-sm">
                          {s.highlight}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-xl text-ink">
                      {s.shortTitle}
                    </h3>
                    <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                      {s.description}
                    </p>
                    {s.price ? (
                      <p className="mt-6 font-display text-lg text-ink">
                        {s.price}
                      </p>
                    ) : null}
                    <span className="mt-4 inline-flex items-center gap-2 self-start rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors group-hover:border-accent-500 group-hover:bg-accent-500 group-hover:text-on-accent">
                      Voir les détails
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {others.length > 0 ? (
        <Section tone="surface" spacing="compact">
          <Container size="wide">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <Badge tone="primary">{servicesSection.othersBadge}</Badge>
                <h2 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)]">
                  {servicesSection.othersTitle}
                </h2>
              </div>
              <Link
                href={sectionHref}
                className="text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                {siteConfig.sectionLabel} →
              </Link>
            </div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-ink/8 bg-surface-50 p-8 transition-shadow hover:shadow-[var(--shadow-lift)]"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
                        {s.shortTitle}
                      </p>
                      <h3 className="mt-3 font-display text-xl text-ink">
                        {s.tagline || s.title}
                      </h3>
                      {s.badges ? (
                        <p className="mt-3 text-sm text-ink-soft">{s.badges}</p>
                      ) : null}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-transform group-hover:translate-x-1">
                      En savoir plus
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}

export function WhyUs() {
  const { why } = siteConfig.home;
  return (
    <Section tone="primary" spacing="roomy">
      <Container size="wide">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              <span aria-hidden="true">◆</span>
              {why.badge}
            </p>
            <h2 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
              {why.title}
            </h2>
            {why.paragraphs.map((p, i) => (
              <p
                key={i}
                className="mt-4 text-lg leading-relaxed text-surface-100/90 first-of-type:mt-6"
              >
                {p}
              </p>
            ))}
            {why.points && why.points.length > 0 ? (
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {why.points.map((pt) => (
                  <li key={pt.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-500/60 text-accent-400"
                    >
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-surface-50">{pt.title}</p>
                      <p className="mt-1 text-sm text-surface-100/75">
                        {pt.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8">
              <Button href={telHref} variant="inverse" size="md">
                Nous appeler
              </Button>
            </div>
          </div>

          {why.image ? (
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary-900 ring-1 ring-surface-50/15 sm:aspect-[5/4] md:aspect-[4/5]">
              <Image
                src={why.image.src}
                alt={why.image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              {why.quote ? (
                <figure className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-900 via-primary-900/85 to-transparent px-8 pb-8 pt-20 text-right">
                  <blockquote className="font-script text-2xl leading-snug text-surface-50 sm:text-3xl">
                    « {why.quote.text} »
                  </blockquote>
                  <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-surface-100/70">
                    — {why.quote.author}
                  </figcaption>
                </figure>
              ) : null}
            </div>
          ) : why.stats.length > 0 ? (
            <div className="rounded-2xl bg-primary-900/40 p-10 ring-1 ring-surface-50/15">
              <dl className="grid grid-cols-2 gap-8">
                {why.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="text-xs uppercase tracking-[0.16em] text-surface-100/70">
                      {s.label}
                    </dt>
                    <dd className="mt-2 font-display text-3xl text-surface-50">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 border-t border-surface-50/15 pt-6 text-sm text-surface-100/80">
                {why.note}
              </p>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

/** Avant / après et réalisations — le bloc disparaît tant qu'aucune image n'est fournie. */
export function Gallery() {
  const g = siteConfig.home.gallery;
  if (!g || (g.pairs.length === 0 && g.images.length === 0)) return null;
  return (
    <Section tone="ink" spacing="default">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              <span aria-hidden="true">◆</span>
              {g.badge}
            </p>
            <h2 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
              {g.title}
            </h2>
            <p className="mt-5 text-lg text-surface-100/85">{g.text}</p>
            {g.link ? (
              <Link
                href={g.link.href}
                className="mt-8 inline-flex items-center gap-2 rounded-md border border-surface-50/30 px-5 py-3 text-sm font-semibold text-surface-50 transition-colors hover:border-accent-400 hover:text-accent-300"
              >
                {g.link.label}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>

          <div className="grid gap-4">
            {g.pairs.map((pair, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-1 overflow-hidden rounded-2xl ring-1 ring-surface-50/15"
              >
                {(["before", "after"] as const).map((side) => (
                  <figure
                    key={side}
                    className="relative aspect-[4/3] bg-primary-800"
                  >
                    <Image
                      src={pair[side].src}
                      alt={pair[side].alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, 50vw"
                      className="object-cover"
                    />
                    <figcaption
                      className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        side === "after"
                          ? "bg-accent-500 text-on-accent"
                          : "bg-primary-900/80 text-surface-50"
                      }`}
                    >
                      {side === "before" ? "Avant" : "Après"}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
            {g.images.length > 0 ? (
              <ul className="grid grid-cols-2 gap-4">
                {g.images.map((img) => (
                  <li
                    key={img.src}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary-800 ring-1 ring-surface-50/15"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, 50vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function HomeFaq() {
  const { faq } = siteConfig.home;
  if (faq.length === 0) return null;
  return (
    <Section tone="panel" spacing="compact">
      <Container size="default">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="surface">Questions fréquentes</Badge>
            <h2 className="mt-5 font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)]">
              {siteConfig.labels.faqTitle}
            </h2>
            <p className="mt-5 text-ink-soft">{siteConfig.labels.faqText}</p>
            <div className="mt-6">
              <Button href={telHref} variant="secondary" size="md">
                {siteConfig.phoneFormatted}
              </Button>
            </div>
          </div>
          <dl className="space-y-8">
            {faq.map((item) => (
              <div key={item.q} className="border-b border-ink/10 pb-6">
                <dt className="font-display text-lg text-ink">{item.q}</dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}

export function CtaFinal() {
  const { cta } = siteConfig.home;
  const points = cta.points ?? [];
  return (
    <Section tone="ink" spacing="default" className="border-t border-surface-50/10">
      <Container size="wide">
        <div
          className={`grid gap-12 ${points.length > 0 ? "md:grid-cols-[1.2fr_0.8fr] md:items-center" : "text-center"}`}
        >
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
              <span aria-hidden="true">◆</span>
              {cta.badge}
            </p>
            <h2
              className={`mt-6 max-w-2xl font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] ${points.length > 0 ? "" : "mx-auto"}`}
            >
              {cta.title}
            </h2>
            <p
              className={`mt-5 max-w-xl text-lg text-surface-100/85 ${points.length > 0 ? "" : "mx-auto"}`}
            >
              {cta.text}
            </p>
            <div
              className={`mt-10 flex flex-wrap gap-4 ${points.length > 0 ? "" : "justify-center"}`}
            >
              <Button href={telHref} variant="inverse" size="lg">
                Appeler {siteConfig.phoneFormatted}
              </Button>
              <Button
                href={siteConfig.labels.ctaSecondaryHref}
                variant="ghost"
                size="lg"
                className="border border-surface-50/30 text-surface-100 hover:border-accent-400 hover:text-accent-300"
              >
                {siteConfig.labels.ctaSecondaryLabel}
              </Button>
            </div>
          </div>

          {points.length > 0 ? (
            <ul className="space-y-5 rounded-2xl bg-primary-800/60 p-8 ring-1 ring-surface-50/15">
              {points.map((pt) => (
                <li key={pt} className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-500/50 text-accent-400"
                  >
                    ✓
                  </span>
                  <span className="text-surface-50">{pt}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
