# AfricTivistes V2026

Site web officiel d'**AfricTivistes — Ligue des Cybercitoyens Africains**, une organisation panafricaine de civic tech qui promeut la démocratie numérique et la participation citoyenne à travers l'Afrique.

Construit avec **Astro 5** en mode SSR, ce projet est une refonte complète orientée performance, accessibilité et bilingualisme (français / anglais).

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
| Framework | [Astro 5](https://astro.build) (SSR, `output: "server"`) |
| Adapter | `@astrojs/node` (standalone) |
| UI interactif | React 18 (islands via `client:only="react"`) |
| Styles | Tailwind CSS 3 + CSS variables (HSL) |
| Composants UI | shadcn/ui (Radix UI + class-variance-authority) |
| Formulaires | React Hook Form + Zod |
| Données | TanStack Query (React Query v5) |
| Animations | Framer Motion (LazyMotion) |
| CMS | WordPress REST API (`update.africtivistes.org`) |
| Graphiques | Recharts |
| Icônes | Lucide React |
| Typage | TypeScript (strict) |

---

## Prérequis

- **Node.js** ≥ 20
- **npm** ≥ 10
- Accès à l'instance WordPress (`update.africtivistes.org`) avec un compte applicatif

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/AfricTivistes/AfricTivistesV26.git
cd AfricTivistesV26

# Installer les dépendances
npm install
```

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
│   └── index.css               # Variables CSS globales + base Tailwind
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── components.json             # Config shadcn/ui
└── AGENTS.md                   # Documentation interne pour les développeurs
```

---

## Architecture

### SSR & Rendu

Le site tourne en **mode SSR** (`output: "server"`) avec l'adaptateur Node.js standalone. Chaque requête génère la page côté serveur, ce qui permet :

- Le fetch des données WordPress au moment du rendu (pas de stale content)
- L'injection de données dans `window.__PRELOAD__` pour l'hydratation côté client sans double requête
- Les redirections et la gestion des 404 dynamiques

Les composants Astro natifs (`.astro`) sont rendus sans JavaScript côté client. Les composants interactifs React sont montés via `client:only="react"` uniquement là où l'interactivité est nécessaire.

### Internationalisation (i18n)

Le site supporte **deux langues** : français (`/fr/`) et anglais (`/en/`).

- Le système i18n est **maison** (pas de librairie externe) : un dictionnaire TypeScript de 200+ clés dans `src/lib/i18n.tsx`, exposé via un contexte React et le hook `useI18n()`.
- `BaseLayout.astro` injecte les balises `hreflang` pour le SEO multilingue.

### Intégration WordPress

Le CMS WordPress (`update.africtivistes.org`) centralise tout le contenu éditorial. L'intégration (`src/lib/wordpress.ts`) expose des fonctions dédiées :

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

Le build produit un serveur Node.js standalone dans `dist/` :

```bash
npm run build

# Lancer le serveur de production
node dist/server/entry.mjs
```

Pour un déploiement conteneurisé, l'entrée est `dist/server/entry.mjs`. Le port et l'hôte peuvent être configurés via les variables d'environnement standard de Node.

---

## Conventions

- **Imports** : toujours utiliser l'alias `@/` (`import { X } from "@/lib/utils"`) — pas d'imports relatifs traversants.
- **Traductions** : toute nouvelle clé ajoutée en français dans `i18n.tsx` doit avoir son équivalent anglais dans le même commit.
- **Composants Astro** : privilégier les composants `.astro` (zéro JS client) pour tout ce qui n'est pas interactif.
- **React islands** : utiliser `client:only="react"` et non `client:load` pour les composants pleine page.

---

*AfricTivistes — Ligue des Cybercitoyens Africains*
