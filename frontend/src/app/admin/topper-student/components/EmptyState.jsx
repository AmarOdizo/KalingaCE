"use client";

import Link from "next/link";
import { Plus, GraduationCap } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="glass-panel rounded-3xl p-16 text-center shadow-premium transition-all duration-300">
      <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
        <GraduationCap size={40} />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Student Found</h2>

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        There are no topper students registered. Add your first student to showcase their achievements.
      </p>

      <div className="mt-8">
        <Link
          href="/admin/topper-student/add"
          className="btn-primary py-3 px-6 shadow-md"
        >
          <Plus size={18} />
          Add Student
        </Link>
      </div>
    </div>
  );
}
