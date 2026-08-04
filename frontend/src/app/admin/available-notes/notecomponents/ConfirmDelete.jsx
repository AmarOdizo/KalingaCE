"use client";

export default function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:px-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
            Delete Note
          </h2>
        </div>

        {/* Body */}
        <div className="px-5 py-6 sm:px-6">
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
            Are you sure you want to delete{" "}
            <span className="break-words font-semibold text-red-600 dark:text-red-400">
              {noteTitle}
            </span>
            ?
          </p>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-700 sm:flex-row sm:justify-end sm:px-6">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:w-auto"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
