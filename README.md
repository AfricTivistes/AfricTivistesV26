# AfricTivistes V2026

Site web officiel d'**AfricTivistes — Ligue des Cybercitoyens Africains**, une organisation panafricaine de civic tech qui promeut la démocratie numérique et la participation citoyenne à travers l'Afrique.

Construit avec **Astro 6** en mode SSR, ce projet est une refonte complète orientée performance, accessibilité et bilingualisme (français / anglais).

---

## Table des matières

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Commandes de développement](#commandes-de-développement)
- [Structure du projet](#structure-du-projet)
- [Architecture](#architecture)
  - [SSR \& Rendu](#ssr--rendu)
  - [Internationalisation (i18n)](#internationalisation-i18n)
  - [CMS éditorial — Decap CMS](#cms-éditorial--decap-cms)
  - [Intégration WordPress](#intégration-wordpress)
  - [Proxy des médias WordPress](#proxy-des-médias-wordpress)
  - [Composants \& UI](#composants--ui)
  - [Animations](#animations)
- [Thématiques](#thématiques)
- [Déploiement](#déploiement)
- [Conventions](#conventions)
- [Réutiliser cette architecture](#réutiliser-cette-architecture)

---

## Aperçu

AfricTivistes intervient sur cinq axes stratégiques : innovation technologique, démocratie et gouvernance, engagement citoyen, résilience médiatique, et formation. Le site regroupe :

- Un blog multilingue alimenté par un CMS WordPress
- Des pages de présentation des thématiques et des projets
- Une bibliothèque de publications, ressources et vidéos
- Des formulaires de contact et d'adhésion
- Des statistiques et témoignages d'impact
- Une **interface d'administration** (Decap CMS) pour éditer tous les textes FR/EN sans toucher au code

---

## Stack technique

| Catégorie | Technologie |
|---|---|
| Framework | [Astro 6](https://astro.build) (SSR, `output: "server"`) |
| Adapter | `@astrojs/netlify` |
| UI interactif | React 18 (islands via `client:only="react"`) |
| Styles | Tailwind CSS 4 (config CSS-first via `@tailwindcss/vite`, `@theme` dans `src/index.css`) |
| Composants UI | shadcn/ui (Radix UI + `class-variance-authority`) |
| Données distantes | TanStack Query (React Query v5) |
| Animations | Framer Motion (`LazyMotion`) |
| CMS éditorial | Decap CMS 3 + Netlify Identity / Git Gateway |
| CMS contenus | WordPress REST API (hôte via `PUBLIC_WP_HOST`) |
| Notifications | Sonner |
| Thème | next-themes |
| Icônes | Lucide React |
| Typage | TypeScript (strict) |

> **Note** — il n'y a ni React Hook Form, ni Zod, ni Recharts, ni Embla dans ce
> projet. Les formulaires sont gérés en HTML natif + POST vers Netlify /
> Infomaniak. Aucun script de test ni de lint n'est configuré.

---

## Prérequis

- **Node.js** ≥ 22 (valeur utilisée par Netlify, cf. `netlify.toml`)
- **npm** ≥ 10
- Accès à une instance WordPress (URL renseignée via `PUBLIC_WP_HOST`)

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/AfricTivistes/AfricTivistesV26.git
cd AfricTivistesV26

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# puis renseigner PUBLIC_WP_HOST et les autres valeurs dans .env
```

> Les secrets et URLs de back-office sont chargés depuis `.env` (ignoré par git).
> Voir `.env.example` pour la liste des variables attendues :
> `PUBLIC_WP_HOST`, `WORDPRESS_USERNAME`, `WORDPRESS_APP_PASSWORD`,
> `PUBLIC_INFOMANIAK_NEWSLETTER_*`, et `PUBLIC_GTM_ID` (optionnel).

---

## Commandes de développement

```bash
npm run dev        # Serveur de développement
npm run typecheck  # Vérification des types (astro check)
npm run build      # Build de production
npm run preview    # Prévisualisation du build

npm run cms:check      # Cohérence JSON ↔ configs Decap ↔ i18n.tsx
npm run cms:gen        # Régénère les champs Decap depuis les JSON
npm run cms:gen:check  # Échoue si les configs sont désynchronisées (CI)
```

---

## Structure du projet

```
africtivistes-V2026-astro/
├── public/
│   ├── admin/                  # Interface Decap CMS
│   │   ├── index.html          # Boot manuel du CMS + choix de config par rôle
│   │   ├── config-full.yml     # Config admin (24 fichiers éditables)
│   │   └── config-restricted.yml # Config éditeur (17 fichiers, sous-ensemble)
│   ├── uploads/                # Médias uploadés via le CMS
│   ├── fonts/                  # Polices auto-hébergées
│   ├── _redirects              # Proxy /wp-uploads, redirections legacy, alias /admin
│   ├── _headers                # Cache long assets + SWR sur les pages SSR
│   └── *.webp, *.svg           # Assets statiques
├── src/
│   ├── assets/                 # Images optimisées (AVIF, WebP)
│   ├── components/
│   │   ├── ui/                 # Primitives shadcn/ui
│   │   ├── astro/              # Composants Astro partagés (Reveal.astro)
│   │   ├── about|history|values|join|blog|posts|
│   │   │   initiatives|projet|resources|thematique/
│   │   └── *.tsx / *.astro     # Navbar, Footer, Hero…
│   ├── data/
│   │   ├── translations/       # 18 fichiers JSON FR/EN éditables via le CMS
│   │   ├── thematiques/        # 5 axes (JSON bilingue, éditables via le CMS)
│   │   ├── thematiques.ts      # Types et exports
│   │   ├── testimonials.json   # Témoignages (CMS)
│   │   └── playlists.json      # Playlists YouTube (CMS, avec épinglage)
│   ├── hooks/                  # use-mobile, use-toast, use-wordpress, use-youtube
│   ├── integrations/
│   │   └── strip-control-chars.ts  # Intégration Astro : nettoyage post-build
│   ├── layouts/
│   │   └── BaseLayout.astro    # Shell commun (SEO, hreflang, GTM, Identity)
│   ├── lib/
│   │   ├── i18n.tsx            # Runtime i18n : agrège les JSON → t(key, lang)
│   │   ├── providers/          # withI18n, withI18nMotion, withI18nQueryMotion
│   │   ├── wordpress.ts        # Client API WordPress (~1300 lignes)
│   │   ├── youtube.ts          # Intégration playlists YouTube
│   │   ├── query-client.ts     # Configuration TanStack Query
│   │   ├── router-shim.tsx     # Utilitaires de navigation
│   │   ├── hero-image.ts       # Sélection d'image de hero
│   │   ├── thematique-style.ts # Styles par thématique
│   │   └── utils.ts            # Helpers généraux
│   ├── pages/
│   │   ├── index.astro         # Redirection → /fr/
│   │   ├── 404.astro
│   │   ├── fr/                 # Routes françaises (20 fichiers)
│   │   └── en/                 # Routes anglaises (20 fichiers, miroir)
│   └── index.css               # Tailwind 4 (@import + @theme) + variables CSS
├── functions-additions.php     # Code à déposer dans le thème WordPress (CPT, ACF, REST)
├── astro.config.mjs
├── netlify.toml
└── AGENTS.md                   # Documentation interne pour les agents/développeurs
```

---

## Architecture

### SSR & Rendu

Le site tourne en **mode SSR** (`output: "server"`) avec l'adaptateur **Netlify**. Chaque requête génère la page côté serveur, ce qui permet le fetch des données WordPress au moment du rendu, l'injection de données pour l'hydratation client, et la gestion des 404 dynamiques.

Les composants `.astro` sont rendus sans JavaScript client. Les composants React interactifs sont montés via `client:only="react"` uniquement là où l'interactivité est nécessaire. Le **prefetch** est activé globalement (`prefetchAll`, stratégie `hover`).

Deux mécanismes de robustesse spécifiques :

- **`src/integrations/strip-control-chars.ts`** — intégration Astro qui, en post-build, supprime les octets NUL/C0 injectés par React 18 SSR aux frontières de chunks UTF-8.
- **`devWpUploadsProxy`** (dans `astro.config.mjs`) — plugin Vite `apply: "serve"` qui court-circuite l'émulation `_redirects` en dev pour éviter `ERR_CONTENT_DECODING_FAILED` sur les images WordPress gzippées.

### Internationalisation (i18n)

Le site supporte **deux langues** : français (`/fr/`) et anglais (`/en/`).

Le système i18n est **maison** et **piloté par les données** — il n'y a pas de dictionnaire codé en dur :

1. Le contenu vit dans **18 fichiers JSON** sous `src/data/translations/`.
2. Chaque fichier est structuré en groupes `_grp_*`, et chaque valeur traduisible est un objet par langue : `{ "fr": "…", "en": "…" }`. Les images utilisent des clés `_img_*`.
3. `src/lib/i18n.tsx` importe ces fichiers, les aplatit en un lookup unique, et expose :
   - `t(key, lang)` pour les fichiers `.astro`
   - `useI18n().t(key)` pour les islands React (via `I18nContext`)
   - `extractImages(section)` pour récupérer les valeurs `_img_*`
4. Les HOC `withI18n` / `withI18nMotion` / `withI18nQueryMotion` (`src/lib/providers/`) montent le provider autour des islands de haut niveau.

`BaseLayout.astro` injecte les balises `hreflang` FR/EN pour le SEO multilingue.

**Conséquence importante** : ajouter une chaîne de texte ne se fait pas en éditant du TypeScript, mais en ajoutant une entrée dans le JSON **et** son champ correspondant dans les deux configs Decap.

### CMS éditorial — Decap CMS

L'administration du contenu est disponible sur **`/admin/`**, adossée à **Netlify Identity + Git Gateway** (backend `git-gateway`, branche `main`). Chaque sauvegarde produit un commit git.

Particularité de cette implémentation : **une configuration double, selon le rôle**. `public/admin/index.html` désactive l'auto-init (`CMS_MANUAL_INIT = true`), rafraîchit le JWT pour lire `app_metadata.roles`, puis charge :

| Rôle Identity | Config chargée | Portée |
|---|---|---|
| `admin` | `config-full.yml` | 24 fichiers — dont navigation, blog, projet, contact, resources, newsletter, misc |
| tout autre | `config-restricted.yml` | 17 fichiers — sous-ensemble strict, sans la navigation ni les réglages techniques |

Fichiers éditables (les deux configs partagent des définitions de champs identiques) :

- `src/data/translations/*.json` — copie de toutes les sections du site
- `src/data/thematiques/{innovation,democracy,engagement,media,training}.json`
- `src/data/testimonials.json` — témoignages
- `src/data/playlists.json` — playlists YouTube, avec **contrainte d'épinglage unique**

L'épinglage unique des playlists est appliqué en JS dans `index.html` via deux garde-fous : un hook `preSave` (filet de sécurité à la sauvegarde) et un abonnement au store Redux de Decap (désépinglage live pendant l'édition). Ce mécanisme dépend d'internes de Decap et reste donc fragile.

Médias : `media_folder: public/uploads`, `public_folder: /uploads`.

Les alias `/fr/admin` et `/en/admin` redirigent vers `/admin/` (cf. `_redirects`). Le widget Netlify Identity est chargé en `defer` dans `BaseLayout.astro`.

#### Outillage de cohérence

Le contenu est décrit à trois endroits — les JSON, les deux configs Decap, et le tableau `sections` de `i18n.tsx` — pour un total de ~3 700 lignes de YAML par config. Deux scripts évitent d'entretenir tout cela à la main :

| Commande | Rôle |
|---|---|
| `npm run cms:check` | Vérifie la cohérence des trois sources. Sort en erreur si une clé JSON n'a pas de champ CMS, si une section n'est pas enregistrée dans `i18n.tsx`, si les deux configs divergent, si une clé est dupliquée, ou si `local_backend` a été oublié. Signale en avertissement les clés inutilisées ou non définies. |
| `npm run cms:gen` | **Régénère** les champs Decap à partir des JSON. Les JSON sont la source de vérité : ajouter une clé traduisible ne demande plus de toucher au YAML. |
| `npm run cms:gen:check` | Version non destructive, pour la CI. |

`cms:gen` est volontairement conservateur :

- Il ne régénère que les entrées **Shape A** (`src/data/translations/*.json` dont les champs sont une liste plate de groupes `_grp_*`). Les entrées Shape B — thématiques, témoignages, playlists — sont recopiées à l'octet près.
- Il **préserve l'ordre existant** des groupes et des champs (Decap affiche dans l'ordre du YAML ; réordonner changerait le formulaire des éditeurs). Les nouveautés sont ajoutées en fin de groupe.
- Il **conserve les sous-champs non linguistiques**. `stats.json` mélange `fr`/`en` avec `value` (nombre) et `suffix` ; ces champs sont réémis depuis la config existante, options comprises.
- Il **recopie tel quel** les widgets qu'il ne sait pas dériver (`initiatives.stats` est une `widget: list` dans un fichier Shape A).
- Le choix `string` vs `text` est calibré sur les 436 champs écrits à la main : seuil à 80 caractères, soit 434/436 identiques aux décisions humaines.

Pour ajouter une section : créer le JSON, l'enregistrer dans `i18n.tsx`, ajouter une entrée `file:` minimale dans la config (avec `fields: []`), puis lancer `npm run cms:gen`.

### Intégration WordPress

WordPress alimente le contenu éditorial dynamique (articles, projets, équipe, partenaires…). L'hôte de l'API est lu depuis `PUBLIC_WP_HOST` — jamais codé en dur.

`src/lib/wordpress.ts` expose une cinquantaine de fonctions, dont :

| Domaine | Fonctions principales |
|---|---|
| Articles | `fetchPosts`, `fetchStickyPosts`, `fetchPostBySlug`, `fetchPostById`, `fetchCategories` |
| Projets | `fetchProjets`, `fetchProjetBySlug`, `fetchChildProjets`, `fetchProjetMeres`, `fetchProjetsByIds` |
| Programmes | `fetchProgrammes`, `fetchProgrammeBySlug`, `fetchProgrammeTypes` |
| Thématiques | `fetchThematiques` |
| Organisations | `fetchPartenaires`, `fetchPlateformes`, `fetchCommunautes`, `fetchTeamMembers` |
| Divers | `fetchTimeline`, helpers `getXxxImageUrl`, `slimWpPost(s)`, `parseActionsHtml`, `collectChiffresCles`, `collectGalerieImages`, `collectPhases` |
| Utilitaires | `decodeHtmlEntities`, `stripHtml`, `formatDate`, `getCountryName` |

Tous les appels passent par un helper HTTP unique avec **timeout de 8 s** (`DEFAULT_TIMEOUT_MS`), **une tentative de retry** (`DEFAULT_RETRY = 1`) et un mécanisme de `fallback`.

Le fichier `functions-additions.php` (racine du dépôt) contient le code à déposer côté thème WordPress : custom post types, champs ACF et exposition REST. Il n'est **pas** utilisé par le build Astro.

### Proxy des médias WordPress

Les médias WordPress ne sont jamais référencés par URL absolue. Ils passent par `/wp-uploads/*`, réécrit vers l'origine WordPress par Netlify Edge (`_redirects`), avec un cache long côté edge (`_headers` : `s-maxage=2592000`, `stale-while-revalidate=31536000`). Cela résout les erreurs `ERR_NETWORK_CHANGED` liées à la lenteur de l'origine.

`parseWpJson` (dans `wordpress.ts`) réécrit automatiquement les URLs absolues à la volée. Les JSON statiques de `src/data/` utilisent directement `/wp-uploads/...`.

Les pages SSR `/fr/*` et `/en/*` bénéficient également d'un cache CDN court avec revalidation en arrière-plan (`s-maxage=300`, `stale-while-revalidate=3600`).

### Composants & UI

Les composants d'interface s'appuient sur **shadcn/ui** (primitives Radix stylées avec Tailwind et `class-variance-authority`), dans `src/components/ui/`. `components.json` pilote la génération.

> `components.json` référence encore `tailwind.config.ts`, fichier qui n'existe
> plus — la configuration Tailwind 4 est CSS-first dans `src/index.css`. La CLI
> shadcn peut donc nécessiter un ajustement manuel.

### Animations

- **Framer Motion** via `LazyMotion` pour les transitions et animations d'entrée React.
- **IntersectionObserver** vanilla dans `src/components/astro/Reveal.astro` pour les reveals au scroll.
- **Keyframes Tailwind** personnalisés définis dans `src/index.css`.

---

## Thématiques

Les cinq axes d'intervention sont définis dans `src/data/thematiques/`, éditables via le CMS :

| Slug | Thématique |
|---|---|
| `innovation` | Innovation technologique et participation citoyenne |
| `democracy` | Élections, démocratie et gouvernance |
| `engagement` | Engagement citoyen |
| `media` | Médias et résilience informationnelle |
| `training` | Formation, recherche et documentation |

Chaque fichier JSON contient le contenu bilingue complet : hero, introduction, vision, objectifs, actions, chiffres d'impact et programmes.

---

## Déploiement

Le déploiement cible **Netlify** via `@astrojs/netlify`. Build automatique à chaque push sur `main` (`npm run build`, publish `dist`, Node 22).

Configuration requise dans le dashboard Netlify :

1. **Variables d'environnement** — `PUBLIC_WP_HOST`, clés Infomaniak, `PUBLIC_GTM_ID` (optionnel). Jamais commitées.
2. **Netlify Identity** — activé, avec inscription par invitation.
3. **Git Gateway** — activé, pointant sur la branche `main`.
4. **Rôles** — ajouter `admin` dans `app_metadata.roles` des utilisateurs devant accéder à `config-full.yml`. Sans ce rôle, l'utilisateur obtient la config restreinte.

---

## Conventions

- **Imports** : toujours l'alias `@/` (`import { X } from "@/lib/utils"`) — pas d'imports relatifs traversants.
- **Traductions** : toute nouvelle clé doit avoir sa valeur `fr` **et** `en` dans le JSON, et son champ correspondant dans `config-full.yml` (et `config-restricted.yml` si les éditeurs doivent y accéder). Les deux configs restent synchronisées : la restreinte est un sous-ensemble strict avec des définitions de champs identiques.
- **Médias WordPress** : jamais d'URL absolue vers l'origine WordPress dans les sources — utiliser `/wp-uploads/...`.
- **Composants Astro** : privilégier `.astro` (zéro JS client) pour tout ce qui n'est pas interactif.
- **React islands** : `client:only="react"` pour les composants pleine page, directives plus fines pour les petits islands.
- **Pages par langue** : les routes `fr/` et `en/` sont maintenues en miroir manuellement (il n'y a pas de script de génération).

---

## Réutiliser cette architecture

Le socle « Astro + Decap CMS + JSON multilingue » est packagé en skill réutilisable : **`astro-decap-i18n`** (dans `~/.agents/skills/astro-decap-i18n/`, disponible globalement).

Il fournit la procédure et les templates pour rejouer ce montage sur un autre projet — config double par rôle, runtime `t()`, conventions de données (Shape A pour la copie UI, Shape B pour les listes métier), et les étapes du dashboard Netlify. Le skill est **paramétré par langues** : `languages=fr,en,pt,ar` génère types, champs Decap, dossiers de routes et redirections sans supposer FR/EN.

Il détecte automatiquement s'il doit initialiser un nouveau projet (*scaffold*) ou ajouter une section à un projet existant (*extend*).

Deux skills d'audit complémentaires vivent dans `.agents/skills/` : `astro-audit` (SEO, a11y, formulaires, credentials) et `astro-performance` (LCP, CLS, INP, bundle, fonts, cache).

---

*AfricTivistes — Ligue des Cybercitoyens Africains*
