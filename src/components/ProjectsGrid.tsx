import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import { useState, useRef } from "react";
import { m as motion, useAnimation } from "framer-motion";
import { Link } from "@/lib/router-shim";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useProjets, useThematiques } from "@/hooks/use-wordpress";
import ProjetCard from "@/components/ui/ProjetCard";
import ThematiqueFilterBar from "@/components/ui/ThematiqueFilterBar";

const CARD_WIDTH = 320;

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
                <div className="aspect-square bg-muted rounded-2xl mb-3" />
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ThematiqueFilterBar
            thematiques={thematiques}
            activeType={activeType}
            onSelect={setActiveType}
            className="mb-10"
          />
        </motion.div>

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
                  <ProjetCard projet={p} carousel />
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
                  <ProjetCard projet={p} />
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

export default withI18nQueryMotion(ProjectsGrid);
