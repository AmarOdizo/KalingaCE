"use client";

import Link from "next/link";
import { Plus, FileImage } from "lucide-react";

export default function EmptyState({
  title = "No Posters Found",
  description = "There are no posters registered. Add your first poster to display it on the website.",
  showAddButton = true,
}) {
  return (
    <div className="glass-panel rounded-3xl p-16 text-center shadow-premium transition-all duration-300">
      <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
        <FileImage size={40} />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        {description}
      </p>

      {showAddButton && (
        <div className="mt-8">
          <Link
            href="/admin/poster/add"
            className="btn-primary py-3 px-6 shadow-md"
          >
            <Plus size={18} />
            Add Poster
          </Link>
        </div>
      )}
    </div>
  );
}
