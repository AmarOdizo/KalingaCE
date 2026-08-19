"use client";

import Image from "next/image";
import { UploadCloud } from "lucide-react";

export default function ImageUpload({ preview, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-350 block">Course Image</label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition-all duration-200 hover:border-primary-500 hover:bg-white dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/60 dark:hover:border-primary-500 relative min-h-[160px]">
        {preview ? (
          <div className="relative group">
            <Image
              src={preview}
              alt="Course Preview"
              width={260}
              height={160}
              unoptimized
              className="rounded-xl object-cover border border-slate-200/60 dark:border-slate-800/60 shadow-sm"
            />
            <div className="absolute inset-0 bg-slate-950/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
              <UploadCloud className="h-8 w-8 text-white animate-bounce" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <UploadCloud className="mx-auto mb-3 h-10 w-10 text-slate-400 dark:text-slate-500" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Click to Upload Image</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG or WebP up to 5MB</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
