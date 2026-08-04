"use client";

import { FileX } from "lucide-react";

export default function EmptyState({
  title = "No Data Found",
  description = "There is no data available.",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="rounded-full bg-gray-100 p-5 dark:bg-gray-800">
        <FileX size={48} className="text-gray-500" />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-gray-500">{description}</p>
    </div>
  );
}
