"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { ArrowLeft } from "lucide-react";

import { getExamInformationById } from "../../data";
import { formatBatch, formatDate, getStatusColor } from "../../utils";
import StatusBadge from "../../components/StatusBadge";

export default function ViewExamInformation() {
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExam();
  }, []);

  const loadExam = async () => {
    try {
      const data = await getExamInformationById(id);
      setExam(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">Loading...</div>
    );
  }

  if (!exam) {
    return (
      <div className="flex h-64 items-center justify-center">
        Exam Information Not Found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow dark:bg-gray-900">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Exam Information</h1>

        <Link
          href="/admin/exam-information"
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex justify-center">
          <Image
            src={exam.image || "/no-image.png"}
            alt={exam.examName}
            width={350}
            height={250}
            className="rounded-xl object-cover"
          />
        </div>

        <div className="space-y-4">
          <div>
            <strong>Exam Name :</strong>
            <p>{exam.examName}</p>
          </div>

          <div>
            <strong>Course :</strong>
            <p>{exam.course}</p>
          </div>

          <div>
            <strong>Batch :</strong>
            <p>{formatBatch(exam.batch)}</p>
          </div>

          <div>
            <strong>Exam Date :</strong>
            <p>{formatDate(exam.examDate)}</p>
          </div>

          <div>
            <strong>Exam Time :</strong>
            <p>{exam.examTime}</p>
          </div>

          <div>
            <strong>Duration :</strong>
            <p>{exam.duration}</p>
          </div>

          <div>
            <strong>Venue :</strong>
            <p>{exam.venue}</p>
          </div>

          <div>
            <strong>Status :</strong>

            <div className="mt-2">
              <StatusBadge status={exam.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-2 text-lg font-semibold">Description</h3>

        <p className="rounded-lg border p-4">
          {exam.description || "No Description"}
        </p>
      </div>
    </div>
  );
}
