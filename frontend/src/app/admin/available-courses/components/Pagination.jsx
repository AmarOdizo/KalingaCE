"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        title="Previous Page"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
            currentPage === page
              ? "bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/10"
              : "border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        title="Next Page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
