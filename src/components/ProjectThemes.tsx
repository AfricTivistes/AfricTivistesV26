import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lightbulb, Vote, Users, Radio, BookOpen, ArrowRight, LayoutGrid } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";
import { thematiqueList } from "@/data/thematiques";

const ICONS: Record<string, typeof Lightbulb> = {
  Lightbulb,
  Vote,
  Users,
  Radio,
  BookOpen,
};

interface CtaCardConfig {
  titleKey: string;
  descKey: string;
  ctaKey: string;
  to: string;
}

interface ProjectThemesProps {
  titleKey?: string;
  labelKey?: string;
  subtitleKey?: string;
  className?: string;
  ctaCard?: CtaCardConfig | null;
}

const DEFAULT_CTA: CtaCardConfig = {
  titleKey: "projectThemes.allInitiatives.title",
  descKey: "projectThemes.allInitiatives.desc",
  ctaKey: "projectThemes.allInitiatives.cta",
  to: "/initiatives",
};

const ProjectThemes = ({
  titleKey = "projectThemes.title",
  labelKey,
  subtitleKey = "projectThemes.subtitle",
  className = "",
  ctaCard = DEFAULT_CTA,
}: ProjectThemesProps) => {
  const { t, lang } = useI18n();

  return (
    <section className={`py-12 lg:py-16 ${className}`} aria-labelledby="project-themes-heading">
      <div className="section-container">
        <SectionHeader
          titleKey={titleKey}
          labelKey={labelKey}
          subtitleKey={subtitleKey}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {thematiqueList.map((theme, i) => {
            const content = theme[lang];
            const IconComp = ICONS[theme.icon] || Lightbulb;
            return (
              <motion.div
                key={theme.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={theme.route}
                  className="group block h-full bg-card rounded-xl border border-border p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`${content.heroTitle} - ${t("projectThemes.explore")}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${theme.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`} aria-hidden="true">
                    <IconComp size={24} className={theme.color} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {content.heroTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {content.introduction.slice(0, 160)}...
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("projectThemes.explore")} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            );
          })}

          {ctaCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: thematiqueList.length * 0.08 }}
            >
              <Link
                to={ctaCard.to}
                className="group block h-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 transition-all hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={t(ctaCard.ctaKey)}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <LayoutGrid size={24} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {t(ctaCard.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t(ctaCard.descKey)}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {t(ctaCard.ctaKey)} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectThemes;
