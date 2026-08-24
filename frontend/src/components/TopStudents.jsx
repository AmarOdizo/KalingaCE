"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Award,
  Star,
  BookOpen,
  Calendar,
  Percent,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const API_URL =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api/Student"
    : "https://kalingace-4.onrender.com/api/Student";

export default function TopStudents() {
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const loadStudents = async () => {
    try {
      const res = await axios.get(API_URL);

      if (res.data && res.data.data && res.data.data.length > 0) {
        let topperStudents = res.data.data
          .filter((student) => {
            const isTopperPublished = student.published !== false;
            const isExamPublished = !student.examId || student.examId.resultsPublished === true;
            return isTopperPublished && isExamPublished;
          })
          .map((student) => ({
            ...student,
            percentage:
              student.totalMark > 0
                ? ((student.gainMark / student.totalMark) * 100).toFixed(2)
                : 0,
          }));

        // Try filtering by current year first
        const presentYear = new Date().getFullYear().toString();
        const currentYearToppers = topperStudents.filter((student) =>
          (student.batch || "").toString().includes(presentYear)
        );

        if (currentYearToppers.length > 0) {
          topperStudents = currentYearToppers;
        }

        topperStudents.sort((a, b) => b.percentage - a.percentage);
        setStudents(topperStudents);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.log("API connection failed:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleViewProfile = async (id) => {
    console.log("Clicked ID:", id);

    // Try to find the student in the local state first
    const localStudent = students.find(
      (s) => String(s.id) === String(id) || String(s._id) === String(id),
    );

    if (localStudent) {
      setSelectedStudent(localStudent);
      setOpen(true);
      return;
    }

    // Fallback to fetching from API if not found in local state (safety net)
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      if (res.data && res.data.data) {
        const student = res.data.data;
        // recalculate percentage if missing
        student.percentage =
          student.totalMark > 0
            ? ((student.gainMark / student.totalMark) * 100).toFixed(2)
            : 0;
        setSelectedStudent(student);
        setOpen(true);
      }
    } catch (error) {
      console.log("Failed to fetch student profile from API:", error);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-semibold text-slate-500 dark:text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mb-4" />
        Loading Toppers...
      </div>
    );
  }

  if (students.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-white to-slate-100 py-16 dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              <span className="gradient-text">Top Students</span>
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl">
              Meet our outstanding learners who achieved excellence and set
              academic milestones.
            </p>
          </div>

          {students.length > 4 && (
            <div className="flex gap-3 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={scrollLeft}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                title="Scroll Left"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                title="Scroll Right"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `,
          }}
        />

        {students.length > 4 ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {students.map((student) => (
              <div
                key={student.id || student._id}
                className="premium-card group flex flex-col justify-between w-[285px] sm:w-[320px] shrink-0 snap-start"
              >
                <div className="text-center">
                  <div className="relative mx-auto h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-indigo-500 shadow-md transition-transform duration-300 group-hover:scale-105">
                    <div className="h-full w-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900">
                      <img
                        src={
                          student.image ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                        }
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 rounded-full bg-amber-500 p-1.5 text-white shadow-md">
                      <Award size={14} />
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-slate-800 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {student.name}
                  </h3>

                  <p className="text-xs font-semibold text-slate-400 uppercase mt-1">
                    {student.subject}
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full w-fit mx-auto text-sm">
                    <Star
                      size={14}
                      className="fill-emerald-600 dark:fill-emerald-400"
                    />
                    <span>{student.percentage}% Score</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewProfile(student.id || student._id)}
                  className="relative z-10 mt-6 w-full rounded-xl bg-slate-50 border border-slate-200/50 py-2.5 text-sm font-bold text-slate-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-primary-600 dark:hover:text-white dark:hover:border-primary-600 transition-all duration-300 cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {students.map((student) => (
              <div
                key={student.id || student._id}
                className="premium-card group flex flex-col justify-between"
              >
                <div className="text-center">
                  <div className="relative mx-auto h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-indigo-500 shadow-md transition-transform duration-300 group-hover:scale-105">
                    <div className="h-full w-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900">
                      <img
                        src={
                          student.image ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                        }
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 rounded-full bg-amber-500 p-1.5 text-white shadow-md">
                      <Award size={14} />
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-slate-800 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {student.name}
                  </h3>

                  <p className="text-xs font-semibold text-slate-400 uppercase mt-1">
                    {student.subject}
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full w-fit mx-auto text-sm">
                    <Star
                      size={14}
                      className="fill-emerald-600 dark:fill-emerald-400"
                    />
                    <span>{student.percentage}% Score</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewProfile(student.id || student._id)}
                  className="relative z-10 mt-6 w-full rounded-xl bg-slate-50 border border-slate-200/50 py-2.5 text-sm font-bold text-slate-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-primary-600 dark:hover:text-white dark:hover:border-primary-600 transition-all duration-300 cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                setOpen(false);
                setSelectedStudent(null);
              }}
              className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="relative mx-auto h-32 w-32 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-indigo-500 shadow-lg">
                <div className="h-full w-full rounded-full overflow-hidden border-4 border-white dark:border-slate-900">
                  <img
                    src={
                      selectedStudent.image ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                    }
                    alt={selectedStudent.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {selectedStudent.name}
              </h2>

              <p className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mt-1">
                {selectedStudent.subject}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Calendar size={14} />
                  <span>BATCH</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {selectedStudent.batch || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Percent size={14} />
                  <span>PERCENTAGE</span>
                </div>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedStudent.percentage ||
                    (
                      (selectedStudent.gainMark / selectedStudent.totalMark) *
                      100
                    ).toFixed(2)}
                  %
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <BookOpen size={14} />
                  <span>TOTAL MARK</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {selectedStudent.totalMark}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Star size={14} />
                  <span>GAINED MARK</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {selectedStudent.gainMark}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
