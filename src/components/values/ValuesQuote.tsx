import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ValuesQuote = () => {
  const { t } = useI18n();
  return (
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
  );
};

export default withDataProviders(ValuesQuote);