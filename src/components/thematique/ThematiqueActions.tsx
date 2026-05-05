import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ThematiqueAction } from "@/data/thematiques";

interface ThematiqueActionsProps {
  actions: ThematiqueAction[];
  bg: string;
  bgSolid: string;
  color: string;
  borderColor: string;
}

const ThematiqueActions = ({ actions, bg, bgSolid, color, borderColor }: ThematiqueActionsProps) => {
  const { lang } = useI18n();
  const [openAction, setOpenAction] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className={`text-sm font-semibold ${color} uppercase tracking-wider`}>
            {lang === "fr" ? "Nos actions" : "Our actions"}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {lang === "fr" ? "Axes d'intervention" : "Areas of intervention"}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            {lang === "fr"
              ? "Découvrez nos principales actions et programmes dans cette thématique."
              : "Discover our main actions and programmes in this theme."}
          </p>
          <div className={`w-20 h-1 ${bgSolid} mx-auto mt-4 rounded-full opacity-40`} />
        </motion.div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {actions.map((action, i) => {
            const isOpen = openAction === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`bg-card rounded-2xl border overflow-hidden transition-all ${
                  isOpen ? `${borderColor} shadow-lg` : "border-border"
                }`}
              >
                <button
                  onClick={() => setOpenAction(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 p-5 lg:p-6 text-left focus:outline-none focus:ring-2 focus:ring-inset"
                  style={{ '--tw-ring-color': 'transparent' } as React.CSSProperties}
                  aria-expanded={isOpen}
                >
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-sm font-bold ${color}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base lg:text-lg font-bold text-foreground font-heading">
                      {action.titre}
                    </h3>
                    {!isOpen && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {action.description}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 lg:px-6 pb-6"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 pl-14">
                      {action.description}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2.5 pl-14">
                      {action.details.map((detail, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-2.5 text-sm text-foreground"
                        >
                          <Zap size={14} className={`${color} flex-shrink-0 mt-0.5`} />
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThematiqueActions;
