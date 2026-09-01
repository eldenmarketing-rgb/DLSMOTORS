import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig, type ServiceDef } from "@/lib/config";

/**
 * Rendu minimal d'un service déclaré dans `lib/config.ts` tant qu'aucune page
 * CMS publiée ne porte son slug. Le CMS est la seule vraie source : dès que la
 * page est publiée depuis le dashboard, c'est elle qui est servie.
 */
export function ServiceFallback({ service }: { service: ServiceDef }) {
  const telHref = `tel:${siteConfig.phone}`;
  return (
    <main>
      <Section tone="surface" spacing="default">
        <Container size="wide">
          <div className="max-w-3xl">
            <Badge tone="primary">{siteConfig.labels.serviceBadge}</Badge>
            <h1 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
              {service.title}
            </h1>
            <p className="mt-4 text-lg italic text-ink-soft">
              {service.tagline}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {service.description}
            </p>
            <p className="mt-4 text-sm text-ink-soft">
              {service.badgeLeft} · {service.badgeRight}
            </p>
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
    </main>
  );
}
