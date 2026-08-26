"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Clock,
  Star,
  MapPin,
  Sparkles,
  Laptop,
  X,
  ChevronRight
} from "lucide-react";

import { getCourses, getCourseById } from "./courseData";
import Swal from "sweetalert2";

export default function AvailableCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [enrollData, setEnrollData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [enrollMessage, setEnrollMessage] = useState({
    type: "",
    text: "",
  });

  async function fetchCourses() {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch (error) {
      console.log("API connection failed:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
        return "bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400";
      case "Closed":
        return "bg-rose-500 text-white dark:bg-rose-500/20 dark:text-rose-500";
      case "Coming Soon":
        return "bg-amber-500 text-white dark:bg-amber-500/20 dark:text-amber-400";
      default:
        return "bg-slate-500 text-white dark:bg-slate-500/20 dark:text-slate-400";
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case "Online":
        return "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border border-sky-200/30 dark:border-sky-500/20";
      case "Offline":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-500/20";
      case "Hybrid":
        return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200/30 dark:border-purple-500/20";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400";
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "Online":
        return <Laptop size={12} />;
      case "Offline":
        return <MapPin size={12} />;
      case "Hybrid":
        return <Sparkles size={12} />;
      default:
        return <Laptop size={12} />;
    }
  };

  const openDetails = async (course) => {
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
      setModalOpen(true);
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

  const closeDetails = () => {
    setSelectedCourse(null);
    setModalOpen(false);
    setEnrollMessage({ type: "", text: "" });
  };

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

      setEnrollData({
        name: "",
        email: "",
        phone: "",
      });
      setModalOpen(false);
      setSelectedCourse(null);
      setEnrollMessage({ type: "", text: "" });

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

  if (!mounted || loading) {
    return (
      <section className="bg-slate-50 py-20 dark:bg-slate-900 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-14">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mb-3"></div>
            <div className="h-10 w-64 bg-slate-300 dark:bg-slate-700 animate-pulse rounded-lg"></div>
          </div>
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
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-900 transition-colors duration-300 border-t border-slate-100 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-5">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl text-left space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/25 uppercase tracking-widest">
              Explore Programs
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Available <span className="gradient-text">Courses & Programs</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Kickstart your career with our premium, highly practical education programs designed to build real-world competency.
            </p>
          </div>
        </div>

        {/* Grid of Course Cards */}
        {courses.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            No courses available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-6">
            {courses.map((course) => {
              const ratingVal = course.rating || (4.7 + ((course.id || 0) % 4) * 0.1).toFixed(1);
              const reviewsVal = 100 + ((course.id || 0) % 5) * 45;

              return (
                <div key={course.id || course._id} className="h-full">
                  <div className="group flex flex-col justify-between h-[425px] overflow-hidden border border-slate-200/80 bg-white shadow-premium transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/60 rounded-2xl">
                    
                    {/* Image & Floating Tags */}
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                      <Image
                        src={getCourseImage(course.image)}
                        alt={course.courseName}
                        fill
                        sizes="(max-w-768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

                      {/* Floating Status Badges */}
                      <span
                        className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[9px] font-bold shadow-2xs tracking-wide backdrop-blur-md ${getStatusColor(course.status)}`}
                      >
                        {course.status}
                      </span>

                      {course.courseCode && (
                        <span className="absolute top-3 left-3 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white shadow-2xs backdrop-blur-md">
                          {course.courseCode}
                        </span>
                      )}

                      {course.mode && (
                        <span
                          className={`absolute bottom-2.5 left-3 rounded-full px-2.5 py-0.5 text-[9px] font-semibold shadow-2xs flex items-center gap-1.5 backdrop-blur-md ${getModeColor(course.mode)}`}
                        >
                          {getModeIcon(course.mode)}
                          {course.mode}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Course Title */}
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-1">
                          {course.courseName}
                        </h3>

                        {/* Star Rating Section */}
                        <div className="flex items-center gap-1 mt-1.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={
                                i < Math.floor(ratingVal)
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-slate-200 dark:text-slate-700"
                              }
                            />
                          ))}
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-1">
                            {ratingVal} ({reviewsVal}+ reviews)
                          </span>
                        </div>

                        {/* Description */}
                        <p className="mt-2.5 text-xs text-slate-550 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {course.shortDescription}
                        </p>

                        {/* Tech cover pills */}
                        {course.technologies && course.technologies.length > 0 && (
                          <div className="mt-3.5 flex flex-wrap gap-1">
                            {course.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400"
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

                      {/* Footer Specs & CTA */}
                      <div className="mt-4">
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-405 dark:text-slate-500">
                            <Clock size={12} className="text-indigo-650 dark:text-indigo-400" />
                            <span>{course.duration}</span>
                          </div>

                          <div className="text-xs">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mr-1.5">Fee:</span>
                            <span className="font-black text-slate-800 dark:text-white">
                              {formatFees(course.fees)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => openCourseDetails(course)}
                            className="flex-1 inline-flex items-center justify-center py-2 px-3 text-2xs font-extrabold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition duration-150 cursor-pointer shadow-2xs active:scale-97"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openDetails(course)}
                            className="flex-1 inline-flex items-center justify-center gap-0.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2 px-3 text-2xs font-extrabold text-white shadow-sm hover:from-indigo-700 hover:to-indigo-800 transition active:scale-95 cursor-pointer"
                          >
                            Enquire
                            <ChevronRight size={12} />
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

      {/* Course Enquiry Modal */}
      {modalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-premium border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={closeDetails}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Enquire for {selectedCourse.courseName}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Please fill in your details to submit your admission enquiry.
                </p>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={enrollData.name}
                    onChange={handleEnrollChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-3 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={enrollData.email}
                    onChange={handleEnrollChange}
                    placeholder="Enter your email address"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-3 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={enrollData.phone}
                    onChange={handleEnrollChange}
                    placeholder="Enter your phone number"
                    required
                    maxLength={10}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-3 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Selected Program
                  </label>
                  <input
                    type="text"
                    value={selectedCourse.courseName}
                    disabled
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-805 bg-slate-100/60 dark:bg-slate-950/50 p-3 text-xs text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>

                {enrollMessage.text && (
                  <div
                    className={`rounded-xl p-3 text-xs font-semibold flex items-center gap-2 ${
                      enrollMessage.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                        : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20"
                    }`}
                  >
                    {enrollMessage.text}
                  </div>
                )}

                {/* Form Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeDetails}
                    className="rounded-xl border border-slate-200 bg-white/50 px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={enrollLoading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 transition active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {enrollLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Enquiry
                        <ChevronRight size={14} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white p-6 md:p-8 shadow-premium border border-slate-200 dark:bg-slate-900 dark:border-slate-800/85 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={closeCourseDetails}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="space-y-6">
              
              {/* Header Image */}
              <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <Image
                  src={getCourseImage(selectedCourse.image)}
                  alt={selectedCourse.courseName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Title & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedCourse.courseName}
                  </h2>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1.5">
                    {selectedCourse.courseCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-3 py-1 text-2xs font-bold shadow-2xs ${getStatusColor(selectedCourse.status)}`}>
                    {selectedCourse.status}
                  </span>
                  {selectedCourse.mode && (
                    <span className={`rounded-full px-3 py-1 text-2xs font-bold shadow-2xs flex items-center gap-1.5 ${getModeColor(selectedCourse.mode)}`}>
                      {getModeIcon(selectedCourse.mode)}
                      {selectedCourse.mode}
                    </span>
                  )}
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/30">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-xs">{selectedCourse.duration || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/30">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Eligibility</p>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-xs">{selectedCourse.eligibility || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-905/30">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-405">Fees</p>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-xs">{formatFees(selectedCourse.fees)}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/30">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Trainer</p>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-xs">{selectedCourse.trainer || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/30">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Certificate</p>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-xs">{selectedCourse.certificate || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/30">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Batch Timing</p>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-xs">{selectedCourse.batchTiming || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/30">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Seats Available</p>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-xs">{selectedCourse.seats || "-"}</h4>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/30">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Rating</p>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 dark:text-white text-xs">{selectedCourse.rating ? `${Number(selectedCourse.rating).toFixed(1)} / 5` : "4.8 / 5"}</h4>
                </div>
              </div>

              {/* Description & Curriculums */}
              <div className="grid gap-6 md:grid-cols-2 pt-2">
                <div className="space-y-4">
                  {selectedCourse.shortDescription && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-indigo-600 dark:border-indigo-500 pl-2">
                        Overview
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-550 dark:text-slate-400">{selectedCourse.shortDescription}</p>
                    </div>
                  )}
                  {selectedCourse.fullDescription && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-indigo-600 dark:border-indigo-500 pl-2">
                        Details
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-550 dark:text-slate-400 whitespace-pre-line">{selectedCourse.fullDescription}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Technologies */}
                  {selectedCourse.technologies && selectedCourse.technologies.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-indigo-600 dark:border-indigo-500 pl-2">
                        Technologies Covered
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedCourse.technologies.map((tech, idx) => (
                          <span key={idx} className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {selectedCourse.features && selectedCourse.features.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-indigo-600 dark:border-indigo-500 pl-2">
                        Key Features
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedCourse.features.map((feature, idx) => (
                          <span key={idx} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Syllabus */}
                  {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-4 border-indigo-600 dark:border-indigo-500 pl-2">
                        Syllabus Topics
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedCourse.syllabus.map((topic, idx) => (
                          <span key={idx} className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/20 dark:border-indigo-900/10">
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
                  className="rounded-xl border border-slate-200 bg-white/50 px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-55 dark:border-slate-850 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
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
                      setModalOpen(true);
                    }, 100);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 transition active:scale-95 cursor-pointer"
                >
                  Enquire Now
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
