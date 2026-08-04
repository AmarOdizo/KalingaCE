"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

        {/* Text */}
        <p className="text-gray-500 dark:text-gray-400">Loading Notes...</p>
      </div>
    </div>
  );
}
