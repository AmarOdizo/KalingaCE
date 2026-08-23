"use client";

import Link from "next/link";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import AdminAgGrid from "@/components/AdminAgGrid";

export default function NoteTable({ notes, onDelete }) {
  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      width: 90,
      valueFormatter: (params) => `#${params.value}`,
      cellClass: "font-semibold text-slate-800 dark:text-slate-100 flex items-center",
    },
    {
      headerName: "Thumbnail",
      field: "thumbnail",
      width: 100,
      cellRenderer: (params) => {
        const url = params.value?.url || "/no-image.png";
        return (
          <div className="flex items-center h-full">
            <Image
              src={url}
              alt={params.data.noteTitle}
              width={60}
              height={60}
              unoptimized
              className="h-14 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
            />
          </div>
        );
      },
      sortable: false,
      filter: false,
    },
    {
      headerName: "Subject",
      field: "subjectName",
      flex: 1,
      minWidth: 120,
      cellClass: "text-slate-700 dark:text-slate-305 flex items-center font-medium",
    },
    {
      headerName: "Note Title",
      field: "noteTitle",
      flex: 1.5,
      minWidth: 150,
      cellClass: "font-bold text-slate-900 dark:text-white flex items-center",
    },
    {
      headerName: "Uploaded By",
      field: "uploadedBy",
      flex: 1,
      minWidth: 120,
      cellClass: "text-slate-700 dark:text-slate-305 flex items-center font-medium",
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
        const note = params.data;
        return (
          <div className="flex items-center justify-center h-full gap-2 w-full">
            <Link
              href={`/admin/available-notes/view/${note.id}`}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              View
            </Link>

            <Link
              href={`/admin/available-notes/edit/${note.id}`}
              className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete(note.id)}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        );
      },
      width: 240,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <>
      {/* ================= Mobile Card View ================= */}
      <div className="space-y-4 md:hidden">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-start gap-4">
              <Image
                src={note.thumbnail?.url || "/no-image.png"}
                alt={note.noteTitle}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                  {note.noteTitle}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {note.subjectName}
                </p>

                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Uploaded By:</span>{" "}
                  {note.uploadedBy}
                </p>

                <div className="mt-2">
                  <StatusBadge status={note.status} />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Link
                href={`/admin/available-notes/view/${note.id}`}
                className="rounded-lg bg-blue-600 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                View
              </Link>

              <Link
                href={`/admin/available-notes/edit/${note.id}`}
                className="rounded-lg bg-yellow-500 py-2 text-center text-sm font-medium text-white hover:bg-yellow-600"
              >
                Edit
              </Link>

              <button
                onClick={() => onDelete(note.id)}
                className="rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= Tablet/Desktop Table ================= */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 md:block">
        <AdminAgGrid
          rowData={notes}
          columnDefs={columnDefs}
          rowHeight={64}
        />
      </div>
    </>
  );
}
