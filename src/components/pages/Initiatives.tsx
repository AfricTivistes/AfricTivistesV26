import { withProviders } from "@/lib/withProviders";
import PageLayout from "@/components/PageLayout";
import GradientHero from "@/components/GradientHero";
import ProjectThemes from "@/components/ProjectThemes";
import CtaBanner from "@/components/CtaBanner";
import InitiativesIntro from "@/components/initiatives/InitiativesIntro";
import InitiativesProjectGrid from "@/components/initiatives/InitiativesProjectGrid";

const Initiatives = () => {
  return (
    <PageLayout>
      <GradientHero
        titleKey="programmes.title"
        subtitleKey="programmes.subtitle"
      />

      <InitiativesIntro />

      <ProjectThemes
        titleKey="initiatives.themesTitle"
        labelKey="initiatives.themesLabel"
        subtitleKey="initiatives.themesSubtitle"
        className="bg-muted/30"
        ctaCard={{
          titleKey: "projectThemes.joinNetwork.title",
          descKey: "projectThemes.joinNetwork.desc",
          ctaKey: "projectThemes.joinNetwork.cta",
          to: "/about/join",
        }}
      />

      <InitiativesProjectGrid />

      <CtaBanner
        titleKey="about.ctaTitle"
        descKey="about.ctaDesc"
        btnKey="about.ctaBtn"
        linkTo="/contact"
        showDecoShapes
      />
    </PageLayout>
  );
};

export default withProviders(Initiatives);
