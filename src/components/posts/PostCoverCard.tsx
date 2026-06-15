import { Link } from "@/lib/router-shim";
import { FileText } from "lucide-react";
import type { WPPost } from "@/lib/wordpress";
import { getFeaturedImageUrl, stripHtml, formatDate } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";
import type { LucideIcon } from "lucide-react";

interface PostCoverCardProps {
  post: WPPost;
  /** Link state passed to router (e.g. breadcrumb context) */
  linkState?: Record<string, string>;
  /** Icon shown as placeholder when no image */
  placeholderIcon?: LucideIcon;
  /** Whether to show the date below the image */
  showDate?: boolean;
}

/**
 * Portrait cover-style card (3/4 aspect, object-contain).
 * Used for publications, toolkits, and similar document-style posts.
 */
const PostCoverCard = ({ post, linkState, placeholderIcon: Icon = FileText, showDate = true }: PostCoverCardProps) => {
  const imageUrl = getFeaturedImageUrl(post);
  const title = stripHtml(post.title.rendered);
  const { lang, t } = useI18n();

  return (
    <article className="group bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <Link
        to={`/blog/${post.slug}`}
        state={linkState}
        className="block focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`${t("releases.read")} : ${title}`}
      >
        {/* Cover image - portrait ratio for report/document covers */}
        <div className="aspect-3/4 overflow-hidden bg-muted/50 p-6 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              width="600"
              height="800"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon size={64} className="text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {showDate && (
            <p className="text-xs text-muted-foreground mb-2">
              {formatDate(post.date, lang === "en" ? "en-US" : "fr-FR")}
            </p>
          )}
          <h3 className="font-heading text-sm font-bold text-card-foreground leading-tight line-clamp-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </Link>
    </article>
  );
};

export default PostCoverCard;
