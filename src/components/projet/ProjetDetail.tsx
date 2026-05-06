import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import { useMemo, useState } from "react";
import { useParams } from "@/lib/router-shim";
import HeroSection from "@/components/projet/HeroSection";
import ObjectiveCard from "@/components/projet/ObjectiveCard";
import ProjetTabs from "@/components/projet/ProjetTabs";
import MainContent from "@/components/projet/MainContent";
import GalleryStrip from "@/components/projet/GalleryStrip";
import PhaseTimeline from "@/components/projet/PhaseTimeline";
import PartnersSection from "@/components/projet/PartnersSection";
import PlateformesSection from "@/components/projet/PlateformesSection";
import SimilarProjetsSection from "@/components/projet/SimilarProjetsSection";
import { ProjetSkeleton, ProjetNotFound } from "@/components/projet/ProjetStates";
import {
  getProjetImageUrl,
  getProjetThematique,
  stripHtml,
  parseActionsHtml,
  collectGalerieImages,
  collectPhases,
  collectChiffresCles,
  toPartnerOrgs,
  AFRICTIVISTES_ORG,
} from "@/lib/wordpress";
import type { WPPartenaire, PartnerOrg } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";
import {
  useProjetBySlug,
  useProjets,
  usePlateformesByIds,
  usePartenairesByIds,
  useProjetMeres,
} from "@/hooks/use-wordpress";

interface ProjetDetailProps { slug?: string }
const ProjetDetail = ({ slug: slugProp }: ProjetDetailProps = {}) => {
  const { t, lang } = useI18n();
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;
  const { data: projet, isLoading: loading } = useProjetBySlug(slug);
  const [activeTab, setActiveTab] = useState<"presentation" | "actions">("presentation");

  /* Taxonomie thematique */
  const thematique = projet ? getProjetThematique(projet) : null;
  const thematiqueId = projet?.thematique?.[0];

  /* Donnees ACF (extrait avant les hooks dependants) */
  const acf = projet?.acf || null;

  /* Projets similaires : fetch cible (5 projets de la meme thematique) au lieu de 100 */
  const { data: similarRaw = [] } = useProjets(5, thematiqueId, { enabled: !!thematiqueId });

  /* Plateformes : fetch uniquement les IDs lies au projet */
  const plateformeIds = useMemo(() => acf?.plateformes_projet || [], [acf]);
  const { data: linkedPlateformes = [] } = usePlateformesByIds(plateformeIds);

  /* ---- Phases ---- */
  const phases = useMemo(() => acf ? collectPhases(acf) : [], [acf]);
  const phasePartenaireIds = useMemo(() => {
    const ids = new Set<number>();
    phases.forEach((phase) => {
      phase.phase_partenaires?.forEach((id) => ids.add(id));
    });
    return [...ids];
  }, [phases]);

  /* ---- IDs soutenu_par + en_partenariat_avec ---- */
  const soutenuParIds = useMemo(() => acf?.soutenu_par || [], [acf]);
  const enPartenariatAvecIds = useMemo(() => acf?.en_partenariat_avec || [], [acf]);

  /* ---- Fetch tous les partenaires necessaires ---- */
  const allPartenaireIds = useMemo(
    () => [...new Set([...phasePartenaireIds, ...soutenuParIds, ...enPartenariatAvecIds])],
    [phasePartenaireIds, soutenuParIds, enPartenariatAvecIds],
  );
  const { data: wpPartenaires = [] } = usePartenairesByIds(allPartenaireIds);

  /* Map pour resolution rapide par ID */
  const partenaireMap = useMemo(() => {
    const map = new Map<number, WPPartenaire>();
    wpPartenaires.forEach((p) => map.set(p.id, p));
    return map;
  }, [wpPartenaires]);

  /* Soutenu par -> PartnerOrg[] */
  const soutienOrgs: PartnerOrg[] = useMemo(() => {
    const resolved = soutenuParIds
      .map((id) => partenaireMap.get(id))
      .filter((p): p is WPPartenaire => !!p);
    return toPartnerOrgs(resolved);
  }, [soutenuParIds, partenaireMap]);

  /* En partenariat avec -> PartnerOrg[] */
  const partenaireOrgs: PartnerOrg[] = useMemo(() => {
    const resolved = enPartenariatAvecIds
      .map((id) => partenaireMap.get(id))
      .filter((p): p is WPPartenaire => !!p);
    return toPartnerOrgs(resolved);
  }, [enPartenariatAvecIds, partenaireMap]);

  /* Porteur du projet -> toujours AfricTivistes */
  const porteurOrgs: PartnerOrg[] = useMemo(() => [AFRICTIVISTES_ORG], []);

  /* Projets similaires (meme thematique) : exclure le projet courant */
  const similarProjets = useMemo(() => {
    if (!projet) return [];
    return similarRaw.filter((p) => p.id !== projet.id).slice(0, 4);
  }, [similarRaw, projet]);

  /* Stats -- chiffres cles dynamiques (cc1-cc6) */
  const statsData = useMemo(() => {
    if (!acf) return [];
    return collectChiffresCles(acf).map(({ titre, valeur, icone }) => {
      const isLink = valeur.startsWith("http");
      return {
        value: isLink ? (lang === "fr" ? "Lien" : "Link") : valeur,
        label: titre,
        emoji: icone,
        href: isLink ? valeur : undefined,
      };
    });
  }, [acf, lang]);

  /* Pays : union des pays ACF + pays des phases */
  const allPays = useMemo(() => {
    if (!acf) return [];
    const set = new Set<string>(acf.pays as string[] || []);
    phases.forEach((phase) => {
      phase.phase_pays?.forEach((code) => set.add(code));
    });
    return [...set];
  }, [acf, phases]);

  /* Projets meres (taxonomie) */
  const projetMereIds = useMemo(() => projet?.projet_mere || [], [projet]);
  const { data: projetsMeres = [] } = useProjetMeres(projetMereIds);

  /* Actions (WYSIWYG HTML -> parse) */
  const actions = useMemo(() => acf ? parseActionsHtml(acf.actions_html) : [], [acf]);

  /* Galerie (5 champs image -> tableau) */
  const galerieImages = useMemo(() => acf ? collectGalerieImages(acf) : [], [acf]);

  const imageUrl = projet ? getProjetImageUrl(projet) : null;
  const title = projet ? stripHtml(projet.title.rendered) : "";

  /* ------------------------------------------------------------------ */
  /*  Loading / Not found                                                 */
  /* ------------------------------------------------------------------ */
  if (loading) return <ProjetSkeleton />;

  if (!projet || !acf) {
    return (
      <ProjetNotFound
        notFoundLabel={t("projet.notFound")}
        notFoundDesc={t("projet.notFoundDesc")}
        backLabel={t("projet.back")}
      />
    );
  }

  return (
    <article className="pt-20">

        <HeroSection
          title={title}
          imageUrl={imageUrl}
          thematiqueName={thematique?.name}
          thematiqueSlug={thematique?.slug}
          pays={allPays}
          lang={lang}
        />

        {acf.objectif && (
          <ObjectiveCard
            objectif={acf.objectif}
            objectivesLabel={t("projet.objectives")}
            imageUrl={imageUrl}
            imageAlt={title}
          />
        )}

        <ProjetTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          title={title}
          actionsLabel={t("projet.actions")}
          projetsMeresLabel={t("projet.projetsMeres")}
          keyFiguresLabel={t("projet.keyFigures")}
          hasProjetsMeres={projetsMeres.length > 0}
          hasKeyFigures={statsData.length > 0}
        />

        <MainContent
          activeTab={activeTab}
          contentHtml={projet.content.rendered}
          actions={actions}
          projetsMeres={projetsMeres}
          statsData={statsData}
          parentId={projet.parent}
          lang={lang}
          t={t}
        />

        {galerieImages.length > 0 && (
          <section className="py-6">
            <div className="section-container">
              <GalleryStrip images={galerieImages} />
            </div>
          </section>
        )}

        {phases.length > 0 && (
          <PhaseTimeline
            phases={phases}
            partenaireMap={partenaireMap}
            phasesLabel={t("projet.phases")}
            phasesDesc={t("projet.phasesDesc")}
            lang={lang}
          />
        )}

        <PartnersSection
          porteurOrgs={porteurOrgs}
          soutienOrgs={soutienOrgs}
          partenaireOrgs={partenaireOrgs}
          projectByLabel={t("projet.projectBy")}
          supportedByLabel={t("projet.supportedBy")}
          partnersWithLabel={t("projet.partnersWith")}
        />

        <PlateformesSection
          plateformes={linkedPlateformes}
          platformsLabel={t("projet.platforms")}
          platformsDesc={t("projet.platformsDesc")}
        />

        <SimilarProjetsSection
          projets={similarProjets}
          similarTitle={t("projet.similarTitle")}
          similarDesc={t("projet.similarDesc")}
          viewAllLabel={t("projet.viewAll")}
        />

      </article>
  );
};

export default withI18nQueryMotion(ProjetDetail);
