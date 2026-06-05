import { useQuery } from "@tanstack/react-query";
import { fetchYouTubeVideos, fetchPlaylistVideos, type YouTubeVideo } from "@/lib/youtube";

/**
 * Hook YouTube videos. Accepte une option `initialData` pour hydrater
 * le cache TanStack Query depuis le SSR (cf. fetchPlaylistVideosSSR
 * dans src/lib/youtube.ts), evitant ainsi le skeleton initial.
 *
 * `staleTime: 5min` -- on ne refetche pas immediatement apres l'hydratation
 * (l'utilisateur voit les videos SSR puis, en arriere-plan apres 5min,
 * la liste se met a jour si l'utilisateur reste sur la page).
 */
export function useYouTubeVideos(
  playlistId: string | null,
  options?: { initialData?: YouTubeVideo[] },
) {
  return useQuery({
    queryKey: ["youtubeVideos", playlistId],
    queryFn: () =>
      playlistId ? fetchPlaylistVideos(playlistId) : fetchYouTubeVideos(),
    initialData: options?.initialData,
    staleTime: 5 * 60 * 1000,
  });
}
