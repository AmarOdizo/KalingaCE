"use client";

import { useEffect, useState } from "react";

import { getExamInformation } from "./data";
import { filterExamInformation } from "./utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import SearchFilter from "./components/SearchFilter";
import ExamTable from "./components/ExamTable";
import ExportCSV from "./components/ExportCSV";

export default function ExamInformationPage() {
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadExamInformation = async () => {
    try {
      setLoading(true);

      const data = await getExamInformation();

      setExamData(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExamInformation();
  }, []);

  const filteredData = filterExamInformation(examData, search);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg font-semibold">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exam Information
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all exam information from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportCSV exams={filteredData} />

          <Link
            href="/admin/exam-information/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Exam
          </Link>
        </div>
      </div>

      {/* Search */}
      <SearchFilter search={search} setSearch={setSearch} />

      {/* Table */}
      <ExamTable exams={filteredData} refreshData={loadExamInformation} />
    </div>
  );
}
