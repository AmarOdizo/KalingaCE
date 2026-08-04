"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CourseForm from "../components/CourseForm";
import { createCourse } from "../data";

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      await createCourse(formData);
      alert("Course added successfully.");
      router.push("/admin/available-courses");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Add Course
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create a new student course offering.
          </p>
        </div>

        <Link
          href="/admin/available-courses"
          className="btn-secondary"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-premium dark:border-slate-800 dark:bg-slate-900/60">
        <CourseForm loading={loading} onSubmit={handleCreate} />
      </div>
    </div>
  );
}
