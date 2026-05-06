import { Link } from "@/lib/router-shim";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getProjetImageUrl, getProjetThematique, stripHtml, fetchProjetBySlugWithLang } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";
import type { WPProjet } from "@/lib/wordpress";

interface SimilarProjetsSectionProps {
  projets: WPProjet[];
  similarTitle: string;
  similarDesc: string;
  viewAllLabel: string;
}

const SimilarProjetsSection = ({ projets, similarTitle, similarDesc, viewAllLabel }: SimilarProjetsSectionProps) => {
  const { lang } = useI18n();
  const queryClient = useQueryClient();
  if (projets.length === 0) return null;

  const prefetchProjet = (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ["projet", slug, lang],
      queryFn: () => fetchProjetBySlugWithLang(slug, lang),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <section className="py-16 lg:py-20 bg-muted/30 border-t border-border">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground font-heading">
            {similarTitle}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
            {similarDesc}
          </p>
          <div className="w-12 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {projets.map((p, i) => {
            const img = getProjetImageUrl(p);
            const name = stripHtml(p.title.rendered);
            const pThematique = getProjetThematique(p);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/initiatives/${p.slug}`}
                  onMouseEnter={() => prefetchProjet(p.slug)}
                  onFocus={() => prefetchProjet(p.slug)}
                  className="group block bg-card rounded-2xl border border-border overflow-hidden transition-all hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    {img ? (
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full pattern-kente" />
                    )}
                    {pThematique && (
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white">
                        {pThematique.name}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-card-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/initiatives"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {viewAllLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SimilarProjetsSection;
