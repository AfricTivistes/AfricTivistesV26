import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import {
  Users, Award, Globe, GraduationCap, BookOpenCheck,
  Vote, ShieldAlert, Network, Cpu, Wrench, BarChart2, Laptop, Coins,
} from "lucide-react";

const stats = [
  // Formation
  { icon: GraduationCap, value: 2000,  suffix: "+", labelKey: "stats.trainees" },
  { icon: BookOpenCheck, value: 7000,  suffix: "+",  labelKey: "stats.mooc" },
  { icon: Laptop,        value: 3,     suffix: "",  labelKey: "stats.elearning" },
  // Démocratie
  { icon: Vote,          value: 15,    suffix: "",  labelKey: "stats.elections" },
  { icon: ShieldAlert,   value: 10,    suffix: "+",  labelKey: "stats.activists" },
  { icon: Wrench,        value: 7,     suffix: "",  labelKey: "stats.technical" },
  // Communauté & engagement
  { icon: Network,       value: 30,    suffix: "+",  labelKey: "stats.communities" },
  { icon: Users,         value: 1200,  suffix: "+", labelKey: "stats.summitParticipants" },
  { icon: Award,         value: 7,     suffix: "",  labelKey: "stats.awards" },
  // Innovation & civic tech
  { icon: Globe,         value: 30,    suffix: "+", labelKey: "stats.youth" },
  { icon: Cpu,           value: 25,    suffix: "+", labelKey: "stats.civicTech" },
  { icon: BarChart2,     value: 25,    suffix: "+", labelKey: "stats.research" },
  // Impact financier
  { icon: Coins,         value: 420000,suffix: " €",labelKey: "stats.grants" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = Math.min(2000, Math.max(800, value * 2));
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={`${value}${suffix}`}>
      {display.toLocaleString("fr-FR")}{suffix}
    </span>
  );
}

const StatsSection = () => {
  const { t } = useI18n();
  const yearsExistence = new Date().getFullYear() - 2015 - 1;

  return (
    <section className="py-12 lg:py-16 bg-muted/40" aria-labelledby="stats-heading">
      <div className="section-container">

        {/* Header compact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8"
        >
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {t("stats.label")}
            </span>
            <h2 id="stats-heading" className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
              <span className="text-primary">+{yearsExistence}</span> {t("stats.title")}
            </h2>
          </div>
        </motion.div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          role="list"
          aria-label={t("stats.title")}
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                role="listitem"
                className="bg-card rounded-lg p-3 border border-border hover:border-primary/25 hover:shadow-sm transition-all group"
              >
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <Icon size={14} className="text-primary" />
                </div>
                <div className="text-xl lg:text-2xl font-heading font-bold text-primary leading-none mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] text-muted-foreground leading-snug font-medium">
                  {t(stat.labelKey)}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default withDataProviders(StatsSection);
