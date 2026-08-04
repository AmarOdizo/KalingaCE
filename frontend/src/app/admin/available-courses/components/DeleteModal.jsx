"use client";

import { TriangleAlert } from "lucide-react";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-red-100 p-4">
            <TriangleAlert className="h-10 w-10 text-red-600" />
          </div>

          <h2 className="mt-5 text-2xl font-bold">Delete Course</h2>

          <p className="mt-2 text-center text-gray-500">
            Are you sure you want to delete this course? This action cannot be
            undone.
          </p>

          <div className="mt-6 flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
