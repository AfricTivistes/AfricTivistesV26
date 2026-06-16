import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import path from "node:path";
import { fileURLToPath } from "node:url";
import stripControlChars from "./src/integrations/strip-control-chars.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
