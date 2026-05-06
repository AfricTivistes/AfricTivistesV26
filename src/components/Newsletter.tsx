import { withDataProviders } from "@/lib/withProviders";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

          {submitted ? (
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-6" role="status" aria-live="polite">
              <p className="text-lg font-semibold text-primary-foreground">
                ✓ {t("newsletter.thanks")}
              </p>
              <p className="text-sm text-primary-foreground/70 mt-1">
                {t("newsletter.soon")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("newsletter.placeholder")}
                className="flex-1 px-5 py-3.5 rounded-lg bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                aria-label={t("newsletter.placeholder")}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-7 py-3.5 font-bold text-secondary-foreground hover:bg-secondary/90 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                <Send size={16} aria-hidden="true" />
                {t("newsletter.subscribe")}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default withDataProviders(Newsletter);
