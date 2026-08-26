"use client";

export default function Loading() {
  return (
    <div className="bg-gray-50 py-16 dark:bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Skeleton */}
        <div className="mb-12 text-center animate-pulse">
          <div className="mx-auto h-9 w-64 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div className="mx-auto mt-4 h-4 w-96 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
        </div>

        {/* Filter bar Skeleton */}
        <div className="mb-10 flex flex-wrap gap-2 justify-center animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          ))}
        </div>

        {/* Search bar Skeleton */}
        <div className="mb-10 mx-auto max-w-md h-11 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>

        {/* Grid Skeletons */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-3xl border border-gray-150 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 animate-pulse space-y-4"
            >
              {/* Thumbnail skeleton */}
              <div className="h-48 w-full rounded-2xl bg-gray-200 dark:bg-gray-800"></div>

              {/* Subject badge skeleton */}
              <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-800"></div>

              {/* Title skeleton */}
              <div className="space-y-2">
                <div className="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-6 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
              </div>

              {/* Description skeleton */}
              <div className="space-y-1.5 pt-2">
                <div className="h-3.5 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-3.5 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-3.5 w-2/3 rounded bg-gray-200 dark:bg-gray-800"></div>
              </div>

              {/* Footer skeleton */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="space-y-1">
                  <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-800"></div>
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800"></div>
                </div>
                <div className="h-9 w-20 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
