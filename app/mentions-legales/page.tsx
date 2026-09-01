import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${siteConfig.name}.`,
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <main>
      <Section tone="surface" spacing="default">
        <Container size="narrow">
          <h1 className="font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]">
            Mentions légales
          </h1>

          <div className="mt-10 space-y-10 text-ink-soft">
            <div>
              <h2 className="font-display text-xl text-ink">Éditeur du site</h2>
              <p className="mt-3 leading-relaxed">
                <strong>{siteConfig.name}</strong>
                <br />
                {siteConfig.legal.activity}
                <br />
                {siteConfig.address.postalCode}{" "}
                {siteConfig.address.addressLocality}
                <br />
                {/* TODO: compléter SIRET, forme juridique et adresse complète avant mise en ligne */}
                Téléphone : {siteConfig.phoneFormatted}
                <br />
                Email : {siteConfig.email}
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink">Hébergement</h2>
              <p className="mt-3 leading-relaxed">
                Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133,
                Covina, CA 91723, États-Unis — vercel.com.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink">
                Propriété intellectuelle
              </h2>
              <p className="mt-3 leading-relaxed">
                L&apos;ensemble des contenus de ce site (textes, images, logo)
                est la propriété de {siteConfig.name}, sauf mention contraire.
                Toute reproduction sans autorisation préalable est interdite.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink">Responsabilité</h2>
              <p className="mt-3 leading-relaxed">
                Les informations publiées sont fournies à titre indicatif et
                peuvent évoluer. Pour toute question, contactez-nous au{" "}
                {siteConfig.phoneFormatted}.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
