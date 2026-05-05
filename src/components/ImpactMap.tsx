import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const ImpactMap = () => {
  const { t } = useI18n();

  const yearsExistence = new Date().getFullYear() - 2015 - 1;

  const impactItems = [
    { value: `+${yearsExistence}`, label: t("about.yearsExistence"), suffix: "" },
    { value: "+2 000", label: t("about.stat.benefPresential"), suffix: "" },
    { value: "7 858", label: t("about.stat.benefOnline"), suffix: "" },
    { value: "+1 283", label: t("about.stat.participants"), suffix: "" },
    { value: "15", label: t("about.stat.elections"), suffix: "" },
    { value: "32", label: t("about.stat.communities"), suffix: "" },
    { value: "+30", label: t("about.stat.youth"), suffix: "" },
    { value: "+25", label: t("about.stat.civicTech"), suffix: "" },
    { value: "11", label: t("about.stat.activists"), suffix: "" },
    { value: "7", label: t("about.stat.awards"), suffix: "" },
    { value: "420 000 €", label: t("about.stat.grants"), suffix: "" },
    { value: "7", label: t("about.stat.technical"), suffix: "" },
    { value: "+25", label: t("about.stat.research"), suffix: "" },
    { value: "3", label: t("about.stat.elearning"), suffix: "" },
  ];

  const milestones = [
    { year: "2015", event: t("about.milestone2015") },
    { year: "2017", event: t("about.milestone2017") },
    { year: "2019", event: t("about.milestone2019") },
    { year: "2021", event: t("about.milestone2021") },
    { year: "2023", event: t("about.milestone2023") },
  ];

  return (
    <section className="py-24 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("about.impactLabel")}</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {t("about.impactTitle")}
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {impactItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg hover:border-primary/20 transition-all"
            >
              <div className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">
                {item.value}<span className="text-secondary">{item.suffix}</span>
              </div>
              <div className="text-xs text-muted-foreground font-medium leading-snug">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-border lg:-translate-x-px" />
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-start gap-6 mb-10 ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } flex-row`}
            >
              <div className="hidden lg:block lg:w-1/2" />
              <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-primary border-[3px] border-background -translate-x-2 lg:-translate-x-2 mt-1 z-10 shadow-md" />
              <div className="pl-10 lg:pl-0 lg:w-1/2">
                <span className="inline-block text-xs font-bold text-white bg-secondary px-2.5 py-0.5 rounded-full">{m.year}</span>
                <p className="text-sm text-foreground mt-2 leading-relaxed">{m.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMap;
