"use client";

export default function StatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-1.5 sm:text-sm ${
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          isActive
            ? "bg-green-600 dark:bg-green-400"
            : "bg-red-600 dark:bg-red-400"
        }`}
      />

      {status}
    </span>
  );
}
