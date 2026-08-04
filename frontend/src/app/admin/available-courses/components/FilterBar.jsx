"use client";

export default function FilterBar({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:text-slate-250 cursor-pointer"
    >
      <option value="All" className="dark:bg-slate-900">All Status</option>
      <option value="Admission Open" className="dark:bg-slate-900">Admission Open</option>
      <option value="Closed" className="dark:bg-slate-900">Closed</option>
      <option value="Coming Soon" className="dark:bg-slate-900">Coming Soon</option>
    </select>
  );
}
