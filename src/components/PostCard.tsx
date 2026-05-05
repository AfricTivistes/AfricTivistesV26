import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import type { WPPost } from "@/lib/wordpress";
import { getFeaturedImageUrl, getPostCategories, stripHtml, formatDate } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";

interface PostCardProps {
  post: WPPost;
}

const PostCard = ({ post }: PostCardProps) => {
  const imageUrl = getFeaturedImageUrl(post);
  const categories = getPostCategories(post);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 150);
  const { lang, t } = useI18n();

  return (
    <article>
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Lire l'article: ${stripHtml(post.title.rendered)}`}
      >
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full pattern-kente flex items-center justify-center" aria-hidden="true">
              <span className="text-4xl font-heading font-bold text-primary/20">AT</span>
            </div>
          )}
        </div>
        <div className="p-5">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3" role="list">
              {categories.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                  role="listitem"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
          <h3
            className="font-heading text-lg font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {excerpt}…
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <time dateTime={post.date} className="flex items-center gap-1.5">
              <Calendar size={14} aria-hidden="true" />
              {formatDate(post.date, lang === "en" ? "en-US" : "fr-FR")}
            </time>
            <span className="flex items-center gap-1 font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              {t("blog.read")} <ArrowRight size={14} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
