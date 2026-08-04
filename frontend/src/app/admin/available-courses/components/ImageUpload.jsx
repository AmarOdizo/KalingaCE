"use client";

import Image from "next/image";
import { UploadCloud } from "lucide-react";

export default function ImageUpload({ preview, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">Course Image</label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 transition hover:border-blue-500">
        {preview ? (
          <Image
            src={preview}
            alt="Course"
            width={250}
            height={180}
            className="rounded-lg object-cover"
          />
        ) : (
          <>
            <UploadCloud className="mb-3 h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-500">Click to Upload Image</p>
          </>
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
