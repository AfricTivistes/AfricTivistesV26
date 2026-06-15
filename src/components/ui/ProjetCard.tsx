import { m as motion } from "framer-motion";
import { Link } from "@/lib/router-shim";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getProjetImageUrl, stripHtml, getProjetThematique } from "@/lib/wordpress";
import { usePrefetchProjet } from "@/hooks/use-wordpress";
import { getThematiqueStyle } from "@/lib/thematique-style";
import type { WPProjet } from "@/lib/wordpress";

interface ProjetCardProps {
  projet: WPProjet;
  /** Fixed width for carousel mode */
  carousel?: boolean;
}

/**
 * Reusable projet card. Used in ProjectsGrid, InitiativesProjectGrid,
 * SimilarProjetsSection, and ThematiqueRelatedProjets.
 */
const ProjetCard = ({ projet, carousel }: ProjetCardProps) => {
  const imageUrl = getProjetImageUrl(projet);
  const title = stripHtml(projet.title.rendered);
  const thematique = getProjetThematique(projet);
  const style = thematique ? getThematiqueStyle(thematique.slug) : null;
  const prefetch = usePrefetchProjet();

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={carousel ? "shrink-0" : ""}
    >
      <Link
        to={`/initiatives/${projet.slug}`}
        onMouseEnter={() => prefetch(projet.slug)}
        onFocus={() => prefetch(projet.slug)}
        className="group block h-full bg-card rounded-2xl border border-border overflow-hidden transition-all hover:border-primary/30 hover:shadow-xl duration-300"
      >
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
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0">
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

export default ProjetCard;
