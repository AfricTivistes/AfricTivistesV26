import innovationData from "./thematiques/innovation.json";
import democracyData from "./thematiques/democracy.json";
import engagementData from "./thematiques/engagement.json";
import mediaData from "./thematiques/media.json";
import trainingData from "./thematiques/training.json";

export interface ThematiqueAction {
  titre: string;
  description: string;
  details: string[];
}

export interface ThematiqueImpact {
  chiffres: { valeur: string; label: string }[];
}

export interface ThematiqueLangData {
  heroTitle: string;
  heroSubtitle: string;
  introduction: string;
  vision: string;
  objectifs: string[];
  actions: ThematiqueAction[];
  impact: ThematiqueImpact;
  programmes: string[];
}

export interface ThematiqueData {
  slug: string;
  route: string;
  icon: string;
  color: string;
  bgSolid: string;
  bg: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  titleKey: string;
  descKey: string;
  fr: ThematiqueLangData;
  en: ThematiqueLangData;
}

export const thematiques: Record<string, ThematiqueData> = {
  innovation: innovationData as ThematiqueData,
  democracy: democracyData as ThematiqueData,
  engagement: engagementData as ThematiqueData,
  media: mediaData as ThematiqueData,
  training: trainingData as ThematiqueData,
};

export const thematiqueList: ThematiqueData[] = Object.values(thematiques);

export function getThematiqueBySlug(slug: string): ThematiqueData | undefined {
  return thematiques[slug];
}
