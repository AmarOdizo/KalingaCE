"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { getExamInformation } from "./data";
import { filterExamInformation } from "./utils";

import SearchFilter from "./components/SearchFilter";
import ExamTable from "./components/ExamTable";
import ExportCSV from "./components/ExportCSV";
import Loading from "./components/Loading";

export default function ExamInformationPage() {
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadExamInformation = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getExamInformation();
      setExamData(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExamInformation();
  }, [loadExamInformation]);

  const filteredData = useMemo(() => {
    return filterExamInformation(examData, search);
  }, [examData, search]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-8 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            <span className="gradient-text">Exam Information</span>
          </h1>
          <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
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
        <ExamTable exams={filteredData} refreshData={loadExamInformation} />
      </div>
    </div>
  );
}
