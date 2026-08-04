"use client";

import { Search } from "lucide-react";

export default function SearchFilter({ search, setSearch }) {
  return (
    <div className="mb-6">
      <div className="relative mx-auto w-full">
        {/* Search Icon */}
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Subject or Note Title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            rounded-xl
            border border-gray-300
            bg-white
            py-3
            pl-12
            pr-4
            text-sm
            text-gray-900
            shadow-sm
            outline-none
            transition-all
            duration-200
            placeholder:text-gray-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-200

            dark:border-gray-700
            dark:bg-gray-900
            dark:text-white
            dark:placeholder:text-gray-500
            dark:focus:border-blue-500
            dark:focus:ring-blue-900

            sm:text-base
            lg:py-3.5
          "
        />
      </div>
    </div>
  );
}
