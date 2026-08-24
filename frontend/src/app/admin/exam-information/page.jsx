"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { getExamInformation, getMCQs, getSQAs } from "./data";
import { filterExamInformation } from "./utils";

import SearchFilter from "./components/SearchFilter";
import ExamTable from "./components/ExamTable";
import ExportCSV from "./components/ExportCSV";
import Loading from "./components/Loading";

export default function ExamInformationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExamInformationContent />
    </Suspense>
  );
}

function ExamInformationContent() {
  const [examData, setExamData] = useState([]);
  const [mcqData, setMcqData] = useState([]);
  const [sqaData, setSqaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const launchMCQ = searchParams ? searchParams.get("launchMCQ") : "";
  const courseId = searchParams ? searchParams.get("courseId") : "";

  const loadExamInformation = useCallback(async () => {
    try {
      setLoading(true);
      const [exams, mcqs, sqas] = await Promise.all([
        getExamInformation(),
        getMCQs().catch((err) => {
          console.error("Failed to load MCQs", err);
          return [];
        }),
        getSQAs().catch((err) => {
          console.error("Failed to load SQAs", err);
          return [];
        }),
      ]);
      setExamData(exams || []);
      setMcqData(mcqs || []);
      setSqaData(sqas || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      loadExamInformation();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadExamInformation, mounted]);

  // Auto-launch MCQ page if query param is set
  useEffect(() => {
    if (!mounted) return;
    if (launchMCQ === "true" && courseId && examData.length > 0) {
      const match = examData.find(
        (ex) => ex._id === courseId || ex.id === Number(courseId)
      );
      if (match) {
        router.push(`/admin/question-form?examId=${match._id || match.id}&launchCreate=true`);
      }
    }
  }, [launchMCQ, courseId, examData, router, mounted]);

  const filteredData = useMemo(() => {
    return filterExamInformation(examData, search);
  }, [examData, search]);

  if (!mounted || loading) {
    return <Loading />;
  }

  return (
    <div className="w-full p-6 md:p-8 transition-colors duration-300">
      <title>Exam Schedules | Admin Panel</title>
      
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Exam Information</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Publish, edit, and coordinate exam venues, schedules, and batch lists.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <ExportCSV exams={filteredData} />
          <Link
            href="/admin/exam-information/add"
            className="btn-primary py-2.5 px-5 text-sm"
          >
            <Plus size={18} />
            Add Exam
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchFilter search={search} setSearch={setSearch} />
      </div>

      {/* Table */}
      <div className="rounded-2xl">
        <ExamTable
          exams={filteredData}
          mcqs={mcqData}
          sqas={sqaData}
          refreshData={loadExamInformation}
        />
      </div>
    </div>
  );
}
