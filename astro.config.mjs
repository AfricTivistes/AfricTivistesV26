import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import path from "node:path";
import { fileURLToPath } from "node:url";
import stripControlChars from "./src/integrations/strip-control-chars.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Dev uniquement : proxy des médias WordPress `/wp-uploads/*`.
 *
 * En prod, la règle `_redirects` (/wp-uploads/* -> update.africtivistes.org/
 * wp-content/uploads/*) est appliquée correctement par Netlify. En local,
 * l'émulation `_redirects` de l'adaptateur récupère l'image gzippée, la
 * décompresse (undici) mais conserve l'entête `Content-Encoding: gzip` ->
 * le navigateur échoue avec ERR_CONTENT_DECODING_FAILED.
 *
 * Ce middleware court-circuite l'émulation : il requête l'origine en
 * `Accept-Encoding: identity` (donc corps en clair, sans entête d'encodage)
 * et termine la réponse lui-même. `apply: "serve"` -> aucun effet sur le build.
 */
function devWpUploadsProxy() {
  const ORIGIN = "https://update.africtivistes.org/wp-content/uploads";
  return {
    name: "dev-wp-uploads-proxy",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/wp-uploads", async (req, res, next) => {
        try {
          const upstream = ORIGIN + (req.url || "");
          const r = await fetch(upstream, { headers: { "Accept-Encoding": "identity" } });
          if (!r.ok) {
            res.statusCode = r.status;
            res.end();
            return;
          }
          const buf = Buffer.from(await r.arrayBuffer());
          res.statusCode = 200;
          res.setHeader("Content-Type", r.headers.get("content-type") || "application/octet-stream");
          res.setHeader("Content-Length", String(buf.length));
          res.setHeader("Cache-Control", "public, max-age=86400");
          res.end(buf);
        } catch (err) {
          next(err);
        }
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://africtivistes.com",
  output: "server",
  adapter: netlify(),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    react(),
    // Post-build hook : strip NUL/C0 bytes injectes par React 18 SSR au
    // boundary de chunks UTF-8 (cf. src/integrations/strip-control-chars.ts).
    stripControlChars(),
  ],
  vite: {
    plugins: [tailwindcss(), devWpUploadsProxy()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
