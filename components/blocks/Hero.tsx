import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/config";

/**
 * Trois squelettes de hero — choisir par site (`home.hero.variant`) pour que
 * deux sites du réseau n'aient jamais la même ligne de flottaison.
 *
 *   A — panneau sombre plein écran, dégradé, sans image (Debarras)
 *   B — split : texte à gauche, image à droite (requiert `hero.image`)
 *   C — clair et minimal, image en bandeau sous le texte (image optionnelle)
 */

export function Hero() {
  const { hero } = siteConfig.home;
  const telHref = `tel:${siteConfig.phone}`;
  const sectionHref = `/${siteConfig.sectionRoot}`;

  if (hero.variant === "B") {
    return (
      <section className="bg-surface-50">
        <Container
          size="wide"
          className="grid items-center gap-12 py-16 sm:py-20 md:grid-cols-2 md:py-24"
        >
          <div>
            <Badge tone="primary">{hero.badge}</Badge>
            <h1 className="mt-6 font-display text-[length:var(--text-display)] leading-[var(--text-display--line-height)] tracking-[var(--text-display--letter-spacing)] text-ink">
              {hero.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {hero.text}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={telHref} variant="primary" size="lg">
                Appeler {siteConfig.phoneFormatted}
              </Button>
              <Button href={sectionHref} variant="secondary" size="lg">
                {hero.secondaryLabel}
              </Button>
            </div>
          </div>
          {hero.image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary-100 shadow-[var(--shadow-lift)]">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </Container>
      </section>
    );
  }

  if (hero.variant === "C") {
    return (
      <section className="bg-surface-50">
        <Container
          size="default"
          className="py-16 text-center sm:py-20 md:py-24"
        >
          <Badge tone="panel">{hero.badge}</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-[length:var(--text-display)] leading-[var(--text-display--line-height)] tracking-[var(--text-display--letter-spacing)] text-ink">
            {hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {hero.text}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href={telHref} variant="primary" size="lg">
              Appeler {siteConfig.phoneFormatted}
            </Button>
            <Button href={sectionHref} variant="secondary" size="lg">
              {hero.secondaryLabel}
            </Button>
          </div>
        </Container>
        {hero.image ? (
          <Container size="wide" className="pb-16">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-primary-100 shadow-[var(--shadow-lift)]">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-cover"
              />
            </div>
          </Container>
        ) : null}
      </section>
    );
  }

  // Variante A (défaut) — panneau sombre plein écran.
  return (
    <section className="relative isolate flex min-h-[68vh] items-center overflow-hidden bg-ink text-surface-50 md:min-h-[80vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-ink via-primary-900 to-ink"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_100%,var(--color-accent-500),transparent_55%)] opacity-30"
      />

      <Container size="wide" className="relative py-24 sm:py-28 md:py-32">
        <div className="max-w-3xl">
          <Badge
            tone="surface"
            className="bg-surface-50/15 text-surface-50 backdrop-blur-sm"
          >
            {hero.badge}
          </Badge>
          <h1 className="mt-6 font-display text-[length:var(--text-display)] leading-[var(--text-display--line-height)] tracking-[var(--text-display--letter-spacing)] text-surface-50">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-surface-100/90">
            {hero.text}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={telHref} variant="inverse" size="lg">
              Appeler {siteConfig.phoneFormatted}
            </Button>
            <Link
              href={sectionHref}
              className="inline-flex items-center gap-2 rounded-md border border-surface-50/40 bg-surface-50/5 px-6 py-4 text-sm font-semibold text-surface-50 backdrop-blur-sm transition-colors hover:border-surface-50/70 hover:bg-surface-50/15"
            >
              {hero.secondaryLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
