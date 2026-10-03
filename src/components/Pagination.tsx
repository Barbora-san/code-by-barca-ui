import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { cn } from "../lib/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Kolik stránek ukázat vedle aktuální. */
  siblingCount?: number;
  className?: string;
}

/** Vrací např. `[1, "…", 4, 5, 6, "…", 10]`. */
export function getPageRange(current: number, total: number, siblings = 1): (number | "…")[] {
  const slots = siblings * 2 + 5;
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  if (!showLeftDots && showRightDots) return [...range(1, 3 + siblings * 2), "…", total];
  if (showLeftDots && !showRightDots) return [1, "…", ...range(total - (2 + siblings * 2), total)];
  return [1, "…", ...range(left, right), "…", total];
}

export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const go = (p: number) => onPageChange(Math.max(1, Math.min(totalPages, p)));
  return (
    <nav aria-label="Stránkování" className={cn("cbb-pagination", className)}>
      <button type="button" className="cbb-pagination__btn" onClick={() => go(currentPage - 1)} disabled={currentPage <= 1} aria-label="Předchozí stránka">
        <ChevronLeftIcon size={16} />
      </button>
      {getPageRange(currentPage, totalPages, siblingCount).map((p, i) =>
        p === "…" ? (
          <span key={`d${i}`} className="cbb-pagination__dots" aria-hidden="true">
            …
          </span>
        ) : (
          <button key={p} type="button" className={cn("cbb-pagination__btn", p === currentPage && "is-active")} aria-current={p === currentPage ? "page" : undefined} onClick={() => go(p)}>
            {p}
          </button>
        )
      )}
      <button type="button" className="cbb-pagination__btn" onClick={() => go(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Další stránka">
        <ChevronRightIcon size={16} />
      </button>
    </nav>
  );
}
