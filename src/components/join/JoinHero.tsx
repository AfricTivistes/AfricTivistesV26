import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useI18n } from "@/lib/i18n";

const JoinHero = () => {
  const { t } = useI18n();
  return (
    <PageHero
      backgroundImage="https://update.africtivistes.org/wp-content/uploads/2023/11/IMG_1642-2-1-scaled.jpg"
      labelKey="nav.about.join"
      titleKey="join.title"
      subtitleKey="join.subtitle"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <a
          href="#formulaire"
          className="inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-bold text-secondary-foreground hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          {t("join.submit")}
          <ArrowRight size={16} />
        </a>
      </motion.div>
    </PageHero>
  );
};

export default withDataProviders(JoinHero);