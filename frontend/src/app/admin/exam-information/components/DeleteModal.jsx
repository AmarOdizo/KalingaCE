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
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <TriangleAlert size={36} className="text-red-600" />
          </div>
        </div>

        <h2 className="mt-5 text-center text-xl font-bold">
          Delete Exam Information
        </h2>

        <p className="mt-2 text-center text-gray-500">
          This action cannot be undone.
          <br />
          Are you sure you want to continue?
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
