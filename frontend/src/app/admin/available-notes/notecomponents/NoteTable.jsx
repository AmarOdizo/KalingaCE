"use client";

import Link from "next/link";
import Image from "next/image";

import StatusBadge from "./StatusBadge";

export default function NoteTable({ notes, onDelete }) {
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
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 md:block">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                ID
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Thumbnail
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Subject
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Note Title
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Uploaded By
              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Status
              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {notes.map((note) => (
              <tr
                key={note.id}
                className="border-t border-gray-200 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-4 dark:text-white">#{note.id}</td>

                <td className="px-4 py-4">
                  <Image
                    src={note.thumbnail?.url || "/no-image.png"}
                    alt={note.noteTitle}
                    width={60}
                    height={60}
                    unoptimized
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                </td>

                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                  {note.subjectName}
                </td>

                <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                  {note.noteTitle}
                </td>

                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                  {note.uploadedBy}
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={note.status} />
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/admin/available-notes/view/${note.id}`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/available-notes/edit/${note.id}`}
                      className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => onDelete(note.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
