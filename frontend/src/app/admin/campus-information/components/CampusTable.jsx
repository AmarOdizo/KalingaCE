"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, Users, GraduationCap, MapPin, Phone } from "lucide-react";
import AdminAgGrid from "@/components/AdminAgGrid";

export default function CampusTable({
  campuses = [],
  onDelete,
  onSetMain,
  deleting = false,
}) {
  if (!campuses.length) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900/50 p-10 text-center border border-slate-200/80 dark:border-slate-800/80 shadow-premium">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-350">
          No Branch Information Found
        </h2>
        <p className="mt-1 text-sm text-slate-400">Add a new branch to get started.</p>
      </div>
    );
  }

  const columnDefs = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      cellClass: "text-center text-slate-400 font-mono text-xs flex items-center justify-center",
      sortable: false,
      filter: false,
    },
    {
      headerName: "Branch Name",
      field: "campusName",
      flex: 1.5,
      minWidth: 160,
      cellClass: "font-bold text-slate-900 dark:text-white flex items-center",
    },
    {
      headerName: "City",
      field: "city",
      flex: 1,
      minWidth: 120,
      cellClass: "text-slate-600 dark:text-slate-300 flex items-center",
    },
    {
      headerName: "Phone",
      field: "phone",
      flex: 1,
      minWidth: 120,
      cellClass: "text-slate-600 dark:text-slate-355 font-mono text-xs flex items-center",
    },
    {
      headerName: "Faculty",
      valueGetter: (params) => {
        const campus = params.data;
        return Array.isArray(campus.Totalfaculty)
          ? campus.Totalfaculty[0]
          : campus.Totalfaculty;
      },
      width: 90,
      cellClass: "text-center text-slate-700 dark:text-slate-300 flex items-center justify-center font-semibold",
    },
    {
      headerName: "Students",
      valueGetter: (params) => {
        const campus = params.data;
        return Array.isArray(campus.TotalAvailableStudent)
          ? campus.TotalAvailableStudent[0]
          : campus.TotalAvailableStudent;
      },
      width: 100,
      cellClass: "text-center text-slate-700 dark:text-slate-300 flex items-center justify-center font-semibold",
    },
    {
      headerName: "Status",
      field: "status",
      width: 100,
      cellRenderer: (params) => {
        const status = params.value;
        const isActive = status === "Active";
        return (
          <div className="flex items-center h-full">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${
                isActive
                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                  : "bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Main Branch",
      field: "isMain",
      width: 140,
      cellRenderer: (params) => {
        const campus = params.data;
        return (
          <div className="flex items-center justify-center h-full">
            {campus.isMain ? (
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 text-indigo-750 dark:text-indigo-400 px-2.5 py-1 text-xs font-bold border border-indigo-500/20 shadow-sm">
                Main Branch
              </span>
            ) : (
              <button
                onClick={() => onSetMain && onSetMain(campus)}
                className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-105 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 transition rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Set Main
              </button>
            )}
          </div>
        );
      },
      sortable: false,
      filter: false,
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const campus = params.data;
        return (
          <div className="flex items-center justify-center h-full gap-1.5 w-full">
            <Link
              href={`/admin/campus-information/view/${campus._id}`}
              className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/80 transition"
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
        );
      },
      width: 140,
      sortable: false,
      filter: false,
    },
  ];

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
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-955 dark:text-white text-lg">
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

              <div className="flex justify-end gap-2 pt-1">
                {campus.isMain ? (
                  <span className="inline-flex items-center rounded-full bg-indigo-500/10 text-indigo-750 dark:text-indigo-400 px-2.5 py-1 text-xs font-bold border border-indigo-500/20 shadow-sm mr-auto">
                    Main Branch
                  </span>
                ) : (
                  <button
                    onClick={() => onSetMain && onSetMain(campus)}
                    className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-350 bg-slate-105 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer mr-auto"
                  >
                    Set Main
                  </button>
                )}
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
        <AdminAgGrid
          rowData={campuses}
          columnDefs={columnDefs}
          rowHeight={52}
        />
      </div>
    </div>
  );
}
