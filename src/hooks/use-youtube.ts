import { useQuery } from "@tanstack/react-query";
import { fetchYouTubeVideos, fetchPlaylistVideos } from "@/lib/youtube";

export function useYouTubeVideos(playlistId: string | null) {
  return useQuery({
    queryKey: ["youtubeVideos", playlistId],
    queryFn: () =>
      playlistId ? fetchPlaylistVideos(playlistId) : fetchYouTubeVideos(),
  });
}
