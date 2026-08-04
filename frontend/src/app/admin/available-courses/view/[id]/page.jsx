"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCourseById } from "../../data";
import CourseDetails from "../../components/CourseDetails";
import Loading from "../../components/Loading";

export default function ViewCoursePage() {
  const params = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(params.id);
        setCourse(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        <Loading />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-bold text-red-600">Course Not Found</h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            The requested course does not exist.
          </p>

          <Link
            href="/admin/available-courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow hover:from-primary-700 hover:to-indigo-700 transition"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Course Details
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View full syllabus, details, fee structures, and course metadata.
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

      {/* Course Details */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-premium dark:border-slate-800 dark:bg-slate-900/60">
        <CourseDetails course={course} />
      </div>
    </div>
  );
}
