# D&L.S Motors — nettoyage & esthétique automobile, Perpignan

Site instancié depuis [site-starter](https://github.com/eldenmarketing-rgb/site-starter)
(remote git `template`). Contenu des pages dans Supabase (`seo_pages`,
`site_key = dls`), édité depuis le SEO Dashboard. Tout le spécifique au site
est dans `lib/config.ts`, `data/reviews.ts` et le skin.

## Skin (anti-footprint — combinaison unique dans le réseau)

| Élément | Choix |
|---|---|
| Palette | « atelier premium » : charbon (`primary`), or (`accent`, texte sombre dessus via `on-accent`), neutres chauds (`surface`) |
| Fontes | Outfit (titres) · Plus Jakarta Sans (texte) · Caveat (citations, signature du footer) |
| Hero | variante **D** — photo plein écran sous voile sombre (dégradé tant que `home.hero.image` n'est pas posée) |
| Chrome | header et footer sombres (`theme.header` / `theme.footer`) |
| Blocs | hero · usps · services · why · reviews · gallery · faq · cta |

## Ajouts par rapport au template (à reporter dans site-starter)

- Hero variante `D` + `titleAccent` (fin de titre en couleur d'accent).
- `ServiceDef.image` / `price` / `highlight` : cartes de prestation avec visuel,
  prix et pastille ; grille 4 colonnes dès 4 services phares.
- `home.why.points` / `image` / `quote` : arguments en grille + photo avec citation.
- Bloc `gallery` (avant / après + vignettes) — masqué sans image.
- `home.cta.points` : réassurances listées à côté du CTA final.
- `theme.header` / `theme.footer` (`light` | `dark`), `brandSubtitle`, `logo`,
  `labels.headerCta`.
- Token `--color-on-accent` (texte posé sur l'accent) consommé par `Button` et
  `ProductCard`, `--font-script` / `.font-script`.
- `SchemaType` accepte `AutoWash`.

## À faire avant mise en ligne

- Remplacer les images de `public/images/` (découpes du mockup, voir le README
  du dossier) et poser `home.hero.image`.
- Valider dans `lib/config.ts` : téléphone (06 12 34 56 78 = valeur du mockup),
  domaine, email, horaires, réassurances du CTA.
- `data/reviews.ts` : vrais avis Google uniquement (vide tant qu'il n'y en a pas).
- Vercel : variables d'env (`.env.example`), deploy hook, DNS ; puis
  `NEXT_PUBLIC_INDEXABLE=true`.

## Démarrer

```bash
npm install
cp .env.example .env.local   # remplir les clés
npm run dev
```
