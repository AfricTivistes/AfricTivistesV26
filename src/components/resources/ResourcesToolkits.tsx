import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Wrench, Package } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { PostGrid, PostGridSkeleton } from "@/components/posts";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import { useI18n } from "@/lib/i18n";
import { getFeaturedImageUrl, TOOLKIT_CATEGORY_IDS } from "@/lib/wordpress";
import type { WPPost } from "@/lib/wordpress";
import { usePosts } from "@/hooks/use-wordpress";

const POSTS_PER_PAGE = 9;

interface ResourcesToolkitsProps {
  /** Server-rendered initial posts data (page 1). Avoids first-paint skeleton. */
  initialPostsData?: { posts: WPPost[]; totalPages: number; total: number };
}

const ResourcesToolkits = ({ initialPostsData }: ResourcesToolkitsProps) => {
  const { t, lang } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const toolkitCatId = TOOLKIT_CATEGORY_IDS[lang] || TOOLKIT_CATEGORY_IDS.fr;

  useEffect(() => {
    setCurrentPage(1);
  }, [lang]);

  const { data, isLoading: loading } = usePosts(
    {
      page: currentPage,
      perPage: POSTS_PER_PAGE,
      categories: [toolkitCatId],
    },
    { initialData: currentPage === 1 ? initialPostsData : undefined },
  );

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
            loading="lazy"
            decoding="async"
            width="1920"
            height="600"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950/90 via-emerald-900/85 to-teal-900/90" aria-hidden="true" />
        <div className="absolute inset-0 pattern-african opacity-[0.06]" aria-hidden="true" />

        {/* Decorative elements */}
        <div className="absolute top-14 right-20 w-28 h-28 border border-white/10 rounded-2xl rotate-12 hidden lg:block" aria-hidden="true" />
        <div className="absolute bottom-12 left-16 w-20 h-20 border border-secondary/15 rounded-full hidden lg:block" aria-hidden="true" />
        <div className="absolute top-1/3 right-10 w-14 h-14 border border-white/5 rounded-lg -rotate-12 hidden lg:block" aria-hidden="true" />

        <div className="relative section-container">
          <Breadcrumb
            items={[
              { to: "/", label: t("nav.home") },
              { to: "/resources", label: t("nav.resources") },
            ]}
            current={t("nav.resources.toolkits")}
          />

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 backdrop-blur-xs border border-white/10"
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
                className="shrink-0 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-8 py-6 text-center"
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

          {loading && posts.length === 0 ? (
            <PostGridSkeleton count={3} variant="cover" columns={3} />
          ) : posts.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <Wrench size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-xl text-muted-foreground">
                {t("resources.toolkits.empty")}
              </p>
            </div>
          ) : (
            <>
              <PostGrid
                posts={posts}
                variant="cover"
                columns={3}
                linkState={{ from: "/resources/toolkits", fromLabelKey: "nav.resources.toolkits" }}
                placeholderIcon={Wrench}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                ariaLabel={lang === "fr" ? "Pagination des boîtes à outils" : "Toolkits pagination"}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default withI18nQueryMotion(ResourcesToolkits);
