import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import { Scale, BarChart3, MapPin, Handshake } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

const principlesDef = [
  { icon: Scale, titleKey: "values.principle1Title", descKey: "values.principle1Desc" },
  { icon: BarChart3, titleKey: "values.principle2Title", descKey: "values.principle2Desc" },
  { icon: MapPin, titleKey: "values.principle3Title", descKey: "values.principle3Desc" },
  { icon: Handshake, titleKey: "values.principle4Title", descKey: "values.principle4Desc" },
];

const ValuesPrinciples = () => {
  const { t } = useI18n();
  return (
    <section className="py-12 lg:py-16 bg-muted/50">
      <div className="section-container">
        <SectionHeader labelKey="values.principlesLabel" titleKey="values.principlesTitle" />
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {principlesDef.map((p, i) => (
            <motion.div
              key={p.titleKey}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group flex gap-5 bg-card rounded-xl p-6 lg:p-7 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                <p.icon size={22} className="text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">
                  {t(p.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(p.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(ValuesPrinciples);