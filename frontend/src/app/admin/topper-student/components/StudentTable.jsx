"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { calculatePercentage, calculateGrade } from "../utils";

export default function StudentTable({ students, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800/50">
          <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
            <tr>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">Image</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">Name</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">Batch</th>
              <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider">Marks</th>
              <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider">% Score</th>
              <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider">Grade</th>
              <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 bg-transparent">
            {students.map((student) => {
              const percentage = calculatePercentage(
                student.gainMark,
                student.totalMark,
              );

              const grade = calculateGrade(Number(percentage));

              return (
                <tr
                  key={student.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                >
                  {/* Image */}
                  <td className="px-6 py-4.5">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 shadow-sm relative transition-transform duration-300 hover:scale-105">
                      <img
                        src={
                          student.image ||
                          "https://placehold.co/80x80?text=Student"
                        }
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4.5 font-bold text-slate-800 dark:text-slate-100">
                    {student.name}
                  </td>

                  {/* Subject */}
                  <td className="px-6 py-4.5 text-slate-600 dark:text-slate-350 text-sm font-semibold">
                    {student.subject}
                  </td>

                  {/* Batch */}
                  <td className="px-6 py-4.5 text-slate-600 dark:text-slate-350 text-sm font-semibold">
                    {student.batch}
                  </td>

                  {/* Marks */}
                  <td className="px-6 py-4.5 text-center text-slate-700 dark:text-slate-300 text-sm font-bold">
                    {student.gainMark} <span className="text-xs text-slate-400 font-normal">/</span> {student.totalMark}
                  </td>

                  {/* Percentage */}
                  <td className="px-6 py-4.5 text-center">
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {percentage}%
                    </span>
                  </td>

                  {/* Grade */}
                  <td className="px-6 py-4.5 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold
                      ${
                        grade === "A+"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                          : grade === "A"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : grade === "B+"
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}
                    >
                      {grade}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4.5">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/topper-student/view/${student.id}`}
                        className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 active:scale-95"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        href={`/admin/topper-student/edit/${student.id}`}
                        className="rounded-xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-200 active:scale-95"
                        title="Edit Student"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        onClick={() => onDelete(student)}
                        className="rounded-xl bg-rose-50 p-2 text-rose-650 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                        title="Delete Student"
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
  );
}
