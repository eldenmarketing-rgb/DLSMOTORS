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

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {featured.map((s) => (
                <Link
                  key={s.slug}
                  href={s.href}
                  className="group relative overflow-hidden rounded-2xl bg-primary-100 p-10 transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-800">
                    {s.shortTitle}
                  </span>
                  <h3 className="mt-4 font-display text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] text-ink">
                    {s.tagline || s.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
                    {s.description}
                  </p>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm text-ink-soft">{s.badges}</span>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-transform group-hover:translate-x-1">
                      Découvrir
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
            <Badge tone="primary" className="bg-primary-700 text-surface-50">
              {why.badge}
            </Badge>
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
            <div className="mt-8">
              <Button href={telHref} variant="inverse" size="md">
                Nous appeler
              </Button>
            </div>
          </div>

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
  return (
    <Section tone="ink" spacing="default">
      <Container size="default" className="text-center">
        <Badge tone="primary" className="bg-primary-700 text-surface-50">
          {cta.badge}
        </Badge>
        <h2 className="mx-auto mt-6 max-w-2xl font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)]">
          {cta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-surface-100/85">
          {cta.text}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={telHref} variant="inverse" size="lg">
            Appeler {siteConfig.phoneFormatted}
          </Button>
          <Button
            href={siteConfig.labels.ctaSecondaryHref}
            variant="ghost"
            size="lg"
            className="text-surface-100 hover:text-surface-50"
          >
            {siteConfig.labels.ctaSecondaryLabel}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
