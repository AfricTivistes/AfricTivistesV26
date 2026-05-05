import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PostCard from "./PostCard";
import { useI18n } from "@/lib/i18n";
import { usePosts } from "@/hooks/use-wordpress";

const LatestNews = () => {
  const { t } = useI18n();
  const { data, isLoading: loading } = usePosts({ perPage: 6 });
  const posts = data?.posts ?? [];

  return (
    <section className="py-12 lg:py-16" aria-labelledby="latest-news-heading">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 id="latest-news-heading" className="text-3xl lg:text-4xl font-bold text-foreground">{t("news.title")}</h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" aria-hidden="true" />
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Chargement des articles">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse" aria-hidden="true">
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            aria-label={t("news.viewAll")}
          >
            {t("news.viewAll")} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
