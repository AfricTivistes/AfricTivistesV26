#!/usr/bin/env node
/**
 * cms-gen — regenerate the Shape A half of the Decap configs from the JSON.
 *
 * Why this exists: each translatable key costs ~7 lines of YAML, duplicated
 * across config-full.yml and config-restricted.yml. At 430+ keys that is
 * ~3700 lines per config, hand-maintained, with no way to notice drift. This
 * script derives those lines from the JSON — the single source of truth — so
 * adding a key means editing one JSON file.
 *
 * Scope, deliberately narrow:
 *  - It regenerates ONLY entries whose `file:` points at
 *    `src/data/translations/*.json` AND whose existing fields are a flat list
 *    of `_grp_*` object groups (Shape A).
 *  - Shape B entries (thematiques, testimonials, playlists) carry bespoke
 *    lists, numbers and hidden fields that no JSON shape implies. They are
 *    copied through byte-for-byte.
 *  - Entry order, `name`, and which files appear in the restricted config are
 *    all preserved from the current YAML. This script never decides policy —
 *    it only rewrites the mechanical part.
 *
 * Usage:
 *   node scripts/cms-gen.mjs --check    # exit 1 if configs are out of date
 *   node scripts/cms-gen.mjs --diff     # show what would change
 *   node scripts/cms-gen.mjs --write    # rewrite the configs in place
 */

import { readFileSync, writeFileSync } from "node:fs";
import {
  CONFIG_FULL,
  CONFIG_RESTRICTED,
  LANGS,
  LANG_LABELS,
  TRANSLATIONS_DIR,
  abs,
  indexConfig,
  parseSection,
  widgetFor,
} from "./cms-lib.mjs";

const args = new Set(process.argv.slice(2));
const MODE = args.has("--write") ? "write" : args.has("--diff") ? "diff" : "check";

/** Quote a YAML scalar the conservative way: always double-quote, escape. */
const q = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

/**
 * Render one Shape A entry's `fields:` block.
 *
 * Mirrors the hand-written conventions of the existing config so regeneration
 * produces minimal churn:
 *  - groups are `widget: object`, `collapsed: true`, labelled from `_label`
 *    with a "(n)" count suffix
 *  - image fields get a 🖼 prefix and camelCase split into words
 *  - a translatable key renders as an object with one sub-field per language,
 *    `string` or `text` depending on value length
 */
function renderFields(section, indent = "        ", existing = null) {
  const I = (n) => indent + "  ".repeat(n);
  const out = [];

  // Preserve the order the editors already see. JSON object order and config
  // order have drifted apart over time, and Decap renders fields in config
  // order — so reordering the form is a user-visible change we must not make
  // as a side effect of regeneration. New items (absent from the config) are
  // appended at the end of their group.
  const orderOf = (list, key) => {
    const i = list.indexOf(key);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const groups = [...section.groups];
  if (existing) {
    const cfgGroupOrder = existing.groups.map((g) => g.name);
    groups.sort((a, b) => orderOf(cfgGroupOrder, a.name) - orderOf(cfgGroupOrder, b.name));
    for (const g of groups) {
      const cfgGroup = existing.groups.find((eg) => eg.name === g.name);
      if (!cfgGroup) continue;
      const cfgEntryOrder = cfgGroup.entries.map((e) => e.name);
      g.entries = [...g.entries].sort(
        (a, b) => orderOf(cfgEntryOrder, a.name) - orderOf(cfgEntryOrder, b.name),
      );
    }
  }

  for (const group of groups) {
    const count = group.entries.length;
    out.push(`${I(0)}- label: ${q(`${group.label} (${count})`)}`);
    out.push(`${I(1)}name: ${q(group.name)}`);
    out.push(`${I(1)}widget: object`);
    out.push(`${I(1)}collapsed: true`);
    out.push(`${I(1)}fields:`);

    for (const entry of group.entries) {
      // Embedded Shape B data (a JSON array inside a Shape A file): copy the
      // config's existing field block verbatim. We cannot derive it, so the
      // only safe options are "keep" or "destroy" — we keep.
      if (entry.kind === "passthrough") {
        const raw = existing?.rawFieldLines?.get(entry.name);
        if (raw) out.push(...raw);
        else
          out.push(
            `${I(2)}# NOTE: "${entry.name}" is a list in the JSON with no field in this config.`,
            `${I(2)}#       Add one by hand — cms-gen cannot derive list fields.`,
          );
        continue;
      }

      if (entry.kind === "image") {
        // "_img_backgroundWebp" → "🖼 background Webp"
        const pretty = entry.name
          .replace(/^_img_/, "")
          .replace(/([a-z0-9])([A-Z])/g, "$1 $2");
        out.push(`${I(2)}- { label: ${q(`🖼 ${pretty}`)}, name: ${q(entry.name)}, widget: image }`);
        continue;
      }

      // Short label: the key's last dotted segment, as the hand-written config does.
      const label = entry.name.split(".").pop();
      const widget = widgetFor(entry.values);
      out.push(`${I(2)}- label: ${q(label)}`);
      out.push(`${I(3)}name: ${q(entry.name)}`);
      out.push(`${I(3)}widget: object`);
      out.push(`${I(3)}fields:`);
      for (const l of LANGS) {
        out.push(`${I(4)}- { label: ${q(LANG_LABELS[l] ?? l)}, name: ${q(l)}, widget: ${widget} }`);
      }
      // Hybrid values (stats.json: numeric `value`, `suffix`) keep their extra
      // sub-fields. Reuse the config's own field definition when one exists so
      // hand-tuned labels and options (value_type, required) survive; only fall
      // back to inference for sub-keys the config doesn't describe yet.
      for (const aux of entry.aux ?? []) {
        const cfgField = existing?.keys
          .get(entry.name)
          ?.field?.fields?.find((sf) => sf?.name === aux.name);
        if (cfgField) {
          // `widget` / `value_type` are YAML enums, written bare in the
          // hand-authored config; quoting them would churn every line.
          const BARE = new Set(["widget", "value_type"]);
          const parts = Object.entries(cfgField).map(([k, v]) => {
            if (typeof v !== "string") return `${k}: ${JSON.stringify(v)}`;
            return BARE.has(k) ? `${k}: ${v}` : `${k}: ${q(v)}`;
          });
          out.push(`${I(4)}- { ${parts.join(", ")} }`);
        } else {
          const w = aux.type === "number" ? "number" : "string";
          const extra = w === "number" ? ", value_type: int" : ", required: false";
          out.push(`${I(4)}- { label: ${q(aux.name)}, name: ${q(aux.name)}, widget: ${w}${extra} }`);
        }
      }
    }
  }

  return out;
}

/**
 * Rewrite a config file, replacing each Shape A entry's field block in place.
 *
 * Works on raw text rather than a YAML round-trip on purpose: dumping the
 * parsed tree would reformat the untouched Shape B entries (losing their inline
 * flow style and comments) and produce an unreviewable diff.
 */
function regenerate(configPath) {
  const original = readFileSync(abs(configPath), "utf8");
  const lines = original.split("\n");
  const { byFile } = indexConfig(configPath);

  // Locate every `file:` line and the `fields:` block that follows it.
  const targets = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*)file:\s*"([^"]+)"\s*$/);
    if (!m) continue;
    const [, fileIndent, filePath] = m;

    if (!filePath.startsWith(`${TRANSLATIONS_DIR}/`)) continue;
    const entry = byFile.get(filePath);
    if (!entry?.shapeA) continue; // never touch Shape B

    // The `fields:` key sits at the same indent as `file:`.
    let fieldsLine = -1;
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() === "") continue;
      const indent = lines[j].match(/^\s*/)[0].length;
      if (indent <= fileIndent.length - 2) break; // left the entry
      if (lines[j].trim() === "fields:" && indent === fileIndent.length) {
        fieldsLine = j;
        break;
      }
    }
    if (fieldsLine === -1) continue;

    // The block runs until a line indented at or below `fields:`.
    let end = lines.length;
    for (let j = fieldsLine + 1; j < lines.length; j++) {
      if (lines[j].trim() === "") continue;
      const indent = lines[j].match(/^\s*/)[0].length;
      if (indent <= fileIndent.length) {
        end = j;
        break;
      }
    }

    targets.push({ filePath, fieldsLine, end, childIndent: " ".repeat(fileIndent.length + 2) });
  }

  // Apply back-to-front so earlier indices stay valid.
  let out = [...lines];
  const changed = [];
  for (const t of targets.reverse()) {
    const section = parseSection(t.filePath);
    const rendered = renderFields(section, t.childIndent, byFile.get(t.filePath));
    const before = out.slice(t.fieldsLine + 1, t.end).join("\n").trimEnd();
    const after = rendered.join("\n");
    if (before !== after) changed.push(t.filePath);
    out = [...out.slice(0, t.fieldsLine + 1), ...rendered, ...out.slice(t.end)];
  }

  return { original, generated: out.join("\n"), changed: changed.reverse(), entries: targets.length };
}

// ---------------------------------------------------------------------------

let exitCode = 0;

for (const configPath of [CONFIG_FULL, CONFIG_RESTRICTED]) {
  const { original, generated, changed, entries } = regenerate(configPath);
  const upToDate = original === generated;

  console.log(
    `${upToDate ? "✓" : "✗"} ${configPath} — ${entries} Shape A entry(ies), ` +
      `${upToDate ? "up to date" : `${changed.length} would change`}`,
  );
  for (const f of changed) console.log(`    ${f}`);

  if (MODE === "write") {
    if (!upToDate) {
      writeFileSync(abs(configPath), generated);
      console.log(`    → written`);
    }
  } else if (MODE === "diff" && !upToDate) {
    const a = original.split("\n");
    const b = generated.split("\n");
    let shown = 0;
    for (let i = 0; i < Math.max(a.length, b.length) && shown < 60; i++) {
      if (a[i] !== b[i]) {
        if (a[i] !== undefined) console.log(`    - ${a[i]}`);
        if (b[i] !== undefined) console.log(`    + ${b[i]}`);
        shown += 2;
      }
    }
    if (shown >= 60) console.log("    … diff truncated");
  }

  if (!upToDate && MODE !== "write") exitCode = 1;
}

if (MODE === "check" && exitCode) {
  console.log(`\nRun \`node scripts/cms-gen.mjs --diff\` to inspect, \`--write\` to apply.`);
}

process.exit(exitCode);
