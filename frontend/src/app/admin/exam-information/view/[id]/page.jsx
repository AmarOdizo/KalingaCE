"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import { getExamInformationById } from "../../data";
import { formatBatch, formatDate } from "../../utils";
import StatusBadge from "../../components/StatusBadge";
import Loading from "../../components/Loading";

export default function ViewExamInformation() {
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadExam = useCallback(async () => {
    try {
      const data = await getExamInformationById(id);
      setExam(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  if (loading) {
    return <Loading />;
  }

  if (!exam) {
    return (
      <div className="mx-auto max-w-4xl p-6 md:p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-premium dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-bold text-rose-600">
            Exam Record Not Found
          </h2>
          <p className="mt-3 text-slate-550 dark:text-slate-400">
            The requested exam schedule does not exist.
          </p>
          <Link
            href="/admin/exam-information"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow hover:from-primary-700 hover:to-indigo-700 transition"
          >
            <ArrowLeft size={16} />
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8 transition-colors duration-300">
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 p-6 md:p-8 dark:border-slate-800/60 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              <span className="gradient-text">Exam Details</span>
            </h1>
            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
              Complete exam details, dates, venue, and status info.
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              href="/admin/exam-information"
              className="btn-secondary py-2.5 px-4 text-sm font-semibold flex-1 sm:flex-initial cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </Link>

            <Link
              href={`/admin/exam-information/edit/${exam.id}`}
              className="btn-primary py-2.5 px-4 text-sm font-semibold flex-1 sm:flex-initial cursor-pointer"
            >
              <Pencil size={16} />
              Edit
            </Link>
          </div>
        </div>

        <div className="grid gap-8 p-6 md:p-8 md:grid-cols-3">
          {/* Image */}
          <div>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm relative transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={exam.image || "/no-image.png"}
                alt={exam.examName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 md:col-span-2">
            <InfoRow title="Exam Name" value={exam.examName} />
            <InfoRow title="Course Name" value={exam.course} />
            <InfoRow title="Assigned Batch" value={formatBatch(exam.batch)} />
            <InfoRow title="Exam Date" value={formatDate(exam.examDate)} />
            <InfoRow title="Exam Time" value={exam.examTime} />
            <InfoRow title="Duration" value={exam.duration} />
            <InfoRow title="Venue" value={exam.venue} />
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4.5 dark:border-slate-800/40 dark:bg-slate-900/40 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20">
              <span className="font-semibold text-slate-550 dark:text-slate-400 text-sm">
                Status
              </span>
              <StatusBadge status={exam.status} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-slate-100 p-6 md:p-8 dark:border-slate-800/60">
          <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-white">
            Exam Guidelines & Description
          </h3>
          <p className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800/40 dark:bg-slate-900/40 text-slate-650 dark:text-slate-300 leading-relaxed text-sm">
            {exam.description || "No specific exam guidelines provided."}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ title, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4.5 dark:border-slate-800/40 dark:bg-slate-900/40 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20">
      <span className="font-semibold text-slate-550 dark:text-slate-400 text-sm">
        {title}
      </span>
      <span className="text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
