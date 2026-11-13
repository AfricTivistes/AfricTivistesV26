/**
 * YouTube -- code SERVEUR uniquement (frontmatters .astro, endpoints /api).
 * Ne pas importer depuis un composant React (process.env, cle API).
 *
 * Strategie :
 *  1. Flux RSS public (sans cle) avec en-tetes "navigateur" + timeout.
 *  2. Si le RSS echoue ou revient vide ET que YOUTUBE_API_KEY est defini,
 *     repli sur l'API YouTube Data v3 (playlistItems.list, 1 unite/appel).
 *     YouTube refuse regulierement le RSS aux IP de datacenters (Netlify/AWS).
 */
import { CHANNEL_ID, type YouTubeVideo } from "@/lib/youtube";

const TIMEOUT_MS = 6000;
const MAX_RESULTS = 15;

const RSS_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/atom+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
};

function getApiKey(): string | undefined {
  const fromProcess = typeof process !== "undefined" ? process.env?.YOUTUBE_API_KEY : undefined;
  return fromProcess || (import.meta.env.YOUTUBE_API_KEY as string | undefined) || undefined;
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/** Parser RSS YouTube sans dependance DOM (compatible Node). */
function parseVideosFromXmlRegex(text: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;
  while ((match = entryRegex.exec(text))) {
    const entry = match[1];
    const videoId =
      entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ??
      entry.match(/<id>yt:video:([^<]+)<\/id>/)?.[1];
    if (!videoId) continue;

    const title = decodeEntities(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "");
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim() ?? "";
    const thumbnail =
      entry.match(/<media:thumbnail\s+url="([^"]+)"/)?.[1] ??
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    videos.push({
      id: videoId,
      title,
      thumbnail,
      publishedAt,
      link: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }
  return videos;
}

async function fetchRss(query: string): Promise<YouTubeVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?${query}`;
  try {
    const res = await fetchWithTimeout(url, { headers: RSS_HEADERS });
    if (!res.ok) {
      console.warn(`[youtube] RSS ${query} -> HTTP ${res.status}`);
      return [];
    }
    const videos = parseVideosFromXmlRegex(await res.text());
    if (videos.length === 0) console.warn(`[youtube] RSS ${query} -> 0 video`);
    return videos;
  } catch (err) {
    console.warn(`[youtube] RSS ${query} -> ${(err as Error).message}`);
    return [];
  }
}

interface ApiPlaylistItem {
  snippet?: {
    title?: string;
    publishedAt?: string;
    resourceId?: { videoId?: string };
    thumbnails?: Record<string, { url?: string } | undefined>;
  };
  contentDetails?: { videoId?: string; videoPublishedAt?: string };
}

async function fetchDataApi(playlistId: string, apiKey: string): Promise<YouTubeVideo[]> {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    maxResults: String(MAX_RESULTS),
    playlistId,
    key: apiKey,
  });
  try {
    const res = await fetchWithTimeout(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
    if (!res.ok) {
      console.warn(`[youtube] Data API ${playlistId} -> HTTP ${res.status}`);
      return [];
    }
    const json = (await res.json()) as { items?: ApiPlaylistItem[] };
    const videos: YouTubeVideo[] = [];
    for (const item of json.items ?? []) {
      const id = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title ?? "";
      if (!id || title === "Private video" || title === "Deleted video") continue;
      const th = item.snippet?.thumbnails ?? {};
      videos.push({
        id,
        title,
        thumbnail:
          th.high?.url ?? th.medium?.url ?? th.default?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt: item.contentDetails?.videoPublishedAt ?? item.snippet?.publishedAt ?? "",
        link: `https://www.youtube.com/watch?v=${id}`,
      });
    }
    return videos;
  } catch (err) {
    console.warn(`[youtube] Data API ${playlistId} -> ${(err as Error).message}`);
    return [];
  }
}

/** Playlist "uploads" d'une chaine : UCxxxx -> UUxxxx. */
const UPLOADS_PLAYLIST_ID = `UU${CHANNEL_ID.slice(2)}`;

/** Videos d'une playlist (ou de la chaine si playlistId est null). Ne jette jamais. */
export async function getVideosServer(playlistId: string | null): Promise<YouTubeVideo[]> {
  const rss = await fetchRss(playlistId ? `playlist_id=${playlistId}` : `channel_id=${CHANNEL_ID}`);
  if (rss.length > 0) return rss;

  const apiKey = getApiKey();
  if (!apiKey) return [];
  return fetchDataApi(playlistId ?? UPLOADS_PLAYLIST_ID, apiKey);
}
