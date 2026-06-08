import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import { useMemo } from "react";
import { Lightbulb, BookOpen, Radio, Users, Vote } from "lucide-react";
import CtaBanner from "@/components/CtaBanner";
import ThematiqueHero from "@/components/thematique/ThematiqueHero";
import ThematiqueIntro from "@/components/thematique/ThematiqueIntro";
import ThematiqueObjectifs from "@/components/thematique/ThematiqueObjectifs";
import ThematiqueActions from "@/components/thematique/ThematiqueActions";
import ThematiqueRelatedProjets from "@/components/thematique/ThematiqueRelatedProjets";
import { useI18n } from "@/lib/i18n";
import { useProjets, useThematiques } from "@/hooks/use-wordpress";
import type { ThematiqueData } from "@/data/thematiques";
import type { WPProjet, WPThematique } from "@/lib/wordpress";

const ICONS: Record<string, typeof Lightbulb> = {
  Lightbulb,
  Vote,
  Users,
  Radio,
  BookOpen,
};

interface ThematiquePageProps {
  data: ThematiqueData;
  /** SSR-prefetched data: when present, hooks hydrate without a loading flash. */
  initialThematiques?: WPThematique[];
  initialProjets?: WPProjet[];
  /** SSR-resolved thematique ID — must match the one used to fetch `initialProjets`
   *  so the `useProjets` query key lines up and `initialData` is consumed.
   *  Falls back to client-side useMemo lookup when omitted. */
  initialMatchedThematiqueId?: number;
}

const ThematiquePage = ({
  data,
  initialThematiques,
  initialProjets,
  initialMatchedThematiqueId,
}: ThematiquePageProps) => {
  const { t, lang } = useI18n();
  const content = data[lang];
  const IconComponent = ICONS[data.icon] || Lightbulb;

  /* Fetch projets lies a cette thematique via WordPress */
  const { data: allThematiques = [] } = useThematiques({ initialData: initialThematiques });
  const matchedThematique = useMemo(() => {
    const frTitle = t(data.titleKey);
    return allThematiques.find(
      (th) => th.name.toLowerCase() === frTitle.toLowerCase() || th.slug.includes(data.slug),
    );
  }, [allThematiques, data, t]);

  // Prefer the SSR-resolved ID on first render so initialProjets matches the
  // useProjets query key. After client hydration, the useMemo lookup takes
  // over for any subsequent re-renders (lang switch via View Transitions).
  const effectiveThematiqueId = matchedThematique?.id ?? initialMatchedThematiqueId;

  const { data: projets = [], isLoading: projetsLoading } = useProjets(
    100,
    effectiveThematiqueId,
    { initialData: initialProjets },
  );

  const relatedProjets = useMemo(() => {
    if (!effectiveThematiqueId) return [];
    return projets.filter((p) => p.thematique?.includes(effectiveThematiqueId)).slice(0, 6);
  }, [projets, effectiveThematiqueId]);

  return (
    <>
      <ThematiqueHero content={content} bg={data.bg} gradientFrom={data.gradientFrom} gradientTo={data.gradientTo} IconComponent={IconComponent} />
      <ThematiqueIntro content={content} bg={data.bg} bgSolid={data.bgSolid} color={data.color} />
      <ThematiqueRelatedProjets
        projets={relatedProjets}
        loading={projetsLoading}
        bgSolid={data.bgSolid}
        color={data.color}
        borderColor={data.borderColor}
        gradientFrom={data.gradientFrom}
        gradientTo={data.gradientTo}
      />
      <ThematiqueObjectifs objectifs={content.objectifs} bg={data.bg} bgSolid={data.bgSolid} color={data.color} borderColor={data.borderColor} />
      <ThematiqueActions
        actions={content.actions}
        bg={data.bg}
        bgSolid={data.bgSolid}
        color={data.color}
        borderColor={data.borderColor}
      />

      <CtaBanner
        titleKey="about.ctaTitle"
        descKey="about.ctaDesc"
        btnKey="about.ctaBtn"
        linkTo="/contact"
        showDecoShapes
        gradientFrom={data.gradientFrom}
        gradientTo={data.gradientTo}
      />
    </>
  );
};

export default withI18nQueryMotion(ThematiquePage);

