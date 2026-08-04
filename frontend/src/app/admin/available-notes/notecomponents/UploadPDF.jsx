"use client";

export default function StatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full
      whitespace-nowrap
      px-2.5 py-1
      text-[10px] font-semibold
      transition-all duration-300
      sm:px-3 sm:py-1.5 sm:text-xs
      md:px-4 md:text-sm
      ${
        isActive
          ? "border border-green-200 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "border border-red-200 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400"
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
