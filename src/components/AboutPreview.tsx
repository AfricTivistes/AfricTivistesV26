import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import { ArrowRight, GraduationCap, Network, Wrench, Megaphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const AboutPreview = () => {
  const { t } = useI18n();

  const pillars = [
    { icon: GraduationCap, titleKey: "aboutPreview.pillar1Title", descKey: "aboutPreview.pillar1Desc" },
    { icon: Network, titleKey: "aboutPreview.pillar2Title", descKey: "aboutPreview.pillar2Desc" },
    { icon: Wrench, titleKey: "aboutPreview.pillar3Title", descKey: "aboutPreview.pillar3Desc" },
    { icon: Megaphone, titleKey: "aboutPreview.pillar4Title", descKey: "aboutPreview.pillar4Desc" },
  ];

  return (
    <section className="py-12 lg:py-16 bg-muted/40" aria-labelledby="about-preview-heading">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {t("aboutPreview.label")}
            </span>
            <h2 id="about-preview-heading" className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-6">
              {t("aboutPreview.title1")}
              <span className="text-gradient-gold">{t("aboutPreview.highlight")}</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-base">
              {t("aboutPreview.desc1")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-base">
              {t("aboutPreview.desc2")}
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={t("aboutPreview.ctaLabel")}
            >
              {t("aboutPreview.cta")}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </motion.div>

          {/* Pillars grid */}
          <div className="grid sm:grid-cols-2 gap-4" role="list" aria-label={t("aboutPreview.pillarsLabel")}>
            {pillars.map((p, i) => (
              <motion.div
                key={p.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 transition-all hover:shadow-md group"
                role="listitem"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <p.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading text-base font-bold text-card-foreground mb-2">{t(p.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(p.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(AboutPreview);
