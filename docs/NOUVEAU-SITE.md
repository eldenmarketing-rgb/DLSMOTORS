# Checklist — instancier un nouveau site

> Objectif : site en ligne (non indexable) en une journée. Dans l'ordre.

## 1. Base de données (SEO Dashboard)

- [ ] Créer la ligne du site sur `/sites` du dashboard : `site_key`, nom,
      domaine, téléphone, email, `schema_type`, scope/mode, services.
- [ ] `delivery_mode = cms`, `revalidate_url = https://<domaine>/api/revalidate`,
      `revalidate_secret` = valeur forte (la même que l'env du site).
- [ ] Si catalogue : insérer les `product_categories` et `products`
      (`site_key` du site) — migration `migration-products.sql` déjà appliquée.

## 2. Code

- [ ] GitHub → **Use this template** → nouveau repo privé.
- [ ] Remplir `lib/config.ts` (chaque champ, aucun texte de démo ne doit
      survivre) et `data/reviews.ts` (vrais avis uniquement, sinon vide).
- [ ] Skin : palette dans `app/globals.css` (voir `skins/` et docs/SKINS.md),
      fontes dans `app/layout.tsx`, variante de hero + ordre des blocs dans
      `siteConfig.home`. **Jamais deux sites identiques.**
- [ ] Image OG 1200×630 dans `public/og/`, favicon dans `app/`.
- [ ] `npm install && npm run build` vert.

## 3. Vercel

- [ ] Importer le repo, framework Next.js.
- [ ] Variables d'env (Production + Preview) : `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon, jamais la service key),
      `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`,
      `NEXT_PUBLIC_INDEXABLE=false`.
- [ ] Créer le Deploy Hook et le renseigner côté seo-automation (.env
      `VERCEL_DEPLOY_HOOK_<SITE>`) + `site_profiles.vercel_hook_env`.

## 4. DNS

- [ ] Domaine → Vercel (A/CNAME selon registrar), HTTPS vérifié.

## 5. Search Console

- [ ] Créer la propriété (domaine), la partager avec le service account GSC.
- [ ] Renseigner « Domaine GSC » sur `/sites` du dashboard
      (`site_profiles.gsc_domain`).

## 6. Contenu puis go-live

- [ ] Produire les premières pages dans le dashboard (briefs → génération →
      review humaine → publier).
- [ ] Vérifier une page publiée en ligne, le sitemap.xml, une redirection.
- [ ] `NEXT_PUBLIC_INDEXABLE=true` + redeploy → le crawl hebdo et le funnel
      d'indexation prennent le relais.
