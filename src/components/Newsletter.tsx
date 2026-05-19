import { withI18nMotion } from "@/lib/providers/withI18nMotion";
import { m as motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import NewsletterForm from "@/components/NewsletterForm";

const Newsletter = () => {
  const { t } = useI18n();

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden" aria-labelledby="newsletter-heading">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 pattern-african" aria-hidden="true" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <Mail className="mx-auto mb-4 text-secondary" size={40} aria-hidden="true" />
          <h2 id="newsletter-heading" className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            {t("newsletter.title")}
          </h2>
          <p className="text-primary-foreground/70 mb-8 text-lg">
            {t("newsletter.desc")}
          </p>

          <NewsletterForm variant="inline" idPrefix="newsletter" />
        </motion.div>
      </div>
    </section>
  );
};

export default withI18nMotion(Newsletter);
