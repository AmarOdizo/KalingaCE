"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import StudentForm from "../components/StudentForm";
import { createStudent } from "../data";

export default function AddStudent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createStudent(formData);

      alert("Student Added Successfully");
      router.push("/admin/topper-student");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8 transition-colors duration-300">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Add Topper Student</span>
          </h1>
          <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
            Create a new student topper record.
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
        <StudentForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
