import { motion } from "framer-motion";
import { Heart, GraduationCap, Network, Rocket, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const reasonsDef = [
  { icon: Heart, titleKey: "join.reason1Title", descKey: "join.reason1Desc", color: "text-primary", bg: "bg-primary/10" },
  { icon: GraduationCap, titleKey: "join.reason2Title", descKey: "join.reason2Desc", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: Network, titleKey: "join.reason3Title", descKey: "join.reason3Desc", color: "text-accent", bg: "bg-accent/10" },
  { icon: Rocket, titleKey: "join.reason4Title", descKey: "join.reason4Desc", color: "text-primary", bg: "bg-primary/10" },
  { icon: Star, titleKey: "join.reason5Title", descKey: "join.reason5Desc", color: "text-secondary", bg: "bg-secondary/10" },
];

const JoinReasons = () => {
  const { t } = useI18n();

  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {t("join.whyLabel")}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {t("join.whyTitle")}
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasonsDef.map((r, i) => (
            <motion.div
              key={r.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-7 border border-border hover:border-primary/20 hover:shadow-lg transition-all group"
            >
              <div className={`w-14 h-14 rounded-xl ${r.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <r.icon className={r.color} size={28} />
              </div>
              <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">{t(r.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(r.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JoinReasons;
