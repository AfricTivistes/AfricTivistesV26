import { withProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import {
  Target,
  Heart,
  Users,
  Globe,
  Lightbulb,
  Shield,
  CheckCircle2,
  Quote,
  Scale,
  BarChart3,
  MapPin,
  Handshake,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import TwoColumnTextImage from "@/components/TwoColumnTextImage";
import SectionHeader from "@/components/SectionHeader";
import CtaBanner from "@/components/CtaBanner";
import { useI18n } from "@/lib/i18n";

const coreValues = [
  {
    icon: Target,
    titleKey: "values.civic.title",
    descKey: "values.civic.desc",
    details: ["values.civic.detail1", "values.civic.detail2", "values.civic.detail3"],
    gradient: "from-primary/10 via-primary/5 to-transparent",
    borderHover: "hover:border-primary/30",
    iconBg: "bg-primary/10 group-hover:bg-primary/20",
    iconColor: "text-primary",
    checkColor: "text-primary",
  },
  {
    icon: Heart,
    titleKey: "values.solidarity.title",
    descKey: "values.solidarity.desc",
    details: ["values.solidarity.detail1", "values.solidarity.detail2", "values.solidarity.detail3"],
    gradient: "from-secondary/10 via-secondary/5 to-transparent",
    borderHover: "hover:border-secondary/30",
    iconBg: "bg-secondary/10 group-hover:bg-secondary/20",
    iconColor: "text-secondary",
    checkColor: "text-secondary",
  },
  {
    icon: Users,
    titleKey: "values.inclusion.title",
    descKey: "values.inclusion.desc",
    details: ["values.inclusion.detail1", "values.inclusion.detail2", "values.inclusion.detail3"],
    gradient: "from-accent/10 via-accent/5 to-transparent",
    borderHover: "hover:border-accent/30",
    iconBg: "bg-accent/10 group-hover:bg-accent/20",
    iconColor: "text-accent",
    checkColor: "text-accent",
  },
  {
    icon: Globe,
    titleKey: "values.transparency.title",
    descKey: "values.transparency.desc",
    details: ["values.transparency.detail1", "values.transparency.detail2", "values.transparency.detail3"],
    gradient: "from-primary/10 via-primary/5 to-transparent",
    borderHover: "hover:border-primary/30",
    iconBg: "bg-primary/10 group-hover:bg-primary/20",
    iconColor: "text-primary",
    checkColor: "text-primary",
  },
  {
    icon: Lightbulb,
    titleKey: "values.innovation.title",
    descKey: "values.innovation.desc",
    details: ["values.innovation.detail1", "values.innovation.detail2", "values.innovation.detail3"],
    gradient: "from-secondary/10 via-secondary/5 to-transparent",
    borderHover: "hover:border-secondary/30",
    iconBg: "bg-secondary/10 group-hover:bg-secondary/20",
    iconColor: "text-secondary",
    checkColor: "text-secondary",
  },
  {
    icon: Shield,
    titleKey: "values.resilience.title",
    descKey: "values.resilience.desc",
    details: ["values.resilience.detail1", "values.resilience.detail2", "values.resilience.detail3"],
    gradient: "from-accent/10 via-accent/5 to-transparent",
    borderHover: "hover:border-accent/30",
    iconBg: "bg-accent/10 group-hover:bg-accent/20",
    iconColor: "text-accent",
    checkColor: "text-accent",
  },
];

const principlesDef = [
  { icon: Scale, titleKey: "values.principle1Title", descKey: "values.principle1Desc" },
  { icon: BarChart3, titleKey: "values.principle2Title", descKey: "values.principle2Desc" },
  { icon: MapPin, titleKey: "values.principle3Title", descKey: "values.principle3Desc" },
  { icon: Handshake, titleKey: "values.principle4Title", descKey: "values.principle4Desc" },
];

const Valeurs = () => {
  const { t } = useI18n();

  return (
    <PageLayout>
      <PageHero
        backgroundImage="https://citizenlabbenin.org/_astro/formation1.bc0f03e8_daRtv.webp"
        labelKey="nav.about.values"
        titleKey="values.title"
        subtitleKey="values.subtitle"
        gradient="bg-gradient-to-br from-primary/95 via-primary/80 to-[hsl(37,70%,30%)]/80"
        patternOpacity="opacity-15"
        verticalPadding="py-12 lg:py-16"
      >
        {/* Decorative floating shapes */}
        <div className="absolute top-20 right-[15%] w-32 h-32 border-2 border-secondary/20 rounded-full hidden lg:block animate-float" />
        <div className="absolute bottom-16 left-[10%] w-20 h-20 border border-white/10 rounded-xl rotate-12 hidden lg:block" />
        {/* Decorative accent bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "5rem" }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="h-1 bg-secondary rounded-full mt-8"
        />
      </PageHero>

      <TwoColumnTextImage
        labelKey="values.introLabel"
        titleKey="values.introTitle1"
        highlightKey="values.introHighlight"
        descriptions={["values.introDesc1", "values.introDesc2"]}
        imageUrl="https://update.africtivistes.org/wp-content/uploads/2026/02/Ucad-Senegal.jpg"
        imageAlt="AfricTivistes - Nos valeurs en action"
      >
        {/* Floating stat badge */}
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

      {/* Core Values Section */}
      <section className="py-12 lg:py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pattern-african opacity-[0.03]" />
        <div className="section-container relative z-10">
          <SectionHeader labelKey="values.coreLabel" titleKey="values.coreTitle" bottomMargin="mb-16" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`group bg-card rounded-2xl border border-border ${value.borderHover} hover:shadow-xl transition-all duration-300 overflow-hidden relative`}
              >
                <div className={`h-1.5 bg-gradient-to-r ${value.gradient}`} />
                <div className="p-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-xl ${value.iconBg} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}>
                      <value.icon size={26} className={value.iconColor} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-card-foreground leading-tight">
                        {t(value.titleKey)}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {t(value.descKey)}
                  </p>
                  <div className="space-y-2.5">
                    {value.details.map((detailKey) => (
                      <div key={detailKey} className="flex items-center gap-2.5">
                        <CheckCircle2 size={15} className={`${value.checkColor} flex-shrink-0`} />
                        <span className="text-sm text-foreground/80 font-medium">{t(detailKey)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation / Quote Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,60%,15%)] via-[hsl(0,50%,12%)] to-[hsl(37,40%,15%)]" />
        <div className="absolute inset-0 pattern-african opacity-10" />
        <div className="absolute top-12 right-[10%] w-64 h-64 border border-secondary/10 rounded-full hidden lg:block" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-white/5 rounded-full" />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative flex-shrink-0"
            >
              <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-secondary/40 shadow-2xl ring-4 ring-secondary/10 ring-offset-4 ring-offset-transparent">
                <img
                  src="https://update.africtivistes.org/wp-content/uploads/2021/07/unnamed-1.jpg"
                  alt="Cheikh Fall - Fondateur d'AfricTivistes"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                <Quote size={16} className="text-secondary-foreground" />
              </div>
            </motion.div>
            <div className="flex-1 text-center lg:text-left">
              <Quote size={48} className="text-secondary/30 mb-4 mx-auto lg:mx-0" />
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white leading-snug mb-8">
                {t("values.quoteText")}
              </blockquote>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="w-12 h-0.5 bg-secondary rounded-full" />
                <div className="text-left">
                  <div className="text-lg font-bold text-white font-heading">
                    {t("values.quoteAuthor")}
                  </div>
                  <div className="text-sm text-white/60">
                    {t("values.quoteRole")}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="section-container">
          <SectionHeader labelKey="values.principlesLabel" titleKey="values.principlesTitle" />
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {principlesDef.map((p, i) => (
              <motion.div
                key={p.titleKey}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group flex gap-5 bg-card rounded-xl p-6 lg:p-7 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                  <p.icon size={22} className="text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">
                    {t(p.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(p.descKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 lg:py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {[
              { src: "https://update.africtivistes.org/wp-content/uploads/2023/11/IMG_1642-2-1-scaled.jpg", span: "md:col-span-2 md:row-span-2" },
              { src: "https://citizenlabbenin.org/_astro/formation1.bc0f03e8_daRtv.webp", span: "" },
              { src: "https://update.africtivistes.org/wp-content/uploads/2025/11/image.jpeg", span: "" },
              { src: "https://update.africtivistes.org/wp-content/uploads/2026/02/Ucad-Senegal.jpg", span: "md:col-span-2" },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-xl overflow-hidden group ${img.span}`}
              >
                <img
                  src={img.src}
                  alt=""
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                    i === 0 ? "h-48 md:h-full" : "h-48 md:h-56"
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        titleKey="values.ctaTitle"
        descKey="values.ctaDesc"
        btnKey="values.ctaBtn"
        linkTo="/contact"
        showDecoShapes
      />
    </PageLayout>
  );
};

export default withProviders(Valeurs);
