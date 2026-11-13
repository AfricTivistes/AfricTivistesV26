import playlistsData from "@/data/playlists.json";

export const CHANNEL_ID = "UCAeD9ZcdIC8yY9-AJLrYGsw";

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  link: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
}

/**
 * Playlists de la chaine AfricTivistes.
 * Gerees depuis l'admin (Decap CMS) via src/data/playlists.json.
 */
interface PlaylistEntry {
  id: string;
  pinned?: boolean;
  title: { fr: string; en: string };
}

const PLAYLIST_ITEMS: PlaylistEntry[] = (playlistsData as { items: PlaylistEntry[] }).items;

/**
 * Returns all playlists with title in the requested language,
 * in the order defined in playlists.json.
 */
export function getPlaylists(lang: "fr" | "en"): YouTubePlaylist[] {
  return PLAYLIST_ITEMS.map((p) => ({
    id: p.id,
    title: p.title?.[lang] || p.title?.fr || "",
  }));
}

/**
 * Returns the id of the pinned playlist (first one marked pinned),
 * or null if none.
 */
export function getPinnedPlaylistId(): string | null {
  return PLAYLIST_ITEMS.find((p) => p.pinned)?.id ?? null;
}

/**
 * Client : passe par l'endpoint serveur /api/youtube (src/pages/api/youtube.ts),
 * qui lit le flux RSS cote serveur (pas de CORS) avec repli sur l'API Data v3.
 * Jette en cas d'erreur pour que TanStack Query puisse retenter.
 */
async function fetchFromApi(playlistId: string | null): Promise<YouTubeVideo[]> {
  const qs = playlistId ? `?playlist=${encodeURIComponent(playlistId)}` : "";
  const res = await fetch(`/api/youtube${qs}`);
  if (!res.ok) throw new Error(`/api/youtube -> HTTP ${res.status}`);
  return (await res.json()) as YouTubeVideo[];
}

/** Dernieres videos de la chaine AfricTivistes. */
export function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  return fetchFromApi(null);
}

/** Videos d'une playlist donnee. */
export function fetchPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
  return fetchFromApi(playlistId);
}

/**
 * Returns the embed URL for a given YouTube video ID.
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
