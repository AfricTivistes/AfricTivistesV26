import { m as motion } from "framer-motion";
import { Link } from "@/lib/router-shim";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ProjetCard from "@/components/ui/ProjetCard";
import type { WPProjet } from "@/lib/wordpress";

interface ThematiqueRelatedProjetsProps {
  projets: WPProjet[];
  loading: boolean;
  bgSolid: string;
  color: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const ThematiqueRelatedProjets = ({ projets, loading, bgSolid, color, gradientFrom, gradientTo }: ThematiqueRelatedProjetsProps) => {
  const { t, lang } = useI18n();

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
                <div className="aspect-square bg-muted rounded-2xl mb-3" />
                <div className="h-3 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5" role="list">
            {projets.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                role="listitem"
              >
                <ProjetCard projet={p} />
              </motion.div>
            ))}
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
