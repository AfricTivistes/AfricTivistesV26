import { usePosts } from "@/hooks/use-wordpress";
import { PostGrid, PostGridSkeleton } from "@/components/posts";
import type { WPPost } from "@/lib/wordpress";

interface RelatedPostsSectionProps {
  /** Titre de la section (ex. « Articles similaires », « Contenus liés »). */
  title: string;
  /** Filtrage par catégories (sens blog : articles de même catégorie). */
  categories?: number[];
  /** Filtrage par initiative rattachée (sens Initiative → Articles, champ ACF). */
  relatedProjet?: number;
  /** Post courant à exclure de la liste (page blog). */
  excludeId?: number;
  /** Nombre max de posts affichés (défaut 3). */
  limit?: number;
  /** Filet de séparation en haut de section (défaut true). */
  bordered?: boolean;
  initialData?: { posts: WPPost[]; totalPages: number; total: number };
}

/**
 * Section « contenus reliés » réutilisable. Généralisée depuis le bloc
 * « Articles similaires » de BlogPost : même ossature (section titrée +
 * PostGrid landscape), mais filtrable par catégories OU par initiative
 * rattachée (champ ACF). Rend `null` quand aucun contenu.
 */
const RelatedPostsSection = ({
  title,
  categories,
  relatedProjet,
  excludeId,
  limit = 3,
  bordered = true,
  initialData,
}: RelatedPostsSectionProps) => {
  // Sans exclusion on récupère exactement `limit` ; avec `excludeId` on en
  // récupère un de plus pour pouvoir retirer le post courant et compléter.
  const { data, isLoading } = usePosts(
    { perPage: excludeId ? limit + 1 : limit, categories, relatedProjet },
    { initialData },
  );

  const related = (data?.posts ?? [])
    .filter((p) => p.id !== excludeId)
    .slice(0, limit);

  if (!isLoading && related.length === 0) return null;

  return (
    <section
      className={`section-container pt-12 pb-8 mt-16${bordered ? " border-t border-border" : ""}`}
    >
      <h2 className="text-2xl font-bold text-foreground font-heading mb-8">
        {title}
      </h2>
      {isLoading ? (
        <PostGridSkeleton count={limit} variant="landscape" columns={3} />
      ) : (
        <PostGrid posts={related} variant="landscape" columns={3} />
      )}
    </section>
  );
};

export default RelatedPostsSection;
