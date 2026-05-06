import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface ObjectiveCardProps {
  objectif: string;
  objectivesLabel: string;
  imageUrl: string | null;
  imageAlt: string;
}

const ObjectiveCard = ({ objectif, objectivesLabel, imageUrl, imageAlt }: ObjectiveCardProps) => (
  <section className="relative -mt-12 z-10 mb-2">
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl border border-border shadow-xl p-6 lg:p-8"
      >
        <div className="flex items-start gap-6">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                {objectivesLabel}
              </h2>
              <p className="text-base lg:text-lg text-foreground leading-relaxed">
                {objectif}
              </p>
            </div>
          </div>
          {imageUrl && (
            <div className="hidden sm:flex flex-shrink-0 w-20 h-20 lg:w-28 lg:h-28 rounded-2xl overflow-hidden border border-border bg-muted/30">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-contain p-2"
                width="112"
                height="112"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  </section>
);

export default ObjectiveCard;
