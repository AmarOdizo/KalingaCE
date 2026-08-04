"use client";

import Link from "next/link";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { calculatePercentage, calculateGrade } from "../utils";

export default function StudentTable({ students, onDelete }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-5 py-4 text-left">Image</th>

              <th className="px-5 py-4 text-left">Name</th>

              <th className="px-5 py-4 text-left">Subject</th>

              <th className="px-5 py-4 text-left">Batch</th>

              <th className="px-5 py-4 text-center">Marks</th>

              <th className="px-5 py-4 text-center">%</th>

              <th className="px-5 py-4 text-center">Grade</th>

              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => {
              const percentage = calculatePercentage(
                student.gainMark,
                student.totalMark,
              );

              const grade = calculateGrade(Number(percentage));

              return (
                <tr
                  key={student.id}
                  className="border-b transition hover:bg-blue-50"
                >
                  {/* Image */}

                  <td className="px-5 py-4">
                    <img
                      src={
                        student.image ||
                        "https://placehold.co/80x80?text=Student"
                      }
                      alt={student.name}
                      className="h-14 w-14 rounded-full border object-cover"
                    />
                  </td>

                  {/* Name */}

                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {student.name}
                  </td>

                  {/* Subject */}

                  <td className="px-5 py-4">{student.subject}</td>

                  {/* Batch */}

                  <td className="px-5 py-4">{student.batch}</td>

                  {/* Marks */}

                  <td className="px-5 py-4 text-center">
                    {student.gainMark}/{student.totalMark}
                  </td>

                  {/* Percentage */}

                  <td className="px-5 py-4 text-center">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {percentage}%
                    </span>
                  </td>

                  {/* Grade */}

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold
                      ${
                        grade === "A+"
                          ? "bg-blue-100 text-blue-700"
                          : grade === "A"
                            ? "bg-green-100 text-green-700"
                            : grade === "B+"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {grade}
                    </span>
                  </td>

                  {/* Action */}

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* View */}

                      <Link
                        href={`/admin/topper-student/view/${student.id}`}
                        className="rounded-lg bg-sky-100 p-2 text-sky-600 transition hover:bg-sky-600 hover:text-white"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Edit */}

                      <Link
                        href={`/admin/topper-student/edit/${student.id}`}
                        className="rounded-lg bg-yellow-100 p-2 text-yellow-700 transition hover:bg-yellow-500 hover:text-white"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* Delete */}

                      <button
                        onClick={() => onDelete(student)}
                        className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={18} />
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
