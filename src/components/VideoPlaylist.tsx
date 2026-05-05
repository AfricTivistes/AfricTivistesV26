import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getYouTubeEmbedUrl, PLAYLISTS } from "@/lib/youtube";
import { useYouTubeVideos } from "@/hooks/use-youtube";

const DEFAULT_PLAYLIST_ID = "PLalgaepOVrI8ZpKVEqxDXelPWuc90ZEMi";

const VideoPlaylist = () => {
  const { t, lang } = useI18n();
  const [activePlaylist, setActivePlaylist] = useState<string | null>(DEFAULT_PLAYLIST_ID);
  const { data: videos = [], isLoading: loading } = useYouTubeVideos(activePlaylist);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const handlePlaylistChange = (playlistId: string | null) => {
    setActivePlaylist(playlistId);
    setPlayingId(null);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  const activePlaylistTitle = activePlaylist
    ? PLAYLISTS.find((pl) => pl.id === activePlaylist)?.title || ""
    : "";

  const viewAllHref = activePlaylist
    ? `https://www.youtube.com/playlist?list=${activePlaylist}`
    : "https://www.youtube.com/@AfricTivistes/playlists";

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderSkeleton = () => (
    <section className="py-12 lg:py-16 bg-muted/30" aria-label={t("videos.title")}>
      <div className="section-container">
        <div className="h-8 w-72 bg-muted rounded mb-4 mx-auto animate-pulse" aria-hidden="true" />
        <div className="h-4 w-96 bg-muted rounded mb-6 mx-auto animate-pulse" aria-hidden="true" />
        {/* Playlist filter skeleton */}
        <div className="flex justify-center gap-2 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse" aria-hidden="true" />
          ))}
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 animate-pulse">
            <div className="aspect-video rounded-xl bg-muted" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse" aria-hidden="true">
                <div className="w-36 flex-shrink-0 aspect-video rounded-lg bg-muted" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const featured = videos[0];
  const sidebar = videos.slice(1, 5);
  const isFeaturedPlaying = featured ? playingId === featured.id : false;

  return (
    <section className="py-12 lg:py-16 bg-muted/30" aria-labelledby="videos-heading">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 id="videos-heading" className="text-3xl lg:text-4xl font-bold text-foreground">
            {t("videos.title")}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            {t("videos.subtitle")}
          </p>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4 rounded-full" aria-hidden="true" />
        </motion.div>

        {/* Playlist filter */}
        <div className="relative mb-10">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1 justify-start lg:justify-center"
            role="group"
            aria-label={t("videos.filterLabel")}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={() => handlePlaylistChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                activePlaylist === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-pressed={activePlaylist === null}
            >
              {t("videos.allPlaylists")}
            </button>
            {PLAYLISTS.map((pl) => (
              <button
                key={pl.id}
                onClick={() => handlePlaylistChange(pl.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  activePlaylist === pl.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                aria-pressed={activePlaylist === pl.id}
              >
                {pl.title}
              </button>
            ))}
          </div>
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && renderSkeleton()}

        {/* Empty state */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("videos.noVideos")}</p>
          </div>
        )}

        {/* Video grid: large featured + sidebar list */}
        {!loading && featured && (
          <>
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Featured video */}
              <motion.div
                key={`featured-${featured.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3"
              >
                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="relative aspect-video overflow-hidden bg-foreground/5">
                    <AnimatePresence mode="wait">
                      {isFeaturedPlaying ? (
                        <motion.div
                          key="player"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0"
                        >
                          <iframe
                            src={`${getYouTubeEmbedUrl(featured.id)}?autoplay=1&rel=0`}
                            title={featured.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                          <button
                            onClick={() => setPlayingId(null)}
                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                            aria-label="Fermer"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="thumbnail"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setPlayingId(featured.id)}
                          className="w-full h-full relative focus:outline-none focus:ring-2 focus:ring-primary group"
                          aria-label={`${t("videos.play")}: ${featured.title}`}
                        >
                          <img
                            src={featured.thumbnail}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110">
                              <Play size={26} className="text-primary-foreground ml-1" fill="currentColor" aria-hidden="true" />
                            </div>
                          </div>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-bold text-card-foreground leading-snug line-clamp-2 mb-2">
                      {featured.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {featured.publishedAt && formatDate(featured.publishedAt)}
                      </p>
                      <a
                        href={featured.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        aria-label={`${t("videos.watchOnYt")}: ${featured.title}`}
                      >
                        <ExternalLink size={12} aria-hidden="true" />
                        {t("videos.watchOnYt")}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar: next videos */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                {sidebar.map((video, i) => {
                  const isPlaying = playingId === video.id;
                  return (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="group"
                    >
                      {isPlaying ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-foreground/5">
                          <iframe
                            src={`${getYouTubeEmbedUrl(video.id)}?autoplay=1&rel=0`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                          <button
                            onClick={() => setPlayingId(null)}
                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                            aria-label="Fermer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPlayingId(video.id)}
                          className="flex gap-3 items-start w-full text-left rounded-lg p-2 -m-2 transition-colors hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          aria-label={`${t("videos.play")}: ${video.title}`}
                        >
                          <div className="w-36 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-muted relative">
                            <img
                              src={video.thumbnail}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
                                <Play size={14} className="text-primary-foreground ml-0.5" fill="currentColor" aria-hidden="true" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 py-0.5">
                            <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {video.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5">
                              {video.publishedAt && formatDate(video.publishedAt)}
                            </p>
                          </div>
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* View all link */}
            <div className="text-center mt-5">
              <a
                href={viewAllHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                aria-label={t("videos.viewAll")}
              >
                {t("videos.viewAll")}
                {activePlaylistTitle && ` — ${activePlaylistTitle}`}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default VideoPlaylist;
