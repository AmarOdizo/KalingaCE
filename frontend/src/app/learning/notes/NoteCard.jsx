"use client";

import Image from "next/image";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

export default function NoteCard({ note, onView }) {
  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Uploaded";

  return (
    <div 
      className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          <Image
            src={note.thumbnail?.url || "/images/no-image.png"}
            alt={note.noteTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Tag on Thumbnail */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1 rounded-xl bg-white/90 dark:bg-slate-900/90 px-3 py-1 text-2xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 backdrop-blur-xs shadow-xs border border-slate-100 dark:border-slate-800">
              {note.subjectName}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5.5 space-y-3">
          {/* Title */}
          <h3 className="line-clamp-2 text-lg font-black text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-snug">
            {note.noteTitle}
          </h3>

          {/* Description */}
          <p className="line-clamp-3 text-xs font-semibold text-slate-455 dark:text-slate-400 leading-relaxed">
            {note.description || "No description provided for this study guide."}
          </p>
        </div>
      </div>

      {/* Footer Info & View Button */}
      <div className="p-5.5 pt-0 mt-auto">
        <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-2xs text-slate-400 font-bold">
            <span className="flex items-center gap-1">
              <User size={12} className="text-slate-400" />
              <span>By {note.uploadedBy}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" />
              <span>{formattedDate}</span>
            </span>
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => onView(note)}
            className="w-full rounded-2xl bg-slate-50 group-hover:bg-blue-600 py-3 text-xs font-extrabold text-slate-700 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98 dark:bg-slate-850 dark:text-slate-300"
          >
            <BookOpen size={13} />
            <span>Read Study Guide</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
