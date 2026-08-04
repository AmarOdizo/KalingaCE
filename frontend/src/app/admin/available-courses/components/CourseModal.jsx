"use client";

import { X } from "lucide-react";
import CourseDetails from "./CourseDetails";

export default function CourseModal({ open, course, onClose }) {
  if (!open || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <CourseDetails course={course} />
      </div>
    </div>
  );
}
