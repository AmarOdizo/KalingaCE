"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Clock,
  Users,
  MapPin,
  Laptop,
  Sparkles,
  X,
  ChevronRight,
  Star,
} from "lucide-react";
import { getCourses, getCourseById } from "@/components/courseData";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CoursesClient() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setOpenModal] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollData, setEnrollData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [enrollMessage, setEnrollMessage] = useState({
    type: "",
    text: "",
  });

  const handleEnrollChange = (e) => {
    const { name, value } = e.target;
    setEnrollData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setEnrollLoading(true);
    setEnrollMessage({ type: "", text: "" });

    try {
      const res = await fetch("https://kalingace-4.onrender.com/api/EnrolledStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: enrollData.name,
          email: enrollData.email,
          phone: enrollData.phone,
          courseName: selectedCourse._id || selectedCourse.id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to submit enrollment");
      }

      // Clear form and modal state
      setEnrollData({
        name: "",
        email: "",
        phone: "",
      });
      setOpenModal(false);
      setSelectedCourse(null);
      setEnrollMessage({ type: "", text: "" });

      // Open SweetAlert success popup
      Swal.fire({
        title: "Enquiry Submitted!",
        text: "Your enquiry details have been saved successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#4f46e5",
        background: "#ffffff",
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-xl px-6 py-3 font-bold"
        }
      }).then(() => {
        window.location.href = "/";
      });
    } catch (err) {
      console.error("Enrollment error:", err);
      Swal.fire({
        title: "Submission Failed",
        text: err.message || "Failed to submit enrollment. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        background: "#ffffff",
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-xl px-6 py-3 font-bold"
        }
      });
    } finally {
      setEnrollLoading(false);
    }
  };

  const openCourseDetails = async (course) => {
    if (!course) return;

    try {
      const id = course.id || course._id;
      const courseData = await getCourseById(id);
      if (courseData) {
        setSelectedCourse(courseData);
      } else {
        setSelectedCourse(course);
      }
    } catch (error) {
      console.log("Failed to fetch course details, using client state:", error);
      setSelectedCourse(course);
    } finally {
      setDetailsModalOpen(true);
    }
  };

  const closeCourseDetails = () => {
    setSelectedCourse(null);
    setDetailsModalOpen(false);
  };

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
      if (!course) return false;
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
    const num = Number(amount);
    if (isNaN(num) || num <= 0) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getCourseImage = (img) => {
    if (!img || typeof img !== "string" || img.trim() === "") {
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";
    }
    return img;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Admission Open":
        return "bg-emerald-500/90 text-white dark:bg-emerald-500/20 dark:text-emerald-400";
      case "Closed":
        return "bg-rose-500/90 text-white dark:bg-rose-500/20 dark:text-rose-400";
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

  // Generate Course Schema (ItemList) for SEO
  const courseSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Computer & Technical Courses | Kalinga Computer Education",
    "description": "Explore our wide range of computer courses including DCA, PGDCA, Python, Java, Tally, Web Development, and AI.",
    "url": "https://kalingacomputer.com/courses",
    "itemListElement": (courses || []).map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.courseName || "Computer Course",
        "description": course.shortDescription || "Computer education course",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Kalinga Computer Education",
          "sameAs": "https://kalingacomputer.com"
        }
      }
    }))
  }), [courses]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 py-12 dark:from-slate-950 dark:to-slate-900/50 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-500/10 px-3.5 py-1.5 rounded-full">
            Kalinga Computer Education
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl mt-4">
            Explore Our{" "}
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
                id="course-search-input"
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
                    id={`mode-filter-${mode.toLowerCase()}`}
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
                    id={`status-filter-${status.replace(/\s+/g, "-").toLowerCase()}`}
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
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse h-[425px] flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full rounded-xl bg-slate-200 dark:bg-slate-800 mb-4"></div>
                  <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                  <div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-700 rounded mb-3"></div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded mb-1.5"></div>
                  <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-9 flex-1 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
                  </div>
                </div>
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
            {filteredCourses.map((course, index) => {
              const ratingVal = course.rating || (4.7 + ((course.id || 0) % 4) * 0.1).toFixed(1);
              const reviewsVal = 100 + ((course.id || 0) % 5) * 45;

              return (
                <div key={course.id || course._id || index} className="h-full">
                  <div className="group/card flex flex-col justify-between h-[470px] overflow-hidden border border-slate-200/60 bg-gradient-to-b from-white to-white hover:from-white hover:to-indigo-50/10 dark:border-slate-800/60 dark:bg-slate-900/60 dark:hover:to-indigo-950/10 shadow-premium transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl rounded-3xl">
                    {/* Cover Image & badges */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                      <Image
                        src={getCourseImage(course.image)}
                        alt={course.courseName || "Course Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-108"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-85 transition-opacity duration-500 group-hover/card:opacity-90" />

                      {/* Floating badge */}
                      <span
                        className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[9px] font-bold shadow-2xs tracking-wide backdrop-blur-md transition-transform duration-300 group-hover/card:scale-103 ${getStatusColor(course.status)}`}
                      >
                        {course.status}
                      </span>

                      {course.courseCode && (
                        <span className="absolute top-3 left-3 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white shadow-2xs backdrop-blur-md transition-transform duration-300 group-hover/card:scale-103">
                          {course.courseCode}
                        </span>
                      )}

                      {course.mode && (
                        <span
                          className={`absolute bottom-2.5 left-3 rounded-full px-2.5 py-0.5 text-[9px] font-semibold shadow-2xs flex items-center gap-1.5 backdrop-blur-md transition-transform duration-300 group-hover/card:scale-103 ${getModeColor(course.mode)}`}
                        >
                          {getModeIcon(course.mode)}
                          {course.mode}
                        </span>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-5.5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-snug group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors duration-300 line-clamp-1">
                          {course.courseName || "Untitled Course"}
                        </h3>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mt-1.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={
                                i < Math.floor(ratingVal)
                                  ? "fill-amber-500 text-amber-500 transition-transform duration-300 group-hover/card:scale-110"
                                  : "text-slate-200 dark:text-slate-700"
                              }
                            />
                          ))}
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-1">
                            {ratingVal} ({reviewsVal}+ reviews)
                          </span>
                        </div>

                        {/* Description */}
                        <p className="mt-2.5 text-xs text-slate-555 dark:text-slate-455 line-clamp-2 leading-relaxed">
                          {course.shortDescription}
                        </p>

                        {/* Tech cover pills */}
                        {course.technologies && course.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {course.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-slate-100 hover:bg-indigo-50/50 hover:text-indigo-650 dark:bg-slate-800 dark:hover:bg-slate-750 dark:hover:text-indigo-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400 transition-colors duration-300"
                              >
                                {tech}
                              </span>
                            ))}
                            {course.technologies.length > 3 && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                +{course.technologies.length - 3} More
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Specifications & CTA */}
                      <div className="mt-4">
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-405 dark:text-slate-550">
                            <Clock
                              size={12}
                              className="text-indigo-650 dark:text-indigo-400 group-hover/card:animate-pulse"
                            />
                            <span>{course.duration || "N/A"}</span>
                          </div>

                          <div className="text-xs">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mr-1.5">Fee:</span>
                            <span className="font-black text-slate-800 dark:text-white text-sm">
                              {formatFees(course.fees)}
                            </span>
                          </div>
                        </div>

                        {/* Side-by-side Actions */}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => openCourseDetails(course)}
                            className="flex-1 inline-flex items-center justify-center py-2 px-3 text-2xs font-extrabold text-slate-650 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 dark:border-slate-700 hover:text-indigo-655 dark:hover:text-indigo-400 rounded-xl transition duration-300 cursor-pointer shadow-2xs active:scale-97"
                          >
                            View Details
                          </button>
                          <button
                            id={`enquire-btn-${course.courseCode || index}`}
                            onClick={() => {
                              setSelectedCourse(course);
                              setOpenModal(true);
                            }}
                            className="group/enquire flex-1 inline-flex items-center justify-center gap-0.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-650 py-2 px-3 text-2xs font-extrabold text-white shadow-sm hover:shadow-[0_4px_12px_rgba(79,70,229,0.3)] dark:hover:shadow-[0_4px_12px_rgba(79,70,229,0.15)] hover:scale-[1.01] transition-all duration-300 active:scale-95 cursor-pointer"
                          >
                            Enquire
                            <ChevronRight size={12} className="group-hover/enquire:translate-x-0.5 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {modalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 dark:bg-slate-950 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            {/* Close Button */}
            <button
              onClick={() => {
                setOpenModal(false);
                setSelectedCourse(null);
                setEnrollMessage({ type: "", text: "" });
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Enquire for {selectedCourse.courseName}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Please fill in your details to submit your enquiry.
                </p>
              </div>
              
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="enquiry-name"
                    name="name"
                    value={enrollData.name}
                    onChange={handleEnrollChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="enquiry-email"
                    name="email"
                    value={enrollData.email}
                    onChange={handleEnrollChange}
                    placeholder="Enter your email address"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="enquiry-phone"
                    name="phone"
                    value={enrollData.phone}
                    onChange={handleEnrollChange}
                    placeholder="Enter your phone number"
                    required
                    maxLength={10}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Selected Course Field */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Selected Course
                  </label>
                  <input
                    type="text"
                    id="enquiry-course"
                    value={selectedCourse.courseName}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 p-3 text-sm text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>

                {/* Message feedback */}
                {enrollMessage.text && (
                  <div
                    className={`rounded-xl p-3.5 text-sm font-semibold flex items-center gap-2 ${
                      enrollMessage.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                    }`}
                  >
                    {enrollMessage.text}
                  </div>
                )}

                {/* Form Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    id="enquiry-cancel-btn"
                    onClick={() => {
                      setOpenModal(false);
                      setSelectedCourse(null);
                      setEnrollMessage({ type: "", text: "" });
                    }}
                    className="rounded-xl border border-slate-200 bg-white/50 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    id="enquiry-submit-btn"
                    disabled={enrollLoading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:from-primary-700 hover:to-indigo-700 transition hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrollLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit
                        <ChevronRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Course Specification Modal */}
      {detailsModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 dark:bg-slate-950 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeCourseDetails}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="space-y-6 text-slate-900 dark:text-slate-100">
              {/* Header Image */}
              <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Image
                  src={getCourseImage(selectedCourse.image)}
                  alt={selectedCourse.courseName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Title & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/40 pb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {selectedCourse.courseName}
                  </h2>
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
                    {selectedCourse.courseCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${getStatusColor(selectedCourse.status)}`}>
                    {selectedCourse.status}
                  </span>
                  {selectedCourse.mode && (
                    <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm flex items-center gap-1 ${getModeColor(selectedCourse.mode)}`}>
                      {getModeIcon(selectedCourse.mode)}
                      {selectedCourse.mode}
                    </span>
                  )}
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
                  <h4 className="mt-1 font-extrabold text-slate-850 dark:text-white text-xs">{selectedCourse.duration || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eligibility</p>
                  <h4 className="mt-1 font-extrabold text-slate-850 dark:text-white text-xs">{selectedCourse.eligibility || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fees</p>
                  <h4 className="mt-1 font-extrabold text-slate-855 dark:text-white text-xs">{formatFees(selectedCourse.fees)}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trainer</p>
                  <h4 className="mt-1 font-extrabold text-slate-850 dark:text-white text-xs">{selectedCourse.trainer || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Certificate</p>
                  <h4 className="mt-1 font-extrabold text-slate-850 dark:text-white text-xs">{selectedCourse.certificate || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Batch Timing</p>
                  <h4 className="mt-1 font-extrabold text-slate-850 dark:text-white text-xs">{selectedCourse.batchTiming || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Seats Available</p>
                  <h4 className="mt-1 font-extrabold text-slate-850 dark:text-white text-xs">{selectedCourse.seats || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rating</p>
                  <h4 className="mt-1 font-extrabold text-slate-850 dark:text-white text-xs">{selectedCourse.rating ? `${Number(selectedCourse.rating).toFixed(1)} / 5` : "4.8 / 5"}</h4>
                </div>
              </div>

              {/* Description & Curriculums */}
              <div className="grid gap-6 md:grid-cols-2 pt-2">
                <div className="space-y-4">
                  {selectedCourse.shortDescription && (
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white border-l-4 border-primary-500 pl-2">
                        Overview
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-350">{selectedCourse.shortDescription}</p>
                    </div>
                  )}
                  {selectedCourse.fullDescription && (
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white border-l-4 border-primary-500 pl-2">
                        Details
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-355 whitespace-pre-line">{selectedCourse.fullDescription}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Technologies */}
                  {selectedCourse.technologies && selectedCourse.technologies.length > 0 && (
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white border-l-4 border-primary-500 pl-2">
                        Technologies Covered
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedCourse.technologies.map((tech, idx) => (
                          <span key={idx} className="rounded-lg bg-primary-50 px-2 py-1 text-[10px] font-bold uppercase text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {selectedCourse.features && selectedCourse.features.length > 0 && (
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white border-l-4 border-primary-500 pl-2">
                        Key Features
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedCourse.features.map((feature, idx) => (
                          <span key={idx} className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Syllabus */}
                  {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white border-l-4 border-primary-500 pl-2">
                        Syllabus Topics
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedCourse.syllabus.map((topic, idx) => (
                          <span key={idx} className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions inside details modal */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCourseDetails}
                  className="rounded-xl border border-slate-200 bg-white/50 px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const temp = selectedCourse;
                    closeCourseDetails();
                    setTimeout(() => {
                      setSelectedCourse(temp);
                      setOpenModal(true);
                    }, 100);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:from-primary-700 hover:to-indigo-700 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Enquire Now
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
