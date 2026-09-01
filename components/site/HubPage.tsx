import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/config";
import type { CmsPage } from "@/lib/cms";
import { listServices } from "@/lib/pages-list";

/**
 * Hub `/<sectionRoot>` : la liste de toutes les pages service (code + CMS).
 * Si une page CMS publiée porte le slug du hub lui-même, son H1 et son intro
 * remplacent les textes de la config — le dashboard garde la main.
 */
export async function HubPage({ cmsPage }: { cmsPage: CmsPage | null }) {
  const services = await listServices();
  const title = cmsPage?.h1 || siteConfig.hub.title;
  const intro = cmsPage?.intro || siteConfig.hub.intro;

  return (
    <main>
      <Section tone="surface" spacing="compact">
        <Container size="wide">
          <div className="max-w-2xl">
            <Badge tone="surface">{siteConfig.sectionLabel}</Badge>
            <h1 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
              {title}
            </h1>
            <p className="mt-5 text-lg text-ink-soft">{intro}</p>
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="default">
        <Container size="wide">
          <ul className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-ink/8 bg-surface-50 p-10 transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone={s.featured ? "accent" : "primary"}>
                        {s.featured ? "Service phare" : "Service"}
                      </Badge>
                      {s.badges ? (
                        <span className="text-xs text-ink-soft">
                          {s.badges}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-5 font-display text-2xl text-ink">
                      {s.title}
                    </h2>
                    {s.tagline ? (
                      <p className="mt-3 text-base italic text-ink-soft">
                        {s.tagline}
                      </p>
                    ) : null}
                    <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-soft">
                      {s.description}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink transition-transform group-hover:translate-x-1">
                    En savoir plus
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </main>
  );
}
