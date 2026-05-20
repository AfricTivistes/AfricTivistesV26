import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import { useEffect } from "react";
import { useSearchParams } from "@/lib/router-shim";
import { Link } from "@/lib/router-shim";
import { Newspaper, Scale, Radio, PenLine, Trophy, LayoutGrid } from "lucide-react";
import { m as motion } from "framer-motion";
import GradientHero from "@/components/GradientHero";
import { PostGrid, PostGridSkeleton } from "@/components/posts";
import Pagination from "@/components/ui/Pagination";
import { useI18n } from "@/lib/i18n";
import { usePosts, useCategories } from "@/hooks/use-wordpress";
import { CATEGORY_IDS, PUBLICATION_CATEGORY_IDS, TOOLKIT_CATEGORY_IDS } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

const MAIN_FILTERS = [
  { key: "communiques", icon: Newspaper, labelKey: "blog.communiques" },
  { key: "plaidoyers", icon: Scale, labelKey: "blog.plaidoyers" },
  { key: "actualites", icon: Radio, labelKey: "blog.actualites" },
  { key: "contributions", icon: PenLine, labelKey: "blog.contributions" },
  { key: "champions", icon: Trophy, labelKey: "blog.champions" },
];

const BlogPage = () => {
  const { t, lang } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentCat = searchParams.get("cat") || "";

  /* Quand la langue change, traduire le ?cat= vers l'equivalent dans la nouvelle langue */
  useEffect(() => {
    if (!currentCat) return;
    const catNum = parseInt(currentCat);
    for (const [_key, ids] of Object.entries(CATEGORY_IDS)) {
      const otherLang = lang === "fr" ? "en" : "fr";
      if (ids[otherLang] === catNum && ids[lang] !== catNum) {
        const params = new URLSearchParams(searchParams);
        params.set("cat", String(ids[lang]));
        params.set("page", "1");
        setSearchParams(params, { replace: true });
        return;
      }
    }
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  /* IDs des categories principales pour la langue active */
  const mainCatIds = MAIN_FILTERS.map((f) => CATEGORY_IDS[f.key][lang]);
  const publicationCatId = PUBLICATION_CATEGORY_IDS[lang] || PUBLICATION_CATEGORY_IDS.fr;
  const toolkitCatId = TOOLKIT_CATEGORY_IDS[lang] || TOOLKIT_CATEGORY_IDS.fr;
  const excludedCatIds = [publicationCatId, toolkitCatId];

  const postsOpts = {
    page: currentPage,
    perPage: 9,
    categoriesExclude: excludedCatIds,
    ...(currentCat ? { categories: [parseInt(currentCat)] } : {}),
  };
  const { data: postsData, isLoading: loading } = usePosts(postsOpts);
  const posts = postsData?.posts ?? [];
  const totalPages = postsData?.totalPages ?? 1;
  const totalArticles = postsData?.total ?? 0;

  /* Toutes les categories de la langue, sans les exclues ni les principales */
  const { data: allCategories = [] } = useCategories();
  const otherCategories = allCategories
    .filter((c) => !mainCatIds.includes(c.id) && !excludedCatIds.includes(c.id))
    .sort((a, b) => b.count - a.count);

  /* Retrouve le label du filtre actif */
  const activeFilterLabel = () => {
    if (!currentCat) return t("blog.all");
    const mainMatch = MAIN_FILTERS.find(
      (f) => String(CATEGORY_IDS[f.key][lang]) === currentCat
    );
    if (mainMatch) return t(mainMatch.labelKey);
    const wpMatch = allCategories.find((c) => String(c.id) === currentCat);
    return wpMatch?.name || t("blog.all");
  };

  const buildPageHref = (page: number) =>
    currentCat ? `/blog?cat=${currentCat}&page=${page}` : `/blog?page=${page}`;

  return (
    <>
      <GradientHero
        titleKey="blog.title"
        subtitleKey="blog.subtitle"
        labelKey="nav.news"
        verticalPadding="pt-24 pb-16 lg:pt-32 lg:pb-20"
        patternOpacity="opacity-15"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-sm" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-white/[0.03]" aria-hidden="true" />
      </GradientHero>

      {/* Filters Section */}
      <section className="sticky top-16 lg:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="section-container">
          <div className="py-4 space-y-3">
            {/* Ligne 1 : Tous + 5 categories principales */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1" role="group" aria-label="Filtrer par catégorie principale">
              <Link
                to="/blog?page=1"
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0",
                  !currentCat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                data-testid="filter-all"
                aria-current={!currentCat ? "page" : undefined}
              >
                <LayoutGrid size={16} aria-hidden="true" />
                {t("blog.all")}
              </Link>

              {MAIN_FILTERS.map((filter) => {
                const Icon = filter.icon;
                const catId = String(CATEGORY_IDS[filter.key][lang]);
                const isSelected = currentCat === catId;

                return (
                  <Link
                    key={filter.key}
                    to={`/blog?cat=${catId}&page=1`}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    data-testid={`filter-cat-${catId}`}
                    aria-current={isSelected ? "page" : undefined}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {t(filter.labelKey)}
                  </Link>
                );
              })}
            </div>

            {/* Ligne 2 : Toutes les autres categories */}
            {otherCategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1" role="group" aria-label="Autres catégories">
                {otherCategories.map((cat) => {
                  const catId = String(cat.id);
                  const isSelected = currentCat === catId;

                  return (
                    <Link
                      key={cat.id}
                      to={`/blog?cat=${catId}&page=1`}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      data-testid={`filter-cat-${catId}`}
                      aria-current={isSelected ? "page" : undefined}
                    >
                      {cat.name}
                      <span className="ml-1.5 text-[10px] opacity-60">{cat.count}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results bar */}
      <div className="section-container pt-8 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{activeFilterLabel()}</span>
            {!loading && (
              <>
                {" "}&middot;{" "}
                <span className="tabular-nums">{totalArticles}</span>{" "}
                {totalArticles > 1 ? t("blog.articlesCount") : t("blog.articleCount")}
              </>
            )}
          </p>
          {totalPages > 1 && !loading && (
            <p className="text-sm text-muted-foreground tabular-nums">
              {currentPage} / {totalPages}
            </p>
          )}
        </div>
      </div>

      {/* Articles grid */}
      <section className="section-container pb-20">
        {loading ? (
          <div className="mt-6">
            <PostGridSkeleton count={9} variant="landscape" columns={3} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 lg:py-16" role="status">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
              <Newspaper size={28} className="text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-xl font-semibold text-foreground mb-2" data-testid="text-no-articles">
              {t("blog.noArticles")}
            </p>
            {currentCat && (
              <Link
                to="/blog?page=1"
                className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
              >
                {t("blog.all")}
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <PostGrid posts={posts} variant="landscape" columns={3} />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildPageHref}
            ariaLabel={lang === "fr" ? "Pagination des articles" : "Articles pagination"}
          />
        )}
      </section>
    </>
  );
};

export default withI18nQueryMotion(BlogPage);
