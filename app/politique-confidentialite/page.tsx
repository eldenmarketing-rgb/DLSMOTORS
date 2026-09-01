import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité du site ${siteConfig.name}.`,
  alternates: { canonical: "/politique-confidentialite" },
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main>
      <Section tone="surface" spacing="default">
        <Container size="narrow">
          <h1 className="font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
            Politique de confidentialité
          </h1>

          <div className="mt-10 space-y-10 text-ink-soft">
            <div>
              <h2 className="font-display text-xl text-ink">
                Collecte des données
              </h2>
              <p className="mt-3 leading-relaxed">
                Ce site ne comporte aucun formulaire : nous ne collectons aucune
                donnée personnelle via le site. Le contact se fait par
                téléphone, WhatsApp ou email, à votre initiative. Les
                informations que vous nous communiquez alors (nom, adresse,
                besoin) servent uniquement à répondre à votre demande et à
                établir un devis.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink">
                Cookies et mesure d&apos;audience
              </h2>
              <p className="mt-3 leading-relaxed">
                Ce site ne dépose pas de cookie publicitaire et n&apos;embarque
                pas de traceur tiers. Des données techniques anonymes (pages
                vues, type d&apos;appareil) peuvent être mesurées par
                l&apos;hébergeur à des fins de bon fonctionnement.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink">Vos droits</h2>
              <p className="mt-3 leading-relaxed">
                Conformément au RGPD, vous disposez d&apos;un droit
                d&apos;accès, de rectification et de suppression des données
                vous concernant. Pour l&apos;exercer : {siteConfig.email} ou{" "}
                {siteConfig.phoneFormatted}.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
