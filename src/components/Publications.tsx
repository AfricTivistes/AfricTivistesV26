import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { Link } from "@/lib/router-shim";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getFeaturedImageUrl, stripHtml } from "@/lib/wordpress";
import { usePublicationPosts } from "@/hooks/use-wordpress";

const Publications = () => {
  const { t } = useI18n();
  const { data: posts = [], isLoading: loading } = usePublicationPosts(3);

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-muted/30" aria-label={t("publications.title")}>
        <div className="section-container">
          <div className="h-8 w-56 bg-muted rounded mb-14 mx-auto animate-pulse" aria-hidden="true" />
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse" aria-hidden="true">
                <div className="aspect-[400/350] bg-muted rounded-xl mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                <div className="h-3 bg-muted rounded w-1/2 mx-auto mt-2" />
              </div>
            ))}
          </div>
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

        <div className="grid md:grid-cols-3 gap-6" role="list" aria-label={t("publications.title")}>
          {posts.map((post, i) => {
            const imageUrl = getFeaturedImageUrl(post);
            const title = stripHtml(post.title.rendered);
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
                role="listitem"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`${t("releases.read")} : ${title}`}
                >
                  <div className="aspect-[400/350] overflow-hidden bg-muted p-4 flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="560"
                      />
                    ) : (
                      <div className="w-full h-full pattern-kente" aria-hidden="true" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-sm font-bold text-card-foreground leading-tight line-clamp-3 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

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

export default withDataProviders(Publications);
