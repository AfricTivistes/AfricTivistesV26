import { m as motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ThematiqueLangData } from "@/data/thematiques";

interface ThematiqueIntroProps {
  content: ThematiqueLangData;
  bg: string;
  bgSolid: string;
  color: string;
}

const ThematiqueIntro = ({ content, bg, bgSolid, color }: ThematiqueIntroProps) => {
  const { lang } = useI18n();

  return (
    <section className="py-16 lg:py-20">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-1.5 h-6 ${bgSolid} rounded-full`} />
              <span className={`text-sm font-bold ${color} uppercase tracking-wider`}>
                {lang === "fr" ? "Presentation" : "Overview"}
              </span>
            </div>
            <p className="text-base lg:text-lg text-muted-foreground leading-[1.8]">
              {content.introduction}
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 lg:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Eye size={18} className={color} />
              </div>
              <h3 className={`text-sm font-bold uppercase tracking-widest ${color}`}>
                {lang === "fr" ? "Notre vision" : "Our vision"}
              </h3>
            </div>
            <p className="text-foreground leading-relaxed font-medium">
              {content.vision}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThematiqueIntro;
