"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X,
  CalendarDays,
  Clock3,
  MapPin,
  Timer,
  Layers3,
} from "lucide-react";

const parseExamStart = (examDate, examTime) => {
  try {
    const d = new Date(examDate);
    const timeStr = examTime || "00:00";
    let hours = 0;
    let minutes = 0;
    
    if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
      const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
      if (match) {
        hours = Number(match[1]);
        minutes = Number(match[2]);
        const ampm = match[3].toLowerCase();
        if (ampm === "pm" && hours < 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
      }
    } else {
      const parts = timeStr.split(":");
      hours = Number(parts[0]) || 0;
      minutes = Number(parts[1]) || 0;
    }
    
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes, 0);
  } catch (err) {
    console.error("Error parsing start time", err);
    return new Date();
  }
};

const parseDurationMinutes = (durationStr) => {
  try {
    const str = (durationStr || "").toLowerCase();
    const num = parseFloat(str) || 0;
    if (str.includes("minute")) {
      return num;
    }
    if (str.includes("hour")) {
      return num * 60;
    }
    return 60;
  } catch (err) {
    console.error("Error parsing duration", err);
    return 60;
  }
};

export default function ExamModal({ exam, onClose }) {
  const router = useRouter();
  const [timeStatus, setTimeStatus] = useState("checking"); // "checking", "NOT_STARTED", "ACTIVE", "EXPIRED"
  const [timeRemainingText, setTimeRemainingText] = useState("");

  useEffect(() => {
    if (!exam) return;

    const calculateTimeStatus = () => {
      if (exam.mode !== "Online") {
        setTimeStatus("OFFLINE");
        return;
      }
      try {
        const startDateTime = parseExamStart(exam.examDate, exam.examTime);
        const durationMinutes = parseDurationMinutes(exam.duration);
        const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);
        
        const now = new Date();
        
        if (now < startDateTime) {
          setTimeStatus("NOT_STARTED");
          const diffMs = startDateTime - now;
          const diffHours = Math.floor(diffMs / (3600 * 1000));
          const diffMins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
          const diffSecs = Math.floor((diffMs % (60 * 1000)) / 1000);
          
          if (diffHours > 24) {
            const examDateFormatted = new Date(exam.examDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            setTimeRemainingText(`on ${examDateFormatted} at ${exam.examTime}`);
          } else {
            const hStr = diffHours > 0 ? `${diffHours}h ` : "";
            const mStr = diffMins > 0 ? `${diffMins}m ` : "";
            setTimeRemainingText(`starts in ${hStr}${mStr}${diffSecs}s`);
          }
        } else if (now > endDateTime) {
          setTimeStatus("EXPIRED");
          setTimeRemainingText("");
        } else {
          setTimeStatus("ACTIVE");
          const diffMs = endDateTime - now;
          const diffHours = Math.floor(diffMs / (3600 * 1000));
          const diffMins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
          const diffSecs = Math.floor((diffMs % (60 * 1000)) / 1000);
          
          const hStr = diffHours > 0 ? `${diffHours}h ` : "";
          const mStr = diffMins > 0 ? `${diffMins}m ` : "";
          setTimeRemainingText(`closes in ${hStr}${mStr}${diffSecs}s`);
        }
      } catch (err) {
        console.error(err);
        setTimeStatus("ACTIVE");
      }
    };

    calculateTimeStatus();
    const interval = setInterval(calculateTimeStatus, 1000);
    return () => clearInterval(interval);
  }, [exam]);

  if (!exam) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg transition hover:bg-red-500 hover:text-white dark:bg-gray-800"
        >
          <X size={22} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left Image */}
          <div className="relative h-[300px] md:h-full min-h-[400px]">
            <Image
              src={exam.image || "/no-image.png"}
              alt={exam.examName}
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="p-8">
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {exam.examName}
            </h2>

            <div className="mt-8 space-y-5">

              <div className="flex items-center gap-3">
                <Layers3 className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Batch</p>
                  <p className="font-semibold">
                    {Array.isArray(exam.batch)
                      ? exam.batch.join(", ")
                      : exam.batch}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="text-green-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Exam Date</p>
                  <p className="font-semibold">
                    {new Date(exam.examDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock3 className="text-orange-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Exam Time</p>
                  <p className="font-semibold">{exam.examTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Timer className="text-red-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">{exam.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-pink-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-semibold">{exam.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Exam Mode</p>
                  <p className="font-semibold">{exam.mode || "Offline"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {timeStatus === "OFFLINE" && (
                <div className="w-full text-center text-sm font-semibold text-slate-500 py-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 px-4">
                  Offline Exam: Online testing is not available. Only institute students can take this exam at the institute.
                </div>
              )}

              {timeStatus === "NOT_STARTED" && (
                <button
                  disabled
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3.5 px-4 font-bold text-slate-400 dark:text-slate-500 cursor-not-allowed flex flex-col items-center justify-center gap-0.5"
                >
                  <span className="text-sm">Exam Not Started Yet</span>
                  <span className="text-xs font-semibold text-slate-500">
                    Starts {timeRemainingText}
                  </span>
                </button>
              )}

              {timeStatus === "ACTIVE" && (
                <button
                  onClick={() => {
                    router.push(`/learning/mcq?examId=${exam._id || exam.id}`);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 px-4 font-bold text-white shadow-md active:scale-95 transition cursor-pointer flex flex-col items-center justify-center gap-0.5"
                >
                  <span className="text-sm">Start Exam</span>
                  <span className="text-xs font-semibold text-indigo-200/90">
                    Active ({timeRemainingText})
                  </span>
                </button>
              )}

              {timeStatus === "EXPIRED" && (
                <button
                  disabled
                  className="w-full rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 py-3.5 px-4 font-bold text-red-500/80 cursor-not-allowed text-center text-sm"
                >
                  Exam Expired / Completed
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 px-4 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-center text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
