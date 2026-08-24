"use client";

import { useEffect, useState } from "react";
import { getExamInformation } from "./data";
import ExamCard from "./ExamCard";
import ExamModal from "./ExamModal";

export default function ExamInfoClient() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);

      const data = await getExamInformation();

      setExams(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExams();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Exam
        </h2>
        <div className="text-center">Loading Exam Portal...</div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Exam
        </h2>

        <div className="text-center">Loading...</div>
      </section>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold">Exam</h2>

        <p className="mt-3 text-gray-500">Latest upcoming examinations.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onView={() => setSelectedExam(exam)}
          />
        ))}
      </div>

      <ExamModal exam={selectedExam} onClose={() => setSelectedExam(null)} />
    </main>
  );
}
