import { withDataProviders } from "@/lib/withProviders";
import { useState, useEffect } from "react";
import { Link } from "@/lib/router-shim";
import { m as motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Wrench, Package, ChevronRight as ChevRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";
import { getFeaturedImageUrl, stripHtml, TOOLKIT_CATEGORY_IDS } from "@/lib/wordpress";
import { usePosts } from "@/hooks/use-wordpress";

const POSTS_PER_PAGE = 9;

const ResourcesToolkits = () => {
  const { t, lang } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const toolkitCatId = TOOLKIT_CATEGORY_IDS[lang] || TOOLKIT_CATEGORY_IDS.fr;

  useEffect(() => {
    setCurrentPage(1);
  }, [lang]);

  const { data, isLoading: loading } = usePosts({
    page: currentPage,
    perPage: POSTS_PER_PAGE,
    categories: [toolkitCatId],
  });

  const posts = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const heroImage = posts.length > 0 ? getFeaturedImageUrl(posts[0]) : null;

  return (
    <>
      {/* Custom Hero */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        {/* Background image from first post */}
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/85 to-teal-900/90" aria-hidden="true" />
        <div className="absolute inset-0 pattern-african opacity-[0.06]" aria-hidden="true" />

        {/* Decorative elements */}
        <div className="absolute top-14 right-20 w-28 h-28 border border-white/10 rounded-2xl rotate-12 hidden lg:block" aria-hidden="true" />
        <div className="absolute bottom-12 left-16 w-20 h-20 border border-secondary/15 rounded-full hidden lg:block" aria-hidden="true" />
        <div className="absolute top-1/3 right-10 w-14 h-14 border border-white/5 rounded-lg -rotate-12 hidden lg:block" aria-hidden="true" />

        <div className="relative section-container">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-xs text-white/50 mb-8"
            aria-label="Fil d'Ariane"
          >
            <Link to="/" className="hover:text-white/80 transition-colors">{t("nav.home")}</Link>
            <ChevRight size={12} />
            <Link to="/resources" className="hover:text-white/80 transition-colors">{t("nav.resources")}</Link>
            <ChevRight size={12} />
            <span className="text-white/70">{t("nav.resources.toolkits")}</span>
          </motion.nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10"
                >
                  <Package size={28} className="text-emerald-300" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight font-heading"
                >
                  {t("nav.resources.toolkits")}
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg lg:text-xl text-white/85 leading-relaxed"
              >
                {t("resources.toolkits.heroDesc")}
              </motion.p>
            </div>

            {/* Stats card */}
            {total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-8 py-6 text-center"
              >
                <p className="text-4xl font-bold text-emerald-300 font-heading">{total}</p>
                <p className="text-sm text-white/70 mt-1">{t("resources.toolkits.count")}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="section-container">
          <SectionHeader titleKey="resources.toolkits.allTitle" bottomMargin="mb-12" />

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-muted rounded w-1/4" />
                    <div className="h-5 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <Wrench size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-xl text-muted-foreground">
                {t("resources.toolkits.empty")}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => {
                  const imageUrl = getFeaturedImageUrl(post);
                  const title = stripHtml(post.title.rendered);
                  return (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        state={{ from: "/resources/toolkits", fromLabelKey: "nav.resources.toolkits" }}
                        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label={`${t("releases.read")} : ${title}`}
                      >
                        {/* Cover image */}
                        <div className="aspect-[3/4] overflow-hidden bg-muted/50 p-6 flex items-center justify-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={title}
                              className="max-w-full max-h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Wrench size={64} className="text-muted-foreground/30" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <p className="text-xs text-muted-foreground mb-2">
                            {formatDate(post.date)}
                          </p>
                          <h3 className="font-heading text-sm font-bold text-card-foreground leading-tight line-clamp-3 group-hover:text-primary transition-colors">
                            {title}
                          </h3>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 mt-14" aria-label={lang === "fr" ? "Pagination des boîtes à outils" : "Toolkits pagination"}>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg border border-border disabled:opacity-30 transition-colors hover:bg-muted disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={lang === "fr" ? "Page précédente" : "Previous page"}
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "border border-border hover:bg-muted"
                        }`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-lg border border-border disabled:opacity-30 transition-colors hover:bg-muted disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={lang === "fr" ? "Page suivante" : "Next page"}
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default withDataProviders(ResourcesToolkits);
