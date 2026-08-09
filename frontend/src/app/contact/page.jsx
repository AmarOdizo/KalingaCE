"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import Swal from "sweetalert2";

const CONTACT_API = "http://localhost:5000/api/Contact";
const COURSE_API = "http://localhost:5000/api/Course";
const IMAGE_UPLOAD_API = "http://localhost:5000/api/Contact/upload";

export default function ContactPage() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    courseName: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ============================
  // GET COURSES
  // ============================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(COURSE_API, {
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch courses");
        }

        const loadedCourses = result.data || [];
        setCourses(loadedCourses);

        // Pre-select course from URL query param
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const courseQuery = params.get("course");
          if (courseQuery) {
            const matched = loadedCourses.find(
              (c) => c.courseName?.toLowerCase() === courseQuery.toLowerCase()
            );
            if (matched) {
              setFormData((prev) => ({
                ...prev,
                courseName: matched._id,
              }));
            }
          }
        }
      } catch (error) {
        console.error("Course Fetch Error:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // ============================
  // HANDLE INPUT
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // HANDLE IMAGE
  // ============================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  // ============================
  // SUBMIT
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter your Full Name.",
        icon: "warning",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    if (!formData.email.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter your Email Address.",
        icon: "warning",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    if (!formData.phone.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter your Phone Number.",
        icon: "warning",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    if (!formData.courseName) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a course you're interested in.",
        icon: "warning",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    try {
      setSubmitting(true);

      let imageUrl = "";

      // ============================
      // 1. UPLOAD IMAGE
      // ============================
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const imageRes = await fetch(IMAGE_UPLOAD_API, {
          method: "POST",
          body: imageFormData,
        });

        const imageResult = await imageRes.json();

        if (!imageRes.ok) {
          throw new Error(imageResult.message || "Image upload failed");
        }

        imageUrl = imageResult.data.url;
      }

      // ============================
      // 2. SAVE CONTACT
      // ============================
      const contactRes = await fetch(CONTACT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          image: imageUrl,
          courseName: formData.courseName,
        }),
      });

      const contactResult = await contactRes.json();

      if (!contactRes.ok) {
        throw new Error(contactResult.message || "Failed to save contact");
      }

      // ============================
      // SUCCESS
      // ============================
      Swal.fire({
        title: "Enquiry Submitted!",
        text: "Your contact information has been submitted successfully! We will get in touch with you shortly.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        image: "",
        courseName: "",
      });

      setImageFile(null);
      setImagePreview("");

      const fileInput = document.getElementById("contact-image");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Contact Submit Error:", error);

      Swal.fire({
        title: "Submission Error",
        text: error.message || "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 py-16 dark:from-slate-950 dark:to-slate-900/50 transition-colors duration-300">
      <div className="mx-auto max-w-xl px-4">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-primary-50 dark:bg-primary-500/10 px-4 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            Contact Us
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            📩 Get In <span className="gradient-text">Touch</span>
          </h1>

          <p className="mt-3 text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
            Fill in the form below and our team will contact you shortly.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-premium border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500 dark:text-slate-450 tracking-wider">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-3.5 pl-12 pr-4 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500 dark:text-slate-450 tracking-wider">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-3.5 pl-12 pr-4 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500 dark:text-slate-450 tracking-wider">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-3.5 pl-12 pr-4 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* COURSE */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500 dark:text-slate-450 tracking-wider">
                Select Course
              </label>

              <div className="relative">
                <BookOpen
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors"
                />

                <select
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  disabled={loadingCourses}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white/50 py-3.5 pl-12 pr-10 outline-none transition-all duration-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900 dark:focus:ring-primary-500/20 cursor-pointer"
                >
                  <option value="" className="dark:bg-slate-900 dark:text-slate-300">
                    {loadingCourses ? "Loading courses..." : "Select a course"}
                  </option>

                  {courses.map((course) => (
                    <option key={course._id} value={course._id} className="dark:bg-slate-900 dark:text-slate-350">
                      {course.courseName}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500 dark:text-slate-450 tracking-wider">
                Student Image (Optional)
              </label>

              <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-5 bg-white/30 dark:bg-slate-900/20">
                <div className="flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mb-4 h-24 w-24 rounded-full object-cover shadow-md border-2 border-white dark:border-slate-800"
                    />
                  ) : (
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
                      <ImageIcon size={28} />
                    </div>
                  )}

                  <label
                    htmlFor="contact-image"
                    className="cursor-pointer rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-primary-700 hover:to-indigo-700 transition hover:scale-[1.02] active:scale-95"
                  >
                    {imageFile ? "Change Image" : "Choose Image"}
                  </label>

                  <input
                    id="contact-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wide">
                    JPG, PNG or WEBP
                  </p>
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 px-6 font-bold text-sm text-white shadow-md hover:from-primary-700 hover:to-indigo-700 hover:shadow-glow-blue transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Contact
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
