"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex min-h-[350px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 sm:min-h-[400px] sm:px-8 lg:min-h-[450px]">
      <div className="mx-auto max-w-md">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 sm:h-20 sm:w-20">
          <FileText
            size={36}
            className="text-blue-600 dark:text-blue-400 sm:h-10 sm:w-10"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
          No Notes Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
          There are no study notes available at the moment.
          <br className="hidden sm:block" />
          Click the button below to add your first note.
        </p>

        {/* Button */}
        <Link
          href="/admin/available-notes/add"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-95 sm:w-auto sm:text-base"
        >
          + Add Note
        </Link>
      </div>
    </div>
  );
}
