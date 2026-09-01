/**
 * ═══════════════════════════════════════════════════════════════════
 *  LE fichier à remplir pour instancier un site.
 * ═══════════════════════════════════════════════════════════════════
 *
 * Tout ce qui est spécifique au site vit ici (et dans le skin,
 * app/globals.css). Le reste du code est générique et ne devrait pas
 * être modifié : les corrections se font dans le template et se
 * propagent aux prochains sites.
 *
 * Les valeurs ci-dessous sont celles du site de démonstration
 * (`siteKey: "starter-demo"`) : elles montrent le format attendu.
 * Checklist complète d'instanciation : docs/NOUVEAU-SITE.md.
 */

export type SchemaType =
  | "LocalBusiness"
  | "AutoRepair"
  | "AutoBodyShop"
  | "AutoDealer"
  | "HealthAndBeautyBusiness"
  | "TaxiService"
  | "Restaurant"
  | "FoodEstablishment"
  | "HomeAndConstructionBusiness"
  | "Electrician"
  | "Plumber"
  | "HVACBusiness"
  | "MovingCompany"
  | "ProfessionalService"
  | "Store";

export interface ImageRef {
  src: string;
  alt: string;
}

/**
 * Un service écrit dans le code — utile pour lancer un site avant que le CMS
 * n'ait de contenu. Dès qu'une page CMS publiée porte le même slug (sous
 * `sectionRoot`), c'est elle qui gouverne. Un site 100 % CMS laisse ce
 * tableau vide.
 */
export interface ServiceDef {
  slug: string;
  title: string;
  shortTitle: string;
  /** Requête cible principale (documentaire — le SEO se pilote dans le dashboard). */
  keyword: string;
  tagline: string;
  description: string;
  /** Étiquette gauche de la carte (ex. zone : « Tout le 66 »). */
  badgeLeft: string;
  /** Étiquette droite de la carte (ex. « Devis gratuit »). */
  badgeRight: string;
  featured?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

/** Squelette visuel du hero — varier d'un site à l'autre (anti-footprint). */
export type HeroVariant = "A" | "B" | "C";

/** Blocs disponibles pour composer l'accueil — l'ordre est libre. */
export type HomeBlock =
  | "hero"
  | "usps"
  | "intro"
  | "services"
  | "catalog"
  | "why"
  | "reviews"
  | "faq"
  | "cta";

export interface SiteConfig {
  /** Clé du site dans Supabase (site_profiles.site_key, seo_pages.site_key…). */
  siteKey: string;
  name: string;
  tagline: string;
  description: string;
  /** URL canonique de production, sans slash final. */
  url: string;
  /** Format tel: (0787180618). */
  phone: string;
  phoneFormatted: string;
  email: string;
  address: {
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  /** Affiché aux visiteurs (« Lundi – Samedi : 8h – 19h »). */
  openingHours: string;
  /** Version structurée pour le JSON-LD. */
  openingHoursSpec: { dayOfWeek: string[]; opens: string; closes: string }[];
  schema: {
    type: SchemaType;
    priceRange: string;
    areaServed: string;
    geo: { latitude: number; longitude: number };
  };
  /** Sujets d'expertise (JSON-LD knowsAbout). */
  knowsAbout: string[];
  /** Image OpenGraph (1200×630) dans /public. */
  ogImage: string;
  navigation: NavItem[];

  /**
   * Rubrique des pages service : les pages CMS publiées sous
   * `<sectionRoot>/<slug>` sont listées dans le hub `/<sectionRoot>`,
   * l'accueil et le footer.
   */
  sectionRoot: string;
  sectionLabel: string;
  hub: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
  };
  services: ServiceDef[];

  /** Textes des gabarits partagés (pages CMS, 404…). */
  labels: {
    /** Badge du hero des pages service CMS (« Débarras dans le 66 »). */
    serviceBadge: string;
    /** Badge du hero des articles de blog. */
    articleBadge: string;
    /** Catégorie du schema Service. */
    serviceCategory: string;
    faqTitle: string;
    faqText: string;
    relatedTitle: string;
    /** CTA secondaire des pages (à côté d'« Appeler »). */
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
  };

  /** Composition de l'accueil — l'ordre des blocs EST le squelette de la page. */
  home: {
    blocks: HomeBlock[];
    hero: {
      variant: HeroVariant;
      badge: string;
      title: string;
      text: string;
      /** Requise pour les variantes B et C. */
      image?: ImageRef;
      secondaryLabel: string;
    };
    usps: { title: string; body: string }[];
    intro: { badge: string; title: string; paragraphs: string[] };
    servicesSection: {
      badge: string;
      title: string;
      text: string;
      othersBadge: string;
      othersTitle: string;
    };
    why: {
      badge: string;
      title: string;
      paragraphs: string[];
      stats: { label: string; value: string }[];
      note: string;
    };
    faq: { q: string; a: string }[];
    cta: { badge: string; title: string; text: string };
  };

  blog: { title: string; metaDescription: string; intro: string };
  contact: {
    title: string;
    text: string;
    /** Message pré-rempli WhatsApp (seul usage autorisé de WhatsApp). */
    whatsappMessage: string;
    zoneText: string;
  };
  avis: { title: string; metaDescription: string; intro: string };
  legal: {
    /** Ligne d'activité des mentions légales (« Entreprise de débarras… »). */
    activity: string;
  };

  /** Module catalogue (tables Supabase product_categories + products). */
  catalog: {
    enabled: boolean;
    label: string;
    sectionTitle: string;
    sectionText: string;
    ctaLabel: string;
    soldOutLabel: string;
  };
}

export const siteConfig: SiteConfig = {
  siteKey: "starter-demo",
  name: "Artisan Démo",
  tagline: "Le site de démonstration du template — à remplacer entièrement",
  description:
    "Site de démonstration du template CMS. Chaque texte de ce fichier doit être réécrit pour le site instancié : c'est le seul fichier à remplir.",
  url: "https://exemple.fr",
  phone: "0400000000",
  phoneFormatted: "04 00 00 00 00",
  email: "contact@exemple.fr",
  address: {
    streetAddress: "Perpignan",
    postalCode: "66000",
    addressLocality: "Perpignan",
    addressRegion: "Pyrénées-Orientales",
    addressCountry: "FR",
  },
  openingHours: "Lundi – Samedi : 8h – 19h",
  openingHoursSpec: [
    {
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "19:00",
    },
  ],
  schema: {
    type: "LocalBusiness",
    priceRange: "€€",
    areaServed: "Perpignan et Pyrénées-Orientales (66)",
    geo: { latitude: 42.6887, longitude: 2.8948 },
  },
  knowsAbout: [
    "Service exemple un",
    "Service exemple deux",
    "Service exemple trois",
  ],
  ogImage: "/og/og-image.jpg",
  navigation: [
    { label: "Accueil", href: "/" },
    { label: "Nos services", href: "/prestations" },
    { label: "Avis", href: "/avis" },
    { label: "Contact", href: "/contact" },
  ],

  sectionRoot: "prestations",
  sectionLabel: "Nos services",
  hub: {
    metaTitle: "Nos services à Perpignan (66)",
    metaDescription:
      "Tous nos services à Perpignan et dans les Pyrénées-Orientales. Devis gratuit, intervention rapide.",
    title: "Tous nos services à Perpignan.",
    intro:
      "Nous intervenons dans tout le 66 avec devis gratuit et intervention rapide. Décrivez votre besoin au téléphone, nous nous occupons du reste.",
  },
  services: [
    {
      slug: "service-exemple-perpignan",
      title: "Service exemple",
      shortTitle: "Service exemple",
      keyword: "service exemple perpignan",
      tagline: "Une phrase d'accroche qui donne envie d'appeler",
      description:
        "Deux ou trois phrases qui décrivent la prestation, la zone couverte et ce qui la différencie. C'est le texte de la carte, pas celui de la page.",
      badgeLeft: "Tout le 66",
      badgeRight: "Devis gratuit",
      featured: true,
    },
  ],

  labels: {
    serviceBadge: "À Perpignan et dans le 66",
    articleBadge: "Le blog",
    serviceCategory: "Services aux particuliers",
    faqTitle: "Tout ce que vous voulez savoir avant de nous appeler.",
    faqText:
      "Une question qui n'est pas ici ? Appelez-nous, nous prenons le temps d'y répondre.",
    relatedTitle: "À découvrir aussi",
    ctaSecondaryLabel: "Demander un devis gratuit",
    ctaSecondaryHref: "/contact",
  },

  home: {
    blocks: [
      "hero",
      "usps",
      "intro",
      "services",
      "catalog",
      "why",
      "reviews",
      "faq",
      "cta",
    ],
    hero: {
      variant: "A",
      badge: "Artisan Démo · Perpignan & 66",
      title: "Le titre principal du site, avec la requête cible dedans.",
      text: "Deux phrases qui disent ce que fait l'entreprise, où, et pourquoi appeler maintenant. Devis gratuit, intervention rapide.",
      secondaryLabel: "Voir nos services",
    },
    usps: [
      {
        title: "Devis gratuit",
        body: "Évaluation sans engagement, au téléphone ou sur place.",
      },
      {
        title: "Intervention rapide",
        body: "Nous intervenons vite, dans tout le département.",
      },
      { title: "Prix justes", body: "Un tarif annoncé avant, respecté après." },
      {
        title: "Artisan local",
        body: "Une entreprise du 66, joignable directement.",
      },
    ],
    intro: {
      badge: "Notre métier",
      title: "Un paragraphe pilier qui pose le sujet du site.",
      paragraphs: [
        "Premier paragraphe : le problème du visiteur, formulé avec ses mots, et la promesse de l'entreprise.",
        "Deuxième paragraphe : comment ça se passe concrètement, et ce que le client récupère à la fin.",
      ],
    },
    servicesSection: {
      badge: "Nos services phares",
      title: "Les interventions les plus demandées.",
      text: "Nos prestations principales — toujours avec devis gratuit.",
      othersBadge: "Aussi au programme",
      othersTitle: "Tous nos services.",
    },
    why: {
      badge: "Pourquoi nous",
      title: "Un seul interlocuteur, un travail soigné.",
      paragraphs: [
        "Paragraphe qui lève les freins : pas de mauvaise surprise, une équipe équipée, un résultat propre.",
        "Paragraphe qui pousse à l'action : l'évaluation est gratuite, autant appeler.",
      ],
      stats: [
        { label: "Devis", value: "Gratuit" },
        { label: "Délai", value: "Rapide" },
        { label: "Zone", value: "Tout le 66" },
        { label: "Engagement", value: "Aucun" },
      ],
      note: "Une ligne de réassurance qui conclut le panneau.",
    },
    faq: [
      {
        q: "Une question que les clients posent vraiment au téléphone ?",
        a: "La réponse, concrète et honnête, en deux ou trois phrases.",
      },
      {
        q: "Combien ça coûte ?",
        a: "La fourchette ou la logique de prix, sans langue de bois.",
      },
    ],
    cta: {
      badge: "Devis gratuit",
      title: "Un projet, une question ?",
      text: "Appelez-nous, décrivez votre situation. Nous vous répondons tout de suite, et le devis est gratuit.",
    },
  },

  blog: {
    title: "Le blog — nos conseils",
    metaDescription:
      "Les conseils de l'équipe : ce que nous répondons le plus souvent au téléphone, posé par écrit.",
    intro:
      "Ce que nous répondons le plus souvent au téléphone, posé par écrit.",
  },
  contact: {
    title: "Le plus simple ? Nous appeler.",
    text: "Décrivez-nous votre besoin : nous vous répondons tout de suite et le devis est gratuit, sans engagement.",
    whatsappMessage: "Bonjour, je souhaiterais un devis.",
    zoneText:
      "Perpignan et son agglomération, et l'ensemble des Pyrénées-Orientales. Au-delà : nous en parlons au téléphone.",
  },
  avis: {
    title: "La confiance de nos clients du 66.",
    metaDescription:
      "Avis et témoignages de nos clients à Perpignan et dans les Pyrénées-Orientales.",
    intro: "Les retours de nos clients, ici comme sur notre fiche Google.",
  },
  legal: {
    activity: "Entreprise de services aux particuliers",
  },

  catalog: {
    enabled: true,
    label: "Catalogue",
    sectionTitle: "Notre catalogue",
    sectionText: "Nos produits, livrés ou disponibles sur simple appel.",
    ctaLabel: "Commander",
    soldOutLabel: "Épuisé",
  },
};
