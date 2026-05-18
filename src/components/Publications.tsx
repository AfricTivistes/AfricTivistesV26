import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import { m as motion } from "framer-motion";
import { Link } from "@/lib/router-shim";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { usePublicationPosts } from "@/hooks/use-wordpress";
import { PostGrid, PostGridSkeleton } from "@/components/posts";

const Publications = () => {
  const { t } = useI18n();
  const { data: posts = [], isLoading: loading } = usePublicationPosts(3);

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-muted/30" aria-label={t("publications.title")}>
        <div className="section-container">
          <div className="h-8 w-56 bg-muted rounded mb-14 mx-auto animate-pulse" aria-hidden="true" />
          <PostGridSkeleton count={3} variant="cover" columns={3} />
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-muted/30" aria-labelledby="publications-heading">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 id="publications-heading" className="text-3xl lg:text-4xl font-bold text-foreground">
            {t("publications.title")}
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" aria-hidden="true" />
        </motion.div>

        <PostGrid
          posts={posts}
          variant="cover"
          columns={3}
          showDate={false}
        />

        <div className="text-center mt-5">
          <Link
            to="/resources/publications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            aria-label={t("publications.viewAll")}
          >
            {t("publications.viewAll")} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default withI18nQueryMotion(Publications);
