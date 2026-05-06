import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { Target, Heart, Users, Globe } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

const valuesDef = [
  { icon: Target, titleKey: "about.val1Title", descKey: "about.val1Desc" },
  { icon: Heart, titleKey: "about.val2Title", descKey: "about.val2Desc" },
  { icon: Users, titleKey: "about.val3Title", descKey: "about.val3Desc" },
  { icon: Globe, titleKey: "about.val4Title", descKey: "about.val4Desc" },
];

const AboutValues = () => {
  const { t } = useI18n();
  return (
    <section className="py-12 lg:py-16 bg-muted/50">
      <div className="section-container">
        <SectionHeader labelKey="about.valuesTitle" titleKey="about.valuesSubtitle" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valuesDef.map((v, i) => (
            <motion.div
              key={v.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-7 border border-border text-center hover:border-primary/20 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <v.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-heading text-lg font-bold text-card-foreground mb-3">{t(v.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(AboutValues);