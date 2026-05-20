import { m as motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/router-shim";

export interface BreadcrumbItem {
  to: string;
  label: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  current: string;
  /** Whether to wrap in framer-motion for fade-in. Default true. */
  animated?: boolean;
}

/**
 * Reusable breadcrumb navigation for hero sections.
 */
const Breadcrumb = ({ items, current, animated = true }: BreadcrumbProps) => {
  const content = (
    <>
      {items.map((item, i) => (
        <span key={i} className="contents">
          <Link to={item.to} className="hover:text-white/80 transition-colors">
            {item.label}
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
        </span>
      ))}
      <span className="text-white/70 truncate max-w-[200px]">{current}</span>
    </>
  );

  if (animated) {
    return (
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-1.5 text-xs text-white/50 mb-8"
        aria-label="Fil d'Ariane"
      >
        {content}
      </motion.nav>
    );
  }

  return (
    <nav
      className="flex items-center gap-1.5 text-xs text-white/50 mb-8"
      aria-label="Fil d'Ariane"
    >
      {content}
    </nav>
  );
};

export default Breadcrumb;
