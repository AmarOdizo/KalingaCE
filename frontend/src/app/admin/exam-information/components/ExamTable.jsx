"use client";

import Link from "next/link";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { Eye, Pencil, Trash2, BookOpenCheck, Award, Send } from "lucide-react";
import { deleteExamInformation, togglePublishResults, updateExamStatus } from "../data";
import { formatBatch, formatDate } from "../utils";
import EmptyState from "./EmptyState";
import AdminAgGrid from "@/components/AdminAgGrid";

const parseExamStart = (examDate, examTime) => {
  try {
    const d = new Date(examDate);
    const timeStr = examTime || "00:00";
    let hours = 0;
    let minutes = 0;
    
    if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
      const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
      if (match) {
        hours = Number(match[1]);
        minutes = Number(match[2]);
        const ampm = match[3].toLowerCase();
        if (ampm === "pm" && hours < 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
      }
    } else {
      const parts = timeStr.split(":");
      hours = Number(parts[0]) || 0;
      minutes = Number(parts[1]) || 0;
    }
    
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes, 0);
  } catch (err) {
    return new Date();
  }
};

const parseDurationMinutes = (durationStr) => {
  try {
    const str = (durationStr || "").toLowerCase();
    const num = parseFloat(str) || 0;
    if (str.includes("minute")) {
      return num;
    }
    if (str.includes("hour")) {
      return num * 60;
    }
    return 60;
  } catch (err) {
    return 60;
  }
};

const isExamExpired = (exam) => {
  try {
    const startDateTime = parseExamStart(exam.examDate, exam.examTime);
    const durationMinutes = parseDurationMinutes(exam.duration);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);
    return new Date() > endDateTime;
  } catch (e) {
    return false;
  }
};

export default function ExamTable({ exams, mcqs = [], sqas = [], refreshData }) {
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

  const handlePublishToggle = async (exam) => {
    try {
      const targetId = exam._id || exam.id;
      await togglePublishResults(targetId);
      refreshData();
    } catch (error) {
      console.error(error);
      alert("Failed to toggle publish status: " + error.message);
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

  const columnDefs = [
    {
      headerName: "Image",
      field: "image",
      width: 120,
      cellRenderer: (params) => {
        const src = params.value || "/no-image.png";
        return (
          <div className="flex items-center h-full">
            <div className="h-12 w-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative transition-transform duration-300 hover:scale-[1.03]">
              <img
                src={src}
                alt={params.data.examName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        );
      },
      sortable: false,
      filter: false,
    },
    {
      headerName: "Exam & Venue",
      field: "examName",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full">
          <p className="font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {params.value}
          </p>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-550 mt-0.5">
            {params.data.venue}
          </p>
        </div>
      ),
    },
    {
      headerName: "Mode",
      field: "mode",
      width: 110,
      cellRenderer: (params) => {
        const mode = params.value || "Offline";
        const isOnline = mode.toLowerCase() === "online";
        return (
          <div className="flex items-center h-full">
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${
                isOnline
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
              }`}
            >
              {mode}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Batch",
      field: "batch",
      flex: 1,
      minWidth: 130,
      valueFormatter: (params) => formatBatch(params.value),
      cellClass: "text-slate-650 dark:text-slate-300 text-sm font-semibold flex items-center",
    },
    {
      headerName: "Date",
      field: "examDate",
      flex: 1,
      minWidth: 130,
      valueFormatter: (params) => formatDate(params.value),
      cellClass: "text-slate-650 dark:text-slate-305 text-sm font-bold flex items-center",
    },
    {
      headerName: "Questions",
      width: 120,
      cellRenderer: (params) => {
        const exam = params.data;
        if (exam.mode?.toLowerCase() === "online") {
          const examMcqs = mcqs.filter((m) => (m.examId?._id || m.examId) === exam._id);
          const examSqaDoc = sqas.find((s) => (s.examId?._id || s.examId) === exam._id);
          const sqaCount = examSqaDoc ? examSqaDoc.questions?.length || 0 : 0;
          const totalQuestionsCount = examMcqs.length + sqaCount;
          return (
            <div className="flex items-center justify-center h-full w-full">
              <Link
                href={`/admin/question-form?examId=${exam._id || exam.id}&launchCreate=true`}
                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all hover:scale-105 ${
                  totalQuestionsCount > 0
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {totalQuestionsCount} {totalQuestionsCount === 1 ? "Question" : "Questions"}
              </Link>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center h-full w-full text-slate-400 font-bold text-xs">
            -
          </div>
        );
      },
    },
    {
      headerName: "Result Status",
      field: "resultsPublished",
      width: 140,
      cellRenderer: (params) => {
        const exam = params.data;
        const isOnline = exam.mode?.toLowerCase() === "online";
        if (!isOnline) {
          return (
            <div className="flex items-center justify-center h-full w-full text-slate-400 font-bold text-xs">
              -
            </div>
          );
        }

        const isPublished = params.value || false;
        return (
          <div className="flex items-center justify-center h-full w-full">
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-black ${
                isPublished
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-450"
              }`}
            >
              {isPublished ? "Published" : "Draft / Hidden"}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Status",
      field: "status",
      width: 140,
      cellRenderer: (params) => {
        const exam = params.data;
        const expired = isExamExpired(exam);
        
        // If expired, it's always shown as Inactive
        const currentStatus = expired ? "Inactive" : (exam.status || "Active");

        const handleChangeStatus = async (newStatus) => {
          try {
            const targetId = exam._id || exam.id;
            await updateExamStatus(targetId, newStatus);
            refreshData();
          } catch (error) {
            console.error(error);
            alert("Failed to update status: " + error.message);
          }
        };

        return (
          <div className="flex items-center justify-center h-full w-full">
            {expired ? (
              <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-black bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                Expired (Inactive)
              </span>
            ) : (
              <button
                onClick={() => handleChangeStatus(currentStatus === "Active" ? "Inactive" : "Active")}
                className={`px-3 py-1 text-xs font-bold rounded-full border cursor-pointer transition-all duration-200 active:scale-95 ${
                  currentStatus === "Active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/40 dark:hover:bg-emerald-500/20"
                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-750"
                }`}
              >
                {currentStatus}
              </button>
            )}
          </div>
        );
      }
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const exam = params.data;
        const isOnline = exam.mode?.toLowerCase() === "online";
        return (
          <div className="flex items-center justify-center h-full gap-2">
            {isOnline && (
              <>
                <Link
                  href={`/admin/question-form?examId=${exam._id || exam.id}&launchCreate=true`}
                  className="rounded-xl bg-violet-50 p-2 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 dark:hover:text-white transition-all duration-200 active:scale-95"
                  title="Manage Questions"
                >
                  <BookOpenCheck size={16} />
                </Link>
                <Link
                  href={`/admin/exam-attempts?search=${encodeURIComponent(exam.examName)}`}
                  className="rounded-xl bg-indigo-50 p-2 text-indigo-750 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-200 active:scale-95"
                  title="View Attempts"
                >
                  <Award size={16} />
                </Link>
                <button
                  onClick={() => handlePublishToggle(exam)}
                  className={`rounded-xl p-2 transition-all duration-200 active:scale-95 cursor-pointer ${
                    exam.resultsPublished
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white"
                      : "bg-slate-105 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white"
                  }`}
                  title={exam.resultsPublished ? "Unpublish Results" : "Publish Results"}
                >
                  <Send size={16} />
                </button>
              </>
            )}

            <Link
              href={`/admin/exam-information/view/${exam.id}`}
              className="rounded-xl bg-sky-50 p-2 text-sky-655 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 active:scale-95"
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
              className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
              title="Delete Exam"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
      width: 260,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
        <AdminAgGrid
          rowData={exams}
          columnDefs={columnDefs}
          rowHeight={64}
        />
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
