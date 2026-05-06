import { withDataProviders } from "@/lib/withProviders";
import { Link } from "@/lib/router-shim";
import { ArrowRight, Newspaper } from "lucide-react";
import { stripHtml, formatDate, type WPPost } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";
import { useStickyPosts, useCommuniquePosts } from "@/hooks/use-wordpress";

interface TickerStripProps {
  posts: WPPost[];
  lang: string;
}

const TickerStrip = ({ posts, lang }: TickerStripProps) => {
  const duplicatedPosts = [...posts, ...posts];
  return (
    <div className="relative flex-1 overflow-hidden py-3">
      <div className="flex gap-8 animate-ticker whitespace-nowrap">
        {duplicatedPosts.map((post, i) => (
          <Link
            key={`${post.id}-${i}`}
            to={`/blog/${post.slug}`}
            className="shrink-0 flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity"
            data-testid={`ticker-article-${post.id}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
            <span className="text-sm text-primary-foreground font-medium">
              {stripHtml(post.title.rendered)}
            </span>
            <span className="text-xs text-primary-foreground/50">
              {formatDate(post.date, lang === "en" ? "en-US" : "fr-FR")}
            </span>
            <ArrowRight size={12} className="text-primary-foreground/40" />
          </Link>
        ))}
      </div>
    </div>
  );
};

const StickyArticlesTicker = () => {
  const { t, lang } = useI18n();
  const { data: stickyPosts = [], isLoading: loadingSticky } = useStickyPosts(10);
  const { data: communiquePosts = [], isLoading: loadingCommunique } = useCommuniquePosts(10);

  const loadingSkeleton = (className: string) => (
    <section className={`bg-primary py-3 ${className}`} data-testid="ticker-loading">
      <div className="flex items-center gap-4 px-4">
        <span className="shrink-0 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
          {t("ticker.label")}
        </span>
        <div className="h-4 bg-primary-foreground/20 rounded w-64 animate-pulse" />
      </div>
    </section>
  );

  const tickerLabel = (label: string) => (
    <div className="shrink-0 bg-secondary text-secondary-foreground px-4 py-3 flex items-center gap-2 z-10" data-testid="ticker-label">
      <Newspaper size={14} />
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </div>
  );

  return (
    <>
      {/* Mobile : articles sticky */}
      {loadingSticky ? (
        loadingSkeleton("lg:hidden")
      ) : stickyPosts.length > 0 ? (
        <section className="bg-primary overflow-hidden lg:hidden" data-testid="ticker-section-mobile">
          <div className="flex items-center">
            {tickerLabel(t("ticker.label"))}
            <TickerStrip posts={stickyPosts} lang={lang} />
          </div>
        </section>
      ) : null}

      {/* Desktop : derniers communiques */}
      {loadingCommunique ? (
        loadingSkeleton("hidden lg:block")
      ) : communiquePosts.length > 0 ? (
        <section className="bg-primary overflow-hidden hidden lg:block" data-testid="ticker-section-desktop">
          <div className="flex items-center">
            {tickerLabel(t("releases.title"))}
            <TickerStrip posts={communiquePosts} lang={lang} />
          </div>
        </section>
      ) : null}
    </>
  );
};

export default withDataProviders(StickyArticlesTicker);
