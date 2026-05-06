import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const ContactForm = () => {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{t("contact.title")}</h1>
        <p className="text-lg text-muted-foreground mb-12">
          {t("contact.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-12" role="list">
          <div className="flex items-center gap-3 text-sm" role="listitem">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <Mail size={18} className="text-primary" />
            </div>
            <a href="mailto:info@africtivistes.org" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">
              info@africtivistes.org
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm" role="listitem">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <MapPin size={18} className="text-primary" />
            </div>
            <span className="text-muted-foreground">Dakar, Sénégal</span>
          </div>
        </div>

        {submitted ? (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 text-center" role="status" aria-live="polite">
            <p className="text-lg font-semibold text-primary" data-testid="text-contact-thanks">{t("contact.thanks")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("contact.reply")}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="space-y-5"
            aria-label="Formulaire de contact"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">{t("contact.name")}</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder={t("contact.namePlaceholder")}
                  data-testid="input-name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">{t("contact.email")}</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="votre@email.com"
                  data-testid="input-email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1.5">{t("contact.subject")}</label>
              <input
                id="contact-subject"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder={t("contact.subjectPlaceholder")}
                data-testid="input-subject"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">{t("contact.message")}</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                placeholder={t("contact.messagePlaceholder")}
                data-testid="input-message"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              data-testid="button-send"
            >
              <Send size={16} aria-hidden="true" />
              {t("contact.send")}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default withDataProviders(ContactForm);