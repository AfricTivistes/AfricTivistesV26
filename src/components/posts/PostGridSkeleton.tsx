
type CardVariant = "landscape" | "cover";

interface PostGridSkeletonProps {
  /** Number of skeleton cards to show */
  count?: number;
  /** Card variant matching PostGrid */
  variant?: CardVariant;
  /** Number of columns */
  columns?: 2 | 3 | 4;
}

const colsClass = {
  2: "grid md:grid-cols-2 gap-6",
  3: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
  4: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
};

/**
 * Skeleton loader matching PostGrid layout.
 */
const PostGridSkeleton = ({ count = 6, variant = "landscape", columns = 3 }: PostGridSkeletonProps) => {
  return (
    <div className={colsClass[columns]} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
          <div className={variant === "cover" ? "aspect-3/4 bg-muted" : "aspect-16/10 bg-muted"} />
          <div className="p-5 space-y-3">
            {variant === "landscape" && (
              <div className="flex gap-2">
                <div className="h-5 bg-muted rounded-full w-20" />
                <div className="h-5 bg-muted rounded-full w-16" />
              </div>
            )}
            {variant === "cover" && <div className="h-3 bg-muted rounded w-1/4" />}
            <div className="h-5 bg-muted rounded w-full" />
            {variant === "landscape" && <div className="h-4 bg-muted rounded w-2/3" />}
            {variant === "cover" && <div className="h-4 bg-muted rounded w-3/4" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGridSkeleton;
