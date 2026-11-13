import type { APIRoute } from "astro";
import { getVideosServer } from "@/lib/youtube.server";

export const prerender = false;

/**
 * GET /api/youtube              -> dernieres videos de la chaine
 * GET /api/youtube?playlist=ID  -> videos d'une playlist
 *
 * Remplace les proxys CORS publics (codetabs, corsproxy, allorigins) qui
 * ne repondent plus. Mis en cache au CDN Netlify pour limiter les appels
 * a YouTube (et le quota de l'API Data si la cle est utilisee).
 */
export const GET: APIRoute = async ({ url }) => {
  const playlist = url.searchParams.get("playlist");
  if (playlist && !/^[A-Za-z0-9_-]{10,64}$/.test(playlist)) {
    return new Response(JSON.stringify({ error: "invalid playlist id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const videos = await getVideosServer(playlist);
  const cache =
    videos.length > 0
      ? "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
      : "public, max-age=0, s-maxage=60";

  return new Response(JSON.stringify(videos), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cache,
      "Netlify-CDN-Cache-Control": cache,
    },
  });
};
