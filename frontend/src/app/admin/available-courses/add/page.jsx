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

      router.push("/available-courses");
    } catch (error) {
      console.error(error);

      alert(error.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add Course</h1>

          <p className="mt-1 text-gray-500">Create a new available course.</p>
        </div>

        <Link
          href="/available-courses"
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      {/* Form */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <CourseForm loading={loading} onSubmit={handleCreate} />
      </div>
    </div>
  );
}
