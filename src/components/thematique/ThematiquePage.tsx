import { withDataProviders } from "@/lib/withProviders";
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

const ICONS: Record<string, typeof Lightbulb> = {
  Lightbulb,
  Vote,
  Users,
  Radio,
  BookOpen,
};

interface ThematiquePageProps {
  data: ThematiqueData;
}

const ThematiquePage = ({ data }: ThematiquePageProps) => {
  const { t, lang } = useI18n();
  const content = data[lang];
  const IconComponent = ICONS[data.icon] || Lightbulb;

  /* Fetch projets lies a cette thematique via WordPress */
  const { data: allThematiques = [] } = useThematiques();
  const matchedThematique = useMemo(() => {
    const frTitle = t(data.titleKey);
    return allThematiques.find(
      (th) => th.name.toLowerCase() === frTitle.toLowerCase() || th.slug.includes(data.slug),
    );
  }, [allThematiques, data, t]);

  const { data: projets = [], isLoading: projetsLoading } = useProjets(
    100,
    matchedThematique?.id,
  );

  const relatedProjets = useMemo(() => {
    if (!matchedThematique) return [];
    return projets.filter((p) => p.thematique?.includes(matchedThematique.id)).slice(0, 6);
  }, [projets, matchedThematique]);

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

export default withDataProviders(ThematiquePage);
