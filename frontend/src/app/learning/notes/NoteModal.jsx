"use client";

import Image from "next/image";

export default function NoteModal({ open, note, onClose }) {
  if (!open || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
          ✕
        </button>

        <div className="grid gap-8 p-6 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            <div className="overflow-hidden rounded-xl border">
              <Image
                src={note.thumbnail?.url || "/images/no-image.png"}
                alt={note.noteTitle}
                width={700}
                height={450}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* Right Side */}
          <div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {note.subjectName}
            </span>

            <h2 className="mt-4 text-3xl font-bold">{note.noteTitle}</h2>

            <p className="mt-5 leading-8 text-gray-600 dark:text-gray-400">
              {note.description}
            </p>

            <div className="mt-6 space-y-2">
              <p>
                <span className="font-semibold">Uploaded By :</span>{" "}
                {note.uploadedBy}
              </p>

              <p>
                <span className="font-semibold">Status :</span>{" "}
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    note.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {note.status}
                </span>
              </p>
            </div>

            {/* PDF Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={note.pdf?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
              >
                Preview PDF
              </a>

              <a
                href={note.pdf?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-5 py-3 text-white"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
