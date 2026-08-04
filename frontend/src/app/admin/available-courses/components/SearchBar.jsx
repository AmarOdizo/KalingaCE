"use client";

import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />

      <input
        type="text"
        placeholder="Search by course name or code..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white/60 py-2.5 pl-11 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20"
      />
    </div>
  );
}
