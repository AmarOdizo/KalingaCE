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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <Loading />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <h2 className="text-2xl font-bold text-red-600">Course Not Found</h2>

          <p className="mt-3 text-gray-500">
            The requested course does not exist.
          </p>

          <Link
            href="/available-courses"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Details</h1>

          <p className="mt-2 text-gray-500">
            View complete course information.
          </p>
        </div>

        <Link
          href="/available-courses"
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      {/* Course Details */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <CourseDetails course={course} />
      </div>
    </div>
  );
}
