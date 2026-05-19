import { useState } from "react";
import { Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type NewsletterFormVariant = "inline" | "stacked";

interface NewsletterFormProps {
  /** "inline" = input + button side by side (homepage), "stacked" = input above button (sidebar) */
  variant?: NewsletterFormVariant;
  /** HTML id prefix for the email input */
  idPrefix?: string;
}

/**
 * Reusable newsletter subscription form.
 * Handles its own state (email + submitted).
 * Two layout variants: "inline" (row) and "stacked" (column).
 */
const NewsletterForm = ({ variant = "inline", idPrefix = "newsletter" }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    const isInline = variant === "inline";
    return (
      <div
        className={`bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 ${isInline ? "rounded-xl p-6" : "rounded-lg p-4"}`}
        role="status"
        aria-live="polite"
      >
        <p className={`font-semibold text-primary-foreground ${isInline ? "text-lg" : "text-sm"}`}>
          {isInline && "✓ "}{t("newsletter.thanks")}
        </p>
        <p className={`text-primary-foreground/70 mt-1 ${isInline ? "text-sm" : "text-xs"}`}>
          {t("newsletter.soon")}
        </p>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={t("newsletter.placeholder")}
          className="w-full px-4 py-2.5 rounded-lg bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary transition"
          aria-label={t("newsletter.placeholder")}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          <Send size={14} aria-hidden="true" />
          {t("newsletter.subscribe")}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        id={`${idPrefix}-email`}
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
  );
};

export default NewsletterForm;
