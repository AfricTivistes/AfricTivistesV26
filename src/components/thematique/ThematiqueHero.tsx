import { m as motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Breadcrumb from "@/components/ui/Breadcrumb";
import type { ThematiqueLangData } from "@/data/thematiques";

interface ThematiqueHeroProps {
  content: ThematiqueLangData;
  bg: string;
  gradientFrom: string;
  gradientTo: string;
  IconComponent: LucideIcon;
}

const ThematiqueHero = ({ content, bg, gradientFrom, gradientTo, IconComponent }: ThematiqueHeroProps) => {
  const { t } = useI18n();

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`} aria-hidden="true" />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="absolute inset-0 pattern-african opacity-[0.06]" aria-hidden="true" />

      {/* Decorative shapes */}
      <div className="absolute top-12 right-16 w-32 h-32 border border-white/10 rounded-full hidden lg:block" aria-hidden="true" />
      <div className="absolute bottom-16 left-20 w-20 h-20 border border-white/15 rounded-xl rotate-45 hidden lg:block" aria-hidden="true" />

      <div className="relative section-container">
        <Breadcrumb
          items={[
            { to: "/", label: t("nav.home") },
            { to: "/initiatives", label: t("programmes.title") },
          ]}
          current={content.heroTitle}
        />

        <div className="flex items-start gap-5 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20`}
          >
            <IconComponent size={28} className="text-white" />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight font-heading max-w-3xl"
            >
              {content.heroTitle}
            </motion.h1>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg lg:text-xl text-white/85 max-w-2xl leading-relaxed"
        >
          {content.heroSubtitle}
        </motion.p>
      </div>
    </section>
  );
};

export default ThematiqueHero;
