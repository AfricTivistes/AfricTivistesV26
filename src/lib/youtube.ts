import playlistsData from "@/data/playlists.json";

const CHANNEL_ID = "UCAeD9ZcdIC8yY9-AJLrYGsw";
const ATOM_NS = "http://www.w3.org/2005/Atom";
const YT_NS = "http://www.youtube.com/xml/schemas/2015";
const MEDIA_NS = "http://search.yahoo.com/mrss/";

/**
 * CORS proxy URLs tried in order.
 * Each must accept the target URL as a query parameter.
 */
const CORS_PROXIES = [
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

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
 * Tries each CORS proxy in order until one succeeds.
 * Returns the response text or null if all fail.
 */
async function fetchViaProxy(targetUrl: string): Promise<string | null> {
  for (const buildProxy of CORS_PROXIES) {
    try {
      const proxyUrl = buildProxy(targetUrl);
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 0) return text;
      }
    } catch {
      // try next proxy
    }
  }
  return null;
}

/**
 * Helper: get text content of the first element matching a local name
 * inside a given namespace. Falls back to querySelector without namespace.
 */
function getElementText(parent: Element, ns: string, localName: string): string {
  const el = parent.getElementsByTagNameNS(ns, localName)[0]
    || parent.querySelector(localName);
  return el?.textContent?.trim() || "";
}

/**
 * Parses a YouTube RSS XML string into an array of YouTubeVideo objects.
 */
function parseVideosFromXml(text: string): YouTubeVideo[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");

  const entriesNS = xml.getElementsByTagNameNS(ATOM_NS, "entry");
  const entries = entriesNS.length > 0
    ? Array.from(entriesNS)
    : Array.from(xml.querySelectorAll("entry"));

  const videos: YouTubeVideo[] = [];

  for (const entry of entries) {
    let videoId = getElementText(entry, YT_NS, "videoId");
    if (!videoId) {
      const idText = getElementText(entry, ATOM_NS, "id");
      videoId = idText.replace("yt:video:", "");
    }
    if (!videoId) continue;

    const title = getElementText(entry, ATOM_NS, "title");
    const publishedAt = getElementText(entry, ATOM_NS, "published");

    const mediaGroup = entry.getElementsByTagNameNS(MEDIA_NS, "group")[0];
    const thumbnail = mediaGroup
      ?.getElementsByTagNameNS(MEDIA_NS, "thumbnail")[0]
      ?.getAttribute("url")
      || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

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

/**
 * Fetches recent YouTube videos from the AfricTivistes channel
 * using the public RSS feed (no API key required).
 */
export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const text = await fetchViaProxy(rssUrl);
    if (!text) return [];
    return parseVideosFromXml(text);
  } catch {
    console.error("Failed to fetch YouTube videos");
    return [];
  }
}

/**
 * Fetches videos from a specific YouTube playlist via its RSS feed.
 */
export async function fetchPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
    const text = await fetchViaProxy(rssUrl);
    if (!text) return [];
    return parseVideosFromXml(text);
  } catch {
    console.error(`Failed to fetch playlist ${playlistId}`);
    return [];
  }
}

/* ================================================================
   SSR variants -- direct fetch (no CORS proxy) + regex parser
   pour usage cote Node (build-time / SSR Astro).
   ================================================================ */

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/**
 * Parser RSS YouTube sans dependance DOM (compatible Node).
 * Utilise des regex sur la structure RSS YouTube qui est tres previsible.
 */
function parseVideosFromXmlRegex(text: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;
  while ((match = entryRegex.exec(text))) {
    const entry = match[1];
    const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const idFallback = entry.match(/<id>yt:video:([^<]+)<\/id>/);
    const videoId = videoIdMatch?.[1] ?? idFallback?.[1];
    if (!videoId) continue;

    const titleRaw = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
    const title = decodeEntities(titleRaw);
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim() ?? "";
    const thumbnail = entry.match(/<media:thumbnail\s+url="([^"]+)"/)?.[1]
      ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

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

/**
 * SSR : fetch direct du flux RSS YouTube sans proxy CORS
 * (les CORS proxies sont superflus cote serveur car pas de browser).
 *
 * A utiliser dans les frontmatters .astro pour hydrater le first paint
 * sans skeleton, en passant le resultat en `initialData` prop.
 */
export async function fetchYouTubeVideosSSR(): Promise<YouTubeVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const res = await fetch(rssUrl);
    if (!res.ok) return [];
    const text = await res.text();
    return parseVideosFromXmlRegex(text);
  } catch {
    return [];
  }
}

export async function fetchPlaylistVideosSSR(playlistId: string): Promise<YouTubeVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
    const res = await fetch(rssUrl);
    if (!res.ok) return [];
    const text = await res.text();
    return parseVideosFromXmlRegex(text);
  } catch {
    return [];
  }
}

/**
 * Returns the embed URL for a given YouTube video ID.
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
