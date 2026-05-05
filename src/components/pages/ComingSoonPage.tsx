import { withProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";

interface ComingSoonPageProps {
  titleKey: string;
}

const ComingSoonPage = ({ titleKey }: ComingSoonPageProps) => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-to-content">
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <section className="relative py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
          <div className="absolute inset-0 pattern-african" aria-hidden="true" />
          <div className="relative section-container">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4"
            >
              {t(titleKey)}
            </motion.h1>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl" role="img" aria-label="Construction">🏗</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {t("page.comingSoon")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                {t("page.comingSoonDesc")}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                {t("page.backHome")}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default withProviders(ComingSoonPage);
