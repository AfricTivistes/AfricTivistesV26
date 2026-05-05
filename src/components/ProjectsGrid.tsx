import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { getProjetImageUrl, stripHtml, getProjetThematique, fetchProjetBySlugWithLang } from "@/lib/wordpress";
import { useProjets, useThematiques } from "@/hooks/use-wordpress";
import { thematiqueList } from "@/data/thematiques";
import type { WPProjet } from "@/lib/wordpress";

const getThematiqueStyle = (wpSlug: string) =>
  thematiqueList.find((t) => wpSlug.includes(t.slug));

const CARD_WIDTH = 320;

interface ProjetCardProps {
  p: WPProjet;
  carousel?: boolean;
}

const ProjetCard = ({ p, carousel }: ProjetCardProps) => {
  const imageUrl = getProjetImageUrl(p);
  const title = stripHtml(p.title.rendered);
  const thematique = getProjetThematique(p);
  const style = thematique ? getThematiqueStyle(thematique.slug) : null;
  const { lang } = useI18n();
  const queryClient = useQueryClient();

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["projet", p.slug, lang],
      queryFn: () => fetchProjetBySlugWithLang(p.slug, lang),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={carousel ? `w-[${CARD_WIDTH}px] flex-shrink-0` : ""}
    >
      <Link
        to={`/initiatives/${p.slug}`}
        onMouseEnter={handlePrefetch}
        onFocus={handlePrefetch}
        className="group block h-full bg-card rounded-2xl border border-border overflow-hidden transition-all hover:border-primary/30 hover:shadow-xl duration-300"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 pattern-kente" aria-hidden="true" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0">
            <ArrowUpRight size={14} className="text-foreground" />
          </div>
        </div>
        <div className="p-5">
          {thematique && (
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2.5 ${style?.bg ?? "bg-muted"} ${style?.color ?? "text-muted-foreground"}`}>
              {thematique.name}
            </span>
          )}
          <h3 className="font-bold text-card-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
      </Link>
    </motion.article>
  );
};

const ProjectsGrid = () => {
  const [activeType, setActiveType] = useState<number | null>(null);
  const { t, lang } = useI18n();
  const { data: thematiques = [] } = useThematiques();
  const { data: projets = [], isLoading } = useProjets(100);
  const controls = useAnimation();
  const isPaused = useRef(false);

  const filtered = activeType === null
    ? projets
    : projets.filter((p) => p.thematique?.includes(activeType));

  const scrollDuration = projets.length * 3;

  const startScroll = () => {
    if (isPaused.current) return;
    controls.start({
      x: ["0%", "-50%"],
      transition: { duration: scrollDuration, ease: "linear", repeat: Infinity },
    });
  };

  const pauseScroll = () => {
    isPaused.current = true;
    controls.stop();
  };

  const resumeScroll = () => {
    isPaused.current = false;
    startScroll();
  };

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="section-container">
          <div className="h-8 w-48 bg-muted rounded mb-12 mx-auto animate-pulse" />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-80 flex-shrink-0 animate-pulse">
                <div className="aspect-[16/10] bg-muted rounded-2xl mb-3" />
                <div className="h-3 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-muted/30" aria-labelledby="projets-heading">
      <div className="section-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {lang === "fr" ? "Nos initiatives" : "Our initiatives"}
            </span>
            <h2 id="projets-heading" className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
              {t("programmes.title")}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed">
              {t("programmes.subtitle")}
            </p>
          </div>
          <Link
            to="/initiatives"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all shrink-0"
          >
            {t("programmes.viewAll")}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Filters */}
        {thematiques.filter((th) => th.count > 0).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 mb-10"
            role="group"
            aria-label="Filtrer par thématique"
          >
            <button
              onClick={() => setActiveType(null)}
              aria-pressed={activeType === null}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeType === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {t("programmes.all")}
            </button>
            {thematiques.filter((th) => th.count > 0).map((th) => {
              const style = getThematiqueStyle(th.slug);
              const isActive = activeType === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => setActiveType(th.id)}
                  aria-pressed={isActive}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    isActive
                      ? `${style?.bgSolid ?? "bg-primary"} text-white border-transparent`
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {th.name}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Carousel (aucun filtre) */}
        {activeType === null ? (
          <div
            className="overflow-hidden"
            onMouseEnter={pauseScroll}
            onMouseLeave={resumeScroll}
          >
            <motion.div
              animate={controls}
              onViewportEnter={startScroll}
              className="flex gap-5 w-max"
              style={{ willChange: "transform" }}
            >
              {[...projets, ...projets].map((p, i) => (
                <div key={`${p.id}-${i}`} style={{ width: CARD_WIDTH, flexShrink: 0 }}>
                  <ProjetCard p={p} carousel />
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Grid (filtre actif) */
          filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">{t("programmes.none")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
              {filtered.slice(0, 6).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  role="listitem"
                >
                  <ProjetCard p={p} />
                </motion.div>
              ))}
            </div>
          )
        )}

        {/* CTA */}
        <div className="text-center mt-5">
          <Link
            to="/initiatives"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {t("programmes.viewAll")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
