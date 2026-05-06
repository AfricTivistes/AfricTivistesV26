import { m as motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface SectionHeaderProps {
  titleKey: string;
  labelKey?: string;
  subtitleKey?: string;
  bottomMargin?: string;
  barWidth?: string;
  color?: string;
  bgSolid?: string;
}

const SectionHeader = ({
  titleKey,
  labelKey,
  subtitleKey,
  bottomMargin = "mb-14",
  barWidth = "w-20",
  color,
  bgSolid,
}: SectionHeaderProps) => {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center ${bottomMargin}`}
    >
      {labelKey && (
        <span className={`text-sm font-semibold uppercase tracking-wider ${color ?? "text-primary"}`}>
          {t(labelKey)}
        </span>
      )}
      <h2 className={`text-3xl lg:text-4xl font-bold text-foreground ${labelKey ? "mt-2" : ""}`}>
        {t(titleKey)}
      </h2>
      {subtitleKey && (
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          {t(subtitleKey)}
        </p>
      )}
      <div className={`${barWidth} h-1 mx-auto mt-4 rounded-full opacity-40 ${bgSolid ?? "bg-secondary"}`} />
    </motion.div>
  );
};

export default SectionHeader;
