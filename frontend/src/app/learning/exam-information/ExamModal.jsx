"use client";

import Image from "next/image";
import {
  X,
  CalendarDays,
  Clock3,
  BookOpen,
  GraduationCap,
  MapPin,
  Timer,
  Layers3,
} from "lucide-react";

export default function ExamModal({ exam, onClose }) {
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
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              {exam.status}
            </span>

            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {exam.examName}
            </h2>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-semibold">{exam.course}</p>
                </div>
              </div>

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
                <GraduationCap className="text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-semibold">
                    {exam.description || "No description available."}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-10 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
