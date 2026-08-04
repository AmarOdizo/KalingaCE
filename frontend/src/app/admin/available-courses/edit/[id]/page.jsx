"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CourseForm from "../../components/CourseForm";
import { getCourseById, updateCourse } from "../../data";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const data = await getCourseById(params.id);
      setCourse(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load course.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);

      await updateCourse(params.id, formData);

      alert("Course updated successfully.");

      router.push("/available-courses");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update course.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Course</h1>

          <p className="mt-1 text-gray-500">Update course information.</p>
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
        {course && (
          <CourseForm
            initialData={course}
            loading={loading}
            onSubmit={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
