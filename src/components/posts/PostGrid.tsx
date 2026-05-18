import { m as motion } from "framer-motion";
import type { WPPost } from "@/lib/wordpress";
import PostCard from "./PostCard";
import PostCoverCard from "./PostCoverCard";
import type { LucideIcon } from "lucide-react";

type CardVariant = "landscape" | "cover";

interface PostGridProps {
  posts: WPPost[];
  /** Card variant: "landscape" (16/10) or "cover" (3/4 portrait) */
  variant?: CardVariant;
  /** Number of columns on large screens (default 3) */
  columns?: 2 | 3 | 4;
  /** Whether to animate card entry */
  animate?: boolean;
  /** Link state passed to each card */
  linkState?: Record<string, string>;
  /** Placeholder icon for cover variant */
  placeholderIcon?: LucideIcon;
  /** Show date on cover cards */
  showDate?: boolean;
}

const colsClass = {
  2: "grid md:grid-cols-2 gap-6",
  3: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
  4: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
};

/**
 * Reusable post grid. Renders PostCard or PostCoverCard with optional
 * Framer Motion staggered animation.
 */
const PostGrid = ({
  posts,
  variant = "landscape",
  columns = 3,
  animate = true,
  linkState,
  placeholderIcon,
  showDate = true,
}: PostGridProps) => {
  const Wrapper = animate ? motion.div : "div";

  return (
    <div className={colsClass[columns]} role="list">
      {posts.map((post, i) => {
        const card =
          variant === "cover" ? (
            <PostCoverCard
              post={post}
              linkState={linkState}
              placeholderIcon={placeholderIcon}
              showDate={showDate}
            />
          ) : (
            <PostCard post={post} linkState={linkState} />
          );

        if (!animate) {
          return <div key={post.id} role="listitem">{card}</div>;
        }

        return (
          <motion.div
            key={post.id}
            role="listitem"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            {card}
          </motion.div>
        );
      })}
    </div>
  );
};

export default PostGrid;
