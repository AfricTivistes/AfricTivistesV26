import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

interface PageHeroProps {
  backgroundImage: string;
  labelKey: string;
  titleKey: string;
  subtitleKey: string;
  gradient?: string;
  patternOpacity?: string;
  verticalPadding?: string;
  children?: ReactNode;
}

const PageHero = ({
  backgroundImage,
  labelKey,
  titleKey,
  subtitleKey,
  gradient = "bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70",
  patternOpacity = "opacity-20",
  verticalPadding = "py-12 lg:py-16",
  children,
}: PageHeroProps) => {
  const { t } = useI18n();

  return (
    <section className={`relative ${verticalPadding} overflow-hidden`}>
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className={`absolute inset-0 ${gradient}`} />
        <div className={`absolute inset-0 pattern-african ${patternOpacity}`} />
      </div>
      <div className="section-container relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4"
        >
          {t(labelKey)}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-6xl font-bold text-white mb-6 max-w-3xl leading-tight"
        >
          {t(titleKey)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg lg:text-xl text-white/85 max-w-2xl leading-relaxed"
        >
          {t(subtitleKey)}
        </motion.p>
        {children}
      </div>
    </section>
  );
};

export default withDataProviders(PageHero);