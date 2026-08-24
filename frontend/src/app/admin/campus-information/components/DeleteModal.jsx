"use client";

import { TriangleAlert } from "lucide-react";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  campusName = "",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
          <TriangleAlert className="h-8 w-8" />
        </div>

        {/* Title */}
        <h2 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Delete Branch
        </h2>

        {/* Message */}
        <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Are you sure you want to delete
          <span className="font-semibold text-slate-900 dark:text-white">
            {" "}
            {campusName || "this branch"}{" "}
          </span>
          ?
        </p>

        <p className="mt-1 text-center text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary py-2 px-5 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2 font-semibold text-white transition-all duration-300 hover:from-red-700 hover:to-rose-700 hover:shadow-lg active:scale-95 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
