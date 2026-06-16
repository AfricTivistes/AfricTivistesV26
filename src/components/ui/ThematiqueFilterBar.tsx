import { useI18n } from "@/lib/i18n";
import { getThematiqueStyle } from "@/lib/thematique-style";
import type { WPThematique } from "@/lib/wordpress";

interface ThematiqueFilterBarProps {
  thematiques: WPThematique[];
  activeType: number | null;
  onSelect: (id: number | null) => void;
  /** Extra wrapper className */
  className?: string;
}

/**
 * Reusable thematique filter bar (pill buttons).
 * Used in ProjectsGrid and InitiativesProjectGrid.
 */
const ThematiqueFilterBar = ({ thematiques, activeType, onSelect, className = "" }: ThematiqueFilterBarProps) => {
  const { t } = useI18n();
  const visible = thematiques.filter((th) => th.count > 0);
  if (visible.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      role="group"
      aria-label="Filtrer par thématique"
    >
      <button
        onClick={() => onSelect(null)}
        aria-pressed={activeType === null}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border focus:outline-hidden focus:ring-2 focus:ring-primary ${
          activeType === null
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
        }`}
      >
        {t("programmes.all")}
      </button>
      {visible.map((th) => {
        const style = getThematiqueStyle(th.slug);
        const isActive = activeType === th.id;
        return (
          <button
            key={th.id}
            onClick={() => onSelect(th.id)}
            aria-pressed={isActive}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border focus:outline-hidden focus:ring-2 focus:ring-primary ${
              isActive
                ? `${style?.bgSolid ?? "bg-primary"} text-white border-transparent`
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {th.name}
          </button>
        );
      })}
    </div>
  );
};

export default ThematiqueFilterBar;
