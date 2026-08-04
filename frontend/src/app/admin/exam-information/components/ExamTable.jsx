"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

import { deleteExamInformation } from "../data";
import { formatBatch, formatDate } from "../utils";
import EmptyState from "./EmptyState";

export default function ExamTable({ exams, refreshData }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = (exam) => {
    setSelectedExam(exam);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await deleteExamInformation(selectedExam.id);

      if (res.success) {
        refreshData();
        setIsDeleteOpen(false);
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (exams.length === 0) {
    return (
      <EmptyState
        title="No Exam Information Found"
        description="There are no exam records available. Create your first exam schedule to keep students informed."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/60 dark:divide-slate-800/50">
            <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Exam & Venue
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 bg-transparent">
              {exams.map((exam) => (
                <tr
                  key={exam.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                >
                  {/* Image */}
                  <td className="px-6 py-4.5">
                    <div className="h-12 w-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative transition-transform duration-300 hover:scale-[1.03]">
                      <img
                        src={exam.image || "/no-image.png"}
                        alt={exam.examName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Exam & Venue */}
                  <td className="px-6 py-4.5">
                    <p className="font-bold text-slate-800 dark:text-slate-100">
                      {exam.examName}
                    </p>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                      {exam.venue}
                    </p>
                  </td>

                  {/* Course */}
                  <td className="px-6 py-4.5 text-slate-600 dark:text-slate-350 text-sm font-semibold">
                    {exam.course}
                  </td>

                  {/* Batch */}
                  <td className="px-6 py-4.5 text-slate-600 dark:text-slate-350 text-sm font-semibold">
                    {formatBatch(exam.batch)}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4.5 text-slate-650 dark:text-slate-300 text-sm font-bold">
                    {formatDate(exam.examDate)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4.5 text-center">
                    <StatusBadge status={exam.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4.5">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/exam-information/view/${exam.id}`}
                        className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 active:scale-95"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        href={`/admin/exam-information/edit/${exam.id}`}
                        className="rounded-xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-200 active:scale-95"
                        title="Edit Exam"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        onClick={() => handleDeleteClick(exam)}
                        className="rounded-xl bg-rose-50 p-2 text-rose-650 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
                        title="Delete Exam"
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

      <DeleteModal
        isOpen={isDeleteOpen}
        loading={loading}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        exam={selectedExam}
      />
    </>
  );
}
