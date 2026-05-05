import { withProviders } from "@/lib/withProviders";
import { useParams, Link, useLocation } from "react-router-dom";

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
import { useEffect, useRef } from "react";
import { ArrowLeft, Calendar, Share2, Facebook, Linkedin, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFeaturedImageUrl, getPostCategories, formatDate } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";
import { usePostBySlug, usePostById } from "@/hooks/use-wordpress";

const BlogPost = () => {
  const { t, lang } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const locationState = location.state as { from?: string; fromLabelKey?: string } | null;
  const backTo = locationState?.from ?? "/blog";
  const backLabel = locationState?.fromLabelKey ? t(locationState.fromLabelKey) : t("blogPost.back");
  const { data: post, isLoading: loading } = usePostBySlug(slug);

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 section-container animate-pulse">
          <div className="h-8 bg-muted rounded w-2/3 mb-4" />
          <div className="h-4 bg-muted rounded w-1/3 mb-8" />
          <div className="aspect-[2/1] bg-muted rounded-xl mb-8" />
          <div className="space-y-3 max-w-3xl">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 section-container text-center py-12 lg:py-16">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t("blogPost.notFound")}</h1>
          <Link to={backTo} className="text-primary font-semibold" data-testid="link-back-blog">← {backLabel}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = getFeaturedImageUrl(post);
  const postCategories = getPostCategories(post);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-sm font-medium mr-1">{t("blogPost.share")}</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title.rendered)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
                aria-label="Partager sur X"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
                aria-label="Partager sur LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
                aria-label="Partager sur Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(post.title.rendered)}&body=${encodeURIComponent(window.location.href)}`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
                aria-label="Partager par email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {imageUrl && (
            <div className="aspect-[2/1] rounded-xl overflow-hidden mb-10">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div
            className="prose prose-lg max-w-3xl mx-auto prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto [&_img[width='16']]:inline [&_img[width='16']]:rounded-none [&_img[width='16']]:m-0 [&_img[width='16']]:align-middle [&_img[width='16']]:h-[1.2em] [&_img[width='16']]:w-auto [&_img[width='16']]:max-w-none"
            dangerouslySetInnerHTML={{ __html: formatPostContent(post.content.rendered) }}
          />
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default withProviders(BlogPost);
