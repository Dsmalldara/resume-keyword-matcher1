"use client";
import * as React from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // number of pages to show on each side of current
  className?: string;
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => start + idx);
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const handlePage = (page: number) => () => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  if (totalPages <= 1) return null;

  const totalPageNumbers = siblingCount * 2 + 5; // first, last, current, two dots

  let pages: (number | string)[] = [];

  if (totalPages <= totalPageNumbers) {
    pages = range(1, totalPages);
  } else {
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      pages = [...leftRange, "...", totalPages];
    } else if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      pages = [1, "...", ...rightRange];
    } else if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      pages = [1, "...", ...middleRange, "...", totalPages];
    }
  }

  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label="Pagination Navigation"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrev}
        aria-label="Previous page"
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          typeof p === "string" ? (
            <span
              key={`dots-${idx}`}
              className="px-3 py-1 text-sm text-gray-500"
              aria-hidden
            >
              {p}
            </span>
          ) : (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "ghost"}
              size="sm"
              onClick={handlePage(p)}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleNext}
        aria-label="Next page"
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}

export default Pagination;
