import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

const timelineItems = [
  { year: "2015", titleKey: "history.2015title", descKey: "history.2015desc", side: "left" as const },
  { year: "2016", titleKey: "history.2016title", descKey: "history.2016desc", side: "right" as const },
  { year: "2017", titleKey: "history.2017title", descKey: "history.2017desc", side: "left" as const },
  { year: "2018", titleKey: "history.2018title", descKey: "history.2018desc", side: "right" as const },
  { year: "2019", titleKey: "history.2019title", descKey: "history.2019desc", side: "left" as const },
  { year: "2020", titleKey: "history.2020title", descKey: "history.2020desc", side: "right" as const },
  { year: "2021", titleKey: "history.2021title", descKey: "history.2021desc", side: "left" as const },
  { year: "2022", titleKey: "history.2022title", descKey: "history.2022desc", side: "right" as const },
  { year: "2023", titleKey: "history.2023title", descKey: "history.2023desc", side: "left" as const },
  { year: "2024", titleKey: "history.2024title", descKey: "history.2024desc", side: "right" as const },
  { year: "2025", titleKey: "history.2025title", descKey: "history.2025desc", side: "left" as const },
];

const HistoryTimeline = () => {
  const { t } = useI18n();
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="section-container">
        <SectionHeader labelKey="history.timelineLabel" titleKey="history.timelineTitle" bottomMargin="mb-16" />
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-12 lg:space-y-16">
            {timelineItems.map((item) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative"
              >
                {/* Mobile layout */}
                <div className="lg:hidden flex gap-6">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-card border-4 border-primary flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-primary">{item.year.slice(2)}</span>
                    </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                      <span className="inline-block text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full mb-3">
                        {item.year}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(item.descKey)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                  {item.side === "left" ? (
                    <>
                      <div className="text-right">
                        <div className="inline-block bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all max-w-lg ml-auto">
                          <span className="inline-block text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full mb-3">
                            {item.year}
                          </span>
                          <h3 className="font-heading text-xl font-bold text-card-foreground mb-2">
                            {t(item.titleKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {t(item.descKey)}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
                          <div className="w-12 h-12 rounded-full bg-card border-4 border-primary flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold text-primary">{item.year.slice(2)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                          <div className="w-12 h-12 rounded-full bg-card border-4 border-secondary flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold text-secondary">{item.year.slice(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="inline-block bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-secondary/20 transition-all max-w-lg">
                          <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-3">
                            {item.year}
                          </span>
                          <h3 className="font-heading text-xl font-bold text-card-foreground mb-2">
                            {t(item.titleKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {t(item.descKey)}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mt-12 flex justify-center lg:justify-center"
          >
            <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 absolute left-6 -translate-x-1/2 lg:translate-x-[-50%]">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                <Sparkles size={20} className="text-secondary-foreground" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(HistoryTimeline);