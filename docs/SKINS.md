# Skins — différencier chaque site (anti-footprint)

Le code partagé (lib/, routes, schema) est invisible pour Google. Ce qui fait
« réseau détectable », c'est le **visuel** et le **texte**. Le texte est géré
par la génération (profil par site, 60 %+ unique). Le visuel se règle ici.

## Règle

**Jamais deux sites du réseau avec la même combinaison** :

1. **Palette** — bloc `@theme` de `app/globals.css`. Les composants ne
   consomment que des rôles (`surface`, `primary`, `accent`, `panel`, `ink`) :
   remplacer les valeurs suffit. Deux palettes alternatives prêtes dans
   `skins/` (copier-coller le bloc).
2. **Fontes** — `app/layout.tsx` (next/font). Garder les variables
   `--font-body` / `--font-heading` : globals.css a des piles de repli système,
   une fonte cassée ne donnera jamais du Times New Roman.
3. **Variante de hero** — `siteConfig.home.hero.variant` : `A` (panneau sombre),
   `B` (split texte/image), `C` (clair, image en bandeau).
4. **Ordre des blocs** — `siteConfig.home.blocks` : le squelette de l'accueil.
   Ex. artisan : `hero, usps, intro, services, why, reviews, faq, cta` ;
   e-com : `hero, catalog, usps, reviews, faq, cta`.

## Suivi

Tenir la combinaison choisie dans le README du site instancié
(palette / fontes / hero / ordre), et vérifier avant tout lancement qu'aucun
site actif du réseau n'a la même.
