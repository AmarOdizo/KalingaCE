"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

import { deleteExamInformation } from "../data";
import { formatBatch, formatDate, getStatusColor } from "../utils";
import EmptyState from "./EmptyState";

export default function ExamTable({ exams, refreshData }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };
  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await deleteExamInformation(selectedId);

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
        title="No Exam Information"
        description="There are no exam records available."
      />
    );
  }
  return (
    <>
      <div className="overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-900">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>

              <th className="px-4 py-3 text-left">Exam</th>

              <th className="px-4 py-3 text-left">Course</th>

              <th className="px-4 py-3 text-left">Batch</th>

              <th className="px-4 py-3 text-left">Date</th>

              <th className="px-4 py-3 text-left">Status</th>

              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-t dark:border-gray-700">
                {/* Image */}

                <td className="px-4 py-3">
                  <Image
                    src={exam.image || "/no-image.png"}
                    alt={exam.examName}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                </td>

                {/* Exam */}

                <td className="px-4 py-3">
                  <p className="font-semibold">{exam.examName}</p>

                  <p className="text-sm text-gray-500">{exam.venue}</p>
                </td>

                {/* Course */}

                <td className="px-4 py-3">{exam.course}</td>

                {/* Batch */}

                <td className="px-4 py-3">{formatBatch(exam.batch)}</td>

                {/* Date */}

                <td className="px-4 py-3">{formatDate(exam.examDate)}</td>

                {/* Status */}

                <td className="px-4 py-3">
                  <StatusBadge status={exam.status} />
                </td>

                {/* Actions */}

                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <Link href={`/admin/exam-information/view/${exam.id}`}>
                      <Eye size={18} className="text-blue-600" />
                    </Link>

                    <Link href={`/admin/exam-information/edit/${exam.id}`}>
                      <Pencil size={18} className="text-green-600" />
                    </Link>

                    <button onClick={() => handleDeleteClick(exam.id)}>
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModal
        open={isDeleteOpen}
        loading={loading}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
