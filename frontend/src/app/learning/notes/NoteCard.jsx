"use client";

import Image from "next/image";

export default function NoteCard({ note, onView }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
      {/* Thumbnail */}
      <div className="relative h-52 w-full">
        <Image
          src={note.thumbnail?.url || "/images/no-image.png"}
          alt={note.noteTitle}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Subject */}
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          {note.subjectName}
        </span>

        {/* Title */}
        <h2 className="mt-3 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
          {note.noteTitle}
        </h2>

        {/* Description */}
        <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
          {note.description}
        </p>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Uploaded By</p>

            <p className="text-sm font-semibold">{note.uploadedBy}</p>
          </div>

          <button
            onClick={() => onView(note)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
