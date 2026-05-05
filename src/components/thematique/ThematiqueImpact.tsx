import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { ThematiqueImpact as ThematiqueImpactType } from "@/data/thematiques";

interface ThematiqueImpactProps {
  impact: ThematiqueImpactType;
  bgSolid: string;
  color: string;
  borderColor: string;
}

const ThematiqueImpact = ({ impact, bgSolid, color, borderColor }: ThematiqueImpactProps) => {
  const { lang } = useI18n();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className={`text-sm font-semibold ${color} uppercase tracking-wider`}>
            {lang === "fr" ? "Notre impact" : "Our impact"}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {lang === "fr" ? "En chiffres" : "In numbers"}
          </h2>
          <div className={`w-20 h-1 ${bgSolid} mx-auto mt-4 rounded-full opacity-40`} />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
          {impact.chiffres.map((chiffre, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-card rounded-2xl border p-6 text-center hover:shadow-md transition-all ${
                hoveredIdx === i ? borderColor : "border-border"
              }`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className={`text-3xl lg:text-4xl font-bold ${color} font-heading mb-2`}>
                {chiffre.valeur}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {chiffre.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThematiqueImpact;
