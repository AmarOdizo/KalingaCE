"use client";

import { Search } from "lucide-react";

export default function SearchFilter({ search, setSearch }) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by Name, Subject or Batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600"
        />
      </div>
    </div>
  );
}
