"use client";

import { BookOpen } from "lucide-react";

export default function EmptyState({
  title = "No Courses Found",
  description = "There are no available courses.",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white py-16 text-center shadow-sm">
      <BookOpen className="h-16 w-16 text-gray-400" />

      <h2 className="mt-4 text-2xl font-bold text-gray-800">{title}</h2>

      <p className="mt-2 max-w-md text-gray-500">{description}</p>
    </div>
  );
}
