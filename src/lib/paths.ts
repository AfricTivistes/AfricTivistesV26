/**
 * Forme canonique des URL internes.
 *
 * Les pages prérendues sont générées en `build.format: "directory"`, donc Netlify
 * les sert à l'URL AVEC slash final (`/fr/about/`). Un lien vers `/fr/about`
 * déclenche un 301 dont le corps — « Document moved permanently » — s'affiche
 * brièvement dans la page, et fait rater le préfetch (c'est la 301 qui est mise en
 * cache, pas le document). Tous les liens internes passent donc par `langPath()`.
 *
 * `astro.config.mjs` garde volontairement `trailingSlash: "ignore"` : en mode
 * `output: "server"`, la valeur `"always"` ferait répondre Astro avec sa propre page
 * « Redirecting from … to … », exactement le symptôme qu'on supprime ici.
 */

export type Lang = "fr" | "en";

/** True pour les URL qu'il ne faut ni préfixer ni normaliser. */
function isExternalOrAnchor(path: string): boolean {
  if (!path) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return true; // http:, mailto:, tel:, …
  if (path.startsWith("//")) return true; // protocol-relative
  if (path.startsWith("#")) return true; // ancre pure
  return false;
}

/** Ajoute le slash final à un chemin interne, en préservant `?query` et `#hash`. */
export function ensureTrailingSlash(path: string): string {
  if (isExternalOrAnchor(path) || !path.startsWith("/")) return path;
  const [, base = "", rest = ""] = path.match(/^([^?#]*)([?#].*)?$/) ?? [];
  if (base.endsWith("/")) return path;
  // Fichier statique de /public (favicon.svg, un .pdf…) : pas de slash.
  if ((base.split("/").pop() ?? "").includes(".")) return path;
  return `${base}/${rest}`;
}

/** Chemin interne préfixé par la langue, sous sa forme canonique. */
export function langPath(lang: Lang, path: string): string {
  if (isExternalOrAnchor(path)) return path;
  if (!path.startsWith("/")) return path;
  if (path === "/") return `/${lang}/`;
  if (path === `/${lang}` || path.startsWith(`/${lang}/`)) return ensureTrailingSlash(path);
  // Fichier servi depuis /public (un .pdf du kit presse…) : jamais préfixé.
  const base = path.split(/[?#]/)[0];
  if ((base.split("/").pop() ?? "").includes(".")) return path;
  return ensureTrailingSlash(`/${lang}${path}`);
}
