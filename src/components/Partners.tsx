import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { usePartenaires } from "@/hooks/use-wordpress";
import { getPartenaireImageUrl, stripHtml } from "@/lib/wordpress";

const Partners = () => {
  const { t } = useI18n();
  const { data: partenaires = [], isLoading } = usePartenaires();

  /* Deduplicate by logo URL to avoid repeats from the API */
  const logos = partenaires
    .map((p) => ({
      name: stripHtml(p.title.rendered),
      logo: getPartenaireImageUrl(p),
    }))
    .filter((p) => p.logo)
    .filter((p, i, arr) => arr.findIndex((x) => x.logo === p.logo) === i);

  if (isLoading) {
    return (
      <section className="py-6 lg:py-10" aria-label={t("partners.title")}>
        <div className="section-container">
          <div className="h-6 w-40 bg-muted rounded mb-5 mx-auto animate-pulse" aria-hidden="true" />
          <div className="flex items-center justify-center gap-8 lg:gap-14">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 lg:h-12 w-24 bg-muted rounded animate-pulse" aria-hidden="true" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (logos.length === 0) return null;

  /* Split logos into two rows */
  const mid = Math.ceil(logos.length / 2);
  const row1 = [...logos.slice(0, mid), ...logos.slice(0, mid)];
  const row2 = [...logos.slice(mid), ...logos.slice(mid)];

  return (
    <section className="py-4 lg:py-6" aria-labelledby="partners-heading">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 id="partners-heading" className="text-xl lg:text-2xl font-bold text-foreground">{t("partners.title")}</h2>
        </motion.div>

        <div className="relative overflow-hidden space-y-2" aria-label={t("partners.title")}>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent z-10" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent z-10" aria-hidden="true" />

          {/* Row 1 - left to right */}
          <div className="flex items-center gap-3 animate-marquee">
            {row1.map((p, i) => (
              <div
                key={`r1-${p.name}-${i}`}
                className="flex-shrink-0 flex items-center justify-center w-28 h-14 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={p.logo!}
                  alt={`Logo ${p.name}`}
                  className="max-h-10 max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  width="160"
                  height="40"
                />
              </div>
            ))}
          </div>

          {/* Row 2 - right to left */}
          <div className="flex items-center gap-3 animate-marquee-reverse">
            {row2.map((p, i) => (
              <div
                key={`r2-${p.name}-${i}`}
                className="flex-shrink-0 flex items-center justify-center w-28 h-14 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={p.logo!}
                  alt={`Logo ${p.name}`}
                  className="max-h-10 max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  width="160"
                  height="40"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(Partners);
