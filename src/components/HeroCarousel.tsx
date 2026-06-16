import { useState, useEffect, useCallback } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getFeaturedImageUrl,
  stripHtml,
  formatDate,
  getPostCategories,
  type WPPost,
} from "@/lib/wordpress";
import type { Lang } from "@/lib/i18n";

interface HeroCarouselProps {
  posts: WPPost[];
  lang: Lang;
  /** Localised aria labels (passed from Astro for SSR i18n) */
  prevLabel?: string;
  nextLabel?: string;
  goToLabel?: string;
}

/**
 * Carousel d'articles a la une (zone droite du Hero).
 *
 * Pattern : island isole hydrate avec `client:idle`.
 * - Astro SSR rend la 1ere slide en HTML natif (pas de skeleton).
 * - L'hydratation cote client active le defilement automatique
 *   (5s) et la navigation manuelle (fleches + indicateurs).
 *
 * Recoit les posts en props directement -- pas de useQuery / __PRELOAD__,
 * pas de skeleton SSR (le HTML est deja la vraie carte).
 */
export default function HeroCarousel({
  posts,
  lang,
  prevLabel,
  nextLabel,
  goToLabel,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* Auto-defilement toutes les 5 secondes */
  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posts.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  if (posts.length === 0) {
    /* Fallback : Hero.astro a deja rendu un fallback statique. */
    return null;
  }

  const fallbackPrev = lang === "fr" ? "Article précédent" : "Previous article";
  const fallbackNext = lang === "fr" ? "Article suivant" : "Next article";
  const fallbackGoTo = lang === "fr" ? "Aller à l'article" : "Go to article";

  const aPrev = prevLabel ?? fallbackPrev;
  const aNext = nextLabel ?? fallbackNext;
  const aGoTo = goToLabel ?? fallbackGoTo;

  return (
    <>
      {posts.map((post, index) => {
        const imageUrl = getFeaturedImageUrl(post);
        const title = stripHtml(post.title.rendered);
        const categories = getPostCategories(post);
        const isActive = index === currentSlide;
        return (
          <div
            key={post.id}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}
            aria-hidden={isActive ? "false" : "true"}
          >
            <a
              href={`/${lang}/blog/${post.slug}`}
              className="group block absolute inset-0"
              aria-label={title}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  width="800"
                  height="600"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <BookOpen size={48} className="text-primary-foreground/30" />
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {categories.length > 0 && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-3">
                    {categories[0].name}
                  </span>
                )}
                <h3 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                  {title}
                </h3>
                <p className="text-white/60 text-sm">
                  {formatDate(post.date, lang === "en" ? "en-US" : "fr-FR")}
                </p>
              </div>
            </a>
          </div>
        );
      })}

      {posts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/60 transition-colors focus:outline-hidden focus:ring-2 focus:ring-white/50 z-10"
            aria-label={aPrev}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/60 transition-colors focus:outline-hidden focus:ring-2 focus:ring-white/50 z-10"
            aria-label={aNext}
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-2 z-10">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 focus:outline-hidden ${
                  index === currentSlide
                    ? "w-8 bg-secondary"
                    : "w-4 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`${aGoTo} ${index + 1}`}
                aria-current={index === currentSlide ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
