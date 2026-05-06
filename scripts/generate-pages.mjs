// Generates Astro page files that import page components directly.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "src/pages");
const langs = ["fr", "en"];

// Static pages: [relativePath, importName, importPath]
// Note: index.astro is NOT generated -- it's hand-written as native Astro
// (Astro orchestrates, sub-components are React islands).
const staticPages = [
  ["contact.astro",                     "ContactPage",          "@/components/pages/Contact"],
  ["about/index.astro",                 "AboutPage",            "@/components/pages/About"],
  ["about/history.astro",               "HistoirePage",         "@/components/pages/Histoire"],
  ["about/values.astro",                "ValeursPage",          "@/components/pages/Valeurs"],
  ["about/join.astro",                  "AdhesionPage",         "@/components/pages/Adhesion"],
  ["blog/index.astro",                  "BlogPage",             "@/components/pages/Blog"],
  ["initiatives/index.astro",           "InitiativesPage",      "@/components/pages/Initiatives"],
  ["resources/publications.astro",      "ResourcesPublications","@/components/pages/ResourcesPublications"],
  ["resources/toolkits.astro",          "ResourcesToolkits",    "@/components/pages/ResourcesToolkits"],
  ["resources/media.astro",             "ResourcesMedia",       "@/components/pages/ResourcesMedia"],
];

const thematiqueRoutes = [
  ["initiatives/innovation.astro", "innovation"],
  ["initiatives/democracy.astro", "democracy"],
  ["initiatives/engagement.astro", "engagement"],
  ["initiatives/media.astro", "media"],
  ["initiatives/training.astro", "training"],
];

function staticPage(lang, importName, importPath) {
  return `---
export const prerender = true;
import BaseLayout from "@/layouts/BaseLayout.astro";
import ${importName} from "${importPath}";
const lang = "${lang}";
---
<BaseLayout lang={lang}>
  <${importName} client:only="react" />
</BaseLayout>
`;
}

function thematiquePage(lang, key) {
  return `---
export const prerender = true;
import BaseLayout from "@/layouts/BaseLayout.astro";
import ThematiquePage from "@/components/pages/ThematiquePage";
import { thematiques } from "@/data/thematiques";
const lang = "${lang}";
const data = thematiques["${key}"];
---
<BaseLayout lang={lang}>
  <ThematiquePage data={data} client:only="react" />
</BaseLayout>
`;
}

function blogSlugPage(lang) {
  return `---
import BaseLayout from "@/layouts/BaseLayout.astro";
import BlogPost from "@/components/pages/BlogPost";
import { fetchPostBySlug } from "@/lib/wordpress";

const lang = "${lang}";
const { slug } = Astro.params;

let post = null;
try {
  post = await fetchPostBySlug(slug);
} catch (err) {
  console.error("[BlogPost SSR prefetch] failed:", err);
}

const preload = post ? [{ key: ["post", slug], data: post }] : [];
---
<BaseLayout lang={lang}>
  <script is:inline define:vars={{ slug, preload }}>
    window.__ASTRO_PARAMS__ = { slug };
    window.__PRELOAD__ = preload;
  </script>
  <BlogPost client:only="react" />
</BaseLayout>
`;
}

function projetSlugPage(lang) {
  return `---
import BaseLayout from "@/layouts/BaseLayout.astro";
import ProjetDetail from "@/components/pages/ProjetDetail";
import { fetchProjetBySlugWithLang } from "@/lib/wordpress";

const lang = "${lang}";
const { slug } = Astro.params;

let projet = null;
try {
  projet = await fetchProjetBySlugWithLang(slug, lang);
} catch (err) {
  console.error("[ProjetDetail SSR prefetch] failed:", err);
}

const preload = projet ? [{ key: ["projet", slug, lang], data: projet }] : [];
---
<BaseLayout lang={lang}>
  <script is:inline define:vars={{ slug, preload }}>
    window.__ASTRO_PARAMS__ = { slug };
    window.__PRELOAD__ = preload;
  </script>
  <ProjetDetail client:only="react" />
</BaseLayout>
`;
}

function notFoundPage(lang) {
  return `---
import BaseLayout from "@/layouts/BaseLayout.astro";
import NotFound from "@/components/pages/NotFound";
const lang = "${lang}";
Astro.response.status = 404;
---
<BaseLayout lang={lang}>
  <NotFound client:only="react" />
</BaseLayout>
`;
}

for (const lang of langs) {
  for (const [rel, importName, importPath] of staticPages) {
    const filePath = path.join(root, lang, rel);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, staticPage(lang, importName, importPath));
  }
  for (const [rel, key] of thematiqueRoutes) {
    const filePath = path.join(root, lang, rel);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, thematiquePage(lang, key));
  }
  fs.writeFileSync(path.join(root, lang, "blog/[slug].astro"), blogSlugPage(lang));
  fs.writeFileSync(path.join(root, lang, "initiatives/[slug].astro"), projetSlugPage(lang));
}

// Global 404 (note: no language; defaults to fr)
fs.writeFileSync(path.join(root, "404.astro"), notFoundPage("fr"));

console.log("Pages generated.");
