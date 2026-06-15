import { withI18nQueryMotion } from "@/lib/providers/withI18nQueryMotion";
import { useParams, Link, useLocation } from "@/lib/router-shim";

function formatPostContent(html: string): string {
  // If already has block-level HTML, leave as-is
  if (/<(p|h[1-6]|ul|ol|blockquote|div|figure)\b/i.test(html)) return html;
  // Plain text: convert double newlines to paragraphs, single newlines to <br>
  return html
    .split(/\n{2,}/)
    .filter(Boolean)
    .map(para => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Calendar, Facebook, Linkedin, Mail, Tag } from "lucide-react";
import { getFeaturedImageUrl, getPostCategories, formatDate, CATEGORY_IDS } from "@/lib/wordpress";
import type { WPPost } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";
import { usePostBySlug, usePostById, usePosts } from "@/hooks/use-wordpress";
import { PostGrid, PostGridSkeleton } from "@/components/posts";
import NewsletterCard from "@/components/posts/NewsletterCard";

/** Reusable share buttons block — SSR-safe (reads window.location only after hydration). */
const ShareButtons = ({ title, label }: { title: string; label: string }) => {
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  return (
  <div className="rounded-xl border border-border bg-card p-5">
    <h3 className="text-sm font-bold text-foreground mb-3 font-heading">{label}</h3>
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors"
        aria-label="Partager sur X"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors"
        aria-label="Partager sur LinkedIn"
      >
        <Linkedin size={16} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors"
        aria-label="Partager sur Facebook"
      >
        <Facebook size={16} />
      </a>
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors"
        aria-label="Partager par email"
      >
        <Mail size={16} />
      </a>
    </div>
  </div>
  );
};

interface BlogPostProps {
  slug?: string;
  /** Server-rendered initial post. Used as initialData to avoid skeleton flash on first paint. */
  initialPost?: WPPost | null;
  /** Server-rendered related posts (up to 4, same categories). Used as initialData. */
  initialRelatedPosts?: { posts: WPPost[]; totalPages: number; total: number };
}

/** Related posts section — fetches posts from the same categories */
const RelatedPosts = ({
  categories,
  excludeId,
  lang,
  initialData,
}: {
  categories: number[];
  excludeId: number;
  lang: string;
  initialData?: { posts: WPPost[]; totalPages: number; total: number };
}) => {
  const { t } = useI18n();
  // Fetch more than needed so we can exclude current post and still show 3
  const { data, isLoading } = usePosts(
    {
      perPage: 4,
      categories,
    },
    { initialData },
  );

  const related = (data?.posts ?? []).filter((p) => p.id !== excludeId).slice(0, 3);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="section-container pt-12 pb-8 border-t border-border mt-16">
      <h2 className="text-2xl font-bold text-foreground font-heading mb-8">
        {t("blogPost.related")}
      </h2>
      {isLoading ? (
        <PostGridSkeleton count={3} variant="landscape" columns={3} />
      ) : (
        <PostGrid posts={related} variant="landscape" columns={3} />
      )}
    </section>
  );
};

const BlogPost = ({ slug: slugProp, initialPost, initialRelatedPosts }: BlogPostProps = {}) => {
  const { t, lang } = useI18n();
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;
  const location = useLocation();
  const locationState = location.state as { from?: string; fromLabelKey?: string } | null;
  const backTo = locationState?.from ?? "/blog";
  const backLabel = locationState?.fromLabelKey ? t(locationState.fromLabelKey) : t("blogPost.back");
  const { data: post, isLoading: loading } = usePostBySlug(slug, { initialData: initialPost });

  const frId = post?.translations?.fr;
  const enId = post?.translations?.en;
  const { data: frPost } = usePostById(frId);
  const { data: enPost } = usePostById(enId);

  // Refs to access the latest translated slugs from the event listener
  const frSlugRef = useRef<string | undefined>(undefined);
  const enSlugRef = useRef<string | undefined>(undefined);
  useEffect(() => { frSlugRef.current = frPost?.slug; }, [frPost]);
  useEffect(() => { enSlugRef.current = enPost?.slug; }, [enPost]);

  // Intercept language switches: when the user toggles language from the navbar,
  // navigate to the translated post slug instead of the default URL swap
  // (which would 404 because Polylang slugs differ between fr/en).
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ lang: "fr" | "en" }>;
      const targetLang = ce.detail?.lang;
      if (!targetLang || targetLang === lang) return;
      const targetSlug = targetLang === "fr" ? frSlugRef.current : enSlugRef.current;
      if (!targetSlug) return; // fall back to default URL swap
      e.preventDefault();
      try { localStorage.setItem("lang", targetLang); } catch { /* ignore */ }
      window.location.href = `/${targetLang}/blog/${targetSlug}/`;
    };
    window.addEventListener("lang:request", handler);
    return () => window.removeEventListener("lang:request", handler);
  }, [lang]);

  if (loading) {
    return (
      <div className="pt-28 section-container animate-pulse">
        <div className="h-8 bg-muted rounded w-2/3 mb-4" />
        <div className="h-4 bg-muted rounded w-1/3 mb-8" />
        <div className="aspect-2/1 bg-muted rounded-xl mb-8" />
        <div className="space-y-3 max-w-3xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-28 section-container text-center py-12 lg:py-16">
        <h1 className="text-3xl font-bold text-foreground mb-4">{t("blogPost.notFound")}</h1>
        <Link to={backTo} className="text-primary font-semibold" data-testid="link-back-blog">← {backLabel}</Link>
      </div>
    );
  }

  const imageUrl = getFeaturedImageUrl(post);
  const postCategories = getPostCategories(post);

  return (
    <article className="pt-24 pb-20">
        <div className="section-container">
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8" data-testid="link-back">
            <ArrowLeft size={16} />
            {backLabel}
          </Link>

          {postCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {postCategories.map((cat) => (
                <span key={cat.id} className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.date, lang === "en" ? "en-US" : "fr-FR")}
            </span>
          </div>

          {/* Share — mobile only, before image */}
          <div className="lg:hidden mb-6">
            <ShareButtons title={post.title.rendered} label={t("blogPost.share")} />
          </div>

          {/* 2-column layout: image+content left, sidebar right */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            {/* Left: image + article content */}
            <div className="flex-1 min-w-0">
              {imageUrl && (
                <div className="mb-10">
                  <img
                    src={imageUrl}
                    alt=""
                    className="rounded-xl"
                    style={{ objectFit: "cover" }}
                    sizes="(min-width: 750px) 750px, 100vw"
                    width="750"
                    height="750"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto [&_img[width='16']]:inline [&_img[width='16']]:rounded-none [&_img[width='16']]:m-0 [&_img[width='16']]:align-middle [&_img[width='16']]:h-[1.2em] [&_img[width='16']]:w-auto [&_img[width='16']]:max-w-none"
                dangerouslySetInnerHTML={{ __html: formatPostContent(post.content.rendered) }}
              />
            </div>

            {/* Right: sidebar */}
            <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 lg:self-start space-y-6">
              {/* Share — desktop only */}
              <div className="hidden lg:block">
                <ShareButtons title={post.title.rendered} label={t("blogPost.share")} />
              </div>

              {/* Categories */}
              {postCategories.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-bold text-foreground mb-3 font-heading flex items-center gap-2">
                    <Tag size={14} className="text-primary" />
                    {t("blogPost.categories")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {postCategories.map((cat) => {
                      const pubIds = [CATEGORY_IDS.publications.fr, CATEGORY_IDS.publications.en];
                      const toolkitIds = [CATEGORY_IDS.toolkits.fr, CATEGORY_IDS.toolkits.en];
                      let href = `/blog?cat=${cat.slug}&page=1`;
                      if (pubIds.includes(cat.id)) href = `/${lang}/resources/publications`;
                      else if (toolkitIds.includes(cat.id)) href = `/${lang}/resources/toolkits`;
                      return (
                        <Link
                          key={cat.id}
                          to={href}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <NewsletterCard />
            </aside>
          </div>
        </div>

        {/* Related posts */}
        {post.categories.length > 0 && (
          <RelatedPosts
            categories={post.categories}
            excludeId={post.id}
            lang={lang}
            initialData={initialRelatedPosts}
          />
        )}
      </article>
  );
};

export default withI18nQueryMotion(BlogPost);
