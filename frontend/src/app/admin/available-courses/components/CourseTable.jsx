"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatFees, getCourseImage } from "../utils";
import AdminAgGrid from "@/components/AdminAgGrid";

export default function CourseTable({ courses, onDelete, onView }) {
  const columnDefs = [
    {
      headerName: "Image",
      field: "image",
      width: 90,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm relative">
            <Image
              src={getCourseImage(params.value)}
              alt={params.data.courseName}
              width={48}
              height={48}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        </div>
      ),
      sortable: false,
      filter: false,
    },
    {
      headerName: "Course",
      field: "courseName",
      flex: 1.5,
      cellClass: "font-bold text-slate-800 dark:text-slate-100 flex items-center",
    },
    {
      headerName: "Code",
      field: "courseCode",
      flex: 1,
      cellClass: "text-slate-550 dark:text-slate-400 text-sm font-semibold flex items-center",
    },
    {
      headerName: "Duration",
      field: "duration",
      flex: 1,
      cellClass: "text-slate-550 dark:text-slate-400 text-sm font-semibold flex items-center",
    },
    {
      headerName: "Fees",
      field: "fees",
      flex: 1,
      valueFormatter: (params) => formatFees(params.value),
      cellClass: "text-slate-900 dark:text-slate-100 text-sm font-bold flex items-center",
    },
    {
      headerName: "Students",
      field: "students",
      width: 110,
      valueFormatter: (params) => `${params.value}+`,
      cellClass: "text-slate-550 dark:text-slate-400 text-sm font-semibold flex items-center",
    },
    {
      headerName: "Status",
      field: "status",
      width: 110,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <StatusBadge status={params.value} />
        </div>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const course = params.data;
        return (
          <div className="flex items-center justify-center h-full gap-2 w-full">
            <button
              onClick={() => onView(course)}
              className="rounded-lg bg-primary-50 p-2 text-primary-650 dark:bg-primary-500/10 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-colors cursor-pointer"
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
        );
      },
      width: 150,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-md">
      <AdminAgGrid
        rowData={courses}
        columnDefs={columnDefs}
        rowHeight={64}
      />
    </div>
  );
}
