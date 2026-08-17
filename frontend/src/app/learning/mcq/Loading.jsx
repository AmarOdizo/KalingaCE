"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent dark:border-primary-400 dark:border-t-transparent"></div>

        {/* Text */}
        <p className="text-slate-500 font-medium dark:text-slate-400">Loading MCQs...</p>
      </div>
    </div>
  );
}
