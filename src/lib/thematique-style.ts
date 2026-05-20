import { thematiqueList } from "@/data/thematiques";

/**
 * Look up the local thematique style data by WP slug.
 */
export const getThematiqueStyle = (wpSlug: string) =>
  thematiqueList.find((t) => wpSlug.includes(t.slug));
