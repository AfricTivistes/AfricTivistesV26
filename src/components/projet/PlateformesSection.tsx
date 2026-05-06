import { m as motion } from "framer-motion";
import PlatformGrid from "@/components/projet/PlatformGrid";
import type { WPPlateforme } from "@/lib/wordpress";

interface PlateformesSectionProps {
  plateformes: WPPlateforme[];
  platformsLabel: string;
  platformsDesc: string;
}

const PlateformesSection = ({ plateformes, platformsLabel, platformsDesc }: PlateformesSectionProps) => {
  if (plateformes.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-muted/20 border-t border-border">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground font-heading">
            {platformsLabel}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm leading-relaxed">
            {platformsDesc}
          </p>
          <div className="w-12 h-1 bg-secondary mx-auto mt-5 rounded-full" />
        </motion.div>
        <PlatformGrid platforms={plateformes} />
      </div>
    </section>
  );
};

export default PlateformesSection;
