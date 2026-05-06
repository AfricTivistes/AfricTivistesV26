import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import { ClipboardList, Search, MailCheck, HandshakeIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const stepsDef = [
  { icon: ClipboardList, titleKey: "join.step1Title", descKey: "join.step1Desc" },
  { icon: Search, titleKey: "join.step2Title", descKey: "join.step2Desc" },
  { icon: MailCheck, titleKey: "join.step3Title", descKey: "join.step3Desc" },
  { icon: HandshakeIcon, titleKey: "join.step4Title", descKey: "join.step4Desc" },
];

const JoinSteps = () => {
  const { t } = useI18n();

  return (
    <section className="py-20 lg:py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {t("join.howLabel")}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {t("join.howTitle")}
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepsDef.map((s, i) => (
            <motion.div
              key={s.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-card rounded-xl p-6 border border-border text-center hover:border-primary/20 hover:shadow-lg transition-all group"
            >
              {/* Step number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-md">
                {i + 1}
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mt-3 mb-5 group-hover:scale-110 transition-transform">
                <s.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">{t(s.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
              {/* Connector line */}
              {i < stepsDef.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(JoinSteps);