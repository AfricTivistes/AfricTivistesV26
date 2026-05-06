import { withDataProviders } from "@/lib/withProviders";
import { useState, useEffect, useCallback } from "react";
import { Link } from "@/lib/router-shim";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg?url";
import { useI18n } from "@/lib/i18n";
import { getFeaturedImageUrl, stripHtml, formatDate, getPostCategories } from "@/lib/wordpress";
import { usePosts } from "@/hooks/use-wordpress";

const Hero = () => {
  const { t, lang } = useI18n();
  const { data, isLoading: loading } = usePosts({ perPage: 3 });
  const articles = data?.posts ?? [];
  const [currentSlide, setCurrentSlide] = useState(0);

  /* Auto-defilement toutes les 5 secondes */
  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label="Section d'accueil">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0 pattern-african" />
      </div>

      {/* Contenu split */}
      <div className="relative section-container py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Gauche -- Texte */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6 backdrop-blur-sm border border-secondary/30">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground leading-[1.1] mb-6"
            >
              {t("hero.title1")}
              <span className="text-gradient-gold">{t("hero.highlight")}</span>
              {t("hero.title2")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base sm:text-lg text-primary-foreground/80 mb-8 max-w-xl leading-relaxed"
            >
              {t("hero.desc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/initiatives"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-7 py-3.5 text-base font-bold text-secondary-foreground hover:bg-secondary/90 transition-all hover:scale-[1.02] shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                aria-label="Découvrir nos initiatives et projets"
              >
                {t("hero.cta1")}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-foreground/30 bg-primary-foreground/10 px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/20 transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
                aria-label="Lire nos dernières actualités"
              >
                <BookOpen size={18} aria-hidden="true" />
                {t("hero.cta2")}
              </Link>
            </motion.div>
          </div>

          {/* Droite -- Carrousel articles a la une */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-foreground/10 backdrop-blur-sm border border-white/10">
              {loading ? (
                /* Skeleton */
                <div className="w-full h-full animate-pulse bg-white/10" />
              ) : articles.length > 0 ? (
                <>
                  {/* Slides */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Link
                        to={`/blog/${articles[currentSlide].slug}`}
                        className="group block absolute inset-0"
                        aria-label={stripHtml(articles[currentSlide].title.rendered)}
                      >
                        {getFeaturedImageUrl(articles[currentSlide]) ? (
                          <img
                            src={getFeaturedImageUrl(articles[currentSlide])!}
                            alt={stripHtml(articles[currentSlide].title.rendered)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                            <BookOpen size={48} className="text-primary-foreground/30" />
                          </div>
                        )}

                        {/* Overlay gradient + infos article */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          {getPostCategories(articles[currentSlide]).length > 0 && (
                            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-3">
                              {getPostCategories(articles[currentSlide])[0].name}
                            </span>
                          )}
                          <h3 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                            {stripHtml(articles[currentSlide].title.rendered)}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {formatDate(articles[currentSlide].date, lang === "en" ? "en-US" : "fr-FR")}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  </AnimatePresence>

                  {/* Fleches de navigation */}
                  {articles.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Article précédent"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Article suivant"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Indicateurs de slide */}
                  {articles.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-2">
                      {articles.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${
                            index === currentSlide
                              ? "w-8 bg-secondary"
                              : "w-4 bg-white/40 hover:bg-white/60"
                          }`}
                          aria-label={`Aller à l'article ${index + 1}`}
                          aria-current={index === currentSlide ? "true" : undefined}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Fallback si aucun article */
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={heroBg}
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default withDataProviders(Hero);
