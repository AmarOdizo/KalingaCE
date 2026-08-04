"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ExamForm from "../../components/ExamForm";
import { getExamInformationById, updateExamInformation } from "../../data";

export default function EditExamInformation() {
  const { id } = useParams();
  const router = useRouter();

  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadExam();
  }, []);

  const loadExam = async () => {
    try {
      const data = await getExamInformationById(id);
      setExamData(data);
    } catch (error) {
      console.log(error);
      alert("Failed to load exam information.");
    } finally {
      setPageLoading(false);
    }
  };

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

      const res = await updateExamInformation(id, payload);

      if (res.success) {
        alert("Exam Information Updated Successfully");
        router.push("/admin/exam-information");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold">Edit Exam Information</h1>

      <ExamForm
        initialData={examData}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
