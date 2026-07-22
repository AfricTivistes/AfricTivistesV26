import { Rocket } from "lucide-react";
import { Link } from "@/lib/router-shim";
import { getProjetImageUrl, stripHtml } from "@/lib/wordpress";
import { usePrefetchProjet } from "@/hooks/use-wordpress";
import type { WPProjet } from "@/lib/wordpress";

interface LinkedInitiativesSectionProps {
  /** Initiatives rattachées au post (champ ACF `initiatives`). */
  projets: WPProjet[];
  title: string;
}

/**
 * Sens Publication/Article → Initiatives : carte de sidebar compacte listant
 * les initiatives auxquelles ce contenu est rattaché (vignette + titre), lues
 * depuis le champ ACF `initiatives`. Même habillage que la carte « Catégories ».
 * Rend `null` si aucune initiative.
 */
const LinkedInitiativesSection = ({ projets, title }: LinkedInitiativesSectionProps) => {
  const prefetch = usePrefetchProjet();
  if (!projets || projets.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-bold text-foreground mb-3 font-heading flex items-center gap-2">
        <Rocket size={14} className="text-primary" aria-hidden="true" />
        {title}
      </h3>
      <ul className="space-y-1.5">
        {projets.map((p) => {
          const img = getProjetImageUrl(p);
          const name = stripHtml(p.title.rendered);
          return (
            <li key={p.id}>
              <Link
                to={`/initiatives/${p.slug}`}
                onMouseEnter={() => prefetch(p.slug)}
                onFocus={() => prefetch(p.slug)}
                className="group flex items-center gap-3 rounded-lg p-1.5 -mx-1.5 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="40"
                      height="40"
                    />
                  ) : (
                    <div className="w-full h-full pattern-kente" aria-hidden="true" />
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LinkedInitiativesSection;
