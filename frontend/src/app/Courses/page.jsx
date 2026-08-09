"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Clock,
  Users,
  MapPin,
  Laptop,
  Sparkles,
  CreditCard,
  GraduationCap,
  Award,
  BookOpen,
  X,
  ChevronRight,
  BookOpenCheck,
  Star,
} from "lucide-react";
import { getCourses } from "@/components/courseData";
import Image from "next/image";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setOpenModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getCourses();
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        (course.courseName?.toLowerCase() || "").includes(
          search.toLowerCase(),
        ) ||
        (course.courseCode?.toLowerCase() || "").includes(
          search.toLowerCase(),
        ) ||
        (course.shortDescription?.toLowerCase() || "").includes(
          search.toLowerCase(),
        );

      const matchMode = selectedMode === "All" || course.mode === selectedMode;
      const matchStatus =
        selectedStatus === "All" || course.status === selectedStatus;

      return matchSearch && matchMode && matchStatus;
    });
  }, [courses, search, selectedMode, selectedStatus]);

  // Helpers
  const formatFees = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCourseImage = (img) => {
    if (!img || img.trim() === "") {
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";
    }
    return img;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Admission Open":
        return "bg-emerald-500/90 text-white dark:bg-emerald-500/20 dark:text-emerald-400";
      case "Closed":
        return "bg-rose-500/90 text-white dark:bg-rose-500/20 dark:text-rose-450";
      case "Coming Soon":
        return "bg-amber-500/90 text-white dark:bg-amber-500/20 dark:text-amber-400";
      default:
        return "bg-slate-500/90 text-white dark:bg-slate-500/20 dark:text-slate-400";
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case "Online":
        return "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border border-sky-200/50 dark:border-sky-500/20";
      case "Offline":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20";
      case "Hybrid":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/20";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400";
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "Online":
        return <Laptop size={14} />;
      case "Offline":
        return <MapPin size={14} />;
      case "Hybrid":
        return <Sparkles size={14} />;
      default:
        return <Laptop size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 py-12 dark:from-slate-950 dark:to-slate-900/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-500/10 px-3.5 py-1.5 rounded-full">
            Kalinga Computer Education
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl mt-4">
            📚 Explore Our{" "}
            <span className="gradient-text">Available Courses</span>
          </h1>
          <p className="mt-4 text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Choose from a wide variety of certificate, diploma, and specialized
            courses designed to equip you with real-world skills and
            professional competency.
          </p>
        </div>

        {/* Filters and Search panel */}
        <div className="glass-panel mb-10 rounded-3xl p-6 shadow-premium border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by course name, code, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3.5 pl-12 pr-4 text-sm font-semibold outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-white dark:focus:border-primary-400 dark:focus:bg-slate-950"
              />
            </div>

            {/* Mode Select */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Mode:
              </span>
              <div className="flex rounded-xl bg-slate-100/80 p-1 dark:bg-slate-950/80 border border-slate-200/40 dark:border-slate-800">
                {["All", "Online", "Offline", "Hybrid"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedMode === mode
                        ? "bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-400"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Select */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Status:
              </span>
              <div className="flex rounded-xl bg-slate-100/80 p-1 dark:bg-slate-950/80 border border-slate-200/40 dark:border-slate-800">
                {["All", "Admission Open", "Coming Soon"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedStatus === status
                        ? "bg-white text-primary-600 shadow-sm dark:bg-slate-900 dark:text-primary-400"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse"
              >
                <div className="relative h-52 w-full rounded-2xl bg-slate-200 dark:bg-slate-800 mb-6"></div>
                <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
                <div className="h-7 w-3/4 bg-slate-300 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
                <div className="flex justify-between items-center mb-6">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-12 w-full bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800/80">
            No courses found matching your criteria.
          </div>
        ) : (
          /* Grid list of Courses */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id || course._id}
                className="premium-card group flex flex-col justify-between h-[520px] overflow-hidden border border-slate-200/70 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60"
              >
                {/* Cover Image & badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <Image
                    src={getCourseImage(course.image)}
                    alt={course.courseName}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-85" />

                  {/* Floating badge */}
                  <span
                    className={`absolute top-4 right-4 rounded-full px-3 py-1 text-[10px] font-bold shadow-md tracking-wide ${getStatusColor(course.status)}`}
                  >
                    {course.status}
                  </span>

                  {course.courseCode && (
                    <span className="absolute top-4 left-4 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-mono font-bold text-white shadow-sm backdrop-blur-md">
                      {course.courseCode}
                    </span>
                  )}

                  {course.mode && (
                    <span
                      className={`absolute bottom-3 left-4 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm flex items-center gap-1 backdrop-blur-md ${getModeColor(course.mode)}`}
                    >
                      {getModeIcon(course.mode)}
                      {course.mode}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {course.courseName}
                    </h3>

                    {/* Star Rating Mockup */}
                    <div className="flex items-center gap-1 mt-2 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < 4
                              ? "fill-amber-500 text-amber-500"
                              : "text-slate-300 dark:text-slate-700"
                          }
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1.5">
                        4.8 (80+ reviews)
                      </span>
                    </div>

                    <p className="mt-3.5 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {course.shortDescription}
                    </p>
                  </div>

                  <div>
                    {/* Specifications */}
                    <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Clock
                          size={15}
                          className="text-primary-500 dark:text-primary-400"
                        />
                        {course.duration}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Users
                          size={15}
                          className="text-indigo-500 dark:text-indigo-400"
                        />
                        {course.students
                          ? `${course.students.toLocaleString()}+`
                          : "500+"}{" "}
                        Enrolled
                      </div>
                    </div>

                    {/* Fees and Details Action */}
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                          Course Fee
                        </span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {formatFees(course.fees)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setOpenModal(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-md hover:from-primary-700 hover:to-indigo-700 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        View Details
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {modalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 dark:bg-slate-950 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            {/* Close Button */}
            <button
              onClick={() => {
                setOpenModal(false);
                setSelectedCourse(null);
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div className="mb-5 pr-8">
              <span
                className={`inline-flex rounded-full px-3.5 py-0.5 text-[10px] font-bold shadow-sm tracking-wide ${getStatusColor(selectedCourse.status)}`}
              >
                {selectedCourse.status}
              </span>
              <h3 className="mt-2 text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {selectedCourse.courseName}
              </h3>
              {selectedCourse.courseCode && (
                <p className="text-xs font-mono font-bold text-primary-500 mt-1 uppercase">
                  Course Code: {selectedCourse.courseCode}
                </p>
              )}
            </div>

            {/* Content Body */}
            <div className="space-y-6">
              {/* Cover Image */}
              <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950 shadow-inner">
                <Image
                  src={getCourseImage(selectedCourse.image)}
                  alt={selectedCourse.courseName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/40">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-1">
                    <Clock
                      size={14}
                      className="text-primary-500 dark:text-primary-400"
                    />
                    <span>Duration</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    {selectedCourse.duration}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/40">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-1">
                    <CreditCard
                      size={14}
                      className="text-indigo-500 dark:text-indigo-400"
                    />
                    <span>Course Fee</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    {formatFees(selectedCourse.fees)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/40">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-1">
                    <Laptop
                      size={14}
                      className="text-purple-500 dark:text-purple-400"
                    />
                    <span>Class Mode</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    {selectedCourse.mode || "Offline"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/40">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-1">
                    <GraduationCap
                      size={14}
                      className="text-emerald-500 dark:text-emerald-400"
                    />
                    <span>Eligibility</span>
                  </div>
                  <p
                    className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate"
                    title={selectedCourse.eligibility}
                  >
                    {selectedCourse.eligibility || "10th/12th Pass"}
                  </p>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <BookOpenCheck
                      size={16}
                      className="text-primary-500 dark:text-primary-400"
                    />
                    Course Overview
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedCourse.fullDescription ||
                      selectedCourse.shortDescription}
                  </p>
                </div>

                {/* Additional Info Cards */}
                <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {selectedCourse.trainer && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                        Expert Instructor
                      </span>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        {selectedCourse.trainer}
                      </span>
                    </div>
                  )}
                  {selectedCourse.batchTiming && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                        Batch Timings
                      </span>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        {selectedCourse.batchTiming}
                      </span>
                    </div>
                  )}
                  {selectedCourse.certificate && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                        Certification
                      </span>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        {selectedCourse.certificate}
                      </span>
                    </div>
                  )}
                  {selectedCourse.seats && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                        Available Seats
                      </span>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        {selectedCourse.seats} Seats left
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies Covered */}
              {selectedCourse.technologies &&
                selectedCourse.technologies.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                      Technologies & Tools Covered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 px-3 py-1.5 text-xs font-bold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Syllabus Outline */}
              {selectedCourse.syllabus &&
                selectedCourse.syllabus.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                      Syllabus Outline
                    </h4>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {selectedCourse.syllabus.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-900 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800">
                            {idx + 1}
                          </span>
                          <span className="font-semibold">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Actions */}
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-end gap-3.5">
              <button
                onClick={() => {
                  setOpenModal(false);
                  setSelectedCourse(null);
                }}
                className="rounded-xl border border-slate-200 bg-white/50 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>

              <Link
                href={`/contact?course=${encodeURIComponent(selectedCourse.courseName)}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:from-primary-700 hover:to-indigo-700 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Enquire Now
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
