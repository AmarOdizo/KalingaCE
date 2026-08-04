"use client";

import { X } from "lucide-react";
import CourseDetails from "./CourseDetails";

export default function CourseModal({ open, course, onClose }) {
  if (!open || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 md:p-6 transition-all duration-300">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-premium backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100/80 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        <CourseDetails course={course} />
      </div>
    </div>
  );
}
