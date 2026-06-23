# AfricTivistes V2026

Site web officiel d'**AfricTivistes — Ligue des Cybercitoyens Africains**, une organisation panafricaine de civic tech qui promeut la démocratie numérique et la participation citoyenne à travers l'Afrique.

Construit avec **Astro 6** en mode SSR, ce projet est une refonte complète orientée performance, accessibilité et bilingualisme (français / anglais).

---

## Table des matières

- [AfricTivistes V2026](#africtivistes-v2026)
  - [Table des matières](#table-des-matières)
  - [Aperçu](#aperçu)
  - [Stack technique](#stack-technique)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Commandes de développement](#commandes-de-développement)
  - [Structure du projet](#structure-du-projet)
  - [Architecture](#architecture)
    - [SSR \& Rendu](#ssr--rendu)
    - [Internationalisation (i18n)](#internationalisation-i18n)
    - [Intégration WordPress](#intégration-wordpress)
    - [Composants \& UI](#composants--ui)
    - [Animations](#animations)
  - [Thématiques](#thématiques)
  - [Déploiement](#déploiement)
  - [Conventions](#conventions)

---

## Aperçu

AfricTivistes intervient sur cinq axes stratégiques : innovation technologique, démocratie et gouvernance, engagement citoyen, résilience médiatique, et formation. Le site regroupe :

- Un blog multilingue alimenté par un CMS WordPress
- Des pages de présentation des thématiques et des projets (100+)
- Une bibliothèque de publications, ressources et vidéos
- Des formulaires de contact et d'adhésion
- Des statistiques et témoignages d'impact

---

## Stack technique

| Catégorie | Technologie |
|---|---|
| Framework | [Astro 6](https://astro.build) (SSR, `output: "server"`) |
| Adapter | `@astrojs/netlify` |
| UI interactif | React 18 (islands via `client:only="react"`) |
| Styles | Tailwind CSS 4 (config CSS-first via `@tailwindcss/vite`) + CSS variables (HSL) |
| Composants UI | shadcn/ui (Radix UI + class-variance-authority) |
| Formulaires | React Hook Form + Zod |
| Données | TanStack Query (React Query v5) |
| Animations | Framer Motion (LazyMotion) |
| CMS | WordPress REST API (hôte configuré via `PUBLIC_WP_HOST`) |
| Graphiques | Recharts |
| Icônes | Lucide React |
| Typage | TypeScript (strict) |

---

## Prérequis

- **Node.js** ≥ 20
- **npm** ≥ 10
- Accès à une instance WordPress (URL renseignée via la variable d'environnement `PUBLIC_WP_HOST`)

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
> Aucune URL d'instance WordPress n'est codée en dur dans les sources : voir
> `.env.example` pour la liste des variables attendues.

---

## Commandes de développement

```bash
# Démarrer le serveur de développement
npm run dev

# Vérifier les types TypeScript
npm run typecheck

# Construire pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

---

## Structure du projet

```
africtivistes-V2026-astro/
├── public/                     # Assets statiques (logo, favicon, og-image)
├── src/
│   ├── assets/                 # Images optimisées (AVIF, WebP)
│   ├── components/
│   │   ├── ui/                 # Primitives shadcn/ui (Button, Card, Dialog…)
│   │   ├── pages/              # Islands React pleine page (About, Blog, Histoire…)
│   │   ├── thematique/         # Blocs de page thématique (Hero, Objectifs, Actions…)
│   │   ├── contact/            # Formulaire de contact
│   │   ├── resources/          # Publications, Toolkits, Médias
│   │   └── *.tsx / *.astro     # Composants partagés (Navbar, Footer, Hero…)
│   ├── data/
│   │   ├── thematiques.ts      # Types et exports
│   │   └── thematiques/        # Données JSON par axe (innovation, democracy…)
│   ├── hooks/                  # Hooks React personnalisés
│   ├── layouts/
│   │   └── BaseLayout.astro    # Shell commun (head SEO, nav, footer, GTM)
│   ├── lib/
│   │   ├── wordpress.ts        # Client API WordPress (fetch, retry, cache)
│   │   ├── i18n.tsx            # Système i18n maison (200+ clés, contexte React)
│   │   ├── youtube.ts          # Intégration playlists YouTube
│   │   ├── query-client.ts     # Configuration TanStack Query
│   │   ├── router-shim.tsx     # Utilitaires de navigation
│   │   └── utils.ts            # Helpers généraux
│   ├── pages/
│   │   ├── index.astro         # Redirection → /fr/
│   │   ├── 404.astro
│   │   ├── fr/                 # Routes françaises
│   │   │   ├── index.astro
│   │   │   ├── contact.astro
│   │   │   ├── about/          # (index, history, values, join)
│   │   │   ├── initiatives/    # (index, [slug], innovation, democracy…)
│   │   │   ├── blog/           # (index, [slug])
│   │   │   └── resources/      # (publications, toolkits, media)
│   │   └── en/                 # Routes anglaises (miroir, auto-générées)
│   └── index.css               # Base Tailwind 4 (@theme) + variables CSS globales
├── .env.example                # Modèle des variables d'environnement
├── astro.config.mjs            # Adapter Netlify, intégration React, Tailwind (Vite)
├── tsconfig.json
├── components.json             # Config shadcn/ui
├── netlify.toml                # Configuration de déploiement Netlify
└── AGENTS.md                   # Documentation interne pour les développeurs
```

---

## Architecture

### SSR & Rendu

Le site tourne en **mode SSR** (`output: "server"`) avec l'adaptateur **Netlify** (`@astrojs/netlify`). Chaque requête génère la page côté serveur, ce qui permet :

- Le fetch des données WordPress au moment du rendu (pas de stale content)
- L'injection de données dans `window.__PRELOAD__` pour l'hydratation côté client sans double requête
- Les redirections et la gestion des 404 dynamiques

Les composants Astro natifs (`.astro`) sont rendus sans JavaScript côté client. Les composants interactifs React sont montés via `client:only="react"` uniquement là où l'interactivité est nécessaire.

### Internationalisation (i18n)

Le site supporte **deux langues** : français (`/fr/`) et anglais (`/en/`).

- Le système i18n est **maison** (pas de librairie externe) : un dictionnaire TypeScript de 200+ clés dans `src/lib/i18n.tsx`, exposé via un contexte React et le hook `useI18n()`.
- `BaseLayout.astro` injecte les balises `hreflang` pour le SEO multilingue.

### Intégration WordPress

Le CMS WordPress centralise tout le contenu éditorial. L'hôte de l'API est lu depuis la variable d'environnement `PUBLIC_WP_HOST` (jamais codé en dur). L'intégration (`src/lib/wordpress.ts`) expose des fonctions dédiées :

| Fonction | Données récupérées |
|---|---|
| `fetchPosts()` | Articles de blog par catégorie et langue |
| `fetchStickyPosts()` | Articles mis en avant |
| `fetchProjets()` | Projets et initiatives |
| `fetchPartenaires()` | Logos et noms des partenaires |
| `fetchThematiques()` | Axes d'intervention |

Les appels sont protégés par un **timeout de 8 secondes** et une **retry automatique**. Les catégories sont mappées manuellement par langue (`CATEGORY_IDS`).

### Composants & UI

Les composants d'interface s'appuient sur **shadcn/ui** : des primitives accessibles Radix UI stylées avec Tailwind et `class-variance-authority`. Les composants sont dans `src/components/ui/` et peuvent être régénérés via la CLI shadcn.

Les données statiques des thématiques (JSON dans `src/data/thematiques/`) permettent de rendre les pages d'initiatives sans dépendre du CMS.

### Animations

- **Framer Motion** (via `LazyMotion` + `domAnimation`) pour les transitions de page et les animations d'entrée des composants React.
- **IntersectionObserver** vanilla JS pour les reveals au scroll (classe `.a-reveal`) dans les composants Astro.
- **Tailwind keyframes** personnalisés : `fade-in`, `scale`, `float`, `accordion-down/up`.

---

## Thématiques

Les cinq axes d'intervention sont définis statiquement dans `src/data/thematiques/` :

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

Le déploiement cible **Netlify** via l'adaptateur `@astrojs/netlify`. Le build génère les fonctions serverless et les assets attendus par Netlify (configuration dans `netlify.toml`) :

```bash
npm run build
```

Sur Netlify, le déploiement est automatique à chaque push (build command `npm run build`). Les variables d'environnement (`PUBLIC_WP_HOST`, clés Infomaniak, etc.) doivent être définies dans les **paramètres du site Netlify** — elles ne sont jamais commitées dans le dépôt.

---

## Conventions

- **Imports** : toujours utiliser l'alias `@/` (`import { X } from "@/lib/utils"`) — pas d'imports relatifs traversants.
- **Traductions** : toute nouvelle clé ajoutée en français dans `i18n.tsx` doit avoir son équivalent anglais dans le même commit.
- **Composants Astro** : privilégier les composants `.astro` (zéro JS client) pour tout ce qui n'est pas interactif.
- **React islands** : utiliser `client:only="react"` et non `client:load` pour les composants pleine page.

---

*AfricTivistes — Ligue des Cybercitoyens Africains*
