import logoAfrictivistes from "@/assets/logo.svg?url";

/* ================================================================
   1. CONFIG
   ================================================================ */

const WP_API_BASE = "https://update.africtivistes.org/wp-json/wp/v2";
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RETRY = 1;

/* ================================================================
   2. CORE TYPES
   ================================================================ */

export type Lang = "fr" | "en";

interface WPEmbedMedia {
  "wp:featuredmedia"?: Array<{
    source_url: string;
    alt_text: string;
    media_details?: {
      width?: number;
      height?: number;
      sizes?: Record<string, {
        source_url: string;
        width: number;
        height: number;
        mime_type?: string;
      }>;
    };
  }>;
  "wp:term"?: Array<Array<{
    id: number;
    name: string;
    slug: string;
  }>>;
}

/* ================================================================
   3. HTTP CORE -- helper unique avec timeout/retry/fallback
   ================================================================ */

interface WpFetchOptions<T> {
  fallback?: T;
  timeoutMs?: number;
  retry?: number;
}

async function wpFetch<T>(
  endpoint: string,
  params?: URLSearchParams | Record<string, string | number>,
  opts: WpFetchOptions<T> = {},
): Promise<T> {
  const { fallback, timeoutMs = DEFAULT_TIMEOUT_MS, retry = DEFAULT_RETRY } = opts;
  let qs = "";
  if (params instanceof URLSearchParams) {
    qs = params.toString();
  } else if (params) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) sp.set(k, String(v));
    qs = sp.toString();
  }
  const url = `${WP_API_BASE}${endpoint}${qs ? `?${qs}` : ""}`;

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retry; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) {
        if (fallback !== undefined) return fallback;
        throw new Error(`WP fetch failed: ${res.status} ${endpoint}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (attempt === retry) {
        if (fallback !== undefined) return fallback;
        throw err;
      }
    }
  }
  throw lastErr;
}

/** Variante qui retourne aussi les headers (pour la pagination). */
async function wpFetchWithHeaders<T>(
  endpoint: string,
  params?: URLSearchParams,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<{ data: T; headers: Headers }> {
  const url = `${WP_API_BASE}${endpoint}${params ? `?${params.toString()}` : ""}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`WP fetch failed: ${res.status} ${endpoint}`);
    const data = (await res.json()) as T;
    return { data, headers: res.headers };
  } finally {
    clearTimeout(timer);
  }
}

/* ================================================================
   4. UTILS
   ================================================================ */

/** Strip HTML tags via regex (compatible SSR/test). */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .trim();
}

/** Format date selon la langue (FR par défaut). */
export function formatDate(dateStr: string, lang: Lang | string = "fr"): string {
  const locale = lang === "en" ? "en-US" : "fr-FR";
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ================================================================
   5. DATA TABLES
   ================================================================ */

/**
 * Polylang ne filtre pas les posts via le parametre REST "lang".
 * Le filtrage par langue passe par les categories racines FR/EN du site WordPress.
 *
 * Strategie : on tente de fetch un mapping dynamique depuis l'endpoint custom
 *   /wp-json/africtivistes/v1/lang-categories
 * Si l'endpoint est indisponible, on retombe sur LANG_CATEGORIES_FALLBACK.
 *
 * Cache : memoire (per-session) + sessionStorage (24h).
 */
const LANG_CATEGORIES_FALLBACK: Record<Lang, number[]> = {
  fr: [5, 12, 4625, 9, 50, 4796, 5909, 5964, 4488, 5980, 5976, 6030, 6588, 7177, 6718, 6738, 1514],
  en: [63, 2609, 4663, 1927, 1635, 4805, 5913, 5968, 4492, 5984, 5972, 6034, 6592, 7181, 6730, 6734, 1525],
};

const LANG_CATEGORIES_ENDPOINT = "https://update.africtivistes.org/wp-json/africtivistes/v1/lang-categories";
const LANG_CATEGORIES_STORAGE_KEY = "aft_lang_cats_v1";
const LANG_CATEGORIES_TTL_MS = 24 * 60 * 60 * 1000; /* 24h */

let langCategoriesCache: Record<Lang, number[]> | null = null;
let langCategoriesPromise: Promise<Record<Lang, number[]>> | null = null;

async function loadLangCategories(): Promise<Record<Lang, number[]>> {
  if (langCategoriesCache) return langCategoriesCache;
  if (langCategoriesPromise) return langCategoriesPromise;

  /* 1. sessionStorage (24h TTL) */
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(LANG_CATEGORIES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; data: Record<Lang, number[]> };
        if (
          parsed?.data?.fr?.length &&
          parsed?.data?.en?.length &&
          Date.now() - parsed.ts < LANG_CATEGORIES_TTL_MS
        ) {
          langCategoriesCache = parsed.data;
          return parsed.data;
        }
      }
    } catch { /* ignore */ }
  }

  /* 2. Fetch endpoint custom avec timeout */
  langCategoriesPromise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(LANG_CATEGORIES_ENDPOINT, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = (await res.json()) as Record<Lang, number[]>;
        if (data?.fr?.length && data?.en?.length) {
          langCategoriesCache = data;
          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem(
                LANG_CATEGORIES_STORAGE_KEY,
                JSON.stringify({ ts: Date.now(), data }),
              );
            } catch { /* quota / private mode */ }
          }
          return data;
        }
      }
    } catch { /* timeout / network */ } finally {
      clearTimeout(timer);
    }
    /* 3. Fallback hard-code */
    langCategoriesCache = LANG_CATEGORIES_FALLBACK;
    return LANG_CATEGORIES_FALLBACK;
  })();

  return langCategoriesPromise;
}

async function getLangCategoryIds(lang?: string): Promise<number[] | undefined> {
  if (!lang) return undefined;
  const all = await loadLangCategories();
  return all[lang as Lang];
}

/**
 * IDs des categories par cle et par langue.
 * Source de verite unique -- importer ce mapping partout.
 */
export const CATEGORY_IDS: Record<string, Record<Lang, number>> = {
  communiques: { fr: 12, en: 2609 },
  plaidoyers: { fr: 4625, en: 4663 },
  actualites: { fr: 5, en: 63 },
  contributions: { fr: 7177, en: 7181 },
  champions: { fr: 1514, en: 1525 },
  publications: { fr: 9, en: 1927 },
  toolkits: { fr: 50, en: 1635 },
};

/* Aliases retro-compatibles */
export const COMMUNIQUE_CATEGORY_IDS = CATEGORY_IDS.communiques;
export const BLOG_CATEGORY_IDS = CATEGORY_IDS.contributions;
export const PUBLICATION_CATEGORY_IDS = CATEGORY_IDS.publications;
export const TOOLKIT_CATEGORY_IDS = CATEGORY_IDS.toolkits;

export const AFRICAN_COUNTRIES_FR: Record<string, string> = {
  PANAF: "Panafricain",
  DZ: "Algérie", AO: "Angola", BJ: "Bénin", BW: "Botswana", BF: "Burkina Faso",
  BI: "Burundi", CV: "Cap-Vert", CM: "Cameroun", CF: "Centrafrique", KM: "Comores",
  CG: "Congo", CD: "RD Congo", CI: "Côte d'Ivoire", DJ: "Djibouti", EG: "Égypte",
  GQ: "Guinée équatoriale", ER: "Érythrée", SZ: "Eswatini", ET: "Éthiopie", GA: "Gabon",
  GM: "Gambie", GH: "Ghana", GN: "Guinée", GW: "Guinée-Bissau", KE: "Kenya",
  LS: "Lesotho", LR: "Liberia", LY: "Libye", MG: "Madagascar", MW: "Malawi",
  ML: "Mali", MR: "Mauritanie", MU: "Maurice", MA: "Maroc", MZ: "Mozambique",
  NA: "Namibie", NE: "Niger", NG: "Nigeria", RW: "Rwanda", ST: "São Tomé-et-Príncipe",
  SN: "Sénégal", SC: "Seychelles", SL: "Sierra Leone", SO: "Somalie", ZA: "Afrique du Sud",
  SS: "Soudan du Sud", SD: "Soudan", TZ: "Tanzanie", TG: "Togo", TN: "Tunisie",
  UG: "Ouganda", ZM: "Zambie", ZW: "Zimbabwe", TD: "Tchad",
};

export const AFRICAN_COUNTRIES_EN: Record<string, string> = {
  PANAF: "Pan-African",
  DZ: "Algeria", AO: "Angola", BJ: "Benin", BW: "Botswana", BF: "Burkina Faso",
  BI: "Burundi", CV: "Cape Verde", CM: "Cameroon", CF: "Central African Republic", KM: "Comoros",
  CG: "Congo", CD: "DR Congo", CI: "Côte d'Ivoire", DJ: "Djibouti", EG: "Egypt",
  GQ: "Equatorial Guinea", ER: "Eritrea", SZ: "Eswatini", ET: "Ethiopia", GA: "Gabon",
  GM: "Gambia", GH: "Ghana", GN: "Guinea", GW: "Guinea-Bissau", KE: "Kenya",
  LS: "Lesotho", LR: "Liberia", LY: "Libya", MG: "Madagascar", MW: "Malawi",
  ML: "Mali", MR: "Mauritania", MU: "Mauritius", MA: "Morocco", MZ: "Mozambique",
  NA: "Namibia", NE: "Niger", NG: "Nigeria", RW: "Rwanda", ST: "São Tomé and Príncipe",
  SN: "Senegal", SC: "Seychelles", SL: "Sierra Leone", SO: "Somalia", ZA: "South Africa",
  SS: "South Sudan", SD: "Sudan", TZ: "Tanzania", TG: "Togo", TN: "Tunisia",
  UG: "Uganda", ZM: "Zambia", ZW: "Zimbabwe", TD: "Chad",
};

/** Alias rétro-compatible (FR par défaut). */
export const AFRICAN_COUNTRIES = AFRICAN_COUNTRIES_FR;

export function getCountryName(code: string, lang: Lang | string = "fr"): string {
  const table = lang === "en" ? AFRICAN_COUNTRIES_EN : AFRICAN_COUNTRIES_FR;
  return table[code] || code;
}

/* Slug français du pays pour construire l'URL citizenlab<pays>.org */
const COUNTRY_SLUG: Record<string, string> = {
  DZ: "algerie", AO: "angola", BJ: "benin", BW: "botswana", BF: "burkinafaso",
  BI: "burundi", CV: "capvert", CM: "cameroun", CF: "centrafrique", KM: "comores",
  CG: "congo", CD: "rdcongo", CI: "cotedivoire", DJ: "djibouti", EG: "egypte",
  GQ: "guineeequatoriale", ER: "erythree", SZ: "eswatini", ET: "ethiopie", GA: "gabon",
  GM: "gambie", GH: "ghana", GN: "guinee", GW: "guineebissau", KE: "kenya",
  LS: "lesotho", LR: "liberia", LY: "libye", MG: "madagascar", MW: "malawi",
  ML: "mali", MR: "mauritanie", MU: "maurice", MA: "maroc", MZ: "mozambique",
  NA: "namibie", NE: "niger", NG: "nigeria", RW: "rwanda", ST: "saotome",
  SN: "senegal", SC: "seychelles", SL: "sierraleone", SO: "somalie", ZA: "afriquedusud",
  SS: "soudandusud", SD: "soudan", TZ: "tanzanie", TG: "togo", TN: "tunisie",
  UG: "ouganda", ZM: "zambie", ZW: "zimbabwe", TD: "tchad",
};

/* ================================================================
   6. POSTS
   ================================================================ */

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  featured_media: number;
  categories: number[];
  translations?: Record<string, number>;
  lang?: string;
  _embedded?: WPEmbedMedia;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface FetchPostsOptions {
  page?: number;
  perPage?: number;
  categories?: number[];
  categoriesExclude?: number[];
  search?: string;
  lang?: string;
}

export async function fetchPosts(
  options: FetchPostsOptions = {},
): Promise<{ posts: WPPost[]; totalPages: number; total: number }> {
  const { page = 1, perPage = 9, categories, categoriesExclude, search, lang } = options;
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    _embed: "true",
  });

  const langCats = await getLangCategoryIds(lang);
  if (categories?.length) {
    params.set("categories", categories.join(","));
  } else if (langCats) {
    params.set("categories", langCats.join(","));
  }
  if (categoriesExclude?.length) {
    params.set("categories_exclude", categoriesExclude.join(","));
  }
  if (search) params.set("search", search);

  try {
    const { data, headers } = await wpFetchWithHeaders<WPPost[]>("/posts", params);
    return {
      posts: data,
      totalPages: parseInt(headers.get("X-WP-TotalPages") || "1"),
      total: parseInt(headers.get("X-WP-Total") || "0"),
    };
  } catch {
    return { posts: [], totalPages: 1, total: 0 };
  }
}

export async function fetchStickyPosts(perPage = 10, lang?: string): Promise<WPPost[]> {
  const params = new URLSearchParams({
    per_page: String(perPage),
    sticky: "true",
    _embed: "true",
  });
  const langCats = await getLangCategoryIds(lang);
  if (langCats) params.set("categories", langCats.join(","));
  return wpFetch<WPPost[]>("/posts", params, { fallback: [] });
}

export async function fetchPostById(id: number): Promise<WPPost | null> {
  return wpFetch<WPPost | null>(`/posts/${id}`, { _embed: "true" }, { fallback: null });
}

export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>(
    "/posts",
    { slug, _embed: "true" },
    { fallback: [] },
  );
  return posts[0] || null;
}

export async function fetchCategories(lang?: string): Promise<WPCategory[]> {
  const all = await wpFetch<WPCategory[]>(
    "/categories",
    { per_page: "100", _fields: "id,name,slug,count" },
    { fallback: [] },
  );
  const langCats = await getLangCategoryIds(lang);
  if (!langCats) return all.filter((c) => c.count > 0);
  return all.filter((c) => langCats.includes(c.id) && c.count > 0);
}

export function getFeaturedImageUrl(post: WPPost): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

/**
 * Picks an OG-friendly variant from WP media (target ~1200px wide).
 * Priority: large → medium_large → full → source_url.
 * Falls back to the original source_url if no sizes are exposed.
 */
export function getOgImageUrl(
  entity: { _embedded?: WPEmbedMedia } | null | undefined,
): string | null {
  const media = entity?._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  const sizes = media.media_details?.sizes;
  if (sizes) {
    const preferred = ["large", "medium_large", "full"] as const;
    for (const key of preferred) {
      const s = sizes[key];
      if (s?.source_url) return s.source_url;
    }
    // pick the widest size we have ≥ 600px as a safety net
    const candidates = Object.values(sizes).filter((s) => s?.source_url && s.width >= 600);
    if (candidates.length) {
      candidates.sort((a, b) => b.width - a.width);
      return candidates[0].source_url;
    }
  }
  return media.source_url || null;
}

export function getPostCategories(post: WPPost): Array<{ id: number; name: string; slug: string }> {
  return post._embedded?.["wp:term"]?.[0] || [];
}

/* ================================================================
   7. CPT - PROGRAMME (legacy, conservé)
   ================================================================ */

export interface WPProgramme {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  programme_type: number[];
  acf: {
    equipe: number[] | string;
    etiquette: string;
  };
  _embedded?: WPEmbedMedia;
}

export interface WPProgrammeType {
  id: number;
  name: string;
  slug: string;
  count: number;
  link: string;
}

export async function fetchProgrammes(
  perPage = 100,
  programmeType?: number,
  langTypeIds?: number[],
): Promise<WPProgramme[]> {
  const params = new URLSearchParams({
    per_page: String(perPage),
    _embed: "true",
  });
  if (programmeType) {
    params.set("programme_type", String(programmeType));
  } else if (langTypeIds?.length) {
    params.set("programme_type", langTypeIds.join(","));
  }
  return wpFetch<WPProgramme[]>("/programme", params, { fallback: [] });
}

export async function fetchProgrammeBySlug(slug: string): Promise<WPProgramme | null> {
  const programmes = await wpFetch<WPProgramme[]>(
    "/programme",
    { slug, _embed: "true" },
    { fallback: [] },
  );
  return programmes[0] || null;
}

export async function fetchProgrammeTypes(lang?: string): Promise<WPProgrammeType[]> {
  const all = await wpFetch<WPProgrammeType[]>(
    "/programme_type",
    { per_page: "100" },
    { fallback: [] },
  );
  if (!lang) return all;
  /* Polylang prefixe les liens EN avec /en/ ; les termes FR n'ont pas de prefixe */
  return all.filter((t) =>
    lang === "en" ? t.link.includes("/en/") : !t.link.includes("/en/"),
  );
}

export function getProgrammeImageUrl(programme: WPProgramme): string | null {
  return programme._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

export function getProgrammeType(
  programme: WPProgramme,
): { id: number; name: string; slug: string } | null {
  return programme._embedded?.["wp:term"]?.[0]?.[0] || null;
}

/* ================================================================
   8. CPT - PROJET V2 + Thematique + ProjetMere
   ================================================================ */

/* ---------- Partenaire (CPT partenaire) ---------- */

export interface WPPartenaire {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  acf: {
    logo: number | string | { url?: string; sizes?: { medium?: { url?: string } } } | null;
    url: string;
  };
  _embedded?: WPEmbedMedia;
}

/* ---------- Projet Mere (taxonomie projet_mere avec champs ACF) ---------- */

export interface WPProjetMere {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  pm_description: string;
  pm_url: string;
  pm_image: string;
  pm_statut: "en_cours" | "termine" | "";
}

export async function fetchProjetMeres(ids: number[]): Promise<WPProjetMere[]> {
  if (!ids.length) return [];
  return wpFetch<WPProjetMere[]>(
    "/projet_mere",
    { include: ids.join(","), per_page: String(ids.length) },
    { fallback: [] },
  );
}

/* ---------- Thematique ---------- */

export interface WPThematique {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  link: string;
}

export async function fetchThematiques(lang?: string): Promise<WPThematique[]> {
  const all = await wpFetch<WPThematique[]>(
    "/thematique",
    { per_page: "100" },
    { fallback: [] },
  );
  if (!lang) return all;
  return all.filter((t) =>
    lang === "en" ? t.link.includes("/en/") : !t.link.includes("/en/"),
  );
}

/* ---------- Action / Phase (sous-types) ---------- */

export interface ProjetAction {
  action_titre: string;
  action_details: Array<{ detail_texte: string }>;
}

export interface ProjetPhase {
  phase_titre: string;
  phase_partenaires: number[];
  phase_date_debut: string;
  phase_date_fin: string;
  phase_pays: string[];
}

/* ---------- Helpers internes pour ACF dynamique (cc/ph/galerie) ---------- */

interface ProjetAcfRecord {
  [key: string]: unknown;
}

function acfStr(acf: ProjetAcfRecord, key: string): string | undefined {
  const v = acf[key];
  return typeof v === "string" ? v : undefined;
}

function acfNumOrUrl(acf: ProjetAcfRecord, key: string): string | number | undefined {
  const v = acf[key];
  if (typeof v === "string" || typeof v === "number") return v;
  return undefined;
}

function acfNumArr(acf: ProjetAcfRecord, key: string): number[] {
  const v = acf[key];
  return Array.isArray(v) ? (v as number[]) : [];
}

function acfStrArr(acf: ProjetAcfRecord, key: string): string[] {
  const v = acf[key];
  return Array.isArray(v) ? (v as string[]) : [];
}

/* ---------- Projet (CPT) ---------- */

export interface WPProjet {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  parent: number; /* 0 = racine, sinon ID du projet parent */
  thematique: number[];
  projet_mere: number[];
  translations?: Record<string, number>;
  lang?: string;
  acf: {
    /* Groupe 1 : Informations generales */
    objectif: string;
    site_web: string;
    /* Groupe 2 : Chiffres cles (6 slots dynamiques) */
    cc1_icone?: string; cc1_titre?: string; cc1_valeur?: string;
    cc2_icone?: string; cc2_titre?: string; cc2_valeur?: string;
    cc3_icone?: string; cc3_titre?: string; cc3_valeur?: string;
    cc4_icone?: string; cc4_titre?: string; cc4_valeur?: string;
    cc5_icone?: string; cc5_titre?: string; cc5_valeur?: string;
    cc6_icone?: string; cc6_titre?: string; cc6_valeur?: string;
    /* Groupe 3 : Geographie (codes ISO des pays coches) */
    pays: string[];
    /* Groupe 4 : Relations */
    soutenu_par: number[];
    en_partenariat_avec: number[];
    plateformes_projet: number[];
    /* Groupe 5 : Galerie (5 champs image individuels) */
    galerie_1?: string;
    galerie_2?: string;
    galerie_3?: string;
    galerie_4?: string;
    galerie_5?: string;
    /* Groupe 6 : Actions (WYSIWYG HTML) */
    actions_html: string;
    /* Groupe 7 : Phases (8 blocs fixes ph1-ph8) */
    ph1_titre?: string; ph1_partenaires?: number[]; ph1_date_debut?: string; ph1_date_fin?: string; ph1_pays?: string[];
    ph2_titre?: string; ph2_partenaires?: number[]; ph2_date_debut?: string; ph2_date_fin?: string; ph2_pays?: string[];
    ph3_titre?: string; ph3_partenaires?: number[]; ph3_date_debut?: string; ph3_date_fin?: string; ph3_pays?: string[];
    ph4_titre?: string; ph4_partenaires?: number[]; ph4_date_debut?: string; ph4_date_fin?: string; ph4_pays?: string[];
    ph5_titre?: string; ph5_partenaires?: number[]; ph5_date_debut?: string; ph5_date_fin?: string; ph5_pays?: string[];
    ph6_titre?: string; ph6_partenaires?: number[]; ph6_date_debut?: string; ph6_date_fin?: string; ph6_pays?: string[];
    ph7_titre?: string; ph7_partenaires?: number[]; ph7_date_debut?: string; ph7_date_fin?: string; ph7_pays?: string[];
    ph8_titre?: string; ph8_partenaires?: number[]; ph8_date_debut?: string; ph8_date_fin?: string; ph8_pays?: string[];
  };
  _embedded?: WPEmbedMedia;
}

export async function fetchProjets(
  perPage = 100,
  thematique?: number,
  parent?: number,
): Promise<WPProjet[]> {
  const params = new URLSearchParams({
    per_page: String(perPage),
    _embed: "true",
    _fields: "id,slug,title,featured_media,thematique,parent,projet_mere,lang,translations,acf,_links,_embedded",
  });
  if (thematique) {
    params.set("thematique", String(thematique));
  }
  if (parent !== undefined) {
    params.set("parent", String(parent));
  }
  return wpFetch<WPProjet[]>("/projet", params, { fallback: [] });
}

export async function fetchProjetBySlug(slug: string): Promise<WPProjet | null> {
  const projets = await wpFetch<WPProjet[]>(
    "/projet",
    { slug, _embed: "true" },
    { fallback: [] },
  );
  return projets[0] || null;
}

export async function fetchChildProjets(parentId: number, perPage = 100): Promise<WPProjet[]> {
  return fetchProjets(perPage, undefined, parentId);
}

export function getProjetImageUrl(projet: WPProjet): string | null {
  return projet._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

export function getProjetThematique(
  projet: WPProjet,
): { id: number; name: string; slug: string } | null {
  const thematiqueIds = projet.thematique || [];
  if (!thematiqueIds.length) return null;
  const termGroups = projet._embedded?.["wp:term"] || [];
  for (const group of termGroups) {
    for (const term of group) {
      if (thematiqueIds.includes(term.id)) return term;
    }
  }
  return null;
}

export async function fetchProjetsByIds(ids: number[]): Promise<WPProjet[]> {
  if (!ids.length) return [];
  return wpFetch<WPProjet[]>(
    "/projet",
    { include: ids.join(","), per_page: String(ids.length), _embed: "true" },
    { fallback: [] },
  );
}

/**
 * Fetch un projet par slug. Si le projet trouvé n'est pas dans la langue
 * demandée, on récupère la traduction via le champ `translations`.
 */
export async function fetchProjetBySlugWithLang(
  slug: string,
  lang?: string,
): Promise<WPProjet | null> {
  let projet = await fetchProjetBySlug(slug);
  if (!projet) return null;
  if (lang && projet.lang !== lang) {
    const translatedId = projet.translations?.[lang];
    if (translatedId) {
      const projets = await wpFetch<WPProjet[]>(
        "/projet",
        { include: String(translatedId), _embed: "true" },
        { fallback: [] },
      );
      if (projets[0]) projet = projets[0];
    }
  }
  if (projet.acf) await resolveProjetMediaFields(projet.acf as ProjetAcfRecord);
  return projet;
}

/* ---------- Parsers ACF ---------- */

/**
 * Parse le HTML WYSIWYG "actions_html" en tableau d'actions structurees.
 * Cherche les <h3> comme titres et les <li> suivants comme details.
 */
export function parseActionsHtml(html: string | undefined | null): ProjetAction[] {
  if (!html || !html.trim()) return [];
  if (typeof DOMParser === "undefined") return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const actions: ProjetAction[] = [];
  const headings = doc.querySelectorAll("h3");

  headings.forEach((h3) => {
    const details: { detail_texte: string }[] = [];
    let el = h3.nextElementSibling;
    while (el && el.tagName !== "H3") {
      if (el.tagName === "UL" || el.tagName === "OL") {
        el.querySelectorAll("li").forEach((li) => {
          const text = li.textContent?.trim();
          if (text) details.push({ detail_texte: text });
        });
      }
      el = el.nextElementSibling;
    }
    actions.push({
      action_titre: h3.textContent?.trim() || "",
      action_details: details,
    });
  });

  return actions;
}

export interface ChiffreCle {
  titre: string;
  valeur: string;
  icone: string;
}

/** Collecte les 6 chiffres clés (cc1..cc6) en filtrant les blocs vides. */
export function collectChiffresCles(acf: WPProjet["acf"]): ChiffreCle[] {
  const results: ChiffreCle[] = [];
  const rec = acf as unknown as ProjetAcfRecord;
  for (let i = 1; i <= 6; i++) {
    const titre = acfStr(rec, `cc${i}_titre`);
    const valeur = acfStr(rec, `cc${i}_valeur`);
    if (titre && valeur) {
      results.push({
        titre,
        valeur,
        icone: acfStr(rec, `cc${i}_icone`) || "",
      });
    }
  }
  return results;
}

/** Collecte les 5 champs image galerie en un tableau filtré. */
export function collectGalerieImages(
  acf: WPProjet["acf"],
): Array<{ id: number; url: string; alt: string; title: string }> {
  const images: Array<{ id: number; url: string; alt: string; title: string }> = [];
  const rec = acf as unknown as ProjetAcfRecord;
  for (let i = 1; i <= 5; i++) {
    const url = acfStr(rec, `galerie_${i}`);
    if (url) images.push({ id: i, url, alt: "", title: "" });
  }
  return images;
}

/**
 * Collecte les 8 blocs de phases en un tableau filtré.
 * Ignore les blocs dont le titre est vide.
 */
export function collectPhases(acf: WPProjet["acf"]): ProjetPhase[] {
  const results: ProjetPhase[] = [];
  const rec = acf as unknown as ProjetAcfRecord;
  for (let i = 1; i <= 8; i++) {
    const titre = acfStr(rec, `ph${i}_titre`);
    if (!titre?.trim()) continue;
    results.push({
      phase_titre: titre.trim(),
      phase_partenaires: acfNumArr(rec, `ph${i}_partenaires`),
      phase_date_debut: acfStr(rec, `ph${i}_date_debut`) || "",
      phase_date_fin: acfStr(rec, `ph${i}_date_fin`) || "",
      phase_pays: acfStrArr(rec, `ph${i}_pays`),
    });
  }
  return results;
}

/* ================================================================
   9. CPT - Partenaire / Plateforme / Communaute / Team
   ================================================================ */

/* ---------- Fetch Partenaires ---------- */

export async function fetchPartenaires(perPage = 100): Promise<WPPartenaire[]> {
  const partenaires = await wpFetch<WPPartenaire[]>(
    "/partenaire",
    { per_page: String(perPage), _embed: "true" },
    { fallback: [] },
  );
  return resolvePartenairesLogos(partenaires);
}

export async function fetchPartenairesByIds(ids: number[]): Promise<WPPartenaire[]> {
  if (!ids.length) return [];
  const partenaires = await wpFetch<WPPartenaire[]>(
    "/partenaire",
    { include: ids.join(","), per_page: String(ids.length), _embed: "true" },
    { fallback: [] },
  );
  return resolvePartenairesLogos(partenaires);
}

export function getPartenaireImageUrl(partenaire: WPPartenaire): string | null {
  const logo = partenaire.acf?.logo;
  if (typeof logo === "string" && logo) return logo;
  if (typeof logo === "object" && logo !== null) {
    const obj = logo as { url?: string; sizes?: { medium?: { url?: string } } };
    return obj.url || obj.sizes?.medium?.url || null;
  }
  return partenaire._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

/* ---------- Plateforme ---------- */

export interface WPPlateforme {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  plateforme_type: number[];
  acf: {
    url: string;
    projets?: number[];
  };
  _embedded?: WPEmbedMedia;
}

export async function fetchPlateformes(perPage = 100): Promise<WPPlateforme[]> {
  return wpFetch<WPPlateforme[]>(
    "/plateforme",
    { per_page: String(perPage), _embed: "true" },
    { fallback: [] },
  );
}

export async function fetchPlateformesByIds(ids: number[]): Promise<WPPlateforme[]> {
  if (!ids.length) return [];
  return wpFetch<WPPlateforme[]>(
    "/plateforme",
    { include: ids.join(","), per_page: String(ids.length), _embed: "true" },
    { fallback: [] },
  );
}

export function getPlateformeImageUrl(plateforme: WPPlateforme): string | null {
  return plateforme._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

/* ---------- Communaute ---------- */

export interface WPCommunaute {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  communaute_type: number[];
  acf: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  _embedded?: WPEmbedMedia;
}

export type WPCommunauteType = WPProgrammeType;

export async function fetchCommunautes(
  perPage = 100,
  communauteType?: number,
): Promise<WPCommunaute[]> {
  const params = new URLSearchParams({
    per_page: String(perPage),
    _embed: "true",
  });
  if (communauteType) params.set("communaute_type", String(communauteType));
  return wpFetch<WPCommunaute[]>("/communaute", params, { fallback: [] });
}

export async function fetchCommunauteTypes(): Promise<WPCommunauteType[]> {
  return wpFetch<WPCommunauteType[]>(
    "/communaute_type",
    { per_page: "100" },
    { fallback: [] },
  );
}

export function getCommunauteImageUrl(communaute: WPCommunaute): string | null {
  return communaute._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

/* ---------- Team ---------- */

export interface WPTeamMember {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  acf: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  _embedded?: WPEmbedMedia;
}

export async function fetchTeamMembers(perPage = 100): Promise<WPTeamMember[]> {
  return wpFetch<WPTeamMember[]>(
    "/team",
    { per_page: String(perPage), _embed: "true" },
    { fallback: [] },
  );
}

export function getTeamMemberImageUrl(member: WPTeamMember): string | null {
  return member._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

/* ---------- Timeline (CPT custom + endpoint /africtivistes/v1/timeline) ---------- */

export interface TimelineItem {
  id: number;
  year: string;
  title: string;
  description: string;
}

const TIMELINE_ENDPOINT = "https://update.africtivistes.org/wp-json/africtivistes/v1/timeline";

export async function fetchTimeline(lang: Lang): Promise<TimelineItem[]> {
  const url = `${TIMELINE_ENDPOINT}?lang=${encodeURIComponent(lang)}`;
  for (let attempt = 0; attempt <= DEFAULT_RETRY; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) {
        if (attempt === DEFAULT_RETRY) return [];
        continue;
      }
      const data = (await res.json()) as TimelineItem[];
      if (!Array.isArray(data)) return [];
      return data
        .filter((it) => it && it.year && it.title)
        .sort((a, b) => String(a.year).localeCompare(String(b.year)));
    } catch {
      clearTimeout(timer);
      if (attempt === DEFAULT_RETRY) return [];
    }
  }
  return [];
}

/* ================================================================
   10. MEDIA RESOLVER (avec cache global)
   ================================================================ */

const MEDIA_URL_CACHE = new Map<number, string>();

/**
 * Fetch les URLs de media WordPress par leurs IDs.
 * Utilise un cache global pour éviter les refetch.
 */
async function resolveMediaIds(ids: number[]): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  if (ids.length === 0) return result;

  const missing: number[] = [];
  for (const id of ids) {
    const cached = MEDIA_URL_CACHE.get(id);
    if (cached) result.set(id, cached);
    else missing.push(id);
  }

  if (missing.length === 0) return result;

  const medias = await wpFetch<Array<{ id: number; source_url: string }>>(
    "/media",
    {
      include: missing.join(","),
      per_page: String(missing.length),
      _fields: "id,source_url",
    },
    { fallback: [] },
  );
  for (const m of medias) {
    MEDIA_URL_CACHE.set(m.id, m.source_url);
    result.set(m.id, m.source_url);
  }
  return result;
}

/**
 * Collecte les IDs media dans les champs galerie_{N} d'un projet
 * et les résout en URLs (mutation in-place sur l'objet acf).
 */
async function resolveProjetMediaFields(acf: ProjetAcfRecord): Promise<void> {
  const ids: number[] = [];
  for (let i = 1; i <= 5; i++) {
    const v = acf[`galerie_${i}`];
    if (typeof v === "number" && v > 0) ids.push(v);
  }
  if (ids.length === 0) return;
  const urlMap = await resolveMediaIds(ids);
  for (let i = 1; i <= 5; i++) {
    const v = acf[`galerie_${i}`];
    if (typeof v === "number" && urlMap.has(v)) {
      acf[`galerie_${i}`] = urlMap.get(v);
    }
  }
}

/** Résout les logos media ID en URLs pour un tableau de partenaires (copie immuable). */
async function resolvePartenairesLogos(
  partenaires: WPPartenaire[],
): Promise<WPPartenaire[]> {
  const logoIds: number[] = [];
  for (const p of partenaires) {
    const logo = p.acf?.logo;
    if (typeof logo === "number" && logo > 0) {
      logoIds.push(logo);
    } else if (typeof logo === "object" && logo !== null) {
      const obj = logo as { ID?: number; url?: string };
      if (obj.ID && obj.ID > 0 && !obj.url) logoIds.push(obj.ID);
    }
  }
  if (logoIds.length === 0) return partenaires;
  const urlMap = await resolveMediaIds(logoIds);
  return partenaires.map((p) => {
    const logo = p.acf?.logo;
    if (typeof logo === "number" && urlMap.has(logo)) {
      return { ...p, acf: { ...p.acf, logo: urlMap.get(logo)! } };
    }
    if (typeof logo === "object" && logo !== null) {
      const obj = logo as { ID?: number; url?: string };
      if (obj.ID && urlMap.has(obj.ID)) {
        return { ...p, acf: { ...p.acf, logo: urlMap.get(obj.ID)! } };
      }
    }
    return p;
  });
}

/* ================================================================
   Types et constantes partagés pour les composants projet
   ================================================================ */

export interface PartnerOrg {
  name: string;
  logo: string;
  url: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  title: string;
}

/** Convertit des WPPartenaire en PartnerOrg pour les composants visuels. */
export function toPartnerOrgs(partenaires: WPPartenaire[]): PartnerOrg[] {
  return partenaires.map((p) => {
    const logo = p.acf?.logo;
    return {
      name: stripHtml(p.title.rendered),
      logo: typeof logo === "string" ? logo : "",
      url: p.acf?.url || "#",
    };
  });
}

/** Porteur du projet : toujours AfricTivistes */
export const AFRICTIVISTES_ORG: PartnerOrg = {
  name: "AfricTivistes",
  logo: logoAfrictivistes,
  url: "https://africtivistes.org",
};
