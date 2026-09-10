import type { JSX } from "react";
import { Hero } from "@/components/blocks/Hero";
import {
  CtaFinal,
  Gallery,
  HomeFaq,
  Intro,
  ServicesShowcase,
  Usps,
  WhyUs,
} from "@/components/blocks/HomeSections";
import { CatalogHighlights } from "@/components/blocks/CatalogHighlights";
import { ReviewsBlock } from "@/components/blocks/ReviewsBlock";
import { siteConfig, type HomeBlock } from "@/lib/config";

/**
 * Accueil composé par blocs : l'ordre vient de `siteConfig.home.blocks`.
 * Deux sites du réseau ne doivent pas partager le même squelette — varier
 * l'ordre des blocs et la variante de hero fait partie du skin.
 */

export const revalidate = 3600;

const faqSchema =
  siteConfig.home.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: siteConfig.home.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

const BLOCKS: Record<
  HomeBlock,
  () => JSX.Element | Promise<JSX.Element | null> | null
> = {
  hero: () => <Hero />,
  usps: () => <Usps />,
  intro: () => <Intro />,
  services: () => <ServicesShowcase />,
  catalog: () => <CatalogHighlights />,
  why: () => <WhyUs />,
  reviews: () => <ReviewsBlock />,
  gallery: () => <Gallery />,
  faq: () => <HomeFaq />,
  cta: () => <CtaFinal />,
};

export default function HomePage() {
  return (
    <main>
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      {siteConfig.home.blocks.map((block) => {
        const Block = BLOCKS[block];
        return <Block key={block} />;
      })}
    </main>
  );
}
