"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { calculatePercentage, calculateGrade } from "../utils";
import AdminAgGrid from "@/components/AdminAgGrid";

export default function StudentTable({ students, onDelete }) {
  const columnDefs = [
    {
      headerName: "Image",
      field: "image",
      width: 90,
      cellRenderer: (params) => {
        const src = params.value || "https://placehold.co/80x80?text=Student";
        return (
          <div className="flex items-center h-full">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 shadow-sm relative transition-transform duration-300 hover:scale-105">
              <img
                src={src}
                alt={params.data.name}
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
      headerName: "Name",
      field: "name",
      flex: 1,
      cellClass: "font-bold text-slate-800 dark:text-slate-100 flex items-center",
    },
    {
      headerName: "Subject",
      field: "subject",
      flex: 1,
      cellClass: "text-slate-600 dark:text-slate-350 text-sm font-semibold flex items-center",
    },
    {
      headerName: "Batch",
      field: "batch",
      flex: 1,
      cellClass: "text-slate-600 dark:text-slate-350 text-sm font-semibold flex items-center",
    },
    {
      headerName: "Marks",
      valueGetter: (params) => `${params.data.gainMark} / ${params.data.totalMark}`,
      width: 120,
      cellClass: "text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center",
    },
    {
      headerName: "% Score",
      valueGetter: (params) => calculatePercentage(params.data.gainMark, params.data.totalMark),
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {params.value}%
          </span>
        </div>
      ),
      width: 110,
    },
    {
      headerName: "Grade",
      valueGetter: (params) => {
        const pct = calculatePercentage(params.data.gainMark, params.data.totalMark);
        return calculateGrade(Number(pct));
      },
      cellRenderer: (params) => {
        const grade = params.value;
        return (
          <div className="flex items-center h-full">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
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
          </div>
        );
      },
      width: 100,
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full gap-2">
          <Link
            href={`/admin/topper-student/view/${params.data.id}`}
            className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-200 active:scale-95"
            title="View Details"
          >
            <Eye size={16} />
          </Link>

          <Link
            href={`/admin/topper-student/edit/${params.data.id}`}
            className="rounded-xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-200 active:scale-95"
            title="Edit Student"
          >
            <Pencil size={16} />
          </Link>

          <button
            onClick={() => onDelete(params.data)}
            className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
            title="Delete Student"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: 150,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
      <AdminAgGrid
        rowData={students}
        columnDefs={columnDefs}
        rowHeight={56}
      />
    </div>
  );
}
