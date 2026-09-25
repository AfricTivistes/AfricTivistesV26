#!/usr/bin/env node
/**
 * cms-check — consistency checks across JSON content, Decap configs and i18n.
 *
 * The same content is described in three places: the JSON files under
 * `src/data/translations/`, the two Decap configs, and the `sections` array in
 * `src/lib/i18n.tsx`. Nothing enforced their agreement, and every failure mode
 * was silent: a key missing from the config is simply invisible in the CMS, and
 * a key missing from the JSON renders as its own name (`t()` falls back to the
 * key) without failing the build.
 *
 * This script makes those failures loud. Exit code 1 on any error, 0 otherwise
 * (warnings never fail the run).
 *
 * Usage:
 *   node scripts/cms-check.mjs            # errors + warnings
 *   node scripts/cms-check.mjs --quiet    # errors only
 *   node scripts/cms-check.mjs --json     # machine-readable report
 */

import {
  CONFIG_FULL,
  CONFIG_RESTRICTED,
  LANGS,
  RTL_LANGS,
  collectUsedKeys,
  indexConfig,
  parseAllSections,
  parseI18nRegistrations,
  readI18nLangs,
} from "./cms-lib.mjs";

const args = new Set(process.argv.slice(2));
const QUIET = args.has("--quiet");
const AS_JSON = args.has("--json");

const errors = [];
const warnings = [];
const err = (check, message, detail) => errors.push({ check, message, detail });
const warn = (check, message, detail) => warnings.push({ check, message, detail });

const sections = parseAllSections();
const full = indexConfig(CONFIG_FULL);
const restricted = indexConfig(CONFIG_RESTRICTED);
const i18n = parseI18nRegistrations();

// ---------------------------------------------------------------------------
// 0. Language list agreement — the tooling and the runtime must agree
//
// This is the check that makes a 3+ language setup safe. If i18n.tsx knows
// about `pt` but this script does not, every `pt` value passes unvalidated and
// ships empty; the reverse silently drops a language from the CMS forms.
// ---------------------------------------------------------------------------
const runtimeLangs = readI18nLangs();
if (!runtimeLangs) {
  warn("lang-detect", `Could not read LANGS or \`type Lang\` from src/lib/i18n.tsx — language drift unchecked`);
} else if (runtimeLangs.join(",") !== LANGS.join(",")) {
  err("lang-drift", `Language mismatch: i18n.tsx has [${runtimeLangs.join(", ")}], cms-lib.mjs has [${LANGS.join(", ")}]`);
}

const rtl = LANGS.filter((l) => RTL_LANGS.has(l));
if (rtl.length) {
  warn(
    "rtl-language",
    `${rtl.join(", ")} require RTL support — set dir="rtl" in the layout and audit Tailwind logical properties (not automated)`,
  );
}

// ---------------------------------------------------------------------------
// 1. JSON well-formedness — values must be per-language objects or _img_ URLs
// ---------------------------------------------------------------------------
for (const [file, section] of sections) {
  for (const m of section.malformed) {
    err("json-shape", `${file}: ${m.path} — ${m.reason}`);
  }
  for (const [key, info] of section.keys) {
    if (info.missing.length) {
      err("json-missing-lang", `${file}: "${key}" missing ${info.missing.join(", ")}`);
    }
    // `aux` sub-keys (e.g. stats.json's numeric `value` / `suffix`) are a
    // legitimate hybrid, not a typo'd language code — only report them if the
    // config has no matching field, which the config diff below already covers.
  }
}

// ---------------------------------------------------------------------------
// 2. Duplicate keys across sections — the flattener is last-write-wins, so a
//    duplicate silently shadows an earlier definition.
// ---------------------------------------------------------------------------
const keyOwners = new Map();
for (const [file, section] of sections) {
  for (const key of section.keys.keys()) {
    if (!keyOwners.has(key)) keyOwners.set(key, []);
    keyOwners.get(key).push(file);
  }
}
for (const [key, files] of keyOwners) {
  if (files.length > 1) {
    err("duplicate-key", `"${key}" defined in ${files.length} sections`, files);
  }
}

// ---------------------------------------------------------------------------
// 3. i18n.tsx registration — an unregistered section is invisible to t()
// ---------------------------------------------------------------------------
if (!i18n.hasSectionsArray) {
  err("i18n-parse", `Could not find the \`sections\` array in src/lib/i18n.tsx`);
} else {
  for (const file of sections.keys()) {
    if (!i18n.listed.has(file)) {
      err(
        "i18n-unregistered",
        `${file} is not in the \`sections\` array of src/lib/i18n.tsx — its keys resolve to themselves`,
      );
    }
  }
  for (const file of i18n.listed) {
    if (!sections.has(file)) {
      err("i18n-dangling", `src/lib/i18n.tsx registers ${file}, which does not exist`);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. JSON ↔ config-full — every editable value needs a form field
// ---------------------------------------------------------------------------
for (const [file, section] of sections) {
  const entry = full.byFile.get(file);
  if (!entry) {
    err("config-missing-file", `${file} has no \`file:\` entry in ${CONFIG_FULL} — not editable in the CMS`);
    continue;
  }
  if (!entry.shapeA) {
    warn("config-not-shape-a", `${file} is in ${CONFIG_FULL} but its fields are not a flat list of _grp_* groups`);
    continue;
  }

  for (const [key, info] of section.keys) {
    const cfgKey = entry.keys.get(key);
    if (!cfgKey) {
      err("config-missing-key", `${file}: "${key}" is in the JSON but has no field in ${CONFIG_FULL}`);
      continue;
    }
    const missingLangs = LANGS.filter((l) => !cfgKey.langs.includes(l));
    if (missingLangs.length) {
      err("config-missing-lang", `${file}: "${key}" lacks ${missingLangs.join(", ")} sub-field(s) in ${CONFIG_FULL}`);
    }
  }
  for (const key of entry.keys.keys()) {
    if (!section.keys.has(key)) {
      err("config-orphan-key", `${CONFIG_FULL}: "${key}" (${file}) has a field but no JSON value`);
    }
  }
  for (const img of section.images.keys()) {
    if (!entry.images.has(img)) {
      err("config-missing-image", `${file}: "${img}" is in the JSON but has no field in ${CONFIG_FULL}`);
    }
  }
  for (const img of entry.images.keys()) {
    if (!section.images.has(img)) {
      err("config-orphan-image", `${CONFIG_FULL}: "${img}" (${file}) has a field but no JSON value`);
    }
  }

  // Group ordering: Decap renders in config order, so drift is a real UX bug.
  const jsonGroups = section.groups.map((g) => g.name);
  const cfgGroups = entry.groups.map((g) => g.name);
  if (jsonGroups.join("|") !== cfgGroups.join("|")) {
    const onlyJson = jsonGroups.filter((g) => !cfgGroups.includes(g));
    const onlyCfg = cfgGroups.filter((g) => !jsonGroups.includes(g));
    if (onlyJson.length || onlyCfg.length) {
      err("group-mismatch", `${file}: group sets differ`, { onlyJson, onlyCfg });
    } else {
      warn("group-order", `${file}: groups are in a different order in ${CONFIG_FULL}`, { jsonGroups, cfgGroups });
    }
  }
}

// ---------------------------------------------------------------------------
// 5. restricted ⊂ full, with identical field definitions
// ---------------------------------------------------------------------------
for (const [file, rEntry] of restricted.byFile) {
  const fEntry = full.byFile.get(file);
  if (!fEntry) {
    err("restricted-not-subset", `${CONFIG_RESTRICTED} exposes ${file}, absent from ${CONFIG_FULL}`);
    continue;
  }
  if (!rEntry.shapeA || !fEntry.shapeA) continue;

  for (const [key, rKey] of rEntry.keys) {
    const fKey = fEntry.keys.get(key);
    if (!fKey) {
      err("restricted-extra-key", `${CONFIG_RESTRICTED}: "${key}" (${file}) is not in ${CONFIG_FULL}`);
      continue;
    }
    // Identical definitions matter: a widget mismatch lets a restricted editor
    // save a shape the code (or the admin form) does not expect.
    const rw = JSON.stringify((rKey.field.fields ?? []).map((f) => [f.name, f.widget]));
    const fw = JSON.stringify((fKey.field.fields ?? []).map((f) => [f.name, f.widget]));
    if (rw !== fw) {
      err("restricted-field-drift", `"${key}" (${file}) has different sub-field definitions in the two configs`, {
        restricted: rw,
        full: fw,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// 5b. Shape B entries — per-language sub-fields nothing regenerates
//
// cms-gen only rewrites Shape A. A Shape B entry (a `list` of domain objects)
// also carries per-language sub-fields, written by hand. Adding a language
// leaves those behind silently: editors get no field for the new code, so the
// value can never be filled in and renders via the default-language fallback.
// Walk every Shape B field tree and flag object fields that look per-language
// but are missing a code.
// ---------------------------------------------------------------------------
const LANG_SET = new Set(LANGS);
for (const [configPath, idx] of [
  [CONFIG_FULL, full],
  [CONFIG_RESTRICTED, restricted],
]) {
  for (const [file, entry] of idx.byFile) {
    if (entry.shapeA) continue; // Shape A is generated and already checked

    const visit = (fields, path) => {
      for (const f of fields ?? []) {
        const sub = f?.fields ?? (f?.field ? [f.field] : null);
        if (!sub) continue;
        const names = sub.map((sf) => sf?.name).filter(Boolean);
        // Per-language iff it mentions at least one known code and nothing else.
        const hit = names.filter((n) => LANG_SET.has(n));
        if (hit.length && names.every((n) => LANG_SET.has(n))) {
          const missing = LANGS.filter((l) => !names.includes(l));
          if (missing.length) {
            err(
              "shapeb-missing-lang",
              `${configPath}: ${file} → ${path}${f.name ?? "?"} lacks ${missing.join(", ")} sub-field(s) (hand-maintained; cms-gen does not touch Shape B)`,
            );
          }
        }
        visit(sub, `${path}${f.name ?? "?"}.`);
      }
    };
    visit(entry.fields, "");
  }
}

// Decap `summary:` templates reference a language explicitly
// (e.g. "{{fields.title.fr}}"); flag ones pointing at a code we no longer ship.
for (const [configPath, idx] of [
  [CONFIG_FULL, full],
  [CONFIG_RESTRICTED, restricted],
]) {
  for (const [file, entry] of idx.byFile) {
    const scan = (fields) => {
      for (const f of fields ?? []) {
        if (typeof f?.summary === "string") {
          for (const m of f.summary.matchAll(/\{\{fields\.[\w.]*?\.(\w+)\}\}/g)) {
            if (!LANG_SET.has(m[1]) && /^[a-z]{2}(-[A-Z]{2})?$/.test(m[1])) {
              warn(
                "summary-stale-lang",
                `${configPath}: ${file} → summary "${f.summary}" references "${m[1]}", not in [${LANGS.join(", ")}]`,
              );
            }
          }
        }
        scan(f?.fields ?? (f?.field ? [f.field] : null));
      }
    };
    scan(entry.fields);
  }
}

for (const backendKey of ["backend", "media_folder", "public_folder"]) {
  const a = JSON.stringify(full.config?.[backendKey]);
  const b = JSON.stringify(restricted.config?.[backendKey]);
  if (a !== b) {
    err("config-header-drift", `\`${backendKey}\` differs between the two configs`, { full: a, restricted: b });
  }
}

if (full.config?.local_backend) {
  err("local-backend", `${CONFIG_FULL} still has \`local_backend\` enabled — remove before shipping`);
}
if (restricted.config?.local_backend) {
  err("local-backend", `${CONFIG_RESTRICTED} still has \`local_backend\` enabled — remove before shipping`);
}

// ---------------------------------------------------------------------------
// 6. Unused keys (warning only — a key may be built dynamically)
// ---------------------------------------------------------------------------
const used = collectUsedKeys();
const defined = new Set(keyOwners.keys());
const unused = [...defined].filter((k) => !used.has(k)).sort();
if (unused.length) {
  warn("unused-key", `${unused.length} translation key(s) never referenced via t("…")`, unused);
}
const undefinedUsed = [...used.keys()].filter((k) => !defined.has(k) && !k.includes("{")).sort();
if (undefinedUsed.length) {
  warn(
    "undefined-key",
    `${undefinedUsed.length} key(s) used via t("…") with no definition — they render as their own name`,
    undefinedUsed.map((k) => `${k}  ← ${[...used.get(k)].join(", ")}`),
  );
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
if (AS_JSON) {
  console.log(JSON.stringify({ errors, warnings }, null, 2));
  process.exit(errors.length ? 1 : 0);
}

const fmt = (list, symbol) => {
  const byCheck = new Map();
  for (const item of list) {
    if (!byCheck.has(item.check)) byCheck.set(item.check, []);
    byCheck.get(item.check).push(item);
  }
  for (const [check, items] of byCheck) {
    console.log(`\n${symbol} ${check} (${items.length})`);
    for (const it of items.slice(0, 40)) {
      console.log(`   ${it.message}`);
      if (it.detail && !Array.isArray(it.detail)) {
        console.log(`     ${JSON.stringify(it.detail)}`);
      } else if (Array.isArray(it.detail)) {
        for (const d of it.detail.slice(0, 12)) console.log(`     - ${d}`);
        if (it.detail.length > 12) console.log(`     … and ${it.detail.length - 12} more`);
      }
    }
    if (items.length > 40) console.log(`   … and ${items.length - 40} more`);
  }
};

console.log(`cms-check — ${sections.size} section(s), languages: ${LANGS.join(", ")}`);

if (errors.length) fmt(errors, "✗");
if (warnings.length && !QUIET) fmt(warnings, "!");

console.log(
  `\n${errors.length ? "✗" : "✓"} ${errors.length} error(s), ${warnings.length} warning(s)` +
    (QUIET && warnings.length ? " (warnings hidden)" : ""),
);

process.exit(errors.length ? 1 : 0);
