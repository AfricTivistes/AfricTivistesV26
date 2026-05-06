import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import TwoColumnTextImage from "@/components/TwoColumnTextImage";
import { useI18n } from "@/lib/i18n";

const ValuesIntro = () => {
  const { t } = useI18n();
  return (
    <TwoColumnTextImage
      labelKey="values.introLabel"
      titleKey="values.introTitle1"
      highlightKey="values.introHighlight"
      descriptions={["values.introDesc1", "values.introDesc2"]}
      imageUrl="https://update.africtivistes.org/wp-content/uploads/2026/02/Ucad-Senegal.jpg"
      imageAlt="AfricTivistes - Nos valeurs en action"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-xl border border-border"
      >
        <div className="text-3xl font-bold font-heading text-primary">10+</div>
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {t("history.stat3Label")}
        </div>
      </motion.div>
    </TwoColumnTextImage>
  );
};

export default withDataProviders(ValuesIntro);