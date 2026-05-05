import { useState } from "react";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ThematiqueProgrammesProps {
  programmes: string[];
  bg: string;
  bgSolid: string;
  color: string;
  borderColor: string;
  IconComponent: LucideIcon;
}

const ThematiqueProgrammes = ({ programmes, bg, bgSolid, color, borderColor, IconComponent }: ThematiqueProgrammesProps) => {
  const { lang } = useI18n();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
            {lang === "fr" ? "Programmes" : "Programmes"}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {lang === "fr" ? "Nos programmes phares" : "Our flagship programmes"}
          </h2>
          <div className={`w-20 h-1 ${bgSolid} mx-auto mt-4 rounded-full opacity-40`} />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {programmes.map((programme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`bg-card rounded-xl border p-5 text-center hover:shadow-md transition-all ${
                hoveredIdx === i ? borderColor : "border-border"
              }`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mx-auto mb-3`}>
                <IconComponent size={18} className={color} />
              </div>
              <h3 className="text-sm font-bold text-foreground leading-snug">
                {programme}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThematiqueProgrammes;
