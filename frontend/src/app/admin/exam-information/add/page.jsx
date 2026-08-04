"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ExamForm from "../components/ExamForm";
import { createExamInformation } from "../data";

export default function AddExamInformation() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("examName", formData.examName);
      payload.append("course", formData.course);
      payload.append("examDate", formData.examDate);
      payload.append("examTime", formData.examTime);
      payload.append("duration", formData.duration);
      payload.append("venue", formData.venue);
      payload.append("description", formData.description);
      payload.append("status", formData.status);

      formData.batch.forEach((item) => {
        payload.append("batch", item);
      });

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      } else {
        payload.append("image", formData.image);
      }

      const res = await createExamInformation(payload);

      if (res.success) {
        alert("Exam Information Added Successfully");
        router.push("/admin/exam-information");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold">Add Exam Information</h1>

      <ExamForm loading={loading} onSubmit={handleSubmit} />
    </div>
  );
}
