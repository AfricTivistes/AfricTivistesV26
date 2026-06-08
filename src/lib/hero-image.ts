/**
 * Hero LCP image helper (P2 — perf).
 *
 * Generates multi-size AVIF / WebP / JPG variants from the source hero-bg.jpg
 * via astro:assets `getImage()`. Used by:
 *   - Hero.astro              : render <picture> with responsive srcset.
 *   - pages/{fr,en}/index.astro : preload AVIF srcset for LCP.
 *
 * Astro's getImage cache ensures the actual sharp processing happens once per
 * build (per width/format combo). The module-level `cache` here just avoids
 * re-walking the Promise.all in dev/SSR.
 */
import { getImage } from "astro:assets";
import heroBgSource from "@/assets/hero-bg.jpg";

export type HeroImageVariants = {
  /** AVIF srcset string (smallest → largest) — preferred for preload. */
  avifSrcset: string;
  /** WebP srcset string. */
  webpSrcset: string;
  /** JPG srcset string (fallback for picture). */
  jpgSrcset: string;
  /** Fallback src (1920w JPG) for <img> inside <picture>. */
  fallbackSrc: string;
  /** Sizes attribute — hero is 100vw on all breakpoints. */
  sizes: string;
  /** Intrinsic dimensions (for CLS prevention). */
  width: number;
  height: number;
  /** AVIF URL at 1024w — single-URL fallback for preload when imagesrcset is unsupported. */
  avifPreloadFallback: string;
};

const WIDTHS = [640, 1024, 1920] as const;

let cache: Promise<HeroImageVariants> | null = null;

async function buildVariants(): Promise<HeroImageVariants> {
  const [avifs, webps, jpgs] = await Promise.all([
    Promise.all(WIDTHS.map((w) => getImage({ src: heroBgSource, width: w, format: "avif", quality: 55 }))),
    Promise.all(WIDTHS.map((w) => getImage({ src: heroBgSource, width: w, format: "webp", quality: 72 }))),
    Promise.all(WIDTHS.map((w) => getImage({ src: heroBgSource, width: w, format: "jpg", quality: 78 }))),
  ]);

  const toSrcset = (variants: typeof avifs) =>
    variants.map((v, i) => `${v.src} ${WIDTHS[i]}w`).join(", ");

  return {
    avifSrcset: toSrcset(avifs),
    webpSrcset: toSrcset(webps),
    jpgSrcset: toSrcset(jpgs),
    fallbackSrc: jpgs[jpgs.length - 1].src,
    sizes: "100vw",
    width: 1920,
    height: 1080,
    avifPreloadFallback: avifs[1].src, // 1024w sweet spot for preload href fallback
  };
}

export function getHeroImageVariants(): Promise<HeroImageVariants> {
  if (!cache) cache = buildVariants();
  return cache;
}
