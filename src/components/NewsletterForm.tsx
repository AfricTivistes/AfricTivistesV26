import { useEffect, useRef, useState } from "react";
import { Send, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { withI18n } from "@/lib/providers/withI18n";

type NewsletterFormVariant = "inline" | "stacked" | "footer";

interface NewsletterFormProps {
  variant?: NewsletterFormVariant;
  idPrefix?: string;
}

const INFOMANIAK_ACTION = import.meta.env.PUBLIC_INFOMANIAK_NEWSLETTER_ACTION;
const INFOMANIAK_KEY = import.meta.env.PUBLIC_INFOMANIAK_NEWSLETTER_KEY;
const INFOMANIAK_WEBFORM_ID = import.meta.env.PUBLIC_INFOMANIAK_NEWSLETTER_WEBFORM_ID;

const ALTCHA_WIDGET_SRC = "https://newsletter.infomaniak.com/v3/static/mcaptcha/altcha.min.js?v=1779462000";
const ALTCHA_CHALLENGE_URL = "https://newsletter.infomaniak.com/v3/altcha-challenge";

function loadScript(src: string, opts?: { type?: string; defer?: boolean }): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    if (opts?.type) s.type = opts.type;
    if (opts?.defer) s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });
}

function useAltchaCaptcha(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let widget: HTMLElement | null = null;

    (async () => {
      await loadScript(ALTCHA_WIDGET_SRC, { type: "module" });
      if (!containerRef.current) return;
      if (containerRef.current.querySelector("altcha-widget")) return;

      widget = document.createElement("altcha-widget");
      widget.setAttribute("hidelogo", "");
      widget.setAttribute("hidefooter", "");
      widget.setAttribute("challengeurl", ALTCHA_CHALLENGE_URL);
      containerRef.current.appendChild(widget);
    })();

    return () => {
      if (widget && widget.parentNode) {
        widget.parentNode.removeChild(widget);
      }
    };
  }, [containerRef]);
}

/**
 * Newsletter subscription form.
 * Submits via fetch to avoid any browser navigation / 404 redirect.
 * Collects all form data including the altcha captcha token and posts it.
 */
const NewsletterForm = ({ variant = "inline", idPrefix = "newsletter" }: NewsletterFormProps) => {
  const { t } = useI18n();
  const captchaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useAltchaCaptcha(captchaRef);

  // Attach submit handler directly on the DOM element with capture phase
  // to ensure it fires before any third-party script (altcha, webform_index).
  // This also survives Astro View Transitions with transition:persist.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handler = async (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      setLoading(true);

      const formData = new FormData(form);

      try {
        const iframe = document.createElement("iframe");
        iframe.name = `${idPrefix}-submit-frame-${Date.now()}`;
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        const tempForm = document.createElement("form");
        tempForm.method = "post";
        tempForm.action = INFOMANIAK_ACTION;
        tempForm.target = iframe.name;
        tempForm.style.display = "none";

        for (const [key, value] of formData.entries()) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value as string;
          tempForm.appendChild(input);
        }

        document.body.appendChild(tempForm);

        iframe.addEventListener("load", () => {
          setSubmitted(true);
          setLoading(false);
          setTimeout(() => {
            tempForm.remove();
            iframe.remove();
          }, 1000);
        });

        iframe.addEventListener("error", () => {
          setSubmitted(true);
          setLoading(false);
          setTimeout(() => {
            tempForm.remove();
            iframe.remove();
          }, 1000);
        });

        tempForm.submit();
      } catch {
        setSubmitted(true);
        setLoading(false);
      }
    };

    form.addEventListener("submit", handler, true);
    return () => form.removeEventListener("submit", handler, true);
  }, [idPrefix]);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 py-3">
        <Check size={18} className="text-green-400" aria-hidden="true" />
        <span className="text-sm font-medium text-green-400">
          {t("newsletter.thanks")}
        </span>
      </div>
    );
  }

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
        ref={formRef}
        className="inf-form flex flex-col gap-2"
      >
        {hiddenFields}
        <div className="flex gap-2">
          <input
            id={`${idPrefix}-email`}
            type="email"
            name="inf[1]"
            required
            placeholder="Email"
            data-inf-meta="1"
            data-inf-error=""
            className="flex-1 min-w-0 px-3 py-2 rounded-md bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-hidden focus:ring-2 focus:ring-primary"
            data-testid="input-newsletter-email"
            aria-label={t("newsletter.placeholder")}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-50"
            data-testid="button-newsletter-submit"
            aria-label="S'abonner à la newsletter"
          >
            <Send size={14} aria-hidden="true" />
          </button>
        </div>
        <div ref={captchaRef} className="rounded-lg overflow-hidden mt-2" />
      </form>
    );
  }

  if (variant === "stacked") {
    return (
      <form
        ref={formRef}
        className="inf-form flex flex-col gap-2.5"
      >
        {hiddenFields}
        <input
          id={`${idPrefix}-email`}
          type="email"
          name="inf[1]"
          required
          data-inf-meta="1"
          data-inf-error=""
          placeholder={t("newsletter.placeholder")}
          className="w-full px-4 py-2.5 rounded-lg bg-primary-foreground/10 backdrop-blur-xs border border-primary-foreground/20 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-hidden focus:ring-2 focus:ring-secondary transition"
          aria-label={t("newsletter.placeholder")}
        />
        <div ref={captchaRef} className="rounded-lg overflow-hidden" />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground hover:bg-secondary/90 transition-colors focus:outline-hidden focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50"
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
        ref={formRef}
        className="inf-form flex flex-col gap-3"
      >
        {hiddenFields}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id={`${idPrefix}-email`}
            type="email"
            name="inf[1]"
            required
            data-inf-meta="1"
            data-inf-error=""
            placeholder={t("newsletter.placeholder")}
            className="flex-1 px-5 py-3.5 rounded-lg bg-primary-foreground/10 backdrop-blur-xs border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-hidden focus:ring-2 focus:ring-secondary transition"
            aria-label={t("newsletter.placeholder")}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-7 py-3.5 font-bold text-secondary-foreground hover:bg-secondary/90 transition-colors whitespace-nowrap focus:outline-hidden focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50"
          >
            <Send size={16} aria-hidden="true" />
            {t("newsletter.subscribe")}
          </button>
        </div>
        <div ref={captchaRef} className="rounded-lg overflow-hidden" />
      </form>
      <p className="text-xs text-primary-foreground/50 leading-relaxed mt-3">
        {t("newsletter.rgpd")}
      </p>
    </div>
  );
};

export default withI18n(NewsletterForm);
