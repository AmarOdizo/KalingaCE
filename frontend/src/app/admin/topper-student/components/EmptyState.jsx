"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-2xl bg-white p-16 text-center shadow">
      <img
        src="https://placehold.co/220x180?text=No+Data"
        alt="No Data"
        className="mx-auto mb-6"
      />

      <h2 className="text-2xl font-bold">No Student Found</h2>

      <p className="mt-3 text-gray-500">
        Click below to add your first topper student.
      </p>

      <Link
        href="/admin/topper-student/add"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        <Plus size={20} />
        Add Student
      </Link>
    </div>
  );
}
