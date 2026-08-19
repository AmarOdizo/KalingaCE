"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import {
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
  Star,
  GraduationCap,
  Award,
  BookOpen,
  MapPin,
  Sparkles,
  Laptop,
  CreditCard,
  X,
  ChevronRight,
} from "lucide-react";

import { getCourses, getCourseById } from "./courseData";
import Swal from "sweetalert2";

export default function AvailableCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  const swiperRef = useRef(null);

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

  // Format currency helper
  const formatFees = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Safe image fetch with fallback
  const getCourseImage = (img) => {
    if (!img || img.trim() === "") {
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";
    }
    return img;
  };

  // Colored badges based on status
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

  // Get color for mode badge
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

  // Get Lucide Icon for Mode
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

  // Custom Swiper controls handlers
  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
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

      // Clear form and modal state
      setEnrollData({
        name: "",
        email: "",
        phone: "",
      });
      setModalOpen(false);
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

  // Render Skeleton cards during loading state
  if (loading) {
    return (
      <section className="bg-slate-50 py-20 dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mb-3"></div>
              <div className="h-10 w-64 bg-slate-300 dark:bg-slate-700 animate-pulse rounded-lg"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"></div>
              <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"></div>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse"
              >
                <div className="relative h-52 w-full rounded-xl bg-slate-200 dark:bg-slate-800 mb-6"></div>
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
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950 transition-colors duration-300 border-t border-slate-100 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-5">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-500/10 px-3 py-1 rounded-full w-fit">
              Explore Programs
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl mt-3">
              📚 <span className="gradient-text">Available Courses</span>
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Kickstart your career with our premium, highly practical education
              programs designed to build real-world competency.
            </p>
          </div>

          {/* Navigation Controls & Status */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2.5">
              <button
                onClick={handlePrev}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 hover:scale-105 active:scale-95 text-slate-700 dark:text-slate-350 transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 hover:scale-105 active:scale-95 text-slate-700 dark:text-slate-350 transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper Slider or Empty State */}
        {courses.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            No courses available at the moment.
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={courses.length > 2}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={28}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="pb-6"
          >
            {courses.map((course) => (
              <SwiperSlide key={course.id || course._id} className="h-full">
                <div className="premium-card group flex flex-col justify-between h-[540px] overflow-hidden border border-slate-200/70 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60">
                  {/* Image & Floating Tags */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <Image
                      src={getCourseImage(course.image)}
                      alt={course.courseName}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                    {/* Floating Tags */}
                    <span
                      className={`absolute top-4 right-4 rounded-full px-3.5 py-1 text-xs font-bold shadow-md tracking-wide backdrop-blur-md ${getStatusColor(course.status)}`}
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

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Course Title */}
                      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {course.courseName}
                      </h3>

                      {/* Star Rating mockup */}
                      <div className="flex items-center gap-1 mt-2 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(course.rating || 4.7)
                                ? "fill-amber-500 text-amber-500"
                                : "text-slate-350 dark:text-slate-700"
                            }
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1.5">
                          {course.rating ||
                            (4.7 + (course.id % 4) * 0.1).toFixed(1)}{" "}
                          ({100 + (course.id % 5) * 45}+ reviews)
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="mt-3.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {course.shortDescription}
                      </p>

                      {/* Technologies pills */}
                      {course.technologies &&
                        course.technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {course.technologies
                              .slice(0, 3)
                              .map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                >
                                  {tech}
                                </span>
                              ))}
                            {course.technologies.length > 3 && (
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                +{course.technologies.length - 3} More
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Metadata & CTA */}
                    <div>
                      <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <Clock size={15} className="text-primary-500" />
                          {course.duration}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <Users size={15} className="text-indigo-500" />
                          {course.students
                            ? `${course.students.toLocaleString()}+`
                            : "1,000+"}{" "}
                          Enrolled
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            Course Fee
                          </span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            {formatFees(course.fees)}
                          </span>
                        </div>

                        <button
                          onClick={() => openDetails(course)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-md hover:from-primary-700 hover:to-indigo-700 transition hover:scale-[1.02] active:scale-95 hover:shadow-glow-blue cursor-pointer animate-fade-in"
                        >
                          Enquire Now
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Course Detail Modal */}
      {modalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 dark:bg-slate-950 dark:border-slate-800/80 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeDetails}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="space-y-6 text-slate-900 dark:text-slate-100">
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
                    onClick={closeDetails}
                    className="rounded-xl border border-slate-200 bg-white/50 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
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
    </section>
  );
}
