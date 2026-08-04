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

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      await updateCourse(params.id, formData);
      alert("Course updated successfully.");
      router.push("/admin/available-courses");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update course.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-96 items-center justify-center dark:bg-slate-950">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mb-4" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Edit Course
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Update course features, fee structures, and metadata.
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
