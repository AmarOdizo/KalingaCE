"use client";

import Link from "next/link";
import { Search, Plus } from "lucide-react";

export default function SearchFilter({ search, setSearch }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow dark:bg-gray-900 md:flex-row md:items-center md:justify-between">
      {/* Search */}

      <div className="relative w-full md:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder="Search exam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {/* Add Button */}
    </div>
  );
}
