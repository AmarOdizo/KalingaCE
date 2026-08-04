"use client";

export default function FilterBar({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    >
      <option value="All">All Status</option>
      <option value="Admission Open">Admission Open</option>
      <option value="Closed">Closed</option>
      <option value="Coming Soon">Coming Soon</option>
    </select>
  );
}
