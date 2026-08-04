"use client";

export default function Loading() {
  return (
    <div className="flex h-[60vh] items-center justify-center transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent dark:border-primary-400 dark:border-t-transparent shadow-premium" />

        <p className="text-sm font-semibold text-slate-550 dark:text-slate-400 animate-pulse">Loading Students...</p>
      </div>
    </div>
  );
}
