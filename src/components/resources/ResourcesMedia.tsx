import { withDataProviders } from "@/lib/withProviders";
import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Play, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import GradientHero from "@/components/GradientHero";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";
import {
  getYouTubeEmbedUrl,
  PLAYLISTS,
  type YouTubeVideo,
} from "@/lib/youtube";
import { useYouTubeVideos } from "@/hooks/use-youtube";

const VIDEOS_PER_PAGE = 9;

interface VideoCardProps {
  video: YouTubeVideo;
  index: number;
  playingId: string | null;
  onPlay: (id: string) => void;
  onStop: () => void;
  formatDate: (date: string) => string;
  t: (key: string) => string;
}

const VideoCard = ({ video, index, playingId, onPlay, onStop, formatDate, t }: VideoCardProps) => {
  const isPlaying = playingId === video.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Video area */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <iframe
                src={`${getYouTubeEmbedUrl(video.id)}?autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              <button
                onClick={(e) => { e.stopPropagation(); onStop(); }}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Close"
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
              onClick={() => onPlay(video.id)}
              className="w-full h-full relative focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`${t("media.play")}: ${video.title}`}
            >
              <img
                src={video.thumbnail}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                  <Play size={22} className="text-primary-foreground ml-0.5" fill="currentColor" aria-hidden="true" />
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Card content */}
      <div className="p-5">
        <p className="text-xs text-muted-foreground mb-2">
          {video.publishedAt && formatDate(video.publishedAt)}
        </p>
        <h3 className="font-heading text-base font-bold text-card-foreground leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <a
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:gap-2.5 transition-all"
          aria-label={`${t("media.watchOnYt")}: ${video.title}`}
        >
          {t("media.watchOnYt")}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </motion.div>
  );
};

const ResourcesMedia = () => {
  const { t, lang } = useI18n();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePlaylist, setActivePlaylist] = useState<string | null>(null);

  const { data: videos = [], isLoading: loading } = useYouTubeVideos(activePlaylist);

  const handleFilterChange = (playlistId: string | null) => {
    setActivePlaylist(playlistId);
    setCurrentPage(1);
    setPlayingId(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = videos.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setPlayingId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
        <GradientHero
          titleKey="nav.resources.media"
          subtitleKey="media.heroDesc"
        />

        {/* Video grid */}
        <section className="py-12 lg:py-16">
          <div className="section-container">
            <SectionHeader titleKey="media.allVideos" bottomMargin="mb-12" />

            {/* Playlist filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label={lang === "fr" ? "Filtrer par playlist" : "Filter by playlist"}>
              <button
                onClick={() => handleFilterChange(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  activePlaylist === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                aria-pressed={activePlaylist === null}
              >
                {t("media.all")}
              </button>
              {PLAYLISTS.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => handleFilterChange(pl.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
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

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-5 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 lg:py-16">
                <p className="text-xl text-muted-foreground">
                  {t("media.noVideos")}
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedVideos.map((video, i) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      index={i}
                      playingId={playingId}
                      onPlay={setPlayingId}
                      onStop={() => setPlayingId(null)}
                      formatDate={formatDate}
                      t={t}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2 mt-14" aria-label={lang === "fr" ? "Pagination des vidéos" : "Video pagination"}>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="p-2 rounded-lg border border-border disabled:opacity-30 transition-colors hover:bg-muted disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={lang === "fr" ? "Page précédente" : "Previous page"}
                    >
                      <ChevronLeft size={20} aria-hidden="true" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "border border-border hover:bg-muted"
                          }`}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="p-2 rounded-lg border border-border disabled:opacity-30 transition-colors hover:bg-muted disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={lang === "fr" ? "Page suivante" : "Next page"}
                    >
                      <ChevronRight size={20} aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </section>
    </>
  );
};

export default withDataProviders(ResourcesMedia);
