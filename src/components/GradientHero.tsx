import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import { type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

interface GradientHeroProps {
  titleKey: string;
  subtitleKey: string;
  labelKey?: string;
  verticalPadding?: string;
  patternOpacity?: string;
  children?: ReactNode;
}

const GradientHero = ({
  titleKey,
  subtitleKey,
  labelKey,
  verticalPadding = "py-20 lg:py-28",
  patternOpacity,
  children,
}: GradientHeroProps) => {
  const { t } = useI18n();

  return (
    <section className={`relative ${verticalPadding} overflow-hidden`}>
      <div className={`absolute inset-0 hero-gradient`} aria-hidden="true" />
      <div className={`absolute inset-0 pattern-african ${patternOpacity || ""}`} aria-hidden="true" />
      {children}
      <div className="relative section-container">
        {labelKey && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4"
          >
            {t(labelKey)}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={labelKey ? { delay: 0.1 } : undefined}
          className={`text-4xl lg:text-${labelKey ? "6xl" : "5xl"} font-bold ${labelKey ? "text-white" : "text-primary-foreground"} mb-${labelKey ? "6" : "4"} ${labelKey ? "max-w-3xl leading-tight" : ""}`}
        >
          {t(titleKey)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: labelKey ? 0.2 : 0.15 }}
          className={`text-lg ${labelKey ? "lg:text-xl text-white/85" : "text-primary-foreground/80"} max-w-2xl ${labelKey ? "leading-relaxed" : ""}`}
        >
          {t(subtitleKey)}
        </motion.p>
      </div>
    </section>
  );
};

export default withDataProviders(GradientHero);