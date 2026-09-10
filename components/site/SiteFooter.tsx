import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/config";
import { listServices } from "@/lib/pages-list";

const dark = siteConfig.theme.footer === "dark";

export async function SiteFooter() {
  const year = new Date().getFullYear();
  // La colonne services suit le CMS : une page publiée depuis le dashboard y
  // entre sans retoucher le code.
  const services = await listServices();
  const discover = siteConfig.navigation.filter(
    (n) => !["/", `/${siteConfig.sectionRoot}`, "/contact"].includes(n.href),
  );
  const nav: Record<string, { href: string; label: string }[]> = {
    [siteConfig.sectionLabel]: services.map((s) => ({
      href: s.href,
      label: s.shortTitle,
    })),
    Découvrir: discover,
    Contact: [
      { href: `tel:${siteConfig.phone}`, label: siteConfig.phoneFormatted },
      { href: "/contact", label: "Nous contacter" },
      { href: `mailto:${siteConfig.email}`, label: siteConfig.email },
    ],
  };

  return (
    <footer
      className={`mt-auto border-t ${
        dark
          ? "border-surface-50/10 bg-primary-900 text-surface-50"
          : "border-ink/5 bg-surface-100 text-ink"
      }`}
    >
      {/* data-nosnippet : empêche Google de construire un extrait SERP
          à partir de la navigation de pied de page au lieu de la meta description. */}
      <Container size="wide" className="py-16" data-nosnippet>
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="inline-flex flex-col leading-none">
              <span className="font-display text-3xl">{siteConfig.name}</span>
              {siteConfig.brandSubtitle ? (
                <span
                  className={`mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] ${dark ? "text-accent-400" : "text-ink-soft"}`}
                >
                  {siteConfig.brandSubtitle}
                </span>
              ) : null}
            </Link>
            <p
              className={`mt-4 max-w-xs text-sm leading-relaxed ${dark ? "text-surface-100/75" : "text-ink-soft"}`}
            >
              {siteConfig.description}
            </p>
            <p
              className={`font-script mt-6 text-2xl ${dark ? "text-accent-300" : "text-ink"}`}
            >
              {siteConfig.tagline}
            </p>
          </div>

          {Object.entries(nav).map(([section, items]) =>
            items.length > 0 ? (
              <div key={section}>
                <h2
                  className={`text-xs font-semibold uppercase tracking-[0.14em] ${dark ? "text-surface-100/60" : "text-ink-soft"}`}
                >
                  {section}
                </h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {items.map((item) => (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className={`transition-colors ${dark ? "text-surface-100/85 hover:text-accent-400" : "text-ink hover:text-primary-700"}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        </div>

        <div
          className={`mt-14 flex flex-col gap-4 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between ${
            dark
              ? "border-surface-50/10 text-surface-100/60"
              : "border-ink/10 text-ink-soft"
          }`}
        >
          <p>
            © {year} {siteConfig.name}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/mentions-legales" className="hover:text-accent-400">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-accent-400">
              Confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-accent-400">
              CGU
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
