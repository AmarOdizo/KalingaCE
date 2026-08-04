"use client";

import Image from "next/image";
import { Eye, CalendarDays, BookOpen } from "lucide-react";

export default function ExamCard({ exam, onView }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={exam.image || "/no-image.png"}
          alt={exam.examName}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {exam.status}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 p-5">
        <h3 className="line-clamp-1 text-xl font-bold text-gray-900 dark:text-white">
          {exam.examName}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <BookOpen size={17} className="text-blue-600" />
            <span>{exam.course}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={17} className="text-green-600" />
            <span>{new Date(exam.examDate).toLocaleDateString("en-IN")}</span>
          </div>
        </div>

        <button
          onClick={onView}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Eye size={18} />
          View Details
        </button>
      </div>
    </div>
  );
}
