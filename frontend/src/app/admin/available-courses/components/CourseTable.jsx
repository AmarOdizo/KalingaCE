"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import StatusBadge from "./StatusBadge";
import { formatFees, getCourseImage } from "../utils";

export default function CourseTable({ courses, onDelete, onView }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800/60">
          <thead className="bg-slate-50/70 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
            <tr>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Image
              </th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Course
              </th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                Code
              </th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                Duration
              </th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Fees
              </th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                Students
              </th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 bg-transparent">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm relative">
                    <Image
                      src={getCourseImage(course.image)}
                      alt={course.courseName}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                </td>

                <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                  {course.courseName}
                </td>

                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-semibold hidden sm:table-cell">
                  {course.courseCode}
                </td>

                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-semibold hidden sm:table-cell">
                  {course.duration}
                </td>

                <td className="px-6 py-4 text-slate-900 dark:text-slate-100 text-sm font-bold">
                  {formatFees(course.fees)}
                </td>

                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-semibold hidden md:table-cell">
                  {course.students}+
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={course.status} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onView(course)}
                      className="rounded-lg bg-primary-50 p-2 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>

                    <Link
                      href={`/admin/available-courses/edit/${course.id}`}
                      className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-colors"
                      title="Edit Course"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      onClick={() => onDelete(course)}
                      className="rounded-lg bg-rose-50 p-2 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
