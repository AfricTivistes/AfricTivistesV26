import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/lib/router-shim";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getProjetImageUrl, stripHtml, type WPProjet } from "@/lib/wordpress";

interface ThematiqueRelatedProjetsProps {
  projets: WPProjet[];
  loading: boolean;
  bgSolid: string;
  color: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const ThematiqueRelatedProjets = ({ projets, loading, bgSolid, color, borderColor, gradientFrom, gradientTo }: ThematiqueRelatedProjetsProps) => {
  const { t, lang } = useI18n();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!loading && projets.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-muted/30 border-t border-border">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className={`text-sm font-semibold ${color} uppercase tracking-wider`}>
            {lang === "fr" ? "Nos projets" : "Our projects"}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {lang === "fr" ? "Projets dans cette thématique" : "Projects in this theme"}
          </h2>
          <div className={`w-20 h-1 ${bgSolid} mx-auto mt-4 rounded-full opacity-40`} />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse" aria-hidden="true">
                <div className="aspect-[16/10] bg-muted rounded-xl mb-2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5" role="list">
            {projets.map((p, i) => {
              const imageUrl = getProjetImageUrl(p);
              const title = stripHtml(p.title.rendered);
              const isHovered = hoveredIdx === i;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  role="listitem"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <Link
                    to={`/initiatives/${p.slug}`}
                    className={`group block bg-card rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 ${
                      isHovered ? borderColor : "border-border"
                    }`}
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full pattern-kente" aria-hidden="true" />
                      )}
                    </div>
                    <div className="p-3 lg:p-4">
                      <h3 className={`text-xs lg:text-sm font-bold leading-tight flex items-center gap-1 transition-colors ${
                        isHovered ? color : "text-card-foreground"
                      }`}>
                        {title}
                        <ArrowRight size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${color}`} aria-hidden="true" />
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-5">
          <Link
            to="/initiatives"
            className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${gradientFrom} ${gradientTo} px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90`}
          >
            {t("projet.viewAll")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThematiqueRelatedProjets;
