"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api/Student"
    : "https://kalingace-4.onrender.com/api/Student";

export default function TopStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);

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

    const localStudent = students.find(
      (s) => String(s.id) === String(id) || String(s._id) === String(id),
    );

    if (localStudent) {
      setSelectedStudent(localStudent);
      setOpen(true);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/${id}`);
      if (res.data && res.data.data) {
        const student = res.data.data;
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
      <section className="bg-gradient-to-b from-white to-slate-100 py-16 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mb-3"></div>
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 animate-pulse rounded"></div>
          </div>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-premium dark:border-slate-800/80 dark:bg-slate-900/50 animate-pulse h-[360px] flex flex-col justify-between"
              >
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 mb-5"></div>
                  <div className="h-5 w-2/3 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                  <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (students.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-white to-slate-100/50 py-16 dark:from-slate-900 dark:to-slate-950 border-t border-slate-100 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/25 uppercase tracking-widest">
              Wall of Fame
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Meet our <span className="gradient-text">Top Students</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Meet our outstanding learners who achieved excellence and set
              academic milestones.
            </p>
          </div>

          <div className="flex gap-3 self-end sm:self-auto shrink-0">
            <button
              type="button"
              className="topper-swiper-prev flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white/85 text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-202 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
              title="Previous"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="topper-swiper-next flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white/85 text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-202 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
              title="Next"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Toppers Slider */}
        <div className="relative group/slider pb-8">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: ".topper-swiper-next",
              prevEl: ".topper-swiper-prev",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              480: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              850: {
                slidesPerView: 3,
              },
              1100: {
                slidesPerView: 4,
              },
            }}
            className="py-4"
          >
            {students.map((student) => (
              <SwiperSlide key={student.id || student._id} className="h-auto py-2">
                <div className="group/card flex flex-col justify-between h-[360px] p-6 overflow-hidden border border-slate-200/60 bg-gradient-to-b from-white to-white hover:from-white hover:to-indigo-50/10 dark:border-slate-800/60 dark:bg-slate-900/60 dark:hover:to-indigo-950/10 shadow-premium transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl rounded-3xl text-center">
                  <div>
                    {/* Topper Avatar */}
                    <div className="relative mx-auto h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-md transition-transform duration-500 group-hover/card:scale-105">
                      <div className="h-full w-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-850">
                        <img
                          src={
                            student.image ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                          }
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 rounded-full bg-amber-500 p-1.5 text-white shadow-md animate-bounce">
                        <Award size={13} />
                      </span>
                    </div>

                    {/* Name & Subject */}
                    <h3 className="mt-5 text-base font-extrabold text-slate-805 dark:text-white tracking-tight group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors duration-300 line-clamp-1">
                      {student.name}
                    </h3>

                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-1 line-clamp-1">
                      {student.subject || "Computer Course"}
                    </p>

                    {/* Percentage Score Badge */}
                    <div className="mt-4 flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1 rounded-full w-fit mx-auto text-xs shadow-2xs group-hover/card:scale-103 transition-transform duration-300">
                      <Star
                        size={12}
                        className="fill-emerald-600 dark:fill-emerald-400"
                      />
                      <span>{student.percentage}% Score</span>
                    </div>
                  </div>

                  {/* CTA Profile Link */}
                  <button
                    onClick={() => handleViewProfile(student.id || student._id)}
                    className="mt-6 w-full rounded-xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/50 hover:border-indigo-200/30 py-2.5 text-2xs font-extrabold text-slate-650 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750 dark:hover:text-indigo-400 transition-all duration-300 cursor-pointer shadow-2xs active:scale-95"
                  >
                    View Profile
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Profile Details Modal */}
      {open && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-premium border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                setOpen(false);
                setSelectedStudent(null);
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center">
              <div className="relative mx-auto h-32 w-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-md">
                <div className="h-full w-full rounded-full overflow-hidden border-4 border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800">
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

              <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedStudent.name}
              </h2>

              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-1">
                {selectedStudent.subject || "Computer Course"}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-200/30 dark:bg-slate-950/40 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Calendar size={13} className="text-indigo-600 dark:text-indigo-400" />
                  <span>BATCH</span>
                </div>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  {selectedStudent.batch || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-200/30 dark:bg-slate-950/40 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Percent size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>PERCENTAGE</span>
                </div>
                <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {selectedStudent.percentage}%
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-200/30 dark:bg-slate-950/40 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <BookOpen size={13} className="text-indigo-650 dark:text-indigo-400" />
                  <span>TOTAL MARK</span>
                </div>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  {selectedStudent.totalMark}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-200/30 dark:bg-slate-950/40 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-550 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>GAINED MARK</span>
                </div>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
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
