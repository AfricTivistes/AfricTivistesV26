import { useQuery } from "@tanstack/react-query";
import {
  fetchPosts,
  fetchStickyPosts,
  fetchPostById,
  fetchPostBySlug,
  fetchCategories,
  fetchProgrammes,
  fetchProgrammeBySlug,
  fetchProgrammeTypes,
  fetchPlateformes,
  fetchPlateformesByIds,
  fetchCommunautes,
  fetchTeamMembers,
  fetchProjets,
  fetchProjetBySlug,
  fetchChildProjets,
  fetchProjetsByIds,
  fetchThematiques,
  fetchPartenaires,
  fetchPartenairesByIds,
  fetchProjetBySlugWithLang,
  fetchProjetMeres,
  COMMUNIQUE_CATEGORY_IDS,
  PUBLICATION_CATEGORY_IDS,
  type FetchPostsOptions,
} from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";

export function usePosts(
  options: Omit<FetchPostsOptions, "lang"> & { enabled?: boolean } = {},
) {
  const { lang } = useI18n();
  const { page = 1, perPage = 9, categories, categoriesExclude, search, enabled = true } = options;

  return useQuery({
    queryKey: ["posts", { page, perPage, categories, categoriesExclude, search, lang }],
    queryFn: () => fetchPosts({ page, perPage, categories, categoriesExclude, search, lang }),
    enabled,
  });
}

export function useStickyPosts(perPage = 10) {
  const { lang } = useI18n();

  return useQuery({
    queryKey: ["stickyPosts", lang, perPage],
    queryFn: () => fetchStickyPosts(perPage, lang),
  });
}

export function useCommuniquePosts(perPage = 10) {
  const { lang } = useI18n();
  const communiqueCatId = COMMUNIQUE_CATEGORY_IDS[lang] || COMMUNIQUE_CATEGORY_IDS.fr;

  return useQuery({
    queryKey: ["communiquePosts", lang, communiqueCatId, perPage],
    queryFn: () => fetchPosts({ perPage, categories: [communiqueCatId], lang }),
    select: (data) => data.posts,
  });
}

export function usePublicationPosts(perPage = 3) {
  const { lang } = useI18n();
  const pubCatId = PUBLICATION_CATEGORY_IDS[lang] || PUBLICATION_CATEGORY_IDS.fr;

  return useQuery({
    queryKey: ["publicationPosts", lang, pubCatId, perPage],
    queryFn: () => fetchPosts({ perPage, categories: [pubCatId], lang }),
    select: (data) => data.posts,
  });
}

export function usePostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
  });
}

export function usePostById(id: number | undefined) {
  return useQuery({
    queryKey: ["postById", id],
    queryFn: () => fetchPostById(id!),
    enabled: !!id,
  });
}

export function useCategories() {
  const { lang } = useI18n();

  return useQuery({
    queryKey: ["categories", lang],
    queryFn: () => fetchCategories(lang),
  });
}

export function useProgrammeBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["programme", slug],
    queryFn: () => fetchProgrammeBySlug(slug!),
    enabled: !!slug,
  });
}

export function useProgrammes(perPage = 100, programmeType?: number, langTypeIds?: number[]) {
  const { lang } = useI18n();

  return useQuery({
    queryKey: ["programmes", lang, perPage, programmeType, langTypeIds],
    queryFn: () => fetchProgrammes(perPage, programmeType, langTypeIds),
  });
}

export function useProgrammeTypes() {
  const { lang } = useI18n();

  return useQuery({
    queryKey: ["programmeTypes", lang],
    queryFn: () => fetchProgrammeTypes(lang),
  });
}

export function usePlateformes(perPage = 100) {
  return useQuery({
    queryKey: ["plateformes", perPage],
    queryFn: () => fetchPlateformes(perPage),
  });
}

export function usePlateformesByIds(ids: number[]) {
  return useQuery({
    queryKey: ["plateformesByIds", ids],
    queryFn: () => fetchPlateformesByIds(ids),
    enabled: ids.length > 0,
  });
}

export function useCommunautes(perPage = 100, communauteType?: number) {
  return useQuery({
    queryKey: ["communautes", perPage, communauteType],
    queryFn: () => fetchCommunautes(perPage, communauteType),
  });
}

export function useTeamMembers(perPage = 100) {
  return useQuery({
    queryKey: ["teamMembers", perPage],
    queryFn: () => fetchTeamMembers(perPage),
  });
}

/* ================================================================
   Nouveaux hooks : Projet, Initiative, Partenaire, Thematique
   ================================================================ */

export function useProjetBySlug(slug: string | undefined) {
  const { lang } = useI18n();
  return useQuery({
    queryKey: ["projet", slug, lang],
    queryFn: () => fetchProjetBySlugWithLang(slug!, lang),
    enabled: !!slug,
  });
}

export function useProjets(perPage = 100, thematique?: number, options?: { enabled?: boolean }) {
  const { lang } = useI18n();

  return useQuery({
    queryKey: ["projets", lang, perPage, thematique],
    queryFn: async () => {
      const all = await fetchProjets(perPage, thematique);
      return lang ? all.filter((p) => !p.lang || p.lang === lang) : all;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useChildProjets(parentId: number | undefined, perPage = 100) {
  return useQuery({
    queryKey: ["childProjets", parentId, perPage],
    queryFn: () => fetchChildProjets(parentId!, perPage),
    enabled: !!parentId,
  });
}

export function useThematiques() {
  const { lang } = useI18n();

  return useQuery({
    queryKey: ["thematiques", lang],
    queryFn: () => fetchThematiques(lang),
  });
}

export function useProjetsByIds(ids: number[]) {
  return useQuery({
    queryKey: ["projetsByIds", ids],
    queryFn: () => fetchProjetsByIds(ids),
    enabled: ids.length > 0,
  });
}

export function usePartenaires(perPage = 100) {
  return useQuery({
    queryKey: ["partenaires", perPage],
    queryFn: () => fetchPartenaires(perPage),
  });
}

export function usePartenairesByIds(ids: number[]) {
  return useQuery({
    queryKey: ["partenairesByIds", ids],
    queryFn: () => fetchPartenairesByIds(ids),
    enabled: ids.length > 0,
  });
}

export function useProjetMeres(ids: number[]) {
  return useQuery({
    queryKey: ["projetMeres", ids],
    queryFn: () => fetchProjetMeres(ids),
    enabled: ids.length > 0,
  });
}
