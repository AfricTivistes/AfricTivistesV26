import { useState } from "react";
import { m as motion } from "framer-motion";
import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import SectionHeader from "@/components/SectionHeader";
import ProjetCard from "@/components/ui/ProjetCard";
import ThematiqueFilterBar from "@/components/ui/ThematiqueFilterBar";
import { useI18n } from "@/lib/i18n";
import { useProjets, useThematiques } from "@/hooks/use-wordpress";

const InitiativesProjectGrid = () => {
  const [activeType, setActiveType] = useState<number | null>(null);
  const { t } = useI18n();
  const { data: thematiques = [] } = useThematiques();
  const { data: projets = [], isLoading: loading } = useProjets(100);

  const filtered = activeType === null
    ? projets
    : projets.filter((p) => p.thematique?.includes(activeType));

  return (
    <section className="py-16" id="all-projects">
      <div className="section-container">
        <SectionHeader
          titleKey="initiatives.allProjectsTitle"
          labelKey="initiatives.allProjectsLabel"
          subtitleKey="initiatives.allProjectsSubtitle"
        />

        {/* Filters */}
        <ThematiqueFilterBar
          thematiques={thematiques}
          activeType={activeType}
          onSelect={setActiveType}
          className="justify-center mb-12"
        />

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-2xl mb-3" />
                <div className="h-3 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12" role="status">
            {t("programmes.none")}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" role="list">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                role="listitem"
              >
                <ProjetCard projet={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default withI18nQueryMotion(InitiativesProjectGrid);
