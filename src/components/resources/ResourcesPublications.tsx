import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { FileText, BookOpen } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { PostGrid, PostGridSkeleton } from "@/components/posts";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import { useI18n } from "@/lib/i18n";
import { PUBLICATION_CATEGORY_IDS, getFeaturedImageUrl } from "@/lib/wordpress";
import { usePosts } from "@/hooks/use-wordpress";

const POSTS_PER_PAGE = 9;

const ResourcesPublications = () => {
  const { t, lang } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const pubCatId = PUBLICATION_CATEGORY_IDS[lang] || PUBLICATION_CATEGORY_IDS.fr;

  useEffect(() => {
    setCurrentPage(1);
  }, [lang]);

  const { data, isLoading: loading } = usePosts({
    page: currentPage,
    perPage: POSTS_PER_PAGE,
    categories: [pubCatId],
  });

  const posts = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const heroImage = posts.length > 0 ? getFeaturedImageUrl(posts[0]) : null;

  return (
    <>
      {/* Custom Hero */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-primary/85 to-indigo-900/90" aria-hidden="true" />
        <div className="absolute inset-0 pattern-african opacity-[0.06]" aria-hidden="true" />

        {/* Decorative elements */}
        <div className="absolute top-10 right-12 w-36 h-36 border border-white/10 rounded-full hidden lg:block" aria-hidden="true" />
        <div className="absolute bottom-10 right-1/4 w-24 h-24 border border-secondary/15 rounded-xl rotate-12 hidden lg:block" aria-hidden="true" />
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white/5 rounded-lg -rotate-45 hidden lg:block" aria-hidden="true" />

        <div className="relative section-container">
          <Breadcrumb
            items={[
              { to: "/", label: t("nav.home") },
              { to: "/resources", label: t("nav.resources") },
            ]}
            current={t("nav.resources.publications")}
          />

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10"
                >
                  <BookOpen size={28} className="text-secondary" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight font-heading"
                >
                  {t("nav.resources.publications")}
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg lg:text-xl text-white/85 leading-relaxed"
              >
                {t("resources.publications.heroDesc")}
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
                <p className="text-4xl font-bold text-secondary font-heading">{total}</p>
                <p className="text-sm text-white/70 mt-1">{t("resources.publications.count")}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="section-container">
          <SectionHeader titleKey="resources.publications.allTitle" bottomMargin="mb-12" />

          {loading ? (
            <PostGridSkeleton count={6} variant="cover" columns={3} />
          ) : posts.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <FileText size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-xl text-muted-foreground">
                {t("resources.publications.empty")}
              </p>
            </div>
          ) : (
            <>
              <PostGrid
                posts={posts}
                variant="cover"
                columns={3}
                linkState={{ from: "/resources/publications", fromLabelKey: "nav.resources.publications" }}
                placeholderIcon={FileText}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                ariaLabel={lang === "fr" ? "Pagination des publications" : "Publications pagination"}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default withI18nQueryMotion(ResourcesPublications);
