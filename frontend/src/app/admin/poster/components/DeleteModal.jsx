"use client";

import { Trash2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="w-[420px] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium dark:border-slate-800 dark:bg-slate-900/90 transition-all duration-300">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-450">
          <Trash2 size={24} />
        </div>

        <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white">
          Delete Poster
        </h2>

        <p className="mt-3 text-center text-slate-500 dark:text-slate-400 text-sm">
          Are you sure you want to delete this poster? This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-secondary flex-1 py-3 text-sm cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.25)] transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
