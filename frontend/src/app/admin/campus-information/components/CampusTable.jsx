"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, Users, GraduationCap, MapPin, Phone } from "lucide-react";

export default function CampusTable({
  campuses = [],
  onDelete,
  deleting = false,
}) {
  if (!campuses.length) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900/50 p-10 text-center border border-slate-200/80 dark:border-slate-800/80 shadow-premium">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-350">
          No Campus Information Found
        </h2>
        <p className="mt-1 text-sm text-slate-400">Add a new campus to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Card View (hidden on medium screens and up) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {campuses.map((campus) => {
          const facultyCount = Array.isArray(campus.Totalfaculty)
            ? campus.Totalfaculty[0]
            : campus.Totalfaculty;
          const studentCount = Array.isArray(campus.TotalAvailableStudent)
            ? campus.TotalAvailableStudent[0]
            : campus.TotalAvailableStudent;

          return (
            <div
              key={campus._id}
              className="premium-card flex flex-col gap-4 border border-slate-200/80 dark:border-slate-800/80"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white text-lg">
                    {campus.campusName}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                    <MapPin size={12} />
                    <span>{campus.city || "-"}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    campus.status === "Active"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                  }`}
                >
                  {campus.status}
                </span>
              </div>

              {/* Card Details Grid */}
              <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-100 dark:border-slate-800/60 py-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone size={14} className="text-slate-400" />
                  <span className="truncate">{campus.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Users size={14} className="text-slate-400" />
                  <span>{facultyCount || 0} Faculty</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 col-span-2">
                  <GraduationCap size={14} className="text-slate-400" />
                  <span>{studentCount || 0} Active Students</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <Link
                  href={`/admin/campus-information/view/${campus._id}`}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-305 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  title="View"
                >
                  <Eye size={16} />
                </Link>

                <Link
                  href={`/admin/campus-information/edit/${campus._id}`}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>

                <button
                  onClick={() => onDelete(campus)}
                  disabled={deleting}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-5 py-4 w-12 text-center">#</th>
                <th className="px-5 py-4">Campus Name</th>
                <th className="px-5 py-4">City</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4 text-center">Faculty</th>
                <th className="px-5 py-4 text-center">Students</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center w-36">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {campuses.map((campus, index) => {
                const facultyCount = Array.isArray(campus.Totalfaculty)
                  ? campus.Totalfaculty[0]
                  : campus.Totalfaculty;
                const studentCount = Array.isArray(campus.TotalAvailableStudent)
                  ? campus.TotalAvailableStudent[0]
                  : campus.TotalAvailableStudent;

                return (
                  <tr
                    key={campus._id}
                    className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-5 py-4 text-center text-slate-400 font-mono text-xs">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                      {campus.campusName}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {campus.city}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-350 font-mono text-xs">
                      {campus.phone}
                    </td>

                    <td className="px-5 py-4 text-center text-slate-700 dark:text-slate-300">
                      {facultyCount || 0}
                    </td>

                    <td className="px-5 py-4 text-center text-slate-700 dark:text-slate-300">
                      {studentCount || 0}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${
                          campus.status === "Active"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {campus.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View */}
                        <Link
                          href={`/admin/campus-information/view/${campus._id}`}
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/80 transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/campus-information/edit/${campus._id}`}
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => onDelete(campus)}
                          disabled={deleting}
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
