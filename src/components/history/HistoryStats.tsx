import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, GraduationCap, Vote, Wifi } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

const statsDef = [
  { valueKey: "history.stat1Value", labelKey: "history.stat1Label", icon: MapPin, color: "text-primary" },
  { valueKey: "history.stat2Value", labelKey: "history.stat2Label", icon: Users, color: "text-secondary" },
  { valueKey: "history.stat3Value", labelKey: "history.stat3Label", icon: Calendar, color: "text-accent" },
  { valueKey: "history.stat4Value", labelKey: "history.stat4Label", icon: GraduationCap, color: "text-primary" },
  { valueKey: "history.stat5Value", labelKey: "history.stat5Label", icon: Vote, color: "text-secondary" },
  { valueKey: "history.stat6Value", labelKey: "history.stat6Label", icon: Wifi, color: "text-accent" },
];

const HistoryStats = () => {
  const { t } = useI18n();
  return (
    <section className="py-12 lg:py-16">
      <div className="section-container">
        <SectionHeader labelKey="history.statsLabel" titleKey="history.statsTitle" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {statsDef.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-6 border border-border text-center hover:border-primary/20 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-foreground font-heading mb-1">
                {t(stat.valueKey)}
              </div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {t(stat.labelKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(HistoryStats);