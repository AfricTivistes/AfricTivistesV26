import { m as motion } from "framer-motion";
import type { WPProjet } from "@/lib/wordpress";
import type { Lang } from "@/lib/i18n";

interface ProjetTabsProps {
  activeTab: "presentation" | "actions";
  onTabChange: (tab: "presentation" | "actions") => void;
  title: string;
  actionsLabel: string;
  projetsMeresLabel: string;
  keyFiguresLabel: string;
  hasProjetsMeres: boolean;
  hasKeyFigures: boolean;
}

const ProjetTabs = ({
  activeTab,
  onTabChange,
  title,
  actionsLabel,
  projetsMeresLabel,
  keyFiguresLabel,
  hasProjetsMeres,
  hasKeyFigures,
}: ProjetTabsProps) => (
  <section id="actions-section" className="border-y border-border sticky top-[72px] z-20 bg-background/95 backdrop-blur-md">
    <div className="section-container">
      <nav className="flex items-center gap-0 -mb-px overflow-x-auto scrollbar-hide">
        {(["presentation", "actions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "presentation" ? title : actionsLabel}
            {activeTab === tab && (
              <motion.div
                layoutId="projet-tab"
                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-t-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
        {hasProjetsMeres && (
          <a
            href="#projets-meres"
            className="relative px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap lg:hidden"
          >
            {projetsMeresLabel}
          </a>
        )}
        {hasKeyFigures && (
          <a
            href="#chiffres-cles"
            className="relative px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap lg:hidden"
          >
            {keyFiguresLabel}
          </a>
        )}
      </nav>
    </div>
  </section>
);

export default ProjetTabs;
