import { useState } from "react";
import { m as motion } from "framer-motion";
import { Target } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import SectionHeader from "@/components/SectionHeader";

interface ThematiqueObjectifsProps {
  objectifs: string[];
  bg: string;
  bgSolid: string;
  color: string;
  borderColor: string;
}

const ThematiqueObjectifs = ({ objectifs, bg, bgSolid, color, borderColor }: ThematiqueObjectifsProps) => {
  const { lang } = useI18n();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeader
          titleKey={lang === "fr" ? "projet.objectives" : "projet.objectives"}
          labelKey={lang === "fr" ? "projectThemes.explore" : "projectThemes.explore"}
          color={color}
          bgSolid={bgSolid}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {objectifs.map((objectif, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`bg-card rounded-xl border p-5 hover:shadow-md transition-all group ${
                hoveredIdx === i ? borderColor : "border-border"
              }`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Target size={14} className={color} />
                </div>
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  {objectif}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThematiqueObjectifs;
