"use client";

import { BookOpen } from "lucide-react";

export default function EmptyState({
  title = "No Courses Found",
  description = "There are no available courses.",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 py-16 px-6 text-center shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md">
      <BookOpen className="h-16 w-16 text-slate-350 dark:text-slate-600" />

      <h2 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
