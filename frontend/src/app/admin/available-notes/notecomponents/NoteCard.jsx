"use client";

import Image from "next/image";

import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils";

export default function NoteCard({ note }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-700 sm:px-6">
        <h2 className="break-words text-xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
          {note.noteTitle}
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          {note.subjectName}
        </p>
      </div>

      {/* Thumbnail */}
      <div className="overflow-hidden">
        <Image
          src={note.thumbnail?.url || "/no-image.png"}
          alt={note.noteTitle}
          width={600}
          height={350}
          unoptimized
          className="h-52 w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-64 lg:h-80"
        />
      </div>

      {/* Content */}
      <div className="space-y-6 p-5 sm:p-6">
        {/* Subject & Uploaded By */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>

            <p className="mt-1 break-words font-semibold text-gray-900 dark:text-white">
              {note.subjectName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Uploaded By
            </p>

            <p className="mt-1 break-words font-semibold text-gray-900 dark:text-white">
              {note.uploadedBy}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Description
          </p>

          <p className="mt-2 whitespace-pre-line leading-7 text-gray-700 dark:text-gray-300">
            {note.description || "-"}
          </p>
        </div>

        {/* Status & ID */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>

            <div className="mt-2">
              <StatusBadge status={note.status} />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Note ID</p>

            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
              #{note.id}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created At
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {formatDate(note.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updated At
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {formatDate(note.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
