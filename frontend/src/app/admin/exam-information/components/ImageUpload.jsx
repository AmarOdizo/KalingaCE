"use client";

import { Camera, UploadCloud, X } from "lucide-react";

export default function ImageUpload({
  preview,
  uploading,
  onFileSelect,
  onRemove,
}) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onFileSelect(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-705 dark:text-slate-300">
        Exam Banner / Poster
      </label>

      <div className="rounded-2xl border-2 border-dashed border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-300 hover:border-primary-500 hover:bg-primary-50/10 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-primary-500 dark:hover:bg-primary-500/5">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="examImage"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-6">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent dark:border-primary-400 dark:border-t-transparent" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
              Uploading image to server...
            </p>
          </div>
        ) : !preview ? (
          <label
            htmlFor="examImage"
            className="flex cursor-pointer flex-col items-center justify-center gap-3 py-4"
          >
            <div className="rounded-2xl bg-primary-50 p-4 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400 transition-colors">
              <UploadCloud size={32} />
            </div>

            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Click to Upload Image
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              JPG, PNG, JPEG (Max 5MB)
            </p>
          </label>
        ) : (
          <div className="relative mx-auto h-48 w-full max-w-md">
            <img
              src={preview}
              alt="Preview"
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 object-cover w-full h-full shadow-premium"
            />

            <button
              type="button"
              onClick={onRemove}
              className="absolute -right-2 -top-2 rounded-xl bg-rose-600 p-2 text-white shadow-premium hover:bg-rose-700 transition-all active:scale-90 cursor-pointer"
            >
              <X size={16} />
            </button>

            <label
              htmlFor="examImage"
              className="absolute bottom-3 right-3 cursor-pointer rounded-xl bg-primary-600 p-2.5 text-white shadow-premium hover:bg-primary-700 transition-all active:scale-90"
            >
              <Camera size={16} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
