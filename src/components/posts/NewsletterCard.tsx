import { Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import NewsletterForm from "@/components/NewsletterForm";

/**
 * Compact newsletter card for sidebar usage.
 * Wraps the shared NewsletterForm in a styled card.
 */
const NewsletterCard = () => {
  const { t } = useI18n();

  return (
    <div className="rounded-xl overflow-hidden" aria-labelledby="sidebar-newsletter-heading">
      <div className="relative p-6 hero-gradient">
        <div className="absolute inset-0 pattern-african opacity-10" aria-hidden="true" />
        <div className="relative z-10">
          <Mail className="mb-3 text-secondary" size={28} aria-hidden="true" />
          <h3 id="sidebar-newsletter-heading" className="text-lg font-bold text-primary-foreground mb-2 font-heading">
            {t("newsletter.title")}
          </h3>
          <p className="text-sm text-primary-foreground/70 mb-4 leading-relaxed">
            {t("newsletter.desc")}
          </p>

          <NewsletterForm variant="stacked" idPrefix="sidebar-newsletter" />
        </div>
      </div>
    </div>
  );
};

export default NewsletterCard;
