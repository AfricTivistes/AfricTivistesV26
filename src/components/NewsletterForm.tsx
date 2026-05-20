import { Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type NewsletterFormVariant = "inline" | "stacked" | "footer";

interface NewsletterFormProps {
  /** "inline" = homepage row, "stacked" = sidebar column, "footer" = compact footer style */
  variant?: NewsletterFormVariant;
  /** HTML id prefix for inputs */
  idPrefix?: string;
}

const INFOMANIAK_ACTION = import.meta.env.PUBLIC_INFOMANIAK_NEWSLETTER_ACTION;
const INFOMANIAK_KEY = import.meta.env.PUBLIC_INFOMANIAK_NEWSLETTER_KEY;
const INFOMANIAK_WEBFORM_ID = import.meta.env.PUBLIC_INFOMANIAK_NEWSLETTER_WEBFORM_ID;

/**
 * Reusable newsletter subscription form.
 * Posts directly to Infomaniak newsletter service.
 * Three layout variants: "inline" (homepage), "stacked" (sidebar), "footer" (compact).
 */
const NewsletterForm = ({ variant = "inline", idPrefix = "newsletter" }: NewsletterFormProps) => {
  const { t } = useI18n();

  const hiddenFields = (
    <>
      <input type="email" name="email" style={{ display: "none" }} />
      <input type="hidden" name="key" value={INFOMANIAK_KEY} />
      <input type="hidden" name="webform_id" value={INFOMANIAK_WEBFORM_ID} />
    </>
  );

  if (variant === "footer") {
    return (
      <form
        method="post"
        action={INFOMANIAK_ACTION}
        target="_blank"
        className="flex flex-col gap-2"
      >
        {hiddenFields}
        <div className="flex gap-2">
          <input
            id={`${idPrefix}-email`}
            type="text"
            name="inf[1]"
            required
            placeholder="Email"
            className="flex-1 min-w-0 px-3 py-2 rounded-md bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="input-newsletter-email"
            aria-label={t("newsletter.placeholder")}
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="button-newsletter-submit"
            aria-label="S'abonner à la newsletter"
          >
            <Send size={14} aria-hidden="true" />
          </button>
        </div>
      </form>
    );
  }

  if (variant === "stacked") {
    return (
      <form
        method="post"
        action={INFOMANIAK_ACTION}
        target="_blank"
        className="flex flex-col gap-2.5"
      >
        {hiddenFields}
        <input
          id={`${idPrefix}-email`}
          type="text"
          name="inf[1]"
          required
          placeholder={t("newsletter.placeholder")}
          className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary transition"
          aria-label={t("newsletter.placeholder")}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground hover:bg-secondary/90 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          <Send size={14} aria-hidden="true" />
          {t("newsletter.subscribe")}
        </button>
      </form>
    );
  }

  return (
    <div>
      <form
        method="post"
        action={INFOMANIAK_ACTION}
        target="_blank"
        className="flex flex-col sm:flex-row gap-3"
      >
        {hiddenFields}
        <input
          id={`${idPrefix}-email`}
          type="text"
          name="inf[1]"
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
      <p className="text-xs text-primary-foreground/50 leading-relaxed mt-3">
        {t("newsletter.rgpd")}
      </p>
    </div>
  );
};

export default NewsletterForm;
