import type { AstroIntegration } from "astro";
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

/**
 * Astro integration: strip C0 control bytes (NUL, etc.) from generated HTML.
 *
 * Pourquoi ?
 * React 18 + Astro 5 (renderToReadableStream) injecte occasionnellement un
 * byte NUL (0x00) au boundary d'un chunk UTF-8 quand le chunk se termine
 * juste avant un caractere multi-byte (ex: `R` + NUL + `é`). Ce byte est
 * invalide en HTML5 et corrompt le rendu (validateurs W3C, crawlers, parfois
 * navigateurs strict).
 *
 * Donnees source verifiees propres (cf. parseWpJson reviver + scan post-parse) ;
 * la corruption arrive uniquement au boundary du chunk SSR. On post-traite
 * donc le HTML genere pour stripper tous les C0 controls invalides (NUL etc.,
 * sauf TAB \t, LF \n, CR \r qui restent autorises).
 *
 * Regex: [\x00-\x08\x0B\x0C\x0E-\x1F\x7F]
 */

// eslint-disable-next-line no-control-regex
const C0_CONTROLS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

async function* walkHtmlFiles(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtmlFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      yield fullPath;
    }
  }
}

export default function stripControlChars(): AstroIntegration {
  return {
    name: "strip-control-chars",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = dir.pathname;
        let scanned = 0;
        let cleaned = 0;
        let totalStripped = 0;

        try {
          await stat(outDir);
        } catch {
          logger.warn(`outDir ${outDir} introuvable, skip`);
          return;
        }

        for await (const file of walkHtmlFiles(outDir)) {
          scanned++;
          const content = await readFile(file, "utf8");
          const matches = content.match(C0_CONTROLS);
          if (matches && matches.length > 0) {
            const stripped = content.replace(C0_CONTROLS, "");
            await writeFile(file, stripped, "utf8");
            cleaned++;
            totalStripped += matches.length;
            logger.info(
              `stripped ${matches.length} C0 control byte(s) from ${file.replace(outDir, "")}`,
            );
          }
        }

        if (cleaned === 0) {
          logger.info(`scanned ${scanned} HTML file(s), no C0 control bytes found`);
        } else {
          logger.info(
            `scanned ${scanned} HTML file(s), cleaned ${cleaned} file(s), stripped ${totalStripped} byte(s) total`,
          );
        }
      },
    },
  };
}
