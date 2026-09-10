/**
 * ═══════════════════════════════════════════════════════════════════
 *  D&L.S MOTORS — nettoyage & esthétique automobile, Perpignan.
 *  Instancié depuis site-starter (remote `template`).
 * ═══════════════════════════════════════════════════════════════════
 *
 * Tout ce qui est spécifique au site vit ici (et dans le skin,
 * app/globals.css + fontes de app/layout.tsx). Le reste du code est
 * générique : les corrections se font dans le template.
 *
 * Champs À VALIDER avant mise en ligne (valeurs reprises du mockup) :
 *   phone / phoneFormatted, url, email, openingHours, cta.points.
 */

export type SchemaType =
  | "LocalBusiness"
  | "AutoRepair"
  | "AutoBodyShop"
  | "AutoDealer"
  | "AutoWash"
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
  /** Visuel de la carte (accueil + hub). */
  image?: ImageRef;
  /** Prix affiché sur la carte (« À partir de 49 € », « Sur devis »). */
  price?: string;
  /** Pastille mise en avant sur la carte (« Le plus populaire »). */
  highlight?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Squelette visuel du hero — varier d'un site à l'autre (anti-footprint).
 *   A — panneau sombre, dégradé, sans image
 *   B — split texte / image
 *   C — clair, image en bandeau
 *   D — photo plein écran sous voile sombre (image optionnelle : dégradé sinon)
 */
export type HeroVariant = "A" | "B" | "C" | "D";

/** Blocs disponibles pour composer l'accueil — l'ordre est libre. */
export type HomeBlock =
  | "hero"
  | "usps"
  | "intro"
  | "services"
  | "catalog"
  | "why"
  | "reviews"
  | "gallery"
  | "faq"
  | "cta";

export interface SiteConfig {
  /** Clé du site dans Supabase (site_profiles.site_key, seo_pages.site_key…). */
  siteKey: string;
  name: string;
  /** Sous-titre du logo texte (header, footer). */
  brandSubtitle?: string;
  /** Logo image ; absent = nom du site en texte. */
  logo?: ImageRef & { width: number; height: number };
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
  /** Tons du chrome — partie du skin (anti-footprint). */
  theme: {
    header: "light" | "dark";
    footer: "light" | "dark";
  };

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
    /** Libellé du bouton téléphone du header (défaut : « Appeler »). */
    headerCta?: string;
  };

  /** Composition de l'accueil — l'ordre des blocs EST le squelette de la page. */
  home: {
    blocks: HomeBlock[];
    hero: {
      variant: HeroVariant;
      badge: string;
      title: string;
      /** Fin du titre rendue en couleur d'accent (« le meilleur »). */
      titleAccent?: string;
      text: string;
      /** Requise pour la variante B ; optionnelle pour C et D. */
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
      /** Arguments en grille (2 × 2). */
      points?: { title: string; body: string }[];
      /** Panneau chiffré — utilisé quand il n'y a pas d'image. */
      stats: { label: string; value: string }[];
      note: string;
      /** Photo du panneau droit (remplace les chiffres). */
      image?: ImageRef;
      /** Citation posée sur la photo. */
      quote?: { text: string; author: string };
    };
    /** Galerie avant / après — rien ne s'affiche sans image. */
    gallery?: {
      badge: string;
      title: string;
      text: string;
      pairs: { before: ImageRef; after: ImageRef }[];
      images: ImageRef[];
      link?: NavItem;
    };
    faq: { q: string; a: string }[];
    cta: {
      badge: string;
      title: string;
      text: string;
      /** Réassurances listées à côté du CTA. */
      points?: string[];
    };
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
  siteKey: "dls",
  name: "D&L.S Motors",
  brandSubtitle: "Nettoyage & esthétique automobile",
  tagline: "Nettoyage auto premium à Perpignan",
  description:
    "Nettoyage et esthétique automobile à Perpignan : nettoyage intérieur, lavage extérieur à la main, formule complète et detailing. À domicile ou sur notre centre.",
  url: "https://dlsmotors.fr",
  phone: "0612345678",
  phoneFormatted: "06 12 34 56 78",
  email: "contact@dlsmotors.fr",
  address: {
    streetAddress: "Perpignan",
    postalCode: "66000",
    addressLocality: "Perpignan",
    addressRegion: "Pyrénées-Orientales",
    addressCountry: "FR",
  },
  openingHours: "Sur rendez-vous, à domicile ou sur notre centre",
  openingHoursSpec: [],
  schema: {
    type: "AutoWash",
    priceRange: "€€",
    areaServed: "Perpignan et alentours (66)",
    geo: { latitude: 42.6887, longitude: 2.8948 },
  },
  knowsAbout: [
    "Nettoyage intérieur de véhicule",
    "Lavage extérieur à la main",
    "Detailing automobile",
    "Traitement céramique",
    "Correction de peinture",
    "Désinfection d'habitacle",
  ],
  ogImage: "/og/og-image.jpg",
  navigation: [
    { label: "Accueil", href: "/" },
    { label: "Nos prestations", href: "/prestations" },
    { label: "Avis clients", href: "/avis" },
    { label: "Contact", href: "/contact" },
  ],
  theme: { header: "dark", footer: "dark" },

  sectionRoot: "prestations",
  sectionLabel: "Nos prestations",
  hub: {
    metaTitle: "Nettoyage auto à Perpignan : nos prestations",
    metaDescription:
      "Nettoyage intérieur, lavage extérieur à la main, formule complète et detailing à Perpignan. À domicile ou sur notre centre, sur rendez-vous.",
    title: "Un soin sur-mesure pour chaque véhicule.",
    intro:
      "Du simple nettoyage à la rénovation complète, D&L.S Motors vous propose des formules adaptées à vos besoins, à domicile ou sur notre centre à Perpignan.",
  },
  services: [
    {
      slug: "nettoyage-interieur-voiture-perpignan",
      title: "Nettoyage intérieur de voiture à Perpignan",
      shortTitle: "Nettoyage intérieur",
      keyword: "nettoyage intérieur voiture perpignan",
      tagline: "Un habitacle propre, sain et désinfecté",
      description:
        "Aspiration, dépoussiérage, nettoyage des plastiques, vitres, sièges, désinfection.",
      badgeLeft: "À domicile ou sur centre",
      badgeRight: "Sur rendez-vous",
      featured: true,
      price: "À partir de 49 €",
      image: {
        src: "/images/prestations/nettoyage-interieur.jpg",
        alt: "Habitacle en cuir noir après nettoyage intérieur",
      },
    },
    {
      slug: "lavage-exterieur-voiture-perpignan",
      title: "Nettoyage extérieur de voiture à Perpignan",
      shortTitle: "Nettoyage extérieur",
      keyword: "lavage voiture à la main perpignan",
      tagline: "Lavage à la main, brillance longue durée",
      description:
        "Lavage à la main, jantes, protection carrosserie, brillance longue durée.",
      badgeLeft: "À domicile ou sur centre",
      badgeRight: "Sur rendez-vous",
      featured: true,
      price: "À partir de 39 €",
      image: {
        src: "/images/prestations/nettoyage-exterieur.jpg",
        alt: "Carrosserie recouverte de mousse pendant un lavage à la main",
      },
    },
    {
      slug: "nettoyage-complet-voiture-perpignan",
      title: "Nettoyage complet de voiture à Perpignan",
      shortTitle: "Formule complète",
      keyword: "nettoyage complet voiture perpignan",
      tagline: "Intérieur + extérieur, comme neuf",
      description:
        "Intérieur + extérieur pour un résultat impeccable, comme neuf.",
      badgeLeft: "À domicile ou sur centre",
      badgeRight: "Sur rendez-vous",
      featured: true,
      price: "À partir de 79 €",
      highlight: "Le plus populaire",
      image: {
        src: "/images/prestations/formule-complete.jpg",
        alt: "Avant de voiture noire brillante après une formule complète",
      },
    },
    {
      slug: "detailing-voiture-perpignan",
      title: "Detailing automobile à Perpignan",
      shortTitle: "Detailing premium",
      keyword: "detailing perpignan",
      tagline: "Rénovation en profondeur de votre véhicule",
      description:
        "Rénovation en profondeur, traitement céramique, correction de peinture.",
      badgeLeft: "Sur notre centre",
      badgeRight: "Devis personnalisé",
      featured: true,
      price: "Sur devis",
      image: {
        src: "/images/prestations/detailing.jpg",
        alt: "Polissage d'une carrosserie à la polisseuse orbitale",
      },
    },
  ],

  labels: {
    serviceBadge: "Nettoyage auto à Perpignan",
    articleBadge: "Conseils",
    serviceCategory: "Nettoyage et esthétique automobile",
    faqTitle: "Tout ce que vous voulez savoir avant de réserver.",
    faqText:
      "Une question qui n'est pas ici ? Appelez-nous, nous prenons le temps d'y répondre.",
    relatedTitle: "À découvrir aussi",
    ctaSecondaryLabel: "Prendre rendez-vous",
    ctaSecondaryHref: "/contact",
    headerCta: "Prendre rendez-vous",
  },

  home: {
    blocks: [
      "hero",
      "usps",
      "services",
      "why",
      "reviews",
      "gallery",
      "faq",
      "cta",
    ],
    hero: {
      variant: "D",
      badge: "Perpignan & alentours",
      title: "Votre véhicule mérite",
      titleAccent: "le meilleur",
      text: "Nettoyage auto premium à Perpignan. Un véhicule plus propre, plus sain, plus valorisé.",
      secondaryLabel: "Voir nos prestations",
      image: {
        src: "/images/hero.jpg",
        alt: "Porsche noire lustrée devant le Castillet au coucher du soleil, Perpignan",
      },
    },
    usps: [
      {
        title: "Résultat haut de gamme",
        body: "Un travail soigné, jusque dans les moindres recoins.",
      },
      {
        title: "Produits éco-responsables",
        body: "Des produits respectueux de votre véhicule et de l'environnement.",
      },
      {
        title: "À domicile ou sur notre centre",
        body: "Nous venons à vous, ou vous nous confiez votre véhicule à Perpignan.",
      },
      {
        title: "Satisfaction garantie",
        body: "Vous repartez avec un véhicule qui vous plaît, sinon on y retourne.",
      },
    ],
    intro: {
      badge: "Notre métier",
      title: "Plus qu'un nettoyage, une nouvelle expérience.",
      paragraphs: [
        "Un véhicule propre, c'est un véhicule plus sain à vivre au quotidien et plus valorisé le jour de la revente.",
        "Choisissez votre formule, nous nous occupons du reste : à domicile ou sur notre centre à Perpignan.",
      ],
    },
    servicesSection: {
      badge: "Nos prestations",
      title: "Un soin sur-mesure pour chaque véhicule.",
      text: "Du simple nettoyage à la rénovation complète, D&L.S Motors vous propose des formules adaptées à vos besoins.",
      othersBadge: "Aussi au programme",
      othersTitle: "Toutes nos prestations.",
    },
    why: {
      badge: "Pourquoi choisir D&L.S Motors ?",
      title: "L'expertise du nettoyage auto à Perpignan.",
      paragraphs: [
        "Une équipe passionnée, un service de qualité et une vraie proximité avec nos clients. Chez D&L.S Motors, chaque véhicule est traité avec le même soin : le vôtre.",
      ],
      points: [
        {
          title: "Service rapide et flexible",
          body: "Un créneau qui s'adapte à votre emploi du temps.",
        },
        {
          title: "Produits haut de gamme",
          body: "Et éco-responsables, sans agresser vos matériaux.",
        },
        {
          title: "À domicile ou sur notre centre",
          body: "À Perpignan et dans les environs.",
        },
        {
          title: "Satisfaction garantie",
          body: "Le résultat compte plus que le chrono.",
        },
      ],
      stats: [],
      note: "Entreprise locale basée à Perpignan.",
      image: {
        src: "/images/equipe.jpg",
        alt: "Membre de l'équipe D&L.S Motors en train de lustrer une carrosserie",
      },
      quote: {
        text: "Des véhicules plus propres pour des routes plus belles.",
        author: "D&L.S Motors",
      },
    },
    gallery: {
      badge: "Résultats concrets",
      title: "Avant / Après",
      text: "Découvrez la différence D&L.S Motors.",
      pairs: [
        {
          before: {
            src: "/images/realisations/siege-avant.jpg",
            alt: "Siège de voiture taché avant nettoyage",
          },
          after: {
            src: "/images/realisations/siege-apres.jpg",
            alt: "Le même siège, propre, après nettoyage",
          },
        },
      ],
      images: [
        {
          src: "/images/realisations/tableau-de-bord.jpg",
          alt: "Tableau de bord nettoyé et rénové",
        },
        {
          src: "/images/realisations/jante.jpg",
          alt: "Jante noire nettoyée et protégée",
        },
      ],
    },
    faq: [
      {
        q: "Vous vous déplacez à domicile ?",
        a: "Oui, à Perpignan et dans les environs. Vous pouvez aussi nous confier votre véhicule sur notre centre à Perpignan.",
      },
      {
        q: "Quels sont vos tarifs ?",
        a: "Le nettoyage intérieur démarre à 49 €, le nettoyage extérieur à 39 € et la formule complète à 79 €. Le detailing se chiffre sur devis, selon l'état du véhicule et le traitement souhaité.",
      },
      {
        q: "Quelle différence entre la formule complète et le detailing ?",
        a: "La formule complète est un nettoyage intérieur et extérieur soigné. Le detailing va plus loin : rénovation en profondeur, correction de peinture et traitement céramique pour protéger la carrosserie durablement.",
      },
      {
        q: "Comment réserver ?",
        a: "Un appel ou un message WhatsApp suffit : nous convenons ensemble de la formule et du créneau, puis nous confirmons tout de suite.",
      },
    ],
    cta: {
      badge: "Prenez rendez-vous",
      title: "Réservez votre nettoyage auto en un appel.",
      text: "Choisissez votre prestation, votre créneau, et profitez d'un véhicule impeccable, sans stress.",
      points: [
        "À domicile ou sur notre centre à Perpignan",
        "Confirmation immédiate par téléphone ou WhatsApp",
        "Modification gratuite jusqu'à 24h avant",
      ],
    },
  },

  blog: {
    title: "Conseils entretien auto",
    metaDescription:
      "Nos conseils pour garder un véhicule propre et bien entretenu entre deux passages chez D&L.S Motors.",
    intro:
      "Ce que nous répondons le plus souvent à nos clients, posé par écrit.",
  },
  contact: {
    title: "Le plus simple ? Nous appeler.",
    text: "Dites-nous quel véhicule, quelle formule et quand : nous confirmons votre créneau tout de suite.",
    whatsappMessage: "Bonjour, je souhaite réserver un nettoyage auto.",
    zoneText:
      "Perpignan et ses alentours, à domicile ou sur notre centre. Au-delà : nous en parlons au téléphone.",
  },
  avis: {
    title: "Ils nous font confiance.",
    metaDescription:
      "Avis de nos clients sur le nettoyage et l'esthétique automobile D&L.S Motors à Perpignan.",
    intro: "Les retours de nos clients, ici comme sur notre fiche Google.",
  },
  legal: {
    activity: "Entreprise de nettoyage et d'esthétique automobile",
  },

  catalog: {
    enabled: false,
    label: "Catalogue",
    sectionTitle: "Nos produits",
    sectionText: "",
    ctaLabel: "Commander",
    soldOutLabel: "Épuisé",
  },
};
