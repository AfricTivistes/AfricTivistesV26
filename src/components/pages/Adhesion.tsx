import { withProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import TwoColumnTextImage from "@/components/TwoColumnTextImage";
import JoinReasons from "@/components/JoinReasons";
import JoinSteps from "@/components/JoinSteps";
import JoinForm from "@/components/JoinForm";
import { useI18n } from "@/lib/i18n";

const Adhesion = () => {
  const { t } = useI18n();

  return (
    <PageLayout>
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

      <TwoColumnTextImage
        labelKey="join.communityLabel"
        titleKey="join.communityTitle1"
        highlightKey="join.communityHighlight"
        descriptions={["join.communityDesc1"]}
        imageUrl="https://update.africtivistes.org/wp-content/uploads/2024/01/Untitled.png"
        imageAlt="Communauté AfricTivistes"
      />

      <JoinReasons />
      <JoinSteps />
      <JoinForm />
    </PageLayout>
  );
};

export default withProviders(Adhesion);
