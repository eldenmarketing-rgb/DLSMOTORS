"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";

const primaryNav = siteConfig.navigation.filter((n) => n.href !== "/");
const dark = siteConfig.theme.header === "dark";

/** Logo image si fourni, sinon le nom du site (et son sous-titre) en texte. */
function Brand() {
  const { logo, name, brandSubtitle } = siteConfig;
  if (logo) {
    return (
      <Image
        src={logo.src}
        alt={logo.alt || name}
        width={logo.width}
        height={logo.height}
        priority
        className="h-9 w-auto sm:h-11"
      />
    );
  }
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`font-display text-2xl tracking-tight ${dark ? "text-surface-50" : "text-ink"}`}
      >
        {name}
      </span>
      {brandSubtitle ? (
        <span
          className={`mt-1 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.16em] sm:text-[10px] sm:tracking-[0.2em] ${dark ? "text-accent-400" : "text-ink-soft"}`}
        >
          {brandSubtitle}
        </span>
      ) : null}
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    detailsRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeMenu = () => {
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b ${
        dark
          ? "border-surface-50/10 bg-primary-900/95 text-surface-50"
          : "border-ink/5 bg-surface-50/95 text-ink"
      }`}
    >
      {/* data-nosnippet : le header (dont le menu mobile) est du boilerplate,
          il ne doit jamais servir d'extrait SERP. */}
      <Container
        size="wide"
        className="flex h-16 items-center justify-between sm:h-20"
        data-nosnippet
      >
        <Link href="/" aria-label={`${siteConfig.name} — accueil`}>
          <Brand />
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul
            className={`flex items-center gap-8 text-sm ${dark ? "text-surface-100/80" : "text-ink-soft"}`}
          >
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors ${dark ? "hover:text-accent-400" : "hover:text-ink"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Règle conversion : le numéro reste joignable au-dessus de la ligne de flottaison. */}
          <Button
            href={`tel:${siteConfig.phone}`}
            size="sm"
            variant="primary"
            className="max-sm:hidden"
          >
            {siteConfig.labels.headerCta ?? "Appeler"}
          </Button>

          <details ref={detailsRef} className="group relative md:hidden">
            <summary
              aria-label="Menu"
              className={`flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md border transition-colors [&::-webkit-details-marker]:hidden ${
                dark
                  ? "border-surface-50/25 text-surface-50 hover:border-surface-50/50 group-open:border-surface-50/60"
                  : "border-ink/15 text-ink hover:border-ink/30 hover:bg-surface-100 group-open:border-ink/40 group-open:bg-surface-100"
              }`}
            >
              <span aria-hidden="true" className="relative block h-4 w-5">
                <span className="absolute left-0 top-0 h-[2px] w-full rounded bg-current transition-transform group-open:top-[7px] group-open:rotate-45" />
                <span className="absolute left-0 top-[7px] h-[2px] w-full rounded bg-current transition-opacity group-open:opacity-0" />
                <span className="absolute left-0 top-[14px] h-[2px] w-full rounded bg-current transition-transform group-open:top-[7px] group-open:-rotate-45" />
              </span>
            </summary>

            <div className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto bg-surface-50 sm:top-20">
              <Container
                size="wide"
                className="flex min-h-full flex-col gap-10 pb-12 pt-8"
              >
                <nav aria-label="Navigation mobile">
                  <ul className="flex flex-col gap-2">
                    {primaryNav.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname?.startsWith(`${item.href}/`);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className={`flex items-center justify-between rounded-2xl border border-ink/8 px-5 py-4 font-display text-xl transition-colors ${
                              isActive
                                ? "border-ink/15 bg-panel text-ink"
                                : "text-ink hover:bg-surface-100"
                            }`}
                          >
                            <span>{item.label}</span>
                            <span aria-hidden="true" className="text-ink-soft">
                              →
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="mt-auto rounded-2xl border border-ink/10 bg-panel p-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-primary-700">
                    Un appel suffit
                  </p>
                  <p className="mt-3 font-display text-2xl text-ink">
                    {siteConfig.phoneFormatted}
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Button
                      href={`tel:${siteConfig.phone}`}
                      variant="primary"
                      size="lg"
                      onClick={closeMenu}
                    >
                      Appeler maintenant
                    </Button>
                    <Button
                      href="/contact"
                      variant="secondary"
                      size="lg"
                      onClick={closeMenu}
                    >
                      Autres moyens de contact
                    </Button>
                  </div>
                </div>
              </Container>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
