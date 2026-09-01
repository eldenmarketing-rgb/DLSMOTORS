import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: `Conditions générales d'utilisation du site ${siteConfig.name}.`,
  alternates: { canonical: "/cgu" },
  robots: { index: false, follow: true },
};

export default function CguPage() {
  return (
    <main>
      <Section tone="surface" spacing="default">
        <Container size="narrow">
          <h1 className="font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
            Conditions générales d&apos;utilisation
          </h1>

          <div className="mt-10 space-y-10 text-ink-soft">
            <div>
              <h2 className="font-display text-xl text-ink">Objet</h2>
              <p className="mt-3 leading-relaxed">
                Le site {siteConfig.url.replace("https://", "")} présente
                l&apos;activité de {siteConfig.name} et permet de nous contacter
                par téléphone, WhatsApp ou email. La consultation du site vaut
                acceptation des présentes conditions.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink">
                Informations et tarifs
              </h2>
              <p className="mt-3 leading-relaxed">
                Les informations et prix affichés sont indicatifs et peuvent
                évoluer. Seul un devis ou une confirmation par téléphone engage{" "}
                {siteConfig.name}.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink">Disponibilité</h2>
              <p className="mt-3 leading-relaxed">
                Nous nous efforçons de maintenir le site accessible en
                permanence, sans pouvoir le garantir. {siteConfig.name} ne
                saurait être tenu responsable d&apos;une indisponibilité
                temporaire.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink">
                Droit applicable
              </h2>
              <p className="mt-3 leading-relaxed">
                Les présentes conditions sont soumises au droit français. En cas
                de litige, une solution amiable sera recherchée avant toute
                action judiciaire.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
