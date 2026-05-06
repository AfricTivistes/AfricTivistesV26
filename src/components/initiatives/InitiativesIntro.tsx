import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const STATS = [
  { value: "5", labelFr: "Axes d'intervention", labelEn: "Areas of intervention" },
  { value: "45", labelFr: "Pays d'intervention", labelEn: "Countries" },
  { value: "400+", labelFr: "Membres actifs", labelEn: "Active members" },
  { value: "10", labelFr: "Années d'engagement", labelEn: "Years of engagement" },
];

const InitiativesIntro = () => {
  const { t, lang } = useI18n();

  return (
    <section className="py-16 lg:py-20">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {t("initiatives.planLabel")}
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mt-2 mb-6 font-heading">
              {t("initiatives.planTitle")}
            </h2>
            <p className="text-muted-foreground leading-[1.8] mb-4">
              {t("initiatives.planDesc1")}
            </p>
            <p className="text-muted-foreground leading-[1.8]">
              {t("initiatives.planDesc2")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="bg-card rounded-xl border border-border p-5 text-center"
              >
                <div className="text-2xl lg:text-3xl font-bold text-primary font-heading mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {lang === "fr" ? stat.labelFr : stat.labelEn}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(InitiativesIntro);