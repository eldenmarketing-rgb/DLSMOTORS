import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez ${siteConfig.name} par téléphone, WhatsApp ou email — réponse rapide.`,
  alternates: { canonical: "/contact" },
};

/** Règle conversion : le téléphone d'abord ; WhatsApp pré-rempli, email, et formulaire possible en appoint. */
export default function ContactPage() {
  const whatsappHref = `https://wa.me/33${siteConfig.phone.slice(1)}?text=${encodeURIComponent(
    siteConfig.contact.whatsappMessage,
  )}`;

  return (
    <main>
      <Section tone="surface" spacing="default">
        <Container size="default">
          <div className="max-w-xl">
            <Badge tone="surface">Contact</Badge>
            <h1 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
              {siteConfig.contact.title}
            </h1>
            <p className="mt-5 text-lg text-ink-soft">
              {siteConfig.contact.text}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <a
              href={`tel:${siteConfig.phone}`}
              className="group rounded-2xl border border-ink/10 bg-surface-50 p-8 transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
                Téléphone
              </p>
              <p className="mt-4 font-display text-xl text-ink">
                {siteConfig.phoneFormatted}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-ink transition-transform group-hover:translate-x-1">
                Appeler maintenant
                <span aria-hidden="true">→</span>
              </span>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-ink/10 bg-surface-50 p-8 transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
                WhatsApp
              </p>
              <p className="mt-4 font-display text-xl text-ink">
                Message direct
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-ink transition-transform group-hover:translate-x-1">
                Écrire sur WhatsApp
                <span aria-hidden="true">→</span>
              </span>
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="group rounded-2xl border border-ink/10 bg-surface-50 p-8 transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
                Email
              </p>
              <p className="mt-4 font-display text-xl text-ink break-all">
                {siteConfig.email}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-ink transition-transform group-hover:translate-x-1">
                Envoyer un email
                <span aria-hidden="true">→</span>
              </span>
            </a>
          </div>

          <div className="mt-12 rounded-2xl border border-ink/10 bg-panel p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Horaires
            </p>
            <p className="mt-2 text-ink">{siteConfig.openingHours}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Zone d&apos;intervention
            </p>
            <p className="mt-2 text-ink">{siteConfig.contact.zoneText}</p>
          </div>

          <div className="mt-12 text-center">
            <Button
              href={`tel:${siteConfig.phone}`}
              variant="primary"
              size="lg"
            >
              Appeler {siteConfig.phoneFormatted}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
