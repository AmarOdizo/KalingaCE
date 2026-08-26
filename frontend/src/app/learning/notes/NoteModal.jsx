"use client";

import Image from "next/image";
import { X, Calendar, User, FileText, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { saveAs } from "file-saver";

export default function NoteModal({ open, note, onClose }) {
  if (!open || !note) return null;

  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Uploaded";

  const handleDownload = async () => {
    if (!note.pdf?.url) return;
    try {
      // Use saveAs to trigger direct browser download file transfer
      saveAs(note.pdf.url, `${note.noteTitle || "Study_Guide"}.pdf`);
    } catch (error) {
      console.error("Failed to download PDF via file-saver:", error);
      // Fallback
      window.open(note.pdf.url, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-350 ease-out">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 rounded-xl border border-slate-200/80 bg-white/90 p-2 text-slate-500 hover:bg-slate-50 cursor-pointer dark:border-slate-850 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors duration-200 shadow-sm active:scale-95"
        >
          <X size={16} />
        </button>

        {/* Left Side: Thumbnail Preview */}
        <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-950/60 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-850">
          <div className="relative w-full aspect-[4/3] md:aspect-[3/4] max-h-[350px] md:max-h-none rounded-2xl overflow-hidden border border-slate-200/60 shadow-md">
            <Image
              src={note.thumbnail?.url || "/images/no-image.png"}
              alt={note.noteTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
          <div className="space-y-5">
            {/* Category / Subject Badge */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 text-2xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {note.subjectName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 text-2xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={10} /> Verified
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-slate-850 dark:text-white leading-tight">
              {note.noteTitle}
            </h2>

            {/* Metadata Fields */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploaded By</span>
                <span className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                  <User size={12} className="text-blue-500" />
                  {note.uploadedBy}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Release Date</span>
                <span className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                  <Calendar size={12} className="text-blue-500" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overview / Synopsis</span>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
                {note.description || "No overview available for this resource. Learn key concepts, check review questions, and download the full material using the buttons below."}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row gap-3">
            <a
              href={note.pdf?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs font-extrabold text-slate-700 hover:bg-slate-55 hover:text-slate-900 transition dark:border-slate-850 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 shadow-xs cursor-pointer active:scale-98"
            >
              <ExternalLink size={13} />
              Preview PDF
            </a>

            <button
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 py-3 px-4 text-xs font-extrabold text-white hover:bg-blue-700 transition shadow-sm cursor-pointer active:scale-98"
            >
              <Download size={13} />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
