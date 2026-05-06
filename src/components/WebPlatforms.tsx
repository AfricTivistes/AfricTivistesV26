import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getPlateformeImageUrl, stripHtml } from "@/lib/wordpress";
import { usePlateformes } from "@/hooks/use-wordpress";
import { withDataProviders } from "@/lib/withProviders";

const WebPlatforms = () => {
  const { t } = useI18n();
  const { data: platforms = [], isLoading: loading } = usePlateformes(100);

  return (
    <section className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            {t("platforms.title")}
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse" aria-hidden="true">
                <div className="aspect-square bg-muted rounded-xl mb-2" />
                <div className="h-3 bg-muted rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {platforms.map((p, i) => {
              const imageUrl = getPlateformeImageUrl(p);
              const title = stripHtml(p.title.rendered);
              const url = p.acf?.url || "#";
              return (
                <motion.a
                  key={p.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group bg-card rounded-xl border border-border hover:border-primary/30 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full pattern-kente" aria-hidden="true" />
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-xs font-bold text-card-foreground leading-tight flex items-center justify-center gap-1">
                      {title}
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </h3>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default withDataProviders(WebPlatforms);
