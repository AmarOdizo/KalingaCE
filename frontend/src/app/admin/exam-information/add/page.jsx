"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import ExamForm from "../components/ExamForm";
import { createExamInformation } from "../data";

export default function AddExamInformation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData, submitAction = "save") => {
    try {
      setLoading(true);
      const payload = new FormData();

      payload.append("examName", formData.examName);
      payload.append("mode", formData.mode);
      payload.append("examDate", formData.examDate);
      payload.append("examTime", formData.examTime);
      payload.append("duration", formData.duration);
      payload.append("venue", formData.venue);
      payload.append("image", formData.image || "");
      payload.append("batch", formData.batch);

      const res = await createExamInformation(payload);

      if (res.success) {
        alert("Exam Information Added Successfully");
        if (submitAction === "mcq") {
          router.push(`/admin/mcq?examId=${res.data._id || res.data.id}&launchCreate=true`);
        } else {
          router.push("/admin/exam-information");
        }
      } else {
        alert(res.message || "Failed to create exam schedule.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8 transition-colors duration-300">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Add Exam Information</span>
          </h1>
          <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
            Create a new exam schedule.
          </p>
        </div>

        <Link
          href="/admin/exam-information"
          className="btn-secondary py-2.5 px-4 text-sm cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-premium dark:border-slate-800 dark:bg-slate-900/60">
        <ExamForm loading={loading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
