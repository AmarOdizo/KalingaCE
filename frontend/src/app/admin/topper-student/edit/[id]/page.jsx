"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import StudentForm from "../../components/StudentForm";
import { getStudent, updateStudent } from "../../data";

export default function EditStudent() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await getStudent(id);
        setStudent(response.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load student.");
      } finally {
        setPageLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await updateStudent(id, formData);

      alert("Student Updated Successfully");
      router.push("/admin/topper-student");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-96 items-center justify-center transition-colors duration-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent dark:border-primary-400 dark:border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8 transition-colors duration-300">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Edit Topper Student</span>
          </h1>
          <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
            Update student mark sheets, images, and subjects.
          </p>
        </div>

        <Link
          href="/admin/topper-student"
          className="btn-secondary py-2.5 px-4 text-sm cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-premium dark:border-slate-800 dark:bg-slate-900/60">
        <StudentForm
          initialData={student}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
