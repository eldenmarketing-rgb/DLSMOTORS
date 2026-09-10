import type { Metadata } from "next";
import { Caveat, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteConfig } from "@/lib/config";
import "./globals.css";

/*
 * ── Fontes du skin ──
 * À CHANGER PAR SITE (anti-footprint : jamais deux sites du réseau avec le
 * même couple de fontes). Garder les noms de variables --font-body et
 * --font-heading : globals.css les consomme avec des piles de repli système,
 * une fonte absente ne cassera jamais l'affichage.
 */
const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const heading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

/* Fonte manuscrite des citations et de la signature du footer. */
const accent = Caveat({
  variable: "--font-accent",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
const indexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";

const siteTitle = `${siteConfig.name} — ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": siteConfig.schema.type,
    "@id": `${siteUrl}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    telephone: `+33${siteConfig.phone.slice(1)}`,
    email: siteConfig.email,
    image: `${siteUrl}${siteConfig.ogImage}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.schema.geo.latitude,
      longitude: siteConfig.schema.geo.longitude,
    },
    priceRange: siteConfig.schema.priceRange,
    areaServed: {
      "@type": "AdministrativeArea",
      name: siteConfig.schema.areaServed,
    },
    knowsAbout: siteConfig.knowsAbout,
    openingHoursSpecification: siteConfig.openingHoursSpec.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: s.dayOfWeek,
      opens: s.opens,
      closes: s.closes,
    })),
  };

  return (
    <html
      lang="fr"
      className={`${body.variable} ${heading.variable} ${accent.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface-50 text-ink">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
