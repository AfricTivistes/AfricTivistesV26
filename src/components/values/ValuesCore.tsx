import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import {
  Target, Heart, Users, Globe, Lightbulb, Shield, CheckCircle2,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
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

const ValuesCore = () => {
  const { t } = useI18n();
  return (
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
  );
};

export default withDataProviders(ValuesCore);