"use client";

import { Trash2 } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm, student }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Trash2 size={32} className="text-red-600" />
        </div>

        <h2 className="text-center text-2xl font-bold">Delete Student</h2>

        <p className="mt-3 text-center text-gray-500">
          Are you sure you want to delete
          <span className="font-semibold"> {student?.name}</span>?
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border py-3 font-semibold hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
