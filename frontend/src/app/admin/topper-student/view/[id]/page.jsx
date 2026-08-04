"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { getStudent } from "../../data";
import { calculatePercentage, calculateGrade } from "../../utils";

export default function ViewStudent() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await getStudent(id);
        setStudent(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center transition-colors duration-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent dark:border-primary-400 dark:border-t-transparent" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="mx-auto max-w-3xl p-6 md:p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-premium dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-bold text-rose-600">Student Not Found</h2>
          <p className="mt-3 text-slate-550 dark:text-slate-400">
            The requested student record does not exist.
          </p>
          <Link
            href="/admin/topper-student"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow hover:from-primary-700 hover:to-indigo-700 transition"
          >
            <ArrowLeft size={16} />
            Back to Toppers
          </Link>
        </div>
      </div>
    );
  }

  const percentage = calculatePercentage(student.gainMark, student.totalMark);
  const grade = calculateGrade(Number(percentage));

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8 transition-colors duration-300">
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900/60 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 p-6 md:p-8 dark:border-slate-800/60 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              <span className="gradient-text">Student Details</span>
            </h1>
            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
              View topper student details and academic marks.
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              href="/admin/topper-student"
              className="btn-secondary py-2.5 px-4 text-sm font-semibold flex-1 sm:flex-initial cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </Link>

            <Link
              href={`/admin/topper-student/edit/${student.id}`}
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
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm relative transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={
                  student.image || "https://placehold.co/400x400?text=No+Image"
                }
                alt={student.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 md:col-span-2">
            <InfoCard title="Student Name" value={student.name} />
            <InfoCard title="Subject / Course" value={student.subject} />
            <InfoCard title="Batch" value={student.batch} />
            <InfoCard title="Total Mark" value={student.totalMark} />
            <InfoCard title="Gained Mark" value={student.gainMark} />
            <InfoCard title="Percentage" value={`${percentage}%`} isScore />
            <InfoCard title="Grade" value={grade} isGrade gradeVal={grade} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, isScore, isGrade, gradeVal }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4.5 dark:border-slate-800/40 dark:bg-slate-900/40 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20">
      <span className="font-semibold text-slate-550 dark:text-slate-400 text-sm">{title}</span>

      {isScore ? (
        <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
          {value}
        </span>
      ) : isGrade ? (
        <span
          className={`rounded-full px-3.5 py-1 text-sm font-bold
          ${
            gradeVal === "A+"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
              : gradeVal === "A"
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : gradeVal === "B+"
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="text-sm font-bold text-slate-900 dark:text-white">{value}</span>
      )}
    </div>
  );
}
