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
      <div className="flex h-screen items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-screen items-center justify-center">
        Student Not Found
      </div>
    );
  }

  const percentage = calculatePercentage(student.gainMark, student.totalMark);

  const grade = calculateGrade(Number(percentage));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b p-8">
          <div>
            <h1 className="text-3xl font-bold">Student Details</h1>

            <p className="mt-2 text-gray-500">
              View Topper Student Information
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/topper-student"
              className="flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-gray-100"
            >
              <ArrowLeft size={18} />
              Back
            </Link>

            <Link
              href={`/admin/topper-student/edit/${student.id}`}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              <Pencil size={18} />
              Edit
            </Link>
          </div>
        </div>

        <div className="grid gap-10 p-10 md:grid-cols-3">
          {/* Image */}

          <div>
            <img
              src={
                student.image || "https://placehold.co/400x400?text=No+Image"
              }
              alt={student.name}
              className="h-80 w-full rounded-3xl border object-cover"
            />
          </div>

          {/* Details */}

          <div className="space-y-5 md:col-span-2">
            <InfoCard title="Student Name" value={student.name} />

            <InfoCard title="Subject" value={student.subject} />

            <InfoCard title="Batch" value={student.batch} />

            <InfoCard title="Total Mark" value={student.totalMark} />

            <InfoCard title="Gain Mark" value={student.gainMark} />

            <InfoCard title="Percentage" value={`${percentage}%`} />

            <InfoCard title="Grade" value={grade} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-gray-50 p-5">
      <span className="font-semibold text-gray-600">{title}</span>

      <span className="text-lg font-bold text-blue-600">{value}</span>
    </div>
  );
}
