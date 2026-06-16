import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/lib/router-shim";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface PaginationButtonProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
}

interface PaginationLinkProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ariaLabel?: string;
}

type PaginationProps = PaginationButtonProps | PaginationLinkProps;

function isLinkMode(props: PaginationProps): props is PaginationLinkProps {
  return "buildHref" in props;
}

/**
 * Shared pagination component.
 * - Button mode: uses `onPageChange` callback (resources, media)
 * - Link mode: uses `buildHref` to generate <Link> URLs (blog)
 */
const Pagination = (props: PaginationProps) => {
  const { currentPage, totalPages } = props;
  const { lang } = useI18n();
  const label = props.ariaLabel ?? (lang === "fr" ? "Pagination" : "Pagination");

  if (totalPages <= 1) return null;

  const maxVisible = Math.min(totalPages, 5);
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;
  const prevLabel = lang === "fr" ? "Page précédente" : "Previous page";
  const nextLabel = lang === "fr" ? "Page suivante" : "Next page";

  const navBtnClass = "p-2 rounded-lg border border-border transition-colors hover:bg-muted focus:outline-hidden focus:ring-2 focus:ring-primary";
  const pageBtnClass = "w-10 h-10 rounded-lg text-sm font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary inline-flex items-center justify-center";

  if (isLinkMode(props)) {
    return (
      <nav className="flex items-center justify-center gap-2 mt-14" aria-label={label}>
        <Link
          to={props.buildHref(currentPage - 1)}
          className={cn(navBtnClass, prevDisabled && "pointer-events-none opacity-30")}
          aria-label={prevLabel}
          aria-disabled={prevDisabled}
          tabIndex={prevDisabled ? -1 : undefined}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </Link>
        {pages.map((page) => (
          <Link
            key={page}
            to={props.buildHref(page)}
            className={cn(
              pageBtnClass,
              currentPage === page
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "border border-border hover:bg-muted"
            )}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Link>
        ))}
        <Link
          to={props.buildHref(currentPage + 1)}
          className={cn(navBtnClass, nextDisabled && "pointer-events-none opacity-30")}
          aria-label={nextLabel}
          aria-disabled={nextDisabled}
          tabIndex={nextDisabled ? -1 : undefined}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-14" aria-label={label}>
      <button
        onClick={() => props.onPageChange(currentPage - 1)}
        disabled={prevDisabled}
        className={cn(navBtnClass, "disabled:opacity-30 disabled:hover:bg-transparent")}
        aria-label={prevLabel}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => props.onPageChange(page)}
          className={cn(
            pageBtnClass,
            currentPage === page
              ? "bg-primary text-primary-foreground"
              : "border border-border hover:bg-muted"
          )}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => props.onPageChange(currentPage + 1)}
        disabled={nextDisabled}
        className={cn(navBtnClass, "disabled:opacity-30 disabled:hover:bg-transparent")}
        aria-label={nextLabel}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
