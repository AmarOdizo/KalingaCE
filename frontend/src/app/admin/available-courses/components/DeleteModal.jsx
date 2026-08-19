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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="w-full max-w-md rounded-2xl bg-white/95 border border-slate-200/80 p-6 shadow-premium dark:bg-slate-900/95 dark:border-slate-800/80 backdrop-blur-md">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-rose-50 p-4 dark:bg-rose-500/10">
            <TriangleAlert className="h-10 w-10 text-rose-600 dark:text-rose-400" />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white">Delete Course</h2>

          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to delete this course? This action is permanent and cannot be undone.
          </p>

          <div className="mt-6 flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 btn-secondary text-sm !py-2.5 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-rose-600 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95 shadow-sm shadow-rose-500/15 cursor-pointer"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
