# site-starter — template CMS du réseau

Template Next.js (App Router) pour instancier un site du réseau en une journée.
Le contenu vit dans Supabase (`seo_pages`, éditées depuis le SEO Dashboard), le
spécifique au site vit dans **un seul fichier** (`lib/config.ts`) et un **skin**
(`app/globals.css` + fontes de `app/layout.tsx`). Le reste est générique : les
corrections se font dans le template, pas dans les copies.

## Principes (non négociables)

- **Le CMS gouverne** : dès qu'une page publiée existe en base, c'est elle qui
  est servie. Le code ne porte que des replis de lancement.
- **Phone-first** : le CTA principal est le téléphone (`tel:`), numéro visible
  above the fold ; WhatsApp pré-rempli et formulaire autorisés en appoint.
- **Anti-footprint** : palette + fontes + variante de hero + ordre des blocs
  uniques par site (docs/SKINS.md).
- **Jamais de 404 sur une URL indexée** : renommage → redirection posée dans le
  dashboard (`redirect_to`, servie en 308) ; produit épuisé → `sold_out`
  (servi, OutOfStock).

## Arborescence

```
lib/config.ts        ← LE fichier à remplir par site (+ data/reviews.ts)
lib/cms.ts           lecture seo_pages (RLS anon, cache par tags)
lib/catalog.ts       module catalogue (product_categories + products)
lib/pages-list.ts    services du code ∪ pages CMS (hub, accueil, footer)
app/[...slug]/       routeur CMS : page publiée → hub → repli config → 308 → 404
app/categorie/ produit/   module catalogue (opt-in via config)
app/api/revalidate/  purge du cache, appelée par le dashboard à la publication
components/blocks/   accueil par blocs (3 variantes de hero)
components/site/     CmsArticle (rendu des pages dashboard), header, footer
skins/               palettes alternatives — voir docs/SKINS.md
docs/NOUVEAU-SITE.md ← checklist d'instanciation pas à pas
```

## Démarrer

```bash
npm install
cp .env.example .env.local   # remplir les clés
npm run dev
```

`NEXT_PUBLIC_INDEXABLE=false` tant que le site n'est pas prêt : robots.txt
bloque tout et les pages portent noindex.
