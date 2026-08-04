"use client";

import { Search } from "lucide-react";

export default function SearchFilter({ search, setSearch }) {
  return (
    <div className="glass-panel mb-6 rounded-2xl p-5 shadow-premium transition-all duration-300">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors"
        />

        <input
          type="text"
          placeholder="Search by Name, Subject or Batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="premium-input pl-12"
        />
      </div>
    </div>
  );
}
