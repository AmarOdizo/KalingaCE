"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-gray-100 px-4 py-8 transition-colors duration-300 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent sm:h-14 sm:w-14 lg:h-16 lg:w-16 dark:border-blue-400 dark:border-t-transparent"></div>

        {/* Loading Text */}
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:text-base">
          Loading...
        </p>
      </div>
    </div>
  );
}
