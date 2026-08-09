"use client";

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-4 w-96 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 flex items-center justify-between"
          >
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
          </div>
        ))}
      </div>

      {/* Search & Filter Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40">
        <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex-1 max-w-lg"></div>
        <div className="h-10 w-40 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-4 rounded bg-slate-350 dark:bg-slate-700"></div>
          ))}
        </div>

        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-8 gap-4 border-b border-slate-100 dark:border-slate-800 p-5"
          >
            {Array.from({ length: 8 }).map((_, col) => (
              <div key={col} className="h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
