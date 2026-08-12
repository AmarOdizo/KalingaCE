"use client";

import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { uploadFile } from "../data";

export default function UploadPDF({ value, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    try {
      setUploading(true);

      const result = await uploadFile(file);

      onUpload(result);
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex justify-center sm:justify-start">
        {value?.url ? (
          <div className="flex h-40 w-40 flex-col items-center justify-center rounded-2xl border border-emerald-250 bg-emerald-50/50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950/20 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
            <FileText size={36} className="mb-2 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">PDF Uploaded</span>
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-[10px] font-semibold text-blue-605 underline dark:text-blue-400 truncate max-w-full block"
              title="View PDF"
            >
              View Document
            </a>
          </div>
        ) : (
          <div className="flex h-40 w-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
            <Upload size={36} className="mb-2" />
            <span className="text-sm font-medium">No PDF File</span>
          </div>
        )}
      </div>

      {/* Upload Input */}
      <div>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="
            block w-full cursor-pointer rounded-xl
            border border-gray-300
            bg-white
            p-3
            text-sm text-gray-700
            file:mr-4
            file:rounded-lg
            file:border-0
            file:bg-blue-600
            file:px-4
            file:py-2
            file:text-sm
            file:font-medium
            file:text-white
            hover:file:bg-blue-700

            dark:border-gray-700
            dark:bg-gray-900
            dark:text-gray-300
            dark:file:bg-blue-500
            dark:hover:file:bg-blue-600
          "
        />
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400"></div>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Uploading PDF...
          </p>
        </div>
      )}
    </div>
  );
}
