import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { Send, User, Building2, Users as UsersIcon, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

type MemberType = "person" | "org" | "movement";

const memberTypes: { value: MemberType; label: string; icon: typeof User }[] = [
  { value: "person", label: "join.typePerson", icon: User },
  { value: "org", label: "join.typeOrg", icon: Building2 },
  { value: "movement", label: "join.typeMovement", icon: UsersIcon },
];

const JoinForm = () => {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [memberType, setMemberType] = useState<MemberType>("person");

  return (
    <section id="formulaire" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {t("join.formLabel")}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {t("join.formTitle")}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            {t("join.formDesc")}
          </p>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-10 text-center" role="status" aria-live="polite">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="text-accent" size={32} />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">{t("join.thanks")}</p>
              <p className="text-muted-foreground leading-relaxed">{t("join.thanksDesc")}</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="bg-card rounded-2xl border border-border p-8 lg:p-10 shadow-sm space-y-6"
              aria-label={t("join.formLabel")}
            >
              {/* Type de membre */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">{t("join.typeLabel")}</label>
                <div className="grid grid-cols-3 gap-3">
                  {memberTypes.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMemberType(opt.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        memberType === opt.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <opt.icon size={22} />
                      <span>{t(opt.label)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Champs conditionnels */}
              {memberType === "person" ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="join-firstname" className="block text-sm font-medium text-foreground mb-1.5">
                      {t("join.firstName")}
                    </label>
                    <input
                      id="join-firstname"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder={t("join.firstNamePlaceholder")}
                    />
                  </div>
                  <div>
                    <label htmlFor="join-lastname" className="block text-sm font-medium text-foreground mb-1.5">
                      {t("join.lastName")}
                    </label>
                    <input
                      id="join-lastname"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder={t("join.lastNamePlaceholder")}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="join-orgname" className="block text-sm font-medium text-foreground mb-1.5">
                    {t("join.orgName")}
                  </label>
                  <input
                    id="join-orgname"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder={t("join.orgNamePlaceholder")}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="join-email" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("join.email")}
                </label>
                <input
                  id="join-email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder={t("join.emailPlaceholder")}
                />
              </div>

              {/* Pays */}
              <div>
                <label htmlFor="join-country" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("join.country")}
                </label>
                <input
                  id="join-country"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder={t("join.countryPlaceholder")}
                />
              </div>

              {/* Motivation */}
              <div>
                <label htmlFor="join-motivation" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("join.motivation")}
                </label>
                <textarea
                  id="join-motivation"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                  placeholder={t("join.motivationPlaceholder")}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Send size={16} aria-hidden="true" />
                {t("join.submit")}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default withDataProviders(JoinForm);