import { useState } from "react";
import { m as motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router-shim";
import { useQueryClient } from "@tanstack/react-query";
import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";
import { getProjetImageUrl, stripHtml, getProjetThematique, fetchProjetBySlugWithLang } from "@/lib/wordpress";
import { useProjets, useThematiques } from "@/hooks/use-wordpress";
import { thematiqueList } from "@/data/thematiques";

const getThematiqueStyle = (wpSlug: string) =>
  thematiqueList.find((t) => wpSlug.includes(t.slug));

const InitiativesProjectGrid = () => {
  const [activeType, setActiveType] = useState<number | null>(null);
  const { t, lang } = useI18n();
  const queryClient = useQueryClient();
  const { data: thematiques = [] } = useThematiques();
  const { data: projets = [], isLoading: loading } = useProjets(100);

  const prefetchProjet = (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ["projet", slug, lang],
      queryFn: () => fetchProjetBySlugWithLang(slug, lang),
      staleTime: 5 * 60 * 1000,
    });
  };

  const filtered = activeType === null
    ? projets
    : projets.filter((p) => p.thematique?.includes(activeType));

  return (
    <section className="py-16" id="all-projects">
      <div className="section-container">
        <SectionHeader
          titleKey="initiatives.allProjectsTitle"
          labelKey="initiatives.allProjectsLabel"
          subtitleKey="initiatives.allProjectsSubtitle"
        />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="group" aria-label="Filtrer par thématique">
          <button
            onClick={() => setActiveType(null)}
            aria-pressed={activeType === null}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border focus:outline-none focus:ring-2 focus:ring-primary ${
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
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive
                    ? `${style?.bgSolid ?? "bg-primary"} text-white border-transparent`
                    : `border-border text-muted-foreground hover:border-primary/40 hover:text-foreground`
                }`}
              >
                {th.name}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-2xl mb-3" />
                <div className="h-3 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12" role="status">
            {t("programmes.none")}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" role="list">
            {filtered.map((p, i) => {
              const imageUrl = getProjetImageUrl(p);
              const title = stripHtml(p.title.rendered);
              const thematique = getProjetThematique(p);
              const style = thematique ? getThematiqueStyle(thematique.slug) : null;
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  role="listitem"
                >
                  <Link
                    to={`/initiatives/${p.slug}`}
                    onMouseEnter={() => prefetchProjet(p.slug)}
                    onFocus={() => prefetchProjet(p.slug)}
                    className="group block h-full bg-card rounded-2xl border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          width="318"
                          height="318"
                        />
                      ) : (
                        <div className="absolute inset-0 pattern-kente" aria-hidden="true" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0">
                        <ArrowUpRight size={13} className="text-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {thematique && (
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${style?.bg ?? "bg-muted"} ${style?.color ?? "text-muted-foreground"}`}>
                          {thematique.name}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-card-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </h3>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default withI18nQueryMotion(InitiativesProjectGrid);
