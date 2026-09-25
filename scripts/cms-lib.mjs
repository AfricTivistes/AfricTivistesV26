/**
 * Shared helpers for the CMS consistency tooling.
 *
 * The Decap configs (`public/admin/config-*.yml`) and the JSON content under
 * `src/data/` encode the same information twice. These helpers read both sides
 * and reduce them to comparable shapes so `cms-check.mjs` can diff them and
 * `cms-gen.mjs` can regenerate the derivable half.
 *
 * Vocabulary (see the skill's references/conventions.md):
 *  - Shape A: `src/data/translations/*.json` — `_grp_*` groups of translatable
 *    keys (`{ fr, en, … }`) plus untranslated `_img_*` strings. Fully
 *    mechanical, so it can be generated.
 *  - Shape B: everything else (thematiques, testimonials, playlists) — bespoke
 *    structures with lists, numbers and hidden fields. Hand-maintained.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));

export const CONFIG_FULL = "public/admin/config-full.yml";
export const CONFIG_RESTRICTED = "public/admin/config-restricted.yml";
export const TRANSLATIONS_DIR = "src/data/translations";
export const I18N_FILE = "src/lib/i18n.tsx";

/**
 * Languages the project ships, default first.
 *
 * This MUST match `LANGS` in `src/lib/i18n.tsx` — the skill rewrites both from
 * its `languages` arg. `readI18nLangs()` reads the runtime's list so
 * `cms-check` can fail loudly if the two ever drift apart, which is the failure
 * mode that makes a 3+ language setup silently lose translations.
 */
export const LANGS = ["fr", "en"];
export const DEFAULT_LANG = LANGS[0];

/**
 * Human labels for the per-language sub-fields in the Decap forms.
 * Unknown codes fall back to the code itself — extend as needed.
 */
export const LANG_LABELS = {
  fr: "Français",
  en: "English",
  pt: "Português",
  es: "Español",
  ar: "العربية",
  sw: "Kiswahili",
};

/** RTL scripts — these need `dir="rtl"` in the layout; the skill does not add it. */
export const RTL_LANGS = new Set(["ar", "he", "fa", "ur"]);

/**
 * Values longer than this get a `text` (multiline) widget instead of `string`.
 *
 * Calibrated against the 436 hand-authored field pairs in config-full.yml:
 * `string` values top out at 119 chars (p99 = 80) and `text` values start at
 * 84, so 80 reproduces the human choice on 434/436 fields. Other candidates
 * were markedly worse (60 → 21 mismatches, 120 → 19), so this is the value
 * that keeps regeneration churn-free.
 */
export const TEXT_WIDGET_THRESHOLD = 80;

export const abs = (p) => join(ROOT, p);
export const rel = (p) => relative(ROOT, p);

export function readJson(p) {
  return JSON.parse(readFileSync(abs(p), "utf8"));
}

export function readYaml(p) {
  return yaml.load(readFileSync(abs(p), "utf8"));
}

/** Every `src/data/translations/*.json`, as repo-relative paths, sorted. */
export function listTranslationFiles() {
  return readdirSync(abs(TRANSLATIONS_DIR))
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => `${TRANSLATIONS_DIR}/${f}`);
}

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/**
 * Flatten one Shape A JSON file into the pieces the CMS form must expose.
 *
 * Returns `{ groups, keys, images, malformed }` where `groups` preserves file
 * order (Decap renders fields in config order, so order matters for the diff),
 * `keys` maps a translation key to the languages it defines, and `malformed`
 * collects entries that are neither a translatable object nor an `_img_*`
 * string — these are what `cms-check` reports as content errors.
 */
export function parseSection(file) {
  const data = readJson(file);
  const groups = [];
  const keys = new Map();
  const images = new Map();
  const malformed = [];

  for (const [groupKey, groupVal] of Object.entries(data)) {
    if (!groupKey.startsWith("_grp_")) {
      malformed.push({ path: groupKey, reason: "top-level key is not a _grp_* group" });
      continue;
    }
    if (!isPlainObject(groupVal)) {
      malformed.push({ path: groupKey, reason: "group is not an object" });
      continue;
    }

    const group = {
      name: groupKey,
      label: typeof groupVal._label === "string" ? groupVal._label : groupKey,
      entries: [],
    };

    for (const [key, val] of Object.entries(groupVal)) {
      if (key === "_label") continue;

      if (key.startsWith("_img_")) {
        if (typeof val !== "string") {
          malformed.push({ path: `${groupKey}.${key}`, reason: "_img_* must be a string URL" });
          continue;
        }
        images.set(key, val);
        group.entries.push({ kind: "image", name: key, value: val });
        continue;
      }

      // Arrays are Shape B data embedded in a Shape A file (e.g.
      // initiatives.json's `initiatives.stats` list of {value,labelFr,labelEn}).
      // The i18n flattener ignores them, and no JSON shape implies their CMS
      // field definition — so they are passed through: the generator re-emits
      // whatever the config already declares, and never invents or deletes one.
      if (Array.isArray(val)) {
        group.entries.push({ kind: "passthrough", name: key });
        continue;
      }

      if (!isPlainObject(val)) {
        malformed.push({
          path: `${groupKey}.${key}`,
          reason: "translatable value must be an object with one key per language",
        });
        continue;
      }

      const present = LANGS.filter((l) => typeof val[l] === "string");
      const missing = LANGS.filter((l) => typeof val[l] !== "string");
      // Sub-keys that are not languages. Some values are hybrids: stats.json
      // carries `value` (number) and `suffix` alongside fr/en. These are real
      // data, not errors, so they are surfaced as `aux` for the generator to
      // re-emit — dropping them would silently delete numbers on regeneration.
      const aux = Object.keys(val)
        .filter((k) => !LANGS.includes(k))
        .map((k) => ({ name: k, value: val[k], type: typeof val[k] }));

      keys.set(key, { present, missing, aux, values: val });
      group.entries.push({ kind: "text", name: key, present, missing, aux, values: val });
    }

    groups.push(group);
  }

  return { file, groups, keys, images, malformed };
}

/** All Shape A sections, keyed by repo-relative file path. */
export function parseAllSections() {
  const map = new Map();
  for (const file of listTranslationFiles()) map.set(file, parseSection(file));
  return map;
}

/**
 * Index a Decap config by the `file:` each entry targets.
 *
 * Returns a Map of file path → `{ name, label, fields, groups, keys, images }`,
 * where `groups`/`keys`/`images` are only populated for entries shaped like
 * Shape A (a flat list of `_grp_*` object fields). Entries that don't match
 * that shape are still returned, with `shapeA: false`, so the caller can skip
 * them instead of misreading them.
 */
export function indexConfig(configPath) {
  const cfg = readYaml(configPath);
  const byFile = new Map();
  // Verbatim source lines per field name, so the generator can copy through
  // field definitions it cannot derive (list widgets, hand-tuned options).
  const rawFieldLines = collectRawFieldLines(configPath);

  for (const collection of cfg?.collections ?? []) {
    for (const entry of collection.files ?? []) {
      if (!entry?.file) continue;

      const fields = entry.fields ?? [];
      const groups = [];
      const keys = new Map();
      const images = new Map();

      // Shape A iff every top-level field is a `_grp_*` object field.
      const shapeA =
        fields.length > 0 &&
        fields.every((f) => f?.widget === "object" && typeof f.name === "string" && f.name.startsWith("_grp_"));

      if (shapeA) {
        for (const group of fields) {
          const g = { name: group.name, label: group.label ?? group.name, entries: [] };
          for (const f of group.fields ?? []) {
            if (typeof f?.name !== "string") continue;
            if (f.name.startsWith("_img_")) {
              images.set(f.name, f);
              g.entries.push({ kind: "image", name: f.name, field: f });
            } else if (f.widget === "object") {
              const langs = (f.fields ?? []).map((sf) => sf?.name).filter(Boolean);
              keys.set(f.name, { langs, field: f });
              g.entries.push({ kind: "text", name: f.name, langs, field: f });
            }
          }
          groups.push(g);
        }
      }

      byFile.set(entry.file, {
        name: entry.name,
        label: entry.label,
        collection: collection.name,
        fields,
        shapeA,
        groups,
        keys,
        images,
        rawFieldLines,
      });
    }
  }

  return { config: cfg, byFile };
}

/**
 * Map each `name: "…"` field in a config to its verbatim source lines.
 *
 * A field block starts at the `- label:`/`- name:` line introducing it and runs
 * until the next line at the same or shallower indent. Used to copy through
 * definitions the generator cannot derive, preserving formatting exactly.
 */
function collectRawFieldLines(configPath) {
  const lines = readFileSync(abs(configPath), "utf8").split("\n");
  const map = new Map();

  for (let i = 0; i < lines.length; i++) {
    // Only multi-line block fields need preserving; inline `{ … }` flow fields
    // are re-rendered from the parsed tree.
    const m = lines[i].match(/^(\s*)- label:\s*.+$/);
    if (!m) continue;
    const indent = m[1].length;

    // The field's `name:` sits in the following lines at indent + 2.
    let name = null;
    for (let j = i + 1; j < lines.length; j++) {
      const li = lines[j].match(/^\s*/)[0].length;
      if (li <= indent) break;
      const nm = lines[j].match(/^\s*name:\s*"([^"]+)"\s*$/);
      if (nm && li === indent + 2) {
        name = nm[1];
        break;
      }
    }
    if (!name) continue;

    let end = lines.length;
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() === "") continue;
      if (lines[j].match(/^\s*/)[0].length <= indent) {
        end = j;
        break;
      }
    }
    map.set(name, lines.slice(i, end));
  }

  return map;
}

/** Section files registered in i18n.tsx (so `t()` can actually see them). */
/**
 * Read the language list the i18n runtime actually uses.
 *
 * Supports both shapes this skill produces:
 *   export const LANGS = ["fr", "en"] as const;   // generic (template)
 *   export type Lang = "fr" | "en";               // hardcoded (older projects)
 *
 * Returns `null` if neither is found, so the caller can warn rather than crash.
 */
export function readI18nLangs() {
  const src = readFileSync(abs(I18N_FILE), "utf8");

  const arr = src.match(/export\s+const\s+LANGS\s*=\s*\[([^\]]+)\]/);
  if (arr) {
    return arr[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  const union = src.match(/export\s+type\s+Lang\s*=\s*([^;]+);/);
  if (union) {
    const codes = [...union[1].matchAll(/["']([\w-]+)["']/g)].map((m) => m[1]);
    if (codes.length) return codes;
  }

  return null;
}

export function parseI18nRegistrations() {
  const src = readFileSync(abs(I18N_FILE), "utf8");

  const imports = new Map(); // local identifier → repo-relative json path
  const importRe = /import\s+(\w+)\s+from\s+["']@\/(data\/translations\/[\w.-]+\.json)["']/g;
  for (const m of src.matchAll(importRe)) imports.set(m[1], `src/${m[2]}`);

  // The `sections` array is what the flattening loop actually walks.
  const arrayMatch = src.match(/const\s+sections\s*=\s*\[([\s\S]*?)\]/);
  const listed = new Set();
  if (arrayMatch) {
    for (const ident of arrayMatch[1].split(/[,\s]+/).filter(Boolean)) {
      if (imports.has(ident)) listed.add(imports.get(ident));
    }
  }

  return { imports, listed, hasSectionsArray: Boolean(arrayMatch) };
}

/**
 * Translation keys referenced anywhere in `src/`.
 *
 * Keys do not only appear as `t("key")`. This codebase also threads them
 * through props and config objects — `<SectionHeader labelKey="about.x" />`,
 * `{ href: "/about", labelKey: "nav.about" }` — so a `t(…)`-only scan reports
 * hundreds of false "unused" keys. We therefore match three idioms:
 *
 *   1. direct calls:      t("key")  /  translate("key", lang)
 *   2. *Key JSX props:    labelKey="key"   labelKey={"key"}
 *   3. *Key properties:   labelKey: "key"
 *
 * Keys built at runtime (template literals, concatenation) remain invisible to
 * any static scan, which is why "unused" is reported as a warning, never an
 * error.
 */
export function collectUsedKeys(dir = "src") {
  const used = new Map(); // key → Set of files
  const skip = new Set(["node_modules", "dist", ".astro", "assets"]);

  const PATTERNS = [
    /\b(?:t|translate)\(\s*["'`]([^"'`]+)["'`]/g, // t("key") / translate("key")
    /\b\w*Key\s*=\s*\{?\s*["']([^"']+)["']/g, //     labelKey="key" / ={"key"}
    /\b\w*Key\s*:\s*["']([^"']+)["']/g, //           labelKey: "key"
  ];

  const walk = (d) => {
    for (const de of readdirSync(abs(d), { withFileTypes: true })) {
      if (skip.has(de.name)) continue;
      const p = `${d}/${de.name}`;
      if (de.isDirectory()) {
        walk(p);
      } else if (/\.(astro|tsx?|jsx?|mjs)$/.test(de.name)) {
        const src = readFileSync(abs(p), "utf8");
        for (const re of PATTERNS) {
          for (const m of src.matchAll(re)) {
            if (!used.has(m[1])) used.set(m[1], new Set());
            used.get(m[1]).add(p);
          }
        }
      }
    }
  };

  walk(dir);
  return used;
}

/** Pick the Decap widget for a translatable value, from its longest variant. */
export function widgetFor(values) {
  const longest = Math.max(0, ...LANGS.map((l) => (typeof values?.[l] === "string" ? values[l].length : 0)));
  return longest > TEXT_WIDGET_THRESHOLD || /\n/.test(values?.[DEFAULT_LANG] ?? "") ? "text" : "string";
}
