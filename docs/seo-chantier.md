# SEO haythi.mg — prochain chantier

Date : 2026-11-09  
Statut : à faire  
Site : landing Vite + React, une seule URL (`https://haythi.mg/`)

Le socle on-page est déjà en place : `index.html` (title, description, canonical, robots, Open Graph, JSON-LD), `public/robots.txt`, `public/sitemap.xml`, repli `<noscript>`, `src/components/SeoHead.tsx`. Ce chantier ne refait pas ces balises. Il corrige ce qui empêche le site de se positionner.

## Constat

Google ne peut classer qu’une URL. Le sitemap ne liste que `/`. Les ancres (`#services`, `#work`, `#contact`) ne sont pas des pages.

Le `<title>` porte « Consultant IT Freelance — Développement Web, Conseil SI & Architecture ». Le `<h1>` (`src/components/Hero.tsx`) porte « EXPERTISE IT & CONSULTING ». Les titres de section (`NODES_DÉPLOYÉS`, `PROTOCOL_02`) ne correspondent à aucune requête.

`hreflang` fr et en pointent vers la même URL (`index.html`). Le bouton de langue écrit dans `localStorage` (`src/i18n.tsx`). Le robot ne voit que le français du HTML initial. L’anglais n’est pas une page.

Le JSON-LD déclare `areaServed: Worldwide`. Le domaine est `.mg`, le contact indique Antananarivo (`src/components/Contact.tsx`). Le signal géographique se contredit.

Le HTML livré sans JavaScript se limite au bloc `<noscript>` de `index.html`. Le reste (services, projets) n’existe qu’après exécution du bundle. Pas de prérendu.

Les deux projets (`src/components/Portfolio.tsx`) tiennent en une phrase. Images hors domaine (`lh3.googleusercontent.com`). Image Open Graph = icône 512 px.

Requêtes tenables : freelance + spécialité + Madagascar / remote francophone. « Consultant IT » et « développement web » seuls sont tenus par Malt, LinkedIn et les ESN.

## Décisions retenues pour ce chantier

1. **Français uniquement.** Pas de routes `/en` dans ce passage. Retirer `hreflang` en et `og:locale:alternate`. Garder `hreflang` fr + `x-default` vers `https://haythi.mg/`. L’anglais reste un chantier ultérieur, avec de vraies URLs et du HTML servi tel quel.
2. **Une URL par intention**, pas un enrichissement de la landing seule.
3. **HTML complet au build** pour chaque URL publique. `curl` sans JavaScript doit montrer le H1 et le corps.
4. **Faits seulement** sur les projets. Pas de métriques inventées. Si le détail manque, la page dit le problème, la stack et le livrable connus, rien de plus.
5. **Ton actuel conservé** (terminal / protocole) dans le corps. Le H1 et le `<title>` restent en langue naturelle, lisibles tels quels dans les résultats Google.

## Pages à créer

| URL | Requête visée | H1 (base) |
|-----|----------------|-----------|
| `/` | consultant IT freelance Antananarivo / remote | Consultant IT freelance à Antananarivo |
| `/developpement-web` | développement web React, Next.js, Symfony | Développement web |
| `/conseil-audit-si` | conseil et audit SI | Conseil et audit SI |
| `/architecture-si` | architecture applicative | Architecture SI |
| `/management-projets-it` | pilotage Agile / PMP | Management de projets IT |
| `/projets/electracker` | étude de cas | Electracker |
| `/projets/piggyback` | étude de cas | Piggyback |

Chaque page service : 400–800 mots utiles, un seul H1, title et meta description propres, canonical absolu, lien vers `/#contact` (ou la section contact conservée sur l’accueil).

Chaque étude de cas : contexte, problème, stack, ce qui a été livré, lien vers le site client s’il existe et s’il est public. Pas de page si le contenu ne dépasse pas le paragraphe actuel : dans ce cas, allonger le texte sur l’accueil et reporter l’URL.

L’accueil garde le parcours actuel (stats, services, méthode, projets, contact, privacy). Les cartes services et projets deviennent des liens vers ces URLs. Le H1 d’accueil change ; le paragraphe sous le H1 garde la précision technique.

Hors de ce chantier : page « management » seulement si le texte est écrit. Les quatre offres existent déjà dans `src/components/Services.tsx` ; les textes de page sont à rédiger, pas à générer en remplissage.

## Ordre de travail

### 1. Routes et prérendu

- Introduire un routeur (aujourd’hui `src/App.tsx` rend une seule page).
- Au build, émettre un `index.html` par route dans `dist/`, avec le contenu dans le HTML.
- Conserver le rendu client pour la navigation.
- `SeoHead` doit poser title, description et canonical **par route**, y compris dans le HTML prérendu (pas seulement dans un `useEffect`).

Piste technique : React Router + prérendu Vite. Le critère est le HTML dans `dist/`, pas le nom du plugin.

### 2. Contenu et maillage

- Réécrire le H1 d’accueil.
- Rédiger les pages du tableau.
- Liens internes : accueil → pages service → études de cas → contact.
- Fil d’Ariane texte simple sur les pages intérieures.
- Aligner le `<noscript>` de l’accueil sur le nouveau H1, ou le retirer une fois le prérendu en place.

### 3. Signaux techniques

Fichiers : `index.html`, `public/sitemap.xml`, `public/robots.txt`, JSON-LD.

- Sitemap : toutes les URL publiques, `<lastmod>` à la date du déploiement.
- JSON-LD : `PostalAddress` (Antananarivo, MG), `areaServed` Madagascar et remote, `Person` lié au `ProfessionalService`.
- `sameAs` : uniquement les profils réels (LinkedIn, Malt, GitHub). Omettre la clé si l’URL n’existe pas.
- Image Open Graph 1200×630, fichier sous `public/`, URL absolue `https://haythi.mg/...`. Carte Twitter `summary_large_image`.
- Héberger les visuels projets sur le domaine. `alt` = sujet du visuel, pas seulement le nom de code.
- Retirer `<meta name="keywords">` (ignoré).
- `robots.txt` : laisser `Allow: /` et l’URL du sitemap. L’admin reste `noindex` (`admin/index.html`).

### 4. Vérification avant mise en ligne

- `npm run build`, puis ouvrir chaque `dist/**/index.html` : un H1, le texte de la page, canonical correct.
- Pas de `hreflang` en.
- Lighthouse ou équivalent sur l’accueil : le texte principal est dans le HTML, pas derrière le canvas.
- Search Console : propriété `haythi.mg`, sitemap soumis, inspection de `/` et d’une page intérieure. À faire par l’opérateur au déploiement (accès Google requis).

## Hors code (opérateur)

À faire en parallèle, sinon les pages nouvelles n’ont pas de popularité :

- Google Search Console + sitemap.
- Fiche Google Business Profile si les missions locales à Antananarivo sont réelles. Nom, ville et URL identiques au site.
- Même nom et même URL sur LinkedIn, Malt, GitHub.
- Lien depuis les sites clients quand c’est possible.

Mesure : attendre 4 à 6 semaines, lire les requêtes Search Console, ajuster les pages qui s’affichent sans clic.

## Hors périmètre

- Routes anglaises et `hreflang` bilingue.
- Blog ou articles sans requête identifiée.
- Refonte visuelle.
- Achat de liens, faux avis, bourrage de mots-clés.
- Balise `keywords`.

## Fichiers concernés

- `index.html` — head statique, JSON-LD, noscript
- `public/sitemap.xml`, `public/robots.txt`
- `src/App.tsx` — routes
- `src/components/SeoHead.tsx` — meta par route, y compris au prérendu
- `src/components/Hero.tsx` — H1
- `src/components/Services.tsx`, `src/components/Portfolio.tsx` — liens vers les pages
- `src/i18n.tsx` — clés SEO accueil ; pages service en français d’abord
- `package.json` — dépendance routeur / prérendu
- nouvelles pages sous `src/` (une par URL du tableau)

## Terminé quand

- Chaque URL du tableau répond en HTML statique avec son H1, son title et son canonical.
- Le sitemap les contient toutes.
- Le H1 d’accueil et le title décrivent la même offre.
- Plus de `hreflang` anglais vers `/`.
- Le JSON-LD porte Antananarivo / MG, pas « Worldwide » seul.
- L’admin reste `noindex`.
