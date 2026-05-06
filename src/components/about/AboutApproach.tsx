import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { GraduationCap, Network, Wrench, Megaphone } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

const approachDef = [
  { icon: GraduationCap, titleKey: "about.approach1Title", descKey: "about.approach1Desc", color: "bg-primary" },
  { icon: Network, titleKey: "about.approach2Title", descKey: "about.approach2Desc", color: "bg-secondary" },
  { icon: Wrench, titleKey: "about.approach3Title", descKey: "about.approach3Desc", color: "bg-accent" },
  { icon: Megaphone, titleKey: "about.approach4Title", descKey: "about.approach4Desc", color: "bg-primary" },
];

const AboutApproach = () => {
  const { t } = useI18n();
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="section-container">
        <SectionHeader labelKey="about.approachTitle" titleKey="about.approachSubtitle" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {approachDef.map((a, i) => (
            <motion.div
              key={a.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all group text-center"
            >
              <div className={`w-14 h-14 rounded-xl ${a.color}/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                <a.icon size={28} className={`${a.color === "bg-secondary" ? "text-secondary" : a.color === "bg-accent" ? "text-accent" : "text-primary"}`} />
              </div>
              <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">{t(a.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(a.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(AboutApproach);