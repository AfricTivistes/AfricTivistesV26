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
 * Mises a jour manuellement car le scraping de la page playlists
 * depuis le navigateur est bloque par CORS.
 */
export const PLAYLISTS: YouTubePlaylist[] = [
  { id: "PLalgaepOVrI89IAabM47uQcOER6BYT3AL", title: "AHEAD Africa" },
  { id: "PLalgaepOVrI8MzAlKN8O-UKD6Umjejw5D", title: "Innov4Democracy" },
  { id: "PLalgaepOVrI8Rd0LZt6L5dgZaW_DQ_s8C", title: "Plaidoyers" },
  { id: "PLalgaepOVrI_wxO5BLGwkkknIpWvezZNj", title: "Sommet Abidjan 2021" },
  { id: "PLalgaepOVrI_s5O2pbF49TdLmJxhTr3dJ", title: "AfricaConsult" },
  { id: "PLalgaepOVrI9bqD2T1ggqq6UnyQjj1zW1", title: "MOOC Démocratie & Gouvernance" },
  { id: "PLalgaepOVrI-yglv3SS5ukLd22oiNHdur", title: "CyberSecurity Open ClassRoom" },
  { id: "PLalgaepOVrI9zEhN4U7Lv_kGCYr0YF4dS", title: "Rapport FIMI" },
  { id: "PLalgaepOVrI9XMOF58zmMJcZUIoCrw3o2", title: "Champion Gouvernance & Démocratie" },
  { id: "PLalgaepOVrI98bLtF3qdGoNnaeG2VgqrE", title: "Sahel Insight Niger" },
  { id: "PLalgaepOVrI8WZX7WzVVkrVhYVUejojVV", title: "Sahel Insight Burkina Faso" },
  { id: "PLalgaepOVrI8H7lSPz2j3U0G3uHOaWDB4", title: "Sahel Insight Tchad" },
  { id: "PLalgaepOVrI9vkI3j4Igeeo2T_MZZ47On", title: "Sahel Insight Sénégal" },
  { id: "PLalgaepOVrI-9x7AQycoKxvn7gBfF-caM", title: "CitizenLab Mauritanie" },
  { id: "PLalgaepOVrI-cNSof5Z4vaOTz9wRYlQKe", title: "CitizenLab Bénin" },
  { id: "PLalgaepOVrI8ZpKVEqxDXelPWuc90ZEMi", title: "AfricTivistes Décrypte" },
  { id: "PLalgaepOVrI_b1eAHyt-S0fMl5fY61lUC", title: "Un pouvoir, deux Mandats" },
  { id: "PLalgaepOVrI8Pp3hCuORRyBqZHCALXMDH", title: "Les causeries de AfricTivistes" },
  { id: "PLalgaepOVrI93ajIVJkBOFcvUPD-FWOA8", title: "Posons-nous" },
  { id: "PLalgaepOVrI8yjCuMl7jz0-k8zMmKfgh8", title: "10 ans de AfricTivistes" },
  { id: "PLalgaepOVrI-tkHdJrFvGAzx9iHgw-bkb", title: "TaxawTemm" },
  { id: "PLalgaepOVrI-iQDlJmtL67xdcmrPjdhf-", title: "Les Vendredis du MOOC" },
  { id: "PLalgaepOVrI-zxQNn-4GdnANQ11TzuU91", title: "Dialogue Migration" },
  { id: "PLalgaepOVrI88Mqv4wNL7hb9CAw1TbExH", title: "Film Sahel Insight" },
  { id: "PLalgaepOVrI8SMIzD-0ZsvJyZ5ZDS65dc", title: "Film Sénégal Démocratie" },
  { id: "PLalgaepOVrI9WNmS9BSwVhIBaxjym3LaE", title: "Charter Project Africa" },
  { id: "PLalgaepOVrI9YFGRDVm3yBGlQTtuHBk2N", title: "Séminaire Information & Démocratie" },
  { id: "PLalgaepOVrI9LHT-uC_8m5P_3FGEXSZFo", title: "Observatoire de la Démocratie" },
  { id: "PLalgaepOVrI8iZ0UDBCcrZiCXymHvE7iH", title: "Radioscopie AfricTivistes" },
  { id: "PLalgaepOVrI9dWP6syRc-oHs6FY1xN0I2", title: "Récap AfricTivistes" },
];

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

/**
 * Returns the embed URL for a given YouTube video ID.
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
