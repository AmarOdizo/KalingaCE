"use client";

import Image from "next/image";
import { Eye, Calendar, BookOpen, Clock, MapPin, ClipboardList } from "lucide-react";

export default function ExamCard({ exam, onView }) {
  // Format the exam date
  const examDateObj = exam.examDate ? new Date(exam.examDate) : null;
  const formattedDate = examDateObj
    ? examDateObj.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // Calculate a registration deadline (e.g., 2 days before the exam date)
  const deadlineDate = examDateObj
    ? new Date(examDateObj.getTime() - 2 * 24 * 60 * 60 * 1000)
    : null;
  const formattedDeadline = deadlineDate
    ? deadlineDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Closed";

  // Determine if online or offline mode based on venue
  const isOnline = exam.venue?.toLowerCase()?.includes("online");
  const examMode = isOnline ? "Online" : "Offline";

  // Get status badge colors
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return {
          bg: "bg-emerald-500/90 text-white dark:bg-emerald-500/20 dark:text-emerald-450",
          label: "Ongoing",
          dot: "bg-emerald-300 animate-ping",
        };
      case "completed":
        return {
          bg: "bg-slate-500/95 text-white dark:bg-slate-800/80 dark:text-slate-400",
          label: "Completed",
          dot: "bg-slate-400",
        };
      case "upcoming":
      default:
        return {
          bg: "bg-blue-600/95 text-white dark:bg-blue-500/20 dark:text-blue-400",
          label: "Upcoming",
          dot: "bg-blue-300 animate-pulse",
        };
    }
  };

  const statusConfig = getStatusConfig(exam.status);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-premium transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-hover dark:border-slate-800/60 dark:bg-slate-900/60 backdrop-blur-md">
      {/* Banner / Hero Image */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-[24px] bg-slate-100 dark:bg-slate-950/40 select-none">
        <Image
          src={exam.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"}
          alt={exam.examName}
          fill
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
          unoptimized
        />
        
        {/* Soft shadow overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Status Badge */}
        <div className={`absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-md tracking-wide backdrop-blur-sm ${statusConfig.bg}`}>
          <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-4">
          {/* Exam Name */}
          <h3 className="line-clamp-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {exam.examName || "Untitled Examination"}
          </h3>

          {/* Short Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {exam.description || "No description available for this examination. Please check course guidelines for details."}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 pt-2 text-sm font-semibold text-slate-600 dark:text-slate-350">
            {/* Course */}
            <div className="flex items-center gap-2.5">
              <BookOpen size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate">{exam.course || "General"}</span>
            </div>

            {/* Exam Mode */}
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{examMode} ({exam.venue || "Campus"})</span>
            </div>

            {/* Exam Date */}
            <div className="flex items-center gap-2.5">
              <Calendar size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-amber-500 dark:text-amber-450 shrink-0" />
              <span className="truncate">{exam.duration || "2 Hours"}</span>
            </div>
          </div>

          {/* Registration Deadline banner */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-100/50 dark:border-slate-800/30">
            <ClipboardList size={14} className="text-rose-500 dark:text-rose-400" />
            <span>Registration Deadline: <strong className="text-rose-600 dark:text-rose-450">{formattedDeadline}</strong></span>
          </div>
        </div>

        {/* Divider and Actions */}
        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
          <button
            onClick={onView}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 px-4 font-bold text-white shadow-premium transition hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <Eye size={18} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
